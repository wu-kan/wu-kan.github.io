---
title: The 16th Zhejiang Provincial Collegiate Programming Contest Sponsored by TuSimple
tags:
  - ACM
  - 题解
---

## [Vertices in the Pocket](https://vjudge.net/problem/ZOJ-4100)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e5 + 9;
int t, n, q, sz[N], f[N];
int fa(int x) { return x == f[x] ? x : f[x] = fa(f[x]); }
ll c2(ll x) { return x * (x - 1) / 2; }
ll sq(ll x) { return x * x; }
struct Node
{
	ll val[3];
	ll calc() { return (val[1] * val[1] - val[2]) / 2; }
} v[N << 2];
Node up(const Node &lc, const Node &rc)
{
	Node t;
	for (int i = 0; i < 3; ++i)
		t.val[i] = lc.val[i] + rc.val[i];
	return t;
}
void build(int l, int r, int x = 1)
{
	for (int i = 0; i < 3; ++i)
		v[x].val[i] = 0;
	if (l == r)
		return;
	int mid = l + r >> 1;
	build(l, mid, x << 1);
	build(mid + 1, r, x << 1 | 1);
}
void update(int p, ll sgn, int l, int r, int x = 1)
{
	if (l == r)
	{
		v[x].val[0] += sgn;
		v[x].val[1] += sgn * l;
		v[x].val[2] += sgn * l * l;
		return;
	}
	int mid = l + r >> 1;
	if (p <= mid)
		update(p, sgn, l, mid, x << 1);
	else
		update(p, sgn, mid + 1, r, x << 1 | 1);
	v[x] = up(v[x << 1], v[x << 1 | 1]);
}
int askLeft;
ll curAns;
int bin(const Node &suf, ll i, ll k)
{
	for (int l = 1, r = n;;)
	{
		if (l >= r)
			return r;
		ll mid = l + r >> 1;
		if ((sq(mid * i + suf.val[1]) - mid * sq(i) - suf.val[2]) / 2 >= k)
			r = mid;
		else
			l = mid + 1;
	}
}
Node ask(ll k, const Node &suf, int l, int r, int x)
{
	if (l == r)
	{
		int j = bin(suf, l, k);
		Node temp = v[x];
		for (int i = 1; i < 3; ++i)
			temp.val[i] = temp.val[i] / temp.val[0] * j;
		temp.val[0] = j;
		askLeft = l;
		return up(suf, temp);
	}
	int mid = l + r >> 1;
	Node tot = up(v[x << 1 | 1], suf);
	ll rval = tot.calc();
	if (k <= rval)
		return ask(k, suf, mid + 1, r, x << 1 | 1);
	return ask(k, tot, l, mid, x << 1);
}
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		for (int i = 1; i <= n; ++i)
			f[i] = i, sz[i] = 1;
		build(1, n + 1);
		ll maxEdges = 0, curEdges = 0, blocks = n;
		for (int i = 1; i <= n; ++i)
			update(1, 1, 1, n + 1, 1);
		for (scanf("%d", &q); q--;)
		{
			ll op;
			scanf("%lld", &op);
			if (op == 1)
			{
				int x, y;
				scanf("%d%d", &x, &y);
				++curEdges;
				if (fa(x) != fa(y))
				{
					maxEdges += c2(sz[f[x]] + sz[f[y]]) - c2(sz[f[x]]) - c2(sz[f[y]]);
					update(sz[f[x]], -1, 1, n + 1);
					update(sz[f[y]], -1, 1, n + 1);
					update(sz[f[x]] + sz[f[y]], 1, 1, n + 1);
					sz[f[y]] += sz[f[x]];
					f[f[x]] = f[y];
					--blocks;
				}
			}
			else
			{
				scanf("%lld", &op);
				ll minAns = blocks - min(op, blocks - 1LL), maxAns = blocks;
				ll k = op - (maxEdges - curEdges);
				if (k > 0)
				{
					Node res = ask(k, Node(), 1, n + 1, 1);
					maxAns -= res.val[0] - 1;
				}
				printf("%lld %lld\n", minAns, maxAns);
			}
		}
	}
}
```

## [Element Swapping](https://vjudge.net/problem/ZOJ-4101)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 1e5 + 9;
ll t, n, x, y, ans, b[N];
int main()
{
	for (scanf("%lld", &t); t--;)
	{
		scanf("%lld%lld%lld", &n, &x, &y);
		ll x1 = ans = 0, y1 = 0;
		unordered_map<ll, ll> mp;
		for (ll i = 1; i <= n; ++i)
		{
			scanf("%lld", &b[i]);
			x1 += i * b[i], y1 += i * b[i] * b[i];
			++mp[b[i]];
		}
		if (x == x1)
		{
			if (y == y1)
			{
				for (auto it : mp)
					ans += it.second * (it.second - 1);
				printf("%lld\n", ans / 2);
				continue;
			}
			else
			{
				printf("0\n");
				continue;
			}
			continue;
		}
		if ((y - y1) % (x - x1))
		{
			printf("0\n");
			continue;
		}
		for (ll i = 1; i <= n; ++i)
		{
			ll bj = (y - y1) / (x - x1) - b[i];
			if (b[i] != bj)
				if ((x - x1) % (b[i] - bj) == 0)
				{
					ll j = i + (x - x1) / (b[i] - bj);
					if (1 <= j && j <= n && bj == b[j])
						++ans;
				}
		}
		printf("%lld\n", ans / 2);
	}
}
```

