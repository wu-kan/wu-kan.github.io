---
title: Bubble Cup 11 - Finals
categories: [ACM,题解]
date: 2019-02-16 18:00:00
---
{% raw %}
题不错，以后补…
# [Space Isaac](https://vjudge.net/problem/CodeForces-1045B)
如果一个数不能被表示那么它减去$a_i$仍然在$a$中。

假设这个数是$a_0+a_i$​ ，不难发现需要满足$a_0 + a_i = a_1 + a_{i-1} = a_2 + a_{i-2}\cdots$。差分之后相当于判两部分是不是回文。
```cpp
#include <bits/stdc++.h>
using namespace std;
struct Manacher : vector<int>
{
	Manacher(vector<int> a) : vector<int>((a.size() << 1) - 1, 0)
	{
		vector<int> b(size(), -1);
		for (int i = 0; i < a.size(); ++i)
			b[i << 1] = a[i];
		for (int i = 1, x = 0; i < size(); ++i)
		{
			if (i <= x + at(x))
				at(i) = min(at((x << 1) - i), x + at(x) - i);
			while (i - at(i) - 1 >= 0 && i + at(i) + 1 < size() && b[i - at(i) - 1] == b[i + at(i) + 1])
				++at(i);
			if (i + at(i) >= x + at(x))
				x = i;
		}
		for (int i = 0; i < size(); ++i)
			if (i - at(i) == 0 || i + at(i) == size() - 1)
				++at(i);
		for (int i = 0; i < size(); ++i)
			at(i) >>= 1;
	}
	bool isPalindrome(int l, int r) { return l == r || at(l + r - 1) >= r - l >> 1; }
};
int main()
{
	int n, m;
	scanf("%d %d", &n, &m);
	vector<int> a(n), b(n), ans;
	for (int i = 0; i < n; ++i)
		scanf("%d", &a[i]);
	for (int i = 0; i < n - 1; ++i)
		b[i] = a[i + 1] - a[i];
	b[n - 1] = (a[0] + m - a[n - 1]) % m;
	Manacher p(b);
	for (int i = 0; i < n; ++i)
		if (p.isPalindrome(0, i) && p.isPalindrome(i, n))
			ans.push_back((a[0] + a[i]) % m);
	sort(ans.begin(), ans.end());
	printf("%d\n", ans.size());
	for (auto i : ans)
		printf("%d ", i);
}
```
# [Interstellar battle](https://vjudge.net/problem/CodeForces-1045D)
```cpp

```
# [AI robots](https://vjudge.net/problem/CodeForces-1045G)
将输入按照r从大到小排序，这样对于排序后的每个机器人，只要它能看到前面的机器，前面的机器一定也可以看到他。

