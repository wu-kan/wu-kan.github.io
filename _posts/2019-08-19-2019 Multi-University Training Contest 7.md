---
title: 2019 Multi-University Training Contest 7
categories:
- ACM
- 题解
---
## [A + B = C](https://vjudge.net/problem/HDU-6646)

记$A=a\cdot 10^x,B=b\cdot 10^y, C=c\cdot 10^z$，不妨$A>B$，则$A>=C/2$。于是A的十进制位数要么和C相等，要么比C小1。然后分别做一个高精度减法，判断这个差值可不可以用B加若干个0得到即可。

```cpp
#include <bits/stdc++.h>
using namespace std;
struct Wint : deque<int> //继承vector
{
	static const int width = 1, base = 1e1;
	Wint(unsigned long long n = 0) //普通初始化，当整型数和Wint同时运算时会提升至Wint
	{
		for (; n; n /= base)
			push_back(n % base);
	}
	explicit Wint(const string &s) //字符串初始化函数，未判断字符串合法情况
	{
		for (int len = int(s.size() - 1) / width + 1, b, e, i = 0; i < len; ++i)
			for (e = s.size() - i * width, b = max(0, e - width), push_back(0); b != e; ++b)
				back() = back() * 10 + s[b] - '0';
		trim(0);
	}
	Wint &trim(bool up = 1) //去前导0，是否需要进位，很常用的小函数，为方便返回自身
	{
		for (int i = 1; up && i < size(); ++i)
		{
			if ((*this)[i - 1] < 0)
				--(*this)[i], (*this)[i - 1] += base;
			if ((*this)[i - 1] >= base)
				(*this)[i] += (*this)[i - 1] / base, (*this)[i - 1] %= base;
		}
		while (!empty() && back() <= 0)
			pop_back();
		for (; up && !empty() && back() >= base; (*this)[size() - 2] %= base)
			push_back(back() / base);
		return *this;
	}
	friend istream &operator>>(istream &is, Wint &n)
	{
		string s; //懒
		return is >> s, n = Wint(s), is;
	}
	friend ostream &operator<<(ostream &os, const Wint &n)
	{
		if (n.empty())
			return os.put('0');
		os << n.back();
		char ch = os.fill('0');
		for (int i = n.size() - 2; ~i; --i)
			os.width(n.width), os << n[i];
		return os.fill(ch), os;
	}
	friend bool operator<(const Wint &a, const Wint &b)
	{
		if (a.size() != b.size())
			return a.size() < b.size();
		for (int i = a.size() - 1; ~i; --i)
			if (a[i] != b[i])
				return a[i] < b[i];
		return 0;
	}
	friend bool operator>(const Wint &a, const Wint &b) { return b < a; }
	friend bool operator<=(const Wint &a, const Wint &b) { return !(a > b); }
	friend bool operator>=(const Wint &a, const Wint &b) { return !(a < b); }
	Wint &operator+=(const Wint &b)
	{
		if (size() < b.size())
			resize(b.size()); //保证有足够的位数
		for (int i = 0; i < b.size(); ++i)
			(*this)[i] += b[i];
		return trim(); //单独进位防自运算
	}
	friend Wint operator+(Wint a, const Wint &b) { return a += b; }
	Wint &operator++() { return *this += 1; } //前置版本，懒
	Wint operator++(int)					  //后置版本
	{
		Wint b(*this);
		return ++*this, b;
	}
	Wint &operator-=(const Wint &b) //a<b会使a变为0
	{
		if (size() < b.size())
			resize(b.size()); //保证有足够的位数
		for (int i = 0; i < b.size(); ++i)
			(*this)[i] -= b[i];
		return trim(); //单独进位防自运算
	}
	friend Wint operator-(Wint a, const Wint &b) { return a -= b; }
	Wint &operator--() { return *this -= 1; } //前置版本，懒
	Wint operator--(int)					  //后置版本
	{
		Wint b(*this);
		return --*this, b;
	}
	Wint &operator*=(const Wint &b) //高精度乘法，常规写法
	{
		Wint c;
		c.assign(size() + b.size(), 0);
		for (int j = 0, k, l; j < b.size(); ++j)
			if (b[j]) //稀疏优化，特殊情况很有效
				for (int i = 0; i < size(); ++i)
				{
					unsigned long long n = (*this)[i];
					for (n *= b[j], k = i + j; n; n /= base)
						c[k++] += n % base;
					for (l = i + j; c[l] >= base || l + 1 < k; c[l++] %= base)
						c[l + 1] += c[l] / base;
				}
		return swap(c), trim(0);
	}
	/*
	Wint& operator*=(const Wint &b)//一种效率略高但对位宽有限制的写法
	{
		vector<unsigned long long> n(size()+b.size(),0);//防爆int
		//乘法算完后统一进位效率高，防止乘法溢出（unsigned long long范围0~1.8e19）
		//位宽为9时size()不能超过18（十进制162位），位宽为8时size()不能超过1800（十进制14400位）等等。
		for(int j=0; j!=b.size(); ++j)
			if(b[j])//稀疏优化，特殊情况很有效
				for(int i=0; i!=size(); ++i)
					n[i+j]+=(unsigned long long)(*this)[i]*b[j];
		for(int i=1; i<n.size(); ++i)//这里用<防止位数0，单独进位防自运算
			n[i]+=n[i-1]/base,n[i-1]%=base;
		return assign(n.begin(),n.end()),trim(0);
	}
	Wint& operator*=(const Wint &b)//fft优化乘法，注意double仅15位有效数字，调小Wint::width不超过2，计算自2*log2(base)+2*log2(len)<53
	{
		vector<ll> ax(begin(),end()),bx(b.begin(),b.end());
		ax=FFT(size()+b.size()).ask(ax,bx);
		for(int i=1; i<ax.size(); ++i)
			ax[i]+=ax[i-1]/base,ax[i-1]%=base;
		return assign(ax.begin(),ax.end()),trim(0);
	}
	Wint& operator*=(const Wint &b)//ntt优化，Wint::width不超过2
	{
		vector<ll> ax(begin(),end()),bx(b.begin(),b.end());
		ax=FNTT(size()+b.size(),(7<<26)+1,3).ask(ax,bx);
		for(int i=1; i<ax.size(); ++i)
			ax[i]+=ax[i-1]/base,ax[i-1]%=base;
		return assign(ax.begin(),ax.end()),trim(0);
	}
	*/
	friend Wint operator*(Wint a, const Wint &b) { return a *= b; }
	Wint &operator/=(Wint b)
	{
		Wint r, c, d = b.base / (b.back() + 1);
		*this *= d, b *= d, c.assign(size(), 0);
		for (int i = size() - 1; ~i; --i)
		{
			r.insert(r.begin(), (*this)[i]);
			unsigned long long s = 0;
			for (int j = b.size(); j + 1 >= b.size(); --j) //b.size()==0肯定第一行就出问题的
				s = s * b.base + (j < r.size() ? r[j] : 0);
			for (d = c[i] = s / b.back(), d *= b; r < d; r += b)
				--c[i];
			r -= d;
		}
		return swap(c), trim(0); //r为加倍后的余数，可通过高精度除低精度得到真正余数，此处略
	}
	friend Wint operator/(Wint a, const Wint &b) { return a /= b; }
	Wint &operator%=(const Wint &b) { return *this -= *this / b * b; }
	friend Wint operator%(Wint a, const Wint &b) { return a %= b; }
	//开平方，改自ZJU模板
	bool cmp(long long c, int d, const Wint &b) const
	{
		if ((int)b.size() - (int)size() < d + 1 && c)
			return 1;
		long long t = 0;
		for (int i = b.size() - 1, lo = -(base << 1); lo <= t && t <= 0 && ~i; --i)
			if (t = t * base - b[i], 0 <= i - d - 1 && i - d - 1 < size())
				t += (*this)[i - d - 1] * c;
		return t > 0;
	}
	Wint &sub(const Wint &b, long long k, int d)
	{
		int l = b.size() + d;
		for (int i = d + 1; i <= l; ++i)
		{
			long long tmp = (*this)[i] - k * b[i - d - 1];
			if (tmp < 0)
			{
				(*this)[i + 1] += (tmp - base + 1) / base;
				(*this)[i] = tmp - (tmp - base + 1) / base * base;
			}
			else
				(*this)[i] = tmp;
		}
		for (int i = l + 1; i < size() && (*this)[i] < 0; ++i)
		{
			(*this)[i + 1] += ((*this)[i] - base + 1) / base;
			(*this)[i] -= ((*this)[i] - base + 1) / base * base;
		}
		return trim(0);
	}
	friend Wint sqrt(Wint a)
	{
		Wint n;
		n.assign(a.size() + 1 >> 1, 0);
		for (int i = n.size() - 1, l, r; ~i; --i)
		{
			for (l = 0, r = a.base, n[i] = l + r >> 1; r - l > 1; n[i] = l + r >> 1)
			{
				if (n.cmp(n[i], i - 1, a))
					r = n[i];
				else
					l = n[i];
			}
			a.sub(n, n[i], i - 1), n[i] += l + r >> 1;
		}
		for (int i = 0; i < n.size(); ++i)
			n[i] >>= 1;
		return n.trim(0);
	}
	/*
	friend Wint sqrt(const Wint &a)//常规牛顿迭代实现的开平方算法，慢但是好敲
	{
		Wint b=a,c=(b+1)/2;
		while(b!=c)swap(b,c),c=(b+a/b)/2;
		return c;
	}
	friend Wint sqrt(const Wint &a)
	{
		Wint ret,t;
		ret.assign((a.size()+1)>>1,0);
		for(int i=ret.size()-1,l,r; ~i; --i)
		{
			for(l=0,r=a.base; r-l>1;)
			{
				ret[i]=l+(r-l)/2;
				t=ret*ret;
				if(a<t)r=ret[i];
				else l=ret[i];
			}
			if(!l&&i==ret.size()-1)ret.pop_back();
			else ret[i]=l;
		}
		return ret;
	}
	*/
};
int ok(Wint a, Wint b, Wint c, int &x, int &y, int &z)
{
	x = y = z = 0;
	while (a.size() < c.size())
		a.push_front(0), ++x;
	while (c.size() < a.size())
		c.push_front(0), ++z;
	if (c > a)
	{
		int tx = x, ty = y, tz = z;
		Wint d = c - a;
		while (d.size() < b.size())
			d.push_front(0), ++x, ++z;
		while (b.size() < d.size())
			b.push_front(0), ++y;
		if (d == b)
			return 1;
		x = tx, y = ty, z = tz;
	}
	c.push_front(0), ++z;
	{
		int tx = x, ty = y, tz = z;
		Wint d = c - a;
		while (d.size() < b.size())
			d.push_front(0), ++x, ++z;
		while (b.size() < d.size())
			b.push_front(0), ++y;
		if (d == b)
			return 1;
		x = tx, y = ty, z = tz;
	}
	return 0;
}
const int N = 1e5 + 9;
char s[N];
Wint a, b, c;
int t, x, y, z;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%s", s), a = Wint(s);
		scanf("%s", s), b = Wint(s);
		scanf("%s", s), c = Wint(s);
		if (ok(a, b, c, x, y, z) || ok(b, a, c, y, x, z))
		{
			while (x && y && z && (x > 1e6 || y > 1e6 || z > 1e6))
				--x, --y, --z;
			if (0 <= x && x <= 1e6 && 0 <= y && y <= 1e6 && 0 <= z && z <= 1e6)
				printf("%d %d %d\n", x, y, z);
			else
				printf("-1\n");
		}
		else
			printf("-1\n");
	}
}
```

