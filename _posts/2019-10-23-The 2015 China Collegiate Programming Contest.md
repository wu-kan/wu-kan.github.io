---
title: The 2015 China Collegiate Programming Contest
categories:
- ACM
- 题解
---
## [Secrete Master Plan](https://vjudge.net/problem/HDU-5540)

暴力。

```cpp
#include <bits/stdc++.h>
using namespace std;
int a, b, c, d, e, f, g, h, n, t;
int main(void)
{
	scanf("%d", &t);
	for (int ii = 1; ii <= t; ii++)
	{
		scanf("%d%d%d%d%d%d%d%d", &a, &b, &c, &d, &e, &f, &g, &h);
		if (a == e && b == f && c == g && d == h)
			printf("Case #%d: POSSIBLE\n", ii);
		else if (a == f && b == h && c == e && d == g)
			printf("Case #%d: POSSIBLE\n", ii);
		else if (a == g && b == e && c == h && d == f)
			printf("Case #%d: POSSIBLE\n", ii);
		else if (a == h && b == g && c == f && d == e)
			printf("Case #%d: POSSIBLE\n", ii);
		else
			printf("Case #%d: IMPOSSIBLE\n", ii);
	}
}
```

## [The Battle of Chibi](https://vjudge.net/problem/HDU-5542)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
struct Mod
{
	const ll M;
	Mod(ll M) : M(M) {}
	ll qadd(ll &a, ll b) const { return a += b, a >= M ? a -= M : a; }
} M(1e9 + 7);
struct Ranker : vector<ll>
{
	void init() { sort(begin(), end()), resize(unique(begin(), end()) - begin()); }
	int ask(ll x) const { return lower_bound(begin(), end(), x) - begin(); }
};
struct BaseFenwick
{
	vector<ll> v;
	BaseFenwick(int n) : v(n, 0) {}
	void add(int x, ll w)
	{
		for (; x < v.size(); x += x & -x)
			M.qadd(v[x], w);
	}
	ll ask(int x)
	{
		ll ans = 0;
		for (; x; x -= x & -x)
			M.qadd(ans, v[x]);
		return ans;
	}
};
const int N = 1023;
int t, n, m, kase, a[N];
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &m);
		Ranker rk;
		for (int i = 1; i <= n; ++i)
			scanf("%d", &a[i]), rk.push_back(a[i]);
		rk.init();
		for (int i = a[0] = 1; i <= n; ++i)
			a[i] = rk.ask(a[i]) + 2;
		vector<vector<ll>> f(m + 9, vector<ll>(n + 9));
		for (int i = f[0][0] = 1; i <= m; ++i)
		{
			BaseFenwick t(rk.size() + 9);
			t.add(a[0], f[i - 1][0]);
			for (int j = 1; j <= n; ++j)
			{
				f[i][j] = t.ask(a[j] - 1);
				t.add(a[j], f[i - 1][j]);
			}
		}
		ll ans = 0;
		for (int j = 1; j <= n; ++j)
			M.qadd(ans, f[m][j]);
		printf("Case #%d: %d\n", ++kase, ans);
	}
}
```

## [Pick The Sticks](https://vjudge.net/problem/HDU-5543)

```cpp
#include <bits/stdc++.h>
#define ll long long
#define maxn 2047
using namespace std;
int t, n, l;
ll dp[maxn][maxn];
pair<int, int> pr[maxn];
int main()
{
	scanf("%d", &t);
	for (int ii = 1; ii <= t; ii++)
	{
		scanf("%d%d", &n, &l);
		for (int i = 1; i <= n; i++)
			scanf("%d%d", &pr[i].first, &pr[i].second);
		sort(pr + 1, pr + n + 1);
		for (int i = 1; i <= n; i++)
		{
			for (int j = l; j > 0; j--)
			{
				dp[i][j] = dp[i - 1][j];
				if (j >= pr[i].first)
				{
					dp[i][j] = max(dp[i][j], dp[i - 1][j - pr[i].first] + pr[i].second);
				}
			}
		}
		ll ans = 0;
		for (int i = 1; i <= n; i++)
			ans = max(ans, (ll)pr[i].second);
		for (int i = n; i > 1; i--)
		{
			for (int j = i - 1; j; j--)
			{
				ll temv;
				if ((temv = (pr[i].first + pr[j].first) / 2 + (pr[i].first + pr[j].first) % 2) <= l)
				{
					ans = max(ans, dp[j - 1][l - temv] + pr[i].second + pr[j].second);
				}
			}
		}
		printf("Case #%d: %lld\n", ii, ans);
	}
}
```

## [Ancient Go](https://vjudge.net/problem/HDU-5546)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 9;
char s[N + 9][N + 9], vis[N + 9][N + 9];
int t, kase;
bool dfs(int x, int y)
{
	if (x < 0 || x >= N || y < 0 || y >= N)
		return 0;
	if (s[x][y] == '.')
		return 1;
	if (vis[x][y] || s[x][y] != 'o')
		return 0;
	vis[x][y] = 1;
	return dfs(x, y - 1) || dfs(x, y + 1) || dfs(x - 1, y) || dfs(x + 1, y);
}
int main()
{
	for (scanf("%d", &t); t--;)
	{
		for (int i = 0; i < N; ++i)
			scanf("%s", s[i]);
		int ans = 0;
		for (int i = 0; i < N && !ans; ++i)
			for (int j = 0; j < N && !ans; ++j)
				if (s[i][j] == '.')
				{
					s[i][j] = 'x';
					memset(vis, 0, sizeof(vis));
					if (!ans && j && s[i][j - 1] == 'o' && !dfs(i, j - 1))
						ans = 1;
					memset(vis, 0, sizeof(vis));
					if (!ans && j + 1 < N && s[i][j + 1] == 'o' && !dfs(i, j + 1))
						ans = 1;
					memset(vis, 0, sizeof(vis));
					if (!ans && i + 1 < N && s[i + 1][j] == 'o' && !dfs(i + 1, j))
						ans = 1;
					memset(vis, 0, sizeof(vis));
					if (!ans && i && s[i - 1][j] == 'o' && !dfs(i - 1, j))
						ans = 1;
					s[i][j] = '.';
				}
		printf("Case #%d: Can%s kill in one move!!!\n", ++kase, ans ? "" : " not");
	}
}
```

