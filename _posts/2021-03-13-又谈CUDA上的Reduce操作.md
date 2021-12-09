---
redirect_from: /_posts/2021-03-13-%E5%8F%88%E8%B0%88CUDA%E4%B8%8A%E7%9A%84Reduce%E6%93%8D%E4%BD%9C/
title: 又谈CUDA上的Reduce操作
tags:
  - CUDA
---

## 结论

- 五个 `shfl.sync.bfly.b32` 和 `add` 被换成了 `redux.sync.add.s32`
- 几乎没卵用，也许在 ptx 到 sass 汇编的后端编译过程中自动被优化了？

~~很好，又水了一篇 blog~~

## 源代码

### `reduce_add.sh`

```bash
#!/bin/bash

spack unload -a
spack load gcc@9.3.0
spack load cuda@11.0.2

spack find --loaded
cat /proc/cpuinfo | grep name | cut -f2 -d: | uniq -c
nvidia-smi

nvcc -gencode=arch=compute_80,code=sm_80 -run reduce_add.cu
nvcc -gencode=arch=compute_80,code=sm_80 -run reduce_add.cu -DUSE_AMPERE_REDUCE
nvcc -gencode=arch=compute_80,code=sm_80 -ptx -o reduce_add.0.ptx reduce_add.cu
nvcc -gencode=arch=compute_80,code=sm_80 -ptx -o reduce_add.1.ptx reduce_add.cu -DUSE_AMPERE_REDUCE
```

### `reduce_add.log`

```bash
-- linux-debian9-zen / gcc@6.3.0 --------------------------------
gcc@9.3.0
gmp@6.1.2
isl@0.20
mpc@1.1.0
mpfr@3.1.6
zlib@1.2.11

-- linux-debian9-zen2 / gcc@9.3.0 -------------------------------
cuda@11.0.2
libiconv@1.16
libxml2@2.9.10
xz@5.2.5
zlib@1.2.11
    128  AMD EPYC 7542 32-Core Processor
Tue Mar  9 08:01:10 2021
+-----------------------------------------------------------------------------+
| NVIDIA-SMI 450.80.02    Driver Version: 450.80.02    CUDA Version: 11.0     |
|-------------------------------+----------------------+----------------------+
| GPU  Name        Persistence-M| Bus-Id        Disp.A | Volatile Uncorr. ECC |
| Fan  Temp  Perf  Pwr:Usage/Cap|         Memory-Usage | GPU-Util  Compute M. |
|                               |                      |               MIG M. |
|===============================+======================+======================|
|   0  A100-SXM4-40GB      Off  | 00000000:0F:00.0 Off |                    0 |
| N/A   36C    P0    61W / 400W |      0MiB / 40537MiB |      0%      Default |
|                               |                      |             Disabled |
+-------------------------------+----------------------+----------------------+
|   1  A100-SXM4-40GB      Off  | 00000000:15:00.0 Off |                   On |
| N/A   34C    P0    47W / 400W |      0MiB / 40537MiB |     N/A      Default |
|                               |                      |              Enabled |
+-------------------------------+----------------------+----------------------+
|   2  A100-SXM4-40GB      Off  | 00000000:51:00.0 Off |                   On |
| N/A   31C    P0    43W / 400W |      0MiB / 40537MiB |     N/A      Default |
|                               |                      |              Enabled |
+-------------------------------+----------------------+----------------------+
|   3  A100-SXM4-40GB      Off  | 00000000:54:00.0 Off |                   On |
| N/A   32C    P0    46W / 400W |      0MiB / 40537MiB |     N/A      Default |
|                               |                      |              Enabled |
+-------------------------------+----------------------+----------------------+
|   4  A100-SXM4-40GB      Off  | 00000000:8D:00.0 Off |                   On |
| N/A   31C    P0    46W / 400W |      0MiB / 40537MiB |     N/A      Default |
|                               |                      |              Enabled |
+-------------------------------+----------------------+----------------------+
|   5  A100-SXM4-40GB      Off  | 00000000:92:00.0 Off |                   On |
| N/A   30C    P0    43W / 400W |      0MiB / 40537MiB |     N/A      Default |
|                               |                      |              Enabled |
+-------------------------------+----------------------+----------------------+
|   6  A100-SXM4-40GB      Off  | 00000000:D6:00.0 Off |                   On |
| N/A   30C    P0    43W / 400W |      0MiB / 40537MiB |     N/A      Default |
|                               |                      |              Enabled |
+-------------------------------+----------------------+----------------------+
|   7  A100-SXM4-40GB      Off  | 00000000:DA:00.0 Off |                   On |
| N/A   32C    P0    45W / 400W |      3MiB / 40537MiB |     N/A      Default |
|                               |                      |              Enabled |
+-------------------------------+----------------------+----------------------+

+-----------------------------------------------------------------------------+
| MIG devices:                                                                |
+------------------+----------------------+-----------+-----------------------+
| GPU  GI  CI  MIG |         Memory-Usage |        Vol|         Shared        |
|      ID  ID  Dev |           BAR1-Usage | SM     Unc| CE  ENC  DEC  OFA  JPG|
|                  |                      |        ECC|                       |
|==================+======================+===========+=======================|
|  7   13   0   0  |      3MiB /  4864MiB | 14      0 |  1   0    0    0    0 |
|                  |      0MiB /  8191MiB |           |                       |
+------------------+----------------------+-----------+-----------------------+

+-----------------------------------------------------------------------------+
| Processes:                                                                  |
|  GPU   GI   CI        PID   Type   Process name                  GPU Memory |
|        ID   ID                                                   Usage      |
|=============================================================================|
|  No running processes found                                                 |
+-----------------------------------------------------------------------------+
wuk::host_reduce_add_strided_batched: 27.999231 ms, 3.834898e+10 FLOPS.
wuk::host_reduce_add_strided_batched: 28.010496 ms, 3.833355e+10 FLOPS.
```

