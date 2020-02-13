---
title: 2018-2019 ACM-ICPC Southeastern European Regional Programming Contest (SEERC 2018)
tags:
  - ACM
  - 题解
---

## [Broken Watch](https://vjudge.net/problem/Gym-101964B)

假如三根指针等长，答案是$C_n^3-3*C_{\lfloor\frac{n-1}{2}\rfloor}$。

两根指针等长，在上述答案上乘 2；三根指针不等长，在上述答案上乘 6。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ll;
ll a, b, c, n;
int main()
{
	scanf("%llu%llu%llu%llu", &a, &b, &c, &n);
	ll tmp[3] = {n, n - 1, n - 2};
	for (ll i = 2; i < 4; ++i)
		for (int j = 0; j < 3; ++j)
			if (tmp[j] % i == 0)
			{
				tmp[j] /= i;
				break;
			}
	ll ans = tmp[0] * tmp[1] * tmp[2];
	tmp[0] = n - 1 >> 1;
	tmp[1] = tmp[0] - 1;
	tmp[2] = n;
	for (int j = 0, i = 2; j < 3; ++j)
		if (tmp[j] % i == 0)
		{
			tmp[j] /= i;
			break;
		}
	ans -= tmp[0] * tmp[1] * tmp[2];
	if (a != b && b != c && c != a)
		ans *= 6;
	else if (a != b || b != c || c != a)
		ans *= 3;
	printf("%llu", ans);
}
```

## [Tree](https://vjudge.net/problem/Gym-101964C)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 127, INF = 1e9;
vector<int> g[N];
int n, m, ans = INF, p[N], a[N][N];
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 0; i < n; ++i)
	{
		fill(a[i], a[i] + n, INF);
		a[i][i] = 0;
		scanf("%d", &p[i]);
	}
	for (int i = 1, u, v; i < n; ++i)
	{
		scanf("%d%d", &u, &v);
		g[--u].push_back(--v);
		g[v].push_back(u);
		a[u][v] = a[v][u] = 1;
	}
	for (int k = 0; k < n; ++k)
		for (int i = 0; i < n; ++i)
			for (int j = 0; j < n; ++j)
				a[i][j] = min(a[i][j], a[i][k] + a[k][j]);
	for (int i = 0; i < n; ++i)
	{
		vector<int> vis(n, 0), v;
		for (deque<int> q(vis[i] = 1, i);; q.pop_front())
		{
			if (p[q.front()])
				v.push_back(q.front());
			if (v.size() >= m)
				break;
			for (auto to : g[q.front()])
				if (!vis[to])
					q.push_back(to), vis[to] = 1;
		}
		int tmp = 0;
		for (auto j : v)
			for (auto k : v)
				tmp = max(tmp, a[j][k]);
		ans = min(ans, tmp);
	}
	printf("%d", ans);
}
```

## [Fishermen](https://vjudge.net/problem/Gym-101964E)

理解这个题的意思之后提出一种新的方案：计算每条 🐟 对答案的贡献。因为懒的离散化，这里用风骚的动态开点线段树做掉。
{% raw %}

```cpp
#include <bits/stdc++.h>
using namespace std;
const int NPOS = -1;
typedef int ll;
struct SegmentTree
{
	struct Val
	{
		int l, r;
		ll sum;
		void upd(ll mul, ll add) { sum = sum * mul + add * (r - l + 1); }
	};
	struct Node
	{
		Val v;
		int lc, rc;
		ll mul, add;
	};
	vector<Node> v;
	SegmentTree(int l, int r) { build(l, r); }
	void build(int l, int r) { v.push_back({{l, r, 0}, NPOS, NPOS, 1, 0}); }
	Val up(const Val &lc, const Val &rc) { return {lc.l, rc.r, lc.sum + rc.sum}; }
	void down(int rt)
	{
		int m = v[rt].v.l + v[rt].v.r >> 1;
		if (v[rt].lc == NPOS)
			v[rt].lc = v.size(), build(v[rt].v.l, m);
		if (v[rt].rc == NPOS)
			v[rt].rc = v.size(), build(m + 1, v[rt].v.r);
		upd(v[v[rt].lc].v.l, v[v[rt].lc].v.r, v[rt].mul, v[rt].add, v[rt].lc);
		upd(v[v[rt].rc].v.l, v[v[rt].rc].v.r, v[rt].mul, v[rt].add, v[rt].rc);
		v[rt].mul = 1, v[rt].add = 0;
	}
	void upd(int l, int r, ll mul, ll add, int rt = 0)
	{
		if (l <= v[rt].v.l && v[rt].v.r <= r)
			return v[rt].mul *= mul, v[rt].add = v[rt].add * mul + add, v[rt].v.upd(mul, add);
		down(rt);
		if (r <= v[v[rt].lc].v.r)
			upd(l, r, mul, add, v[rt].lc);
		else if (l >= v[v[rt].rc].v.l)
			upd(l, r, mul, add, v[rt].rc);
		else
			upd(l, v[v[rt].lc].v.r, mul, add, v[rt].lc), upd(v[v[rt].rc].v.l, r, mul, add, v[rt].rc);
		v[rt].v = up(v[v[rt].lc].v, v[v[rt].rc].v);
	}
	Val ask(int l, int r, int rt = 0)
	{
		if (l <= v[rt].v.l && v[rt].v.r <= r)
			return v[rt].v;
		down(rt);
		if (r <= v[v[rt].lc].v.r)
			return ask(l, r, v[rt].lc);
		if (l >= v[v[rt].rc].v.l)
			return ask(l, r, v[rt].rc);
		return up(ask(l, v[v[rt].lc].v.r, v[rt].lc), ask(v[v[rt].rc].v.l, r, v[rt].rc));
	}
} t(1, 1e9);
int n, m, l;
int main()
{
	scanf("%d%d%d", &n, &m, &l);
	for (int i = 0, x, y; i < n; ++i)
	{
		scanf("%d%d", &x, &y);
		int a = x + y - l, b = x - y + l;
		if (a > b)
			continue;
		if (a < 1)
			a = 1;
		if (b > 1e9)
			b = 1e9;
		t.upd(a, b, 1, 1);
	}
	for (int i = 0, x; i < m; ++i)
		scanf("%d", &x), printf("%d\n", t.ask(x, x).sum);
}
```