对每个q建立一棵线段树，需要对x离散化。同时需要动态建点以节省空间。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e5 + 7, NPOS = -1;
struct Node
{
	int x, r, q;
	bool operator<(const Node &rhs) const { return r > rhs.r; }
} v[N];
struct Ranker : vector<ll>
{
	void init() { sort(begin(), end()), resize(unique(begin(), end()) - begin()); }
	int ask(ll x) const { return lower_bound(begin(), end(), x) - begin(); }
} rk;
struct SegmentTree
{
	struct Node
	{
		int l, r, lc, rc;
		ll sum;
	};
	vector<Node> v;
	SegmentTree() : v{{0, rk.size(), NPOS, NPOS, 0}} {}
	void add(int pos, ll val, int rt = 0)
	{
		v[rt].sum += val;
		if (pos <= v[rt].l && v[rt].r <= pos)
			return;
		int m = v[rt].l + v[rt].r >> 1;
		if (m >= pos)
		{
			if (v[rt].lc == NPOS)
			{
				v[rt].lc = v.size();
				v.push_back({v[rt].l, m, NPOS, NPOS, 0});
			}
			add(pos, val, v[rt].lc);
		}
		if (m < pos)
		{
			if (v[rt].rc == NPOS)
			{
				v[rt].rc = v.size();
				v.push_back({m + 1, v[rt].r, NPOS, NPOS, 0});
			}
			add(pos, val, v[rt].rc);
		}
	}
	ll ask(int l, int r, int rt = 0)
	{
		if (rt == NPOS)
			return 0;
		if (l <= v[rt].l && v[rt].r <= r)
			return v[rt].sum;
		int m = v[rt].l + v[rt].r >> 1;
		if (m >= r)
			return ask(l, r, v[rt].lc);
		if (m < l)
			return ask(l, r, v[rt].rc);
		return ask(l, m, v[rt].lc) + ask(m + 1, r, v[rt].rc);
	}
};
unordered_map<int, SegmentTree> mp;
int n, k;
int main()
{
	scanf("%d%d", &n, &k);
	for (int i = 0; i < n; ++i)
	{
		scanf("%d%d%d", &v[i].x, &v[i].r, &v[i].q);
		rk.push_back(v[i].x);
		rk.push_back(v[i].x - v[i].r);
		rk.push_back(v[i].x + v[i].r);
	}
	rk.init();
	ll ans = 0;
	sort(v, v + n);
	for (int i = 0; i < n; ++i)
	{
		for (int j = v[i].q - k; j <= v[i].q + k; ++j)
			if (mp.count(j))
				ans += mp[j].ask(rk.ask(v[i].x - v[i].r), rk.ask(v[i].x + v[i].r));
		mp[v[i].q].add(rk.ask(v[i].x), 1);
	}
	printf("%lld", ans);
}
```
## 一开始的奇思妙想
把Fenwick建在map上，这样离散化也省了。可惜还是MLE了。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e5 + 7, M = 1e9 + 7;
struct Node
{
	int x, r, q;
	bool operator<(const Node &rhs) const
	{
		return r > rhs.r;
	}
} v[N];
struct Fenwick
{
	unordered_map<int, ll> v;
	void add(int x, ll val)
	{
		for (; x < M; x += x & -x)
			v[x] += val;
	}
	ll ask(int x)
	{
		ll r = 0;
		for (; x; x -= x & -x)
			r += v[x];
		return r;
	}
	ll ask(int l, int r)
	{
		return ask(r) - ask(l - 1);
	}
};
unordered_map<ll, Fenwick> mp;
int n, k;
int main()
{
	scanf("%d%d", &n, &k);
	for (int i = 0; i < n; ++i)
		scanf("%d%d%d", &v[i].x, &v[i].r, &v[i].q);
	sort(v, v + n);
	ll ans = 0;
	for (int i = 0; i < n; ++i)
	{
		for (int j = v[i].q - k; j <= v[i].q + k; ++j)
			if (mp.count(j))
				ans += mp[j].ask(max(v[i].x - v[i].r, 0) + 1, min(v[i].x + v[i].r, int(1e9)) + 1);
		mp[v[i].q].add(v[i].x + 1, 1);
	}
	printf("%lld", ans);
}
```
# [Self-exploration](https://vjudge.net/problem/CodeForces-1045H)
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e5 + 7;
struct Mod
{
	const ll M;
	Mod(ll M) : M(M) {}
	ll mul(ll a, ll b) const { return a * b % M; }
};
struct Factorial : Mod
{
	vector<ll> fac, ifac;
	Factorial(int N, ll M) : fac(N, 1), ifac(N, 1), Mod(M)
	{
		for (int i = 2; i < N; ++i)
			fac[i] = mul(fac[i - 1], i), ifac[i] = mul(M - M / i, ifac[M % i]);
		for (int i = 2; i < N; ++i)
			ifac[i] = mul(ifac[i], ifac[i - 1]);
	}
	ll c(int n, int m)
	{
		return m < 0 ? n == m : mul(mul(fac[n], ifac[m]), ifac[n - m]);
	}
} f(N << 1, 1e9 + 7);
ll cal(char a[], vector<int> c)
{
	int l = strlen(a), sum = c[0] + c[1] + c[2] + c[3];
	if (c[2] > c[1] + 1 || c[2] < c[1] || l < sum + 1)
		return 0;
	if (l > sum + 1)
		return f.mul(f.c(c[1] + c[3], c[1]), f.c(c[0] + c[2] - 1, c[2] - 1));
	ll ans = 0;
	for (int i = 1; a[i]; ++i)
	{
		int now = (a[i - 1] - '0' << 1) + a[i] - '0';
		if (a[i] != '0' && c[now - 1])
		{
			--c[now - 1];
			ans = (ans + f.mul(f.c(c[1] + c[3] - 1, c[1] - 1), f.c(c[0] + c[2], c[2]))) % f.M;
			++c[now - 1];
		}
		if (--c[now] < 0)
			break;
	}
	return ans;
}
ll check(char a[], vector<int> c)
{
	int l = strlen(a), sum = c[0] + c[1] + c[2] + c[3];
	if (c[2] > c[1] + 1 || c[2] < c[1] || l != sum + 1)
		return 0;
	for (int i = 1; a[i]; ++i)
		if (--c[(a[i - 1] - '0' << 1) + a[i] - '0'] < 0)
			return 0;
	return 1;
}
char s[2][N];
vector<int> c(4);
int main()
{
	scanf("%s%s%d%d%d%d", s[0], s[1], &c[0], &c[1], &c[2], &c[3]);
	printf("%lld", ((cal(s[1], c) - cal(s[0], c) + check(s[1], c)) % f.M + f.M) % f.M);
}
```
# [Palindrome Pairs](https://vjudge.net/problem/CodeForces-1045I)
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
unordered_map<ll, ll> mp;
char s[1000009];
ll m, n;
int main()
{
	for (scanf("%lld", &n); n--;)
	{
		scanf("%s", s);
		for (int i = m = 0; s[i]; ++i)
			m ^= 1 << s[i] - 'a';
		++mp[m];
	}
	m = 0;
	for (auto it : mp)
	{
		m += it.second * (it.second - 1);
		for (int i = 1 << 25; i; i >>= 1)
			if (mp.count(it.first ^ i))
				m += it.second * mp[it.first ^ i];
	}
	printf("%lld", m >> 1);
}
```
{% endraw %}