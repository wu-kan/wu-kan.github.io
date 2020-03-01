---
title: 用Shuffle加速CUDA上的Reduce操作
tags:
  - 高性能计算
---

## 简介

显卡上的规约操作是一个经典优化案例。在网上能找到的大部分实现中，性能比较优秀的是使用 Shared Memory 并进行访存优化的树形规约。

近期正好在做这方面的一些优化，同时了解到从 CUDA 9.0 开始，CUDA 引入了更加灵活的 Warp 操作原语，这一方面使得 CUDA 编程更加简单，一方面也使得一些原有的功能发生了一些改变。本文重点对 Warp 和 Shared Memory 两种方法实现的并行规约操作进行性能对比。

## 实验环境

使用 v100 集群上一个结点的单张 v100 运行。

```bash
$ nvdia-smi
Mon Dec  2 08:38:49 2019
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 410.48                 Driver Version: 410.48                    |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|===============================+======================+======================|
|   0  Tesla V100-PCIE...  On   | 00000000:3B:00.0 Off |                    0 |
| N/A   30C    P0    24W / 250W |      0MiB / 16130MiB |      0%      Default |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                       GPU Memory |
|  GPU       PID   Type   Process name                             Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
```

## 实验过程与分析

### 记号与假设

- `FULL_MASK`是一个 32 位的默认掩码，在 Warp 规约时使用。
- `WARP_SIZE`是单个 WARP 下的线程数。
- `BLOCK_SIZE`是单个 BLOCK 下的线程数。经过调整，选择了单张 v100 能够开启的最大线程数`1024`。经测试，在这个`BLOCK_SIZE`下代码的性能最优。
- `n`是被规约元素的数量。为简化问题，这里假设`n`同时是`WARP_SIZE`和`BLOCK_SIZE`的幂。
- `src_d`指向被规约元素的首地址，元素数量为`n`。这里被规约元素类型选择了`unsigned`类型，这样避免浮点数误差，方便判断运行结果的正确与否。
- `dst_d`指向规约结果的地址，同时为了给多级规约提供缓存 Buffer，这里规定`dst_d`的可用空间大小应该和`src_d`相当。

```cpp
#define FULL_MASK 0xffffffff
#define WARP_SIZE 32
#define BLOCK_SIZE 1024
const size_t
	n = 1 << 30;
unsigned
	*src_d,
	*dst_d;
cudaMalloc(
	(void **)&src_d,
	n * sizeof(*src_d));
cudaMalloc(
	(void **)&dst_d,
	n * sizeof(*dst_d));
```

### 使用 Shared Memory

虽然不是文章重点，但我还是觉得有必要复习一下 Shared Memory 上进行 Reduce 的一些 Trick 操作。

- 使用`template`这是为了让接下来的循环`for (size_t offset = reduce_size >> 1; offset > 0; offset >>= 1)`可以被编译器自动展开优化。
- 对 reduce 过程中的访存进行优化：`if (reduce_id < offset) shared[reduce_id] += shared[reduce_id ^ offset];`，这里访存的时候相邻线程访问相邻的地址，也没有 conflict。（访存的原理图和下面 Warp 的那张很类似，这里就不放出了）
- 主机代码通过多次启动核函数实现多级 Reduce。
- 官方的代码还有一些比较给劲的优化策略（见文末的参考），如 Completely Unrolled、Multiple Adds。但是这些策略都比较暴力，且不是本文重点，不方便和 Warp 进行比较，我这里就没有做了。

```cpp
template <size_t reduce_size>
void __global__ reduce_shared_kernel(
	const unsigned *src_d,
	unsigned *dst_d,
	const size_t n)
{
	extern unsigned __shared__ shared[];
	const size_t
		global_id = threadIdx.x + blockDim.x * blockIdx.x,
		reduce_id = global_id % reduce_size;
	shared[reduce_id] = src_d[global_id];
	for (size_t offset = reduce_size >> 1; offset > 0; offset >>= 1)
	{
		__syncthreads();
		if (reduce_id < offset)
			shared[reduce_id] += shared[reduce_id ^ offset];
	}
	if (reduce_id == 0)
		dst_d[global_id / reduce_size] = shared[reduce_id];
}
void reduce_shared(
	const unsigned *src_d,
	unsigned *dst_d,
	const size_t n)
{
	const unsigned *src = src_d;
	unsigned *dst = dst_d;
	for (size_t len = n; len > 1; len = (len + BLOCK_SIZE - 1) / BLOCK_SIZE)
		dst += (len + BLOCK_SIZE - 1) / BLOCK_SIZE;
	for (size_t len = n; len > 1; len = (len + BLOCK_SIZE - 1) / BLOCK_SIZE)
	{
		dst -= (len + BLOCK_SIZE - 1) / BLOCK_SIZE;
		reduce_shared_kernel<BLOCK_SIZE><<<
			len / BLOCK_SIZE,
			BLOCK_SIZE,
			BLOCK_SIZE * sizeof(unsigned)>>>(
			src,
			dst,
			len);
		src = dst;
	}
	cudaDeviceSynchronize();
}
```

