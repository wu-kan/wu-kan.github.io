---
title: 2019 Multi-University Training Contest 4
tags:
  - ACM
  - 题解
---

## [AND Minimum Spanning Tree](https://vjudge.net/problem/HDU-6614)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
int main()
{
	int t, n;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		vector<int> f(n + 1, 0);
		ll ans = 0;
		for (ll i = 2; i <= n; ++i)
		{
			for (ll j = 1; !f[i] && j <= n; j <<= 1)
				if (!(i & j))
					f[i] = j;
			if (!f[i])
				f[i] = 1;
			ans += i & f[i];
		}
		printf("%lld\n", ans);
		for (int i = 2; i <= n; ++i)
			printf("%d%c", f[i], i < n ? ' ' : '\n');
	}
}
```

## [Minimal Power of Prime](https://vjudge.net/problem/HDU-6623)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct EulerSieve
{
	vector<int> p, m;
	EulerSieve(int N) : m(N, 0)
	{
		for (long long i = 2, k; i < N; ++i)
		{
			if (!m[i])
				p.push_back(m[i] = i);
			for (int j = 0; j < p.size() && (k = i * p[j]) < N; ++j)
				if ((m[k] = p[j]) == m[i])
					break;
		}
	}
} E(pow(1e18, 0.2) + 9);
ll t, n;
bool check(int q)
{
	if (q == 4)
	{
		int t = pow(n, 0.25) + 0.5;
		return 1LL * t * t * t * t == n || 1LL * (t - 1) * (t - 1) * (t - 1) * (t - 1) == n || 1LL * (t + 1) * (t + 1) * (t + 1) * (t + 1) == n;
	}
	if (q == 3)
	{
		int t = pow(n, 1.0 / 3.0) + 0.5;
		return 1LL * t * t * t == n || 1LL * (t - 1) * (t - 1) * (t - 1) == n || 1LL * (t + 1) * (t + 1) * (t + 1) == n;
	}
	if (q == 2)
	{
		int t = pow(n, 0.5) + 0.5;
		return 1LL * t * t == n || 1LL * (t - 1) * (t - 1) == n || 1LL * (t + 1) * (t + 1) == n;
	}
}
int main()
{
	for (scanf("%lld", &t); t--;)
	{
		scanf("%lld", &n);
		int num = 0, minn = 63;
		for (int i = 0; i < E.p.size(); i++)
		{
			for (num = 0; n % E.p[i] == 0; ++num)
				n /= E.p[i];
			if (num)
				minn = min(num, minn);
			if (minn == 1)
				break;
		}
		if (n > 1)
		{
			int ans = 1;
			if (minn > 1 && n > 1)
				for (int q = 4; ans == 1 && q > 1; --q)
					if (check(q))
						ans = q;
			minn = min(minn, ans);
		}
		printf("%d\n", minn);
	}
}
```