## [Final Exam](https://vjudge.net/problem/HDU-6651)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll t, n, m, k;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%lld%lld%lld", &n, &m, &k);
		ll f = n - k + 1,
		   l = m / f, h = m / f + 1,
		   ch = m - l * f, cl = f - ch,
		   ans = l * (cl - 1ll) + h * (n - (cl - 1));
		printf("%lld\n", ans);
	}
}
```

## [Halt Hater](https://vjudge.net/problem/HDU-6653)

三种情况下讨论一下…

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll made(ll a, ll b, ll x, ll y)
{
	if (x > 0)
	{
		if (y >= 0)
		{
			if (y <= x - 1)
				return (a * y + b * (x - y - 1));
			else
				return (a * (x - 1) + b * (y - x + 1));
		}
		else
		{
			if (y >= -x)
				return (a * (-y - 1) + b * (x + y));
			else
				return (a * (x - 1) + b * (-y - x));
		}
	}
	else
	{
		if (y >= 0)
		{
			if (y <= -x)
				return (a * y + b * (-x - y));
			else
				return (a * (-x) + b * (y + x));
		}
		else
		{
			if (y <= x - 1)
				return (a * (-x) + b * (x - y - 1));
			else
				return (a * (-y - 1) + b * (y - x + 1));
		}
	}
}
int main()
{
	ll t, a, b, x, y;
	for (scanf("%lld", &t); t--;)
	{
		scanf("%lld%lld%lld%lld", &a, &b, &x, &y);
		if (b > a)
			b = a;
		printf("%lld\n", made(min(a, 2 * b), b, x, y));
	}
}
```