## [Array in the Pocket](https://vjudge.net/problem/ZOJ-4102)

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int t;
	for (scanf("%d", &t); t--;)
	{
		int n, imp = 0;
		scanf("%d", &n);
		vector<int> a(n + 1), c(n + 1), r(n + 1), ans(n + 1);
		set<pair<int, int>> re;
		set<int> ce;
		for (int i = 1; i <= n; ++i)
			scanf("%d", &a[i]), ++c[a[i]];
		for (int i = 1; i <= n; ++i)
			if (c[i])
				ce.insert(i), re.emplace(r[i] = 2 * c[i], i);
		for (int i = 1; !imp && i <= n; ++i)
		{
			int p = re.rbegin()->second;
			if (r[p] > n - i + 1)
			{
				imp = 1;
				printf("Impossible\n");
				break;
			}
			else if (r[p] < n - i + 1 || p == a[i])
			{
				auto it = ce.begin();
				if (*it == a[i])
					++it;
				p = *it;
			}
			re.erase({r[a[i]], a[i]});
			re.erase({r[p], p});
			--r[a[i]];
			--r[p];
			if (r[a[i]])
				re.emplace(r[a[i]], a[i]);
			if (r[p])
				re.emplace(r[p], p);
			if (--c[ans[i] = p] == 0)
				ce.erase(p);
		}
		if (!imp)
			for (int i = 1; i <= n; ++i)
				printf("%d%c", ans[i], i < n ? ' ' : '\n');
	}
}
```

## [Traveler](https://vjudge.net/problem/ZOJ-4103)

居然剪枝搜一下就过了…

```cpp
#include <bits/stdc++.h>
using namespace std;
struct Graph
{
	struct Vertex
	{
		vector<int> to;
		int ind, vis;
	};
	vector<Vertex> v;
	vector<int> ans;
	Graph(int n) : v(n) {}
	int dfs(int u, int dep)
	{
		if (v[u].vis = 1, ans.push_back(u), !dep)
			return 1;
		for (auto to : v[u].to)
			if (!v[to].vis)
			{
				int ok = 1;
				++v[to].ind;
				for (auto to : v[u].to)
					if (!--v[to].ind && !v[to].vis)
						ok = 0;
				if (ok && dfs(to, dep - 1))
					return 1;
				--v[to].ind;
				for (auto to : v[u].to)
					++v[to].ind;
			};
		return ans.pop_back(), v[u].vis = 0;
	}
};
int main()
{
	int t, n;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		Graph g(n + 1);
		for (int i = 1; i <= n; ++i)
			for (auto to : {i / 2, i - 1, i * 2, i * 2 + 1})
				if (2 <= to && to <= n)
					g.v[i].to.push_back(to), ++g.v[to].ind;
		if (!g.dfs(1, n - 1))
			printf("Impossible\n");
		else
			for (int i = 0; i < g.ans.size(); ++i)
				printf("%d%c", g.ans[i], i < g.ans.size() - 1 ? ' ' : '\n');
	}
}
```

## [Sequence in the Pocket](https://vjudge.net/problem/ZOJ-4104)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int t, n, b[N];
pair<int, int> a[N];
int main()
{
	scanf("%d", &t);
	for (int i = 1; i <= t; ++i)
	{
		scanf("%d", &n);
		for (int i = 1; i <= n; ++i)
		{
			scanf("%d", &b[i]);
			a[i] = {b[i], i};
		}
		sort(a + 1, a + n + 1, greater<pair<int, int>>());
		int ans = 0;
		for (int i = 1, p = n + 1; p && i <= n; ++i)
		{
			for (--p; p && a[i].first != b[p];)
				--p;
			if (!p)
				ans = n - i + 1;
		}
		printf("%d\n", ans);
	}
}
```

