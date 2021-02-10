---
layout: home
title: SYSU Collegiate Programming Contest 2020, Onsite
---

# 中大校赛 2020

<!-- .slide -->

## **A** Undercover

<!-- .slide vertical=true -->

- 这题的关键是要知道有哪些人可能是卧底
- 也就是对于每个人，我要知道如果他是卧底，有多少人说了真话
- 统计每个人被说是卧底的次数 $X[i]$
- 每个人被说不是卧底的次数 $Y[i]$
- 说某人不是卧底的人的个数 $Z$
- 那么如果第 $i$ 个人是卧底，就有 $X[i]+(Z-Y[i])$ 个人说了真话
- 然后就是对于每个人，分类讨论了

<!-- .slide -->

## **B** Orienteering

- 命题： 吴坎
- 题意：询问 $n\le20$ 维超立方体上两点间的最短路。

<!-- .slide vertical=true -->

- E-立方选路算法
  - 时间复杂度 $O(Tn)$
  - 空间复杂度 $O(1)$
  - 超算集群网络上的经典路由算法

<!-- .slide vertical=true -->

- 超立方体
  - 配图来自张永东老师课件
  - 高度互联，弱可扩展的经直连典型网络构型
  - $n$ 维超立方体由两个 $n-1$ 维超立方体构成
  - 任意两个相连的节点，其二进制表示仅有一位不同

<!-- .slide vertical=true -->

