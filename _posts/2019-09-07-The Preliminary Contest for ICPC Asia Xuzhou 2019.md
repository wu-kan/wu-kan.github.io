---
title: The Preliminary Contest for ICPC Asia Xuzhou 2019
categories:
- ACM
- 题解
---
## [so easy](https://nanti.jisuanke.com/t/41384)

好题，用并查集代替普通set上二分的操作。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
const int N = 1e6 + 9;
struct Ranker : vector<ll>
{
	Ranker() { reserve(N << 1); }
	void init() { sort(begin(), end()), resize(unique(begin(), end()) - begin()); }
	int ask(ll x)
	{
		return lower_bound(begin(), end(), x) - begin();
	}
} rk;
struct UnionfindSet : vector<int>
{
	UnionfindSet(int n) : vector<int>(n)
	{
		for (int i = 0; i < n; ++i)
			at(i) = i;
	}
	void merge(int u, int w)
	{
		if (w = ask(w), u = ask(u), w != u)
			at(w) = u;
	}
	int ask(int u) { return at(u) != u ? at(u) = ask(at(u)) : u; }
};
int n, q, z[N], x[N];
int main()
{
	scanf("%d%d", &n, &q);
	for (int i = 0; i < q; ++i)
	{
		scanf("%d%d", &z[i], &x[i]);
		rk.push_back(x[i]);
		if (x[i] + 1 <= n)
			rk.push_back(x[i] + 1);
	}
	rk.init();
	UnionfindSet ufs(rk.size());
	for (int i = 0; i < q; ++i)
	{
		int t = rk.ask(x[i]);
		if (z[i] == 1)
			ufs.merge(t + 1, t);
		else
			printf("%d\n", rk[ufs.ask(t)]);
	}
}
```

## [Buy Watermelon](https://nanti.jisuanke.com/t/41385)

[建议出题人重新学习一下英语，我希望出题人结合《Buy Watermelon》这题回答一下这个问题](https://wenda.jisuanke.com/contest/3005?question_id=28850)。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int w;
	scanf("%d", &w);
	puts(w <= 2 || (w & 1) ? "NO" : "YES");
}
```

## [Carneginon](https://nanti.jisuanke.com/t/41386)

队友做的，似乎kmp搞一下就行了。

```cpp
#include <cstdio>
#include <string.h>
char s1[500001], s2[500001];
int p[500001], ans = 0, q;
int main(void)
{

	scanf("%s", s1 + 1);
	scanf("%d", &q);
	while (q--)
	{
		scanf("%s", s2 + 1);
		ans = 0;
		for (int i = 1; s2[i] != '\0' && s1[i] != '\0'; i++)
			p[i] = 0;
		p[1] = 0;
		ans = 0;
		int len1 = strlen(s1 + 1), len2 = strlen(s2 + 1), j = 0;
		if (len1 > len2)
		{
			for (int i = 1; i < len2; i++)
			{
				while (j && s2[i + 1] != s2[j + 1])
					j = p[j];
				if (s2[i + 1] == s2[j + 1])
					j++;
				p[i + 1] = j;
			}
			j = 0;
			for (int i = 0; i < len1; i++)
			{
				while (j && s1[i + 1] != s2[j + 1])
					j = p[j];
				if (s1[i + 1] == s2[j + 1])
					j++;
				if (j == len2)
				{
					ans = 1;
					break;
					j = 0;
				}
				if (ans)
					break;
			}
			if (ans)
			{
				puts("my child!");
			}
			else
				puts("oh, child!");
		}
		else if (len1 < len2)
		{
			p[1] = ans = 0;
			for (int i = 1; i < len1; i++)
			{
				while (j && s1[i + 1] != s1[j + 1])
					j = p[j];
				if (s1[i + 1] == s1[j + 1])
					j++;
				p[i + 1] = j;
			}
			j = 0;
			for (int i = 0; i < len2; i++)
			{
				while (j && s2[i + 1] != s1[j + 1])
					j = p[j];
				if (s2[i + 1] == s1[j + 1])
					j++;
				if (j == len1)
				{
					ans = 1;
					j = 0;
					break;
				}
				if (ans)
					break;
			}
			if (ans)
			{
				puts("my teacher!");
			}
			else
				puts("senior!");
		}
		else
		{
			int ct = 0;
			for (int i = 1; i <= len2; i++)
			{
				if (s1[i] != s2[i])
				{
					ct = 1;
					break;
				}
			}
			if (ct == 0)
				puts("jntm!");
			else
				puts("friend!");
		}
	}
}
```

## [XKC's basketball team](https://nanti.jisuanke.com/t/41387)

