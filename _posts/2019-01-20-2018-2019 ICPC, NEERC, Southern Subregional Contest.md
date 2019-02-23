---
title: 2018-2019 ICPC, NEERC, Southern Subregional Contest
categories: [ACM,题解]
date: 2019-01-20 18:00:00
---
# [Find a Number](https://vjudge.net/problem/CodeForces-1070A)
BFS搜索并保存路径，维护两维数据：走到当前位置时的余数和总和。
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 511, M = 5111;
int d, s, vis[N][M], prex[N][M], prey[N][M], val[N][M];
void print(int x, int y)
{
	if (x == 0 && y == 0)
		return;
	print(prex[x][y], prey[x][y]);
	printf("%d", val[x][y]);
}
int main()
{
	scanf("%d%d", &d, &s);
	val[0][s] = -1;
	for (deque<pair<int, int>> q(vis[0][0] = 1); !q.empty(); q.pop_front())
		for (int x = q.front().first, y = q.front().second, i = 0; i <= 9; ++i)
		{
			int xx = (10 * x + i) % d, yy = y + i;
			if (vis[xx][yy] || yy > s)
				continue;
			vis[xx][yy] = 1;
			val[xx][yy] = i;
			prex[xx][yy] = x;
			prey[xx][yy] = y;
			q.push_back(make_pair(xx, yy));
		}
	print(0, s);
}
```
# [Cloud Computing](https://vjudge.net/problem/CodeForces-1070C)
线段树，现场被奇奇怪怪的思路搞到自闭了。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e6 + 9;
struct Node
{
	int c, p;
} a[N];
struct Tree
{
	ll x, size;
} t[N * 4];
int v[N], w[N], nex[N], g[N], tot;
void add(int x, int y, int z)
{
	v[++tot] = y;
	w[tot] = z;
	nex[tot] = g[x];
	g[x] = tot;
}
void ins(int x, int l, int r, int p, int q)
{
	if (l == r)
	{
		t[x].size += q;
		t[x].x += q * 1ll * l;
		return;
	}
	int mid = (l + r) >> 1;
	if (p <= mid)
		ins(x << 1, l, mid, p, q);
	else
		ins(x << 1 | 1, mid + 1, r, p, q);
	t[x].size = t[x << 1].size + t[x << 1 | 1].size;
	t[x].x = t[x << 1].x + t[x << 1 | 1].x;
}
ll get(int x, int l, int r, int p)
{
	if (t[x].size <= p)
		return t[x].x;
	if (l == r)
		return l * 1ll * p;
	int mid = (l + r) >> 1;
	if (t[x << 1].size >= p)
		return get(x << 1, l, mid, p);
	else
		return get(x << 1, l, mid, t[x << 1].size) + get(x << 1 | 1, mid + 1, r, p - t[x << 1].size);
}
int main()
{
	int n, m, k;
	scanf("%d%d%d", &n, &m, &k);
	for (int i = 1, x, y; i <= k; i++)
	{
		scanf("%d%d%d%d", &x, &y, &a[i].c, &a[i].p);
		add(x, i, 1);
		add(y + 1, i, -1);
	}
	ll ans = 0, last = 0;
	for (int i = 1; i <= n; i++)
	{
		bool p = 1;
		for (int j = g[i]; j; j = nex[j])
		{
			p = 0;
			ins(1, 1, 1e6, a[v[j]].p, a[v[j]].c * w[j]);
		}
		if (p)
			ans += last;
		else
		{
			last = get(1, 1, 1e6, m);
			ans += last;
		}
	}
	printf("%lld", ans);
}
```
# [Garbage Disposal](https://vjudge.net/problem/CodeForces-1070D)
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll n, k, ans;
int main()
{
	scanf("%lld%lld", &n, &k);
	for (ll i = 0, a, pre = 0; i < n; ++i)
	{
		scanf("%lld", &a);
		ans += pre / k;
		pre %= k;
		if (pre > 0)
			pre -= k, ++ans;
		pre += a;
		if (pre < 0)
			pre = 0;
		ans += pre / k;
		pre %= k;
		if (i == n - 1 && pre > 0)
			++ans;
	}
	printf("%lld", ans);
}
```
# [Debate](https://vjudge.net/problem/CodeForces-1070F)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 4e5 + 9;
int n, ans, t[4], a[N], b[N], c[N * 2];
int main()
{
	scanf("%d", &n);
	for (int i = 1, x, y; i <= n; ++i)
	{
		scanf("%d%d", &x, &y);
		if (x == 11)
			++t[3], ans += y;
		if (x == 10)
			a[++t[2]] = y;
		if (x == 1)
			b[++t[1]] = y;
		if (x == 0)
			c[++t[0]] = y;
	}
	sort(a + 1, a + 1 + t[2], greater<int>());
	sort(b + 1, b + 1 + t[1], greater<int>());
	int mi = min(t[2], t[1]);
	for (int i = 1; i <= mi; ++i)
		ans += a[i] + b[i];
	if (t[2] > t[1])
		for (int i = mi + 1; i <= t[2]; ++i)
			c[++t[0]] = a[i];
	else if (t[2] < t[1])
		for (int i = mi + 1; i <= t[1]; ++i)
			c[++t[0]] = b[i];
	sort(c + 1, c + 1 + t[0], greater<int>());
	for (int i = 1; i <= t[3]; ++i)
		ans += c[i];
	printf("%d", ans);
}
```
# [BerOS File Suggestion](https://vjudge.net/problem/CodeForces-1070H)
```cpp
#include <bits/stdc++.h>
using namespace std;
unordered_map<string, pair<int, string>> mp;
string s;
int n;
int main()
{
	for (cin >> n; n--;)
	{
		cin >> s;
		unordered_set<string> st;
		for (int i = 0; i < s.size(); ++i)
			for (int j = i; j < s.size(); ++j)
				st.insert(s.substr(i, j - i + 1));
		for (auto it : st)
		{
			pair<int, string> &pis = mp[it];
			if (++mp[it].first == 1)
				mp[it].second = s;
		}
	}
	for (cin >> n; n--;)
	{
		cin >> s;
		pair<int, string> &pis = mp[s];
		cout << pis.first << ' ' << (!pis.second.empty() ? pis.second : "-") << '\n';
	}
}
```
# [Video Posts](https://vjudge.net/problem/CodeForces-1070K)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, k, s, m, a[N];
int main()
{
	scanf("%d%d", &n, &k);
	for (int i = 0; i < n; ++i)
		scanf("%d", &a[i]), s += a[i];
	if (s % k)
		return printf("No"), 0;
	m = s / k;
	vector<int> v;
	for (int i = s = 0, pre = -1; i < n; ++i)
	{
		s += a[i];
		if (s > m)
			return printf("No"), 0;
		if (s == m)
			v.push_back(i - pre), pre = i, s = 0;
	}
	printf("Yes\n");
	for (int i = 0; i < v.size(); ++i)
		printf("%d ", v[i]);
}
```