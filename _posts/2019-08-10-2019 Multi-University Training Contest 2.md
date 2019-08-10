---
title: 2019 Multi-University Training Contest 2
categories:
- ACM
- 题解
---
## [Everything Is Generated In Equal Probability](https://vjudge.net/problem/HDU-6595)

记$\frac{1}{n}f(n)$为所求期望，则$f(n)=\sum_{i=1}^ng(i)$。

其中$g(n)=h(n)+\sum_{i=0}^n\frac{C_n^i}{2^n}g(i)=h(n)+\sum_{i=0}^{n-1}\frac{C_n^i}{2^n}g(i)+\frac{g(n)}{2^n}$，移项得$g(n)=\frac{h(n)+\sum_{i=0}^{n-1}\frac{C_n^i}{2^n}g(i)}{2^n-1}$，表示长度固定为$n$的序列逆序对之和的期望。

而$h(n)=\frac{2^n}{4}n(n-1)$表示长度为$n$的排列逆序对数量的期望。至此结束。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Mod
{
	const ll M;
	Mod(ll M) : M(M) {}
	ll qadd(ll &a, ll b) const { return a += b, a < M ? a : a - M; }
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }
	ll mul(ll a, ll b) const { return add(a * b, M); }
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a = add(a, M); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
	ll inv(ll a) const { return pow(a, M - 2); }
};
struct Factorial : Mod
{
	vector<ll> fac, ifac;
	Factorial(int N, ll M) : fac(N, 1), ifac(N, 1), Mod(M)
	{
		for (int i = 2; i < N; ++i)
			fac[i] = mul(fac[i - 1], i), ifac[i] = mul(M - M / i, ifac[M % i]);
		for (int i = 2; i < N; ++i)
			ifac[i] = mul(ifac[i], ifac[i - 1]);
	}
	ll c(int n, int m) { return mul(mul(fac[n], ifac[m]), ifac[n - m]); }
	ll inv(int t) { return mul(fac[t - 1], ifac[t]); }
} F(4095, 998244353);
int main()
{
	vector<ll> g(3001, 0), f(g);
	for (ll i = 2; i < g.size(); ++i)
	{
		g[i] = F.mul(F.mul(F.pow(2, i), F.inv(4)), F.mul(i, i - 1));
		for (ll j = 0; j < i; ++j)
			g[i] = F.add(g[i], F.mul(F.c(i, j), g[j]));
		g[i] = F.mul(g[i], F.Mod::inv(F.add(F.pow(2, i), -1)));
		f[i] = F.add(f[i - 1], g[i]);
	}
	for (ll n; ~scanf("%lld", &n);)
		printf("%lld\n", F.mul(f[n], F.inv(n)));
}
```

## [Harmonious Army](https://vjudge.net/problem/HDU-6598)

经典最小割模型。彭天翼的《浅析一类最小割问题》，以及[参考](https://blog.csdn.net/lvzelong2014/article/details/79134295)。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll INF = 1e18;
struct Graph
{
	struct Vertex
	{
		vector<int> o;
	};
	struct Edge
	{
		int first, second;
		ll cap;
	};
	vector<Vertex> v;
	vector<Edge> e;
	Graph(int n) : v(n) {}
	void add(const Edge &ed)
	{
		v[ed.first].o.push_back(e.size());
		e.push_back(ed);
	}
};
struct ISAP : Graph
{
	ll flow;
	vector<ll> f;
	vector<int> h, cur, gap;
	ISAP(int n) : Graph(n) {}
	void add(Edge ed)
	{
		Graph::add(ed);
		swap(ed.first, ed.second), ed.cap = 0;
		Graph::add(ed);
	}
	ll dfs(int s, int u, int t, ll r)
	{
		if (r == 0 || u == t)
			return r;
		ll _f, _r = 0;
		for (int &i = cur[u], k; i < v[u].o.size(); ++i)
			if (k = v[u].o[i], h[u] == h[e[k].second] + 1)
			{
				_f = dfs(s, e[k].second, t, min(r - _r, e[k].cap - f[k]));
				f[k] += _f, f[k ^ 1] -= _f, _r += _f;
				if (_r == r || h[s] >= v.size())
					return _r;
			}
		if (!--gap[h[u]])
			h[s] = v.size();
		return ++gap[++h[u]], cur[u] = 0, _r;
	}
	void ask(int s, int t)
	{
		h.assign(v.size(), 0);
		cur.assign(v.size(), 0);
		gap.assign(v.size() + 2, 0);
		for (f.assign(e.size(), flow = 0); h[s] < v.size();)
			flow += dfs(s, s, t, INF);
	}
};
int main()
{
	for (int n, m; ~scanf("%d%d", &n, &m);)
	{
		ISAP g(n + 2);
		ll ans = 0;
		for (int i = 0, u, v, a, b, c; i < m; ++i)
		{
			scanf("%d%d%d%d%d", &u, &v, &a, &b, &c);
			g.add({0, u, a + b});
			g.add({u, n + 1, c + b});
			g.add({u, v, a + c - 2 * b});
			swap(u, v);
			g.add({0, u, a + b});
			g.add({u, n + 1, c + b});
			g.add({u, v, a + c - 2 * b});
			ans += a + b + c;
		}
		g.ask(0, n + 1);
		printf("%lld\n", ans - g.flow / 2);
	}
}
```

