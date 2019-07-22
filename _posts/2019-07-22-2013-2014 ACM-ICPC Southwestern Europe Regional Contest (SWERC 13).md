---
title: 2013-2014 ACM-ICPC Southwestern Europe Regional Contest (SWERC 13)
categories:
- ACM
- 题解
---
## [It Can Be Arranged](https://vjudge.net/problem/Gym-100443B)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll INF = 1e9;
struct Graph
{
	struct Vertex
	{
		vector<int> o /* , i*/; //相关出边和入边编号
								//int siz, dep, top, dfn;
								//树链剖分中使用，依次代表子树节点数、深度、所在链的顶端节点、dfs序
	};
	struct Edge
	{
		int first, second;
		ll /* len, */ cap; //边长、容量，图论算法使用
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
		for(deque<int> q(h[t]=gap[t]=1,t); !q.empty(); q.pop_front())//优化，加了能快一点
			for(int i=0,u=q.front(),k,to; i<v[u].o.size(); ++i)
				if(to=e[v[u].o[i]].second,!h[to])
					++gap[h[to]=h[u]+1],q.push_back(to);
		*/
		for (f.assign(e.size(), flow = 0); h[s] < v.size();)
			flow += dfs(s, s, t, INF);
	}
};
int main()
{
	int t, n, m, kase = 0;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &m);
		ISAP g(n * 2 + 2);
		vector<int> a(n), b(n);
		ll sum = 0;
		for (int i = 0, t; i < n; ++i)
		{
			scanf("%d%d%d", &a[i], &b[i], &t);
			sum += t = (t + m - 1) / m;
			g.add({n << 1, i << 1, t});
			g.add({i << 1 | 1, n << 1 | 1, t});
		}
		for (int i = 0; i < n; ++i)
			for (int j = 0, t; j < n; ++j)
			{
				scanf("%d", &t);
				if (b[i] + t < a[j])
					g.add({i << 1, j << 1 | 1, INF});
			}
		g.ask(n << 1, n << 1 | 1);
		cout << "Case " << ++kase << ": " << sum - g.flow << "\n";
	}
}
```

## [Shopping Malls](https://vjudge.net/problem/Gym-100443C)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef double lf;
typedef lf ll;
const ll INF = 1e18;
struct Graph
{
	struct Vertex
	{
		vector<int> o /* , i*/; //相关出边和入边编号
								//int siz, dep, top, dfn; //树链剖分中使用，依次代表子树节点数、深度、所在链的顶端节点、dfs序
		struct Coord3
		{
			lf X, Y, Z;
			friend Coord3 operator-(const Coord3 &a, const Coord3 &b) { return {a.X - b.X, a.Y - b.Y, a.Z - b.Z}; }
			friend lf abs(const Coord3 &a) { return sqrt(a.X * a.X + a.Y * a.Y + a.Z * a.Z); }
		} p;
	};
	struct Edge
	{
		int first, second;
		ll len /*, cap*/; //边长、容量，图论算法使用
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
struct Dijkstra : Graph
{
	vector<ll> d;
	vector<int> p;
	Dijkstra(int n) : Graph(n) {}
	void ask(int s)
	{
		d.assign(v.size(), INF);
		p.assign(v.size(), e.size());
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
					d[to] = d[u] + e[k].len, p[to] = k;
					q.push(make_pair(-d[to], to));
				}
		}
	}
	void print(int x)
	{
		if (p[x] != e.size())
			print(e[p[x]].first);
		printf("%d ", x);
	}
};
int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	Dijkstra g(n);
	for (int i = 0; i < n; ++i)
		scanf("%lf%lf%lf", &g.v[i].p.Z, &g.v[i].p.X, &g.v[i].p.Y), g.v[i].p.Z *= 5;
	for (int i = 0, a, b; i < m; ++i)
	{
		char s[15];
		scanf("%d%d%s", &a, &b, s);
		if (s[0] == 'l')
			g.add({a, b, 1}), g.add({b, a, 1});
		else if (s[0] == 'e')
			g.add({a, b, 1}), g.add({b, a, abs(g.v[a].p - g.v[b].p) * 3});
		else
			g.add({a, b, abs(g.v[a].p - g.v[b].p)}), g.add({b, a, abs(g.v[a].p - g.v[b].p)});
	}
	scanf("%d", &m);
	for (int i = 0, a, b; i < m; ++i)
	{
		scanf("%d%d", &a, &b);
		g.ask(a);
		g.print(b);
		printf("\n");
	}
}
```

## [Odd and Even Zeroes](https://vjudge.net/problem/Gym-100443F)

