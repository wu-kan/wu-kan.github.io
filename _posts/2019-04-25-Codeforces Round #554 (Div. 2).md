---
title: "Codeforces Round #554 (Div. 2)"
categories:
  - ACM
  - 题解
---
[官方题解](https://codeforces.com/blog/entry/66696)
# [Neko Finds Grapes](https://vjudge.net/problem/CodeForces-1152A)
```cpp
#include <bits/stdc++.h>
using namespace std;
int n, m, a[2], b[2];
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 0, t; i < n; ++i)
		scanf("%d", &t), ++a[t & 1];
	for (int i = 0, t; i < m; ++i)
		scanf("%d", &t), ++b[t & 1];
	printf("%d", min(a[0], b[1]) + min(a[1], b[0]));
}
```
# [Neko Performs Cat Furrier Transform](https://vjudge.net/problem/CodeForces-1152B)
每次把最高位异或掉即可。
```cpp
#include <bits/stdc++.h>
using namespace std;
int x, c, b[30], ans[40], *p;
int main()
{
	for (int i = 0; i < 30; ++i)
		b[i] = (1 << i) - 1;
	for (scanf("%d", &x); p = lower_bound(b, b + 30, x), *p != x; ++c)
	{
		if (c & 1)
			++x;
		else
			x ^= *p, ans[c] = p - b;
	}
	printf("%d\n", c);
	for (int i = 0; i < c; i += 2)
		printf("%d ", ans[i]);
}
```
# [Neko does Maths](https://vjudge.net/problem/CodeForces-1152C)
题意：找到最小的非负整数$k$，使得$(k+a)/\gcd(k+a,k+b)\times(k+b)$最小。

解：不妨$a\ge b$，考虑$\gcd(a,b)=\gcd(a,a-b)$，用$c=a-b$代入原式，即要最小化$(k+a)/\gcd(k+a,k+a-c)\times(k+a-c)=(k+a)/\gcd(k+a,c)\times(k+a-c)$。由于$\gcd(k+a,c)$一定是$c$的因子，枚举$c$的所有因子$j$，要求$j$也是$k+a$的因子，满足的$k$在$[0,j)$内存在且唯一，此时回代判断即可。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll a, b;
int main()
{
	scanf("%lld%lld", &a, &b);
	if (a < b)
		swap(a, b);
	pair<ll, ll> ans(a / __gcd(a, b) * b, 0);
	for (ll i = 1, c = a - b; i * i <= c; ++i)
		if (c % i == 0)
			for (auto j : {i, c / i})
			{
				ll k = ((-a) % j + j) % j;
				ans = min(ans, {(k + a) / j * (k + a - c), k});
			}
	printf("%lld", ans.second);
}
```
# [Neko and Aki's Prank](https://vjudge.net/problem/CodeForces-1152D)
题意：有一个trie是从一个括号序列建立的，求这个trie的最大匹配是多少。

解：现场已经看出这个题是树的DP，我还是太菜了啊。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Mod
{
	const ll M, SM;
	Mod(ll M) : M(M), SM(sqrt(M) + 0.5) {}
	ll qadd(ll a, ll b) const { return a += b, a < M ? a : a - M; }			//假如a和b都已经在同余系内，就不必取模了，取模运算耗时很高
	ll add(ll a, ll b) const { return a = (a + b) % M, a < 0 ? a + M : a; } //考虑a和b不在同余系内甚至为负数的情况
	ll mul(ll a, ll b) const { return add(a * b, 0); }
	/*
	ll mul(ll x, ll y) const //无循环快速计算同余乘法，根据a*b是否爆ll替换a*b%m
	{
		ll a = x / SM, b = x % SM,
		   c = y / SM, d = y % SM,
		   e = SM * SM - M, //可能为负
			f = ((a * d + b * c) % M + a * c / SM * e) % M;
		return add(((a * c % SM + f / SM) * e % M + f % SM * SM) % M, b * d);
	}
	*/
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a = add(a, 0LL); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
	ll inv(ll a) const { return pow(a, M - 2); } //return pow(a, phi(M) - 1);
	/*
	ll inv(ll a) const //模m下a的乘法逆元，不存在返回-1（m为素数时a不为0必有逆元）
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
	/*
	vector<ll> sol(ll a, ll b) const //解同余方程，返回ax=b(mod M)循环节内所有解
	{
		vector<ll> ans;
		ll x, y, d = gcd(a, M, x, y);
		if (b % d)
			return ans;
		ans.push_back((b / d) % (M / d) * (x = (x % M + M) % M));
		for (ll i = 1; i < d; ++i)
			ans.push_back((ans.back() + M / d) % M);
		return ans;
	}
	*/
} M(1e9 + 7);
const ll N = 2047;
ll n, f[N][N][2];
int main()
{
	memset(f, -0x3f, sizeof(f));
	f[0][0][0] = 0;
	for (int i = 1; i + 1 < N; ++i)
	{
		f[i][0][0] = max(f[i - 1][1][0], f[i - 1][1][1]);
		f[i][0][1] = M.qadd(f[i - 1][1][0], 1);
		for (int j = 1; j <= i; ++j)
		{
			f[i][j][0] = M.qadd(
				max(0LL, max(f[i - 1][j - 1][0], f[i - 1][j - 1][1])),
				max(0LL, max(f[i - 1][j + 1][0], f[i - 1][j + 1][1])));
			f[i][j][1] = max(
							 f[i - 1][j - 1][0] + 1 + max(0LL, max(f[i - 1][j + 1][1], f[i - 1][j + 1][0])),
							 f[i - 1][j + 1][0] + 1 + max(0LL, max(f[i - 1][j - 1][0], f[i - 1][j - 1][1]))) %
						 M.M;
		}
	}
	scanf("%lld", &n);
	printf("%lld", max(f[2 * n][0][0], f[2 * n][0][1]));
}
```
# [Neko and Flashback](https://vjudge.net/problem/CodeForces-1152E)
欧拉路。详见官方题解。
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, b[N], c[N];
struct Ranker : vector<int>
{
	void init() { sort(begin(), end()), resize(unique(begin(), end()) - begin()); }
	int ask(int x) { return lower_bound(begin(), end(), x) - begin(); }
} rk;
struct Graph
{
	struct Vertex
	{
		vector<int> i;
	};
	typedef pair<int, int> Edge;
	vector<Vertex> v;
	vector<Edge> e;
	Graph(int n) : v(n) {}
	void add(const Edge &ed)
	{
		v[ed.second].i.push_back(e.size());
		e.push_back(ed);
	}
};
struct Fleury : Graph
{
	vector<int> vis, cur, p;
	Fleury(int n) : Graph(n) {}
	void dfs(int u)
	{
		for (int &i = cur[u], k; i < v[u].i.size(); ++i)
			if (k = v[u].i[i], !vis[k] && !vis[k ^ 1])
				vis[k] = 1, dfs(e[k].first), p.push_back(k);
	}
	void ask()
	{
		int cnt = 0;
		for (int i = 0; i < v.size(); ++i)
			if (v[i].i.size() % 2)
				++cnt;
		if (cnt > 2)
			return;
		vis.assign(e.size(), 0), cur.assign(v.size(), 0), p.clear();
		for (int i = 0; i < v.size(); ++i)
			if (v[i].i.size() % 2)
				return dfs(i);
		dfs(0);
	}
};
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n - 1; ++i)
		scanf("%d", &b[i]), rk.push_back(b[i]);
	for (int i = 0; i < n - 1; ++i)
		scanf("%d", &c[i]), rk.push_back(c[i]);
	rk.init();
	Fleury g(rk.size());
	for (int i = 0; i < n - 1; ++i)
	{
		if (b[i] > c[i])
			return printf("-1"), 0;
		g.add({b[i] = rk.ask(b[i]), c[i] = rk.ask(c[i])}), g.add({c[i], b[i]});
	}
	g.ask();
	if (g.p.size() < n - 1)
		return printf("-1"), 0;
	for (int i = 0; i < n - 1; ++i)
		printf("%d ", rk[g.e[g.p[i]].first]);
	printf("%d ", rk[g.e[g.p[n - 2]].second]);
}
```
# [Neko Rules the Catniverse (Small Version)](https://vjudge.net/problem/CodeForces-1152F1)
状压DP，用$f[i][j][mask]$来表示正在考虑第i个，已经考虑了第$j$个，后$m$个的选择状态是二进制位集$mask$。

这里可以滚动数组。
```cpp
#include <bits/stdc++.h>
using namespace std;
void add(int &a, long long b, int M = 1e9 + 7) { a = (a + b) % M; }
int n, k, m;
int main()
{
	scanf("%d%d%d", &n, &k, &m);
	vector<vector<int>> f(k + 1, vector<int>(1 << m, 0));
	f[0][0] = 1;
	for (int i = 0; i < n; ++i)
	{
		vector<vector<int>> g(k + 1, vector<int>(1 << m, 0));
		for (int j = 0; j < f.size(); ++j)
			for (int mask = 0; mask < f[j].size(); ++mask)
			{
				int newMask = (mask << 1) % f[j].size();
				add(g[j][newMask], f[j][mask]);
				if (j < k)
					add(g[j + 1][newMask | 1], (1LL + __builtin_popcount(mask)) * f[j][mask]);
			}
		f.swap(g);
	}
	for (int mask = m = 0; mask < f[k].size(); ++mask)
		add(m, f[k][mask]);
	printf("%d", m);
}
```
# [Neko Rules the Catniverse (Large Version)](https://vjudge.net/problem/CodeForces-1152F2)
注意到状态只在相邻的两位转移，这里可以用矩阵加速DP。

下面这段代码跑了5070ms，官方还有一个[跑了156ms的解法](https://codeforces.com/contest/1152/submission/53260183)，暂时没看懂…也太强了吧。
```cpp
#include <bits/stdc++.h>
using namespace std;
int n, k, m;
void add(int &a, long long b, int M = 1e9 + 7) { a = (a + b) % M; }
int toId(int j, int mask) { return j << m | mask; }
struct Matrix
{
	vector<vector<int>> a;
	int n;
	Matrix(int n) : n(n), a(n, vector<int>(n)) {}
	friend Matrix operator*(const Matrix &a, const Matrix &b)
	{
		Matrix c(a.n);
		for (int i = 0; i < a.n; ++i)
			for (int j = 0; j < a.n; ++j)
				for (int k = 0; k < a.n; ++k)
					add(c.a[i][j], 1LL * a.a[i][k] * b.a[k][j]);
		return c;
	}
	friend Matrix pow(Matrix a, int b)
	{
		Matrix r(a.n);
		for (int i = 0; i < a.n; ++i)
			r.a[i][i] = 1;
		for (; b; b >>= 1, a = a * a)
			if (b & 1)
				r = a * r;
		return r;
	}
};
int main()
{
	scanf("%d%d%d", &n, &k, &m);
	Matrix dp(toId(k + 1, 0)), f(dp);
	for (int j = 0; j <= k; ++j)
		for (int mask = 0; mask < (1 << m); ++mask)
		{
			int newMask = (mask << 1) % (1 << m);
			f.a[toId(j, newMask)][toId(j, mask)] = 1;
			if (j < k)
				f.a[toId(j + 1, newMask | 1)][toId(j, mask)] = 1 + __builtin_popcount(mask);
		}
	dp.a[0][0] = 1, dp = pow(f, n) * dp;
	int ans = 0;
	for (int mask = 0; mask < (1 << m); ++mask)
		add(ans, dp.a[toId(k, mask)][0]);
	printf("%d", ans);
}
```