### `reduce_add.cu`

实验代码。

```cpp
#include <cstdio>
#include <cuda.h>
#include <cuda_runtime.h>
#include <thrust/device_vector.h>

namespace wuk
{

    template <
        typename Tcompute,
        int WARPSIZE = 32,
        typename Tmask = unsigned>
    static __device__ __forceinline__ Tcompute
    warp_allreduce_add(
        Tcompute val,
        const Tmask FINAL_MASK = 0xffffffff)
    {

#if CUDA_VERSION < 9000

#pragma unroll
        for (int offset = WARPSIZE >> 1; offset > 0; offset >>= 1)
            val += __shfl_xor(val, FINAL_MASK, offset);

#else

#pragma unroll
        for (int offset = WARPSIZE >> 1; offset > 0; offset >>= 1)
            val += __shfl_xor_sync(FINAL_MASK, val, offset, WARPSIZE);

#endif

        return val;
    }

#ifdef USE_AMPERE_REDUCE

    template <>
    __device__ __forceinline__ int
    warp_allreduce_add<
        int,
        32,
        unsigned>(
        int val,
        const unsigned FINAL_MASK)
    {
        return __reduce_add_sync(FINAL_MASK, val);
    }

    template <>
    __device__ __forceinline__ unsigned
    warp_allreduce_add<
        unsigned,
        32,
        unsigned>(
        unsigned val,
        const unsigned FINAL_MASK)
    {
        return __reduce_add_sync(FINAL_MASK, val);
    }

#endif

    template <
        typename Tin,
        typename Tcompute,
        int WARPSIZE = 32>
    static __device__ __forceinline__ Tcompute
    thread_reduce_add(
        int n,
        Tin *x,
        int incx,
        int offset)
    {
        Tcompute val = (Tcompute)0;
        for (int i = offset; i < n; i += incx)
            val += (Tcompute)x[i];
        return val;
    }

    template <
        typename Tin,
        typename Tout,
        typename Tcompute,
        int BLOCKSIZE,
        int WARPSIZE = 32>
    static __device__ __forceinline__ void
    block_reduce_add(
        int n,
        Tin *x,
        int incx,
        Tout *result)
    {
        static __shared__ Tcompute smem[BLOCKSIZE / WARPSIZE];
        {
            const Tcompute val = warp_allreduce_add<
                Tcompute,
                WARPSIZE>(
                thread_reduce_add<
                    Tin,
                    Tcompute>(
                    n,
                    x,
                    incx * BLOCKSIZE,
                    threadIdx.x));
            if (threadIdx.x % WARPSIZE == 0)
                smem[threadIdx.x / WARPSIZE] = val;
        }
        __syncthreads();
        if (threadIdx.x < WARPSIZE)
        {
            const Tcompute val = warp_allreduce_add<
                Tcompute,
                WARPSIZE>(
                thread_reduce_add<
                    Tcompute,
                    Tcompute>(
                    BLOCKSIZE / WARPSIZE,
                    smem,
                    WARPSIZE,
                    threadIdx.x));
            if (threadIdx.x % WARPSIZE == 0)
                result[threadIdx.x / WARPSIZE] = (Tout)val;
        }
    }

    template <
        typename Tin,
        typename Tout,
        typename Tcompute,
        int BLOCKSIZE,
        int WARPSIZE = 32>
    static __global__ __launch_bounds__(BLOCKSIZE) void global_reduce_add_strided_batched(
        int n, Tin *x, int incx,
        int stride_x,
        Tout *result)
    {
        block_reduce_add<
            Tin,
            Tout,
            Tcompute,
            BLOCKSIZE,
            WARPSIZE>(
            n,
            x + stride_x * blockIdx.x,
            incx,
            result + blockIdx.x);
    }

    template <
        typename Tin,
        typename Tout,
        typename Tcompute,
        int WARPSIZE = 32>
    void host_reduce_add_strided_batched(
        int n,
        Tin *x,
        int incx,
        int stride_x,
        Tout *result,
        int batch_count,
        cudaStream_t stream)
    {
        const int BLOCKSIZE = 1024;
        dim3 blockDim(BLOCKSIZE), gridDim(batch_count);
        global_reduce_add_strided_batched<
            Tin,
            Tout,
            Tcompute,
            BLOCKSIZE,
            WARPSIZE><<<
            gridDim,
            blockDim,
            0,
            stream>>>(
            n,
            x,
            incx,
            stride_x,
            result);
    }

} // namespace wuk

void WuK_Timer(
    const char *tag,
    float flo,
    const std::function<void()> &kernel,
    int test_time = 9)
{
    float min_time = 9e99;
    while (test_time--)
    {
        cudaEvent_t beg, end;
        cudaEventCreate(&beg);
        cudaEventCreate(&end);
        cudaEventRecord(beg);
        kernel();
        cudaEventRecord(end);
        cudaEventSynchronize(beg);
        cudaEventSynchronize(end);
        float elapsed_time;
        cudaEventElapsedTime(&elapsed_time, beg, end);
        min_time = std::min(min_time, elapsed_time);
    }
    std::printf("%s: %f ms, %e FLOPS.\n", tag, min_time, flo * 1e3 / min_time);
}

typedef int Tcompute;
typedef Tcompute Tin;
typedef Tcompute Tout;

const int64_t
    n = 1 << 19,
    incx = 1,
    stride_x = n * incx,
    batch_count = 1 << 11;
thrust::device_vector<Tin> x_vector(stride_x *batch_count, 1);
thrust::device_vector<Tout> result_vector(batch_count, 0);
cudaStream_t stream = NULL;
int main()
{
    WuK_Timer(
        "wuk::host_reduce_add_strided_batched",
        1.0 * n * batch_count,
        [&] {
            wuk::host_reduce_add_strided_batched<
                Tin,
                Tout,
                Tcompute>(
                n,
                thrust::raw_pointer_cast(x_vector.data()),
                incx,
                stride_x,
                thrust::raw_pointer_cast(result_vector.data()),
                batch_count,
                stream);
        });
}
```