## [Sudoku](https://vjudge.net/problem/HDU-5547)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4;
vector<int> notEqual[N * N];
char s[N * N + 9];
int t, kase;
bool dfs(int k)
{
	if (k == N * N)
		return 1;
	if (s[k] != '*')
		return dfs(k + 1);
	for (s[k] = '1'; s[k] <= '4'; ++s[k])
	{
		int flag = 1;
		for (auto i : notEqual[k])
			if (s[i] == s[k])
			{
				flag = 0;
				break;
			}
		if (flag && dfs(k + 1))
			return 1;
	}
	s[k] = '*';
	return 0;
}
int main()
{
	for (int i = 0; i < N; ++i)
		for (int j = 0; j < N; ++j)
			for (int x = 0; x < N; ++x)
				for (int y = 0; y < N; ++y)
					if (i != x || j != y)
						if (i == x || j == y || (x / 2 == i / 2 && y / 2 == j / 2))
							notEqual[i * N + j].push_back(x * N + y);
	for (scanf("%d", &t); t--;)
	{
		for (int i = 0; i < N; ++i)
			scanf("%s", s + 4 * i);
		dfs(0);
		printf("Case #%d:\n", ++kase);
		for (int i = 0; i < N; ++i, printf("\n"))
			for (int j = 0; j < N; ++j)
				printf("%c", s[i * N + j]);
	}
}
```

## [Huatuo's Medicine](https://vjudge.net/problem/HDU-5551)

```cpp
#include <bits/stdc++.h>
using namespace std;
int t, n, kase;
int main()
{
	for (scanf("%d", &t); t--;)
		scanf("%d", &n), printf("Case #%d: %d\n", ++kase, 2 * n - 1);
}
```
