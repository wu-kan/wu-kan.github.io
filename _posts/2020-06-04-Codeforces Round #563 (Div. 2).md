---
title: "Codeforces Round #563 (Div. 2)"
categories:
  - ACM
  - 题解
---
[官方题解]()暂时未出。

B题沙雕了，卡了四十分钟，然后突然发现排序一下就好了…

把E转成组合数学的模型后发现还是不会求…

F题差一分钟交上去，不知道对不对了。
# [Ehab Fails to Be Thanos](https://vjudge.net/problem/CodeForces-1174A)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1023;
long long s1, s2;
int n, a[2 * N];
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < 2 * n; ++i)
		scanf("%d", &a[i]), s1 += a[i];
	sort(a, a + 2 * n);
	for (int i = 0; i < n; ++i)
		s2 += a[i];
	if (s2 * 2 == s1)
		return printf("-1"), 0;
	for (int i = 0; i < 2 * n; ++i)
		printf("%d ", a[i]);
}
```
# [Ehab Is an Odd Person](https://vjudge.net/problem/CodeForces-1174B)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, cnt[2], a[N];
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; ++i)
		scanf("%d", &a[i]), ++cnt[a[i] & 1];
	if (cnt[0] && cnt[1])
		sort(a, a + n);
	for (int i = 0; i < n; ++i)
		printf("%d ", a[i]);
}
```
# [Ehab and a Special Coloring Problem](https://vjudge.net/problem/CodeForces-1174C)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, a[N];
int main()
{
	scanf("%d", &n);
	for (int i = 2, tot = 0; i <= n; ++i)
	{
		a[i] = N;
		for (int j = 2; a[i] == N && j * j <= i; ++j)
			if (i % j == 0)
				a[i] = a[j];
		if (a[i] == N)
			a[i] = ++tot;
	}
	for (int i = 2; i <= n; ++i)
		printf("%d ", a[i]);
}
```
# [Ehab and the Expected XOR Problem](https://vjudge.net/problem/CodeForces-1174D)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1 << 18;
int n, x, y, a[N];
int main()
{
	scanf("%d %d", &n, &x);
	if (x >= (1 << n))
	{
		printf("%d\n", (1 << n) - 1);
		for (int i = 0, len = (1 << n) - 1; i < len; ++i)
		{
			int t = i ^ (i + 1);
			printf("%d ", t);
		}
		return 0;
	}
	for (y = 1; y <= x; y <<= 1)
		if (y & x)
			break;
	printf("%d\n", (1 << n - 1) - 1);
	for (int i = 0, len = (1 << n - 1) - 1; i < len; ++i)
	{
		int t = i ^ (i + 1);
		t = t % y + t / y * 2 * y;
		printf("%d ", t);
	}
}
```
# [Ehab and the Expected GCD Problem](https://vjudge.net/problem/CodeForces-1174E)
```cpp

```
# [Ehab and the Big Finale](https://vjudge.net/problem/CodeForces-1174F)
差一点点交上去…
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
unordered_set<int> g[N];
int n, fa[N], maxd[N];
void dfs(int u)
{
	for (auto c : g[u])
		if (c != fa[u])
			fa[c] = u, dfs(c), maxd[u] = max(maxd[u], maxd[c] + 1);
}
int main()
{
	cin >> n;
	for (int i = 1, u, v; i < n; ++i)
	{
		cin >> u >> v;
		g[u].insert(v);
		g[v].insert(u);
	}
	dfs(1);
	for (int u = 1, ans;;)
	{
		cout << "d " << u << endl;
		for (cin >> ans; ans; --ans)
		{
			vector<int> sb;
			for (auto c : g[u])
				if (c == fa[u] || maxd[c] + 1 < ans)
					sb.push_back(c);
			for (auto c : sb)
				g[u].erase(c);
			if (g[u].size() > 1)
				break;
			u = *g[u].begin();
		}
		if (!ans)
			return cout << "! " << u, 0;
		cout << "s " << u << endl;
		cin >> u;
	}
}
```
