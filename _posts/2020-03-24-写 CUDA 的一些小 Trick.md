---
layout: home
title: 写 CUDA 的一些小 Trick
tags:
  - 高性能计算
---

The art of doing more with less.

<!-- slide -->

## blockDim, gridDim

<!-- slide vertical=true -->

- 第一次写 cuda 程序的时候，最让我抓狂的就是调用核函数时需要指定的这两个参数。
- 在对显卡硬件架构不熟悉的情况下，调参似乎是一种玄学，更是一种哲学。

<!-- slide -->

### `blockDim` 的经验值

<!-- slide vertical=true -->

- 由于显卡是按照 STMD（多线程执行同一段代码）方式调度线程的，因此如果要充分利用调度资源，`blockDim` 最好要是调度最小单位 Warp 的倍数。
- 目前主流的显卡单个 Warp 中都是 32 个线程，不排除未来会增加的可能。
- 以下是一些 `blockDim` 的经验值，在大部分情况下都会有较优的表现。

<!-- slide vertical=true -->

```cpp
dim3 block_dim_1(128); // 用于一维
dim3 block_dim_2(16, 16); // 用于二维
dim3 block_dim_3(8, 8, 8); // 用于三维
dim3 block_dim_v100(1024); // 让v100显卡满载；很多老显卡不支持，最多768个
```

<!-- slide -->

### `cudaOccupancyMaxPotentialBlockSize`

从 CUDA 6.5 开始，提供了一个很有用的函数 `cudaOccupancyMaxPotentialBlockSize`，该函数定义在 `<cuda_runtime.h>`，接口及含义见代码中的注释。

<!-- slide vertical=true -->

```cpp
template <class T>
cudaError_t __inline__ __host__ CUDART_DEVICE
cudaOccupancyMaxPotentialBlockSize(
    int *minGridSize,           // Suggested min grid size to achieve a full machine launch.
    int *blockSize,             // Suggested block size to achieve maximum occupancy.
    T func,                     // Kernel function.
    size_t dynamicSMemSize = 0, //Size of dynamically allocated shared memory. Of course, it is known at runtime before any kernel launch. The size of the statically allocated shared memory is not needed as it is inferred by the properties of func.
    int blockSizeLimit = 0)     //blockSizeLimit  = Maximum size for each block. In the case of 1D kernels, it can coincide with the number of input elements.
{
    return cudaOccupancyMaxPotentialBlockSizeVariableSMem(minGridSize, blockSize, func, __cudaOccupancyB2DHelper(dynamicSMemSize), blockSizeLimit);
}
```

<!-- slide vertical=true -->

- 通过这个接口可以获得让 SM 占用率最大的 `blockDim` 和对应的最小 `gridDim`
- 可以不去关心各种硬件资源的限制写出低开销的调用
- 省去了自己调参数的过程

<!-- slide -->

### `cudaOccupancyMaxActiveBlocksPerMultiprocessor`

## 继续减少调度开销

<!-- slide vertical=true -->

- 让我们以简单的复数拷贝为例。
- 看起来没什么可优化的？

<!-- slide vertical=true -->

```cpp
void __global__ primitiveZcopy(
	const double *real_in,
	const double *imag_in,
	double *real_out,
	double *imag_out)
{
	const size_t i = blockDim.x * blockIdx.x + threadIdx.x;
	real_out[i] = real_in[i];
	imag_out[i] = imag_in[i];
}
```

<!-- slide vertical=true -->

- 上述核函数中，启动多少线程就拷贝多少数据。
- 当启动参数不能恰好表示成两个数的乘积（`blockDim.x * gridDim.x`）时，需要多次启动核函数
  - 例如，对`19260817`个数进行操作
- 更复杂的例子中可能不能通过多次启动核函数解决问题

<!-- slide -->

### 减少核函数启动次数

<!-- slide vertical=true -->

```cpp
void __global__ ifZcopy(
	const size_t n,
	const double *real_in,
	const double *imag_in,
	double *real_out,
	double *imag_out)
{
	const size_t i = blockDim.x * blockIdx.x + threadIdx.x;
	if (i < n)
	{
		real_out[i] = real_in[i];
		imag_out[i] = imag_in[i];
	}
}
```

