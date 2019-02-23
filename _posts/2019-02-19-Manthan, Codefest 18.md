---
title: Manthan, Codefest 18
categories: [ACM,题解]
date: 2019-02-19 18:00:00
---
# [Packets](https://vjudge.net/problem/CodeForces-1037A)
```cpp
#include <bits/stdc++.h>
using namespace std;
int n, ans;
int main()
{
	for (scanf("%d", &n); n; n >>= 1)
		++ans;
	printf("%d", ans);
}
```
## 这个为啥错了？
```cpp
#include <bits/stdc++.h>
using namespace std;
int n;
int main()
{
	scanf("%d", &n);
	printf("%.0f", floor(log(n) / log(2)) + 1);
}
```
# [Reach Median](https://vjudge.net/problem/CodeForces-1037B)
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 2e5 + 7;
ll n, s, m, ans, a[N];
int main()
{
	scanf("%lld%lld", &n, &s);
	for (ll i = 0; i < n; ++i)
		scanf("%lld", &a[i]);
	sort(a, a + n);
	m = n / 2;
	if (a[m] < s)
		while (a[m] < s && m < n)
			ans += s - a[m++];
	else
		while (a[m] > s && m >= 0)
			ans += a[m--] - s;
	printf("%lld", ans);
}
```
# [Equalize](https://vjudge.net/problem/CodeForces-1037C)
`l[i]+r[i]`之后在所有数里的排名就是原来的排名，回代检验即可。
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;
char a[N], b[N];
int n;
int main()
{
	scanf("%d%s%s", &n, a, b);
	for (int i = n = 0; a[i]; ++i)
		if (a[i] != b[i])
		{
			++n;
			if (a[i + 1] != b[i + 1] && a[i] == b[i + 1])
				++i;
		}
	printf("%d", n);
}
```
# [Valid BFS?](https://vjudge.net/problem/CodeForces-1037D)
瞎跑大暴力直接过了…正解应该是用BFS的两个性质：
 - BFS序是关于深度的一个非减序列
 - BFS序是关于父节点深度的一个非减序列

别忘了起点嘚是1…太坑了吧
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;
unordered_set<int> g[N];
int n, m = 1, a[N];
int main()
{
	scanf("%d", &n);
	for (int i = 1, x, y; i < n; ++i)
	{
		scanf("%d%d", &x, &y);
		g[x].insert(y);
		g[y].insert(x);
	}
	for (int i = 0; i < n; ++i)
		scanf("%d", &a[i]);
	for (int i = 0; i < n; ++i)
		while (g[a[i]].count(a[m]))
			++m;
	printf(m == n && a[0] == 1 ? "Yes" : "No");
}
```
# [Trips](https://vjudge.net/problem/CodeForces-1037E)
倒着处理一波。
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;
unordered_set<int> se, g[N];
pair<int, int> e[N];
int n, m, k, vis[N], ans[N], cnt[N];
void del(int x)
{
	if (g[x].size() < k && se.erase(x))
		for (auto y : g[x])
			g[y].erase(x), del(y);
}
int main()
{
	scanf("%d%d%d", &n, &m, &k);
	for (int i = 0; i < m; ++i)
	{
		int &x = e[i].first, &y = e[i].second;
		scanf("%d%d", &x, &y);
		g[x].insert(y);
		g[y].insert(x);
	}
	for (int i = 1; i <= n; ++i)
		se.insert(i);
	for (int i = 1; i <= n; ++i)
		del(i);
	for (int i = m - 1; ~i; --i)
	{
		ans[i] = se.size();
		if (se.empty())
			break;
		int &x = e[i].first, &y = e[i].second;
		g[x].erase(y);
		g[y].erase(x);
		del(x);
		del(y);
	}
	for (int i = 0; i < m; ++i)
		printf("%d\n", ans[i]);
}
```