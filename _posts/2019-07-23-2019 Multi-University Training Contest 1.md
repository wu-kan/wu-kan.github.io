---
title: 2019 Multi-University Training Contest 1
categories:
- ACM
- 题解
---
## [Vacation](https://vjudge.net/problem/HDU-6581)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, l[N], s[N], v[N];
int main()
{
	while (~scanf("%d", &n))
	{
		for (int i = 0; i <= n; ++i)
			scanf("%d", &l[i]);
		for (int i = 0; i <= n; ++i)
			scanf("%d", &s[i]);
		for (int i = 0; i <= n; ++i)
			scanf("%d", &v[i]);
		double ans = s[0] * 1.0 / v[0], sum = 0;
		for (int i = 1; i <= n; ++i)
			sum += l[i], ans = max(ans, (sum + s[i]) / v[i]);
		printf("%.9f\n", ans);
	}
}
```

## [Path](https://vjudge.net/problem/HDU-6582)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll INF = 4e18;
struct Graph
{
	struct Vertex
	{
		vector<int> o;
	};
	struct Edge
	{
		int first, second;
		ll len, cap;
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
struct Dijkstra : Graph
{
	vector<ll> d;
	Dijkstra(int n) : Graph(n) {}
	void ask(int s)
	{
		d.assign(v.size(), INF);
		priority_queue<pair<ll, int>> q;
		for (q.push(make_pair(d[s] = 0, s)); !q.empty();)
		{
			ll dis = -q.top().first;
			int u = q.top().second;
			if (q.pop(), d[u] < dis)
				continue;
			for (int i = 0, k, to; i != v[u].o.size(); ++i)
				if (k = v[u].o[i], to = e[k].second,
					d[to] > d[u] + e[k].len)
				{
					d[to] = d[u] + e[k].len;
					q.push(make_pair(-d[to], to));
				}
		}
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
	int t, n, m;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &m);
		Dijkstra g(n);
		for (int i = 0, x, y, c; i < m; ++i)
		{
			scanf("%d%d%d", &x, &y, &c);
			g.add({x - 1, y - 1, c, c});
		}
		g.ask(0);
		ISAP h(n);
		for (int i = 0; i < m; ++i)
			if (g.d[g.e[i].first] + g.e[i].len == g.d[g.e[i].second])
				h.add(g.e[i]);
		h.ask(0, n - 1);
		cout << h.flow << '\n';
	}
}
```
