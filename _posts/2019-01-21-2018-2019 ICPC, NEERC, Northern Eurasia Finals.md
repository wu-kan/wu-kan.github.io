---
title: 2018-2019 ICPC, NEERC, Northern Eurasia Finals
tags:
  - ACM
  - 题解
---

## [Alice the Fan](https://vjudge.net/problem/CodeForces-1089A)

记忆化搜索，记忆转移方向。

```cpp
#include <bits/stdc++.h>
#define dbg(x) cout << (#x) << "=" << x << endl

using namespace std;
const int N = 207;

int m, a, b;

struct Node
{
	Node()
	{
		this->x = -2;
	}
	Node(int x, int y, int a, int b)
	{
		this->x = x;
		this->y = y;
		this->a = a;
		this->b = b;
	}
	int x, y, a, b;
};

int dp[6][6][N][N];
Node last[6][6][N][N];

int solve(int x, int y, int a, int b)
{
	if (x < 0 || y < 0 || a < 0 || b < 0)
		return 0;
	if (dp[x][y][a][b] != -1)
		return dp[x][y][a][b];
	if (!x && !y)
	{
		if (!a && !b)
			return 1;
		else
			return 0;
	}
	int up;
	if (x + y == 5)
		up = 15;
	else
		up = 25;
	//transfer1 up:j firstwin
	for (int j = 0; j <= up - 2; j++)
	{
		if (y == 3)
			continue;
		if (solve(x - 1, y, a - up, b - j))
		{
			last[x][y][a][b] = Node(x - 1, y, a - up, b - j);
			return dp[x][y][a][b] = 1;
		}
	}
	for (int i = up + 1; i <= 200; i++)
	{
		if (y == 3)
			continue;
		if (solve(x - 1, y, a - i, b - (i - 2)))
		{
			last[x][y][a][b] = Node(x - 1, y, a - i, b - (i - 2));
			return dp[x][y][a][b] = 1;
		}
	}
	//transfer2 j:up secondwin
	for (int j = 0; j <= up - 2; j++)
	{
		if (x == 3)
			continue;
		if (solve(x, y - 1, a - j, b - up))
		{
			last[x][y][a][b] = Node(x, y - 1, a - j, b - up);
			return dp[x][y][a][b] = 1;
		}
	}
	for (int i = up + 1; i <= 200; i++)
	{
		if (x == 3)
			continue;
		if (solve(x, y - 1, a - (i - 2), b - i))
		{
			last[x][y][a][b] = Node(x, y - 1, a - (i - 2), b - i);
			return dp[x][y][a][b] = 1;
		}
	}

	return dp[x][y][a][b] = 0;
}

void print(int x, int y, int a, int b)
{
	Node t = last[x][y][a][b];
	//	dbg(t.x);
	//	dbg(t.y);
	//	dbg(t.a);
	//	dbg(t.b);
	if (t.x == -2)
		return;
	print(t.x, t.y, t.a, t.b);
	cout << a - t.a << ':' << b - t.b;
	if (max(x, y) == 3)
		cout << endl;
	else
		cout << ' ';
}

int main()
{
	//	freopen("A.in", "r", stdin);
	scanf("%d", &m);
	memset(dp, -1, sizeof(dp));

	for (int i = 1; i <= m; i++)
	{
		scanf("%d %d", &a, &b);
		if (solve(3, 0, a, b))
		{
			cout << "3" << ':' << "0" << endl;
			print(3, 0, a, b);
		}
		else if (solve(3, 1, a, b))
		{
			cout << "3" << ':' << "1" << endl;
			print(3, 1, a, b);
		}
		else if (solve(3, 2, a, b))
		{
			cout << "3"
				 << ":"
				 << "2" << endl;
			print(3, 2, a, b);
		}
		else if (solve(2, 3, a, b))
		{
			cout << "2"
				 << ":"
				 << "3" << endl;
			print(2, 3, a, b);
		}
		else if (solve(1, 3, a, b))
		{
			cout << "1" << ':' << "3" << endl;
			print(1, 3, a, b);
		}
		else if (solve(0, 3, a, b))
		{
			cout << "0" << ':' << "3" << endl;
			print(0, 3, a, b);
		}
		else
			printf("Impossible\n");
	}
	return 0;
}
```

