---
title: Northwestern Europe Regional Contest (NWERC) 2018
categories:
  - ACM
  - 题解
---
# [Brexit Negotiations](https://vjudge.net/problem/Kattis-brexitnegotiations)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 9;
set<pair<int, int>> q;
vector<int> g[N], ans;
int n, e[N];
void work(int k)
{
	if (!q.count({e[k], k}))
		return;
	q.erase({e[k], k});
	for (auto i : g[k])
		work(i);
	ans.push_back(ans.size() + e[k]);
}
int main()
{
	scanf("%d", &n);
	for (int i = 0, d, b; i < n; ++i)
	{
		scanf("%d%d", &e[i], &d);
		for (int j = 0; j < d; ++j)
			scanf("%d", &b), g[i].push_back(b - 1);
		q.emplace(e[i], i);
	}
	while (!q.empty())
		work(q.rbegin()->second);
	printf("%d", *max_element(ans.begin(), ans.end()));
}
```
# [Circuit Board Design](https://vjudge.net/problem/Kattis-circuitdesign)
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef double lf;
typedef complex<lf> Coord;
const int N = 1023, NPOS = -1;
Coord ans[N];
vector<int> g[N];
int n, siz[N];
void dfs(int u, int fa, lf b)
{
	++siz[u];
	for (auto to : g[u])
		if (to != fa)
		{
			ans[to] = ans[u] + polar(1.0, b);
			dfs(to, u, b);
			b += siz[to] * acos(-1) / N;
			siz[u] += siz[to];
		}
}
int main()
{
	scanf("%d", &n);
	for (int i = 1, u, v; i < n; ++i)
	{
		scanf("%d%d", &u, &v);
		g[u].push_back(v);
		g[v].push_back(u);
	}
	dfs(1, NPOS, 0);
	for (int i = 1; i <= n; ++i)
		printf("%.9f %.9f\n", ans[i].real(), ans[i].imag());
}
```
# [Hard Drive](https://vjudge.net/problem/Kattis-harddrive)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 5e5 + 9;
char s[N];
int n, c, b, z[N];
int main()
{
	scanf("%d%d%d", &n, &c, &b);
	fill(s, s + n, '0');
	for (int i = 0; i < b; ++i)
	{
		scanf("%d", &z[i]), --z[i];
		for (int j = i ? z[i - 1] + 1 : !(c & 1); c > 0 && j < z[i]; j += 2)
			s[j] = '1', c -= 2;
	}
	printf("%s", s);
}
```
# [Inflation](https://vjudge.net/problem/Kattis-inflation)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
double f = 1, c[N];
int n;
int main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i)
		scanf("%lf", &c[i]);
	sort(c + 1, c + n + 1);
	for (int i = 1; i <= n; ++i)
	{
		if (c[i] > i)
			return printf("impossible"), 0;
		f = min(f, c[i] / i);
	}
	printf("%.9f", f);
}
```
# [Kleptography](https://vjudge.net/problem/Kattis-kleptography)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 127;
char a[N], b[N], k[N];
int n, m;
int main()
{
	scanf("%d%d", &n, &m);
	scanf("%s%s", a + m - n, b);
	for (int i = m - 1; ~i; --i)
	{
		k[i] = ((b[i] - 'a') + 26 - (a[i] - 'a')) % 26 + 'a';
		if (i >= n)
			a[i - n] = k[i];
	}
	printf("%s", a);
}
```
