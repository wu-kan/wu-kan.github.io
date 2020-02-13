---
title: "Codeforces Round #572 (Div. 2)"
tags:
  - ACM
  - 题解
---

[官方题解](https://codeforces.com/blog/entry/68079)

## [Keanu Reeves](https://vjudge.net/problem/CodeForces-1189A)

```cpp
#include <bits/stdc++.h>
using namespace std;
int n, cnt[2];
string s;
int main()
{
	cin >> n >> s;
	for (auto c : s)
		++cnt[c - '0'];
	if (cnt[0] == cnt[1])
		cout << 2 << "\n", s.insert(1, "\n");
	else
		cout << 1 << "\n";
	cout << s;
}
```

## [Number Circle](https://vjudge.net/problem/CodeForces-1189B)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, a[N];
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; ++i)
		scanf("%d", &a[i]);
	sort(a, a + n);
	if (a[n - 1] >= a[n - 2] + a[n - 3])
		return printf("NO"), 0;
	printf("YES\n");
	swap(a[n - 1], a[n - 2]);
	for (int i = 0; i < n; ++i)
		printf("%d ", a[i]);
}
```

## [Candies!](https://vjudge.net/problem/CodeForces-1189C)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, s[N];
int main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i)
		scanf("%d", &s[i]), s[i] += s[i - 1];
	scanf("%d", &n);
	for (int i = 0, l, r; i < n; ++i)
	{
		scanf("%d%d", &l, &r);
		printf("%d\n", (s[r] - s[l - 1]) / 10);
	}
}
```

## [Add on a Tree](https://vjudge.net/problem/CodeForces-1189D1)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
vector<int> g[N];
int n;
int main()
{
	scanf("%d", &n);
	for (int i = 1, u, v; i < n; ++i)
	{
		scanf("%d%d", &u, &v);
		g[u].push_back(v);
		g[v].push_back(u);
	}
	for (int i = 1; i <= n; ++i)
		if (g[i].size() == 2)
			return printf("NO"), 0;
	printf("YES");
}
```

## [Add on a Tree: Revolution](https://vjudge.net/problem/CodeForces-1189D2)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1023;
struct Edge
{
	int u, v, len;
};
vector<Edge> e, ans;
vector<int> g[N];
int n;
void dfs(int u, int fa, vector<int> &v)
{
	if (g[u].size() == 1)
		v.push_back(u);
	for (int to : g[u])
		if (to != fa)
			dfs(to, u, v);
}
int main()
{
	scanf("%d", &n);
	for (int i = 1, u, v, len; i < n; ++i)
	{
		scanf("%d%d%d", &u, &v, &len);
		e.push_back({u, v, len});
		g[u].push_back(v);
		g[v].push_back(u);
	}
	for (int i = 1; i <= n; ++i)
		if (g[i].size() == 2)
			return printf("NO"), 0;
	for (auto &ed : e)
	{
		vector<int> v[2];
		dfs(ed.u, ed.v, v[0]);
		dfs(ed.v, ed.u, v[1]);
		ans.push_back({v[0].front(), v[1].back(), ed.len / 2});
		ans.push_back({v[0].back(), v[1].front(), ed.len / 2});
		if (v[0].front() != v[0].back())
			ans.push_back({v[0].front(), v[0].back(), -ed.len / 2});
		if (v[1].front() != v[1].back())
			ans.push_back({v[1].front(), v[1].back(), -ed.len / 2});
	}
	printf("YES\n%d\n", ans.size());
	for (auto &ed : ans)
		printf("%d %d %d\n", ed.u, ed.v, ed.len);
}
```

## [Count Pairs](https://vjudge.net/problem/CodeForces-1189E)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
unordered_map<ll, ll> mp;
ll n, p, k, a;
int main()
{
	scanf("%lld%lld%lld", &n, &p, &k);
	for (ll i = 0, t; i < n; ++i)
	{
		scanf("%lld", &t);
		a += mp[(t * t % p * t % p * t % p - k * t % p + p) % p]++;
	}
	printf("%lld", a);
}
```

## [Array Beauty](https://vjudge.net/problem/CodeForces-1189F)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1023, M = 998244353;
int n, k, ans, a[N], f[N][N];
int main()
{
	scanf("%d%d", &n, &k);
	for (int i = 1; i <= n; ++i)
		scanf("%d", &a[i]);
	sort(a + 1, a + n + 1);
	for (int i = 1e5 / (k - 1); i; --i)
	{
		for (int j = 1, l = 1; j <= n; ++j)
		{
			while (l < j && a[j] - a[l] >= i)
				++l;
			f[j][2] = (f[j - 1][2] + l - 1) % M;
			for (int m = 3; m <= k; ++m)
				f[j][m] = (f[l - 1][m - 1] + f[j - 1][m]) % M;
		}
		ans = (ans + f[n][k]) % M;
	}
	printf("%d", ans);
}
```