CXK打篮球了…按相反顺序插进去，树状数组维护一下前缀最大值即可。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef int ll;
const int N = 5e5 + 9;
struct Ranker : vector<ll>
{
	Ranker() { reserve(N << 1); }
	void init() { sort(begin(), end()), resize(unique(begin(), end()) - begin()); }
	int ask(ll x)
	{
		return lower_bound(begin(), end(), x) - begin();
	}
} rk;
struct Fenwick : vector<int>
{
	Fenwick(int N) : vector<int>(N + 9, -1) {}
	void upd(int x, int val)
	{
		for (; x < size(); x += x & -x)
			at(x) = max(at(x), val);
	}
	int ask(int x)
	{
		int r = -1;
		for (; x; x -= x & -x)
			r = max(r, at(x));
		return r;
	}
};
int n, m, w[N], ans[N];
int main()
{
	scanf("%d%d", &n, &m);
	for (int i = 0; i < n; ++i)
	{
		scanf("%d", &w[i]);
		rk.push_back(w[i]);
		rk.push_back(w[i] + m);
	}
	rk.init();
	Fenwick t(rk.size() + 9);
	for (int i = n - 1; ~i; --i)
	{
		int pos = rk.size() - rk.ask(w[i]), pos1 = rk.size() - rk.ask(w[i] + m);
		t.upd(pos, i);
		ans[i] = t.ask(pos1);
		if (ans[i] >= 0)
			ans[i] -= i + 1;
	}
	for (int i = 0; i < n; ++i)
		printf("%d%c", ans[i], i < n - 1 ? ' ' : '\n');
}
```

## [Colorful String](https://nanti.jisuanke.com/t/41389)

队友用马拉车暴力搞掉了，集训队里也有用回文自动机做的？

```cpp
#include <iostream>
#define maxl 300005
#define ll long long
using namespace std;
char s[maxl], s2[maxl << 1];
int R[maxl << 1], Rnow = -1, C, p2, cl, pl;
int oc[maxl][30];
int l = 0;
void init()
{
	scanf("%s", s);
	s2[l++] = '#';
	for (int i = 0; s[i] != '\0'; i++)
		s2[l++] = s[i], s2[l++] = '#';
	for (int i = 0; s[i] != '\0'; i++)
		for (int j = 0; j < 26; j++)
			oc[i][j] = -1;
	for (int i = 0; s[i] != '\0'; i++)
	{
		for (int j = 0; j < 26; j++)
		{
			if (s[i] - 'a' == j)
				oc[i][j] = i;
			else if (i != 0)
				oc[i][j] = oc[i - 1][j];
		}
	}
}
void manacher()
{
	for (int i = 0; i < l; i++)
	{
		if (i > Rnow)
		{
			for (int j = 0; i - j >= 0 && i + j < l && s2[i - j] == s2[i + j]; j++)
				R[i] = j + 1;
			Rnow = R[i] + i - 1;
			C = i;
		}
		else
		{
			p2 = 2 * C - i;
			pl = p2 - R[p2] + 1;
			cl = 2 * C - Rnow;
			if (pl > cl)
			{
				R[i] = R[p2];
			}
			if (pl == cl)
			{
				int tem = 2 * i - Rnow;
				while (s2[Rnow + 1] == s2[tem - 1] && tem > 0 && Rnow < l - 1)
				{
					Rnow++, tem--;
				}
				R[i] = Rnow - i + 1;
				C = i;
			}
			if (pl < cl)
			{
				R[i] = Rnow - i + 1;
			}
		}

		//cout<<i<<" "<<C<<" "<<Rnow<<" "<<R[i]<<endl;
	}
}
int main(void)
{
	init();
	manacher();
	//for(int i=0;i<l;i++)cout<<s2[i];
	ll ans = 0;

	for (int i = 0; i < l; i++)
	{
		if (s2[i] != '#')
		{
			int l = i / 2 - R[i] / 2 + 1, r = i / 2 + R[i] / 2 - 1;
			for (int j = 0; j < 26; j++)
			{
				int loc = oc[i / 2][j];
				if (loc >= l)
					ans += loc - l + 1;
				//cout<<i<<" "<<j<<" "<<l<<" "<<loc<<endl;
			}
		}
		else
		{
			if (i == 0 || i == l - 1)
				continue;
			int l = i / 2 - R[i] / 2, r = i / 2 - 2 + R[i] / 2;
			for (int j = 0; j < 26; j++)
			{
				int loc = oc[i / 2 - 1][j];
				if (loc >= l)
					ans += loc - l + 1;
			}
		}
	}
	cout << ans;
}
```

## [Center](https://nanti.jisuanke.com/t/41393)

注意这里对称是可以包含自己的，要特殊去处理一下。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1023;
int n;
map<pair<int, int>, int> mp;
set<pair<int, int>> se;
int main()
{
	scanf("%d", &n);
	for (int i = 0, x, y; i < n; ++i)
	{
		scanf("%d%d", &x, &y);
		se.emplace(x, y);
	}
	int mx = 0;
	vector<pair<int, int>> v(se.begin(), se.end());
	for (int i = 0; i < v.size(); ++i)
		for (int j = 0; j <= i; ++j)
			mx = max(mx, mp[make_pair(v[i].first + v[j].first, v[i].second + v[j].second)] += i != j ? 2 : 1);
	printf("%d", (int)v.size() - mx);
}
```

## [Longest subsequence](https://nanti.jisuanke.com/t/41395)

```cpp
#include <bits/stdc++.h>
#define maxm 1000006
using namespace std;
int oc[maxm][30], l1, l2;
char s[maxm], s2[maxm];

int main(void)
{
	scanf("%d%d", &l1, &l2);
	scanf("%s%s", s + 1, s2 + 1);
	for (int i = 0; i < 30; i++)
		oc[0][i] = -1;
	for (int i = 1; i <= l1; i++)
	{
		for (int j = 0; j < 26; j++)
		{
			if (s[l1 - i + 1] - 'a' == j)
				oc[i][j] = i;
			else
				oc[i][j] = oc[i - 1][j];
		}
	}
	int loc = 0, ans = 0, ct = 0;
	for (int i = 1; i <= l2; i++)
	{
		int val = s2[i] - 'a';
		for (int j = val + 1; j < 26; j++)
		{
			if (oc[l1 - loc][j] != -1)
				ans = max(ans, i - 1 + oc[l1 - loc][j]);
			//cout<<ans<<endl;
		}
		//if(ans){cout<<ans;return 0;}
		if (oc[l1 - loc][val] != -1)
			loc = l1 - oc[l1 - loc][val] + 1;
		else
		{
			ct = 1;
			break;
		}
	}
	if (ct == 0 && loc != l1)
	{
		ans = max(ans, l1 - loc + l2);
	}
	if (ans > 0)
		cout << ans;
	else
		cout << -1;
}
```
