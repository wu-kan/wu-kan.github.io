---
title: ACM-ICPC Asia Beijing Regional Contest 2018 Reproduction
tags:
  - ACM
  - 题解
---

## [Jin Yong’s Wukong Ranking List](https://vjudge.net/problem/HihoCoder-1870)

```cpp
#include <bits/stdc++.h>
#define maxn 1000
using namespace std;
int head[maxn], tot, n, numofp;
struct edge
{
	int to, next;
} e[maxn << 2];
inline void addedge(int u, int v)
{
	e[++tot].next = head[u];
	e[tot].to = v;
	head[u] = tot;
}
bool find(int a, int b)
{
	queue<int> q;
	bool ed[100] = {0};
	q.push(a);
	ed[a] = 1;
	while (!q.empty())
	{
		int u = q.front();
		q.pop();
		for (int i = head[u]; i; i = e[i].next)
		{
			if (e[i].to == b)
				return true;
			if (!ed[e[i].to])
				q.push(e[i].to);
		}
	}
	return false;
}
string a[maxn];
map<string, int> mp;

int main(void)
{
	while (~scanf("%d", &n))
	{
		memset(head, 0, sizeof(head));
		tot = 0;
		mp.clear();
		for (int i = 1; i <= n; i++)
		{
			cin >> a[i * 2 - 1] >> a[i * 2];
		}
		bool ok = 1;
		for (int i = 1; i <= n; i++)
		{
			int p1, p2;
			if (mp.count(a[i * 2 - 1]))
				p1 = mp[a[i * 2 - 1]];
			else
				p1 = mp[a[i * 2 - 1]] = ++numofp;
			if (mp.count(a[i * 2]))
				p2 = mp[a[i * 2]];
			else
				p2 = mp[a[i * 2]] = ++numofp;
			//	cout<<p1<<" "<<p2<<endl;
			if (find(p2, p1))
			{
				cout << a[i * 2 - 1] << " " << a[i * 2] << endl;
				ok = 0;
				break;
			}
			addedge(p1, p2);
		}
		if (ok)
			cout << "0\n";
	}
	//system("pause");
}
```

## [Heshen's Account Book](https://vjudge.net/problem/HihoCoder-1871)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;

const int maxn = 1000 + 10;
int nL, n, tot, lin[maxn], c[maxn];
LL ans[maxn];
char ch[maxn], s[maxn], last[maxn];

bool check()
{
	if (nL == 0)
		return false;
	for (int i = 1; i <= nL; i++)
		if ('a' <= s[i] && s[i] <= 'z')
			return false;

	int num = 0;
	for (int i = 1; i <= nL; i++)
		if (s[i] == '0')
			num++;
		else
			break;
	if (num > 1 || num == 1 && nL != 1)
		return false;

	return true;
}

LL made()
{
	LL res = 0;
	for (int i = 1; i <= nL; i++)
		res = res * 10ll + (LL)(s[i] - '0');
	return res;
}

void next()
{
	if (check())
	{
		ans[tot] = made();
		lin[c[tot]]++;
		tot++;
	}
	nL = 0;
	c[tot] = maxn;
}

