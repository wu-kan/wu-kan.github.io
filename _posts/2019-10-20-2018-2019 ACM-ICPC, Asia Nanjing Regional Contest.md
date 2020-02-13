---
title: 2018-2019 ACM-ICPC, Asia Nanjing Regional Contest
tags:
  - ACM
  - 题解
---

## [Adrien and Austin](https://vjudge.net/problem/Gym-101981A)

特判$n=0$和$k=1$的两种情况。对于其他情况，先手方可以通过取`1`或`2`将原始序列断成左右等长的两部分，然后“模仿”对手的操作即必胜。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int n, k;
	scanf("%d%d", &n, &k);
	if (n == 0)
		return printf("Austin"), 0;
	if (k == 1)
		return printf(n & 1 ? "Adrien" : "Austin"), 0;
	printf("Adrien");
}
```

## [Country Meow](https://vjudge.net/problem/Gym-101981D)

三维最小球覆盖模板题，这里拉了一个模拟退火的模板。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef double lf;
const lf EPS = 1e-9, INF = 1e9;
int sgn(lf d) { return (d > EPS) - (d < -EPS); }
struct Coord3
{
	lf X, Y, Z;
	Coord3 &operator-=(const Coord3 &b) { return X -= b.X, Y -= b.Y, Z -= b.Z, *this; }
	friend Coord3 operator-(Coord3 a, const Coord3 &b) { return a -= b; }
	Coord3 &operator*=(lf d) { return X *= d, Y *= d, Z *= d, *this; }
	friend Coord3 operator*(Coord3 a, lf d) { return a *= d; }
	friend Coord3 operator*(lf d, Coord3 a) { return a *= d; }
	friend lf Dot(const Coord3 &A, const Coord3 &B) { return A.X * B.X + A.Y * B.Y + A.Z * B.Z; }
	friend lf norm(const Coord3 &A) { return Dot(A, A); }
	friend lf abs(const Coord3 &A) { return sqrt(norm(A)); }
	friend lf minBall(const vector<Coord3> &data, const lf eps = EPS * 1e-3) //模拟退火求最小球覆盖，EPS玄学调整
	{
		lf step = 1, ans = INF;
		for (Coord3 z{0, 0, 0}; step > eps; step *= 0.99)
		{
			int s = 0;
			for (int i = 0; i < data.size(); ++i)
				if (abs(z - data[s]) < abs(z - data[i]))
					s = i;
			ans = min(ans, abs(z - data[s]));
			z -= (z - data[s]) * step;
		}
		return ans;
	}
};
int main()
{
	int n;
	scanf("%d", &n);
	vector<Coord3> p(n);
	for (int i = 0; i < n; ++i)
		scanf("%lf%lf%lf", &p[i].X, &p[i].Y, &p[i].Z);
	printf("%.9f\n", minBall(p));
}
```

## [Pyramid](https://vjudge.net/problem/Gym-101981G)

