---
title: "Codeforces Round #566 (Div. 2)"
tags:
  - ACM
  - 题解
---
[官方题解](https://codeforces.com/blog/entry/67614)

## [Filling Shapes](https://vjudge.net/problem/CodeForces-1182A)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 99;
long long n, f[N] = {0, 0, 2, 0, 4};
int main()
{
	scanf("%lld", &n);
	for (int i = 5; i <= n; ++i)
		f[i] = f[i - 2] * 2;
	printf("%lld", f[n]);
}
```

## [Plus from Picture](https://vjudge.net/problem/CodeForces-1182B)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 511;
char s[N][N];
int h, w, sh[N], sw[N], xh = -1, xw = -1, sa;
int main()
{
	scanf("%d%d", &h, &w);
	for (int i = 0; i < h; ++i)
	{
		scanf("%s", s[i]);
		for (int j = 0; j < w; ++j)
			if (s[i][j] == '*')
			{
				if (++sh[i] > 1)
				{
					if (xh >= 0 && xh != i)
						return puts("NO"), 0;
					xh = i;
				}
				if (++sw[j] > 1)
				{
					if (xw >= 0 && xw != j)
						return puts("NO"), 0;
					xw = j;
				}
				++sa;
			}
	}
	if (xh < 0 || xw < 0 || sw[xw] + sh[xh] - 1 < sa)
		return puts("NO"), 0;
	int lh = xh, rh = xh, lw = xw, rw = xw;
	while (lh >= 0 && s[lh][xw] == '*')
		--lh;
	while (rh < h && s[rh][xw] == '*')
		++rh;
	while (lw >= 0 && s[xh][lw] == '*')
		--lw;
	while (rw < w && s[xh][rw] == '*')
		++rw;
	if (++lh == xh || --rh == xh || ++lw == xw || --rw == xw)
		return puts("NO"), 0;
	puts(rh - lh + 1 == sw[xw] && rw - lw + 1 == sh[xh] ? "YES" : "NO");
}
```

## [Beautiful Lyrics](https://vjudge.net/problem/CodeForces-1182C)

好恶心的模拟啊。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;
char s[2 * N], las[N];
int n, st[N], num[N];
vector<pair<int, int>> fiv, sev;
unordered_map<int, unordered_map<char, int>> mp;
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; ++i)
	{
		char *ss = s + st[i];
		scanf("%s", ss);
		st[i + 1] = ss + strlen(ss) + 1 - s;
		for (int j = 0; ss[j]; ++j)
			if (ss[j] == 'a' || ss[j] == 'e' || ss[j] == 'o' || ss[j] == 'i' || ss[j] == 'u')
			{
				++num[i];
				las[i] = ss[j];
			}
		if (mp[num[i]].count(las[i]))
		{
			sev.emplace_back(mp[num[i]][las[i]], i);
			mp[num[i]].erase(las[i]);
		}
		else
			mp[num[i]][las[i]] = i;
	}
	for (unordered_map<int, unordered_map<char, int>>::iterator it = mp.begin(); it != mp.end(); ++it)
	{
		int pre = -1;
		for (auto p : it->second)
		{
			if (pre < 0)
				pre = p.second;
			else
			{
				fiv.emplace_back(p.second, pre);
				pre = -1;
			}
		}
	}
	while (sev.size() > fiv.size())
	{
		fiv.push_back(sev.back());
		sev.pop_back();
	}
	printf("%d\n", sev.size());
	while (!sev.empty())
	{
		printf("%s %s\n%s %s\n", s + st[fiv.back().first], s + st[sev.back().first], s + st[fiv.back().second], s + st[sev.back().second]);
		sev.pop_back();
		fiv.pop_back();
	}
}
```

## [Complete Mirror](https://vjudge.net/problem/CodeForces-1182D)

```cpp

