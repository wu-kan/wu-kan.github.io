---
title: 2018-2019 ACM-ICPC, China Multi-Provincial Collegiate Programming Contest
categories:
- ACM
- 题解
---
## [Maximum Element In A Stack](https://vjudge.net/problem/Gym-102222A)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef unsigned int uni;
typedef unsigned long long llu;
int t, n, p, q, m, kase;
uni SA, SB, SC;
unsigned int rng61()
{
	SA ^= SA << 16;
	SA ^= SA >> 5;
	SA ^= SA << 1;
	unsigned int t = SA;
	SA = SB;
	SB = SC;
	SC ^= t ^ SA;
	return SC;
}
const int N = 5e6 + 9;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d%d%d%u%u%u", &n, &p, &q, &m, &SA, &SB, &SC);
		vector<pair<int, int>> vs, ms;
		llu ans = 0;
		for (llu i = 1; i <= n; ++i)
		{
			if (rng61() % (p + q) < p)
			{
				vs.emplace_back(rng61() % m + 1, i);
				if (ms.empty() || vs.back() > ms.back())
					ms.push_back(vs.back());
			}
			else if (!vs.empty())
			{
				if (ms.back().second == vs.back().second)
					ms.pop_back();
				vs.pop_back();
			}
			if (!ms.empty())
				ans ^= i * ms.back().first;
		}
		printf("Case #%d: %llu\n", ++kase, ans);
	}
}
```

## [Rolling The Polygon](https://vjudge.net/problem/Gym-102222B)

```cpp
#include <bits/stdc++.h>
using namespace std;
struct Point
{
	double x, y;
} p[2000];
int n, t;
double qa, qb;
int main(void)
{
	cin >> t;
	for (int i = 1; i <= t; i++)
	{
		cin >> n;
		double ans = 0;
		for (int i = 0; i < n; i++)
			cin >> p[i].x >> p[i].y;
		cin >> qa >> qb;
		for (int i = 0; i < n; i++)
		{
			double dis = sqrt((qa - p[i].x) * (qa - p[i].x) + (qb - p[i].y) * (qb - p[i].y));
			double arc = acos(((p[i].x - p[(i + n - 1) % n].x) * (p[(i + 1) % n].x - p[i].x) + (p[i].y - p[(i + n - 1) % n].y) * (p[(i + 1) % n].y - p[i].y)) / sqrt((p[i].x - p[(i + n - 1) % n].x) * (p[i].x - p[(i + n - 1) % n].x) + (p[i].y - p[(i + n - 1) % n].y) * (p[i].y - p[(i + n - 1) % n].y)) / sqrt((p[(i + 1) % n].x - p[i].x) * (p[(i + 1) % n].x - p[i].x) + (p[(i + 1) % n].y - p[i].y) * (p[(i + 1) % n].y - p[i].y)));
			ans += dis * arc;
		}
		printf("Case #%d: %.3f\n", i, ans);
	}
}
```

## [Caesar Cipher](https://vjudge.net/problem/Gym-102222C)

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
int t, n, m, q;
char s[100], s2[100], s3[100];
int main(void)
{
	cin >> t;
	for (int i = 1; i <= t; i++)
	{
		cin >> n >> m;
		cin >> s >> s2 >> s3;
		q = (s2[0] - s[0] + 26) % 26;
		for (int i = 0; i < m; i++)
			s3[i] = (s3[i] - q - 'A' + 26) % 26 + 'A';
		cout << "Case #" << i << ": " << s3 << "\n";
	}
}
```

## [Take Your Seat](https://vjudge.net/problem/Gym-102222D)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 127;
double f[N] = {0, 1}, g[N];
int main()
{
	for (int i = 2; i <= 50; ++i)
	{
		for (int j = 1; j < i; ++j)
			f[i] += f[j];
		f[i] /= i;
	}
	for (int i = 1; i <= 50; ++i)
	{
		for (int j = 1; j <= i; ++j)
			g[i] += f[j];
		g[i] /= i;
	}
	int t, n, m;
	scanf("%d", &t);
	for (int i = 1; i <= t; ++i)
	{
		scanf("%d%d", &n, &m);
		printf("Case #%d: %.6f %.6f\n", i, f[n], g[m]);
	}
}
```

## [Moving On](https://vjudge.net/problem/Gym-102222F)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
const int N = 255;
typedef array<array<ll, N>, N> Matrix;
pair<ll, int> p[N];
void floyed(Matrix &f, int n, int pos, int &k)
{
	for (; k < n; ++k)
	{
		if (p[k] > p[pos])
			break;
		for (int i = 0; i < n; ++i)
			for (int j = 0; j < n; ++j)
				f[i][j] = min(f[i][j], f[i][p[k].second] + f[p[k].second][j]);
	}
}
Matrix f[N];
int t, n, q, kase;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &q);
		for (int i = 0; i < n; ++i)
			scanf("%d", &p[i].first), p[i].second = i;
		sort(p, p + n);
		for (int i = 0; i < n; ++i)
			for (int j = 0; j < n; ++j)
				scanf("%d", &f[0][i][j]);
		for (int i = 0, k = 0; i < n; ++i)
			floyed(f[i + 1] = f[i], n, i, k);
		printf("Case #%d:\n", ++kase);
		for (int i = 0, u, v, w; i < q; ++i)
		{
			scanf("%d%d%d", &u, &v, &w);
			printf("%d\n", f[upper_bound(p, p + n, make_pair(w, n)) - p][u - 1][v - 1]);
		}
	}
}
```

## [Fight Against Monsters](https://vjudge.net/problem/Gym-102222H)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
int t, kase, n;
void cal(int &x)
{
	for (int i = max((int)sqrt(x << 1) - 3, 1);; ++i)
		if (i * (i + 1) / 2 >= x)
		{
			x = i;
			return;
		}
}
bool cmp(const pair<int, int> &lhs, const pair<int, int> &rhs)
{
	return 1LL * lhs.first * rhs.second < 1LL * lhs.second * rhs.first;
}
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		vector<pair<int, int>> v(n);
		vector<ll> sum(n + 1, 0);
		for (int i = 0; i < n; ++i)
		{
			scanf("%d%d", &v[i].second, &v[i].first);
			cal(v[i].second);
		}
		sort(v.begin(), v.end(), cmp);
		for (int i = 0; i < v.size(); ++i)
			sum[i + 1] = sum[i] + v[i].first;
		ll ans = 0;
		for (int i = v.size() - 1; ~i; --i)
			ans += sum[i + 1] * v[i].second;
		printf("Case #%d: %lld\n", ++kase, ans);
	}
}
```
