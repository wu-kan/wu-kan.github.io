---
title: 使用 cutlass_profiler 测试 GPU 性能
---

CUTLASS 是开源的纯 CUDA 实现 GEMM 等一系列运算的 SOTA，去年实习期间，我也曾基于 CUTLASS 定制了一些比较复杂的算子。除了用于定制算子外，由于 CUTLASS 的实现高度抽象，其算法有非常多的运行时参数可以调整，其中提供了一个 `cutlass_profiler`，可以用于测试 GPU 性能。本文简单介绍使用方法。

## 基于 spack 的安装方式

我写了一个基于 [spack](https://spack.readthedocs.io/en/stable/) 的安装脚本，可以通过以下方式引入。

```shell
git clone https://github.com/SYSU-SCC/sysu-scc-spack-repo
spack repo add --scope=site sysu-scc-spack-repo
spack install cutlass # cuda_arch=80 # 可以去掉前一个注释，指定使用 cuda_arch，大大减少编译时间
spack load cutlass
```

由于 CUTLASS 里面有很多模板，在我使用的服务器上编译了十几分钟。

## 使用方式

`cutlass_profiler` 支持非常自由的运行参数，并且支持参数的批处理（用 `,` 间隔）。例如，我们使用下述参数进行测试。

```shell
cutlass_profiler \
  --operation=Gemm \
  --m=8192 \
  --n=8192 \
  --k=8192 \
  --A=f32:column \
  --B=f32:column \
  --C=f32:column \
  --beta=0,1,2 \
  --profiling-iterations=1 \
  --providers=cutlass \
  --output=functional-test.csv
```

以下是在我的机器上的结果 `functional-test.csv`。

```csv
Problem,Provider,OperationKind,Operation,Disposition,Status,gemm_kind,m,n,k,A,B,C,alpha,beta,split_k_slices,batch_count,op_class,accum,cta_m,cta_n,cta_k,stages,warps_m,warps_n,warps_k,inst_m,inst_n,inst_k,min_cc,max_cc,Bytes,Flops,Flops/Byte,Runtime,GB/s,GFLOPs
1,CUTLASS,gemm,cutlass_simt_sgemm_128x128_8x2_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,0,1,1,simt,f32,128,128,8,2,4,2,1,1,1,1,50,1024,805306368,1099645845504,1365,62.6346,11.9742,17556.5
1,CUTLASS,gemm,cutlass_tensorop_s1688tf32gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,0,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,805306368,1099645845504,1365,27.5684,27.205,39887.8
1,CUTLASS,gemm,cutlass_tensorop_s1688f16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,0,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,75,1024,805306368,1099645845504,1365,26.338,28.476,41751.4
1,CUTLASS,gemm,cutlass_tensorop_s1688bf16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,0,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,805306368,1099645845504,1365,26.5226,28.2777,41460.7
1,CUTLASS,gemm,cutlass_simt_sgemm_256x128_8x5_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,0,1,1,simt,f32,256,128,8,5,4,2,1,1,1,1,50,1024,805306368,1099645845504,1365,64.3599,11.6532,17085.9
2,CUTLASS,gemm,cutlass_simt_sgemm_128x128_8x2_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,1,1,1,simt,f32,128,128,8,2,4,2,1,1,1,1,50,1024,1073741824,1099645845504,1024,62.5291,15.9926,17586.2
2,CUTLASS,gemm,cutlass_tensorop_s1688tf32gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,1,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,1073741824,1099645845504,1024,27.5458,36.3031,39920.6
2,CUTLASS,gemm,cutlass_tensorop_s1688f16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,1,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,75,1024,1073741824,1099645845504,1024,26.4531,37.8028,41569.7
2,CUTLASS,gemm,cutlass_tensorop_s1688bf16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,1,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,1073741824,1099645845504,1024,26.5117,37.7192,41477.8
2,CUTLASS,gemm,cutlass_simt_sgemm_256x128_8x5_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,1,1,1,simt,f32,256,128,8,5,4,2,1,1,1,1,50,1024,1073741824,1099645845504,1024,64.5424,15.4937,17037.6
3,CUTLASS,gemm,cutlass_simt_sgemm_128x128_8x2_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,2,1,1,simt,f32,128,128,8,2,4,2,1,1,1,1,50,1024,1073741824,1099645845504,1024,62.5784,15.9799,17572.3
3,CUTLASS,gemm,cutlass_tensorop_s1688tf32gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,2,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,1073741824,1099645845504,1024,27.5626,36.2811,39896.3
3,CUTLASS,gemm,cutlass_tensorop_s1688f16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,2,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,75,1024,1073741824,1099645845504,1024,26.4892,37.7513,41513.1
3,CUTLASS,gemm,cutlass_tensorop_s1688bf16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,2,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,1073741824,1099645845504,1024,26.489,37.7515,41513.3
3,CUTLASS,gemm,cutlass_simt_sgemm_256x128_8x5_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,2,1,1,simt,f32,256,128,8,5,4,2,1,1,1,1,50,1024,1073741824,1099645845504,1024,64.7774,15.4375,16975.8
```

顺手对结果做一个可视化。

```vega-lite
{
  "data": {
    "values": "Problem,Provider,OperationKind,Operation,Disposition,Status,gemm_kind,m,n,k,A,B,C,alpha,beta,split_k_slices,batch_count,op_class,accum,cta_m,cta_n,cta_k,stages,warps_m,warps_n,warps_k,inst_m,inst_n,inst_k,min_cc,max_cc,Bytes,Flops,Flops/Byte,Runtime,GB/s,GFLOPs\n1,CUTLASS,gemm,cutlass_simt_sgemm_128x128_8x2_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,0,1,1,simt,f32,128,128,8,2,4,2,1,1,1,1,50,1024,805306368,1099645845504,1365,62.6346,11.9742,17556.5\n1,CUTLASS,gemm,cutlass_tensorop_s1688tf32gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,0,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,805306368,1099645845504,1365,27.5684,27.205,39887.8\n1,CUTLASS,gemm,cutlass_tensorop_s1688f16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,0,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,75,1024,805306368,1099645845504,1365,26.338,28.476,41751.4\n1,CUTLASS,gemm,cutlass_tensorop_s1688bf16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,0,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,805306368,1099645845504,1365,26.5226,28.2777,41460.7\n1,CUTLASS,gemm,cutlass_simt_sgemm_256x128_8x5_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,0,1,1,simt,f32,256,128,8,5,4,2,1,1,1,1,50,1024,805306368,1099645845504,1365,64.3599,11.6532,17085.9\n2,CUTLASS,gemm,cutlass_simt_sgemm_128x128_8x2_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,1,1,1,simt,f32,128,128,8,2,4,2,1,1,1,1,50,1024,1073741824,1099645845504,1024,62.5291,15.9926,17586.2\n2,CUTLASS,gemm,cutlass_tensorop_s1688tf32gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,1,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,1073741824,1099645845504,1024,27.5458,36.3031,39920.6\n2,CUTLASS,gemm,cutlass_tensorop_s1688f16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,1,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,75,1024,1073741824,1099645845504,1024,26.4531,37.8028,41569.7\n2,CUTLASS,gemm,cutlass_tensorop_s1688bf16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,1,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,1073741824,1099645845504,1024,26.5117,37.7192,41477.8\n2,CUTLASS,gemm,cutlass_simt_sgemm_256x128_8x5_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,1,1,1,simt,f32,256,128,8,5,4,2,1,1,1,1,50,1024,1073741824,1099645845504,1024,64.5424,15.4937,17037.6\n3,CUTLASS,gemm,cutlass_simt_sgemm_128x128_8x2_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,2,1,1,simt,f32,128,128,8,2,4,2,1,1,1,1,50,1024,1073741824,1099645845504,1024,62.5784,15.9799,17572.3\n3,CUTLASS,gemm,cutlass_tensorop_s1688tf32gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,2,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,1073741824,1099645845504,1024,27.5626,36.2811,39896.3\n3,CUTLASS,gemm,cutlass_tensorop_s1688f16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,2,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,75,1024,1073741824,1099645845504,1024,26.4892,37.7513,41513.1\n3,CUTLASS,gemm,cutlass_tensorop_s1688bf16gemm_256x128_16x3_nn_align4,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,2,1,1,tensorop,f32,256,128,16,3,4,2,1,16,8,8,80,1024,1073741824,1099645845504,1024,26.489,37.7515,41513.3\n3,CUTLASS,gemm,cutlass_simt_sgemm_256x128_8x5_nn_align1,passed,success,universal,8192,8192,8192,f32:column,f32:column,f32:column,1,2,1,1,simt,f32,256,128,8,5,4,2,1,1,1,1,50,1024,1073741824,1099645845504,1024,64.7774,15.4375,16975.8",
    "format": {
      "type": "csv"
    }
  },
  "mark": "point",
  "encoding": {
    "y": {"field": "GFLOPs", "type": "quantitative"},
    "x": {"field": "Problem", "type": "nominal"},
    "shape": {"field": "op_class", "type": "nominal"},
    "color": {"field": "Operation", "type": "nominal"}
  }
}
```

由于本文并不在意分析这张显卡（我用的是 A100 ）的参数，此处略去对可视化的说明。
