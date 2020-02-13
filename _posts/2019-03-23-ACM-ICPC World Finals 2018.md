---
title: ACM-ICPC World Finals 2018
tags:
  - ACM
  - 题解
---

## [Comma Sprinkler](https://vjudge.net/problem/Kattis-comma)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;
struct ID : unordered_map<string, int>
{
	vector<string> v;
	int ask(const string &s)
	{
		if (count(s))
			return at(s);
		return insert({s, v.size()}), v.push_back(s), v.size() - 1;
	}
} id;
deque<pair<int, int>> q;
vector<int> v[N];
char s[N], t[N], vis[N][2];
int n, a[N];
int main()
{
	for (; ~scanf("%s", s); ++n)
	{
		int len = strlen(s);
		if (s[len - 1] == ',' || s[len - 1] == '.')
			t[n] = s[--len], s[len] = 0;
		v[a[n] = id.ask(s)].push_back(n);
		if (t[n] == ',')
			q.push_back({n, 1}), q.push_back({n + 1, 0});
	}
	for (; !q.empty(); q.pop_front())
	{
		int an = a[q.front().first], type = q.front().second;
		if (vis[an][type] || q.front().first >= n)
			continue;
		else
			vis[an][type] = 1;
		if (type)
		{
			for (auto i : v[an])
				if (!t[i])
					t[i] = ',', q.push_back({i + 1, 0});
		}
		else
		{
			for (auto i : v[an])
				if (i > 0 && !t[i - 1])
					t[i - 1] = ',', q.push_back({i - 1, 1});
		}
	}
	for (int i = 0; i < n; ++i)
	{
		cout << id.v[a[i]];
		if (t[i])
			cout << t[i];
		cout << " ";
	}
}
```

## [Go with the Flow](https://vjudge.net/problem/Kattis-gowithflow)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4095;
char s[99];
int n, a[N], ans0, ans1;
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; ++i)
		scanf("%s", s), a[i] = strlen(s);
	for (int len = *max_element(a, a + n), i = len; i < n * len + n; ++i)
	{
		vector<pair<int, int>> mp, mmp;
		for (int j = 0, now = 0, p = 0; j < n; ++j)
		{
			now += a[j] + 1;
			if (j + 1 >= n || now + a[j + 1] > i)
			{
				now = p = 0;
				swap(mp, mmp);
				mp.clear();
				continue;
			}
			mp.push_back({now, 1});
			while (p < mmp.size() && mmp[p].first < now - 1)
				++p;
			for (int k = p; k < mmp.size() && mmp[k].first < now + 2; ++k)
				mp.back().second = max(mp.back().second, mmp[k].second + 1);
			if (ans1 < mp.back().second)
				ans0 = i, ans1 = mp.back().second;
		}
	}
	printf("%d %d", ans0, ans1);
}
```

## [Wireless is the New Fiber](https://vjudge.net/problem/Kattis-newfiber)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
set<pair<int, int>> p, q;
int n, m, d[N];
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 0, u, v; i < m; ++i)
		scanf("%d%d", &u, &v), ++d[u], ++d[v];
	for (int i = 0; i < n; ++i)
		p.insert({d[i], i});
	int t = (m = n) - 1;
	for (auto it : p)
	{
		if (t > it.first - 1)
			t -= it.first - 1, q.insert(it), --m;
		else
			q.insert({t, it.second}), t = 1;
	}
	printf("%d\n%d %d\n", m, n, n - 1);
	while (!q.empty())
	{
		auto ch = *q.begin(), fa = *q.rbegin();
		printf("%d %d\n", ch.second, fa.second);
		q.erase(ch), q.erase(fa);
		if (--fa.first)
			q.insert(fa);
	}
}
```
