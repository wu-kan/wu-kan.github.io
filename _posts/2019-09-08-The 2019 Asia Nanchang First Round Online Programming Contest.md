---
title: The 2019 Asia Nanchang First Round Online Programming Contest
tags:
  - ACM
  - 题解
---

## [Enju With math problem](https://nanti.jisuanke.com/t/41348)

见过几次的套路题了。题目给的范围内，素数出现的最大间隔有两百多个，所以暴力判断其中某一个一定是素数是不够的。这里我判断是否存在一个数是某两个素数乘积`p*q`的形式，并用前一百个素数带入`p`暴力检验，终于在最后一分钟 A 掉了这个题！

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Mod
{
	const ll M, SM;
	Mod(ll M) : M(M), SM(sqrt(M) + 0.5) {}
	ll qadd(ll &a, ll b) const { return a += b, a >= M ? a -= M : a; } //??a?b????????,??????,????????
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }	  //??a?b??????????????
	ll mul(ll a, ll b) const { return add(a * b, M); }
	ll inv(ll a) const { return pow(a, M - 2); } //??M???,??return pow(a, phi(M) - 1);
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a = add(a, M); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
};
struct EulerSieve
{
	vector<int> p, m; //????,?????,????,??????
	EulerSieve(int N) : m(N, 0)
	{
		for (long long i = 2, k; i < N; ++i) //?i*p[j]?int
		{
			if (!m[i])
				p.push_back(m[i] = i); //i???
			for (int j = 0; j < p.size() && (k = i * p[j]) < N; ++j)
				if ((m[k] = p[j]) == m[i])
					break;
		}
	}
} e(1e7 + 9);
struct PollardRho
{
	bool isPrime(ll n, int S = 12) //MillerRabin????,S?????,??S??????,S=12???unsigned long long?????;n<2???
	{
		static ll d, u, t, p[] = {2, 3, 5, 7, 11, 13, 17, 19, 23, 29, 31, 37};
		for (d = n - 1; !(d & 1);)
			d >>= 1; //??0,1???!
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
	void fac(ll n, vector<ll> &factor)
	{
		if (n < 2)
			return;
		if (n < e.m.size())
			return factor.push_back(e.m[n]), fac(n /= e.m[n], factor);
		if (isPrime(n))
			return factor.push_back(n);
		Mod mo(n);
		for (ll c = 1;; ++c)
			for (ll i = 0, k = 1, x = rand() % (n - 1) + 1, y, p;;)
			{
				if (++i == k)
					y = x, k <<= 1;
				if (x = mo.add(mo.mul(x, x), c), p = __gcd(abs(x - y), n), p == n)
					break;
				if (p > 1)
					return fac(p, factor), fac(n / p, factor);
			}
	}
};

int t, a[500], b[200] = {0, 1, 1, 2, 2, 4, 2, 6, 4, 6, 4, 10, 4, 12, 6, 8, 8, 16, 6, 18, 8, 12, 10, 22, 8, 20, 12, 18, 12, 28, 8, 30, 16, 20, 16, 24, 12, 36, 18, 24, 16, 40, 12, 42, 20, 24, 22, 46, 16, 42, 20, 32, 24, 52, 18, 40, 24, 36, 28, 58, 16, 60, 30, 36, 32, 48, 20, 66, 32, 44, 24, 70, 24, 72, 36, 40, 36, 60, 24, 78, 32, 54, 40, 82, 24, 64, 42, 56, 40, 88, 24, 72, 44, 60, 46, 72, 32, 96, 42, 60, 40};
PollardRho pr;
vector<ll> vec;
inline int fai(int n)
{
	vec.clear();
	pr.fac(n, vec);
	sort(vec.begin(), vec.end());
	int sz = unique(vec.begin(), vec.end()) - vec.begin();
	int ret = n;
	for (int i = 0; i < sz; i++)
	{
		n = n / vec[i] * (vec[i] - 1);
	}
	return n;
}
inline bool check()
{
	for (int i = 1; i <= 100; i++)
		if (a[i] != b[i])
			return false;
	return true;
}
bool ok(int pos)
{
	for (int j = 1; j <= 100; j++)
		if (fai(pos + j - 1) != a[j])
			return 0;
	return 1;
}
int main(void)
{
	scanf("%d", &t);
	//freopen("qwr","w",stdout);
	while (t--)
	{
		for (int i = 1; i <= 100; i++)
			scanf("%d", &a[i]);
		if (check())
		{
			printf("YES\n1\n");
			continue;
		}
		bool ct2 = 0;
		int pos;
		for (int i = 1; i <= 100; i++)
		{
			if (ok(pos = a[i] - i + 2))
			{
				ct2 = 1;
				break;
			}
			for (int j = 0; e.p[j] < 100; ++j)
				if (a[i] % (e.p[j] - 1) == 0)
				{
					int q = a[i] / (e.p[j] - 1) + 1;
					int p = e.p[j];
					pos = p * q - i + 1;
					if (ok(pos))
					{
						ct2 = 1;
						break;
					}
				}
			if (ct2)
				break;
		}
		if (ct2)
		{
			printf("YES\n%d\n", pos);
		}
		else
			puts("NO");
	}
}
```

## [Fire-Fighting Hero](https://nanti.jisuanke.com/t/41349)

Dijkstra 跑一下即可，多起点连到一个虚拟节点，边长为 0。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
const ll INF = 1e9 + 7;
struct Graph
{
	struct Vertex
	{
		vector<int> o;
	};
	struct Edge
	{
		int first, second;
		ll len; //边长、容量，图论算法使用
	};
	vector<Vertex> v; //点集
	vector<Edge> e;   //边集
	Graph(int n) : v(n) {}
	void add(const Edge &ed)
	{
		v[ed.first].o.push_back(e.size());
		e.push_back(ed);
	}
};
struct Dijkstra : Graph
{
	vector<ll> d;
	Dijkstra(int n) : Graph(n) {}
	ll ask(int s)
	{
		d.assign(v.size(), INF);
		priority_queue<pair<ll, int>> q;
		ll r = 0;
		for (q.push(make_pair(d[s] = 0, s)); !q.empty();)
		{
			ll dis = -q.top().first;
			int u = q.top().second;
			if (q.pop(), d[u] < dis)
				continue;
			r = dis;
			for (int i = 0, k, to; i != v[u].o.size(); ++i)
				if (k = v[u].o[i], to = e[k].second,
					d[to] > d[u] + e[k].len)
				{
					d[to] = d[u] + e[k].len;
					q.push(make_pair(-d[to], to));
				}
		}
		return r;
	}
};
int main()
{
	int t, v, e, s, k, c;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d%d%d%d", &v, &e, &s, &k, &c);
		Dijkstra g(v + 1);
		for (int i = 0, t; i < k; ++i)
			scanf("%d", &t), g.add({0, t, 0});
		for (int i = 0, x, y, z; i < e; ++i)
		{
			scanf("%d%d%d", &x, &y, &z);
			g.add({x, y, z});
			g.add({y, x, z});
		}
		ll ans1 = g.ask(s), ans2 = g.ask(0);
		printf("%d\n", ans1 <= ans2 * c ? ans1 : ans2);
	}
}
```

## [Magic Master](https://nanti.jisuanke.com/t/41352)

暴力模拟即可，不知道为什么通过率这么低。也许是因为题面太长了？

```cpp
#include <bits/stdc++.h>
using namespace std;
int t, n, m, q;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d%d", &n, &m, &q);
		for (int i = 0, k; i < q; ++i)
		{
			scanf("%d", &k);
			int hand = 0, desk = n;
			while (k > 1)
			{
				++hand, --desk, --k;
				k -= m;
				while (k < 1)
					k += desk;
			}
			printf("%d\n", hand + 1);
		}
	}
}
```

## [Pangu Separates Heaven and Earth](https://nanti.jisuanke.com/t/41354)

诚意很低的签到题，超长题面加超水签到题目？

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int t, n;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		puts(n == 1 ? "18000" : "0");
	}
}
```

## [The Nth Item](https://nanti.jisuanke.com/t/41355)

标解要用到二次剩余，这里我按照$2^{20}$进制对矩阵乘法的结果预处理，使得每一个询问可以在三个矩阵乘法的时间内算出来，同时使用了小常数的做法，最终通过了这道题。

```cpp
#include <bits/stdc++.h>
#define ll long long
#define mod 998244353
#define maxn (1 << 20)
using namespace std;
struct Mod
{
	const ll M, SM;
	Mod(ll M) : M(M), SM(sqrt(M) + 0.5) {}
	ll qadd(ll &a, ll b) const
	{
		return a += b, a >= M ? a -= M : a; //??a?b????????,??????,????????
	}
	ll add(ll a, ll b) const
	{
		return qadd(a = (a + b) % M, M); //??a?b??????????????
	}
	ll mul(ll a, ll b) const
	{
		return add(a * b, M);
	}
	ll inv(ll a) const
	{
		return pow(a, M - 2); //??M???,??return pow(a, phi(M) - 1);
	}
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a = add(a, M); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
};
Mod m(mod);
struct mat
{
	ll a, b, c, d;
	mat operator*(const mat &q) const
	{
		return {(a * q.a + b * q.c) % mod,
				(a * q.b + b * q.d) % mod,
				(c * q.a + d * q.c) % mod,
				(c * q.b + d * q.d) % mod};
	}
};
mat a[3][maxn + 9] = {(mat){1, 0, 0, 1}, (mat){3, 2, 1, 0}};
ll q, n, ans, ansb;
int main(void)
{
	scanf("%lld%lld", &q, &n);
	for (int i = 2; i <= maxn; i++)
		a[0][i] = a[0][i - 1] * a[0][1];
	a[1][0] = (mat){1, 0, 0, 1};
	a[1][1] = a[0][maxn];
	for (int i = 2; i <= maxn; i++)
		a[1][i] = a[1][i - 1] * a[1][1];
	a[2][1] = a[1][maxn];
	a[2][0] = (mat){1, 0, 0, 1};
	for (int i = 2; i <= maxn; i++)
		a[2][i] = a[2][i - 1] * a[2][1];
	for (int i = 1; i <= q; i++)
	{
		n = n ^ (ans * ans);
		//	n=i;
		mat tem = (mat){1, 0, 0, 1};
		ll temn = n - 1;
		if (temn)
		{
			tem = tem * a[0][temn - ((temn >> 20) << 20)], temn >>= 20;
			if (temn)
			{
				tem = tem * a[1][temn - ((temn >> 20) << 20)], temn >>= 20;
				if (temn)
					tem = tem * a[2][temn - ((temn >> 20) << 20)], temn >>= 20;
			}
		}
		ansb ^= ans = tem.a;
	}
	printf("%lld", ansb);
}
```
