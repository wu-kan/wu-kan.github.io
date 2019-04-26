---
title: Educational Codeforces Round 63 (Rated for Div. 2)
categories:
  - ACM
  - 题解
---
现场做出ABCDE，然后D因为犯了傻逼错误被cha了…
# [Reverse a Substring](https://vjudge.net/problem/CodeForces-1155A)
因为忘了下标从1开始WA了一发。
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 3e5 + 9;
char s[N];
int n;
int main()
{
	scanf("%d%s", &n, s);
	for (int i = 1; i < n; ++i)
		if (s[i] < s[i - 1])
			return printf("YES\n%d %d", i, i + 1), 0;
	printf("NO");
}
```
# [Game with Telephone Numbers](https://vjudge.net/problem/CodeForces-1155B)
两个人的必胜策略，一个是优先拿最靠前的8，另一个是优先拿最靠前的非8，模拟一下即可。
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 3e5 + 9;
char s[N];
int n;
vector<int> v[2];
int main()
{
	scanf("%d%s", &n, s);
	for (int i = 0; i < n; ++i)
		v[s[i] == '8'].push_back(i);
	n = (n - 11) / 2;
	if (v[0].size() <= n)
		return printf("YES"), 0;
	if (v[1].size() <= n)
		return printf("NO"), 0;
	printf(v[0][n] > v[1][n] ? "YES" : "NO");
}
```
# [Alarm Clocks Everywhere](https://vjudge.net/problem/CodeForces-1155C)
选择的间隔一定要是所有间隔之差的因子，搞一下就行了。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 3e5 + 9;
ll n, m, x[N];
int main()
{
	scanf("%lld%lld", &n, &m);
	for (ll i = 0; i < n; ++i)
		scanf("%lld", &x[i]);
	ll g = 0;
	for (ll i = 1; i < n; ++i)
		g = __gcd(g, x[i] - x[i - 1]);
	for (ll i = 0, p; i < m; ++i)
	{
		scanf("%lld", &p);
		if (g % p == 0)
			return printf("YES\n%lld %lld", x[0], i + 1), 0;
	}
	printf("NO");
}
```
# [Beautiful Array](https://vjudge.net/problem/CodeForces-1155D)
犯了沙雕错误被cha了…
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 3e5 + 9;
ll n, x, ans, a[N];
int main()
{
	scanf("%lld%lld", &n, &x);
	for (ll i = 0, a, pre[3] = {0, 0, 0}; i < n; ++i)
	{
		scanf("%lld", &a);
		ans = max(ans, pre[2] = max(0LL, max(pre[0], max(pre[1], pre[2]))) + a);
		ans = max(ans, pre[1] = max(0LL, max(pre[0], pre[1])) + a * x);
		ans = max(ans, pre[0] = max(0LL, pre[0]) + a);
	}
	printf("%lld", ans);
}
```
# [Guess the Root](https://vjudge.net/problem/CodeForces-1155E)
同余系下做一次拉格朗日插值就能把所有的系数求出来了，然后对同余系内的每个数暴力去判一下就行了。