```

## [Product Oriented Recurrence](https://vjudge.net/problem/CodeForces-1182E)

就差五分钟就打完了啊！！！早知道不看D了…

$f_{x} = c^{2x-6} \cdot f_{x-1} \cdot f_{x-2} \cdot f_{x-3}$，变形得

$c^x\cdot f_x=c^{x-1}\cdot f_{x-1}\cdot c^{x-2}\cdot f_{x-2}\cdot c^{x-3}\cdot f_{x-3}$

记$g(x)=\ln (c^x\cdot f_x)$，则$g(x)=g(x-1)+g(x-2)+g(x-3)=A\cdot g(1)+B\cdot g(2)+C\cdot g(3)$，其中A，B，C可以用矩阵快速幂在对数的时间内求出来。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Mod
{
	const ll M, SM;
	Mod(ll M) : M(M), SM(sqrt(M) + 0.5) {}
	ll &qadd(ll &a, ll b) const { return a += b, a < M ? a : (a -= M); } //假如a和b都已经在同余系内，就不必取模了，取模运算耗时很高
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }		 //考虑a和b不在同余系内甚至为负数的情况
	ll mul(ll a, ll b) const { return add(a * b, M); }
	/*
	ll mul(ll a, ll b) const //无循环快速计算同余乘法，根据a*b是否爆ll替换a*b%M，需要a<M且b<M，可以调用时手动取模
	{
		ll c = a / SM, d = b / SM;
		a %= SM, b %= SM;
		ll e = add(add(a * d, b * c), c * d / SM * (SM * SM - M));
		return add(add(a * b, e % SM * SM), add(c * d % SM, e / SM) * (SM * SM - M));
	}*/
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a = add(a, M); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
	ll inv(ll a) const { return pow(a, M - 2); } //要求M为素数
	/*
	ll inv(ll a) const							 //模m下a的乘法逆元，不存在返回-1（m为素数时a不为0必有逆元）
	{
		ll x, y, d = gcd(a, M, x, y);
		return d == 1 ? add(x, M) : -1; //return pow(a, phi(M) - 1);
	}
	vector<ll> sol(ll a, ll b) const //解同余方程，返回ax=b(mod M)循环节内所有解
	{
		vector<ll> ans;
		ll x, y, d = gcd(a, M, x, y);
		if (b % d)
			return ans;
		ans.push_back(mul((b / d) % (M / d), x));
		for (ll i = 1; i < d; ++i)
			ans.push_back(add(ans.back(), M / d));
		return ans;
	}
	*/
	ll log(ll a, ll b) const
	{
		unordered_map<ll, ll> x;
		for (ll i = 0, e = 1; i <= SM; ++i, e = mul(e, a))
			if (!x.count(e))
				x[e] = i;
		for (ll i = 0, v = inv(pow(a, SM)); i <= SM; ++i, b = mul(b, v))
			if (x.count(b))
				return i * SM + x[b];
		return -1;
	}
} M(1e9 + 7), M1(1e9 + 6);
const int N = 5;
struct Matrix
{
	static int n; //方阵代替矩阵
	ll a[N][N];
	Matrix(ll k = 0)
	{
		for (int i = 0; i < n; ++i)
			fill(a[i], a[i] + n, 0), a[i][i] = k;
	}
	friend Matrix operator*(const Matrix &a, const Matrix &b)
	{
		Matrix r(0);
		for (int i = 0; i < r.n; ++i)
			for (int k = 0; k < r.n; ++k)
				for (int j = 0; j < r.n; ++j)
					M1.qadd(r.a[i][j], M1.mul(a.a[i][k], b.a[k][j]));
		return r;
	}
	friend Matrix pow(Matrix a, ll b)
	{
		Matrix r(1);
		for (; b; b >>= 1, a = a * a)
			if (b & 1)
				r = r * a;
		return r;
	}
} mat;
int Matrix::n = N;
ll n, f1, f2, f3, c;
int main()
{
	scanf("%lld%lld%lld%lld%lld", &n, &f1, &f2, &f3, &c);
	mat.a[0][0] = mat.a[0][1] = mat.a[0][2] = mat.a[0][3] = mat.a[0][4] = mat.a[1][0] = mat.a[2][1] = mat.a[3][3] = mat.a[3][4] = mat.a[4][4] = 1;
	mat = pow(mat, n - 3);
	c = M.pow(c * c, mat.a[0][4]);
	c = M.mul(c, M.pow(f3, mat.a[0][0]));
	c = M.mul(c, M.pow(f2, mat.a[0][1]));
	c = M.mul(c, M.pow(f1, mat.a[0][2]));
	printf("%lld\n", c);
}
```

## [Maximum Sine](https://vjudge.net/problem/CodeForces-1182F)

```cpp

```
