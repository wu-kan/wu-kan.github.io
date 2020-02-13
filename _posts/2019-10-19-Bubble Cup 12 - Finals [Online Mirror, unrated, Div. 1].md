---
title: Bubble Cup 12 - Finals [Online Mirror, unrated, Div. 1]
tags:
  - ACM
  - 题解
---

## [Product Tuples](https://vjudge.net/problem/CodeForces-1218E)

正解是 fft，这里我直接暴力 DP 做掉了这个题。注意的是暴力做法的话用`long long`被卡掉了，只能全程用`int`做模运算。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
struct Mod
{
	const ll M, SM;
	Mod(ll M) : M(M), SM(sqrt(M) + 0.5) {}
	ll qadd(ll &a, ll b) const { return a += b, a >= M ? a -= M : a; } //假如a+b<2*M，就不必取模了，取模运算耗时很高
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }	  //考虑a和b不在同余系内甚至为负数的情况
	ll mul(ll a, long long b) const { return a * b % M; }
	ll inv(ll a) const { return pow(a, M - 2); } //要求M为素数，否则return pow(a, phi(M) - 1);
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		/*
		if (b < 0)
			b = -b, a = inv(a);
		*/
		for (a = add(a, M); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
	/*
	ll mul(ll a, ll b) const { return add(a * b, -M * ll((long double)a / M * b)); } //long double 有效位数16~18位，模数过大时慎用！
	ll mul(ll a, ll b) const //Head算法，无循环快速计算同余乘法，根据a*b是否爆ll替换a*b%M，需要a<M且b<M，可以调用时手动取模
	{
		ll c = a / SM, d = b / SM;
		a %= SM, b %= SM;
		ll e = add(add(a * d, b * c), c * d / SM * (SM * SM - M));
		return add(add(a * b, e % SM * SM), add(c * d % SM, e / SM) * (SM * SM - M));
	}
  ll mul(ll a, ll b) const //龟速乘
	{
		ll r = 0;
		for (a %= M; b; b >>= 1, qadd(a, a))
			if (b & 1)
				qadd(r, a);
		return r;
	}
	ll inv(ll a) const //模m下a的乘法逆元，不存在返回-1（m为素数时a不为0必有逆元）
	{
		ll x, y, d = gcd(a, M, x, y);
		return d == 1 ? add(x, M) : -1;
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
	*/
} M(998244353);
int n, k, q, o, x, l, r, d;
int main()
{
	scanf("%d%d", &n, &k);
	vector<int> aa(n);
	for (int i = 0; i < n; ++i)
		scanf("%d", &aa[i]);
	for (scanf("%d", &q); q--;)
	{
		vector<int> a = aa, f(k + 1, 0);
		scanf("%d%d%d", &o, &x, &l);
		if (o == 1)
			scanf("%d", &a[l - 1]);
		else
		{
			scanf("%d%d", &r, &d);
			for (int i = l - 1; i < r; ++i)
				a[i] += d;
		}
		for (int i = 0; i < n; ++i)
			a[i] = M.add(x, -a[i]);
		f[0] = 1;
		for (int i = 0; i < n; ++i)
			for (int j = min(i + 1, k), jb = max(1, k - (n - i - 1)); j >= jb; --j)
				M.qadd(f[j], M.mul(f[j - 1], a[i]));
		printf("%d\n", f[k]);
	}
}
```

## [Workout plan](https://vjudge.net/problem/CodeForces-1218F)

队友做的这题，看起用了线段树。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;

const int maxn = 1e5 + 10, INF = 1e9 + 10;
int n, k, add;
int a[maxn], mon[maxn];
LL ans = 0;
struct node
{
	int num, loc;
} tree[4 * maxn];

void build(int root, int L, int R)
{
	if (L == R)
	{
		tree[root].num = mon[L];
		tree[root].loc = L;
		return;
	}
	int mid = (L + R) / 2;
	int Lson = root * 2, Rson = root * 2 + 1;
	build(Lson, L, mid);
	build(Rson, mid + 1, R);
	if (tree[Lson].num < tree[Rson].num)
	{
		tree[root].num = tree[Lson].num;
		tree[root].loc = tree[Lson].loc;
	}
	else
	{
		tree[root].num = tree[Rson].num;
		tree[root].loc = tree[Rson].loc;
	}
}

void upnode(int root, int L, int R, int x, int val)
{
	if (L == x && x == R)
	{
		tree[root].num = val;
		return;
	}
	if (x < L || R < x)
		return;
	int mid = (L + R) / 2;
	int Lson = root * 2, Rson = root * 2 + 1;
	upnode(Lson, L, mid, x, val);
	upnode(Rson, mid + 1, R, x, val);
	if (tree[Lson].num < tree[Rson].num)
	{
		tree[root].num = tree[Lson].num;
		tree[root].loc = tree[Lson].loc;
	}
	else
	{
		tree[root].num = tree[Rson].num;
		tree[root].loc = tree[Rson].loc;
	}
}

node query(int root, int L, int R, int i, int j)
{
	node now;
	now.num = INF;
	now.loc = 0;
	if (i <= L && R <= j)
		return tree[root];
	if (j < L || R < i)
		return now;

	int mid = (L + R) / 2;
	int Lson = root * 2, Rson = root * 2 + 1;
	node now1 = query(Lson, L, mid, i, j);
	node now2 = query(Rson, mid + 1, R, i, j);
	if (now1.num < now2.num)
		return now1;
	else
		return now2;
}

int main()
{
	scanf("%d%d", &n, &k);
	for (int i = 1; i <= n; i++)
		scanf("%d", &a[i]);
	scanf("%d", &add);
	for (int i = 1; i <= n; i++)
		scanf("%d", &mon[i]);
	build(1, 1, n);

	bool ok = true;
	for (int i = 1; i <= n; i++)
	{
		while (k < a[i])
		{
			node res = query(1, 1, n, 1, i);
			if (res.num == INF)
			{
				ok = false;
				break;
			}
			upnode(1, 1, n, res.loc, INF);
			k += add;
			ans += (LL)res.num;
		}
		if (!ok)
			break;
	}
	if (ok)
		printf("%lld\n", ans);
	else
		printf("-1\n");

	return 0;
}
```

## [The Light Square](https://vjudge.net/problem/CodeForces-1218I)

2sat。

```cpp

```
