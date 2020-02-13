---
title: 2019 Multi-University Training Contest 3
tags:
  - ACM
  - 题解
---

## [Distribution of books](https://vjudge.net/problem/HDU-6606)

二分+DP+离散化权值线段树。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 2e5 + 9, NPOS = -1, INF = 2e14 + 7;
ll t, n, k, a[N], sum[N];
struct Ranker : vector<ll>
{
	void init() { sort(begin(), end()), resize(unique(begin(), end()) - begin()); }
	ll ask(ll x) const { return lower_bound(begin(), end(), x) - begin(); }
} rk;
struct SegmentTree
{
	struct Seg
	{
		int l, r;
		ll max;
		void upd(ll mul, ll add) { max = max * mul + add; }
		friend Seg up(const Seg &lc, const Seg &rc) { return {lc.l, rc.r, std::max(lc.max, rc.max)}; }
	};
	struct Node : Seg
	{
		int lc, rc;
		ll mul, add;
	};
	vector<Node> v;
	SegmentTree(int l, int r) { build(l, r); }
	void build(int l, int r)
	{
		int rt = v.size();
		v.push_back({});
		v[rt].l = l, v[rt].r = r;
		v[rt].max = -INF;
		v[rt].lc = v[rt].rc = NPOS;
		v[rt].mul = 1, v[rt].add = 0;
	}
	void down(int rt)
	{
		int m = v[rt].l + v[rt].r >> 1;
		if (v[rt].lc == NPOS)
			v[rt].lc = v.size(), build(v[rt].l, m);
		if (v[rt].rc == NPOS)
			v[rt].rc = v.size(), build(m + 1, v[rt].r);
		upd(v[v[rt].lc].l, v[v[rt].lc].r, v[rt].mul, v[rt].add, v[rt].lc);
		upd(v[v[rt].rc].l, v[v[rt].rc].r, v[rt].mul, v[rt].add, v[rt].rc);
		v[rt].mul = 1, v[rt].add = 0;
	}
	void upd(int l, int r, ll mul, ll add, int rt = 0)
	{
		if (l <= v[rt].l && v[rt].r <= r)
			return v[rt].mul *= mul, v[rt].add = v[rt].add * mul + add, v[rt].upd(mul, add);
		down(rt);
		if (r <= v[v[rt].lc].r)
			upd(l, r, mul, add, v[rt].lc);
		else if (l >= v[v[rt].rc].l)
			upd(l, r, mul, add, v[rt].rc);
		else
			upd(l, v[v[rt].lc].r, mul, add, v[rt].lc), upd(v[v[rt].rc].l, r, mul, add, v[rt].rc);
		v[rt].Seg::operator=(up(v[v[rt].lc], v[v[rt].rc]));
	}
	Seg ask(int l, int r, ll rt = 0)
	{
		if (l <= v[rt].l && v[rt].r <= r)
			return v[rt];
		down(rt);
		if (r <= v[v[rt].lc].r)
			return ask(l, r, v[rt].lc);
		if (l >= v[v[rt].rc].l)
			return ask(l, r, v[rt].rc);
		return up(ask(l, v[v[rt].lc].r, v[rt].lc), ask(v[v[rt].rc].l, r, v[rt].rc));
	}
};
int ok(ll m)
{
	SegmentTree t(0, rk.size());
	t.upd(rk.ask(0), rk.ask(0), 0, 0);
	for (int i = 1, p; i <= n; ++i)
	{
		ll ans = t.ask(rk.ask(sum[i] - m), rk.size()).max + 1;
		if (ans >= k)
			return 1;
		if (ans > 0 && (p = rk.ask(sum[i]), ans > t.ask(p, p).max))
			t.upd(p, p, 0, ans);
	}
	return 0;
}
ll bs(ll b, ll e)
{
	if (e - b < 2)
		return e;
	ll m = b + e >> 1;
	return ok(m) ? bs(b, m) : bs(m, e);
}
int main()
{
	for (scanf("%lld", &t); t--;)
	{
		scanf("%lld%lld", &n, &k);
		rk.assign(1, sum[0] = 0);
		for (int i = 1; i <= n; ++i)
			scanf("%lld", &a[i]), rk.push_back(sum[i] = sum[i - 1] + a[i]);
		rk.init();
		printf("%lld\n", bs(-INF, INF));
	}
}
```

## [Fansblog](https://vjudge.net/problem/HDU-6608)

威尔逊定理+MillerRabin 判素数。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Mod
{
	const ll M, SM;
	Mod(ll M) : M(M), SM(sqrt(M) + 0.5) {}
	ll qadd(ll &a, ll b) const { return a += b, a < M ? a : a - M; } //假如a和b都已经在同余系内，就不必取模了，取模运算耗时很高
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }	//考虑a和b不在同余系内甚至为负数的情况
	//ll mul(ll a, ll b) const { return add(a * b, M); }
	ll mul(ll a, ll b) const { return add(a * b, -M * ll((long double)a / M * b)); }
	/*
	ll mul(ll a, ll b) const //无循环快速计算同余乘法，根据a*b是否爆ll替换a*b%M，需要a<M且b<M，可以调用时手动取模
	{
		ll c = a / SM, d = b / SM;
		a %= SM, b %= SM;
		ll e = add(add(a * d, b * c), c * d / SM * (SM * SM - M));
		return add(add(a * b, e % SM * SM), add(c * d % SM, e / SM) * (SM * SM - M));
	}
	*/
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a = add(a, M); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
	ll inv(ll a) const { return pow(a, M - 2); } //要求M为素数
	/*
	ll inv(ll a) const							 //模m下a的乘法逆元，不存在返回-1（m为素数时a不为0必有逆元）
	{
		ll x, y, d = gcd(a, M, x, y);
		return d == 1 ? add(x, M) : -1; //return pow(a, phi(M) - 1);
	}
	vector<ll> sol(ll a, ll b) const //解同余方程，返回ax=b(mod M)循环节内所有解
	{
		vector<ll> ans;
		ll x, y, d = gcd(a, M, x, y);
		if (b % d)
			return ans;
		ans.push_back(mul((b / d) % (M / d), x));
		for (ll i = 1; i < d; ++i)
			ans.push_back(add(ans.back(), M / d));
		return ans;
	}
	*/
	ll log(ll a, ll b) const
	{
		unordered_map<ll, ll> x;
		for (ll i = 0, e = 1; i <= SM; ++i, e = mul(e, a))
			if (!x.count(e))
				x[e] = i;
		for (ll i = 0, v = inv(pow(a, SM)); i <= SM; ++i, b = mul(b, v))
			if (x.count(b))
				return i * SM + x[b];
		return -1;
	}
};
bool isPrime(ll n, int S = 12) //MillerRabin素数测试，S为测试次数，用前S个素数测一遍，S=12可保证unsigned long long范围内无错；n<2请特判
{
	static ll d, u, t, p[] = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};
	for (d = n - 1; !(d & 1);)
		d >>= 1; //未对0，1做特判！
	Mod mo(n);
	for (int i = 0; i < S; ++i)
	{
		if (!(n % p[i]))
			return n == p[i];
		for (t = mo.pow(p[i], u = d); t != n - 1 && t != 1 && u != n - 1;)
			t = mo.mul(t, t), u <<= 1;
		if (t != n - 1 && !(u & 1))
			return 0;
	}
	return 1;
}
int t;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		ll n, q = 1;
		scanf("%lld", &n);
		Mod m(n);
		for (ll t = n - 2; t > 1; --t)
		{
			if (isPrime(t))
				break;
			q = m.mul(q, t);
		}
		printf("%lld\n", m.pow(q, n - 2));
	}
}
```

## [Find the answer](https://vjudge.net/problem/HDU-6609)

树状数组上二分。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Ranker : vector<ll>
{
	void init() { sort(begin(), end()), resize(unique(begin(), end()) - begin()); }
	int ask(ll x) const { return lower_bound(begin(), end(), x) - begin(); }
};
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
	int bs(int b, int e, ll sum)
	{
		if (e - b < 2)
			return b;
		int m = b + e >> 1;
		return ask(m) > sum ? bs(b, m, sum) : bs(m, e, sum);
	}
};
int main()
{
	int t, n, m;
	for (scanf("%d", &t); t--; printf("\n"))
	{
		scanf("%d%d", &n, &m);
		Ranker a, rk;
		for (int i = 0, w; i < n; ++i)
			scanf("%d", &w), a.push_back(w), rk.push_back(a[i] * n + i);
		rk.init();
		BaseFenwick sum(rk.size() + 9), siz(sum);
		for (int i = 0; i < n; ++i)
		{
			int pos = sum.bs(0, sum.v.size(), m - a[i]);
			printf("%d ", i - siz.ask(pos));
			int t = rk.ask(a[i] * n + i) + 2;
			sum.add(t, a[i]);
			siz.add(t, 1);
		}
	}
}
```
