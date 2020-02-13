---
title: "Codeforces Round #556 (Div. 2)"
tags:
  - ACM
  - 题解
---

[官方题解](https://codeforces.com/blog/entry/66783)

签到五分钟，发呆两小时…

## [Stock Arbitraging](https://vjudge.net/problem/CodeForces-1150A)

```cpp
#include <bits/stdc++.h>
using namespace std;
int n, m, r, s = 1e9, b;
int main()
{
	scanf("%d%d%d", &n, &m, &r);
	for (int i = 0, t; i < n; ++i)
		scanf("%d", &t), s = min(s, t);
	for (int j = 0, t; j < m; ++j)
		scanf("%d", &t), b = max(b, t);
	if (b > s)
		r += r / s * (b - s);
	printf("%d", r);
}
```

## [Tiling Challenge](https://vjudge.net/problem/CodeForces-1150B)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 63;
char s[N][N];
int n;
bool check(int x, int y)
{
	if (x < 0 || x >= n || y < 0 || y >= n || s[x][y] == '#')
		return 1;
	return s[x][y] = '#', 0;
}
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; ++i)
		scanf("%s", s[i]);
	for (int i = 0; i < n; ++i)
		for (int j = 0; j < n; ++j)
			if (s[i][j] != '#')
				if (check(i, j) || check(i + 1, j - 1) || check(i + 1, j) || check(i + 1, j + 1) || check(i + 2, j))
					return printf("NO"), 0;
	printf("YES");
}
```

## [Prefix Sum Primes](https://vjudge.net/problem/CodeForces-1150C)

尽量凑 2 和奇数即可。

```cpp
#include <bits/stdc++.h>
using namespace std;
int n, m;
int main()
{
	scanf("%d", &n);
	for (int i = 0, t; i < n; ++i)
		scanf("%d", &t), m += t & 1;
	if (n -= m)
		printf("2 "), --n;
	if (m)
		printf("1 "), --m;
	for (int i = 0; i < n; ++i)
		printf("2 ");
	for (int i = 0; i < m; ++i)
		printf("1 ");
}
```

## [Three Religions](https://vjudge.net/problem/CodeForces-1150D)

现场想到 DP，无奈还是不会敲…

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9, M = 255;
char s[N], d[5][M];
int n, q, len[5], f[M][M][M], nxt[N][31];
int main()
{
	scanf("%d%d%s", &n, &q, s + 1);
	fill(nxt[n + 1], nxt[n + 1] + 26, n + 1);
	fill(nxt[n], nxt[n] + 26, n + 1);
	for (int i = n; i; --i)
	{
		copy(nxt[i], nxt[i] + 26, nxt[i - 1]);
		nxt[i - 1][s[i] - 'a'] = i;
	}
	for (int x; q--; printf(f[len[1]][len[2]][len[3]] <= n ? "YES\n" : "NO\n"))
	{
		scanf("%s%d", s, &x);
		if (s[0] == '-')
		{
			--len[x];
			continue;
		}
		scanf("%s", &d[x][++len[x]]);
		for (int i = x == 1 ? len[x] : 0; i <= len[1]; ++i)
			for (int j = x == 2 ? len[x] : 0; j <= len[2]; ++j)
				for (int k = x == 3 ? len[x] : 0; k <= len[3]; ++k)
				{
					f[i][j][k] = n + 1;
					if (i)
						f[i][j][k] = min(f[i][j][k], nxt[f[i - 1][j][k]][d[1][i] - 'a']);
					if (j)
						f[i][j][k] = min(f[i][j][k], nxt[f[i][j - 1][k]][d[2][j] - 'a']);
					if (k)
						f[i][j][k] = min(f[i][j][k], nxt[f[i][j][k - 1]][d[3][k] - 'a']);
				}
	}
}
```

## [Tree Generator™](https://vjudge.net/problem/CodeForces-1150E)

线段树来维护答案。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
char s[N];
struct Node
{
	int sum, pmx, lmx, mi, ma, d;
	friend Node operator+(const Node &l, const Node &r)
	{
		return {l.sum + r.sum,
				max(l.pmx, max(r.ma - 2 * l.mi + l.sum, r.pmx - l.sum)),
				max(l.lmx, max(r.lmx - l.sum, l.ma - 2 * r.mi - 2 * l.sum)),
				min(l.mi, r.mi + l.sum),
				max(l.ma, r.ma + l.sum),
				max(max(l.d, r.d), max(l.ma + r.pmx - l.sum, l.lmx + l.sum + r.ma))};
	}
} v[N * 4];
void build(int l, int r, int x = 1)
{
	if (l == r)
	{
		r = s[l] == '(' ? 1 : -1, v[x] = {r, -r, -r, r, r, 0};
		return;
	}
	int m = l + r >> 1;
	build(l, m, x << 1);
	build(m + 1, r, x << 1 | 1);
	v[x] = v[x << 1] + v[x << 1 | 1];
}
void update(int l, int r, int p, int x = 1)
{
	if (l == r)
		return build(l, r, x);
	int m = l + r >> 1;
	if (p <= m)
		update(l, m, p, x << 1);
	else
		update(m + 1, r, p, x << 1 | 1);
	v[x] = v[x << 1] + v[x << 1 | 1];
}
int main()
{
	int n, m, x, y;
	scanf("%d%d%s", &n, &m, s + 1);
	build(1, n = n * 2 - 2);
	for (printf("%d\n", v[1].d); m--; printf("%d\n", v[1].d))
		scanf("%d%d", &x, &y),
			swap(s[x], s[y]),
			update(1, n, x),
			update(1, n, y);
}
```