## [Abbreviation](https://vjudge.net/problem/ZOJ-4105)

```cpp
#include <bits/stdc++.h>
using namespace std;
char vowel[7] = "aeiyou", s[127];
int t;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%s", s);
		for (int i = 0; s[i]; ++i)
			if (!i || find(vowel, vowel + 6, s[i]) == vowel + 6)
				putchar(s[i]);
		putchar('\n');
	}
}
```

## [Lucky 7 in the Pocket](https://vjudge.net/problem/ZOJ-4106)

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int t, n;
	for (scanf("%d", &t); t--;)
	{
		for (scanf("%d", &n); n % 7 || n % 4 == 0;)
			++n;
		printf("%d\n", n);
	}
}
```

## [Singing Everywhere](https://vjudge.net/problem/ZOJ-4107)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int t, n, ans, a[N];
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		for (int i = 0; i < n; ++i)
			scanf("%d", &a[i]);
		if (n < 4)
		{
			printf("0\n");
			continue;
		}
		for (int i = ans = 0; i < n; ++i)
		{
			int cnt = 0;
			for (int j = i - 1; j <= i + 1; ++j)
			{
				if (j <= 0 || j >= n - 1)
					continue;
				if (j == 1)
				{
					if ((i == 0 || i == 1) && a[j - 1] < a[j] && a[j + 1] < a[j])
						--cnt;
					if (i == 2)
					{
						if (a[j - 1] < a[j] && a[j + 1] < a[j])
							--cnt;
						if (a[j - 1] < a[j] && a[j + 2] < a[j])
							++cnt;
					}
					continue;
				}
				if (j == n - 2)
				{
					if ((i == n - 1 || i == n - 2) && a[j - 1] < a[j] && a[j + 1] < a[j])
						--cnt;
					if (i == n - 3)
					{
						if (a[j - 1] < a[j] && a[j + 1] < a[j])
							--cnt;
						if (a[j - 2] < a[j] && a[j + 1] < a[j])
							++cnt;
					}
					continue;
				}
				if (j == i)
				{
					if (a[j - 1] < a[j] && a[j + 1] < a[j])
						--cnt;
					continue;
				}
				if (j == i - 1)
				{
					if (a[j - 1] < a[j] && a[j + 1] < a[j])
						--cnt;
					if (a[j - 1] < a[j] && a[j + 2] < a[j])
						++cnt;
					continue;
				}
				if (j == i + 1)
				{
					if (a[j - 1] < a[j] && a[j + 1] < a[j])
						--cnt;
					if (a[j - 2] < a[j] && a[j + 1] < a[j])
						++cnt;
					continue;
				}
			}
			ans = min(ans, cnt);
		}
		for (int i = 1; i + 1 < n; ++i)
			if (a[i - 1] < a[i] && a[i + 1] < a[i])
				++ans;
		printf("%d\n", ans);
	}
}
```

