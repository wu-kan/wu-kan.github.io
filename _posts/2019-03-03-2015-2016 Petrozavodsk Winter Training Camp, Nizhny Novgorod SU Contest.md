---
title: 2015-2016 Petrozavodsk Winter Training Camp, Nizhny Novgorod SU Contest
categories:
  - ACM
  - 题解
date: 2019-03-03 18:00:00
---
# [Forcefield](https://vjudge.net/problem/Gym-100960B)
```cpp
#include <bits/stdc++.h>
using namespace std;
int n, cur, x, p, ans;
set<int> L, R;
int main()
{
	scanf("%d%d", &n, &cur);
	for (int i = 1; i <= n; i++)
	{
		scanf("%d%d", &x, &p);
		if (p == 0)
		{
			L.insert(x);
		}
		else
		{
			R.insert(x);
		}
	}
	int dir = 1;
	while (1)
	{
		if (dir == 1)
		{
			if (L.size() == 0)
			{
				dir = 0;
				cur = 0;
				ans++;
				continue;
			}

			auto it = L.lower_bound(cur);
			if (it == L.begin())
			{
				ans++;
				cur = 0;
			}
			else
			{
				it--;
				cur = *it;
				L.erase(it);
			}
			dir = 0;
		}
		else if (dir == 0)
		{
			auto it = R.lower_bound(cur);
			if (it == R.end())
			{
				break;
			}
			else
			{
				cur = *it;
				R.erase(it);
			}
			dir = 1;
		}
	}
	if (!L.size() && !R.size())
	{
		cout << ans << endl;
	}
	else
		cout << -1 << endl;
}
```
# [The Jedi Killer](https://vjudge.net/problem/Gym-100960F)
28、29行的`EPS`不能用`sgn`去掉，暂时不知道为啥…改了之后WA4。
```cpp
#include <bits/stdc++.h>
#define X real()
#define Y imag()
using namespace std;
typedef double lf;
typedef complex<lf> Coord;
const lf EPS = 1e-9;
int sgn(lf d) { return (d > EPS) - (d < -EPS); }
lf Cross(const Coord &A, const Coord &B) { return A.X * B.Y - B.X * A.Y; }
int main()
{
	int t, lm, lg, ans;
	for (scanf("%d", &t); t--; printf(ans ? "YES\n" : "NO\n"))
	{
		scanf("%d%d", &lm, &lg);
		vector<Coord> p;
		for (int i = 0, x, y; i < 3; ++i)
			scanf("%d%d", &x, &y), p.emplace_back(x, y);
		if (!sgn(Cross(p[0] - p[1], p[1] - p[2])))
			ans = sgn(max(max(abs(p[0] - p[1]), abs(p[1] - p[2])), abs(p[2] - p[0])) - max(lm, lg * 2)) <= 0;
		else
			for (int i = ans = 0; !ans && i < 3; ++i)
			{
				lf d0 = abs(p[(i + 1) % 3] - p[(i + 2) % 3]),
				   h = fabs(Cross(p[(i + 1) % 3] - p[i], p[(i + 2) % 3] - p[i]) / d0),
				   d1 = sqrt(norm(p[i] - p[(i + 1) % 3]) - h * h),
				   d2 = sqrt(norm(p[i] - p[(i + 2) % 3]) - h * h);
				ans = sgn(h - lm) <= 0 && max(d1, d2) <= lg + EPS ||
					  sgn(h - lg) <= 0 && max(d1, d2) <= lm + EPS &&
						  sgn(h * h + d0 * d0 - max(norm(p[i] - p[(i + 1) % 3]), norm(p[i] - p[(i + 2) % 3]))) <= 0;
			}
	}
}
```
# [Garland Checking](https://vjudge.net/problem/Gym-100960H)
不做路径压缩的并查集，增加一个旋转操作，用于把某个点旋转到并查集的顶点。
```cpp
#include <bits/stdc++.h>
using namespace std;
struct UnionFindSet
{
	vector<int> fa;
	UnionFindSet(int n) : fa(n)
	{
		for (int i = 0; i < n; ++i)
			fa[i] = i;
	}
	void rotate(int u, int f)
	{
		if (fa[u] != u)
			rotate(fa[u], u);
		fa[u] = f;
	}
	int ask(int u) { return fa[u] != u ? ask(fa[u]) : u; }
};
char s[9];
int n, a, b;
int main()
{
	scanf("%d", &n);
	for (UnionFindSet ufs(n + 1); ~scanf("%s", s) && s[0] != 'E';)
	{
		scanf("%d%d", &a, &b), ufs.rotate(a, a), ufs.rotate(b, b);
		if (s[0] == 'C')
			ufs.fa[a] = b;
		else if (s[0] == 'D')
			ufs.fa[a] = a;
		else
			printf(ufs.ask(a) == b ? "YES\n" : "NO\n"), fflush(stdout);
	}
}
```
