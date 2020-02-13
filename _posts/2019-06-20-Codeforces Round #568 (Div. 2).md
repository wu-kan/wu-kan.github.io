---
title: "Codeforces Round #568 (Div. 2)"
tags:
  - ACM
  - 题解
---
[官方题解](https://codeforces.com/blog/entry/67829)

## [Ropewalkers](https://vjudge.net/problem/CodeForces-1185A)

```cpp
#include <bits/stdc++.h>
using namespace std;
int a[3], d, ans;
int main()
{
	scanf("%d%d%d%d", &a[0], &a[1], &a[2], &d);
	sort(a, a + 3);
	if (a[1] - a[0] < d)
		ans += d - a[1] + a[0];
	if (a[2] - a[1] < d)
		ans += d - a[2] + a[1];
	printf("%d", ans);
}
```

## [Email from Polycarp](https://vjudge.net/problem/CodeForces-1185B)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e6 + 9;
char s[2][N];
int n;
int main()
{
	for (scanf("%d", &n); n--;)
	{
		scanf("%s%s", s[0], s[1]);
		vector<pair<char, int>> v[2];
		for (int j = 0; j < 2; ++j)
			for (int i = 0, pre = 0; s[j][i]; ++i)
			{
				if (pre != s[j][i])
					v[j].emplace_back(pre = s[j][i], 1);
				else
					++v[j].back().second;
			}
		int ans = 1;
		if (v[0].size() != v[1].size())
			ans = 0;
		else
			for (int i = 0; ans && i < v[0].size(); ++i)
			{
				if (v[0][i].first != v[1][i].first)
					ans = 0;
				if (v[0][i].second > v[1][i].second)
					ans = 0;
			}
		printf(ans ? "YES\n" : "NO\n");
	}
}
```

## [Exam in BerSU (easy version)](https://vjudge.net/problem/CodeForces-1185C1)

## [Exam in BerSU (hard version)](https://vjudge.net/problem/CodeForces-1185C2)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll M = 101;
ll n, m, c, cnt[M];
int main()
{
	scanf("%lld%lld", &n, &m);
	for (ll i = 0, t; i < n; ++i)
	{
		scanf("%lld", &t);
		for (ll j = c = 0, sum = 0; j < M; ++j)
		{
			if (sum + j * cnt[j] + t > m)
			{
				c += (m - t - sum) / j;
				break;
			}
			sum += j * cnt[j], c += cnt[j];
		}
		++cnt[t];
		printf("%lld ", i - c);
	}
}
```

## [Extra Element](https://vjudge.net/problem/CodeForces-1185D)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 2e5 + 9;
pair<ll, ll> p[N];
ll n;
int main()
{
	scanf("%lld", &n);
	for (ll i = 0; i < n; ++i)
		scanf("%lld", &p[i].first), p[i].second = i + 1;
	sort(p, p + n);
	unordered_set<ll> se;
	for (ll i = 1; i < n; ++i)
		se.insert(p[i].first - p[i - 1].first);
	if (se.size() > 9)
		return printf("-1"), 0;
	for (auto k : se)
	{
		ll b = p[0].first, pos = 0;
		for (ll i = 0; i < n; ++i)
		{
			if (!pos)
			{
				if (k * i + b != p[i].first)
					pos = i;
			}
			else
			{
				if (k * (i - 1) + b != p[i].first)
				{
					pos = -1;
					break;
				}
			}
		}
		if (pos >= 0)
			return printf("%lld", p[pos].second), 0;
		b = p[1].first - k, pos = 0;
		for (ll i = 1; i < n; ++i)
		{
			if (k * i + b != p[i].first)
			{
				pos = -1;
				break;
			}
		}
		if (pos >= 0)
			return printf("%lld", p[pos].second), 0;
	}
	printf("-1");
}
```

## [Polycarp and snakes](https://vjudge.net/problem/CodeForces-1185E)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 2047;
char s[N][N];
int t, n, m;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &m);
		vector<int> top(127, n), bot(127, -1), lft(127, m), rht(127, -1);
		for (int i = 0; i < n; ++i)
		{
			scanf("%s", s[i]);
			for (int j = 0; s[i][j]; ++j)
			{
				top[s[i][j]] = min(top[s[i][j]], i);
				bot[s[i][j]] = max(bot[s[i][j]], i);
				lft[s[i][j]] = min(lft[s[i][j]], j);
				rht[s[i][j]] = max(rht[s[i][j]], j);
			}
		}
		int ans = 0;
		for (char c = 'a'; ans >= 0 && c <= 'z'; ++c)
			if (top[c] < n)
			{
				if (top[c] != bot[c] && lft[c] != rht[c])
				{
					ans = -1;
					break;
				}
				ans = c - 'a' + 1;
				for (int i = top[c]; ans > 0 && i <= bot[c]; ++i)
					for (int j = lft[c]; ans > 0 && j <= rht[c]; ++j)
						if (s[i][j] == '.' || s[i][j] < c)
							ans = -1;
			}
		if (ans < 0)
		{
			printf("NO\n");
			continue;
		}
		printf("YES\n%d\n", ans);
		for (char c = 'a'; c < 'a' + ans; ++c)
		{
			if (top[c] == n)
			{
				top[c] = top['a' + ans - 1];
				bot[c] = bot['a' + ans - 1];
				lft[c] = lft['a' + ans - 1];
				rht[c] = rht['a' + ans - 1];
			}
			printf("%d %d %d %d\n", top[c] + 1, lft[c] + 1, bot[c] + 1, rht[c] + 1);
		}
	}
}
```

## [Two Pizzas](https://vjudge.net/problem/CodeForces-1185F)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1 << 9;
vector<tuple<int, int>> v(N, {1e9 + 7, 0});
tuple<int, int, int, int> ans{1, 0, 0, 0};
int n, m, a[N], b[N];
int main()
{
	scanf("%d%d", &n, &m);
	for (int t, j, s; n--; ++a[s])
		for (scanf("%d", &t), s = 0; t--; s |= 1 << j - 1)
			scanf("%d", &j);
	for (int i = 0; i < N; ++i)
		for (int j = i; j; j = i & j - 1)
			b[i] += a[j];
	for (int i = 1, c, t, j, s; i <= m; ++i)
	{
		for (scanf("%d%d", &c, &t), s = 0; t--; s |= 1 << j - 1)
			scanf("%d", &j);
		for (int k = 0; k < N; ++k)
			if (get<1>(v[k]))
				ans = min(ans, {-b[s | k], c + get<0>(v[k]), get<1>(v[k]), i});
		v[s] = min(v[s], {c, i});
	}
	printf("%d %d", get<2>(ans), get<3>(ans));
}
```

## [Playlist for Polycarp (easy version)](https://vjudge.net/problem/CodeForces-1185G1)

## [Playlist for Polycarp (hard version)](https://vjudge.net/problem/CodeForces-1185G2)

好题。相遇双重DP。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Mod
{
	const ll M;
	Mod(ll M) : M(M) {}
	ll &qadd(ll &a, ll b) const { return a += b, a < M ? a : (a -= M); }
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }
	ll mul(ll a, ll b) const { return add(a * b, M); }
} M(1e9 + 7);
const ll N = 63;
ll n, t, f[N][N][N][4], f1[N][N * N], f23[N][N][N * N];
int main()
{
	for (ll i = 0; i < N; ++i)
		for (ll j = 0; j < N; ++j)
			for (ll k = 0; k < N; ++k)
				for (ll g = 0; g < 4; ++g)
				{
					ll &r = f[i][j][k][g];
					if (i + j + k)
					{
						if (g != 1 && i)
							M.qadd(r, M.mul(i, f[i - 1][j][k][1]));
						if (g != 2 && j)
							M.qadd(r, M.mul(j, f[i][j - 1][k][2]));
						if (g != 3 && k)
							M.qadd(r, M.mul(k, f[i][j][k - 1][3]));
					}
					else
						r = 1;
				}
	f1[0][0] = f23[0][0][0] = 1;
	scanf("%lld%lld", &n, &t);
	for (ll i = 0, x, g; i < n; ++i)
	{
		scanf("%lld%lld", &x, &g);
		if (g == 1)
			for (ll s = t; s >= x; --s)
				for (ll i = N - 1; i; --i)
					M.qadd(f1[i][s], f1[i - 1][s - x]);
		else
			for (ll s = t; s >= x; --s)
				for (ll j = N - 1; g == 2 ? j : ~j; --j)
					for (ll k = N - 1; g == 3 ? k : ~k; --k)
						M.qadd(f23[j][k][s], f23[j - (g == 2)][k - (g == 3)][s - x]);
	}
	n = 0;
	for (ll s = t; ~s; --s)
		for (ll i = N - 1; ~i; --i)
			if (f1[i][s])
				for (ll j = N - 1; ~j; --j)
					for (ll k = N - 1; ~k; --k)
						if (f23[j][k][t - s])
							M.qadd(n,
								   M.mul(
									   f[i][j][k][0],
									   M.mul(f1[i][s], f23[j][k][t - s])));
	printf("%lld", n);
}
```