## [Bimatching](https://codeforces.com/problemset/problem/1089/B)

题意：每个骑士和两个女士配对，求能够形成的最大组数。

做的人很少的一题，但实际上是一道模板题。思路是把每个骑士拆成两个点，这样原来的“三元匹配”就变成传统的二元匹配了。但是这会带来新的问题，原来不能匹配的骑士此时也可以匹配了。解决办法是在拆的两点间连一条边，这样原来能够三元匹配的骑士匹配数一定是 2，原来没有三元匹配的骑士匹配数一定是 1。最后的结果是最大匹配数减去加入的边数 n。插入边后不再是二分图了，变成一般图最大匹配，拉一个带花树的板子跑掉。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int NPOS = -1;
struct UnionfindSet : vector<int>
{
	UnionfindSet(int n) : vector<int>(n)
	{
		for (int i = 0; i < n; ++i)
			at(i) = i;
	}
	int ask(int u)
	{
		return at(u) != u ? at(u) = ask(at(u)) : u;
	}
	void merge(int u, int w)
	{
		if (w = ask(w), u = ask(u), w != u)
			at(w) = u;
	}
};
struct Graph
{
	struct Vertex
	{
		vector<int> o;
	};
	typedef pair<int, int> Edge;
	vector<Vertex> v;
	vector<Edge> e;
	Graph(int n) : v(n) {}
	void add(const Edge &ed)
	{
		v[ed.first].o.push_back(e.size());
		e.push_back(ed);
	}
};
struct Blossom : Graph
{
	vector<int> f;
	Blossom(int n) : Graph(n) {}
	void ask()
	{
		vector<int> vis(v.size(), NPOS);
		f = vis;
		for (int s = 0, t = 0; s < v.size(); ++s)
			if (f[s] == NPOS)
			{
				vector<int> pre(v.size(), NPOS), flag(pre);
				deque<int> q(flag[s] = 1, s);
				for (UnionfindSet ufs(v.size()); f[s] == NPOS && !q.empty(); q.pop_front())
					for (int i = 0, x = q.front(), y, a, b; i < v[x].o.size(); ++i)
						if (y = e[v[x].o[i]].second, y != f[x] && flag[y] && ufs.ask(x) != ufs.ask(y))
						{
							if (flag[y] == 1)
							{
								for (a = x, b = y, ++t;; swap(a, b))
									if (a != NPOS)
									{
										if (vis[a = ufs.ask(a)] == t)
											break;
										vis[a] = t, a = f[a] != NPOS ? pre[f[a]] : NPOS;
									}
								if (ufs.ask(x) != a)
									pre[x] = y;
								if (ufs.ask(y) != a)
									pre[y] = x;
								for (int p[2] = {x, y}, j = 0; j < 2; ++j)
									for (int x = p[j], y, z; x != a; ufs.merge(y, x), ufs.merge(x = z, y))
									{
										if (ufs.ask(z = pre[y = f[x]]) != a)
											pre[z] = y;
										if (!flag[y])
											flag[y] = 1, q.push_back(y);
										if (!flag[z])
											flag[z] = 1, q.push_back(z);
									}
							}
							else if (f[y] == NPOS)
							{
								for (pre[y] = x; y != NPOS;)
									swap(y, f[f[y] = pre[y]]);
								break;
							}
							else
								pre[y] = x, q.push_back(f[y]), flag[f[y]] = 1, flag[y] = 0;
						}
			}
	}
};
char s[255];
int t, n, m, c;
int main()
{
	for (scanf("%d", &t); t--; printf("%d\n", c / 2 - n))
	{
		scanf("%d%d", &n, &m);
		Blossom g(m + n * 2);
		for (int i = 0; i < n; ++i)
		{
			scanf("%s", s);
			for (int j = 0; j < m; ++j)
				if (s[j] == '1')
				{
					g.add({j, m + i * 2});
					g.add({m + i * 2, j});
					g.add({j, m + i * 2 + 1});
					g.add({m + i * 2 + 1, j});
				}
			g.add({m + i * 2, m + i * 2 + 1});
			g.add({m + i * 2 + 1, m + i * 2});
		}
		g.ask();
		for (int i = c = 0; i < g.f.size(); ++i)
			if (g.f[i] != NPOS)
				++c;
	}
}
```

## [Easy Chess](https://codeforces.com/problemset/problem/1089/E)

小范围数据打表，否则指定几个关键节点。体验极差。

```cpp
#include <bits/stdc++.h>
using namespace std;
vector<string> ans{
	"",
	"",
	"a1 h1 h8",
	"a1 h1 h2 h8",
	"a1 h1 h2 h3 h8",
	"a1 h1 h2 h3 h4 h8",
	"a1 h1 h2 h3 h4 h5 h8",
	"a1 h1 h2 h3 h4 h5 h6 h8",
	"a1 h1 h2 h3 h4 h5 h6 h7 h8",
	"a1 b1 h1 h2 h3 h4 h5 h6 h7 h8",
	"a1 b1 c1 h1 h2 h3 h4 h5 h6 h7 h8",
	"a1 b1 c1 d1 h1 h2 h3 h4 h5 h6 h7 h8",
	"a1 b1 c1 d1 e1 h1 h2 h3 h4 h5 h6 h7 h8",
	"a1 b1 c1 d1 e1 f1 h1 h2 h3 h4 h5 h6 h7 h8",
	"a1 b1 c1 d1 e1 f1 g1 h1 h2 h3 h4 h5 h6 h7 h8",
	"a1 a2 b2 b1 c1 d1 e1 f1 g1 h1 h2 h3 h4 h5 h6 h8",
	"a1 a2 b2 b1 c1 d1 e1 f1 g1 h1 h2 h3 h4 h5 h6 h7 h8"},
	turn{
		"a1",
		"h1",
		"h2",
		"a2",
		"a3",
		"h3",
		"h4",
		"a4",
		"a5",
		"h5",
		"h6",
		"a6",
		"a8",
		"g8",
		"g7",
		"a7",
		"h7",
		"h8"},
	jump{
		"a8",
		"h7"};
