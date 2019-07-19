---
title: The 13th Chinese Northeast Collegiate Programming Contest
categories:
- ACM
- 题解
---
## [Balanced Diet](https://vjudge.net/problem/Gym-102220B)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Fenwick
{
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
			ll r = 0;
			for (; x; x -= x & -x)
				r += v[x];
			return r;
		}
	};
	pair<BaseFenwick, BaseFenwick> p;
	Fenwick(int n) : p(n + 99, n + 99) {}
	void add(int x, ll w)
	{
		p.first.add(x, w), p.second.add(x, x * w);
	}
	void add(int l, int r, ll w)
	{
		l += 9, r += 9;
		add(l, w), add(r + 1, -w);
	}
	ll ask(int x)
	{
		return (x + 1) * p.first.ask(x) - p.second.ask(x);
	}
	ll ask(int l, int r)
	{
		l += 9, r += 9;
		return ask(r) - ask(l - 1);
	}
};
int main()
{
	int t, n, m;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &m);
		vector<pair<int, vector<ll>>> vv(m);
		for (int i = 0; i < m; ++i)
			scanf("%d", &vv[i].first);
		for (int i = 0, a, b; i < n; ++i)
		{
			scanf("%d%d", &a, &b);
			vv[b - 1].second.push_back(a);
		}
		Fenwick t(n + 9);
		for (auto &p : vv)
		{
			sort(p.second.rbegin(), p.second.rend());
			for (int i = 0; i < p.second.size(); ++i)
				t.add(max(i + 1, p.first), n, p.second[i]);
		}
		ll u = 0, v = 1;
		for (ll i = 1; i <= n; ++i)
		{
			ll c = i, s = t.ask(c, c), g = __gcd(c, s);
			c /= g, s /= g;
			if (s * v > c * u)
				u = s, v = c;
		}
		cout << u << '/' << v << '\n';
	}
}
```

## [Line-line Intersection](https://vjudge.net/problem/Gym-102220C)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
int t, n;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		map<ll, map<ll, pair<ll, map<ll, map<ll, map<ll, ll>>>>>> mp;
		ll ans = 0;
		for (int i = 0, x1, y1, x2, y2; i < n; ++i)
		{
			scanf("%d%d%d%d", &x1, &y1, &x2, &y2);
			ll A = x2 - x1, B = y2 - y1, C = 1LL * x1 * y2 - 1LL * y1 * x2;
			if (!A)
			{
				ll g = __gcd(B, C);
				B /= g, C /= g;
				if (B < 0)
					B = -B, C = -C;
			}
			else if (!B)
			{
				ll g = __gcd(A, C);
				A /= g, C /= g;
				if (A < 0)
					A = -A, C = -C;
			}
			else
			{
				ll g = __gcd(__gcd(A, B), C);
				A /= g, B /= g, C /= g;
				if (A < 0)
					A = -A, B = -B, C = -C;
			}
			ll a = A / __gcd(A, B), b = B / __gcd(A, B);
			if (a < 0)
				a = -a, b = -b;
			auto &p = mp[a][b];
			ans += i - p.first++;
			ans += p.second[A][B][C]++;
		}
		cout << ans << '\n';
	}
}
```

## [Minimum Spanning Tree](https://vjudge.net/problem/Gym-102220E)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e5 + 9;
struct UnionfindSet : vector<int>
{
	UnionfindSet(int n) : vector<int>(n)
	{
		for (int i = 0; i < n; ++i)
			at(i) = i;
	}
	int merge(int u, int w)
	{
		if (w = ask(w), u = ask(u), w != u)
			return at(w) = u, 1;
		return 0;
	}
	int ask(int u) { return at(u) != u ? at(u) = ask(at(u)) : u; }
};
struct Edge
{
	int u, v;
	ll w;
	bool operator<(const Edge &ed) const { return w < ed.w; }
} e[N];
int t, n, m;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		for (int i = 0, u, v, w; i + 1 < n; ++i)
		{
			scanf("%d%d%d", &u, &v, &w);
			e[i] = {u - 1, v - 1, w};
		}
		sort(e, e + n - 1);
		vector<vector<int>> v(n);
		for (int i = 0; i + 1 < n; ++i)
			v[e[i].u].push_back(i), v[e[i].v].push_back(i);
		ll ans = 0;
		vector<int> flag(n, 0);
		UnionfindSet ufs(n - 1);
		for (int i = 0; i + 1 < n; ++i)
			for (auto u : {e[i].u, e[i].v})
				if (!flag[u])
				{
					flag[u] = 1;
					for (auto it : v[u])
						if (ufs.merge(i, it))
							ans += e[i].w + e[it].w;
				}
		cout << ans << '\n';
	}
}
```

## [Radar Scanner](https://vjudge.net/problem/Gym-102220G)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;

const int maxn = 100000 + 10;
int T, n;
struct data
{
	int Lx, Rx, Ly, Ry;
} a[maxn];

int main()
{
	scanf("%d", &T);
	while (T--)
	{
		scanf("%d", &n);
		for (int i = 1; i <= n; i++)
			scanf("%d%d%d%d", &a[i].Lx, &a[i].Ly, &a[i].Rx, &a[i].Ry);

		int L = 0, R = 1e9 + 1;
		LL ans1 = 0, ans2 = 0;
		while (L + 1 < R)
		{
			int mid = (L + R) / 2;

			int Le = 0, Ri = 0;
			for (int i = 1; i <= n; i++)
			{
				if (a[i].Rx < mid)
					Le++;
				if (a[i].Lx > mid)
					Ri++;
			}
			if (Le > Ri)
				R = mid;
			else
				L = mid;
		}
		for (int i = 1; i <= n; i++)
		{
			if (a[i].Rx < L)
				ans1 += (LL)(L - a[i].Rx);
			if (a[i].Rx < R)
				ans2 += (LL)(R - a[i].Rx);
			if (a[i].Lx > L)
				ans1 += (LL)(a[i].Lx - L);
			if (a[i].Lx > R)
				ans2 += (LL)(a[i].Lx - R);
		}

		L = 0;
		R = 1e9 + 1;
		LL ans3 = 0, ans4 = 0;
		while (L + 1 < R)
		{
			int mid = (L + R) / 2;

			int Le = 0, Ri = 0;
			for (int i = 1; i <= n; i++)
			{
				if (a[i].Ry < mid)
					Le++;
				if (a[i].Ly > mid)
					Ri++;
			}
			if (Le > Ri)
				R = mid;
			else
				L = mid;
		}
		for (int i = 1; i <= n; i++)
		{
			if (a[i].Ry < L)
				ans3 += (LL)(L - a[i].Ry);
			if (a[i].Ry < R)
				ans4 += (LL)(R - a[i].Ry);
			if (a[i].Ly > L)
				ans3 += (LL)(a[i].Ly - L);
			if (a[i].Ly > R)
				ans4 += (LL)(a[i].Ly - R);
		}

		LL ans = min(ans1, ans2) + min(ans3, ans4);
		printf("%I64d\n", ans);
	}

	return 0;
}
```

