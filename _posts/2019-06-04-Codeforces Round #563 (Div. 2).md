---
title: "Codeforces Round #563 (Div. 2)"
tags:
  - ACM
  - 题解
---

[官方题解](https://codeforces.com/blog/entry/67388)

B 题沙雕了，卡了四十分钟，然后突然发现排序一下就好了…

把 E 转成组合数学的模型后发现还是不会求…

F 一觉醒来 TLE99，然后发现原来按照子树深度去筛点的做法最坏情况下要查询根号次…

## [Ehab Fails to Be Thanos](https://vjudge.net/problem/CodeForces-1174A)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1023;
long long s1, s2;
int n, a[2 * N];
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < 2 * n; ++i)
		scanf("%d", &a[i]), s1 += a[i];
	sort(a, a + 2 * n);
	for (int i = 0; i < n; ++i)
		s2 += a[i];
	if (s2 * 2 == s1)
		return printf("-1"), 0;
	for (int i = 0; i < 2 * n; ++i)
		printf("%d ", a[i]);
}
```

## [Ehab Is an Odd Person](https://vjudge.net/problem/CodeForces-1174B)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, cnt[2], a[N];
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; ++i)
		scanf("%d", &a[i]), ++cnt[a[i] & 1];
	if (cnt[0] && cnt[1])
		sort(a, a + n);
	for (int i = 0; i < n; ++i)
		printf("%d ", a[i]);
}
```

## [Ehab and a Special Coloring Problem](https://vjudge.net/problem/CodeForces-1174C)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, a[N];
int main()
{
	scanf("%d", &n);
	for (int i = 2, tot = 0; i <= n; ++i)
	{
		a[i] = N;
		for (int j = 2; a[i] == N && j * j <= i; ++j)
			if (i % j == 0)
				a[i] = a[j];
		if (a[i] == N)
			a[i] = ++tot;
	}
	for (int i = 2; i <= n; ++i)
		printf("%d ", a[i]);
}
```

## [Ehab and the Expected XOR Problem](https://vjudge.net/problem/CodeForces-1174D)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1 << 18;
int n, x, y, a[N];
int main()
{
	scanf("%d %d", &n, &x);
	if (x >= (1 << n))
	{
		printf("%d\n", (1 << n) - 1);
		for (int i = 0, len = (1 << n) - 1; i < len; ++i)
		{
			int t = i ^ (i + 1);
			printf("%d ", t);
		}
		return 0;
	}
	for (y = 1; y <= x; y <<= 1)
		if (y & x)
			break;
	printf("%d\n", (1 << n - 1) - 1);
	for (int i = 0, len = (1 << n - 1) - 1; i < len; ++i)
	{
		int t = i ^ (i + 1);
		t = t % y + t / y * 2 * y;
		printf("%d ", t);
	}
}
```

## [Ehab and the Expected GCD Problem](https://vjudge.net/problem/CodeForces-1174E)

```c
#include <stdio.h>
#include <math.h>
#define N 1000007
#define M 1000000007
typedef long long ll;
ll n, b = 1, dp[2][N][2];
int main()
{
	scanf("%I64d", &n);
	ll v = 1 << (ll)log2(n), u = v / 2 * 3;
	for (dp[0][1][0] = 1, dp[0][1][1] = u <= n; u >>= 1, v >>= 1, v >= 1; b ^= 1)
		for (ll j = 1, w = n / v, x = n / (v * 2), y = n / (v * 3), z = n / u; j <= w; ++j)
			dp[b][j][0] = (dp[b][j - 1][0] * (w - (j - 1)) % M + dp[b ^ 1][j - 1][0] * (w - x) % M + dp[b ^ 1][j - 1][1] * (w - y) % M) % M,
			dp[b][j][1] = (dp[b][j - 1][1] * (z - (j - 1)) % M + dp[b ^ 1][j - 1][1] * (z - y) % M) % M;
	printf("%I64d", dp[b ^ 1][n][0]);
}
```

## [Ehab and the Big Finale](https://vjudge.net/problem/CodeForces-1174F)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
vector<int> g[N];
int n, dx, d[N], sz[N], ch[N], to[N];
int query(char c, int u)
{
	return printf("%c %d\n", c, u), fflush(stdout), scanf("%d", &u), u;
}
void build(int u)
{
	sz[to[u] = u] = 1;
	for (int c : g[u])
		if (!sz[c])
		{
			d[c] = d[u] + 1;
			build(c);
			sz[u] += sz[c];
			if (sz[ch[u]] < sz[c])
				to[u] = to[ch[u] = c];
		}
}
int dfs(int u)
{
	for (int dy = dx + d[to[u]] - query('d', to[u]) >> 1; d[u] < dy;)
		u = ch[u];
	return d[u] == dx ? u : dfs(query('s', u));
}
int main()
{
	scanf("%d", &n);
	for (int i = 1, x, y; i < n; ++i)
	{
		scanf("%d%d", &x, &y);
		g[x].push_back(y);
		g[y].push_back(x);
	}
	build(1);
	dx = query('d', 1);
	printf("! %d\n", dfs(1));
}
```
