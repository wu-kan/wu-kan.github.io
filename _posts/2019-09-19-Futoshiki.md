---
title: Futoshiki
categories:
- 人工智能
- 实验
---
## Problem Description

Futoshiki is a board-based puzzle game, also known under the name Unequal. It is playable on a square board having a given fixed size (4×4 for example).

The purpose of the game is to discover the digits hidden inside the board’s cells; each cell is filled with a digit between 1 and the board’s size. On each row and column each digit appears exactly once; therefore, when revealed, the digits of the board form a so-called Latin square.

At the beginning of the game some digits might be revealed. The board might also contain some inequalities between the board cells; these inequalities must be respected and can be used as clues in order to discover the remaining hidden digits.

Each puzzle is guaranteed to have a solution and only one. You can play this game online: <http://www.futoshiki.org/>.

Please solve the above Futoshiki puzzle ( Figure 1 ) with forward checking algorithm.

## Codes

### futoshiki.cpp

下为运行代码。值得一提的是，这里表示可行域使用了位集`bitset`，从而把剪枝操作等都转化成了位运算，极大地提升了运行效率，最终运行时间仅有 0.019s。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 9;
array<vector<int>, N * N> notEqual, greaterThan, lessThan;
array<int, N * N> ans;
bool fc(array<bitset<N>, N * N> &v, int pos) //对状态v进行前向检测剪枝
{
	int mi = v[pos]._Find_first(), ma = mi;
	for (int j = mi, jnex, je = v[pos].size(); j < je; j = jnex)
		if ((jnex = v[pos]._Find_next(j)) >= je)
			ma = j;
	if (mi == ma)
		for (int j : notEqual[pos])
		{
			v[j].reset(mi);
			if (v[j].none())
				return 0;
		}
	for (int j : lessThan[pos])
	{
		v[j] &= (1 << ma) - 1;
		if (v[j].none())
			return 0;
	}
	for (int j : greaterThan[pos])
	{
		v[j] &= -1 << mi + 1;
		if (v[j].none())
			return 0;
	}
	return 1;
}
bool dfs(const array<bitset<N>, N * N> &v)
{
	int pick = v.size();
	for (int i = 0, now, save = v.size(); i < v.size(); ++i)
		if (!ans[i] && save > (now = v[i].count())) //MRV
			if (pick = i, (save = now) == 1)		//这里可以提前退出
				break;
	if (pick == v.size()) //没有选出点，说明找到答案
		return 1;
	for (int i = v[pick]._Find_first(); i < v[pick].size(); i = v[pick]._Find_next(i)) //遍历当前考虑的下标pick，他的可行值域{i}
	{
		auto tv = v;
		tv[pick] = 1 << i;
		ans[pick] = i + 1;
		if (fc(tv, pick) && dfs(tv))
			return 1;
	}
	return ans[pick] = 0;
}
int main()
{
	array<bitset<N>, N * N> v; //使用bitset记录状态，方便判重
	for (int i = 0, t; i < N; ++i)
		for (int j = 0; j < N; ++j)
		{
			scanf("%d", &t);
			v[i * N + j] = t ? 1 << t - 1 : (1 << N) - 1; //0代表所有状态都可行，因此将原值翻转
			for (int k = 0; k < N; ++k)
			{
				if (k != i)
					notEqual[i * N + j].push_back(k * N + j);
				if (k != j)
					notEqual[i * N + j].push_back(i * N + k);
			}
		}
	for (int x1, x2, y1, y2; scanf("%d%d%d%d", &x1, &y1, &x2, &y2) != EOF;)
	{
		greaterThan[y1 += N * x1].push_back(y2 += N * x2);
		lessThan[y2].push_back(y1);
	}
	for (int k = 0; k < 4; ++k) //进行多次预剪枝，大幅减小搜索空间
		for (int i = 0; i < v.size(); ++i)
			fc(v, i);
	if (dfs(v))
		for (int i = 0; i < ans.size(); ++i)
			printf("%d%c", ans[i], i % N < N - 1 ? ' ' : '\n');
	else
		printf("No solution exists.");
}
```

### futoshiki.txt

下为输入数据。

```autoit
0 0 0 7 3 8 0 5 0
0 0 7 0 0 2 0 0 0
0 0 0 0 0 9 0 0 0
0 0 0 4 0 0 0 0 0
0 0 1 0 0 0 6 4 0
0 0 0 0 0 0 2 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 0
0 0 0 0 0 0 0 0 6
0 0 0 1
0 3 0 2
1 3 1 4
1 6 1 7
2 6 1 6
2 1 2 0
2 2 2 3
2 3 3 3
4 1 3 1
3 3 3 2
3 5 3 4
3 5 3 6
4 5 3 5
3 8 3 7
4 0 4 1
5 4 4 4
5 8 4 8
5 1 5 2
5 1 6 1
5 4 5 5
5 7 5 6
6 6 5 6
6 8 5 8
6 3 6 4
7 7 6 7
7 1 8 1
8 2 7 2
7 5 8 5
8 8 7 8
8 5 8 6
```

### 运行结果

```bash
$ g++ futoshiki.cpp -o futoshiki.out -O3
futoshiki.cpp: In function ‘int main()’:
futoshiki.cpp:58:9: warning: ignoring return value of ‘int scanf(const char*, ...)’, declared with attribute warn_unused_result [-Wunused-result]
    scanf("%d", &t);
    ~~~~~^~~~~~~~~~
$ time ./futoshiki.out < futoshiki.txt
1 6 9 7 3 8 4 5 2
4 1 7 5 6 2 8 9 3
8 7 2 3 1 9 5 6 4
3 9 6 4 8 5 7 2 1
2 5 1 9 7 3 6 4 8
9 3 4 8 5 6 2 1 7
6 4 3 2 9 7 1 8 5
5 2 8 6 4 1 3 7 9
7 8 5 1 2 4 9 3 6

real    0m0.019s
user    0m0.016s
sys     0m0.000s
```