打表找规律后秒掉。要注意的是这里除法逆元要预处理，否则超时。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
struct Mod
{
	const ll M;
	Mod(const ll M) : M(M) {}
	ll mul(ll a, long long b) const { return a * b % M; }
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a %= M; b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
	ll inv(ll a) const { return pow(a, M - 2); }
} M(1e9 + 7);
ll t, n, inv = M.inv(24);
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		printf("%d\n", M.mul(n - 3, M.mul(n - 4, M.mul(n - 5, M.mul(n - 6, inv)))));
	}
}
```

## [Magic Potion](https://vjudge.net/problem/Gym-101981I)

想到网络流之后就很好建图了。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
const ll INF = 1e9;
struct Graph
{
	struct Vertex
	{
		vector<int> o; //, i;		//相关出边和入边编号
					   //int siz, dep, top, dfn; //树链剖分中使用，依次代表子树节点数、深度、所在链的顶端节点、dfs序
	};
	struct Edge
	{
		int first, second;
		ll cap; //边长、容量，图论算法使用
	};
	vector<Vertex> v; //点集
	vector<Edge> e;   //边集
	Graph(int n) : v(n) {}
	void add(const Edge &ed)
	{
		if (ed.first == ed.second)
			return; //如果有需要请拆点
		v[ed.first].o.push_back(e.size());
		//v[ed.second].i.push_back(e.size());
		e.push_back(ed);
	}
	//int ch(int u, int i = 0) { return e[v[u].o[i]].second; } //u的第i个孩子节点
	//int fa(int u, int i = 0) { return e[v[u].i[i]].first; }  //u的第i个父节点
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
		/*
		for (deque<int> q(h[t] = gap[t] = 1, t); !q.empty(); q.pop_front()) //优化，加了能快一点
			for (int i = 0, u = q.front(), k, to; i < v[u].o.size(); ++i)
				if (to = e[v[u].o[i]].second, !h[to])
					++gap[h[to] = h[u] + 1], q.push_back(to);
		*/
		for (f.assign(e.size(), flow = 0); h[s] < v.size();)
			flow += dfs(s, s, t, INF);
	}
};
int main()
{
	int n, m, k, s, t, ss;
	scanf("%d%d%d", &n, &m, &k);
	ISAP g(2 * n + m + 3);
	s = 2 * n + m;
	ss = s + 1;
	t = ss + 1;
	g.add({s, ss, k});
	for (int i = 0, tt; i < n; ++i)
	{
		for (scanf("%d", &tt); tt--;)
		{
			scanf("%d", &k);
			g.add({i, n + n + k - 1, 1});
			g.add({n + i, n + n + k - 1, 1});
		}
		g.add({s, i, 1});
		g.add({ss, n + i, 1});
	}
	for (int i = 0; i < m; ++i)
		g.add({n + n + i, t, 1});
	g.ask(s, t);
	printf("%d", g.flow);
}
```

## [Prime Game](https://vjudge.net/problem/Gym-101981J)

计算每个素因子在原序列中出现的位置，然后逐个每个素因子计算对答案的贡献。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e6 + 9;
struct EulerSieve
{
	vector<int> p, m;			//, phi, mu; //素数序列，最小素因子，欧拉函数，莫比乌斯函数
	EulerSieve(int N) : m(N, 0) //, phi(N, 0), mu(N, 0)
	{
		//phi[1] = mu[1] = 1;					 //m[1]=0,m[i]==i可判断i是素数
		for (long long i = 2, k; i < N; ++i) //防i*p[j]爆int
		{
			if (!m[i])
				p.push_back(m[i] = i); //, phi[i] = i - 1, mu[i] = -1; //i是素数
			for (int j = 0; j < p.size() && (k = i * p[j]) < N; ++j)
			{
				//phi[k] = phi[i] * p[j];
				if ((m[k] = p[j]) == m[i])
				{
					//	mu[k] = 0;
					break;
				}
				//phi[k] -= phi[i];
				//mu[k] = -mu[i];
			}
		}
	}
	void fac(int n, vector<int> &f)
	{
		if (n < 2)
			return;
		f.push_back(m[n]);
		fac(n / m[n], f);
	}
} e(N);
int n;
vector<int> p[N];
int main()
{
	scanf("%d", &n);
	for (int i = 0, a; i < n; ++i)
	{
		scanf("%d", &a);
		vector<int> fac;
		e.fac(a, fac);
		fac.resize(unique(fac.begin(), fac.end()) - fac.begin());
		for (int j = 0; j < fac.size(); ++j)
			p[fac[j]].push_back(i);
	}
	ll ans = 0;
	for (int i = 0; i < e.p.size(); ++i)
	{
		int a = e.p[i];
		if (p[a].empty())
			continue;
		ans += n * ll(n + 1) >> 1;
		for (int i = 0; i <= p[a].size(); ++i)
		{
			ll len;
			if (i == 0)
				len = p[a][0];
			else if (i == p[a].size())
				len = n - p[a].back() - 1;
			else
				len = p[a][i] - p[a][i - 1] - 1;
			ans -= len * (len + 1) >> 1;
		}
	}
	printf("%lld", ans);
}
```
