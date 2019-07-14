---
title: Educational Codeforces Round 67(Rated for Div. 2)
categories:
  - ACM
  - 题解
---
[官方题解](https://codeforces.com/blog/entry/68111)

## [Stickers and Toys](https://vjudge.net/problem/CodeForces-1187A)

```c
#include <stdio.h>
int T, n, s, t;
int main()
{
	for (scanf("%d", &T); T--; printf("%d\n", n - (s < t ? s : t) + 1))
		scanf("%d%d%d", &n, &s, &t);
}
```

## [Letters Shop](https://vjudge.net/problem/CodeForces-1187B)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
vector<int> v[127];
char s[N];
int n, m;
int main()
{
	scanf("%d%s%d", &n, &s, &m);
	for (int i = 0; s[i]; ++i)
		v[s[i]].push_back(i);
	for (; m--; printf("%d\n", n + 1))
	{
		scanf("%s", s);
		vector<int> p(127);
		for (int i = n = 0; s[i]; ++i)
			n = max(n, v[s[i]][p[s[i]]++]);
	}
}
```

## [Vasya And Array](https://vjudge.net/problem/CodeForces-1187C)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1023;
vector<pair<int, int>> v;
int n, m, ans[N], a[N];
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 0, t, l, r; i < m; ++i)
	{
		scanf("%d%d%d", &t, &l, &r);
		if (t)
			fill(a + l, a + r, 1);
		else
			v.emplace_back(l, r);
	}
	ans[1] = n;
	for (int i = 1; i < n; ++i)
		ans[i + 1] = a[i] ? ans[i] : ans[i] - 1;
	for (auto p : v)
		if (is_sorted(ans + p.first, ans + p.second + 1))
			return printf("NO"), 0;
	printf("YES\n");
	for (int i = 1; i <= n; ++i)
		printf("%d ", ans[i]);
}
```

## [Subarray Sorting](https://vjudge.net/problem/CodeForces-1187D)

```cpp
#include <bits/stdc++.h>
using namespace std;
struct Fenwick : vector<int>
{
	Fenwick(int n) : vector<int>(n) {}
	void upd(int x, int k)
	{
		for (; x < size(); x += x & -x)
			at(x) = max(at(x), k);
	}
	int ask(int x)
	{
		int r = 0;
		for (; x; x -= x & -x)
			r = max(r, at(x));
		return r;
	}
};
int main()
{
	int t, n, ans;
	for (scanf("%d", &t); t--; puts(ans ? "YES" : "NO"))
	{
		scanf("%d", &n);
		vector<int> a(n + 1);
		vector<deque<int>> v(n + 1);
		for (int i = 1; i <= n; ++i)
			scanf("%d", &a[i]);
		for (int i = 1, b; i <= n; ++i)
			scanf("%d", &b), v[b].push_back(i);
		Fenwick t(n + 9);
		for (int i = ans = 1; i <= n; ++i)
		{
			if (v[a[i]].empty() || t.ask(a[i] - 1) > v[a[i]].front())
			{
				ans = 0;
				break;
			}
			t.upd(a[i], v[a[i]].front());
			v[a[i]].pop_front();
		}
	}
}
```

## [Tree Painting](https://vjudge.net/problem/CodeForces-1187E)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 2e5 + 9;
vector<int> g[N];
ll n, siz[N], sum[N];
void dfs(int u, int fa)
{
	for (int to : g[u])
		if (to != fa)
		{
			dfs(to, u);
			siz[u] += siz[to];
			sum[u] += sum[to];
		}
	sum[u] += ++siz[u];
}
void dfs2(int u, int fa)
{
	if (fa)
		sum[u] = (sum[fa] - siz[u]) + (n - siz[u]);
	for (int to : g[u])
		if (to != fa)
			dfs2(to, u);
}
int main()
{
	scanf("%lld", &n);
	for (int i = 1, u, v; i < n; ++i)
	{
		scanf("%d%d", &u, &v);
		g[u].push_back(v);
		g[v].push_back(u);
	}
	dfs(1, 0);
	dfs2(1, 0);
	printf("%lld", *max_element(sum + 1, sum + n + 1));
}
```
