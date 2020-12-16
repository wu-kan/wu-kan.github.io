---
title: "Codeforces Round #688 (Div. 2)"
tags:
  - ACM
---

[官方题解](https://codeforces.com/blog/entry/85288)

## [Cancel the Trains](https://vjudge.net/problem/CodeForces-1453A)

发现会相撞的只有标签相同的列车，那就变成水题了。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int t, n, m;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &m);
		unordered_set<int> s;
		for (int i = 0, x; i < n; ++i)
			scanf("%d", &x), s.insert(x);
		for (int i = 0, x; i < m; ++i)
			scanf("%d", &x), s.insert(x);
		printf("%d\n", n + m - (int)s.size());
	}
}
```

## [Suffix Operations](https://vjudge.net/problem/CodeForces-1453B)

感觉这个 Div2 的 B 题做起来比 C 题还难…

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
		for (int i = 0; i < n; ++i)
			scanf("%d", &a[i]);
		ll sum = 0;
		for (int i = 1; i < n; ++i)
			sum += abs(a[i] - a[i - 1]);
		int mx = max(abs(a[0] - a[1]), abs(a[n - 1] - a[n - 2]));
		for (int i = 2; i < n; ++i)
			mx = max(mx, abs(a[i - 1] - a[i - 2]) + abs(a[i] - a[i - 1]) - abs(a[i] - a[i - 2]));
		printf("%lld\n", sum - mx);
	}
}
```

## []()

```cpp

```
