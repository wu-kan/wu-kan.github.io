---
title: 2019 Multi-University Training Contest 10
tags:
  - ACM
  - 题解
---

## [Valentine's Day](https://vjudge.net/problem/HDU-6693)

```cpp
#include <bits/stdc++.h>
#define maxn 10004
using namespace std;
double a[maxn];
int t, n;
int main(void)
{
	scanf("%d", &t);
	while (t--)
	{
		scanf("%d", &n);
		for (int i = 1; i <= n; i++)
			scanf("%lf", &a[i]);
		sort(a + 1, a + n + 1);
		double ans = a[n], b = a[n] / (1 - a[n]);
		int loc = n - 1;
		while (loc && b < 1)
		{
			ans *= (1 - a[loc] + a[loc] / b);
			b += a[loc] / (1 - a[loc]);
			loc--;
		}
		printf("%.10lf\n", ans);
	}
}
```

## [Welcome Party](https://vjudge.net/problem/HDU-6695)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 1e5 + 9;
pair<ll, ll> p[N];
ll t, n;
int main()
{
	for (scanf("%lld", &t); t--;)
	{
		scanf("%lld", &n);
		multiset<ll> s0, s1;
		for (ll i = 0; i < n; ++i)
			scanf("%lld%lld", &p[i].first, &p[i].second), s1.insert(p[i].second);
		sort(p, p + n);
		ll ans = 1e18;
		for (ll i = 0; i < n; ++i)
		{
			s1.erase(s1.find(p[i].second));
			ll val = 2e18;
			if (!s0.empty())
			{
				auto it0 = s0.lower_bound(p[i].first);
				if (it0 != s0.end())
				{
					val = *it0;
					if (it0 != s0.begin())
						if (abs(p[i].first - val) > abs(p[i].first - *--it0))
							val = *it0;
				}
				else
					val = *s0.rbegin();
			}
			if (!s1.empty())
			{
				val = max(val, *s1.rbegin());
				ans = min(ans, abs(p[i].first - *s1.rbegin()));
			}
			ans = min(ans, abs(p[i].first - val));
			s0.insert(p[i].second);
		}
		printf("%lld\n", ans);
	}
}
```

## [Block Breaker](https://vjudge.net/problem/HDU-6699)

```cpp
#include <bits/stdc++.h>
#define maxn 2047
using namespace std;
int ans, n, m, q, t, x, y;
bool ed[maxn][maxn];
inline bool check(int x, int y)
{
	return ed[x][y] && x != 0 && y != 0 && x != n + 1 && y != m + 1 && (!ed[x - 1][y] || !ed[x + 1][y]) && (!ed[x][y + 1] || !ed[x][y - 1]);
}
int qx[maxn * maxn], qy[maxn * maxn], l, r;
void bfs()
{
	l = 1, r = 0;
	qx[++r] = x, qy[r] = y;
	//ed[x][y]=0;
	while (l <= r)
	{
		int temx = qx[l], temy = qy[l];
		//	cout<<temx<<" "<<temy<<endl;
		ed[temx][temy] = 0;
		ans++;
		l++;
		if (check(temx, temy - 1))
			qx[++r] = temx, qy[r] = temy - 1, ed[temx][temy - 1] = 0;
		if (check(temx, temy + 1))
			qx[++r] = temx, qy[r] = temy + 1, ed[temx][temy + 1] = 0;
		if (check(temx - 1, temy))
			qx[++r] = temx - 1, qy[r] = temy, ed[temx - 1][temy] = 0;
		if (check(temx + 1, temy))
			qx[++r] = temx + 1, qy[r] = temy, ed[temx + 1][temy] = 0;
	}
}
int main(void)
{
	scanf("%d", &t);
	while (t--)
	{
		scanf("%d%d%d", &n, &m, &q);
		memset(ed, 1, sizeof(ed));
		while (q--)
		{
			scanf("%d%d", &x, &y);
			ans = 0;
			if (ed[x][y])
				bfs();
			printf("%d\n", ans);
		}
	}
}
```

## [Make Rounddog Happy](https://vjudge.net/problem/HDU-6701)

建立笛卡尔树，在每个区间上做启发式计算。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 3e5 + 9;
struct Node
{
	int val, lc, rc, ll, rr;
} tr[N];
int t, n, k;
ll dfs(int l, int r, int m)
{
	ll ans = 0;
	if (l > r)
		return ans;
	if (l == m && m == r)
	{
		if (tr[m].val - 1 <= k)
			++ans;
		return ans;
	}
	if (m - l < r - m)
	{
		for (int i = l; i <= m; ++i)
		{
			int up = min(tr[i].rr, r), lo = max(m, i + tr[m].val - k - 1);
			if (up >= lo)
				ans += up - lo + 1;
		}
	}
	else
	{
		for (int i = m; i <= r; ++i)
		{
			int lo = max(tr[i].ll, l), up = min(m, k + i + 1 - tr[m].val);
			if (up >= lo)
				ans += up - lo + 1;
		}
	}
	return ans + dfs(l, m - 1, tr[m].lc) + dfs(m + 1, r, tr[m].rc);
}
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &k);
		vector<int> stak, vis(n + 1, 0);
		for (int i = 0; i < n; ++i)
		{
			for (scanf("%d", &tr[i].val); !stak.empty() && tr[stak.back()].val < tr[i].val; stak.pop_back())
				tr[i].lc = stak.back();
			if (!stak.empty())
				tr[stak.back()].rc = i;
			stak.push_back(i);
		}
		for (int i = 0, j = 0; i < n; ++i)
		{
			for (; j < n && !vis[tr[j].val]; ++j)
				vis[tr[j].val] = 1;
			tr[i].rr = j - 1;
			vis[tr[i].val] = 0;
		}
		vis.assign(n + 1, 0);
		for (int i = n - 1, j = n - 1; i >= 0; --i)
		{
			for (; j >= 0 && !vis[tr[j].val]; --j)
				vis[tr[j].val] = 1;
			tr[i].ll = j + 1;
			vis[tr[i].val] = 0;
		}
		printf("%lld\n", dfs(0, n - 1, stak.front()));
	}
}
```
