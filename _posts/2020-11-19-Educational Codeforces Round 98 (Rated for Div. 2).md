---
title: Educational Codeforces Round 98 (Rated for Div. 2)
tags:
  - ACM
---

[官方题解](https://codeforces.com/blog/entry/84847)

晚上闲着没事干，回来做一场，感觉全是要抖机灵的同一类题目，体 验 极 差

## [Robot Program](https://vjudge.net/problem/CodeForces-1452A)

实际意义上的 B 题。水题。

```cpp
#include <bits/stdc++.h>
using namespace std;
int t, x, y;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &x, &y);
		int p = min(x, y), q = max(x, y) - p;
		if (q)
			printf("%d\n", 2 * p + (q * 2 - 1));
		else
			printf("%d\n", 2 * p);
	}
}
```

## [Toy Blocks](https://vjudge.net/problem/CodeForces-1452B)

实际意义上的 C 题 or D 题？

赛场想法，分两类情况考虑：

1. 如果选择的不是最大的那一堆，那就用选择的一堆把其他堆补充到和最多的一堆相同，如有剩余则均分。
2. 如果选择的是最大的那一堆，那就用选择的一堆把其他堆补充到和第二多的一堆相同，如有剩余则均分。

这两类方法可以讨论出得到两个结果，但是赛场不敢确定是否取一个 max 就能过，犹豫再三，最后在结束前十几分钟交上去了，1A。我日。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 2e5 + 9;
int t, n, a[N];
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		ll sum = 0, ans = 0, ans1 = 0;
		for (int i = 0; i < n; ++i)
			scanf("%d", &a[i]), sum += a[i];
		sort(a, a + n);

		if (ll(n - 1) * a[n - 2] >= sum)
			ans1 = ll(n - 1) * a[n - 2] - sum;
		else
			ans1 = ((n - 1) - (sum - (ll(n - 1) * a[n - 2])) % (n - 1)) % (n - 1);

		if (ll(n - 1) * a[n - 1] >= sum)
			ans = ll(n - 1) * a[n - 1] - sum;
		else
			ans = ((n - 1) - (sum - ll(n - 1) * a[n - 1]) % (n - 1)) % (n - 1);
		ans = max(ans, ans1);
		printf("%lld\n", ans);
	}
}
```

## [Two Brackets](https://vjudge.net/problem/CodeForces-1452C)

实际意义上的 A 题。水题。

```cpp

#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
int t;
char s[N];
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%s", s);
		int ans = 0;
		for (int i = 0, cnt0 = 0, cnt1 = 0; s[i]; ++i)
		{
			if (s[i] == '(')
				++cnt0;
			if (s[i] == ')' && cnt0)
				--cnt0, ++ans;
			if (s[i] == '[')
				++cnt1;
			if (s[i] == ']' && cnt1)
				--cnt1, ++ans;
		}
		printf("%d\n", ans);
	}
}
```

## [Radio Towers](https://vjudge.net/problem/CodeForces-1452D)

因为第一塔的信号功率应完全等于覆盖之前的所有城镇所需的信号功率，第二塔的信号功率应完全等于在第一塔未覆盖的所有城镇之前覆盖的所有城镇所需的信号功率，等等。因此，让我们 DP 计算覆盖所有城镇的方法的数量（记为 $F_n$）：

1. 对于 $n\le 2$ 的答案显然；
2. 对于 $n\ge 3,n\mod 2 = 0$，有 $F_n=F_1 + F_3 + \dots + F_{n - 1}$，又有 $F_1 + F_3 = 1 + 2 = F_4, F_4 + F_5 = F_6, \dots$，于是得到 $F_n=F_{n - 2} + F_{n - 1}$
3. 对于 $n\ge 2,n\mod 2 = 1$，有 $F_n = 1 + F_2 + F_4 + F_6 + \dots + F_{n - 1}$，又有 $1 + F_2 = F_3,F_3 + F_4 = F_5,\dots$，剩下的同上。

容易发现 $F_n$ 是斐波那契数列第 $n$ 项，于是答案是 $\frac{F_n}{2^n}$。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
const int N = 2e5 + 9;
struct Mod
{
	const ll M;
	Mod(ll M) : M(M) {}
	ll qadd(ll &a, ll b) const { return a += b, a >= M ? a -= M : a; } //假如a+b<2*M，就不必取模了，取模运算耗时很高
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }	   //考虑a和b不在同余系内甚至为负数的情况
	ll mul(long long a, ll b) const { return add(a * b % M, M); }
	ll inv(ll a) const { return pow(a, M - 2); } //要求M为素数，否则return pow(a, phi(M) - 1);
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		if (b < 0)
			b = -b, a = inv(a);
		for (a = add(a, M); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
} M(998244353);
int n, f[N] = {0, 1};
int main()
{
	for (int i = 2; i < N; ++i)
		M.qadd(f[i] = f[i - 1], f[i - 2]);
	scanf("%d", &n);
	printf("%d", M.mul(f[n], M.pow(2, -n)));
}
```