int n;
int main()
{
	cin >> n;
	if (n < ans.size())
		return cout << ans[n], 0;
	int need = n - 17, to = 1;
	for (string now("a1");;)
	{
		cout << now << ' ';
		if (now == turn[to])
			++to;
		if (to > turn.size())
			return 0;
		if (need == 0 || turn[to] == jump[0] || turn[to] == jump[1])
		{
			now = turn[to];
			continue;
		}
		if (now[0] < turn[to][0])
			++now[0];
		else if (now[0] > turn[to][0])
			--now[0];
		else if (now[1] < turn[to][1])
			++now[1];
		else
			--now[1];
		if (now != turn[to])
			--need;
	}
}
```

## [Fractions](https://vjudge.net/problem/CodeForces-1089F)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll n, m;
vector<ll> v;
void gcd(ll a, ll b, ll &x, ll &y)
{
	if (!b)
	{
		x = (m - 1) / a, y = 0;
		return;
	}
	gcd(b, a % b, x, y);
	ll t = x;
	x = y, y = t - a / b * y;
}
int main()
{
	scanf("%lld", &n);
	m = n;
	for (ll i = 2; i * i <= m; ++i)
		if (n % i == 0)
		{
			v.push_back(i);
			while (n % i == 0)
				n /= i;
		}
	if (n > 1)
		v.push_back(n);
	if (v.size() < 2)
		return printf("NO"), 0;
	printf("YES\n2\n");
	ll a = v[0], b = v[v.size() - 1], x, y;
	gcd(a, b, x, y);
	a = m / a, b = m / b;
	while (x <= 0)
		x += a, y -= b;
	while (x >= a)
		x -= a, y += b;
	while (y >= b)
		x += a, y -= b;
	while (y <= 0)
		x -= a, y += b;
	printf("%lld %lld\n%lld %lld", x, a, y, b);
}
```

