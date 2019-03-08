---
title: 2015-2016 Petrozavodsk Winter Training Camp, Nizhny Novgorod SU Contest
categories:
  - ACM
  - 题解
date: 2019-03-03 18:00:00
---
# [Forcefield](https://vjudge.net/problem/Gym-100960B)
{% raw %}
```cpp
#include <bits/stdc++.h>
using namespace std;
const int INF = 1e9 + 7;
set<int> s[2]{{0, INF}, {0, INF}};
int n, now, ans;
int main()
{
	scanf("%d%d", &n, &now);
	for (int i = 0, x, p; i < n; ++i)
		scanf("%d%d", &x, &p), s[p & 1].insert(x);
	for (int rev = 0;; rev ^= 1)
	{
		if (rev)
		{
			int pos = *s[1].upper_bound(now);
			if (pos == INF)
			{
				if (s[0].size() != 2 || s[1].size() != 2)
					ans = -1;
				break;
			}
			s[1].erase(now = pos);
		}
		else
		{
			int pos = *--s[0].lower_bound(now);
			if (pos)
				s[0].erase(pos);
			else
				++ans;
			now = pos;
		}
	}
	printf("%d", ans);
}
```
{% endraw %}
# [Missing Part](https://vjudge.net/problem/Gym-100960C)
给你一个串S，这个S是环状的，给你另外一个字符串S1，然后你需要定义一种大写的ABCDE到小写的abcde对应关系，使得失配数最小。

假设只有两种字符，那么1个卷积就行了。5个字符，最莽的做法是120个卷积，那得超时，预处理一下就是25个卷积。卷积当然要FFT啦。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
typedef double lf;
const int N = 65535;
const lf PI = acos(-1);
struct Rader : vector<int>
{
	Rader(int n) : vector<int>(1 << int(ceil(log2(n))))
	{
		for (int i = at(0) = 0; i < size(); ++i)
			if (at(i) = at(i >> 1) >> 1, i & 1)
				at(i) += size() >> 1;
	}
};
struct FFT : Rader
{
	vector<complex<lf>> w;
	FFT(int n) : Rader(n), w(size(), polar(1.0, 2 * PI / size()))
	{
		w[0] = 1;
		for (int i = 1; i < size(); ++i)
			w[i] *= w[i - 1];
	}
	vector<complex<lf>> fft(const vector<complex<lf>> &a)
	{
		vector<complex<lf>> x(size());
		for (int i = 0; i < a.size(); ++i)
			x[at(i)] = a[i];
		for (int i = 1; i < size(); i <<= 1)
			for (int j = 0; j < i; ++j)
				for (int k = j; k < size(); k += i << 1)
				{
					complex<lf> &l = x[k], &r = x[k + i], t = w[size() / (i << 1) * j] * r;
					r = l - t, l += t;
				}
		return x;
	}
	vector<ll> mul(vector<complex<lf>> xa, const vector<complex<lf>> &xb)
	{
		for (int i = 0; i < size(); ++i)
			xa[i] *= xb[i];
		vector<ll> ans(size());
		xa = fft(xa), ans[0] = xa[0].real() / size() + 0.5;
		for (int i = 1; i < size(); ++i)
			ans[i] = xa[size() - i].real() / size() + 0.5;
		return ans;
	}
};
char a[N], b[N];
int main()
{
	scanf("%s%s", a, b);
	int n = strlen(a), ans = 0, p[5];
	FFT f(n * 2);
	vector<ll> sum[5][5];
	vector<vector<complex<lf>>> xa(5, vector<complex<lf>>(n * 2)), xb(5, vector<complex<lf>>(n * 2));
	for (int i = 0; i < 5; ++i)
	{
		for (int j = 0; j < n; ++j)
		{
			if (a[j] == 'A' + i)
				xa[i][j] = xa[i][j + n] = 1;
			if (b[j] == 'a' + i)
				xb[i][n - j - 1] = 1;
		}
		xa[i] = f.fft(xa[i]), xb[i] = f.fft(xb[i]), p[i] = i;
	}
	for (int i = 0; i < 5; ++i)
		for (int j = 0; j < 5; ++j)
			sum[i][j] = f.mul(xa[i], xb[j]);
	do
		for (int j = 0, tmp; j < n * 2; ++j)
		{
			for (int i = tmp = 0; i < 5; ++i)
				tmp += sum[i][p[i]][j];
			ans = max(ans, tmp);
		}
	while (next_permutation(p, p + 5));
	printf("%d", n - ans);
}
```
# [Cryptographic Argument](https://vjudge.net/problem/Gym-100960E)
折纸的过程就是蝴蝶变换。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll M = 1e9 + 7;
struct Rader : vector<int>
{
	Rader(int n) : vector<int>(1 << int(ceil(log2(n))))
	{
		for (int i = at(0) = 0; i < size(); ++i)
			if (at(i) = at(i >> 1) >> 1, i & 1)
				at(i) += size() >> 1;
	}
} rev0(1), rev1(1);
ll h, k, m, l, r, a, b, c;
ll ask(ll u)
{
	ll p = u >> (k >> 1) + 1, q = p << (k >> 1) ^ u >> 1;
	p = rev1[p], q = rev0[q];
	if (u & 1)
		p ^= rev1.size() - 1, q ^= rev0.size() - 1;
	return (q * rev1.size() | p) << 1 | u & 1;
}
int main()
{
	scanf("%lld%lld%lld%lld%lld%lld%lld", &k, &m, &l, &r, &a, &b, &c);
	rev0 = Rader(1 << (k >> 1)), rev1 = Rader(1 << k - (k >> 1) - 1);
	for (ll i = 0, n = 1LL << k; i < m; ++i)
	{
		if (l & 1)
		{
			if (r & 1)
				h ^= (r - l >> 1) * (n - 1) + ask(l);
			else
				h ^= (r - l - 1 >> 1) * (n - 1) + ask(l) + ask(r);
		}
		else
		{
			if (r & 1)
				h ^= (r - l + 1 >> 1 & 1) * (n - 1);
			else
				h ^= (r - l >> 1 & 1) * (n - 1) ^ ask(r);
		}
		h = ((l ^ r ^ h) + c) % M;
		l = (l ^ a ^ h) % (n + 1) % n;
		r = (r ^ b ^ h) % (n - l) + l;
	}
	printf("%lld", h);
}
```
# [The Jedi Killer](https://vjudge.net/problem/Gym-100960F)
28、29行的`EPS`不能用`sgn`去掉，暂时不知道为啥…改了之后WA4（猜测是浮点数做减法的时候的对齐操作丢了精度）。

