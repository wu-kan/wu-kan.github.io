---
title: "Codeforces Round #566 (Div. 2)"
tags:
  - ACM
  - 题解
---
[官方题解](https://codeforces.com/blog/entry/67727)

## [Chunga-Changa](https://vjudge.net/problem/CodeForces-1181A)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
int main()
{
	ll x, y, z;
	scanf("%lld%lld%lld", &x, &y, &z);
	ll xp = x / z, yp = y / z;
	if ((x + y) / z == xp + yp)
		return printf("%lld 0", xp + yp), 0;
	ll mi = min((xp + 1) * z - x, (yp + 1) * z - y);
	printf("%lld %lld", xp + yp + 1, mi);
}
```

## [Split a Number](https://vjudge.net/problem/CodeForces-1181B)

高精度模板，瞎搞就过了。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e5 + 9;
struct Wint : vector<int> //继承vector
{
	static const int width = 9, base = 1e9;
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
char s[N];
int n;
int main()
{
	scanf("%d%s", &n, s);
	Wint ans(string(n, '9'));
	int p = n / 2 + 1;
	while (p < n && s[p] == '0')
		++p;
	if (p & p < n)
		ans = min(ans, Wint(string(s, s + p)) + Wint(string(s + p, s + n)));
	p = n / 2 + 1;
	while (p && p < n && s[p] == '0')
		--p;
	if (p && p < n)
		ans = min(ans, Wint(string(s, s + p)) + Wint(string(s + p, s + n)));
	p = n / 2;
	while (p && p < n && s[p] == '0')
		++p;
	if (p && p < n)
		ans = min(ans, Wint(string(s, s + p)) + Wint(string(s + p, s + n)));
	p = n / 2;
	while (p && p < n && s[p] == '0')
		--p;
	if (p && p < n)
		ans = min(ans, Wint(string(s, s + p)) + Wint(string(s + p, s + n)));
	cout << ans;
}
```

## [Flag](https://vjudge.net/problem/CodeForces-1181C)

`continue`打错成`break`了…好气啊。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1023;
char s[N][N];
long long ans;
int n, m, r[N][N], b[N][N];
int getX(int i0, int j)
{
	int i1 = b[i0][j] + 1, len0 = i1 - i0;
	if (i1 >= n)
		return n;
	int i2 = b[i1][j] + 1, len1 = i2 - i1;
	if (i2 >= n || len1 != len0)
		return n;
	if (b[i2][j] < i0 + len0 * 3 - 1)
		return n;
	return i0 + len0 * 3 - 1;
}
int getY(int i0, int j, int x)
{
	int ret = 1e9;
	for (int i = i0; i <= x; ++i)
		ret = min(ret, r[i][j]);
	return ret;
}
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 0; i < n; ++i)
		scanf("%s", s[i]);
	for (int i = n - 1; ~i; --i)
		for (int j = m - 1; ~j; --j)
		{
			b[i][j] = i;
			if (i + 1 < n && s[i][j] == s[i + 1][j])
				b[i][j] = b[i + 1][j];
			r[i][j] = j;
			if (j + 1 < m && s[i][j] == s[i][j + 1])
				r[i][j] = r[i][j + 1];
		}
	for (int i = 0; i < n; ++i)
		for (int j = 0; j < m; ++j)
		{
			int x = getX(i, j);
			if (x >= n)
				continue;
			int y = getY(i, j, x);
			ans += (y - j + 1LL) * (y - j) / 2 + y - j + 1;
			j = y;
		}
	printf("%lld", ans);
}
```

## [Irrigation](https://vjudge.net/problem/CodeForces-1181D)

```cpp

```

## [A Story of One Country (Easy)](https://vjudge.net/problem/CodeForces-1181E1)

```cpp

```

## [A Story of One Country (Hard)](https://vjudge.net/problem/CodeForces-1181E2)

```cpp

```