~~据说现场打表很容易猜到答案…但是孤儿 B 题把我时间都搞完了…~~

## [Two Editorials](https://vjudge.net/problem/CodeForces-1452E)

好题。$m$ 个参赛者，$n$ 道题目，两个讲题人各讲一次题，每次讲题讲编号连续的 $k$ 道题（两个人讲题区间可以相交也可以不交，同时区间的并集不需要是全集）。第 $i$ 个参赛者对题目 $\left[L_i,R_i\right]$ 感兴趣，但是只会去听感兴趣题目最多的一次讲题，听到的感兴趣的题目数是 $a_i$，现在要安排两个讲题人的讲题区间，使 $\sum_{i=1}^ma_i$ 最大化。

考虑一个命题人的讲题区间 $\left[i,i+k-1\right]$ 随着 $i$ 的增加落在 $\left[L_i,R_i\right]$ 的情况，必然是一个对称的先增后减过程，在中点处达到最值。因此将所有区间按照其中点 $\frac{L_i+R_i}{2}$ 排序考虑，容易用反证法证明存在一个分点，最优方案一定是所有中点小于这个分点的区间分给一个命题人，其他的分给另外一个讲题人。

于是枚举 $m+1$ 个分点即可，时间复杂度 $O(n\log n+nm)$。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int n, m, k;
	scanf("%d%d%d", &n, &m, &k);
	vector<pair<int, int>> a(m);
	for (int i = 0; i < m; ++i)
	{
		scanf("%d%d", &a[i].first, &a[i].second);
		a[i].first += a[i].second - 1;
	}
	sort(a.begin(), a.end());
	vector<int> su(m + 1);
	for (int i = 0; i < n - k + 1; ++i)
		for (int j = m - 1, cur = 0; j >= 0; --j)
		{
			cur += max(0, min(i + k, a[j].second) - max(i, a[j].first - a[j].second));
			su[j] = max(su[j], cur);
		}
	int ans = su[0];
	for (int i = 0; i < n - k + 1; ++i)
		for (int j = 0, cur = 0; j < m; ++j)
		{
			cur += max(0, min(i + k, a[j].second) - max(i, a[j].first - a[j].second));
			ans = max(ans, cur + su[j + 1]);
		}
	printf("%d", ans);
}
```

据说 $O(n^2m)$ 的暴力打开向量化也可过…CF 机器这么快的吗…

![向量化牛逼](https://codeforces.com/predownloaded/7b/38/7b387fd54f6af06870062fc3457981afc3db1ce8.jpg)

## [Divide Powers](https://vjudge.net/problem/CodeForces-1452F)

对于每个操作 2，实际上有了两类选择：

1. 选择一个本来就符合条件的元素分解，使符合要求的元素 +1；
2. 选择一个本来不符合条件的元素分解，使符合要求的元素 +2（分界点上）或 +0；

由于要操作数最小，于是贪心地选择性价比更高的第二类操作（且显然优先选小的元素不会让结果变得更差），剩余的使用第一类补齐即可。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll n, q;
int main()
{
	scanf("%lld%lld", &n, &q);
	vector<ll> a(n);
	for (ll i = 0; i < n; ++i)
		scanf("%lld", &a[i]);
	for (ll j = 0, t, x, k; j < q; ++j)
	{
		scanf("%lld%lld%lld", &t, &x, &k);
		if (t == 1)
		{
			a[x] = k;
			continue;
		}
		vector<ll> b(a);
		ll ret = 0, cnt = 0;
		for (ll i = 0; i <= x; ++i)
			cnt += b[i];
		while (cnt < k)
		{
			for (ll i = x + 1; i < n; ++i)
			{
				ll s = min(b[i], (k - cnt) / (1LL << (i - x)));
				ret += s * ((1LL << (i - x)) - 1);
				cnt += s * (1LL << (i - x));
				b[i] -= s;
				b[x] += s * (1LL << (i - x));
			}
			ll sum = 0;
			for (ll i = 0; i <= x; ++i)
				sum += b[i] << i;
			if (sum >= k)
			{
				ret += k - cnt;
				break;
			}
			ll loc = x + 1;
			while (loc < n && b[loc] == 0)
				++loc;
			if (loc == n)
			{
				ret = -1;
				break;
			}
			ret += loc - x;
			cnt += 2;
			b[x] += 2;
			for (ll i = x + 1; i < loc; ++i)
				++b[i];
		}
		printf("%lld\n", ret);
	}
}
```