### `reduce_add.0.ptx`

```llvm
//
// Generated by NVIDIA NVVM Compiler
//
// Compiler Build ID: CL-28540450
// Cuda compilation tools, release 11.0, V11.0.194
// Based on LLVM 3.4svn
//

.version 7.0
.target sm_80
.address_size 64

        // .globl       _ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1_
// _ZZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem has been demoted
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust6system6detail10sequential3seqE[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust6system3cpp3parE[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust8cuda_cub3parE[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_1E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_2E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_3E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_4E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_5E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_6E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_7E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_8E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_9E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders3_10E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust3seqE[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b16thrust6deviceE[1];

.visible .entry _ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1_(
        .param .align 8 .b8 _ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1__param_0[16],
        .param .u64 _ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1__param_1
)
.maxntid 256, 1, 1
{
        .reg .pred      %p<8>;
        .reg .b32       %r<13>;
        .reg .b64       %rd<36>;


        ld.param.u64    %rd2, [_ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1__param_0];
        ld.param.u32    %r1, [_ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1__param_0+8];
        ld.param.u64    %rd9, [_ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1__param_1];
        mov.u32         %r3, %ctaid.x;
        mul.wide.u32    %rd10, %r3, 512;
        sub.s64         %rd11, %rd9, %rd10;
        mov.u64         %rd12, 512;
        min.u64         %rd1, %rd11, %rd12;
        setp.eq.s64     %p1, %rd1, 512;
        mov.u32         %r2, %tid.x;
        cvt.u64.u32     %rd3, %r2;
        @%p1 bra        BB0_7;
        bra.uni         BB0_1;

BB0_7:
        add.s64         %rd28, %rd3, %rd10;
        shl.b64         %rd29, %rd28, 2;
        add.s64         %rd7, %rd2, %rd29;
        setp.eq.s64     %p6, %rd7, 0;
        @%p6 bra        BB0_9;

        cvta.to.global.u64      %rd30, %rd7;
        st.global.u32   [%rd30], %r1;

BB0_9:
        add.s32         %r11, %r2, 256;
        cvt.u64.u32     %rd31, %r11;
        add.s64         %rd33, %rd31, %rd10;
        shl.b64         %rd34, %rd33, 2;
        add.s64         %rd8, %rd2, %rd34;
        setp.eq.s64     %p7, %rd8, 0;
        @%p7 bra        BB0_11;

        cvta.to.global.u64      %rd35, %rd8;
        st.global.u32   [%rd35], %r1;
        bra.uni         BB0_11;

BB0_1:
        cvt.s64.s32     %rd4, %rd1;
        setp.ge.u64     %p2, %rd3, %rd4;
        @%p2 bra        BB0_4;

        add.s64         %rd14, %rd3, %rd10;
        shl.b64         %rd15, %rd14, 2;
        add.s64         %rd16, %rd2, %rd15;
        setp.eq.s64     %p3, %rd16, 0;
        @%p3 bra        BB0_4;

        cvta.to.global.u64      %rd22, %rd16;
        st.global.u32   [%rd22], %r1;

BB0_4:
        add.s32         %r8, %r2, 256;
        cvt.u64.u32     %rd5, %r8;
        setp.ge.u64     %p4, %rd5, %rd4;
        @%p4 bra        BB0_11;

        add.s64         %rd24, %rd5, %rd10;
        shl.b64         %rd25, %rd24, 2;
        add.s64         %rd6, %rd2, %rd25;
        setp.eq.s64     %p5, %rd6, 0;
        @%p5 bra        BB0_11;

        cvta.to.global.u64      %rd26, %rd6;
        st.global.u32   [%rd26], %r1;

BB0_11:
        ret;
}

        // .globl       _ZN3cub11EmptyKernelIvEEvv
.visible .entry _ZN3cub11EmptyKernelIvEEvv(

)
{



        ret;
}

.entry _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0_(
        .param .u32 _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_0,
        .param .u64 _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_1,
        .param .u32 _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_2,
        .param .u32 _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_3,
        .param .u64 _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_4
)
.maxntid 1024, 1, 1
{
        .reg .pred      %p<23>;
        .reg .b32       %r<120>;
        .reg .b64       %rd<15>;
        // demoted variable
        .shared .align 4 .b8 _ZZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem[128];

        ld.param.u32    %r35, [_ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_0];
        ld.param.u64    %rd4, [_ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_1];
        ld.param.u32    %r38, [_ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_2];
        ld.param.u32    %r39, [_ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_3];
        ld.param.u64    %rd3, [_ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_4];
        cvta.to.global.u64      %rd1, %rd4;
        mov.u32         %r1, %ctaid.x;
        mul.lo.s32      %r40, %r1, %r39;
        cvt.u64.u32     %rd2, %r40;
        shl.b32         %r2, %r38, 10;
        mov.u32         %r3, %tid.x;
        mov.u32         %r109, 0;
        setp.ge.s32     %p1, %r3, %r35;
        @%p1 bra        BB2_3;

        mov.u32         %r107, %r3;

BB2_2:
        cvt.s64.s32     %rd5, %r107;
        add.s64         %rd6, %rd5, %rd2;
        shl.b64         %rd7, %rd6, 2;
        add.s64         %rd8, %rd1, %rd7;
        ld.global.u32   %r41, [%rd8];
        add.s32         %r109, %r41, %r109;
        add.s32         %r107, %r107, %r2;
        setp.lt.s32     %p2, %r107, %r35;
        @%p2 bra        BB2_2;

BB2_3:
        mov.u32         %r42, 31;
        mov.u32         %r43, 16;
        mov.u32         %r44, -1;
        shfl.sync.bfly.b32      %r45|%p3, %r109, %r43, %r42, %r44;
        add.s32         %r46, %r45, %r109;
        mov.u32         %r47, 8;
        shfl.sync.bfly.b32      %r48|%p4, %r46, %r47, %r42, %r44;
        add.s32         %r49, %r48, %r46;
        mov.u32         %r50, 4;
        shfl.sync.bfly.b32      %r51|%p5, %r49, %r50, %r42, %r44;
        add.s32         %r52, %r51, %r49;
        mov.u32         %r53, 2;
        shfl.sync.bfly.b32      %r54|%p6, %r52, %r53, %r42, %r44;
        add.s32         %r55, %r54, %r52;
        mov.u32         %r56, 1;
        shfl.sync.bfly.b32      %r57|%p7, %r55, %r56, %r42, %r44;
        add.s32         %r9, %r57, %r55;
        and.b32         %r10, %r3, 31;
        setp.ne.s32     %p8, %r10, 0;
        @%p8 bra        BB2_5;

        shr.u32         %r58, %r3, 3;
        and.b32         %r59, %r58, 536870908;
        mov.u32         %r60, _ZZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem;
        add.s32         %r61, %r60, %r59;
        st.shared.u32   [%r61], %r9;

BB2_5:
        bar.sync        0;
        setp.gt.u32     %p9, %r3, 31;
        @%p9 bra        BB2_18;

        mov.u32         %r119, 0;
        setp.gt.s32     %p10, %r3, 31;
        @%p10 bra       BB2_16;

        setp.gt.s32     %p11, %r3, 0;
        mov.u32         %r119, 0;
        add.s32         %r64, %r3, 31;
        selp.b32        %r65, %r64, 31, %p11;
        sub.s32         %r66, %r65, %r3;
        shr.u32         %r67, %r66, 5;
        add.s32         %r11, %r67, 1;
        and.b32         %r12, %r11, 3;
        setp.eq.s32     %p12, %r12, 0;
        mov.u32         %r114, %r3;
        @%p12 bra       BB2_13;

        setp.eq.s32     %p13, %r12, 1;
        mov.u32         %r113, 0;
        mov.u32         %r112, %r3;
        @%p13 bra       BB2_12;

        setp.eq.s32     %p14, %r12, 2;
        mov.u32         %r111, 0;
        mov.u32         %r110, %r3;
        @%p14 bra       BB2_11;

        shl.b32         %r70, %r3, 2;
        mov.u32         %r71, _ZZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem;
        add.s32         %r72, %r71, %r70;
        ld.shared.u32   %r111, [%r72];
        add.s32         %r110, %r3, 32;

BB2_11:
        shl.b32         %r73, %r110, 2;
        mov.u32         %r74, _ZZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem;
        add.s32         %r75, %r74, %r73;
        ld.shared.u32   %r76, [%r75];
        add.s32         %r113, %r76, %r111;
        add.s32         %r112, %r110, 32;

BB2_12:
        shl.b32         %r77, %r112, 2;
        mov.u32         %r78, _ZZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem;
        add.s32         %r79, %r78, %r77;
        ld.shared.u32   %r80, [%r79];
        add.s32         %r119, %r80, %r113;
        add.s32         %r114, %r112, 32;

BB2_13:
        setp.lt.u32     %p15, %r11, 4;
        @%p15 bra       BB2_16;

        add.s32         %r117, %r114, -32;
        shl.b32         %r81, %r114, 2;
        mov.u32         %r82, _ZZN58_INTERNAL_36_tmpxft_000434ec_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem;
        add.s32         %r116, %r82, %r81;

BB2_15:
        ld.shared.u32   %r83, [%r116];
        add.s32         %r84, %r83, %r119;
        ld.shared.u32   %r85, [%r116+128];
        add.s32         %r86, %r85, %r84;
        ld.shared.u32   %r87, [%r116+256];
        add.s32         %r88, %r87, %r86;
        ld.shared.u32   %r89, [%r116+384];
        add.s32         %r119, %r89, %r88;
        add.s32         %r116, %r116, 512;
        add.s32         %r117, %r117, 128;
        setp.lt.s32     %p16, %r117, 0;
        @%p16 bra       BB2_15;

BB2_16:
        shfl.sync.bfly.b32      %r93|%p17, %r119, %r43, %r42, %r44;
        add.s32         %r94, %r93, %r119;
        shfl.sync.bfly.b32      %r96|%p18, %r94, %r47, %r42, %r44;
        add.s32         %r97, %r96, %r94;
        shfl.sync.bfly.b32      %r99|%p19, %r97, %r50, %r42, %r44;
        add.s32         %r100, %r99, %r97;
        shfl.sync.bfly.b32      %r102|%p20, %r100, %r53, %r42, %r44;
        add.s32         %r103, %r102, %r100;
        shfl.sync.bfly.b32      %r105|%p21, %r103, %r56, %r42, %r44;
        add.s32         %r34, %r105, %r103;
        @%p8 bra        BB2_18;

        shr.u32         %r106, %r3, 5;
        cvt.u64.u32     %rd9, %r106;
        cvt.u64.u32     %rd10, %r1;
        add.s64         %rd11, %rd9, %rd10;
        cvta.to.global.u64      %rd12, %rd3;
        shl.b64         %rd13, %rd11, 2;
        add.s64         %rd14, %rd12, %rd13;
        st.global.u32   [%rd14], %r34;

BB2_18:
        ret;
}
```