看了一下正解是用高斯消元求各项系数的，大同小异了。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef ll lf;
typedef complex<lf> Coord;
#define X real()
#define Y imag()
struct Mod
{
	const ll M, SM;
	Mod(ll M) : M(M), SM(sqrt(M) + 0.5) {} //预处理开方，优化乘法
	ll add(ll a, ll b) const { return ((a + b) % M + M) % M; }
	ll mul(ll a, ll b) const
	{
		while (a < 0)
			a += M;
		while (b < 0)
			b += M;
		return a * b % M;
	}
	/*
	ll mul(ll x, ll y) const //无循环快速计算同余乘法，根据a*b是否爆ll替换a*b%m
	{
		ll a = x / SM, b = x % SM;
		ll c = y / SM, d = y % SM;
		ll e = SM * SM - M; //可能为负
		ll f = ((a * d + b * c) % M + a * c / SM * e) % M;
		return add(((a * c % SM + f / SM) * e % M + f % SM * SM) % M, b * d);
	}
	ll mul(ll a, ll b) const //另一个快速乘法版本
	{
		ll r = 0;
		for (a %= M; b; b >>= 1, a = add(a, a))
			if (b & 1)
				r = add(r, a);
		return r;
	}
	*/
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a %= M; b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
	ll inv(ll a) const
	{
		while (a < 0)
			a += M;
		return pow(a, M - 2);
	} //return pow(a, phi(m) - 1, m);
	/*//模m下a的乘法逆元，不存在返回-1（m为素数时a不为0必有逆元）
	ll inv(ll a) const
	{
		ll x, y, d = gcd(a, m, x, y);
		return d == 1 ? (x + m) % m : -1;
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
} M(1e6 + 3);
struct Lagrange
{
	vector<lf> ask(vector<Coord> p) const //返回p确定的多项式系数向量
	{
		vector<lf> ret(p.size()), sum(p.size());
		ret[0] = p[0].Y, sum[0] = 1;
		for (int i = 1; i < p.size(); ++i)
		{
			for (int j = p.size() - 1; j >= i; --j)
				p[j].imag(M.mul(p[j].Y - p[j - 1].Y, M.inv(p[j].X - p[j - i].X)));
			for (int j = i; ~j; --j)
			{
				sum[j] = M.add(j ? sum[j - 1] : 0, -M.mul(sum[j], p[i - 1].X));
				ret[j] = M.add(ret[j], M.mul(sum[j], p[i].Y));
			}
		}
		return ret;
	}
};
int main()
{
	vector<Coord> v;
	for (ll i = 0, j; i < 11; ++i)
	{
		printf("? %lld\n", i), fflush(stdout);
		scanf("%lld", &j);
		if (j == 0)
			return printf("! %d", i), 0;
		v.push_back({i, j % M.M});
	}
	vector<ll> ret = Lagrange().ask(v);
	for (ll i = 0; i < M.M; ++i)
	{
		ll sum = 0;
		for (ll j = 0, x = 1; j < ret.size(); ++j, x = M.mul(x, i))
			sum = M.add(sum, M.mul(x, ret[j]));
		if (sum == 0)
			return printf("! %d", i), 0;
	}
	printf("! -1");
}
```
# [Delivery Oligopoly](https://vjudge.net/problem/CodeForces-1155F)
给你一张双连通图，要你去掉尽可能多的边并保持双连通的性质。

随机化+tarjan实现，正解似乎是dp。
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 15;
vector<pair<int, int>> ans(N *N), cur, bb(N);
vector<int> g[N], dep, b(N);
int n, m;
int dfs(int u, int fa)
{
	int low = b[u] = dep[u] = fa != N ? dep[fa] + 1 : 0;
	random_shuffle(g[u].begin(), g[u].end());
	for (auto to : g[u])
		if (to != fa)
			if (dep[to] == N)
			{
				cur.emplace_back(u, to);
				low = min(low, dfs(to, u));
				if (b[u] > b[to])
					b[u] = b[to], bb[u] = bb[to];
			}
			else if (b[u] > dep[to])
				b[u] = dep[to], bb[u] = {u, to};
	if (fa != N && low == dep[u])
		low = b[u], cur.push_back(bb[u]);
	return low;
}
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 0, u, v; i < m; ++i)
		scanf("%d%d", &u, &v), g[u].push_back(v), g[v].push_back(u);
	for (auto t = clock() + 1926; clock() < t;)
	{
		cur.clear(), dep.assign(n + 1, N), dfs(rand() % n + 1, N);
		if (ans.size() > cur.size())
			ans = cur;
	}
	printf("%d\n", ans.size());
	for (auto it : ans)
		printf("%d %d\n", it.first, it.second);
}
```