~~大锤八十砸墙，小锤四十扣缝~~

## [Game On Tree](https://vjudge.net/problem/CodeForces-1452G)

树上分治。直接贴官方题解稍改一下的代码。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9, INF = 1e9;
vector<int> g[N], dist[N];
int sz[N], par[N], used[N], max_dist[N];
int calc_size(int x, int p = -1)
{
	sz[x] = 1;
	for (auto y : g[x])
		if (y != p && !used[y])
			sz[x] += calc_size(y, x);
	return sz[x];
}
int find_centroid(int x, int p, int s)
{
	int ans = -1;
	bool good = true;
	for (auto y : g[x])
		if (y != p && !used[y])
			good &= sz[y] * 2 <= s;
		else if (y == p && !used[y])
			good &= (s - sz[x]) * 2 <= s;
	if (good)
		ans = x;
	for (auto y : g[x])
		if (y != p && !used[y])
			ans = max(ans, find_centroid(y, x, s));
	return ans;
}
void calc_dist(int x, int p, int d, int s)
{
	dist[x].push_back(d);
	for (auto y : g[x])
		if (y != p && !used[y])
			calc_dist(y, x, d + 1, s);
	max_dist[s] = max(max_dist[s], d);
}
int decomposition(int v)
{
	calc_size(v);
	int c = find_centroid(v, v, sz[v]);
	used[c] = true;
	for (auto y : g[c])
		if (!used[y])
			par[decomposition(y)] = c;
	used[c] = false;
	calc_dist(c, c, 0, c);
	return c;
}
int main()
{
	int n, k;
	scanf("%d", &n);
	for (int i = 0, x, y; i < n - 1; i++)
	{
		scanf("%d %d", &x, &y);
		g[--x].push_back(--y);
		g[y].push_back(x);
	}
	scanf("%d", &k);
	vector<int> d(n, INF);
	{
		deque<int> q;
		for (int i = 0, x; i < k; ++i)
		{
			scanf("%d", &x);
			q.push_back(--x);
			d[x] = 0;
		}
		while (!q.empty())
		{
			int x = q.front();
			q.pop_front();
			for (auto y : g[x])
				if (d[y] > d[x] + 1)
				{
					q.push_back(y);
					d[y] = d[x] + 1;
				}
		}
	}
	decomposition(0);
	vector<vector<int>> val;
	for (int i = 0; i < n; ++i)
		val.emplace_back(max_dist[i] + 1, 0);
	for (int i = 0; i < n; ++i)
		if (d[i])
			for (int curc = i, j = 0; j < dist[i].size(); ++j)
			{
				int dd = dist[i][j];
				if (dd > d[i] - 1)
				{
					curc = par[curc];
					continue;
				}
				dd = d[i] - 1 - dd;
				if (dd >= val[curc].size())
					dd = val[curc].size() - 1;
				val[curc][dd] = max(val[curc][dd], d[i]);
				curc = par[curc];
			}
	for (int i = 0; i < n; ++i)
		for (int j = max_dist[i]; j >= 1; --j)
			val[i][j - 1] = max(val[i][j], val[i][j - 1]);
	for (int i = 0; i < n; ++i)
	{
		int ans = 0;
		for (int curc = i, j = 0; j < dist[i].size(); ++j)
		{
			int dd = dist[i][j];
			ans = max(ans, val[curc][dd]);
			curc = par[curc];
		}
		printf("%d ", d[i] ? ans : 0);
	}
}
```