int main()
{
	while (fgets(ch, maxn, stdin))
	{
		n++;
		int L = strlen(ch);
		if (!(isdigit(ch[0]) && isdigit(last[n - 1])))
			next();
		for (int i = 0; i < L; i++)
		{
			if (ch[i] == ' ')
				next();
			else if (ch[i] != '\n')
			{
				s[++nL] = ch[i];
				c[tot] = min(c[tot], n);
			}

			if (ch[i] != '\n')
				last[n] = ch[i];
		}
	}
	next();

	if (tot != 0)
	{
		for (int i = 0; i < tot - 1; i++)
			printf("%lld ", ans[i]);
		printf("%lld\n", ans[tot - 1]);
	}
	for (int i = 1; i <= n; i++)
		printf("%d\n", lin[i]);
}
```

## [Frog and Portal](https://vjudge.net/problem/HihoCoder-1873)

```cpp
#include <bits/stdc++.h>
#define ll long long
using namespace std;
ll fib[200];
int find(ll val)
{
	return upper_bound(fib, fib + 55, val) - fib - 1;
}
int main(void)
{
	fib[0] = fib[1] = 1;
	for (int i = 2; i <= 60; i++)
		fib[i] = fib[i - 1] + fib[i - 2];
	ll a;
	while (cin >> a)
	{
		if (a == 0)
		{
			cout << "2\n1 1\n2 1\n";
			continue;
		}
		int loc = 0, loc2 = 150;
		vector<int> vec;
		vec.clear();
		while (a)
		{
			ll tem = find(a);
			//cout<<tem<<endl;
			//cout<<fib[tem]<<endl;
			vec.push_back(loc + 1);
			vec.push_back(loc2 - tem);
			//cout<<loc+1<<" "<<loc2-tem<<endl;
			loc += 2;
			//cout<<loc2+tem<<" "<<199<<endl;
			//cout<<loc2+tem+1<<" "<<loc2+tem+1<<endl;
			//loc2+=tem+2;
			a -= fib[tem];
		}
		printf("%d\n", vec.size() / 2 + 3);
		for (int i = 0; i < vec.size(); i += 2)
			cout << vec[i] << " " << vec[i + 1] << endl;
		cout << loc << " " << loc << endl;
		cout << 150 << " " << 199 << endl;
		cout << 151 << " " << 151 << endl;
	}
	//system("pause");
}
```

## [Approximate Matching](https://vjudge.net/problem/HihoCoder-1877)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;

const int maxn = 50;
int T, n, m;
LL f[maxn][maxn * maxn];
char ch[maxn];
struct Trie
{
	int next[maxn * maxn][2], fail[maxn * maxn], end[maxn * maxn];
	int root, L;
	int newnode()
	{
		for (int i = 0; i < 2; i++)
			next[L][i] = -1;
		end[L++] = 0;
		return L - 1;
	}
	void init()
	{
		L = 0;
		root = newnode();
	}
	void insert(char *buf)
	{
		int L = strlen(buf), now = root;
		for (int i = 0; i < L; i++)
		{
			if (next[now][buf[i] - '0'] == -1)
				next[now][buf[i] - '0'] = newnode();
			now = next[now][buf[i] - '0'];
		}
		end[now]++;
	}
	void build()
	{
		queue<int> Q;
		fail[root] = root;
		for (int i = 0; i < 2; i++)
			if (next[root][i] == -1)
				next[root][i] = root;
			else
			{
				fail[next[root][i]] = root;
				Q.push(next[root][i]);
			}
		while (!Q.empty())
		{
			int now = Q.front();
			Q.pop();
			for (int i = 0; i < 2; i++)
				if (next[now][i] == -1)
					next[now][i] = next[fail[now]][i];
				else
				{
					fail[next[now][i]] = next[fail[now]][i];
					Q.push(next[now][i]);
				}
		}
	}
} tree;

int main()
{
	scanf("%d", &T);
	while (T--)
	{
		tree.init();
		scanf("%d%d", &n, &m);
		scanf("%s", ch);

		if (n > m)
		{
			printf("0\n");
			continue;
		}
		else if (n == m)
		{
			printf("%d\n", n + 1);
			continue;
		}

		tree.insert(ch);
		for (int i = 0; i < n; i++)
		{
			if (ch[i] == '0')
				ch[i] = '1';
			else
				ch[i] = '0';
			tree.insert(ch);
			if (ch[i] == '0')
				ch[i] = '1';
			else
				ch[i] = '0';
		}
		tree.build();

		memset(f, -1, sizeof(f));
		f[0][0] = 1;
		for (int i = 1; i <= m; i++)
		{
			for (int j = 0; j < tree.L; j++)
			{
				if (f[i - 1][j] == -1 || tree.end[j])
					continue;
				for (int k = 0; k < 2; k++)
				{
					int son = tree.next[j][k];
					if (tree.end[son])
						continue;
					if (f[i][son] == -1)
						f[i][son] = f[i - 1][j];
					else
						f[i][son] += f[i - 1][j];
				}
			}
		}

		LL ans = 0;
		for (int j = 1; j < tree.L; j++)
			if (f[m][j] > 0)
				ans += f[m][j];
		printf("%lld\n", (1ll << m) - ans);
	}
}
```

## [Palindromes](https://vjudge.net/problem/HihoCoder-1878)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;
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
int t;
int main()
{
	for (cin >> t; t--;)
	{
		Wint k;
		cin >> k;
		if (k == Wint(1))
		{
			cout << "0\n";
			continue;
		}
		k -= 1;
		int odd = 1;
		for (Wint p = 9, val = 0, tmp0 = 0, tmp1 = 0, tk = k / 2;;)
		{
			if (odd)
				tmp1.push_front(9);
			else
				tmp0.push_front(9);
			if (tk <= tmp1)
				if (k <= tmp0 + tmp1)
				{
					val += k + p - tmp0 - tmp1;
					ostringstream sout;
					sout << val;
					string s = sout.str();
					cout << s;
					if (odd)
						s.erase(s.size() - 1);
					reverse(s.begin(), s.end());
					cout << s << '\n';
					break;
				}
			if (odd ^= 1)
			{
				val.push_front(9);
				p.push_front(0);
			}
		}
	}
}
```