## [Skyscraper](https://vjudge.net/problem/Gym-102220H)

{% raw %}

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int NPOS = -1, N = 1e5 + 9;
int t, n, m, a[N];
struct SegmentTree
{
	struct Node
	{
		struct Val
		{
			int l, r;
			ll lv, rv, ans;
			void upd(ll mul, ll add)
			{
				lv += add, rv += add, ans += add;
			}
			friend Val up(const Val &lc, const Val &rc)
			{
				return {lc.l, rc.r, lc.lv, rc.rv, lc.ans + rc.ans - min(lc.rv, rc.lv)};
			}
		} v;
		int lc, rc;
		ll mul, add;
	};
	vector<Node> v;
	SegmentTree(int l, int r)
	{
		v.reserve(r - l + 9 << 1), build(l, r);
	}
	void build(int l, int r)
	{
		v.push_back({{l, r, a[l], a[l], a[l]}, NPOS, NPOS, 1, 0});
		if (l < r)
		{
			int rt = v.size() - 1;
			down(rt), v[rt].v = up(v[v[rt].lc].v, v[v[rt].rc].v);
		}
	}
	void down(int rt)
	{
		int m = v[rt].v.l + v[rt].v.r >> 1;
		if (v[rt].lc == NPOS)
			v[rt].lc = v.size(), build(v[rt].v.l, m);
		if (v[rt].rc == NPOS)
			v[rt].rc = v.size(), build(m + 1, v[rt].v.r);
		upd(v[v[rt].lc].v.l, v[v[rt].lc].v.r, v[rt].mul, v[rt].add, v[rt].lc);
		upd(v[v[rt].rc].v.l, v[v[rt].rc].v.r, v[rt].mul, v[rt].add, v[rt].rc);
		v[rt].mul = 1, v[rt].add = 0;
	}
	void upd(int l, int r, ll mul, ll add, int rt = 0)
	{
		if (l <= v[rt].v.l && v[rt].v.r <= r)
			return v[rt].mul *= mul, v[rt].add = v[rt].add * mul + add, v[rt].v.upd(mul, add);
		down(rt);
		if (r <= v[v[rt].lc].v.r)
			upd(l, r, mul, add, v[rt].lc);
		else if (l >= v[v[rt].rc].v.l)
			upd(l, r, mul, add, v[rt].rc);
		else
			upd(l, v[v[rt].lc].v.r, mul, add, v[rt].lc), upd(v[v[rt].rc].v.l, r, mul, add, v[rt].rc);
		v[rt].v = up(v[v[rt].lc].v, v[v[rt].rc].v);
	}
	Node::Val ask(int l, int r, int rt = 0)
	{
		if (l <= v[rt].v.l && v[rt].v.r <= r)
			return v[rt].v;
		down(rt);
		if (r <= v[v[rt].lc].v.r)
			return ask(l, r, v[rt].lc);
		if (l >= v[v[rt].rc].v.l)
			return ask(l, r, v[rt].rc);
		return up(ask(l, v[v[rt].lc].v.r, v[rt].lc), ask(v[v[rt].rc].v.l, r, v[rt].rc));
	}
};
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &m);
		for (int i = 1; i <= n; ++i)
			scanf("%d", &a[i]);
		SegmentTree t(1, n);
		for (int i = 1, l, r, k; i <= m; ++i)
		{
			scanf("%d%d%d", &k, &l, &r);
			if (k == 2)
				cout << t.ask(l, r).ans << '\n';
			else
				scanf("%d", &k), t.upd(l, r, 1, k);
		}
	}
}
```

{% endraw %}

## [Time Limit](https://vjudge.net/problem/Gym-102220J)

```cpp
#include <bits/stdc++.h>
using namespace std;

const int maxn = 10 + 10;
int T, n;
int a[maxn];

int main()
{
	scanf("%d", &T);
	while (T--)
	{
		scanf("%d", &n);

		int tim = 0;
		for (int i = 1; i <= n; i++)
		{
			scanf("%d", &a[i]);

			if (i == 1)
				tim = 3 * a[i];
			else if (a[i] >= tim)
				tim = a[i] + 1;
			if (tim % 2 == 1)
				tim++;
		}
		printf("%d\n", tim);
	}

	return 0;
}
```