运行时间为`14.444064ms`。

### 使用 Warp

Warp 级别的操作原语（Warp-level Primitives）通过 shuffle 指令，允许 thread 直接读其他 thread 的寄存器值，只要两个 thread 在同一个 warp 中，这种比通过 shared Memory 进行 thread 间的通讯效果更好，latency 更低，同时也不消耗额外的内存资源来执行数据交换。可以看到，和使用 Shared Memory 的代码长得非常相似，只是`reduce_size`由`BLOCK_SIZE`换成了`WARP_SIZE`。

![Part of a warp-level parallel reduction using shfl_down_sync().](https://devblogs.nvidia.com/wp-content/uploads/2018/01/reduce_shfl_down.png)

此外，我用`__shfl_xor_sync`而不是`__shfl_down_sync`，这样实现的不仅仅是树形规约，还是一个蝶形规约！并且通信步数并没有增加~

```cpp
template <size_t reduce_size>
void __global__ reduce_warp_kernel(
	const unsigned *src_d,
	unsigned *dst_d,
	size_t n)
{
	const size_t
		global_id = threadIdx.x + blockDim.x * blockIdx.x,
		reduce_id = global_id % reduce_size;
	unsigned
		val = global_id < n ? src_d[global_id] : 0;
	for (size_t offset = reduce_size >> 1; offset > 0; offset >>= 1)
		val += __shfl_xor_sync(FULL_MASK, val, offset, reduce_size);
	if (reduce_id == 0)
		dst_d[global_id / reduce_size] = val;
}
void reduce_warp(
	const unsigned *src_d,
	unsigned *dst_d,
	size_t n)
{
	const unsigned *src = src_d;
	unsigned *dst = dst_d;
	for (size_t len = n; len > 1; len = (len + WARP_SIZE - 1) / WARP_SIZE)
		dst += (len + WARP_SIZE - 1) / WARP_SIZE;
	for (size_t len = n; len > 1; len = (len + WARP_SIZE - 1) / WARP_SIZE)
	{
		dst -= (len + WARP_SIZE - 1) / WARP_SIZE;
		reduce_warp_kernel<WARP_SIZE><<<
			len / BLOCK_SIZE,
			BLOCK_SIZE>>>(
			src,
			dst,
			len);
		src = dst;
	}
	cudaDeviceSynchronize();
}
```

运行时间达到了`7.260896ms`，轻松提高了将近一倍的计算性能！同时也不难发现，使用 Warp 操作原语的代码更简洁，同时也移除了对 Shared Memory 的依赖，可以说是非常棒了！

## 源代码与运行结果

```cpp
#include <stdio.h>
#include <cuda_runtime.h>
#define FULL_MASK 0xffffffff
#define WARP_SIZE 32
#define BLOCK_SIZE 1024
template <size_t reduce_size>
void __global__ reduce_shared_kernel(
	const unsigned *src_d,
	unsigned *dst_d,
	const size_t n)
{
	extern unsigned __shared__ shared[];
	const size_t
		global_id = threadIdx.x + blockDim.x * blockIdx.x,
		reduce_id = global_id % reduce_size;
	shared[reduce_id] = src_d[global_id];
	for (size_t offset = reduce_size >> 1; offset > 0; offset >>= 1)
	{
		__syncthreads();
		if (reduce_id < offset)
			shared[reduce_id] += shared[reduce_id ^ offset];
	}
	if (reduce_id == 0)
		dst_d[global_id / reduce_size] = shared[reduce_id];
}
void reduce_shared(
	const unsigned *src_d,
	unsigned *dst_d,
	const size_t n)
{
	const unsigned *src = src_d;
	unsigned *dst = dst_d;
	for (size_t len = n; len > 1; len /= BLOCK_SIZE)
		dst += len / BLOCK_SIZE;
	for (size_t len = n; len > 1; len /= BLOCK_SIZE)
	{
		dst -= len / BLOCK_SIZE;
		reduce_shared_kernel<BLOCK_SIZE><<<
			len / BLOCK_SIZE,
			BLOCK_SIZE,
			BLOCK_SIZE * sizeof(unsigned)>>>(
			src,
			dst,
			len);
		src = dst;
	}
	cudaDeviceSynchronize();
}
template <size_t reduce_size>
void __global__ reduce_warp_kernel(
	const unsigned *src_d,
	unsigned *dst_d,
	size_t n)
{
	const size_t
		global_id = threadIdx.x + blockDim.x * blockIdx.x,
		reduce_id = global_id % reduce_size;
	unsigned
		val = global_id < n ? src_d[global_id] : 0;
	for (size_t offset = reduce_size >> 1; offset > 0; offset >>= 1)
		val += __shfl_xor_sync(FULL_MASK, val, offset, reduce_size);
	if (reduce_id == 0)
		dst_d[global_id / reduce_size] = val;
}
void reduce_warp(
	const unsigned *src_d,
	unsigned *dst_d,
	size_t n)
{
	const unsigned *src = src_d;
	unsigned *dst = dst_d;
	for (size_t len = n; len > 1; len /= WARP_SIZE)
		dst += len / WARP_SIZE;
	for (size_t len = n; len > 1; len /= WARP_SIZE)
	{
		dst -= len / WARP_SIZE;
		reduce_warp_kernel<WARP_SIZE><<<
			len / BLOCK_SIZE,
			BLOCK_SIZE>>>(
			src,
			dst,
			len);
		src = dst;
	}
	cudaDeviceSynchronize();
}
unsigned msws()
{
	static unsigned long long x = 0, w = 0;
	return x *= x, x += w += 0xb5ad4eceda1ce2a9, x = x >> 32 | x << 32;
}
int main()
{
	const size_t
		n = 1 << 30;
	unsigned
		*src_h,
		*src_d,
		*dst_d,
		sum = 0;
	cudaHostAlloc(
		(void **)&src_h,
		n * sizeof(*src_h),
		cudaHostAllocWriteCombined);
	for (size_t i = 0; i < n; ++i)
	{
		unsigned tmp = msws();
		sum += tmp, src_h[i] = tmp;
	}
	printf("%u\n", sum);
	cudaMalloc(
		(void **)&src_d,
		n * sizeof(*src_d));
	cudaMalloc(
		(void **)&dst_d,
		n * sizeof(*dst_d));
	cudaMemcpy(
		src_d,
		src_h,
		n * sizeof(*src_d),
		cudaMemcpyHostToDevice);
	cudaFreeHost(src_d);
	for (size_t op = 0; op < 2; ++op)
	{
		cudaEvent_t beg, end;
		cudaEventCreate(&beg);
		cudaEventCreate(&end);
		cudaEventRecord(beg, 0);
		if (op == 0)
			reduce_shared(src_d, dst_d, n);
		if (op == 1)
			reduce_warp(src_d, dst_d, n);
		cudaEventRecord(end, 0);
		cudaEventSynchronize(beg);
		cudaEventSynchronize(end);
		float elapsed_time;
		cudaEventElapsedTime(&elapsed_time, beg, end);
		cudaMemcpy(
			&sum,
			dst_d,
			sizeof(sum),
			cudaMemcpyDeviceToHost);
		printf("%u : %fms elapsed.\n", sum, elapsed_time);
	}
	cudaFree(src_d);
	cudaFree(dst_d);
}
```

```bash
$ nvcc cuda_reduce.cu -o cuda_reduce
$ ./cuda_reduce
1064985537
1064985537 : 14.444064ms elapsed.
1064985537 : 7.260896ms elapsed.
```

## 参考资料

- [Using CUDA Warp-Level Primitives \| NVIDIA Developer Blog](https://devblogs.nvidia.com/using-cuda-warp-level-primitives/)
- [Optimizing Parallel Reduction in CUDA \| NVIDIA Developer Technology](https://developer.download.nvidia.cn/assets/cuda/files/reduction.pdf)