```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <string.h>
#include <cmath>
#include <stdio.h>
#include <stdlib.h>
using namespace std;
typedef long long LL;

const int maxn=30+10;
LL n;
int a[maxn];
struct data
{
	LL x,y;
}f[maxn];

data dfs(int now,int ok)
{
	data t;t.x=1ll;t.y=0ll;
	if (now==-1) return t;
	if (!ok && f[now].x!=-1) return f[now];

	data res;
	res.x=res.y=0;
	if (ok)
	{
		for (int i=0;i<a[now];i++)
		{
			data to=dfs(now-1,0);
			int x=now*i;
			if (x&1) {res.x+=to.y;res.y+=to.x;}else {res.x+=to.x;res.y+=to.y;}
		}

		data to=dfs(now-1,1);
		int x=now*a[now];
		if (x&1) {res.x+=to.y;res.y+=to.x;}else {res.x+=to.x;res.y+=to.y;}

		return res;
	}
	else
	{
		for (int i=0;i<5;i++)
		{
			data to=dfs(now-1,0);
			int x=now*i;
			if (x&1) {res.x+=to.y;res.y+=to.x;}else {res.x+=to.x;res.y+=to.y;}
		}

		f[now]=res;
		return res;
	}
}

int main()
{
	for (int i=0;i<30;i++) f[i].x=-1;

	scanf("%I64d",&n);
	while (n!=-1ll)
	{
		int m=0;
		while (n>0)
		{
			a[m++]=n%5ll;
			n/=5ll;
		}

		m--;
		data res=dfs(m,1);
		LL ans=res.x;
		printf("%I64d\n",ans);

		scanf("%I64d",&n);
	}

	return 0;
}
```

## [VivoParc](https://vjudge.net/problem/Gym-100443G)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 127;
int n, x, y, ans[N], g[N][N];
void dfs(int k)
{
	if (k > n)
	{
		for (int i = 1; i < k; ++i)
			printf("%d %d\n", i, ans[i]);
		exit(0);
	}
	vector<int> cnt(5, 0);
	for (int i = 1; i < k; ++i)
		if (g[k][i])
			++cnt[ans[i]];
	for (int i = 1; i < cnt.size(); ++i)
		if (!cnt[i])
			ans[k] = i, dfs(k + 1);
}
int main()
{
	for (scanf("%d", &n); ~scanf("%d-%d", &x, &y);)
		g[x][y] = g[y][x] = 1;
	dfs(1);
}
```

## [Binary Tree](https://vjudge.net/problem/Gym-100443H)

```cpp
#include <iostream>
#include <algorithm>
#include <string>
#include <string.h>
#include <cmath>
#include <stdio.h>
#include <stdlib.h>
using namespace std;

const int maxn=100000+10,mod=21092013;
int T,n,k;
int f[maxn];
char ch[maxn];

int main()
{
	scanf("%d",&T);
	for(int t=1;t<=T;t++)
	{
		scanf("%s",ch);
		int Li=strlen(ch);

		int k=0;
		for(int i=0;i<Li;i++)
		{
			if (ch[i]=='U' && k!=0) k--;
			if (ch[i]=='L') f[++k]=0;
			if (ch[i]=='R') f[++k]=1;
		}

		scanf("%s",ch);
		Li=strlen(ch);

		int ans=1,L=1,R=1;
		for(int i=0;i<Li;i++)
		{
			if (ch[i]=='L') {ans=(ans+L)%mod;R=(L+R)%mod;}
			if (ch[i]=='R') {ans=(ans+R)%mod;L=(L+R)%mod;}
			if (ch[i]=='U'&&k)
			{
				ans=(ans+1)%mod;
				if(f[k]==1) L=(L+1)%mod;
					else R=(R+1)%mod;
				k--;
			}
		}

		printf("Case %d: %d\n",t,ans);
	}

	return 0;
}
```

## [Trending Topic](https://vjudge.net/problem/Gym-100443I)

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	map<string, int> q[7], sum;
	int day = 0, n;
	for (char s[31]; ~scanf("%s", s);)
	{
		if (!strcmp(s, "<text>"))
		{
			for (const auto &p : q[day])
				sum[p.first] -= p.second;
			q[day].clear();
			for (; scanf("%s", s), strcmp(s, "</text>");)
				if (strlen(s) > 3)
					++q[day][s];
			for (const auto &p : q[day])
				sum[p.first] += p.second;
			if (++day > 6)
				day = 0;
		}
		else
		{
			scanf("%d%s", &n, s);
			cout << "<top " << n << ">\n";
			vector<pair<int, string>> v;
			for (const auto &p : sum)
				if (p.second)
					v.emplace_back(-p.second, p.first);
			sort(v.begin(), v.end());
			while (n < v.size() && v[n].first == v[n - 1].first)
				++n;
			for (int i = 0; i < n && i < v.size(); ++i)
				cout << v[i].second << ' ' << -v[i].first << '\n';
			cout << "</top>\n";
		}
	}
}
```
