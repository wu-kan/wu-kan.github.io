---
title: Educational Codeforces Round 64 (Rated for Div. 2)
tags:
  - ACM
  - 题解
---

[官方题解](https://codeforces.com/blog/entry/66827)

A 题出锅所以 Unrated 了…于是愉快的去睡觉了。

## [Inscribed Figures](https://vjudge.net/problem/CodeForces-1156A)

交上去 WA 了一发，结果是题目的锅。

```cpp
#include <bits/stdc++.h>
using namespace std;
int n, ans, a[127];
int main()
{
	scanf("%d%d", &n, &a[0]);
	for (int i = 1; i < n; ++i)
	{
		scanf("%d", &a[i]);
		if (a[i - 1] != 1 && a[i] != 1)
			return printf("Infinite"), 0;
		ans += a[i] + a[i - 1];
		if (i > 1 && a[i] == 2 && a[i - 1] == 1 && a[i - 2] == 3)
			--ans;
	}
	printf("Finite\n%d", ans);
}
```

## [Ugly Pairs](https://vjudge.net/problem/CodeForces-1156B)

相当巧妙的构造。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int t;
	for (cin >> t; t--;)
	{
		string s, r[2];
		cin >> s;
		sort(s.begin(), s.end());
		for (auto c : s)
			r[c & 1] += c;
		if (r[0].empty() || r[1].empty())
			cout << r[0] + r[1] << '\n';
		else if (abs(r[0].back() - r[1].front()) != 1)
			cout << r[0] + r[1] << '\n';
		else if (abs(r[1].back() - r[0].front()) != 1)
			cout << r[1] + r[0] << '\n';
		else
			cout << "No answer\n";
	}
}
```

## [Match Points](https://vjudge.net/problem/CodeForces-1156C)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
int n, z, k, x[N];
int main()
{
	scanf("%d%d", &n, &z);
	for (int i = 0; i < n; ++i)
		scanf("%d", &x[i]);
	sort(x, x + n);
	for (int i = 0; i < n; ++i)
		if (x[i] - x[k] >= z)
			++k;
	printf("%d", min(k, n / 2));
}
```

## [0-1-Tree](https://vjudge.net/problem/CodeForces-1156D)

```cpp
#include <bits/stdc++.h>
using namespace std;
struct UnionfindSet : vector<int>
{
	vector<int> siz;
	UnionfindSet(int n) : vector<int>(n), siz(n, 1)
	{
		for (int i = 0; i < n; ++i)
			at(i) = i;
	}
	void merge(int u, int w)
	{
		if (w = ask(w), u = ask(u), w != u)
			siz[at(w) = u] += siz[w];
	}
	int ask(int u) { return at(u) != u ? at(u) = ask(at(u)) : u; }
};
int main()
{
	int n;
	scanf("%d", &n);
	UnionfindSet ufs[2]{n, n};
	for (int i = 1, x, y, z; i < n; ++i)
	{
		scanf("%d%d%d", &x, &y, &z);
		ufs[z].merge(x - 1, y - 1);
	}
	long long ans = 0;
	for (int i = 0; i < n; ++i)
		ans += 1LL * ufs[0].siz[ufs[0].ask(i)] * ufs[1].siz[ufs[1].ask(i)] - 1;
	printf("%lld", ans);
}
```

## [Special Segments of Permutation](https://vjudge.net/problem/CodeForces-1156E)