![三维超立方体](https://i.loli.net/2020/11/21/6YQvAM7WmXyHUjR.jpg)

<!-- .slide vertical=true -->

- 路由计算
  - 起点 $\overline{s_{n-1}\dots s_2s_1s_0}$
  - 终点 $\overline{d_{n-1}\dots d_2d_1d_0}$
  - 异或 $\overline{r_{n-1}\dots r_2r_1r_0}$
- 路由过程
  - $\overline{s_{n-1}\dots s_2s_1s_0}$
  - $\overline{s_{n-1}\dots s_2s_1\left(s_0\oplus r_0 \right)}$
  - $\overline{s_{n-1}\dots s_2\left(s_1\oplus r_1\right)d_0}$
  - $\dots$
  - $\overline{d_{n-1}\dots d_2d_1d_0}$

<!-- .slide vertical=true -->

![四维立方体上的示例](https://i.loli.net/2020/11/21/ZP7YxFrNIndMtgT.png)

<!-- .slide vertical=true -->

- E-立方选路算法有很多优美的性质，如
  - 完成一个通信步的时间仅为网络节点数的对数级
  - 可以多点同时通信且不造成阻塞
- 本题削减难度，只有单点通信
  - 要跳过 E-立方算法得到结果中原地等待的步数

<!-- .slide vertical=true -->

- 欢迎大家参加两周后的计算机院定向越野！

<!-- .slide -->

## **C** Compare

<!-- .slide vertical=true -->

- 送分题
- 读入两个字符串
- 方法一：把后面多余的 0 去掉，然后比较字符串大小
- 方法二：在短串后面补 0 使其一样长，然后比较字符串大小

<!-- .slide -->

## **D** Decode

<!-- .slide vertical=true -->

- 模拟题，直接模拟即可
- 0 开头即为第一种，110 开头即为第二种，1110 开头即为第三种

<!-- .slide -->

## **E** Reading

<!-- .slide vertical=true -->

- 模拟题，模拟的时候要用到优先队列
- 用一个 `map` 给每个字符串一个编号
- 用 `vector` 存每本书有哪些单词，每个单词在哪些书里
- 用 `set`（或 `priority_queue`）维护以 `pair<生词数量,书本编号>` 的小根堆

<!-- .slide -->

## **F** Competition

<!-- .slide vertical=true -->

- 先计算出每个队能解决的问题的最大难度：
- 维护一个堆，每次选出一个能力值最强的队伍
- 这个队伍能解决的问题的最大难度，就是“他现在的能力值”和“之前被选出的队伍能解决的问题的最大难度的最小值”的最小值
- 然后激励和他相连的队伍（注意维护优先队列）

<!-- .slide -->

## **G** Sum

- 简单的 DP，注意要开 `long long`

<!-- .slide -->

## **H** Sequence

<!-- .slide vertical=true -->

- DP+线段树优化
- 给你一个长度为 N 的序列，你要修改最少的数字，然后分成 M 段，使得每一段都包含 1~K 的所有数字
- 用 F[i][j]表示把前 j 个数分成 i 份的答案
- $F[i][j] = \min\lbrace F[i-1][p] + (K-g[p][j]) \vert p<=i-K\rbrace $
- $g[p][j]$ 表示从 $p+1$ 到 $j$ 的不同数字个数
- 维护从 $j$ 往前，$1$ 到 $K$ 的每个数字的最右位置，从这位置往左，相当于让答案 $-1$
- 维护一棵线段树：支持区间加减、区间最小值查询

<!-- .slide -->

## **I** TianHe-IIA

- 命题：吴坎
- 题意：维护区间上的欧拉变换、区间 x 方和等操作。

<!-- .slide vertical=true -->

- 区间欧拉变换曾经出现在 [19 年新手赛](https://wu-kan.cn/_posts/2019-12-15-SYSU-Novice-Programming-Contest-2019,-Online/)
  - 快速收敛的区间变换操作
  - 线段树上打标记
- 对曾经做过该题的同学有误导
  - 存在区间赋值操作，不再收敛
  - 数据范围加强，难以使用线段树完成

<!-- .slide vertical=true -->

- 珂朵莉树
  - 又称老司机树（Old Driver Tree, ODT）
  - 在 `map` 上以点代区间，暴力维护
  - 2017 年一场 CF 比赛（896C）中提出的数据结构，题目背景主角是珂朵莉
  - 一直没有正式比赛中见到过，于是搬到校赛上来

<!-- .slide vertical=true -->

![珂朵莉](https://i.loli.net/2020/11/21/TDmdAHIezXr1tZY.png)

<!-- .slide vertical=true -->

- 在数据随机的时推平操作比较多
  - 时间复杂度趋近于 $O(m\log n)$
  - 用[这个数据结构](https://arxiv.org/pdf/1408.3045v1.pdf)可以把复杂度继续下降
- 非随机数下，出题人想要卡珂朵莉树时肯定会 T
- 标程 0.7s，时限 3s

<!-- .slide vertical=true -->

- 使用场景
  - 区间赋值操作
  - 区间统计操作
  - 最好用于随机数据
  - 走投无路时冲一发暴力

<!-- .slide -->

## **J** Traffic Lights

- 这题的关键是要注意到：如果我们知道了第一次等红灯是在哪里，那么后面的情况也都知道了（在同一个位置等红灯的车，后面的情况都是一样的）
- 从后往前扫描，每个红灯要等待的时间段是一个区间（或者是环形区间的前面一段和后面一段）
- 问题就变成了区间覆盖问题，用数据结构维护即可

<!-- .slide -->

## **K** Cards

- 命题：左谭励
- 题意：$n \le 20$ 张卡牌，每次游戏胜利后随机刷出一张，每种牌出现的概率固定，求集齐两套牌期望要胜利多少次。

<!-- .slide vertical=true -->

- 如果只是一套牌就很容易，可以状态压缩 DP，用 $F[S]$ 表示当前收集到的卡牌集合为 $S$ 时，收集一套卡牌**还需要**的胜利次数
- 很容易写出递归方程 $F[S] = 1 + \sum_{i} p_i F[S \cup \lbrace i\rbrace ]$
- 为方便，用 $m(S) = \sum_{i\in S} 2^i$ 表示状态。
  - F[m(S)] = 1 + $\sum_{i\in S} p_i F[m(S)] + \sum_{i\notin S} p_i F[m(S)+2^i]$
  - 直接计算即可

<!-- .slide vertical=true -->

- 两套牌如果用 DP，状态数为 $O(3^n)$, $n = 20$ 的情况下计算时间太长。
- 考虑引入 min-max 容斥进行计算
- $\max(S) = \sum_{T\subseteq S} (-1)^T \min(T)$
- 设 $a_1, a_2,\dots, a_n$ 为每种牌第二次出现的时间，那么本题就是在求 $\max_i a_i$
- 用 min-max 容斥，将题目转为，对于 1~n 的每个子集 T, 求这个子集中的元素第一次出现两次，期望游戏胜利的次数

<!-- .slide vertical=true -->

对于给定的 T，我们用动态规划求解 $\min(T)$

- F(S) 表示当前收集到的卡牌集合为 S 时，收集一套卡牌**还需要**的胜利次数。
  注意：这里 $S \subseteq T$.

- F(S) = $\sum_{u\notin T} p(u) F(S) + \sum_{u\in T-S} p(u)f(S\cup u) + 1$
- $[1 - \sum_{u\notin T}p(u)]F(S) = \sum_{u\in T-S}p(u)f(S\cup u) + 1$

定义 $P(T) = \sum_{u\in T}p(u)$

- $F(S) = \frac{1}{p(T)}\sum_{u\in T-S}p(u)f(S\cup u)+\color{#FF0000}{1}$

<!-- .slide vertical=true -->

$F(S) = \frac{1}{p(T)}\sum_{u\in T-S}p(u)f(S\cup u)+\color{#FF0000}{1}$

- 考虑每个 1 做的贡献，可得

  - $F(\emptyset) = \sum_{u_1, u_2, ..., u_k} \Pi_{i=1}^k \frac{p(u_i)}{P(T)} $, ($u_i \ne u_j$, $u_i \in T$)

- 进一步简化，可得：

  - $ F(\emptyset) = \sum\star{S\in T} \vert S\vert ! \Pi\star{u\in S} p(u) \times (\frac{1}{P(T)})^{\vert S\vert } $

- 定义 $G(T, j) = \sum_{S\in T,\vert S\vert =j} \vert S\vert ! \Pi_{u\in S} p(u)$,

结论：min(T) = $F(\emptyset) = \sum_{j=1}^{\vert T\vert } G(T, j) / p(T)^j$

<!-- .slide vertical=true -->

G 的计算：

- $G(T, j) = \sum_{S\in T,\vert S\vert =j} \vert S\vert ! \Pi_{u\in S} p(u)$

对于任意的 $v\in T$

- $\sum_{S\in T,\vert S\vert =j,v\notin S} \vert S\vert ! \Pi_{u\in S} p(u) = G(T-v, j)$
- $\sum_{S\in T,\vert S\vert =j,v\in S} \vert S\vert ! \Pi_{u\in S} p(u) = p(v) \cdot j \cdot G(T-v, j-1)$

因此 $G(T, j) = G(T - v, j) + p(v) \cdot j \cdot G(T-v, j-1)$, 预处理 G 的复杂度为 $O(n\cdot 2^n)$. 原问题计算所有 min(T) 的复杂度同样也是 $O(n\cdot 2^n)$.

<!-- .slide -->

## **L** Teams

<!-- .slide vertical=true -->

- 如果所有点的度数都很小，用并查集即可
- 对于每个点，log out 时让所在集合 size 减一
- log in 时直接开一个新点

<!-- .slide vertical=true -->

- 如果有的点度数很大怎么办？
- 把点分为两类，度数大于 $\sqrt{2M}$ 的为大度点，否则为小度点
- 大度点的个数不超过 $\sqrt{2M}$

<!-- .slide vertical=true -->

- 考虑一个大度点，当它在线的时候，会把它的所有在线好友合并到同一个队伍里
- 当它 log out 之后，下次再 log in 的时候，还需要处理它的所有邻居吗？
- 不需要的话，需要处理的是哪些呢？

<!-- .slide vertical=true -->

- 对于每个大度点，用 `unordered_set` 维护两个集合：
  1. 和它相邻的在线的点的集合，记为 S1
  2. 自上次 log out 之后发生过 log in 事件的、相邻的在线的点的集合，记为 S2（S2 一定是 S1 的子集）
- 当大度点 log in 之后，只需要处理 S2 中的所有点，以及在 S1 中找到一个不在 S2 中的点（若没有即忽略）