## [Just Skip The Problem](https://vjudge.net/problem/HDU-6600)

居然WA了一发…大于模数的时候结果就是0。

```c
#include <stdio.h>
typedef long long ll;
int main()
{
	for (ll n, M = 1e6 + 3, ans; ~scanf("%lld", &n); printf("%lld\n", ans))
	{
		if (n < M)
			for (ll i = ans = 1; i <= n; ++i)
				ans = ans * i % M;
		else
			ans = 0;
	}
}
```

## [Keen On Everything But Triangle](https://vjudge.net/problem/HDU-6601)

由于整数值域内大于四十九个数一定可以构成一个三角形（斐波拉契数列四十多项之后超过值域），于是线段树维护区间最大的四十九个数，然后暴力检验即可。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e5 + 9, NPOS = -1;
int n, q, a[N];
struct SegmentTree
{
	struct Seg
	{
		int l, r, siz, a[49];
		friend Seg up(const Seg &lc, const Seg &rc)
		{
			Seg ans;
			ans.l = lc.l;
			ans.r = rc.r;
			ans.siz = 0;
			int i = 0, j = 0;
			while (ans.siz < 49 && i < lc.siz && j < rc.siz)
				ans.a[ans.siz++] = lc.a[i] > rc.a[j] ? lc.a[i++] : rc.a[j++];
			while (ans.siz < 49 && i < lc.siz)
				ans.a[ans.siz++] = lc.a[i++];
			while (ans.siz < 49 && j < rc.siz)
				ans.a[ans.siz++] = rc.a[j++];
			return ans;
		}
	};
	struct Node : Seg
	{
		int lc, rc;
	};
	vector<Node> v;
	SegmentTree(int l, int r) { v.reserve(r - l + 9 << 1), build(l, r); }
	void build(int l, int r)
	{
		int rt = v.size();
		v.push_back({});
		if (l >= r)
		{
			v[rt].lc = v[rt].rc = NPOS;
			v[rt].l = l, v[rt].r = r;
			v[rt].siz = 1, v[rt].a[0] = a[l];
			return;
		}
		int m = l + r >> 1;
		v[rt].lc = v.size(), build(l, m);
		v[rt].rc = v.size(), build(m + 1, r);
		v[rt].Seg::operator=(up(v[v[rt].lc], v[v[rt].rc]));
	}
	Seg ask(int l, int r, int rt = 0)
	{
		if (l <= v[rt].l && v[rt].r <= r)
			return v[rt];
		if (r <= v[v[rt].lc].r)
			return ask(l, r, v[rt].lc);
		if (l >= v[v[rt].rc].l)
			return ask(l, r, v[rt].rc);
		return up(ask(l, v[v[rt].lc].r, v[rt].lc), ask(v[v[rt].rc].l, r, v[rt].rc));
	}
};
int main()
{
	while (~scanf("%d%d", &n, &q))
	{
		for (int i = 1; i <= n; ++i)
			scanf("%d", &a[i]);
		SegmentTree t(1, n);
		for (int i = 1, l, r; i <= q; ++i)
		{
			scanf("%d%d", &l, &r);
			SegmentTree::Seg ret = t.ask(l, r);
			long long ans = -1;
			for (int i = 2; i < ret.siz; ++i)
				if (ret.a[i - 2] < ret.a[i - 1] + ret.a[i])
				{
					ans = (long long)ret.a[i] + ret.a[i - 1] + ret.a[i - 2];
					break;
				}
			printf("%lld\n", ans);
		}
	}
}
```
