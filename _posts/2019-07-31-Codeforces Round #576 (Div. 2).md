---
title: "Codeforces Round #576 (Div. 2)"
categories:
- ACM
- 题解
---
[官方题解](https://codeforces.com/blog/entry/68812)

终于上紫辣。

## [City Day](https://vjudge.net/problem/CodeForces-1199A)

拿到题目第一时间想敲一个单调队列的我怕不是个傻子…

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, x, y, a[N];
int main()
{
	scanf("%d%d%d", &n, &x, &y);
	for (int i = 0; i < n; ++i)
		scanf("%d", &a[i]);
	for (int d = 0; d < n; ++d)
	{
		int ok = 1;
		for (int j = max(d - x, 0), jend = min(d + y + 1, n); j < jend; ++j)
			if (j != d && a[j] <= a[d])
			{
				ok = 0;
				break;
			}
		if (ok)
			return printf("%d", d + 1), 0;
	}
}
```

## [Water Lily](https://vjudge.net/problem/CodeForces-1199B)

```c
#include <stdio.h>
double h, l;
int main() { scanf("%lf%lf", &h, &l), printf("%.9f", (l * l - h * h) * 0.5 / h); }
```

## [MP3](https://vjudge.net/problem/CodeForces-1199C)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 9;
int n, I, a[N];
int main()
{
	scanf("%d%d", &n, &I);
	for (int i = 0; i < n; ++i)
		scanf("%d", &a[i]);
	sort(a, a + n);
	int ans = n - 1, len = min(1e7, pow(2, I * 8 / n));
	for (int i = 1, j = 0, c = 1; i < n; ++i)
	{
		if (a[i] != a[i - 1])
			++c;
		if (c > len)
		{
			while (j < n - 1 && a[j] == a[j + 1])
				++j;
			++j;
			--c;
		}
		ans = min(ans, n - (i - j + 1));
	}
	printf("%d", ans);
}
```

## [Welfare State](https://vjudge.net/problem/CodeForces-1199D)

现场快速码了一个吉司机线段树搞过了这个题，事实上这个题是有很漂亮的离线解法的。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 9;
int n, m, o[N], b[N], c[N], a[N];
int main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i)
		o[i] = 1, b[i] = i, scanf("%d", &c[i]);
	scanf("%d", &m);
	for (int i = n + 1; i <= n + m; ++i)
	{
		scanf("%d%d", &o[i], &b[i]);
		if (o[i] == 1)
			scanf("%d", &c[i]);
	}
	for (int i = n + m, ma = 0; i; --i)
	{
		if (o[i] != 1)
			ma = max(ma, b[i]);
		else if (!a[b[i]])
			a[b[i]] = max(c[i], ma) + 1;
	}
	for (int i = 1; i <= n; ++i)
		printf("%d ", a[i] - 1);
}
```

## [Matching vs Independent Set](https://vjudge.net/problem/CodeForces-1199E)

现场还是一个小时十分钟毫无进展，想的是“可以用$O(n)$找独立集，我只要再找一个$O(n)$求一个匹配的方法就好了”，这样就走进死胡同了。

还是有点巧妙的，毕竟没想到。

```cpp
#include <bits/stdc++.h>
using namespace std;
int t, n, m;
int main()
{
	for (scanf("%d", &t); t--; printf("\n"))
	{
		scanf("%d%d", &n, &m);
		vector<int> f(3 * n + 1, 1), ans;
		for (int i = 1, x, y; i <= m; ++i)
		{
			scanf("%d%d", &x, &y);
			if (f[x] && f[y])
				f[x] = f[y] = 0, ans.push_back(i);
		}
		if (ans.size() < n)
		{
			printf("IndSet\n");
			for (int i = 1, c = 0; c < n; ++i)
				if (f[i])
					printf("%d ", i), ++c;
		}
		else
		{
			printf("Matching\n");
			for (int i = 0; i < n; ++i)
				printf("%d ", ans[i]);
		}
	}
}
```

## [Rectangle Painting 1](https://vjudge.net/problem/CodeForces-1199F)

现场只有几个人过了这个题，所以当时根本没看…赛后看这个题马上就想出$O(n^5)$DP的做法了，非常后悔有大把时间想前一题都不知道读一下这一题。哎。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 63;
char s[N][N];
int n, f[N][N][N][N], vis[N][N][N][N];
int dp(int xl, int yl, int xr, int yr)
{
	int &v = vis[xl][yl][xr][yr], &w = f[xl][yl][xr][yr];
	if (v)
		return w;
	v = 1;
	if (xl == xr && yl == yr)
		return w = s[xl][yl] == '#';
	w = max(xr - xl + 1, yr - yl + 1);
	for (int i = xl; i < xr; ++i)
		w = min(w, dp(xl, yl, i, yr) + dp(i + 1, yl, xr, yr));
	for (int i = yl; i < yr; ++i)
		w = min(w, dp(xl, yl, xr, i) + dp(xl, i + 1, xr, yr));
	return w;
}
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; ++i)
		scanf("%s", s[i]);
	printf("%d", dp(0, 0, n - 1, n - 1));
}
```
