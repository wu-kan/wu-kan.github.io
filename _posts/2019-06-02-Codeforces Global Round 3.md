---
redirect_from: /_posts/2019-06-02-Codeforces-Global-Round-3/
title: Codeforces Global Round 3
tags:
  - 算法竞赛
---

[官方题解](https://codeforces.com/blog/entry/67366)

## [Another One Bites The Dust](https://vjudge.net/problem/CodeForces-1148A)

```cpp
#include <bits/stdc++.h>
using namespace std;
unsigned a, b, c;
int main() { scanf("%u%u%u", &a, &b, &c), printf("%u", (min(a, b) + c) * 2 + (a != b)); }
```

## [Born This Way](https://vjudge.net/problem/CodeForces-1148B)

如果要在第一段的航班里面删，肯定是优先删起飞时间小的。如果要在第二段航班里面删，那么就是优先删**能够到达的航班里**起飞时间小的。

于是依次考虑保留第一段航班里从第$0,1,2,\dots,k$号开始的航班，分别考虑第二段航班的时间即可。由于第二段航班的时间是随着第一段航班单调的，于是可以双指针维护。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
int n, m, ta, tb, k, a[N], b[N];
int main()
{
	scanf("%d%d%d%d%d", &n, &m, &ta, &tb, &k);
	for (int i = 0; i < n; ++i)
		scanf("%d", &a[i]), a[i] += ta;
	for (int i = 0; i < m; ++i)
		scanf("%d", &b[i]);
	if (k >= n || k >= m)
		return printf("-1"), 0;
	for (int i = ta = 0, j = 0; i <= k; ++i)
	{
		while (j < m && b[j] < a[i])
			++j;
		if (j + k - i >= m)
			return printf("-1"), 0;
		ta = max(ta, b[j + k - i]);
	}
	printf("%d", ta + tb);
}
```

## [Crazy Diamond](https://vjudge.net/problem/CodeForces-1148C)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 3e5 + 9;
int n, p[N], a[N];
vector<pair<int, int>> ans;
bool ok(int x, int y) { return 2 * (y - x) >= n; }
void work(int x, int y) { ans.emplace_back(x, y), swap(a[p[x]], a[p[y]]), swap(p[x], p[y]); }
int main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i)
		scanf("%d", &p[i]), a[p[i]] = i;
	for (int i = 1; i <= n; ++i)
	{
		int x = i, y = a[i];
		if (x == y)
			continue;
		if (ok(x, y))
			work(x, y);
		else if (ok(1, x))
			work(1, x), work(1, y), work(1, x);
		else if (ok(y, n))
			work(y, n), work(x, n), work(y, n);
		else
			work(1, y), work(x, n), work(1, n), work(x, n), work(1, y);
	}
	printf("%d\n", ans.size());
	for (auto p : ans)
		printf("%d %d\n", p.first, p.second);
}
```

## [Dirty Deeds Done Dirt Cheap](https://vjudge.net/problem/CodeForces-1148D)

现场鬼迷心窍居然开始敲起了随机化…

实际上考虑第一种类型，实际上只要按 a、b 的降序贪心选择即可（假如当前的选不了，后面的一定都选不了）。

类型二取一个相反数就可以转成类型一。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef tuple<int, int, int> tiii;
void work(vector<tiii> &v)
{
	vector<tiii> tmp;
	sort(v.rbegin(), v.rend()), swap(tmp, v);
	for (auto t : tmp)
		if (v.empty() || get<0>(t) < get<1>(v.back()))
			v.push_back(t);
}
vector<tiii> v[2];
int n;
int main()
{
	scanf("%d", &n);
	for (int i = 1, a, b; i <= n; ++i)
	{
		scanf("%d%d", &a, &b);
		if (a < b)
			v[0].emplace_back(a, b, i);
		else if (a > b)
			v[1].emplace_back(-a, -b, i);
	}
	work(v[0]), work(v[1]);
	if (v[0].size() < v[1].size())
		swap(v[0], v[1]);
	printf("%d\n", v[0].size());
	for (auto t : v[0])
		printf("%d ", get<2>(t));
}
```

## [Earth Wind and Fire](https://vjudge.net/problem/CodeForces-1148E)

又是一道双指针，感觉像 B、C 两题的大杂烩。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 3e5 + 9;
vector<tuple<int, int, int>> ans;
tuple<int, int> a[N];
int n, b[N];
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; ++i)
		scanf("%d", &get<0>(a[i])), get<1>(a[i]) = i;
	sort(a, a + n);
	for (int i = 0; i < n; ++i)
		scanf("%d", &b[i]);
	sort(b, b + n);
	long long s = 0;
	for (int i = 0; i < n; ++i)
	{
		s += b[i] -= get<0>(a[i]);
		if (s < 0)
			return printf("NO"), 0;
	}
	if (s)
		return printf("NO"), 0;
	for (int i = 0, j = 0, d; i < n; ++i)
		while (b[i] > 0)
		{
			for (j = max(i + 1, j); b[j] >= 0;)
				++j;
			ans.emplace_back(get<1>(a[i]), get<1>(a[j]), d = min(b[i], -b[j]));
			b[i] -= d, b[j] += d;
		}
	printf("YES\n%d\n", ans.size());
	for (auto t : ans)
		printf("%d %d %d\n", get<0>(t) + 1, get<1>(t) + 1, get<2>(t));
}
```

## [Foo Fighters](https://vjudge.net/problem/CodeForces-1148F)

从高位到低位依次考虑，如果包含这一位上的权值加起来和总权值的符号相同，那么就把这一位反转并加入答案。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 3e5 + 9;
ll n, val[N], mask[N], s, ans;
int main()
{
	scanf("%d", &n);
	for (ll i = 0; i < n; ++i)
		scanf("%lld%lld", &val[i], &mask[i]), s += val[i];
	if (s < 0)
		for (ll i = 0; i < n; ++i)
			val[i] = -val[i];
	for (ll j = 1LL << 61; j; j >>= 1)
	{
		for (ll i = s = 0; i < n; ++i)
			if (mask[i] == j)
				s += val[i];
		if (s > 0)
		{
			ans |= j;
			for (ll i = 0; i < n; ++i)
				if (mask[i] & j)
					val[i] = -val[i];
		}
		for (ll i = 0; i < n; ++i)
			if (mask[i] & j)
				mask[i] ^= j;
	}
	printf("%lld\n", ans);
}
```

## [Gold Experience](https://vjudge.net/problem/CodeForces-1148G)

假如有一个因子出现的次数多于 k 次，那么可以直接出结果。

否则，考虑构造第二种集合，即任意一点存在没有连边的另外一点。

如果存在一个点，其权值是质数，把他放进这个集合就好，因为这个质因子出现次数小于 k 次，必定存在一点无法到达它。后面考虑所有的权值都是合数的情况，选择最大素因子最大的 k 个（？）。

```shell
6 3
18 75 245 847 1859 26
```

然而我又构造出了上面这组数据把这个做法 Hack 掉了…

![HACK]

我 Hack 我 自 己

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9, M = 1e7 + 9;
vector<int> d[int(sqrt(M))];
pair<int, int> a[N];
int n, k;
int main()
{
	scanf("%d%d", &n, &k);
	for (int i = 0; i < n; ++i)
	{
		scanf("%d", &a[i].first), a[i].second = i;
		for (int j = 2, e = a[i].first; j * j <= e; ++j)
			if (a[i].first % j == 0)
			{
				for (d[j].push_back(i); a[i].first % j == 0;)
					a[i].first /= j;
				if (d[j].size() == k)
				{
					for (auto t : d[j])
						printf("%d ", t + 1);
					return 0;
				}
			}
	}
	sort(a, a + n);
	for (int i = 0; i < k; ++i)
		printf("%d ", a[n - i - 1].second + 1);
}
```

[hack]: data:image/webp;base64,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
