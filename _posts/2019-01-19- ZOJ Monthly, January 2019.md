---
title: ZOJ Monthly, January 2019
categories: [ACM,题解]
date: 2019-01-19 18:00:00
---
只做了AEI三题，还是太菜了…
# [Little Sub and Pascal's Triangle](https://vjudge.net/problem/ZOJ-4081)
打表快乐找规律……发现的规律是，对于答案序列中每连续的`1<<n`个数，后一半序列是由前一半的序列乘二得到的。于是可以直接根据k的二进制得到答案。
```cpp
#include <bits/stdc++.h>
using namespace std;
long long t, k, a;
int main()
{
	for (scanf("%lld", &t); t--; printf("%lld\n", a))
	{
		scanf("%lld", &k);
		for (k -= a = 1; k; k >>= 1)
			if (k & 1)
				a <<= 1;
	}
}
```
# [Little Sub and his Geometry Problem](https://vjudge.net/problem/ZOJ-4082)
容易发现，对于某个固定的询问C，符合要求的点一定是随着X增加Y减少，于是使用X、Y方向的双指针维护答案。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e5 + 7;
int t, n, k, q, ans;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &k);
		vector<vector<int>> e(n + 1);
		for (int i = 0, x, y; i < k; ++i)
			scanf("%d%d", &x, &y), e[x].push_back(y);
		for (scanf("%d", &q); q--; printf("%d%c", ans, q ? ' ' : '\n'))
		{
			ll c, x = 1, y = n, cnt = ans = 0, sum = 0;
			vector<int> cnty(n + 1), sumy(n + 1);
			for (scanf("%lld", &c); x <= n; ++x)
			{
				for (auto u : e[x])
					if (u <= y)
						++cnt, ++cnty[u], sum += x + u, sumy[u] += x + u;
				for (; (x + y) * cnt - sum > c; --y)
					cnt -= cnty[y], sum -= sumy[y];
				if ((x + y) * cnt - sum == c)
					++ans;
			}
		}
	}
}
```
# [Little Sub and Mr.Potato's Math Problem](https://vjudge.net/problem/ZOJ-4085)
十分不熟悉的数位DP，现场做了很久……以后要多多练习。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct POW : vector<ll>
{
	POW(int x, int n) : vector<ll>(n, 1)
	{
		for (int i = 1; i < size(); ++i)
			at(i) = at(i - 1) * x;
	}
} POW10(10, 19);
struct DP
{
	vector<ll> f;
	ll sum;
	DP(const vector<ll> &d) : f(d.size()), sum(0)
	{
		for (int i = 0; i < d.size(); ++i)
		{
			for (int j = f[i] = 0; j <= i; ++j)
				f[i] += (d[j] - (j == 0)) * POW10[i - j];
			sum += f[i] + 1;
		}
	}
};
ll cal(ll n, ll k, ll s, ll len)
{
	if (n > s * POW10[len])
		return cal(n - s * POW10[len], k, s, len + 1);
	return (n / POW10[len] + POW10[ll(log10(k))]) * POW10[len] + n % POW10[len] - 1;
}
int main()
{
	ll t, k, m;
	for (scanf("%lld", &t); t--;)
	{
		scanf("%lld%lld", &k, &m);
		vector<ll> d;
		for (ll n = k; n; n /= 10)
			d.push_back(n % 10);
		reverse(d.begin(), d.end());
		DP dp(d);
		printf("%lld\n", m == dp.sum ? k : m < dp.sum || k == *lower_bound(POW10.begin(), POW10.end(), k) ? 0 : cal(m - dp.sum, k, dp.f.back(), 1));
	}
}
```
# [Little Sub and Isomorphism Sequences](https://vjudge.net/problem/ZOJ-4089)
容易看出求最大的k就是求两个相同元素下标差的最大值，用一个set维护即可。为了求稳使用了离散化处理。
```cpp
#include <bits/stdc++.h>
#define MP(i) make_pair(vs[i].size() < 2 ? -1 : *vs[i].rbegin() - *vs[i].begin(), i)
using namespace std;
typedef int ll;
struct Ranker : vector<ll>
{
	void init()
	{
		sort(begin(), end()), resize(unique(begin(), end()) - begin());
	}
	int ask(ll x) const
	{
		return lower_bound(begin(), end(), x) - begin();
	}
};
ll getll(FILE *in = stdin)
{
	ll val = 0, sgn = 1, ch = getc(in);
	for (; !isdigit(ch) && ch != EOF; ch = getc(in))
		if (ch == '-')
			sgn = -sgn;
	for (; isdigit(ch); ch = getc(in))
		val = val * 10 + ch - '0';
	return ungetc(ch, in), sgn * val;
}
int main()
{
	for (ll t = getll(); t--;)
	{
		ll n = getll(), m = getll();
		Ranker input;
		for (int i = 0; i < n; ++i)
			input.push_back(getll());
		for (int i = 0; i < m; ++i)
		{
			input.push_back(getll());
			if (input.back() == 1)
			{
				input.push_back(getll());
				input.push_back(getll());
			}
		}
		Ranker::iterator it = input.begin();
		Ranker rk(input), a;
		rk.init();
		vector<set<int>> vs(rk.size());
		for (int i = 0; i < n; ++i)
		{
			a.push_back(rk.ask(*(it++)));
			vs[a.back()].insert(i);
		}
		set<pair<int, int>> q;
		for (int i = 0; i < vs.size(); ++i)
			q.insert(MP(i));
		for (int i = 0; i < m; ++i)
		{
			if (*(it++) == 1)
			{
				ll x = *(it++) - 1;
				q.erase(MP(a[x]));
				vs[a[x]].erase(x);
				q.insert(MP(a[x]));
				a[x] = rk.ask(*(it++));
				q.erase(MP(a[x]));
				vs[a[x]].insert(x);
				q.insert(MP(a[x]));
			}
			else
				printf("%d\n", q.rbegin()->first);
		}
	}
}
```