先算出每个位置向左第一个比他大的位置$l_i$，向右第一个比他大的位置$r_i$，然后枚举$(i,l_i),(i,r_i)$中较小的那个区间内的每个元素，计算“另一半”是否落在另一个区间。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
int n, ans, p[N], b[N], l[N], r[N];
int main()
{
	scanf("%d", &n);
	p[0] = p[n + 1] = n + 1;
	for (int i = 1; i <= n; ++i)
	{
		scanf("%d", &p[i]);
		b[p[i]] = i;
		for (l[i] = i - 1; p[l[i]] < p[i];)
			l[i] = l[l[i]];
	}
	for (int i = n; i; --i)
	{
		for (r[i] = i + 1; p[r[i]] < p[i];)
			r[i] = r[r[i]];
		int s1 = l[i], t1 = i, s2 = i, t2 = r[i];
		if (t1 - s1 > t2 - s2)
			swap(s1, s2), swap(t1, t2);
		for (int j = s1 + 1; j < t1; ++j)
			if (s2 < b[p[i] - p[j]] && b[p[i] - p[j]] < t2)
				++ans;
	}
	printf("%d", ans);
}
```

## [Card Bag](https://vjudge.net/problem/CodeForces-1156F)

概率 DP。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 2e5 + 9;
typedef long long ll;
struct Mod
{
	const ll M;
	Mod(ll M) : M(M) {}
	ll qadd(ll a, ll b) const { return a += b, a < M ? a : a - M; }
	ll add(ll a, ll b) const { return qadd((a + b) % M, M); }
	ll mul(ll a, ll b) const { return add(a * b, 0); }
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
} f(N, 998244353);
int n, ans, cnt[N], dp[N];
int main()
{
	scanf("%d", &n);
	for (int i = 0, t; i < n; ++i)
		scanf("%d", &t), ++cnt[t];
	for (int i = dp[0] = 1, tot = 0; i <= n; ++i)
		if (cnt[i])
			for (int j = tot++, t = f.mul(f.mul(cnt[i], cnt[i] - 1), f.ifac[n]); ~j; --j)
				ans = f.qadd(ans, f.mul(f.mul(t, f.fac[n - j - 2]), dp[j])),
				dp[j + 1] = f.qadd(dp[j + 1], f.mul(cnt[i], dp[j]));
	printf("%d", ans);
}
```

## [Optimizer](https://cn.vjudge.net/problem/CodeForces-1156G)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef unsigned long long ll;
const int N = 1023;
set<int> vec[N];
map<string, int> mmp;
vector<string> ans;
ll Key[N];
set<string> used;
string a[N], b[N], c[N], op(N, '='), alphabet("abcdefghijklmnopqrstuvwxyz1234567890");
string solve(const string &res, int n)
{
	if (!mmp.count(res))
		return res;
	int p = mmp[res];
	auto it = vec[p].lower_bound(n);
	if (it == vec[p].begin())
		return res;
	n = *--it;
	static map<ll, string> calced;
	if (calced.count(Key[n]))
		return calced[Key[n]];
	if (op[n] == '=')
		return calced[Key[n]] = solve(b[n], n);
	string ret("aaaa");
	while (isdigit(ret[0]) || used.count(ret))
		for (int i = 0; i < 4; ++i)
			ret[i] = alphabet[rand() % alphabet.size()];
	used.insert(ret);
	ans.push_back(ret + '=' + solve(b[n], n) + op[n] + solve(c[n], n));
	return calced[Key[n]] = ret;
}
ll calc(ll a, ll b, char c) { return (a + c * 3131441) * (b + c * 2332424); }
int main()
{
	map<string, ll> key;
	int n;
	cin >> n;
	for (int i = 1, p; i <= n; ++i)
	{
		string str;
		cin >> str;
		for (int j = p = 0; j < str.size(); ++j)
		{
			if (str[j] == '=')
				p = j, a[i] = str.substr(0, j);
			else if (str[j] == '$' || str[j] == '^' || str[j] == '#' || str[j] == '&')
				b[i] = str.substr(p + 1, j - p - 1), c[i] = str.substr(j + 1, str.size() - j - 1), op[i] = str[j];
		}
		if (op[i] == '=')
			b[i] = str.substr(p + 1, str.size() - p - 1);
		if (!key.count(b[i]))
			key[b[i]] = key.size();
		if (!c[i].empty() && !key.count(c[i]))
			key[c[i]] = key.size();
		if (op[i] == '=')
			key[a[i]] = key[b[i]];
		else
			key[a[i]] = calc(key[b[i]], key[c[i]], op[i]);
		Key[i] = key[a[i]];
		used.insert(a[i]);
		used.insert(b[i]);
		used.insert(c[i]);
		if (!mmp.count(a[i]))
			mmp[a[i]] = i;
		vec[mmp[a[i]]].insert(i);
	}
	string r = solve("res", n + 1);
	if (r != "res")
	{
		for (int i = ans.size() - 1; ~i; --i)
			if (~ans[i].find(r))
			{
				ans[i].replace(0, r.size(), "res");
				cout << ans.size() << '\n';
				for (auto i : ans)
					cout << i << "\n";
				return 0;
			}
		ans.push_back("res=" + r);
	}
	cout << ans.size() << '\n';
	for (auto i : ans)
		cout << i << '\n';
}
```