## [Just Repeat](https://vjudge.net/problem/HDU-6655)

贪心。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long llu;
const llu N = 1e5 + 9;
llu rng(llu &k1, llu &k2)
{
	llu k3 = k1, k4 = k2;
	k1 = k4;
	k3 ^= k3 << 23;
	k2 = k3 ^ k4 ^ (k3 >> 17) ^ (k4 >> 26);
	return k2 + k4;
}
pair<int, pair<int, int>> q[N << 1];
int t, n, m, p, a[N], b[N];
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d%d", &n, &m, &p);
		if (p == 1)
		{
			for (int i = 0; i < n; ++i)
				scanf("%d", &a[i]);
			for (int i = 0; i < m; ++i)
				scanf("%d", &b[i]);
		}
		else
		{
			llu k1, k2, mod;
			scanf("%llu%llu%llu", &k1, &k2, &mod);
			for (int i = 0; i < n; ++i)
				a[i] = rng(k1, k2) % mod;
			scanf("%llu%llu%llu", &k1, &k2, &mod);
			for (int i = 0; i < m; ++i)
				b[i] = rng(k1, k2) % mod;
		}
		sort(a, a + n);
		sort(b, b + m);
		int suma = 0, sumb = 0, siz = 0;
		for (int i = 0, j = 0; i < n || j < m;)
		{
			if (i < n && j < m && a[i] == b[j])
			{
				pair<int, pair<int, int>> p;
				do
					++p.first, ++p.second.first, ++i;
				while (i < n && a[i] == a[i - 1]);
				do
					++p.first, ++p.second.second, ++j;
				while (j < m && b[j] == b[j - 1]);
				q[siz++] = p;
			}
			else if ((i < n && j < m && a[i] < b[j]) || j >= m)
				++suma, ++i;
			else
				++sumb, ++j;
		}
		sort(q, q + siz, greater<pair<int, pair<int, int>>>());
		for (int i = 0; i < siz; ++i)
		{
			if (i & 1)
				sumb += q[i].second.second;
			else
				suma += q[i].second.first;
		}
		printf(suma > sumb ? "Cuber QQ\n" : "Quber CC\n");
	}
}
```

## [Kejin Player](https://vjudge.net/problem/HDU-6656)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 5e5 + 9;
struct Mod
{
	const ll M;
	Mod(ll M) : M(M) {}
	ll qadd(ll &a, ll b) const { return a += b, a < M ? a : a - M; }
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }
	ll mul(ll a, ll b) const { return add(a * b, M); }
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a = add(a, M); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
	ll inv(ll a) const { return pow(a, M - 2); }
} M(1e9 + 7);
ll n, q, t, x[N], f[N], r[N], s[N], a[N];
int main()
{
	for (scanf("%lld", &t); t--;)
	{
		scanf("%lld%lld", &n, &q);
		for (int i = 1; i <= n; ++i)
			scanf("%lld%lld%d%lld", &r[i], &s[i], &x[i], &a[i]);
		for (int i = 2; i <= n + 1; ++i)
		{
			ll pi = M.mul(r[i - 1], M.inv(s[i - 1]));
			ll pini = M.mul(s[i - 1], M.inv(r[i - 1]));
			if (i - 1 == x[i - 1])
				f[i] = M.add(f[i - 1], a[i - 1] * pini);
			else
				f[i] = M.mul(f[i - 1] + a[i - 1] + M.mul(pi, f[x[i - 1]]) - f[x[i - 1]], pini);
		}
		for (int i = 1, l, r; i <= q; ++i)
		{
			scanf("%d%d", &l, &r);
			printf("%lld\n", M.add(f[r], -f[l]));
		}
	}
}
```
