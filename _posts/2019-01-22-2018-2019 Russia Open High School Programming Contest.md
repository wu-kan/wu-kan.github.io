---
title: 2018-2019 Russia Open High School Programming Contest
tags:
  - ACM
  - 题解
---

## [Company Merging](https://vjudge.net/problem/CodeForces-1090A)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll n, ma, ans, t;
int main()
{
	scanf("%lld", &n);
	for (ll i = 0, z; i < n; ++i)
	{
		scanf("%lld", &z);
		ll ma2 = 0;
		for (ll j = 0, x; j < z; ++j)
		{
			scanf("%lld", &x);
			ma2 = max(ma2, x);
		}
		if (ma < ma2)
			ans += t * (ma2 - ma);
		else if (ma > ma2)
			ans += z * (ma - ma2);
		ma = max(ma, ma2);
		t += z;
	}
	printf("%lld", ans);
}
```

## [LaTeX Expert](https://codeforces.com/problemset/problem/1090/B)

坑题，下面的引用可能会有多行。

```cpp
#include <bits/stdc++.h>
using namespace std;
const string BEGIN("\\begin{thebibliography}{99}"), END("\\end{thebibliography}");
unordered_map<string, string> mp;
vector<string> text, bibitem;
int main()
{
	for (string s; cin >> s, s != BEGIN;)
		if (s.find("\\cite{") != s.npos)
		{
			s = s.substr(s.find('{') + 1);
			s.erase(s.find('}'));
			text.push_back(s);
		}
	for (string s, t, *p = &t; getline(cin, s), s != END;)
	{
		if (s.find("\\bibitem{") != s.npos)
		{
			s = s.substr(s.find('{') + 1);
			t = s.substr(s.find('}') + 1);
			s.erase(s.find('}'));
			bibitem.push_back(s);
			p = &mp[s];
			*p = t;
		}
		else
			*p += '\n' + s;
	}
	if (text == bibitem)
		return cout << "Correct", 0;
	cout << "Incorrect\n"
		 << BEGIN << '\n';
	for (int i = 0; i < text.size(); ++i)
		cout << "\\bibitem{" << text[i] << "}" << mp[text[i]] << "\n";
	cout << END;
}
```

## [Similar Arrays](https://vjudge.net/problem/CodeForces-1090D)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e5 + 9;
int a[N], v[N * 2], nex[N * 2], g[N], d[N], tot, n, m, p[N];
void add(int x, int y)
{
	v[++tot] = y, nex[tot] = g[x], g[x] = tot, ++d[x];
}
int main()
{
	scanf("%d%d", &n, &m);
	if (n == 1 || n == 2 && m)
		return printf("NO"), 0;
	for (int i = 0, x, y; i < m; ++i)
	{
		scanf("%d%d", &x, &y);
		add(x, y);
		add(y, x);
	}
	int t1 = 0, t2 = 0;
	for (int i = 1; i <= n; ++i)
		if (d[i] != n - 1)
		{
			t1 = i;
			for (int j = 1; j <= n; ++j)
				p[j] = 0;
			p[i] = 1;
			for (int j = g[i]; j; j = nex[j])
				p[v[j]] = 1;
			for (int j = 1; j <= n; ++j)
				if (!p[j])
				{
					t2 = j;
					break;
				}
			break;
		}
	if (!t1)
		return printf("NO\n"), 0;
	printf("YES\n");
	a[t1] = n;
	a[t2] = n - 1;
	for (int i = 1, t = 0; i <= n; ++i)
		if (!a[i])
			a[i] = ++t;
	for (int i = 1; i <= n; ++i)
		printf("%d ", a[i]);
	printf("\n");
	a[t1] = n - 1;
	for (int i = 1; i <= n; ++i)
		printf("%d ", a[i]);
}
```

## [Minimal Product](https://codeforces.com/problemset/problem/1090/I)

现场调到自闭的一题，该用`unsigned`的地方不能用`long long`代替。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll INF = 5e18, N = 1e7 + 7;
ll l, r, a[N];
unsigned t, n, x, y, z, b[N];
int main()
{
	for (scanf("%u", &t); t--;)
	{
		scanf("%u%lld%lld%u%u%u%u%u", &n, &l, &r, &x, &y, &z, &b[1], &b[2]);
		ll ans = INF, mi = INF, ma = -INF;
		for (ll i = 1; i <= n; ++i)
		{
			if (i > 2)
				b[i] = b[i - 2] * x + b[i - 1] * y + z;
			a[i] = b[i] % (r - l + 1) + l;
			if (mi < a[i])
				ans = min(ans, mi * a[i]);
			else
				mi = a[i];
		}
		for (ll i = n; i; --i)
		{
			if (ma > a[i])
				ans = min(ans, ma * a[i]);
			else
				ma = a[i];
		}
		if (ans < INF)
			printf("%lld\n", ans);
		else
			printf("IMPOSSIBLE\n");
	}
}
```

## [Right Expansion Of The Mind](https://codeforces.com/problemset/problem/1090/K)

感兴趣具有传递性。两个人感兴趣，当仅当：

- 两人的`t`串具有相同的字符集
- 对于两个人的`s`串，分别删去能够包含在`t`串字符集的最长后缀后相等。

按照`a`~`z`是否出现分别对应二进制串中的每一位给`t`串的字符集编码，按这个编码给所有人分类，然后在每个分类里讨论分组情况即可。`map`套`map`套`vector`实现。疯了呀。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;
unordered_map<int, unordered_map<string, vector<int>>> mp;
char s[N], t[N];
int n, m, ans;
int main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i)
	{
		scanf("%s%s", s, t);
		for (int i = m = 0; t[i]; ++i)
			m |= 1 << t[i] - 'a';
		for (int i = strlen(s) - 1; ~i; --i)
		{
			if (m & 1 << s[i] - 'a')
				s[i] = 0;
			else
				break;
		}
		mp[m][s].push_back(i);
	}
	for (auto mpi : mp)
		ans += mpi.second.size();
	printf("%d\n", ans);
	for (auto mpi : mp)
		for (auto mpii : mpi.second)
		{
			printf("%d", mpii.second.size());
			for (auto mpiii : mpii.second)
				printf(" %d", mpiii);
			printf("\n");
		}
}
```

## [Berland University](https://codeforces.com/problemset/problem/1090/L)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
bool check(ll x, ll t1, ll t2, ll a, ll b, ll k)
{
	if (a > x)
		a = x;
	if (b > x)
		b = x;
	ll tt1 = t1 * a / x + t2 * b / x, tt2 = t1 * a % x + t2 * b % x;
	if (tt2 >= x)
		tt1++;
	return tt1 >= k;
}
int main()
{
	ll t, n, a, b, k;
	scanf("%lld%lld%lld%lld%lld", &t, &n, &a, &b, &k);
	ll t1 = (n + 1) / 2, t2 = n / 2, l = 1, r = t, ans = 0;
	while (l <= r)
	{
		ll mid = (l + r) >> 1;
		if (check(mid, t1, t2, a, b, k))
		{
			ans = mid;
			l = mid + 1;
		}
		else
			r = mid - 1;
	}
	printf("%lld", ans);
}
```

## [The Pleasant Walk](https://vjudge.net/problem/CodeForces-1090M)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 7;
int n, m, ans, a[N];
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= n; ++i)
		scanf("%d", &a[i]);
	for (int i = 1, t = 0; i <= n; ++i)
	{
		if (t && a[i] == a[i - 1])
			t = 0;
		ans = max(ans, ++t);
	}
	printf("%d", ans);
}
```
