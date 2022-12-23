---
layout: home
title: "Only Buffer When You Need To: Reducing On-chip GPU Traffic with Reconfigurable Local Atomic Buffers"
tags: 论文阅读
---

**Only Buffer When You Need To: Reducing On-chip GPU Traffic with Reconfigurable Local Atomic Buffers**

- [论文链接](https://research.cs.wisc.edu/hal/papers/LAB-hpca22.pdf)
- [作者（之一）主页](https://research.cs.wisc.edu/hal/pubs.html)
- [HPCA'22](https://hpca-conf.org/2022/)

<!-- .slide -->

## INTRODUCTION

<!-- .slide vertical=true -->

- GPU 的内存一致性协议
  - 简单、由软件驱动
  - 导致内存一致性模型很复杂
- 不频繁的同步操作通常用原子操作实现
  - 必须在共享排序点 (shared ordering point) 执行
  - 同一个线程块可以用 L1（shared memory） 同步
  - 不同线程块要用 L2 同步（代价昂贵）

<!-- .slide vertical=true -->

- GPU 正在变得更加通用（GP, general-purpose）
  - 需要支持更多访存模式，如
    - ML 训练中随机梯度下降（SGD）等使用原子更新共享权重
    - 图形算法使用原子来执行边缘传播的更新
  - 它们的原子操作都不够高效
  - 这些原子并不需要对周围的访问进行排序
    - 因为它们是在“交换地”更新共享变量，可更松弛地执行
    - 但仍开销巨大！甚至可能被串行执行，成为程序中的瓶颈

<!-- .slide vertical=true -->

![Figure 1. Percent of device-scope commutative atomics for histograms (blue), graph analytics (green), and ML training (gray) on a Titan V GPU.](https://Mizuno-Ai.wu-kan.cn/assets/image/2022/03/15/1.png)

<!-- .slide vertical=true -->

- 先前的工作存在局限性
  - 一部分主要关注 ML 推理
    - 本文关注 ML 训练
  - 着重于减少访存大小和数量、数据压缩或优化访存（如使用 shared memory）
    - 然而还剩下很多原子操作，带来明显开销
  - 关注提高（数据的）交换性能
    - 然而需要修改一致性模型，添加额外的一致性状态或缓存

<!-- .slide vertical=true -->

- 解决方案：软硬件协同
- 软件方面：
  - 利用算法特性，需要原子但执行顺序不重要
  - 因为所有更新完成之前不会访问其值
- 硬件方面
  - 先在每个 SM 的局部原子缓冲区（LAB，Local Atomic Buffer）更新
  - 然后稍后将合并更新发送到共享 L2
  - 无需修改协议或者模型

<!-- .slide -->

## BACKGROUND

<!-- .slide vertical=true -->

- GPU 应用
  - 大规模数据并行
  - 粗粒度同步为主
  - 几乎没有数据重用
- GPU 一致性协议：简单的、软件驱动
  - Valid-Invalid (VI)-style
  - 没有所有权请求、降级请求
  - 没有写者发起的无效、状态位、窥探总线或目录

<!-- .slide vertical=true -->

- 由于同步不频繁
  - 读时使缓存无效
    - 以便后续读取不会读取过时的值
  - 写入使用直写或写入不分配方法
    - 指 L1 对 global memory 的写入
    - 为了提高性能，可能会被缓冲和合并
  - 存储释放发生时（核函数结束或同步操作发生时）
    - 写操作必须完成
    - 数据被写入下一级内存
      - 通常在 SM 间共享

<!-- .slide vertical=true -->

- 细粒度同步，通常使用原子实现
  - 提供对来自多个 SM 上的 TB 的数据和原子请求之间的排序
    - 如，顺序一致 (SC) 原子对数据和原子访问进行排序
  - GPU 在内存层次结构的第一个共享级别执行所有全局原子
    - 通常是 L2，单次访问超过 100 周期
  - 有时可使用更宽松的原子
    - 暗示对其他内存访问没有排序
    - 可与其他数据和原子访问重排
    - 仍然开销昂贵

<!-- .slide vertical=true -->

- GPU 一致性模型利用不同的 scope 来减少同步开销
  - 基于异构无竞争 (SC-for-HRF) 的顺序一致性
  - CPU 上的协议不适合 GPU
    - CPU 通常会获得写入数据和原子的所有权
      - 全局同步开销低

<!-- .slide vertical=true -->

- 本文关注 GPU 一致性模型最广泛的两种情况
  - 设备范围的原子
    - 对 GPU 上的所有线程可见
  - 局部范围的原子
    - 只保证对同一 TB 中的其他线程可见，开销低得多
      - 不会在获取时使所有有效的 L1 数据无效
      - 不会在发布时通过脏数据写入

<!-- .slide -->

## PROPOSED DESIGN

<!-- .slide vertical=true -->

- LAB 的硬件支持
  - 放置在 GPU 内存层次结构中的 L1，见 Figure 2(a)
  - 需要增加一个 Cache/LAB Tag，以支持 LAB 大小的可配置性，见 Figure 2(b)

<!-- .slide vertical=true -->

![Figure 2. Proposed design (a) including LAB (in green) and (b) local SRAM.](https://Mizuno-Ai.wu-kan.cn/assets/image/2022/03/15/2.png)

<!-- .slide vertical=true -->

- LAB 的运作
  - 稳态行为
  - 驱逐操作
  - 合并读写
  - 处理不能合并的读写
  - 排序点行为
  - 原子序列化
  - 确定原子函数

<!-- .slide vertical=true -->

- 稳态（Steady-State）行为
  - 使用了“填充-写入-未命中”分配策略。
    - 因为进入 LAB 的原子都是以交换方式更新共享的全局变量
- 驱逐操作
  - LAB 满时，使用 LRU 替换策略

<!-- .slide vertical=true -->

- 合并访存
  - 与 shared memory 相同，同一个 warp 可以合并
  - 使用与 L1 相同数量的读写端口
- 处理不能合并的访存
  - 与 shared memory 相同，不能合并的读写将被分解成多个读写
- 排序点行为
  - 在核函数边界或强制排序点将 LAB 刷新到 L2
    - 如 CUDA 的线程围栏或屏障、互斥锁和信号量

<!-- .slide vertical=true -->

- 原子序列化
  - warp 内原子冲突
    - 一个 warp 中的多个线程试图同时更新同一内存位置
  - warp 间和 TB 间原子冲突。
    - 不同 warp（或不同 TB）的多个线程试图同时更新同一地址
  - 发生这种情况时，必须先发出一个请求。
  - LAB 减少了由于原子碰撞造成的序列化开销

<!-- .slide vertical=true -->

- 确定原子函数
  - CUDA 支持多种类型、不到 16 种的原子
    - 其中一些相互之间不可交换顺序。
  - LAB 在每条缓存 line 中使用 4 位来识别原子操作
  - LAB 命中但原子函数不匹配时刷新缓冲行

<!-- .slide vertical=true -->

- 相对于纯软件方案的优点
  - 程序员可以使用 shared memory
  - 或者使用带有私有变量的一级数据缓存
    - 数据可能很稀疏，需要大量空间
  - LAB 只保存频繁访问的原子地址及其值
    - 不需要大量分配

<!-- .slide vertical=true -->

- 一个示例
  1. （Figure 3(a)）发布了一个 `atomicAdd(x,2)` 操作
  2. 使用 tag 索引到 LAB，并检查是否命中（否）
  3. 分配一个 LAB 条目并更新条目的值（2）
  4. （Figure 3(b)）在源地址发布了另一个 `atomicAdd(x,5)` 操作
  5. 使用 tag 索引到 LAB，并检查是否命中（是），随后更新值（7）
  6. 当 LAB 逐出条目（Figure 3(c)）时，会向 L2 发送合并的原子更新（`atomicAdd(x，7)`）。

<!-- .slide vertical=true -->

![Figure 3. Example LAB access sequence with reuse.](https://Mizuno-Ai.wu-kan.cn/assets/image/2022/03/15/3.png)

<!-- .slide vertical=true -->

- LAB 的软件支持
  - LAB 依赖于确定哪些原子访问可以在本地（L1）缓冲
    - 例如，交换原子
  - 为了确定哪些访问是交换原子，本文利用最近提出的额外内存顺序的工作
    - 使用 SC for HRF 一致性模型和额外的交换内存排序
    - 程序员或编译器可以在代码中指示硬件的可交换原子
    - 非 `mem_order_comm` 的原子操作会绕过 LAB

<!-- .slide vertical=true -->

```cpp
loc = arr[tid];
// atomicAdd(&hist[loc], 1);
atomicAdd(&hist[loc], 1, mem_order_comm);
```

<!-- .slide vertical=true -->

- 对现有一致性模型的影响
  - 调整了次序，可能导致浮点数舍入误差
    - 可以接受，因为原子序本就不确定
  - LAB 只会聚合可交换、原子访问的全局地址的更新
    - 不会影响 GPU 一致性协议

<!-- .slide -->

## METHODOLOGY

<!-- .slide vertical=true -->

- 将 LAB 添加到 GPGPU Sim v4 中
- ML training benchmarks: CUDA 8 + cuDNN v7
  - GPGPU-Sim 最高支持的 cuDNN 版本
- Others: CUDA 11.2
- 硬件参数：基于 NVIDIA Titan V

<!-- .slide vertical=true -->

| GPU                       | Feature Configuration (Size, Access Latency) |
| :------------------------ | -------------------------------------------: |
| SMs                       |                                           80 |
| # Registers / SM          |                                        64 KB |
| LI Instruction Cache / SM |                                       128 KB |
| LI Data Cache / SM        |                32 KB (max 128 KB), 28 cycles |

<!-- .slide vertical=true -->

| GPU                     | Feature Configuration (Size, Access Latency) |
| :---------------------- | -------------------------------------------: |
| L2 Cache                |                           4.6 MB, 148 cycles |
| MSHR                    |                256 (L1) and 192 (L2) Entries |
| Shared Memory Size / SM |                96 KB (max 128 KB), 19 cycles |
| Memory                  |                       16 GB HBM2, 248 cycles |

<!-- .slide vertical=true -->

- baseline
  - 32KB L1
  - 96KB shared memory
  - device-scoped atomics at L2
- Cache-8KB
  - based on baseline
  - 8 KB less cache

<!-- .slide vertical=true -->

- Cache+8KB
  - based on baseline
  - 8 KB more cache
- Cache\*2
  - based on baseline
  - double cache

<!-- .slide vertical=true -->

- LAB i
  - 代表每个 SM 中有 $i\in \lbrace 8, 16, 32, 64, 256, \infty \rbrace$ 个 LAB 项
  - 64 项使用约 8KB SRAM
  - 对于除 $\infty$ 之外的所有 LAB，都从缓存中获取空间
    - 应用程序对缓存大小不太敏感
    - 而更改 shared memory 大小会影响利用率

<!-- .slide vertical=true -->

- hLRC
  - Lazy Release Consistency for GPUs
  - 获得原子的所有权，使其能够在本地缓存原子
  - 由于 hLRC 尚未公开发布，本文在 GPGPU-Sim 中对其实现并验证

<!-- .slide vertical=true -->

- PHI
  - PHI: Architectural Support for Synchronization- and Bandwidth-Efficient Commutative Scatter Updates
  - 在写-分配 L1 缓存中缓冲原子操作，写时取
  - PHI 原为类 MESI 的 CPU 一致性而设计，本文将其扩展到 GPU 上
    - 乐观地忽略失效和降级开销，否则 PHI 会更糟
    - 对 PHI 扩展，读时懒取，带来 6%的差别，但不影响结论

<!-- .slide vertical=true -->

- 一些其他尝试
  - 增加了每个 SM 的共享内存大小（没有效果，文末讨论）
    - 每个 SM 的 TBs 受到寄存器文件大小的限制，增加每个 SM 的共享内存并不会增加每个 SM 的 TBs
    - cuDNN 闭源，尝试使用 CUTLASS（失败，不含相关功能）
  - 实现了一个 LAB 变体，本地执行原子操作，但是没有 LAB
    - 便于区分优化原子碰撞造成的序列化开销与访存合并的收益

<!-- .slide vertical=true -->

- Benchmarks（细节见论文）
  - Rodinia
  - histogram
    - 更大的 benchmark 难以应用与直方图类似的软件优化（文末讨论）
  - graph analytics
    - 与输入相关，此处关注能跑满 GPU 的输入，不过不同大小的输入都跑了
  - ML training workloads

<!-- .slide -->

## RESULTS

<!-- .slide vertical=true -->

![Figure 4. Execution time for different cache configurations, LAB sizes, hLRC, and PHI, normalized to the baseline configuration without LAB from Table I.](https://Mizuno-Ai.wu-kan.cn/assets/image/2022/03/15/4.png)

<!-- .slide vertical=true -->

![Figure 5. Interconnect traffic reduction for different cache configurations, LAB sizes, hLRC, and PHI, normalized to the baseline configuration without LAB from Table I.](https://Mizuno-Ai.wu-kan.cn/assets/image/2022/03/15/5.png)

<!-- .slide vertical=true -->

![Figure 6. LAB miss rate for different LAB sizes and cache configurations, normalized to the baseline configuration without LAB from Table I.](https://Mizuno-Ai.wu-kan.cn/assets/image/2022/03/15/6.png)

<!-- .slide vertical=true -->

![Figure 7. Energy consumption normalized to the baseline without an LAB from Table I. For each application, left to right is the baseline (B), LAB-8 (8), LAB-16 (16), LAB-32 (32), LAB-64 (64), LAB-128 (128), LAB-256 (256), LAB-Inf (In f), hLRC (H), and PHI (P).](https://Mizuno-Ai.wu-kan.cn/assets/image/2022/03/15/7.png)

<!-- .slide vertical=true -->

![Figure 7. Energy consumption normalized to the baseline without an LAB from Table I. For each application, left to right is the baseline (B), LAB-8 (8), LAB-16 (16), LAB-32 (32), LAB-64 (64), LAB-128 (128), LAB-256 (256), LAB-Inf (In f), hLRC (H), and PHI (P).](https://Mizuno-Ai.wu-kan.cn/assets/image/2022/03/15/8.png)

<!-- .slide vertical=true -->

![Figure 9. Isolating serialization and coalescing benefits for the graph analytics workloads. ANBF: average without bursty flush. ML workloads not included due to space constraints.](https://Mizuno-Ai.wu-kan.cn/assets/image/2022/03/15/9.png)

<!-- .slide vertical=true -->

![Figure 10. GPGPU results for PHI, hLRC and LAB, normalized to baseline.](https://Mizuno-Ai.wu-kan.cn/assets/image/2022/03/15/10.png)

<!-- .slide -->

## DISCUSSION

<!-- .slide vertical=true -->

- 软件 VS 硬件
  - 使用共享内存来利用可交换性中在直方图算例获得了显著的优化。然而，在较大的 graph analytics 与 ML training 负载上存在限制。
  - 因此只有在工作集足够小的情况下，使用软件优化（如共享内存）可以提高性能。
    - 此外，对于图分析算法，顶点更新在编译时是不可预测的，因此很难使用共享内存来提高性能。
    - 相比之下，LAB 动态地保留了使用率最高的位置，从而提高了重用性，即使对于具有大工作集的程序也是如此。

<!-- .slide vertical=true -->

- 软件 VS 硬件
  - 还可以在软件中手动虚拟化和管理共享内存分配。
    - 这使得需要大量共享内存的程序能够运行。
    - 然而这需要程序员处理诸如逐出、显著增加开销（尤其是线程分歧）等问题
    - 而之前的工作表明，这种方法为 CPU 提供的结果好坏参半。

<!-- .slide vertical=true -->

- 对其他 ML 训练算法的适用性
  - 本文的结果集中在 CNN 训练算法上。
  - 然而，LAB 也适用于其他 ML 训练算法：任何在训练迭代结束时原子地更新共享权重的 ML 训练算法（这在数据并行训练中很常见）都可以使用类似的方法。
  - 本文试图检查循环神经网络（RNN）训练，但发现 cuDNN 的当前版本在 RNN 训练中没有使用原子更新体重。
  - 然而，本文预计其他 ML 训练算法，如强化学习和 GANs，将获得与 CNN 类似的好处。

<!-- .slide vertical=true -->

- 简单性
  - 本文提出的添加相对简单，但 LAB 仍然通过智能地利用算法特性提供了显著的好处。
  - 此外，LAB 可以无缝地安装在现有的、每 SM 可重构 SRAM 中
    - 这使得程序员可以在 LAB 有用时才能使用它（与以前的方法不同）。
    - 先前的方法（第七节）提供了与 LAB 相同的一些好处，但通常需要更具侵入性的一致性协议或一致性模型更改，或遭受缓存争用。
  - 因此，LAB 的简单性是一种优势，它证明了先前方法的额外复杂性是不必要的，同时也提高了现有技术的效率。

<!-- .slide -->

## RELATED WORK

<!-- .slide vertical=true -->

- 略，建议阅读原论文

<!-- .slide -->

## CONCLUSION

<!-- .slide vertical=true -->

- 随着 GPGPU 应用程序越来越多地使用细粒度同步，改进设备范围的原子支持势在必行。
  - 本文使用软硬件协同设计来解决这个瓶颈并提高可扩展性。
- 软件层面，本文利用最近对 GPU 一致性模型的扩展来识别原子更新，从而松弛原子排序。
  - 例如，在一些算法中，原子更新是可交换的、宽松的。

<!-- .slide vertical=true -->

- 在硬件层面，本文提出了一种缓冲机制（LAB），该机制扩展了每个 SM 的 L1 Cache。
  - 通过在本地缓冲这些原子的局部更新，降低了原子序列化成本与开销。
  - LAB 的大小是可配置的，无原子操作的程序不受影响
- LAB 减轻了全局原子更新的影响
  - 平均性能改进 28%，能耗节省 19%，网络流量提高 19%，性能优于 hLRC 和 PHI。