## [Fibonacci in the Pocket](https://vjudge.net/problem/ZOJ-4108)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e4 + 9;
int calc(char s[])
{
	int r = 0;
	for (int i = 0; s[i]; ++i)
		r = (r * 10 + s[i] - '0') % 3;
	return r;
}
char a[N], b[N];
int t;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%s%s", &a, &b);
		printf("%d\n", ((calc(a) + 2) % 3 != 1) != (calc(b) != 1));
	}
}
```

## [Welcome Party](https://vjudge.net/problem/ZOJ-4109)

```cpp
#include <bits/stdc++.h>
using namespace std;
struct UnionfindSet : vector<int>
{
	UnionfindSet(int n) : vector<int>(n)
	{
		for (int i = 0; i < n; ++i)
			at(i) = i;
	}
	void merge(int u, int w)
	{
		if (w = ask(w), u = ask(u), w != u)
			at(w) = u;
	}
	int ask(int u) { return at(u) != u ? at(u) = ask(at(u)) : u; }
};
int main()
{
	int t, n, m;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &m);
		vector<vector<int>> g(n);
		UnionfindSet ufs(n);
		for (int i = 0, x, y; i < m; ++i)
		{
			scanf("%d%d", &x, &y);
			g[x - 1].push_back(y - 1);
			g[y - 1].push_back(x - 1);
			x = ufs.ask(x - 1);
			y = ufs.ask(y - 1);
			if (x > y)
				swap(x, y);
			ufs.merge(x, y);
		}
		priority_queue<int> q;
		vector<int> vis(n), ans;
		for (int i = 0; i < n; ++i)
			if (ufs.ask(i) == i)
				vis[i] = 1, q.push(-i);
		printf("%d\n", q.size());
		while (!q.empty())
		{
			ans.push_back(-q.top());
			q.pop();
			for (int to : g[ans.back()])
				if (!vis[to])
					vis[to] = 1, q.push(-to);
		}
		for (int i = 0; i < ans.size(); ++i)
			printf("%d%c", ans[i] + 1, i < ans.size() - 1 ? ' ' : '\n');
	}
}
```

## [Strings in the Pocket](https://vjudge.net/problem/ZOJ-4110)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e6 + 9;
typedef long long ll;
int t;
char s[N], s2[N];
int a[N], b[N];
char str[N * 2];
int p[N * 2], len1, len2;
void init()
{
	len1 = strlen(s);
	str[0] = '(';
	str[1] = '#';
	for (int i = 0; i < len1; i++)
	{
		str[i * 2 + 2] = s[i];
		str[i * 2 + 3] = '#';
	}
	len2 = len1 * 2 + 2;
	str[len2] = ')';
}
ll manacher()
{
	int id = 0, mx = 0;
	ll ans = 0;
	for (int i = 1; i < len2; i++)
	{
		if (mx > i)
			p[i] = min(mx - i, p[2 * id - i]);
		else
			p[i] = 1;
		for (; str[i + p[i]] == str[i - p[i]]; p[i]++)
			;
		if (p[i] + i > mx)
		{
			mx = p[i] + i;
			id = i;
		}
		ans += p[i] / 2;
	}
	return ans;
}
int main()
{
	scanf("%d", &t);
	for (int i = 1; i <= t; i++)
	{
		scanf("%s", s);
		scanf("%s", s2);
		int n = strlen(s);
		for (int i = 1; i <= n; i++)
		{
			a[i] = s[i - 1] - '0';
			b[i] = s2[i - 1] - '0';
		}
		int L = 1;
		int R = n;
		while (a[L] == b[L] && L <= n)
			L++;
		while (a[R] == b[R] && R >= 1)
			R--;
		if (L == n + 1)
		{
			init();
			printf("%lld\n", manacher());
		}
		else
		{
			int len = R - L + 1;
			int ok = 1;

			for (int i = L; i <= R; i++)
			{
				if (a[i] != b[R + L - i] || b[i] != a[R + L - i])
				{
					ok = 0;
					break;
				}
			}

			if (!ok)
				printf("0\n");
			else
			{
				int cnt = 1;
				for (int i = 1; i <= min(L - 1, n - R); i++)
				{
					if (a[L - i] == b[R + i] && b[L - i] == a[R + i])
					{
						cnt++;
					}
					else
						break;
				}
				printf("%d\n", cnt);
			}
		}
	}
}
```

## [Square on the Plane](https://vjudge.net/problem/ZOJ-4111)

[分享 q 神的题解](https://blog.csdn.net/quailty/article/details/89684145)

```cpp
//不可做
```

## [Trees in the Pocket](https://vjudge.net/problem/ZOJ-4112)

```cpp
//不可做
```
