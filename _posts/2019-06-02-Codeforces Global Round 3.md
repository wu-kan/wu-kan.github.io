---
title: Codeforces Global Round 3
categories:
- ACM
- 题解
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

于是依次考虑保留第一段航班里从第$0,1,2,\ldots,k$号开始的航班，分别考虑第二段航班的时间即可。由于第二段航班的时间是随着第一段航班单调的，于是可以双指针维护。

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

实际上考虑第一种类型，实际上只要按a、b的降序贪心选择即可（假如当前的选不了，后面的一定都选不了）。

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

又是一道双指针，感觉像B、C两题的大杂烩。

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

假如有一个因子出现的次数多于k次，那么可以直接出结果。

否则，考虑构造第二种集合，即任意一点存在没有连边的另外一点。

如果存在一个点，其权值是质数，把他放进这个集合就好，因为这个质因子出现次数小于k次，必定存在一点无法到达它。后面考虑所有的权值都是合数的情况，选择最大素因子最大的k个（？）。

```autoit
6 3
18 75 245 847 1859 26
```

然而我又构造出了上面这组数据把这个做法Hack掉了…

我 Hack 我 自 己
![HACK](/public/image/2019-06-02-1.jpg)

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