{% endraw %}

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
typedef int ll;
struct BaseFenwick
{
	vector<ll> v;
	BaseFenwick(int n) : v(n, 0) {}
	void add(int x, ll w)
	{
		for (; x < v.size(); x += x & -x)
			v[x] += w;
	}
	ll ask(int x)
	{
		ll ans = 0;
		for (; x; x -= x & -x)
			ans += v[x];
		return ans;
	}
};
struct Point
{
	int x, y, id;
	bool operator<(const Point &rhs) const
	{
		if (x != rhs.x)
			return x < rhs.x;
		if (y != rhs.y)
			y < rhs.y;
		return id < rhs.id;
	}
};
struct Ranker : vector<int>
{
	void init()
	{
		sort(begin(), end()), resize(unique(begin(), end()) - begin());
	}
	int ask(int y)
	{
		return lower_bound(begin(), end(), y) - begin();
	}
} rk;
int n, m, l, ans[N];
int main()
{
	vector<Point> p;
	scanf("%d%d%d", &n, &m, &l);
	for (int i = 0, x, y; i < n; ++i)
	{
		scanf("%d%d", &x, &y);
		p.push_back({y + x, y - x, -1});
	}
	for (int i = 0, x; i < m; ++i)
	{
		scanf("%d", &x);
		p.push_back({l + x, l - x, i});
	}
	sort(p.begin(), p.end());
	for (int i = 0; i < p.size(); ++i)
		rk.push_back(p[i].y);
	rk.init();
	BaseFenwick t(rk.size() + 9);
	for (int i = 0, j = 0; i < p.size(); ++i)
	{
		for (; p[j].x < p[i].x - l * 2; ++j)
			if (p[j].id < 0)
				t.add(rk.ask(p[j].y) + 1, -1);
		if (p[i].id < 0)
			t.add(rk.ask(p[i].y) + 1, 1);
		else
			ans[p[i].id] = t.ask(rk.ask(p[i].y) + 1) - t.ask(rk.ask(p[i].y - l * 2));
	}
	for (int i = 0; i < m; ++i)
		printf("%d\n", ans[i]);
}
```

## [Inversion](https://vjudge.net/problem/Gym-101964I)

首先，我们要把原序列还原，根据逆序对的性质，还原出原序列。接着，根据题意两个对集合的定义，可以知道选出的那个点集是从左到右升序的，且点集中最小的点在序列中左边没有比它更小的点，最大的点在序列中右边没有比它更大的点，所以我们可以进行 dp，dp[i]表示以 i 为点集最后一个点的答案的数量。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 127;
ll f[N];
int n, m, d[N], p[N], vis[N];
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 0, x, y; i < m; ++i)
	{
		scanf("%d%d", &x, &y);
		++d[min(--x, --y)];
	}
	for (int i = 0; i < n; ++i)
		for (int j = 0; j < n; ++j)
			if (!vis[j])
			{
				if (d[i])
					--d[i];
				else
				{
					p[i] = j;
					vis[j] = 1;
					break;
				}
			}
	p[n] = n;
	for (int i = 0; i <= n; ++i)
	{
		for (int j = i - 1, mx = -1; ~j; --j)
			if (mx < p[j] && p[j] < p[i])
				mx = p[j], f[i] += f[j];
		f[i] = max(1LL, f[i]);
	}
	printf("%lld", f[n]);
}
```