### `reduce_add.1.ptx`

```llvm
//
// Generated by NVIDIA NVVM Compiler
//
// Compiler Build ID: CL-28540450
// Cuda compilation tools, release 11.0, V11.0.194
// Based on LLVM 3.4svn
//

.version 7.0
.target sm_80
.address_size 64

        // .globl       _ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1_
// _ZZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem has been demoted
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust6system6detail10sequential3seqE[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust6system3cpp3parE[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust8cuda_cub3parE[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_1E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_2E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_3E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_4E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_5E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_6E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_7E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_8E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders2_9E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust12placeholders3_10E[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust3seqE[1];
.global .align 1 .b8 _ZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b16thrust6deviceE[1];

.visible .entry _ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1_(
        .param .align 8 .b8 _ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1__param_0[16],
        .param .u64 _ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1__param_1
)
.maxntid 256, 1, 1
{
        .reg .pred      %p<8>;
        .reg .b32       %r<13>;
        .reg .b64       %rd<36>;


        ld.param.u64    %rd2, [_ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1__param_0];
        ld.param.u32    %r1, [_ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1__param_0+8];
        ld.param.u64    %rd9, [_ZN6thrust8cuda_cub4core13_kernel_agentINS0_14__parallel_for16ParallelForAgentINS0_20__uninitialized_fill7functorINS_10device_ptrIiEEiEEmEES9_mEEvT0_T1__param_1];
        mov.u32         %r3, %ctaid.x;
        mul.wide.u32    %rd10, %r3, 512;
        sub.s64         %rd11, %rd9, %rd10;
        mov.u64         %rd12, 512;
        min.u64         %rd1, %rd11, %rd12;
        setp.eq.s64     %p1, %rd1, 512;
        mov.u32         %r2, %tid.x;
        cvt.u64.u32     %rd3, %r2;
        @%p1 bra        BB0_7;
        bra.uni         BB0_1;

BB0_7:
        add.s64         %rd28, %rd3, %rd10;
        shl.b64         %rd29, %rd28, 2;
        add.s64         %rd7, %rd2, %rd29;
        setp.eq.s64     %p6, %rd7, 0;
        @%p6 bra        BB0_9;

        cvta.to.global.u64      %rd30, %rd7;
        st.global.u32   [%rd30], %r1;

BB0_9:
        add.s32         %r11, %r2, 256;
        cvt.u64.u32     %rd31, %r11;
        add.s64         %rd33, %rd31, %rd10;
        shl.b64         %rd34, %rd33, 2;
        add.s64         %rd8, %rd2, %rd34;
        setp.eq.s64     %p7, %rd8, 0;
        @%p7 bra        BB0_11;

        cvta.to.global.u64      %rd35, %rd8;
        st.global.u32   [%rd35], %r1;
        bra.uni         BB0_11;

BB0_1:
        cvt.s64.s32     %rd4, %rd1;
        setp.ge.u64     %p2, %rd3, %rd4;
        @%p2 bra        BB0_4;

        add.s64         %rd14, %rd3, %rd10;
        shl.b64         %rd15, %rd14, 2;
        add.s64         %rd16, %rd2, %rd15;
        setp.eq.s64     %p3, %rd16, 0;
        @%p3 bra        BB0_4;

        cvta.to.global.u64      %rd22, %rd16;
        st.global.u32   [%rd22], %r1;

BB0_4:
        add.s32         %r8, %r2, 256;
        cvt.u64.u32     %rd5, %r8;
        setp.ge.u64     %p4, %rd5, %rd4;
        @%p4 bra        BB0_11;

        add.s64         %rd24, %rd5, %rd10;
        shl.b64         %rd25, %rd24, 2;
        add.s64         %rd6, %rd2, %rd25;
        setp.eq.s64     %p5, %rd6, 0;
        @%p5 bra        BB0_11;

        cvta.to.global.u64      %rd26, %rd6;
        st.global.u32   [%rd26], %r1;

BB0_11:
        ret;
}

        // .globl       _ZN3cub11EmptyKernelIvEEvv
.visible .entry _ZN3cub11EmptyKernelIvEEvv(

)
{



        ret;
}

.entry _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0_(
        .param .u32 _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_0,
        .param .u64 _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_1,
        .param .u32 _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_2,
        .param .u32 _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_3,
        .param .u64 _ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_4
)
.maxntid 1024, 1, 1
{
        .reg .pred      %p<13>;
        .reg .b32       %r<90>;
        .reg .b64       %rd<15>;
        // demoted variable
        .shared .align 4 .b8 _ZZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem[128];

        ld.param.u32    %r35, [_ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_0];
        ld.param.u64    %rd4, [_ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_1];
        ld.param.u32    %r38, [_ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_2];
        ld.param.u32    %r39, [_ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_3];
        ld.param.u64    %rd3, [_ZN3wuk33global_reduce_add_strided_batchedIiiiLi1024ELi32EEEviPT_iiPT0__param_4];
        cvta.to.global.u64      %rd1, %rd4;
        mov.u32         %r1, %ctaid.x;
        mul.lo.s32      %r40, %r1, %r39;
        cvt.u64.u32     %rd2, %r40;
        shl.b32         %r2, %r38, 10;
        mov.u32         %r3, %tid.x;
        mov.u32         %r79, 0;
        setp.ge.s32     %p1, %r3, %r35;
        @%p1 bra        BB2_3;

        mov.u32         %r77, %r3;

BB2_2:
        cvt.s64.s32     %rd5, %r77;
        add.s64         %rd6, %rd5, %rd2;
        shl.b64         %rd7, %rd6, 2;
        add.s64         %rd8, %rd1, %rd7;
        ld.global.u32   %r41, [%rd8];
        add.s32         %r79, %r41, %r79;
        add.s32         %r77, %r77, %r2;
        setp.lt.s32     %p2, %r77, %r35;
        @%p2 bra        BB2_2;

BB2_3:
        mov.u32         %r42, -1;
        redux.sync.add.s32 %r9, %r79, %r42;
        and.b32         %r10, %r3, 31;
        setp.ne.s32     %p3, %r10, 0;
        @%p3 bra        BB2_5;

        shr.u32         %r43, %r3, 3;
        and.b32         %r44, %r43, 536870908;
        mov.u32         %r45, _ZZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem;
        add.s32         %r46, %r45, %r44;
        st.shared.u32   [%r46], %r9;

BB2_5:
        bar.sync        0;
        setp.gt.u32     %p4, %r3, 31;
        @%p4 bra        BB2_18;

        mov.u32         %r89, 0;
        setp.gt.s32     %p5, %r3, 31;
        @%p5 bra        BB2_16;

        setp.gt.s32     %p6, %r3, 0;
        mov.u32         %r89, 0;
        add.s32         %r49, %r3, 31;
        selp.b32        %r50, %r49, 31, %p6;
        sub.s32         %r51, %r50, %r3;
        shr.u32         %r52, %r51, 5;
        add.s32         %r11, %r52, 1;
        and.b32         %r12, %r11, 3;
        setp.eq.s32     %p7, %r12, 0;
        mov.u32         %r84, %r3;
        @%p7 bra        BB2_13;

        setp.eq.s32     %p8, %r12, 1;
        mov.u32         %r83, 0;
        mov.u32         %r82, %r3;
        @%p8 bra        BB2_12;

        setp.eq.s32     %p9, %r12, 2;
        mov.u32         %r81, 0;
        mov.u32         %r80, %r3;
        @%p9 bra        BB2_11;

        shl.b32         %r55, %r3, 2;
        mov.u32         %r56, _ZZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem;
        add.s32         %r57, %r56, %r55;
        ld.shared.u32   %r81, [%r57];
        add.s32         %r80, %r3, 32;

BB2_11:
        shl.b32         %r58, %r80, 2;
        mov.u32         %r59, _ZZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem;
        add.s32         %r60, %r59, %r58;
        ld.shared.u32   %r61, [%r60];
        add.s32         %r83, %r61, %r81;
        add.s32         %r82, %r80, 32;

BB2_12:
        shl.b32         %r62, %r82, 2;
        mov.u32         %r63, _ZZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem;
        add.s32         %r64, %r63, %r62;
        ld.shared.u32   %r65, [%r64];
        add.s32         %r89, %r65, %r83;
        add.s32         %r84, %r82, 32;

BB2_13:
        setp.lt.u32     %p10, %r11, 4;
        @%p10 bra       BB2_16;

        add.s32         %r87, %r84, -32;
        shl.b32         %r66, %r84, 2;
        mov.u32         %r67, _ZZN58_INTERNAL_36_tmpxft_00043bfa_00000000_7_a_cpp1_ii_1e97e9b13wuk16block_reduce_addIiiiLi1024ELi32EEEviPT_iPT0_E4smem;
        add.s32         %r86, %r67, %r66;

BB2_15:
        ld.shared.u32   %r68, [%r86];
        add.s32         %r69, %r68, %r89;
        ld.shared.u32   %r70, [%r86+128];
        add.s32         %r71, %r70, %r69;
        ld.shared.u32   %r72, [%r86+256];
        add.s32         %r73, %r72, %r71;
        ld.shared.u32   %r74, [%r86+384];
        add.s32         %r89, %r74, %r73;
        add.s32         %r86, %r86, 512;
        add.s32         %r87, %r87, 128;
        setp.lt.s32     %p11, %r87, 0;
        @%p11 bra       BB2_15;

BB2_16:
        redux.sync.add.s32 %r34, %r89, %r42;
        @%p3 bra        BB2_18;

        shr.u32         %r76, %r3, 5;
        cvt.u64.u32     %rd9, %r76;
        cvt.u64.u32     %rd10, %r1;
        add.s64         %rd11, %rd9, %rd10;
        cvta.to.global.u64      %rd12, %rd3;
        shl.b64         %rd13, %rd11, 2;
        add.s64         %rd14, %rd12, %rd13;
        st.global.u32   [%rd14], %r34;

BB2_18:
        ret;
}
```