<!-- slide vertical=true -->

- 多启动几个线程就是了
  - CUDA 启动少量线程的开销非常小
- 需要套个`if`
  - 有什么缺点？

<!-- slide vertical=true -->

- 上述写法至少需要启动与元素数量相等的线程数。
  - 不能使用`cudaOccupancyMaxPotentialBlockSize`返回的`gridDim`
  - 在对大量数据进行操作的时候，线程过多增加调度开销

<!-- slide -->

### 将线程和对应的数据解耦

<!-- slide vertical=true -->

```cpp
void __global__ simpleZcopy(
	const size_t n,
	const double *real_in,
	const double *imag_in,
	double *real_out,
	double *imag_out)
{
	for (size_t i = blockDim.x * blockIdx.x + threadIdx.x;
		 i < n;
		 i += blockDim.x * gridDim.x)
	{
		real_out[i] = real_in[i];
		imag_out[i] = imag_in[i];
	}
}
```

<!-- slide vertical=true -->

- 把`if`改成`for`，完美解决问题！
  - 现在哪怕只启动一个线程，这个核函数也能返回正确结果，降低了依赖
  - 配合`cudaOccupancyMaxPotentialBlockSize`效果极佳！
- 在与使用`#pragma omp parallel for`并行的代码对比的时候，我们通常会发现，CUDA 版本少了外层的`for`。
  - 在这种写法下，爷的青春回来了！
- 有什么缺点？

<!-- slide vertical=true -->

- 虽然调度开销减少了，但是线程内部频繁`for`跳转！

<!-- slide -->

### 循环展开

<!-- slide vertical=true -->

```cpp
void __global__ simpleZcopy(
	const size_t n,
	const double *real_in,
	const double *imag_in,
	double *real_out,
	double *imag_out)
{
#pragma unroll(32)
	for (size_t i = blockDim.x * blockIdx.x + threadIdx.x;
		 i < n;
		 i += blockDim.x * gridDim.x)
	{
		real_out[i] = real_in[i];
		imag_out[i] = imag_in[i];
	}
}
```

<!-- slide vertical=true -->

- 使用编译推导 `#pragma unroll(32)` 将循环展开
  - 奇怪的运行常数减少了！
- 有什么缺点？

<!-- slide vertical=true -->

- 又多了一个参数需要调！
- 需要循环次数是展开次数的倍数

<!-- slide -->

### 使用 `template` 传递编译期常数

<!-- slide vertical=true -->

```cpp
template<size_t UNROLL_SIZE>
void __global__ simpleZcopy(
	const size_t n,
	const double *real_in,
	const double *imag_in,
	double *real_out,
	double *imag_out)
{
#pragma unroll(UNROLL_SIZE)
	for (size_t i = blockDim.x * blockIdx.x + threadIdx.x;
		 i < n;
		 i += blockDim.x * gridDim.x)
	{
		real_out[i] = real_in[i];
		imag_out[i] = imag_in[i];
	}
}
```

<!-- slide vertical=true -->

- cuda 支持 cpp 语法，使用一些 cpp 语法糖！
- 将编译期就能确定的常数通过 template 传进去！
  - 比 `#define` 更优雅
  - 方便生成不同展开的版本！
- 还可以传一些更有用的东西，比如 shared memory 数组的大小！

<!-- slide vertical=true -->

```cpp
int numThreads, minGridSize, blockSize;
cudaOccupancyMaxPotentialBlockSize(
    &minGridSize,
    &blockSize,
    simpleZcopy<32>);
numThreads = minGridSize * blockSize;
if(n % numThreads == 0 && n / numThreads % 32 == 0)
	simpleZcopy<32><<<
		minGridSize,
		blockSize>>>(
		n,
		real_in,
		imag_in,
		real_out,
		imag_out);
else
	simpleZcopy<1><<<
		minGridSize,
		blockSize>>>(
		n,
		real_in,
		imag_in,
		real_out,
		imag_out);
```

<!-- slide vertical=true -->

- 有什么缺点？

<!-- slide vertical=true -->