启示是浮点数比较大小的时候不能作差判`sgn`…
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
# [Youngling Tournament](https://vjudge.net/problem/Gym-100960G)
给你n个数，然后从大到小排序，如果这个数不小于他后面的数的和，那么这个数就是胜利者。

单点修改，问你每次胜利者有多少个。

树状数组+`multiset`瞎几把做即可。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e5 + 7;
struct BaseFenwick
{
	vector<ll> v;
	BaseFenwick(int n) : v(n, 0) {}
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
};
struct Ranker : vector<ll>
{
	void init() { sort(begin(), end()), resize(unique(begin(), end()) - begin()); }
	int ask(ll x) const { return lower_bound(begin(), end(), x) - begin(); }
} rk;
ll n, m, a[N], b[N], c[N];
int main()
{
	scanf("%lld", &n);
	for (int i = 1; i <= n; ++i)
		scanf("%lld", &a[i]), rk.push_back(a[i]);
	scanf("%lld", &m);
	for (int i = 0; i < m; ++i)
		scanf("%lld%lld", &b[i], &c[i]), rk.push_back(c[i]);
	rk.init();
	multiset<ll> s;
	BaseFenwick t(rk.size() + 1);
	for (int i = 1; i <= n; ++i)
		s.insert(a[i]), t.add(rk.ask(a[i]) + 1, a[i]);
	for (int i = 0;; ++i)
	{
		int res = 1;
		multiset<ll>::iterator p = s.begin(), q = p++;
		if (*p == *q)
			++res;
		while (1)
		{
			p = s.lower_bound(t.ask(rk.ask(*q) + 1));
			if (p == s.begin())
				++p;
			if (p == s.end())
				break;
			q = p--;
			if (*q >= t.ask(rk.ask(*p) + 1))
				++res;
		}
		printf("%d\n", res);
		if (i == m)
			break;
		s.erase(s.find(a[b[i]]));
		t.add(rk.ask(a[b[i]]) + 1, -a[b[i]]);
		s.insert(a[b[i]] = c[i]);
		t.add(rk.ask(a[b[i]]) + 1, a[b[i]]);
	}
}
```
# [Garland Checking](https://vjudge.net/problem/Gym-100960H)
不做路径压缩的并查集，增加一个splay操作，用于把某个点旋转到并查集的顶点。

正解是LCT…待学习。
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
	void splay(int u, int f)
	{
		if (fa[u] != u)
			splay(fa[u], u);
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
		scanf("%d%d", &a, &b), ufs.splay(a, a), ufs.splay(b, b);
		if (s[0] == 'T')
			printf(ufs.ask(a) == b ? "YES\n" : "NO\n"), fflush(stdout);
		else
			ufs.fa[a] = s[0] == 'D' ? a : b;
	}
}
```
