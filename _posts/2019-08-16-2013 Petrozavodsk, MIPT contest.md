---
title: Petrozavodsk Summer-2013. Moscow IPT Contest
categories:
- ACM
- 题解
---
## [Sum of Powers](https://vjudge.net/problem/EOlymp-6465)

```cpp
#include <bits/stdc++.h>
using namespace std;
vector<string> s;
void f(int n, int k)
{
	if (n > k)
	{
		cout << s[n - 1];
		return;
	}
	f(n - 1, k), f(n - 1, k);
}
int main(void)
{
	for (int n, k; ~scanf("%d%d", &n, &k);)
	{
		s.assign(1, "AB");
		for (int i = 1; i < n; ++i)
		{
			s.push_back(s.back());
			for (int j = 0; j < s[i - 1].size(); ++j)
				s[i].push_back(s[i - 1][j] == 'A' ? 'B' : 'A');
		}
		f(n, k);
	}
}
```

## [Dot Product](https://vjudge.net/problem/EOlymp-6467)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int NPOS = -1;
struct Mod
{
	const ll M, SM;
	Mod(ll M) : M(M), SM(sqrt(M) + 0.5) {}
	ll qadd(ll &a, ll b) const { return a += b, a < M ? a : (a -= M); } //假如a和b都已经在同余系内，就不必取模了，取模运算耗时很高
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }		//考虑a和b不在同余系内甚至为负数的情况
	ll mul(ll a, ll b) const { return add(a * b, M); }
	/*
	ll mul(ll a, ll b) const { return add(a * b, -M * ll((long double)a / M * b)); }
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
} M(1e9 + 7);
struct SegmentTree
{
	struct Seg
	{
		int l, r;
		ll suma, sumb, ans;
		void upd(ll bdd, ll add)
		{
			M.qadd(ans, M.mul(sumb, add));
			M.qadd(suma, M.mul(r - l + 1, add));
			M.qadd(ans, M.mul(suma, bdd));
			M.qadd(sumb, M.mul(r - l + 1, bdd));
		}
		friend Seg up(const Seg &lc, const Seg &rc)
		{
			Seg fa = lc;
			fa.r = rc.r;
			M.qadd(fa.suma, rc.suma);
			M.qadd(fa.sumb, rc.sumb);
			M.qadd(fa.ans, rc.ans);
			return fa;
		}
	};
	struct Node : Seg
	{
		int lc, rc;
		ll bdd, add;
	};
	vector<Node> v;
	SegmentTree(int l, int r) { build(l, r); }
	void build(int l, int r)
	{
		int rt = v.size();
		v.push_back({});
		v[rt].Seg::operator=({l, r, 0, 0, 0});
		v[rt].lc = v[rt].rc = NPOS;
		v[rt].bdd = 0, v[rt].add = 0;
	}
	void down(int rt)
	{
		int m = v[rt].l + v[rt].r >> 1;
		if (v[rt].lc == NPOS)
			v[rt].lc = v.size(), build(v[rt].l, m);
		if (v[rt].rc == NPOS)
			v[rt].rc = v.size(), build(m + 1, v[rt].r);
		upd(v[v[rt].lc].l, v[v[rt].lc].r, v[rt].bdd, v[rt].add, v[rt].lc);
		upd(v[v[rt].rc].l, v[v[rt].rc].r, v[rt].bdd, v[rt].add, v[rt].rc);
		v[rt].bdd = 0, v[rt].add = 0;
	}
	void upd(int l, int r, ll bdd, ll add, int rt = 0)
	{
		if (l <= v[rt].l && v[rt].r <= r)
			return M.qadd(v[rt].bdd, bdd), M.qadd(v[rt].add, add), v[rt].upd(bdd, add);
		down(rt);
		if (r <= v[v[rt].lc].r)
			upd(l, r, bdd, add, v[rt].lc);
		else if (l >= v[v[rt].rc].l)
			upd(l, r, bdd, add, v[rt].rc);
		else
			upd(l, v[v[rt].lc].r, bdd, add, v[rt].lc), upd(v[v[rt].rc].l, r, bdd, add, v[rt].rc);
		v[rt].Seg::operator=(up(v[v[rt].lc], v[v[rt].rc]));
	}
	Seg ask(int l, int r, int rt = 0)
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
int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	SegmentTree t(1, n);
	for (int i = 0, l, r, x; i < m; ++i)
	{
		char s[9];
		scanf("%s%d%d", s, &l, &r);
		if (s[0] == '?')
			printf("%lld\n", t.ask(l, r).ans);
		else
			scanf("%d", &x), t.upd(l, r, s[0] != '*' ? x : 0, s[0] == '*' ? x : 0);
	}
}
```