- 代码太丑了！
- 我就想简简单单拷贝一个数据
- 有必要这么麻烦吗

<!-- slide -->

## 调库

<!-- slide vertical=true -->

- 这种东西应该第一个讲
  - 调库是一切优化的起点
  - 调库是一切优化的终点
- 一些常见好用的高性能库，已经集成在 cuda toolkit 中
  - `thrust`中的 `thrust::copy`
  - `cublas_v2`中的 `cublasDcopy`
- 本例中甚至可以用 `cudaMemcpy`

<!-- slide -->

## 减少 Bank Conflict

<!-- slide vertical=true -->

- 这是一个非常简单的分块矩阵乘法$A\times B =C$
- 为了访存对齐，$A$按照列优先的顺序存储

<!-- slide vertical=true -->

```cpp
template <size_t BLOCK_SIZE>
void __global__ simpleMatMatMul(
	const float *Ac,
	const float *B,
	float *C,
	const size_t m,
	const size_t n,
	const size_t p)
{
	const size_t
		r = blockIdx.y * blockDim.y + threadIdx.y,
		c = blockIdx.x * blockDim.x + threadIdx.x;
	float res = 0;
	for (size_t t = 0; t < n; t += BLOCK_SIZE)
	{
		float __shared__
			sAc[BLOCK_SIZE][BLOCK_SIZE],
			sB[BLOCK_SIZE][BLOCK_SIZE];
		__syncthreads();
		sAc[threadIdx.y][threadIdx.x] = r < m && t + threadIdx.x < n ? Ac[(t + threadIdx.x) * m + r] : 0;
		sB[threadIdx.x][threadIdx.y] = c < p && t + threadIdx.y < n ? B[(t + threadIdx.y) * p + c] : 0;
		__syncthreads();
		for (size_t i = 0; i < blockDim.x; ++i)
			res += sAc[i][threadIdx.y] * sB[i][threadIdx.x];
	}
	if (r < m && c < p)
		C[r * p + c] = res;
}
```

<!-- slide vertical=true -->

- 有什么缺点？

<!-- slide vertical=true -->

- GPU 共享内存是基于存储体切换的架构（bank-switched-architecture）。
  - 在 Femi，Kepler，Maxwell 架构的设备上有 32 个存储体（也就是常说的共享内存分成 32 个 bank），而在 G200 与 G80 的硬件上只有 16 个存储体。
  - 每个存储体（bank）每个周期只能指向一次操作（一个 32bit 的整数或者一个单精度的浮点型数据），一次读或者一次写，也就是说每个存储体（bank）的带宽为 每周期 32bit。
- BLOCK_SIZE 通常是 32 的倍数，同一列的线程访问对应的 Share Memory 访问同一个 bank 的不同地址，发生大量 bank conflict！

<!-- slide vertical=true -->

```cpp
template <size_t BLOCK_SIZE>
void __global__ naiveMatMatMul(
	const float *Ac,
	const float *B,
	float *C,
	const size_t m,
	const size_t n,
	const size_t p)
{
	const size_t
		r = blockIdx.y * blockDim.y + threadIdx.y,
		c = blockIdx.x * blockDim.x + threadIdx.x;
	float res = 0;
	for (size_t t = 0; t < n; t += BLOCK_SIZE)
	{
		float __shared__
			sAc[BLOCK_SIZE][BLOCK_SIZE | 1],
			sB[BLOCK_SIZE][BLOCK_SIZE | 1];
		__syncthreads();
		sAc[threadIdx.y][threadIdx.x] = r < m && t + threadIdx.x < n ? Ac[(t + threadIdx.x) * m + r] : 0;
		sB[threadIdx.x][threadIdx.y] = c < p && t + threadIdx.y < n ? B[(t + threadIdx.y) * p + c] : 0;
		__syncthreads();
		for (size_t i = 0; i < blockDim.x; ++i)
			res += sAc[i][threadIdx.y] * sB[i][threadIdx.x];
	}
	if (r < m && c < p)
		C[r * p + c] = res;
}
```

<!-- slide vertical=true -->

- Shared Memory 二维数组每一行增加一个偏移位，解决问题！
