---
title: 2018 ICPC Asia Jakarta Regional Contest
categories: [ACM,题解]
date: 2019-01-24 18:00:00
---
{% raw %}
# [Edit Distance](https://vjudge.net/problem/Gym-102001A)
```cpp
#include <bits/stdc++.h>
using namespace std;
string s;
int cnt;
int main()
{
	cin >> s;
	for (auto c : s)
		cnt += c == '0' ? 1 : -1;
	if (cnt)
		cout << string(s.size(), cnt < 0 ? '0' : '1');
	else
		cout << (s[0] == '0' ? "1" : "0") + string(s.size() - 1, s[0]);
}
```
# [Icy Land](https://vjudge.net/problem/Gym-102001D)
```cpp
#include <bits/stdc++.h>
using namespace std;
char s[511][511];
int n, m, ans;
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 1; i <= n; ++i)
		scanf("%s", s[i] + 1);
	if (n > m)
	{
		for (int i = 1; i <= n || i <= m; ++i)
			for (int j = 1; j < i; ++j)
				swap(s[i][j], s[j][i]);
		swap(n, m);
	}
	if (n == 1)
	{
		for (int i = 2; i < m; ++i)
			if (s[1][i] == '.')
				++ans;
	}
	else if (n == 2)
	{
		for (int i = 2; i < m; ++i)
			if (s[1][i] == '.' && s[2][i] == '.')
				++ans;
	}
	else
	{
		for (int i = 2; i < n; ++i)
			for (int j = 2; j < m; ++j)
				if (s[i][j] == '.')
					++ans;
		bool p = 1;
		for (int i = 2; i < n; ++i)
			if (s[i][1] == '#' || s[i][m] == '#')
				p = 0;
		for (int i = 2; i < m; ++i)
			if (s[1][i] == '#' || s[n][i] == '#')
				p = 0;
		if (p)
			++ans;
	}
	printf("%d", ans);
}
```
# [Popping Balloons](https://vjudge.net/problem/Gym-102001F)
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 1e5 + 7;
ll n, m, a[N], b[N], s[N];
int main()
{
	scanf("%lld%lld", &n, &m);
	for (ll i = 1; i <= n; ++i)
		scanf("%lld", &a[i]);
	for (ll i = 1; i <= n; ++i)
		scanf("%lld", &b[i]), s[i] = s[i - 1] + b[i];
	vector<ll> v;
	for (ll i = 1,sum=0; i <= n; ++i)
	{
		if (sum + a[i] <= m)
			v.push_back(sum += a[i]);
		else
			break;
	}
	ll rs = 0;
	priority_queue<pair<ll, ll>> q;
	for (ll i = 1; i <= v.size(); ++i)
		q.push(make_pair(b[i], -s[i]));
	vector<ll> ans;
	for (ll i = 0; i < v.size(); ++i)
	{
		while (!q.empty() && -q.top().second < v[i] - rs)
			q.pop();
		if (q.empty())
			break;
		if (rs - q.top().second <= m)
			ans.push_back(rs - q.top().second);
		rs += q.top().first;
	}
	if (q.empty() || rs + s[v.size()] <= m)
		return printf("-1"), 0;
	printf("%d\n", ans.size());
	for (auto an : ans)
		printf("%lld ", an);
}
```
# [Go Make It Complete](https://vjudge.net/problem/Gym-102001G)
二分+贪心大暴力居然苟过去了…
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 511;
int n, m, g[N][N], dd[N], d[N];
struct Node
{
	int a, b;
	bool operator<(const Node &rhs) const
	{
		return d[a] + d[b] < d[rhs.a] + d[rhs.b];
	}
};
vector<Node> qq;
int ok(int k)
{
	copy(dd, dd + n + 1, d);
	for (vector<Node> q(qq); !q.empty(); q.pop_back())
	{
		if (d[q.back().a] + d[q.back().b] < k)
			sort(q.begin(), q.end());
		if (d[q.back().a] + d[q.back().b] < k)
			return 0;
		++d[q.back().a], ++d[q.back().b];
	}
	return 1;
}
int bs(int b, int e)
{
	if (e - b < 2)
		return b;
	int k = b + e >> 1;
	return ok(k) ? bs(k, e) : bs(b, k);
}
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 0, a, b; i < m; ++i)
		scanf("%d%d", &a, &b), g[a][b] = g[b][a] = 1, ++dd[a], ++dd[b];
	for (int i = 1; i <= n; ++i)
		for (int j = i + 1; j <= n; ++j)
			if (!g[i][j])
				qq.push_back({i, j});
	cout << bs(0, n * (n - 1) / 2 + 1);
}
```
# [Lexical Sign Sequence](https://vjudge.net/problem/Gym-102001H)
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
const int N = 1e5 + 7;
struct Fenwick
{
	vector<ll> v;
	Fenwick(int last) : v(last + 1, 0) {}
	void add(int x, ll w)
	{
		for (; x < v.size(); x += x & -x)
			v[x] += w;
	}
	ll ask(int x)
	{
		ll ans = 0;
		for (; x; x -= x & -x)
			ans += v[x];
		return ans;
	}
} T(N);
struct Seg
{
	int l, r, c;
	bool operator<(const Seg &rhs) const
	{
		return r < rhs.r;
	}
} p[N];
int n, k, a[N];
int main()
{
	scanf("%d %d", &n, &k);
	for (int i = 1; i <= n; i++)
		scanf("%d", &a[i]);
	for (int i = 1; i <= k; i++)
		scanf("%d%d%d", &p[i].l, &p[i].r, &p[i].c);
	sort(p + 1, p + k + 1);
	stack<int> zero;
	for (int i = 1, cur = 1; i <= n; i++)
	{
		if (a[i] == 0)
		{
			a[i] = -1;
			zero.push(i);
		}
		T.add(i, a[i]);
		while (p[cur].r < i && cur <= k)
			++cur;
		while (cur <= k && p[cur].r == i)
		{
			int tmp = T.ask(p[cur].r) - T.ask(p[cur].l - 1);
			for (; tmp < p[cur].c && !zero.empty(); tmp += 2)
			{
				a[zero.top()] = 1;
				T.add(zero.top(), 2);
				zero.pop();
			}
			if (tmp < p[cur].c)
				return ptintf("Impossible"), 0;
			++cur;
		}
	}
	for (int i = 1; i <= n; i++)
		printf("%d ", a[i]);
}
```
# [Lie Detector](https://vjudge.net/problem/Gym-102001I)
```cpp
#include <bits/stdc++.h>
using namespace std;
char s[127];
int n, ans;
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; ++i)
	{
		scanf("%s", s);
		ans ^= s[0] == 'L';
	}
	printf(ans ? "LIE" : "TRUTH");
}
```
# [Future Generation](https://vjudge.net/problem/Gym-102001J)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 5e6 + 7, M = 17, INF = 1e9 + 7;
struct Node
{
	char s[M];
	int id;
	bool operator<(const Node &rhs) const
	{
		int t = strcmp(s, rhs.s);
		return t ? t < 0 : id > rhs.id;
	}
} v[N];
char s[M], t[M];
int n, vs, sum[M];
void dfs(int k, int len, int id)
{
	if (!s[k])
	{
		if (len)
		{
			copy(t, t + len, v[vs].s);
			v[vs++].id = id;
		}
		return;
	}
	dfs(k + 1, len, id);
	t[len] = s[k];
	dfs(k + 1, len + 1, id);
}
int main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i)
	{
		scanf("%s", s);
		dfs(0, 0, i);
	}
	fill(sum + 1, sum + n + 1, -INF);
	sort(v, v + vs);
	for (int i = 0; i < vs; ++i)
		sum[v[i].id] = max(sum[v[i].id], sum[v[i].id - 1] + int(strlen(v[i].s)));
	printf("%d", max(-1, sum[n]));
}
```
# [Binary String](https://vjudge.net/problem/Gym-102001L)
```cpp
#include <bits/stdc++.h>
using namespace std;
bool cmp(const string &a, const string &b)
{
	if (a.size() != b.size())
		return a.size() < b.size();
	for (int i = a.size() - 1; ~i; --i)
		if (a[i] != b[i])
			return a[i] < b[i];
	return 0;
}
int main()
{
	long long k;
	string s, t;
	for (cin >> k >> s; k; k >>= 1)
		t.push_back('0' + k % 2);
	reverse(s.begin(), s.end());
	for (int i = k = 0; cmp(t, s); ++k)
	{
		for (i = s.size() - 2; i >= 0; --i)
			if (s[i] == '1')
			{
				s.erase(i, 1);
				break;
			}
		if (i < 0)
			s.erase(0, 1);
	}
	cout << k;
}
```
{% endraw %}