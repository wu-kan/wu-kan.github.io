---
title: 2015-2016 Petrozavodsk Winter Training Camp, SPb SU + SPb AU Contest
categories:
  - ACM
  - 题解
date: 2019-03-09 18:00:00
---
# [Greedy Game](https://vjudge.net/problem/Gym-100956D)
```cpp
#include <bits/stdc++.h>
#define A first
#define B second
using namespace std;
const int N = 1e5 + 7;
pair<int, int> p[N];
priority_queue<int> q;
int n;
int main()
{
	scanf("%d", &n);
	for (int i = 0; i < n; ++i)
		scanf("%d", &p[i].A);
	for (int i = 0; i < n; ++i)
		scanf("%d", &p[i].B);
	sort(p, p + n);
	long long ans = 0;
	for (int i = n - 2; i >= 0; i -= 2)
	{
		ans += p[i].B, q.push(-p[i].B);
		if (i && p[i - 1].B > -q.top())
			ans += p[i - 1].B + q.top(), q.pop(), q.push(-p[i - 1].B);
	}
	printf("%lld", ans);
}
```
# [Colored Path](https://vjudge.net/problem/Gym-100956F)
```cpp
#include <bits/stdc++.h>

using namespace std;
typedef pair<long long, long long> pii;
const long long N=4e2+10;

vector<pii> ans;
long long n, k, W;
long long w[N][N], c[N][N], dp[N][N];
pii last[N][N];
long long a[1200];

long long count(long long a) {
	long long ret=0;
	while(a) a-=(a&(-a)), ret++;
	return ret;
}

bool cmp(long long a, long long b) {
	return count(a)<=count(b);
}


void print(long long x, long long y) {
	ans.push_back(pii(x, y));
	if (x==1&&y==1) return;
	print(last[x][y].first, last[x][y].second);
}

int main() {
	//freopen("in.txt", "r", stdin);
	scanf("%lld %lld %lld", &n, &k, &W);
	for(long long i=1; i<=n; i++) {
		for(long long j=1; j<=n; j++) {
			scanf("%lld", &w[i][j]);
		}
	}
	for(long long i=1; i<=n; i++) {
		for(long long j=1; j<=n; j++) {
			scanf("%lld", &c[i][j]);
			c[i][j]--;
		}
	}
	for(long long i=0; i<(1<<k); i++) {
		a[i]=i;
	}
	sort(a, a+(1<<k), cmp);

	for(long long t=0; t<(1<<k); t++) {
		long long s=a[t];
		memset(dp, 0x3f, sizeof(dp));
		if (!((1<<c[1][1])&s)) continue;
		if (!((1<<c[n][n])&s)) continue;
		dp[1][1]=w[1][1];
		for(long long i=1; i<=n; i++) {
			for(long long j=1; j<=n; j++) {
				if (!((1<<c[i][j])&s)) continue;
				if (i>1) {
					if (dp[i-1][j]+w[i][j]<dp[i][j]) {
						last[i][j]=pii(i-1, j);
						dp[i][j]=dp[i-1][j]+w[i][j];
					}
				}
				if (j>1) {
					if (dp[i][j-1]+w[i][j]<dp[i][j]) {
						last[i][j]=pii(i, j-1);
						dp[i][j]=dp[i][j-1]+w[i][j];
					}
				}
			}
		}
		if (dp[n][n]<=W) {
			print(n, n);
			cout<<count(s)<<endl;
			reverse(ans.begin(), ans.end());
			for(long long i=0; i<ans.size(); i++) {
				printf("%lld %lld", ans[i].first, ans[i].second);
				if (i==((long long)ans.size()-1)) cout<<endl;
				else cout<<' ';
			}
			return 0;
		}
	}
	cout<<-1<<endl;
	return 0;
}
```
# [Set Intersection](https://vjudge.net/problem/Gym-100956I)
大暴力就能苟过去…网上正解是随机化。
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 12e3 + 7;
bitset<N> a[N];
char s[N];
int n;
int main()
{
	scanf("%d", &n);
	for (int i = 0; i <= n; ++i)
	{
		scanf("%s", s);
		for (int k = 0; s[k]; ++k)
		{
			s[k] -= 33;
			for (int j = 0; j < 6; ++j)
				a[i][k * 6 + j] = s[k] & 1, s[k] >>= 1;
		}
		for (int j = 0; j < i; ++j)
			if ((a[i] & a[j]).count() >= n / 2)
				return printf("%d %d", i + 1, j + 1), 0;
	}
}
```
# [Sort It!](https://vjudge.net/problem/Gym-100956J)
树状数组求完逆序对之后容斥一下就行了。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 2e3 + 7;
struct Mod
{
	const ll M;
	Mod(ll M) : M(M) {}
	ll add(ll a, ll b) const { return ((a + b) % M + M) % M; }
	ll mul(ll a, ll b) const { return a * b % M; }
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a %= M; b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
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
	ll c(int n, int m) { return mul(mul(fac[n], ifac[m]), ifac[n - m]); }
} F(N, 1e9 + 7);
struct BaseFenwick
{
	vector<ll> v;
	BaseFenwick(int n) : v(n, 0) {}
	void add(int x, ll w)
	{
		for (; x < v.size(); x += x & -x)
			v[x] = F.add(v[x], w);
	}
	ll ask(int x)
	{
		ll ans = 0;
		for (; x; x -= x & -x)
			ans = F.add(ans, v[x]);
		return ans;
	}
};
int n, p[N], b[N], ans;
int main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i)
		scanf("%d", &p[i]), b[i] = 1;
	for (int i = 2; i <= n; ++i)
	{
		int cnt = 0;
		BaseFenwick t(N);
		for (int j = 1; j <= n; ++j)
		{
			t.add(p[j], b[j]);
			cnt = F.add(cnt, b[j] = t.ask(p[j] - 1));
		}
		ans = F.add(ans, cnt * F.pow(i, n));
		for (int j = i - 1; j; --j)
		{
			cnt = F.mul(cnt, F.M - 1);
			ans = F.add(ans, F.mul(cnt, F.mul(F.c(i, j), F.pow(j, n))));
		}
	}
	printf("%d", F.add(ans, n));
}
```
