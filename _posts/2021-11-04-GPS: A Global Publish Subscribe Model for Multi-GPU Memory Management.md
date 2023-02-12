---
layout: home
title: "GPS: A Global Publish Subscribe Model for Multi-GPU Memory Management"
tags:
  - 论文阅读
presentation: # https://shd101wyy.github.io/markdown-preview-enhanced/#/zh-cn/presentation
  parallaxBackgroundImage: data:image/webp;base64,UklGRiQAAABXRUJQVlA4IBgAAAAwAQCdASoBAAEAD8D+JaQAA3AA/uVqAAA=
  navigationMode: linear
  width: 1920
  height: 100%
---

<style>
  .reveal .slides { text-align: left; }
</style>

**GPS: A Global Publish Subscribe Model for Multi-GPU Memory Management**

- [MICRO'21](https://www.microarch.org/micro54/) Best Paper Nominee
- [PDF](https://dl.acm.org/doi/10.1145/3466752.3480088)

<!-- .slide -->

## BACKGROUND AND MOTIVATION

<!-- .slide vertical=true -->

- GPU：高带宽、适合并行的硬件架构
  - SIMD + DSA（Tensor Core）
- 多 GPU 可提供更高性能，但充分管理硬件资源难度大
- 主要困难之一：本地和远程存储带宽相差数量级，互连带宽限制可扩展性
  - 4 卡，无限带宽（理想情况）、PCIe 6.0（预测）、PCIe 3.0 相对于单卡的性能分别为：
    - $3\times, 2\times, 0.7\times$
- 当前多 GPU 系统中有效管理数据的技术均存在不足

<!-- .slide vertical=true -->

![Figure 1: Many HPC programs strong-scale poorly due to insufficient inter-GPU bandwidth, as shown on a system with
4 NVIDIA GV100 GPUs.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/bQJHp15mWfwiLKz.png)

<!-- .slide vertical=true -->

![Figure 3: Local and remote bandwidths on varying GPU platforms. Despite significant increases in both metrics, a 3× bandwidth gap persists between local and remote memories.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/adqzQFy9s3v5XHR.png)

<!-- .slide vertical=true -->

- 主机端启动 GPU 之间的 memcpy
  - 需要精细调整以实现计算通信的流水
  - MPI、NCCL 等通信框架可直接操作 GPU 缓冲区
    - 计算和通信的重叠仍然需要手动调整
    - 学习成本增加，进一步加重程序员的负担
- 点对点对等传输
  - GPU 线程可以直接访问其他 GPU 的物理内存
  - 细粒度执行，计算通信重叠，启动开销低（只需要一方即可通信，不用同步）
    - [NVSHMEM](https://developer.nvidia.com/nvshmem) 较之 MPI 更高效
  - 严重受限于互连带宽，读远程内存时延迟高

<!-- .slide vertical=true -->

- 通过统一寻址内存（Unified Memory, UM）
  - UM 提供系统中任何处理器均可访问的单一且统一虚拟内存地址空间
  - UM 以隐式、和程序员无关的方式支持 GPU 之间的数据移动
    - 使用页面错误和迁移机制在 GPU 之间执行数据传输
    - 页面错误的性能开销巨大，只是看起来美好
  - UM 可以通过显式提示的方式减少页面错误
    - 仍然实现细粒度数据共享的流水线预取和计算
  - 不支持至少有一个 writer 和多个 reader 的页面复制
    - 对有多个 reader 的页面的写将页面“折叠”到单个 GPU（通常是 writer）会触发昂贵的 TLB

<!-- .slide vertical=true -->

- 避免远程访问瓶颈的一种方法：
  - 在生成数据后，提前将数据从生产 GPU 传输到消费 GPU
  - 在需要时直接从本地内存读取数据
- 主动传输有助于实现强大的可伸缩性
  - 提供了更多的机会使数据传输与计算重叠
  - 改进了局部性，并确保关键路径负载享有更高的本地内存带宽
- 只有一部分 GPU 将消耗数据的情况下，执行广泛的全对全传输会浪费 GPU 间的带宽

<!-- .slide vertical=true -->

![Figure 4: Data transfer patterns in different paradigms. In demand-based loads and UM, transfers happen on-demand; in memcpy, they happen bulk-synchronously at the end of producer kernel; in GPS, proactive fine-grained transfers are performed to all subscribers.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/kYdMVEv9FxHbOm4.png)

<!-- .slide vertical=true -->

- GPS：一个全局发布-订阅的多显卡内存管理模型，提供了一组架构增强功能
  - 订阅管理完全由发布-订阅处理单元处理
  - 自动跟踪哪些 GPU 订阅共享内存页
  - 主动向所有订户广播存储，使订户能够以高带宽从本地内存读取数据
  - 通过驱动程序，在每个订阅 GPU 上本地复制这些页
  - 发布-订阅可以解耦

<!-- .slide vertical=true -->

- GPS 的读操作总是从本地返回，而 GPS 的写操作则广播给所有用户
  - 传统的加载-存储根据物理内存位置导致本地或远程访问，带来延迟
  - 在写路径而不是读路径上执行远程访问会隐藏延迟
    - 远程存储不会暂停执行
  - 可以进行进一步优化
    - 对写操作调度、组合，有效地使用互连带宽
    - 不违反内存模型

<!-- .slide vertical=true -->

![Figure 2: Load/store paths for conventional and GPS pages. Because GPS transfers data to consumers' memory proactively, all GPS loads can be performed to high bandwidth local memory.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/QHEke1lf9DTdc85.png)

<!-- .slide vertical=true -->

![Figure 5: A simple publish-subscribe framework.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/02/OUvcDPAaRke6CB1.png)

- 一个简单的发布-订阅模型示例
  - 生成数据的发布者
  - 请求特定更新的订阅者
  - 发布-订阅处理单元

<!-- .slide vertical=true -->

- 依赖主动式远程存储的发布-订阅模型的主要挑战
  - 应由哪个 GPU 接收数据？
  - 应该何时传输存储？

<!-- .slide -->

## GPS ARCHITECTURAL PRINCIPLES

<!-- .slide vertical=true -->

- GPS 的设计目标
  - 不破坏与 GPU 编程模型、内存一致性模型的向后兼容性
    - 提供一致的性能增益
  - GPS 可以轻松被集成到应用程序中
    - 只需极少的代码或概念更改

<!-- .slide vertical=true -->

- GPS 背后的关键创新
  - 一系列架构增强，维护订阅信息
  - 旨在协调主动式 GPU 间通信以实现高性能
  - 仅向需要的 GPU 传输数据
  - 在使用过程中实现本地访问

<!-- .slide vertical=true -->

- GPS 地址空间
  - 扩展传统多 GPU 共享虚拟地址空间
    - 使 GPS 可以通过简单、直观的 API 集成到其应用程序中
    - 只需对分配和订阅管理进行微小的更改，不需要修改为 UM 编写的 GPU 内核
    - 很容易集成到现有的多 GPU 编程框架上
  - 在 GPS 地址空间中的分配在所有订阅 GPU 的物理内存中都有本地副本
  - 语法相同，但底层行为不同
    - 拦截每个读写操作并将副本转发给每个订户的本地副本
    - 读操作可以在完全本地带宽下执行，无需消耗互连带宽

<!-- .slide vertical=true -->

![Figure 6: GPS address space: Allocations made are replicated in the physical memory of all subscribers.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/8lgdCfVMQG2pb4W.png)

<!-- .slide vertical=true -->

- GPS 提供手动和自动机制来管理页面订阅
  - 手动：允许用户通过订阅/取消订阅 API 显式指定订阅信息
  - 自动：可以通过以下两种方式之一执行：
    - 默认情况下订阅，即不分青红皂白地全部订阅，然后是取消订阅阶段
    - 默认情况下不订阅，即 GPU 仅在向某个页面发出第一个读取请求时才订阅该页面
    - 一旦捕获到共享者信息，共享者信息就会反馈到用于协调 GPU 间通信的订阅跟踪机制中
  - 订阅是两种机制对 GPS 的提示，而不是正确执行应用程序的功能要求。
    - 如果 GPU 向它不是订户的页面发出加载，它不会出错
    - 对远程 GPU 执行点对点加载会造成性能损失，但不会破坏功能正确性

<!-- .slide vertical=true -->

- 合并写操作
  - GPS 在将存储转发到其他 GPU 之前，会将存储主动合并到 GPS 页面
    - 节省了宝贵的 GPU 间带宽
  - 对于作用域访问，像传统 GPU 那样简单地处理它们
    - GPU 内存模型只要求在执行作用域同步（如内存围栏）时，其他 GPU 可以看到写操作
    - 所有作用域访问都被发送到单个一致性点并在那里执行
    - 仅在多 GPU 上并发启动的 grid 需要通过内存显式同步时使用
      - 通常这类访问很少，所以无问题！
  - 对于非作用域访问仅维护必需的读写排序行为
    - 同一 GPU 到同一地址的读写以相同的顺序到达

<!-- .slide -->

## GPS PROGRAMMING INTERFACE

<!-- .slide vertical=true -->

- `cudaMallocGPS`：内存分配
  - `cudaMalloc`的代替
  - 在 GPS 虚拟地址空间中分配内存，并在至少一个 GPU 中使用物理备份。
  - 在分配时传递一个可选参数，以指示将为该区域显式管理订阅
  - 否则，GPS 将执行自动订阅管理
  - 使用`cudaFree`释放

<!-- .slide vertical=true -->

- `cuMemAdvise`：内存订阅提示
  - `CU_MEM_ADVISE_GPS_SUBSCRIBE`：手动订阅
  - `CU_MEM_ADVISE_GPS_UNSUBSCRIBE`：取消订阅
- 自动分析并订阅
  - `cuGPSTrackingStart`：开始观察
  - `cuGPSTrackingStop`：结束观察并分析订阅
  - 分析不需要精确以保持正确性
    - GPU 仍可以访问未订阅的页面
    - 但这样的访问将以较低的性能执行

<!-- .slide vertical=true -->

```cpp
__global__ void mvmul(float *mat, float *invec, float *outvec /* ... */) {
  /* ... */
  for (int i = 0; i < mat_dim; ++i)
    sum += mat[tid * mat_dim + i] * invec[i];
  outvec[tid] = sum;
  /* ... */
}
```

<!-- .slide vertical=true -->

```cpp
cudaMallocGPS(&mat, mat_dim *mat_dim_size);
cudaMallocGPS(&vec1, mat_dim_size);
cudaMallocGPS(&vec2, mat_dim_size);
cudaMemset(vec2, 0, mat_dim_size);
for (int iter = 0; iter < MAX_ITER; ++iter) {
  if (iter == 0)
    cuGPSTrackingStart();
  for (int device = 0; device < num_devices; ++device) {
    cudaSetDevice(device);
    mvmul<<<num_blocks, num_threads, stream[device]>>>(mat, vec1,
                                                       vec2 /* ... */);
    mvmul<<<num_blocks, num_threads, stream[device]>>>(mat, vec2,
                                                       vec1 /* ... */);
  }
  if (iter == 0)
    cuGPSTrackingStop();
}
```

<!-- .slide -->

## ARCHITECTURAL SUPPORT FOR GPS

<!-- .slide vertical=true -->

- 一种可能的 GPS 硬件实现
  - GPU 页表条目（PTE）中增加一位，以指示虚拟内存页是否是 GPS 页
  - 一个新的硬件单元，负责将写操作传播到订阅了特定页面的 GPU

<!-- .slide vertical=true -->

![Figure 7: Modifications to GPU hardware needed for GPS provisioning.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/RsXuKjHli82ErgV.png)

- GPS 必须支持以下基本内存操作
  - 传统的加载、存储和原子操作
  - GPS 加载
  - GPS 存储和原子操作

<!-- .slide vertical=true -->

- GPS 硬件单元和扩展
  - 页表支持
  - 合并远程写
  - GPS 地址转换
  - 访问跟踪单元
    - 用于 Profile

<!-- .slide -->

## EXPERIMENTAL METHODOLOGY

<!-- .slide vertical=true -->

- 对 NVAS（NVIDIA Architectural Simulator）进行修改
  - NVAS 在 SASS 级别进行驱动
- 在实际硬件上使用工具 NVBit，跟踪包含
  - CUDAAPI 事件
  - GPU 内核指令
  - 访问的内存地址

<!-- .slide vertical=true -->

| Application |                                   Description                                    | Predominant Communication Pattern |
| :---------: | :------------------------------------------------------------------------------: | :-------------------------------: |
|   Jacobi    | Iterative algorithm that solves a diagonally dominant system of linear equations |           Peer-to-peer            |
|  Pagerank   | Algorithm used by Google Search to rank web pages in their search engine results |           Peer-to-Peer            |
|    SSSP     |       Shortest path computation between every pair of vertices in a graph        |           Many-to-many            |
|     ALS     |                          Matrix factorization algorithm                          |            All-to-all             |

<!-- .slide vertical=true -->

| Application |                                      Description                                       | Predominant Communication Pattern |
| :---------: | :------------------------------------------------------------------------------------: | :-------------------------------: |
|     CT      |           Model Based Iterative Reconstruction algorithm used in CT imaging            |            All-to-all             |
|   B2rEqwp   | 3D earthquake wave-propogation model simulation using 4-order finite difference method |           Peer-to-peer            |
|  Diffusion  |     A multi-GPU implementation of 3D Heat Equation and inviscid Burgers' Equation      |           Peer-to-peer            |
|     Hit     |  Simulating Homogeneous Isotropic Turbulence by solving Navier-Stokes equations in 3D  |           Peer-to-peer            |

<!-- .slide -->

## EXPERIMENTAL RESULTS

<!-- .slide vertical=true -->

![Figure 8: 4-GPU speedup of different paradigms.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/t2Wa84mOZdMKY6b.png)

<!-- .slide vertical=true -->

![Figure 10: Total data moved over interconnect normalized to memcpy (bulk-synchronous transfers).](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/EwhxNR581oSZz9P.png)

<!-- .slide vertical=true -->

![Figure 11: Performance sensitivity to subscription.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/vtmeRUWQVdku5Fy.png)

<!-- .slide vertical=true -->

![Figure 12: 16-GPU performance achieved by different paradigms.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/ziHZWwajPrqAfh4.png)

<!-- .slide vertical=true -->

![Figure 13: Sensitivity to interconnect bandwidth.](https://Mizuno-Ai.wu-kan.cn/assets/image/2021/11/04/8O4vdR97akmB1Ah.png)

<!-- .slide -->

- Limitations of the GPS approach
  - 订阅以页（64KB）为单位
    - 即使只有一位更新，也需要传输整页
  - GPU 通常以缓存块为粒度进行互联
    - 导致传输不必要的字节
  - 写合并技术可能不会合并时间上间隔较远的操作
    - 导致效率降低

<!-- .slide -->

## CONCLUSION

<!-- .slide vertical=true -->

- GPS：一种全新的软硬件共同设计的多 GPU 内存管理系统扩展
  - 通过发布-订阅模式提高多 GPU 系统性能
- GPS 有简单直观的编程模型扩展，可以自然地被集成到应用程序中
- GPS 提供了显著的性能改进
  - 在 4 个 NVIDIA V100 GPU 和几种互连架构的模型上进行评估
    - GPS 在 1 个 GPU 上的平均加速比为 3.0
    - 性能比当前最佳可用多 GPU 编程模式好 2.3 倍。
  - 在类似的 16 GPU 系统上
    - GPS 捕获了 80%的可用性能
    - 大大领先于其他多 GPU 编程模型。
