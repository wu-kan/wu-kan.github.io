---
title: 15-Puzzle Problem
categories:
- 人工智能
- 实验
---
## IDA* Algorithm

### Description

Iterative deepening A* (IDA*) was ﬁrst described by Richard Korf in 1985, which is a graph traversal and path search algorithm that can ﬁnd the shortest path between a designated start node and any member of a set of goal nodes in a weighted graph.

It is a variant of **iterative deepening depth-ﬁrst search** that borrows the idea to use a heuristic function to evaluate the remaining cost to get to the goal from the **A\* search algorithm**.

Since it is a depth-ﬁrst search algorithm, its memory usage is lower than in A*, but unlike ordinary iterative deepening search, it concentrates on exploring the most promising nodes and thus does not go to the same depth everywhere in the search tree.

**Iterative-deepening-A\* works as follows:** at each iteration, perform a depth-ﬁrst search, cutting oﬀ a branch when its total cost f(n) = g(n)+h(n) exceeds a given threshold. This threshold starts at the estimate of the cost at the initial state, and increases for each iteration of the algorithm. At each iteration, the threshold used for the next iteration is the minimum cost of all values that exceeded the current threshold.

## Tasks

- Please solve 15-Puzzle problem by using IDA* (Python or C++). You can use one of the two commonly used heuristic functions: h1 = the number of misplaced tiles. h2 = the sum of the distances of the tiles from their goal positions.
- Here are 4 test cases for you to verify your algorithm correctness. You can also play this game (15puzzle.zip) for more information.

## Codes

代码做了如下剪枝：

- 使用所有元素到目标位置的曼哈顿距离之和作为预估函数
- 通过逆序对判断是否有解
- 针对路径判重或判环实测代价比较大，这里仅判断了回路

> - 在算N数码的逆序数时，不把0算入在内；
> - 当N为奇数时，当两个N数码的逆序数奇偶性相同时，可以互达，否则不行；
> - 当N为偶数时，当两个N数码的奇偶性相同的话，那么两个N数码中的0所在行的差值k，k也必须是偶数时，才能互达；
> - 当两个N数码的奇偶性不同时，那么两个N数码中的0所在行的差值k，k也必须是奇数时，才能互达；

```cpp
#include <bits/stdc++.h>
#define DIST(x, y) (abs((a[x][y] - 1) / 4 - (x)) + abs((a[x][y] - 1) % 4 - (y)))
using namespace std;
int t, a[4][4], ans[64];
int dfs(int cur, int h, int x, int y, int dep)
{
	if (cur + h > dep)
		return 0;
	if (!h)
	{
		for (int i = 0; i < cur; ++i)
			printf("%c", "RLDU"[ans[i]]);
		return 1;
	}
	for (int i = 0, dx[] = {0, 0, 1, -1}, dy[] = {1, -1, 0, 0}, tx, ty; i < 4; ++i)
		if (0 <= min(tx = x + dx[i], ty = y + dy[i]) && max(tx, ty) < 4)
			if (!cur || i != (ans[cur - 1] ^ 1))
			{
				ans[cur] = i;
				int t = DIST(tx, ty);
				swap(a[x][y], a[tx][ty]);
				if (dfs(cur + 1, h - t + DIST(x, y), tx, ty, dep))
					return 1;
				swap(a[x][y], a[tx][ty]);
			}
	return 0;
}
int main()
{
	int t;
	for (scanf("%d", &t); t--; printf("\n"))
	{
		int h = 0, inv = 0, sx, sy;
		for (int x = 0; x < 4; ++x)
			for (int y = 0; y < 4; ++y)
			{
				scanf("%d", &a[x][y]);
				if (a[x][y])
				{
					h += DIST(x, y);
					for (int i = x << 2 | y, j = 0; j < i; ++j)
						inv += a[j / 4][j % 4] > a[x][y];
				}
				else
					sx = x, sy = y;
			}
		if ((inv + sx) & 1)
			for (int dep = h; !dfs(0, h, sx, sy, dep);)
				++dep;
		else
			printf("This puzzle is not solvable.");
	}
}
```

## Results

### 本地测试

#### input

使用了TA演示中的数据。

```autoit
4
11 3 1 7
4 6 8 2
15 9 10 13
14 12 5 0
14 10 6 0
4 9 1 8
2 3 5 11
12 13 7 15
0 5 15 14
7 9 6 13
1 2 12 10
8 11 4 3
6 10 3 15
14 8 7 11
5 1 0 2
13 12 9 4
```

#### output

```bash
LLURRDLURULLURDLLURDDRRULLDLURRDLLDRRULLDRUURULDRRULDRDD
LLDLURDRULDDLUURDDRRUULLDDDLURDRULDLUURRRDLLURDDR
DRDLURULDRDDLUURRDRDLLURURDDLUUURDDDLUUULLDDRDRUUURDDDLULLDRRR
DLLURRURDDLLURURULDRDLULLDDRRULUULDDDRUUURRDLDRD
```

### [在线测试](https://vjudge.net/problem/UVA-10181)

[WuK's solution for [UVA-10181]](https://vjudge.net/solution/21644000)，运行时间150ms。
