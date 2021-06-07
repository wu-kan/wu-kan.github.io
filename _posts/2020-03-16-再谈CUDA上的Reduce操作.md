---
redirect_from: /_posts/2020-03-16-%E5%86%8D%E8%B0%88CUDA%E4%B8%8A%E7%9A%84Reduce%E6%93%8D%E4%BD%9C/
title: 再谈CUDA上的Reduce操作
tags:
  - CUDA
---

上次我学习了[用 Shuffle 加速 CUDA 上的 Reduce 操作](https://wu-kan.cn/_posts/2020-02-25-%E7%94%A8Shuffle%E5%8A%A0%E9%80%9FCUDA%E4%B8%8A%E7%9A%84Reduce%E6%93%8D%E4%BD%9C/)，据说这是目前在 CUDA 上最快的区间规约算法。然而运用在实际的情况中却并没有对代码的性能带来多大提升。本文中我再次整理了自己已知的所有 CUDA 上的快速区间规约方法，并以此对写出**高性能**且**高可扩展**的 CUDA 代码提出一些自己的思考。

- 多路规约
- 使用 Shared Memory 和 Warp Shuffle 增加计算带宽
- 使用 `<thrust/reduce.h>`
- 使用 `<cublas_v2.h>`

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

### 一些说明

和前一个实验[用 Shuffle 加速 CUDA 上的 Reduce 操作](https://wu-kan.cn/_posts/2020-02-25-%E7%94%A8Shuffle%E5%8A%A0%E9%80%9FCUDA%E4%B8%8A%E7%9A%84Reduce%E6%93%8D%E4%BD%9C/)不同，这里被规约元素的类型不再是 `unsigned` 而是 `double`，更加贴合实际使用场景。单个 `unsigned` 内存占用 4 字节，而 `double` 是 8 字节，这就使得 Warp 间互相访问寄存器的流量增加了一倍，很大程度上降低了 Shuffle 的优化效果（推测）。

### `thrust::reduce`

首先是性能标杆 `thrust` 库，来看一看目前最流行的实现可以达到怎样的性能。

```cpp
sum = thrust::reduce(src.begin(), src.begin() + n);
```

运行时间 `10.561248ms`。

### `simpleDasum`

先来做最基础的算法优化，几乎无需掌握任何 CUDA 内存分布的知识。

首先，由于这里规约的元素数量高达十亿个，如果按照通常习惯的每个线程对应输入的一个元素，那么显卡的调度开销一定程度上无法忽视。这里我们让一个线程可以对应输入中的多个元素，减少所需要的线程数量，从而减少调度开销。

最后，我们用 `template <size_t UNROLL_SIZE>` 传入 `#pragma unroll(UNROLL_SIZE)` 循环展开次数，这样编译器可以在代码生成的时候将循环展开，以减少多次循环跳转的开销。

```cpp
template <size_t UNROLL_SIZE>
void __global__ simpleDasumKernel(
	const size_t n,
	const double *src_d,
	double *tmp_d)
{
	const size_t global_id = threadIdx.x + blockDim.x * blockIdx.x;
	double val = 0;
#pragma unroll(UNROLL_SIZE)
	for (size_t i = global_id; i < n; i += blockDim.x * gridDim.x)
		val += src_d[i];
	tmp_d[global_id] = val;
}
```

运行时间为`10.727680ms`，和`thrust`相比还算可以接受。

### `naiveDasum`

在 `simpleDasum` 基础上，优化存储器的使用。

对于同一个 block 内的所有线程，我们可以借助 Shared Memory 再进行一次树形规约，从而减少对内存的写操作和二次规约。

对于同一个 warp 内的所有线程也是同理，warp 间直接访问寄存器的开销比 Shared Memory 更小。此外 warp 同步的开销也要小于`__syncthreads()`，并且同一个 warp 上执行语句是不需要条件分支的，因为不管怎样都会被执行。

```cpp
template <
	size_t UNROLL_SIZE,
	size_t BLOCK_SIZE,
	size_t WARP_SIZE>
void __global__ naiveDasumKernel(
	const size_t n,
	const double *src_d,
	double *tmp_d)
{
	const size_t global_id = threadIdx.x + blockDim.x * blockIdx.x;
	double __shared__ shared[BLOCK_SIZE];
	{
		double val = 0;
#pragma unroll(UNROLL_SIZE)
		for (size_t i = global_id; i < n; i += blockDim.x * gridDim.x)
			val += src_d[i];
		shared[threadIdx.x] = val;
	}
#pragma unroll
	for (size_t offset = BLOCK_SIZE >> 1; offset > (WARP_SIZE >> 1); offset >>= 1)
	{
		__syncthreads();
		if (threadIdx.x < offset)
			shared[threadIdx.x] += shared[threadIdx.x ^ offset];
	}
	if (threadIdx.x < WARP_SIZE)
	{
		double val = shared[threadIdx.x];
#pragma unroll
		for (size_t offset = WARP_SIZE >> 1; offset > 0; offset >>= 1)
			val += __shfl_xor_sync(0xffffffff, val, offset, WARP_SIZE);
		if (threadIdx.x == 0)
			tmp_d[blockIdx.x] = val;
	}
}
```

运行时间 `10.467008ms` ，终于比 `thrust::reduce` 快了一丢丢。

### `cublasDasum`

也可以使用线性代数库 `<cublas_v2.h>` 中的 `asum` 系列函数实现。

```cpp
cublasDasum(
	wk_cublas_handle,
	n,
	thrust::raw_pointer_cast(src.data()),
	1,
	&sum);
```

运行时间为 `11.918208ms`，看来`cublas`库提供的线性代数抽象有一定的开销。

## 总结

可以看到，随着硬件技术的发展，显卡上的运行速度已经是相当快了，十亿多的数据只用了十毫秒就完成了规约，并且在这种前提下存储优化的效果越来越有限了。

然而，较之略显复杂的访存优化，一些简单的编程习惯反而能有效提高 CUDA 代码的效率。从可扩展性的角度来说，我也更倾向于写 `simpleDasum` 这样对硬件的依赖程度更低的代码。毕竟未来显卡到底会怎么发展谁也说不准，也许以后一个 warp 或者一个 block 中会有更多的线程。

最后调库大法好，自己做了半天优化最后也只比库快了一丢丢，从开发成本的角度来说还是不要重复造轮子为妙。

## 源代码

### `Dasum.pbs`

调度脚本。

```bash
#PBS -N Dasum
#PBS -l nodes=1:ppn=32:gpus=1
#PBS -j oe
#PBS -q gpu
source /public/software/profile.d/cuda10.0.sh
cd $PBS_O_WORKDIR
nvcc Dasum.cu -run -lcublas
```

### `Dasum.o18880`

运行结果。

```bash
1073741824.000000 : 10.561248ms elapsed.
1073741824.000000 : 10.727680ms elapsed.
1073741824.000000 : 10.467008ms elapsed.
1073741824.000000 : 11.918208ms elapsed.
```

### `Dasum.cu`

```cpp
#include <stdio.h>
#include <cuda_runtime.h>
#include <thrust/device_vector.h>
#include <thrust/reduce.h>
#include <cublas_v2.h>
template <size_t UNROLL_SIZE>
void __global__ simpleDasumKernel(
	const size_t n,
	const double *src_d,
	double *tmp_d)
{
	const size_t global_id = threadIdx.x + blockDim.x * blockIdx.x;
	double val = 0;
#pragma unroll(UNROLL_SIZE)
	for (size_t i = global_id; i < n; i += blockDim.x * gridDim.x)
		val += src_d[i];
	tmp_d[global_id] = val;
}
template <
	size_t UNROLL_SIZE,
	size_t BLOCK_SIZE,
	size_t WARP_SIZE>
void __global__ naiveDasumKernel(
	const size_t n,
	const double *src_d,
	double *tmp_d)
{
	const size_t global_id = threadIdx.x + blockDim.x * blockIdx.x;
	double __shared__ shared[BLOCK_SIZE];
	{
		double val = 0;
#pragma unroll(UNROLL_SIZE)
		for (size_t i = global_id; i < n; i += blockDim.x * gridDim.x)
			val += src_d[i];
		shared[threadIdx.x] = val;
	}
#pragma unroll
	for (size_t offset = BLOCK_SIZE >> 1; offset > (WARP_SIZE >> 1); offset >>= 1)
	{
		__syncthreads();
		if (threadIdx.x < offset)
			shared[threadIdx.x] += shared[threadIdx.x ^ offset];
	}
	if (threadIdx.x < WARP_SIZE)
	{
		double val = shared[threadIdx.x];
#pragma unroll
		for (size_t offset = WARP_SIZE >> 1; offset > 0; offset >>= 1)
			val += __shfl_xor_sync(0xffffffff, val, offset, WARP_SIZE);
		if (threadIdx.x == 0)
			tmp_d[blockIdx.x] = val;
	}
}
int main()
{
	const size_t
		n = 1 << 30,
		REDUCE_SIZE = 1 << 22,
		UNROLL_SIZE = n / REDUCE_SIZE,
		BLOCK_SIZE = 1 << 10,
		WARP_SIZE = 1 << 5;
	thrust::device_vector<double> src(n, 1), tmp(REDUCE_SIZE);
	cublasHandle_t wk_cublas_handle;
	cublasCreate(&wk_cublas_handle);
	for (int op = 0; op < 4; ++op)
	{
		double sum;
		cudaEvent_t beg, end;
		cudaEventCreate(&beg);
		cudaEventCreate(&end);
		cudaEventRecord(beg, 0);
		if (op == 0)
			sum = thrust::reduce(src.begin(), src.begin() + n);
		if (op == 1)
		{
			simpleDasumKernel<
				UNROLL_SIZE><<<
				(REDUCE_SIZE + BLOCK_SIZE - 1) / BLOCK_SIZE,
				BLOCK_SIZE>>>(
				n,
				thrust::raw_pointer_cast(src.data()),
				thrust::raw_pointer_cast(tmp.data()));
			sum = thrust::reduce(tmp.begin(), tmp.begin() + REDUCE_SIZE);
		}
		if (op == 2)
		{
			naiveDasumKernel<
				UNROLL_SIZE,
				BLOCK_SIZE,
				WARP_SIZE><<<
				(REDUCE_SIZE + BLOCK_SIZE - 1) / BLOCK_SIZE,
				BLOCK_SIZE>>>(
				n,
				thrust::raw_pointer_cast(src.data()),
				thrust::raw_pointer_cast(tmp.data()));
			sum = thrust::reduce(tmp.begin(), tmp.begin() + (REDUCE_SIZE + BLOCK_SIZE - 1) / BLOCK_SIZE);
		}
		if (op == 3)
			cublasDasum(
				wk_cublas_handle,
				n,
				thrust::raw_pointer_cast(src.data()),
				1,
				&sum);
		cudaEventRecord(end, 0);
		cudaEventSynchronize(beg);
		cudaEventSynchronize(end);
		float elapsed_time;
		cudaEventElapsedTime(
			&elapsed_time,
			beg,
			end);
		printf("%f : %fms elapsed.\n", sum, elapsed_time);
	}
	cublasDestroy(wk_cublas_handle);
}
```
