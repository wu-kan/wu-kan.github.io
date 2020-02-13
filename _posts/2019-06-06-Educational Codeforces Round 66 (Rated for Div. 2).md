---
title: Educational Codeforces Round 66 (Rated for Div. 2)
tags:
  - ACM
  - 题解
---
[官方题解](https://codeforces.com/blog/entry/67484)
## [From Hero to Zero](https://vjudge.net/problem/CodeForces-1175A)
```c
#include <stdio.h>
long long t, n, k, ans;
int main()
{
	for (scanf("%lld", &t); t--; printf("%lld\n", ans))
		for (scanf("%lld%lld", &n, &k), ans = -1; n; ++ans, n /= k)
			ans += n % k;
}
```
## [Catch Overflow!](https://vjudge.net/problem/CodeForces-1175B)
```cpp
#include <bits/stdc++.h>
using namespace std;
char s[9];
int l;
int main()
{
	vector<long long> st(1, 0), stak;
	for (scanf("%d", &l); l--;)
	{
		scanf("%s", s);
		if (!strcmp(s, "for"))
		{
			int n;
			scanf("%d", &n);
			stak.push_back(n);
			st.push_back(0);
		}
		else if (!strcmp(s, "end"))
		{
			long long t = st.back();
			st.pop_back();
			st.back() += t * stak.back();
			stak.pop_back();
		}
		else
			++st.back();
		if (st.back() >= 1LL << 32)
			return cout << "OVERFLOW!!!", 0;
	}
	cout << st.back();
}
```
## [Electrification](https://vjudge.net/problem/CodeForces-1175C)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9, INF = 1e9;
int t, n, k, a[N];
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &k);
		for (int i = 0; i < n; ++i)
			scanf("%d", &a[i]);
		pair<int, int> p(INF, -1);
		for (int i = 0; i + k < n; ++i)
			p = min(p, {a[i + k] - a[i], a[i + k] + a[i] >> 1});
		printf("%d\n", p.second);
	}
}
```
## [Array Splitting](https://vjudge.net/problem/CodeForces-1175D)
k段前缀和，其中$[1,n]$必须得选，其余$[2,n]\ldots [n,n]$选最大的k段即可。
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 3e5 + 9;
long long n, k, a[N];
int main()
{
	scanf("%lld%lld", &n, &k);
	for (int i = 1; i <= n; ++i)
		scanf("%lld", &a[i]), a[i] += a[i - 1];
	a[n] *= k;
	sort(a + 1, a + n);
	for (int i = 1; i < k; ++i)
		a[n] -= a[i];
	printf("%lld", a[n]);
}
```
## [Minimal Segment Cover](https://vjudge.net/problem/CodeForces-1175E)
记$f_{i,j}$为包含坐标$i$点且最多有$2^j$条线段时所能到达的最右端的点，那么是可以倍增的。
```cpp
#include <bits/stdc++.h>
using namespace std;
const int M = 5e5 + 9, K = 21;
int n, m, f[M][K];
int main()
{
	scanf("%d%d", &n, &m);
	for (int x, y; n--; f[x][0] = max(f[x][0], y))
		scanf("%d%d", &x, &y);
	for (int i = 1; i < M; ++i)
		f[i][0] = max(f[i][0], f[i - 1][0]);
	for (int j = 1; j < K; ++j)
		for (int i = 0; i < M; ++i)
			f[i][j] = f[f[i][j - 1]][j - 1];
	for (int x, y; m--;)
	{
		int ans = 1;
		scanf("%d%d", &x, &y);
		for (int i = K - 1; ~i; --i)
			if (f[x][i] < y)
				ans += 1 << i, x = f[x][i];
		if (f[x][0] < y)
			ans = -1;
		printf("%d\n", ans);
	}
}
```
## [The Number of Subpermutations](https://vjudge.net/problem/CodeForces-1175F)
从前往后维护以i为终点的答案。显然区间里的数是互不相同的，可以用`la[i]`数组记录i上一次出现的位置。由于区间要求值为$[1,len]$，所以很容易发现越短的区间最大值越小，所以从后向前扫时，仅需维护一个单调队列。复杂度O(n)。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 3e5 + 9;
deque<int> q;
ll ans;
int n, a[N], la[N], mp[N << 1];
int main()
{
	scanf("%d", &n);
	for (int i = 1, p = 0; i <= n; ++i)
	{
		for (scanf("%d", &a[i]); p < la[a[i]]; ++p)
			if (!q.empty())
			{
				--mp[a[q.front()] + p];
				if (q.front() == p + 1)
					q.pop_front();
				else
					++mp[a[q.front()] + p + 1];
			}
		for (; !q.empty() && a[i] > a[q.back()]; q.pop_back())
			--mp[a[q.back()] + (q.size() < 2 ? p : q[q.size() - 2])];
		q.push_back(la[a[i]] = i);
		++mp[a[q.back()] + (q.size() < 2 ? p : q[q.size() - 2])];
		ans += mp[i];
	}
	printf("%lld", ans);
}
```
## [Yet Another Partiton Problem](https://vjudge.net/problem/CodeForces-1175G)
```cpp
```