## [Guest Student](https://vjudge.net/problem/CodeForces-1089G)

```cpp
#include <bits/stdc++.h>
using namespace std;
int t, k, a[7];
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &k);
		int sum = 0, x = 0, y = 1e9;
		for (int i = 0; i < 7; ++i)
			scanf("%d", &a[i]), sum += a[i];
		if (k > 2 * sum)
		{
			k -= sum;
			x = k / sum * 7;
			k %= sum;
			k += sum;
		}
		for (int i = 0, j; i < 7; ++i)
		{
			for (int s = j = 0; s < k; ++j)
				s += a[(i + j) % 7];
			y = min(y, j);
		}
		printf("%d\n", x + y);
	}
}
```

## [King Kog's Reception](https://vjudge.net/problem/CodeForces-1089K)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e6 + 7;
struct SegmentTree
{
	struct Node
	{
		ll val, sum;
		void up(const Node &lc, const Node &rc)
		{
			sum = lc.sum + rc.sum;
			val = max(lc.val + rc.sum, rc.val);
		}
	} v[N * 4];
	void set(int p, ll val, int l = 1, int r = N, int rt = 1)
	{
		if (l >= r)
		{
			v[rt].sum = val, v[rt].val = val ? l + val : 0;
			return;
		}
		int m = l + r >> 1;
		if (p > m)
			set(p, val, m + 1, r, rt << 1 | 1);
		else
			set(p, val, l, m, rt << 1);
		v[rt].up(v[rt << 1], v[rt << 1 | 1]);
	}
	Node ask(int p, int q, int l = 1, int r = N, int rt = 1)
	{
		if (p <= l && r <= q)
			return v[rt];
		int m = l + r >> 1;
		if (m >= q)
			return ask(p, q, l, m, rt << 1);
		if (m < p)
			return ask(p, q, m + 1, r, rt << 1 | 1);
		return v[0].up(ask(p, q, l, m, rt << 1), ask(p, q, m + 1, r, rt << 1 | 1)), v[0];
	}
} t;
char s[9];
int n, a[N];
int main()
{
	scanf("%d", &n);
	for (int i = 1, y; i <= n; ++i)
	{
		scanf("%s%d", s, &a[i]);
		if (s[0] == '+')
		{
			scanf("%d", &y);
			t.set(a[i], y);
		}
		else if (s[0] == '-')
			t.set(a[a[i]], 0);
		else
			printf("%lld\n", max(t.ask(1, a[i]).val - a[i], 0LL));
	}
}
```

## [Lazyland](https://vjudge.net/problem/CodeForces-1089L)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
typedef long long ll;
vector<int> ans, v[N];
int n, k, cnt, a[N], b[N];
int main()
{
    scanf("%d%d", &n, &k);
    for (int i = 1; i <= n; ++i)
        scanf("%d", &a[i]);
    for (int i = 1; i <= n; ++i)
        scanf("%d", &b[i]);
    for (int i = 1; i <= n; ++i)
        v[a[i]].push_back(b[i]);
    for (int i = 1; i <= k; ++i)
    {
        if (v[i].empty())
        {
            ++cnt;
            continue;
        }
        sort(v[i].begin(), v[i].end());
        for (int j = 0; j < v[i].size() - 1; ++j)
            ans.push_back(v[i][j]);
    }
    sort(ans.begin(), ans.end());
    ll tmp = 0;
    for (int i = 0; i < cnt; ++i)
        tmp += ans[i];
    printf("%lld", tmp);
}
```
