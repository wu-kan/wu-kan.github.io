---
title: 2017 ACM-ICPC Asia Tehran Regional Contest
categories: [ACM,题解]
date: 2019-01-23 18:00:00
---
{% raw %}
# [Sim Card](https://vjudge.net/problem/UVALive-8321)
```cpp
#include <bits/stdc++.h>
using namespace std;
vector<pair<int, int>> v{{30, 40}, {35, 30}, {40, 20}};
int main()
{
	for (int c, d; ~scanf("%d%d", &c, &d) && (c || d);)
	{
		int ans = 1e9;
		for (auto p : v)
			ans = min(ans, c * p.first + d * p.second);
		printf("%d\n", ans);
	}
}
```
# [Bank Card Verifier](https://vjudge.net/problem/UVALive-8322)
```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	for (char s[31]; ~scanf("%s%s%s%s", s, s + 4, s + 8, s + 12) && strcmp(s, "0000000000000000");)
	{
		int sum = 0;
		for (int i = 0; s[i]; ++i)
		{
			int t = s[i] - '0';
			if (i % 2 == 0)
				t <<= 1;
			if (t > 9)
				t -= 9;
			sum += t;
		}
		printf(sum % 10 ? "No\n" : "Yes\n");
	}
}
```
# [World Cup Draw](https://vjudge.net/problem/UVALive-8324)
```cpp
#include <bits/stdc++.h>
using namespace std;
unordered_map<string, pair<int, string>> mp{
	{"Russia", {65, "UEFA"}},
	{"Spain", {8, "UEFA"}},
	{"Denmark", {19, "UEFA"}},
	{"Serbia", {38, "UEFA"}},
	{"Germany", {1, "UEFA"}},
	{"Peru", {10, "CONMEBOL"}},
	{"Iceland", {21, "UEFA"}},
	{"Nigeria", {41, "CAF"}},
	{"Brazil", {2, "CONMEBOL"}},
	{"Switzerland", {11, "UEFA"}},
	{"CostaRica", {22, "CONCACAF"}},
	{"Australia", {43, "AFC"}},
	{"Portugal", {3, "UEFA"}},
	{"England", {12, "UEFA"}},
	{"Sweden", {25, "UEFA"}},
	{"Japan", {44, "AFC"}},
	{"Argentina", {4, "CONMEBOL"}},
	{"Colombia", {13, "CONMEBOL"}},
	{"Tunisia", {28, "CAF"}},
	{"Morocco", {48, "CAF"}},
	{"Belgium", {5, "UEFA"}},
	{"Mexico", {16, "CONCACAF"}},
	{"Egypt", {30, "CAF"}},
	{"Panama", {49, "CONCACAF"}},
	{"Poland", {6, "UEFA"}},
	{"Uruguay", {17, "CONMEBOL"}},
	{"Senegal", {32, "CAF"}},
	{"SouthKorea", {62, "AFC"}},
	{"France", {7, "UEFA"}},
	{"Croatia", {18, "UEFA"}},
	{"Iran", {34, "AFC"}},
	{"SaudiArabia", {63, "AFC"}}};
void split(const string &s, char c, vector<string> &v)
{
	istringstream sin(s);
	for (string s; getline(sin, s, c);)
	{
		for (int n; n = s.find(' '), n != s.npos;)
			s.erase(n, 1);
		if (!s.empty())
			v.push_back(s);
	}
}
bool dfs(int x, int y, const vector<vector<string>> &s, vector<vector<string>> &t)
{
	if (y >= s[0].size())
		return dfs(x + 1, 0, s, t);
	if (x >= s.size())
	{
		vector<pair<int, char>> ans(s[0].size());
		for (int i = 0; i < ans.size(); ++i)
		{
			for (int j = 0; j < t.size(); ++j)
				ans[i].first += mp[t[j][i]].first;
			ans[i].second = i + 'A';
		}
		sort(ans.begin(), ans.end());
		for (auto p : ans)
			cout << p.second << ' ' << p.first << '\n';
		return 1;
	}
	for (int i = 0; i < t[x].size(); ++i)
		if (t[x][i].empty())
		{
			int cnt = mp[s[x][y]].second != "UEFA";
			for (int j = 0; j < x; ++j)
				if (mp[t[j][i]].second == mp[s[x][y]].second)
					++cnt;
			if (cnt < 2)
			{
				t[x][i] = s[x][y];
				if (dfs(x, y + 1, s, t))
					return 1;
				t[x][i].clear();
			}
		}
	return 0;
}
int main()
{
	for (string s; getline(cin, s), s != "End";)
	{
		vector<vector<string>> v(4), vv(4, vector<string>(8));
		split(s, ',', v[0]);
		for (int i = 1; i < v.size(); ++i)
			getline(cin, s), split(s, ',', v[i]);
		dfs(0, 0, v, vv);
	}
}
```
# [Barareh on Fire](https://vjudge.net/problem/UVALive-8325)
```cpp
#include <bits/stdc++.h>

using namespace std;
const int N=1e2+10;

int n, m, k;
char a[N][N];

int dx[]= {-1, 1, 0, 0,-1,-1, 1, 1};
int dy[]= { 0, 0,-1, 1, 1,-1,-1, 1};
int first, Extended, ans;

struct Node {
	int x, y, w;
};
queue<Node> Q, F;

int people() {
	int up;
	if (first==1) {
		up=k-1;
		first=0;
		Extended=1;
	}
	else {
		up=k;
	}
	
	for(int i=1; i<=up; i++) {
		int sz=Q.size();
		if (!sz) break;
		for(int i=1; i<=sz; i++) {
			Node u=Q.front();Q.pop();
			for(int i=0; i<4; i++) {
				int Nx=u.x+dx[i];
				int Ny=u.y+dy[i];
				int Nw=u.w+1;
				if (Nx<1||Nx>n||Ny<1||Ny>m) continue;
				if (a[Nx][Ny]=='t') return Nw;
				if (a[Nx][Ny]!='-') continue;
				a[Nx][Ny]='#';
				Q.push(Node{Nx, Ny, Nw});
				Extended=1;
			}
		}
	}
	return 0;
}

void fire() {
	int sz=F.size();
	if (!sz) return;
	for(int i=1; i<=sz; i++) {
		Node u=F.front();F.pop();
		for(int i=0; i<8; i++) {
			int Nx=u.x+dx[i];
			int Ny=u.y+dy[i];
			int Nw=u.w+1;
			if (Nx<1||Nx>n||Ny<1||Ny>m) continue;
			if (a[Nx][Ny]=='f') continue;
			a[Nx][Ny]='f';
			F.push(Node{Nx, Ny, Nw});
			Extended=1;
		}
	}
}

int main() {
	//freopen("e.in", "r", stdin);
	while(scanf("%d %d %d", &n, &m, &k)) {
		if (!n&&!m&&!k) break;
		while(!Q.empty()) Q.pop();
		while(!F.empty()) F.pop();
		for(int i=1; i<=n; i++) {
			for(int j=1; j<=m; j++) {
				cin>>a[i][j];
				if (a[i][j]=='s') {
					Q.push(Node {i, j, 0});
				}
				if (a[i][j]=='f') {
					F.push(Node {i, j, 0});
				}
			}
		}

		first=1;
		Extended=1;
		while(Extended) {
			Extended=0;
			ans=people();
//			cout<<"ans="<<ans<<endl;
			if (ans) break;
			fire();
		}
//		for(int i=1; i<=n; i++) {
//			for(int j=1; j<=m; j++) {
//				cout<<a[i][j];
//			}
//			cout<<endl;
//		}
		if (ans) cout<<ans<<endl;
		else cout<<"Impossible"<<endl;
	}
	return 0;
}
```
# [Column Addition](https://vjudge.net/problem/UVALive-8328)
```cpp
#include <bits/stdc++.h>

using namespace std;
const int N = 1e3 + 10;

int n;
char A[N], B[N], C[N];
int a[N], b[N], c[N];
int dp[N][2];

int main()
{
	//	freopen("h.in", "r", stdin);
	while (scanf("%d", &n))
	{
		if (!n)
			break;
		scanf("%s", A + 1);
		scanf("%s", B + 1);
		scanf("%s", C + 1);
		for (int i = 1; i <= n; i++)
		{
			a[i] = A[i] - '0';
			b[i] = B[i] - '0';
			c[i] = C[i] - '0';
		}
		memset(dp, 0x3f, sizeof(dp));
		dp[n + 1][0] = 0;
		for (int i = n; i >= 1; i--)
		{
			dp[i][1] = min(dp[i][1], dp[i + 1][1] + 1);
			dp[i][0] = min(dp[i][0], dp[i + 1][0] + 1);
			if (a[i] + b[i] == c[i] + 10)
			{
				dp[i][1] = min(dp[i][1], dp[i + 1][0]);
			}
			else if (a[i] + b[i] + 1 == c[i] + 10)
			{
				dp[i][1] = min(dp[i][1], dp[i + 1][1]);
			}
			else if (a[i] + b[i] == c[i])
			{
				dp[i][0] = min(dp[i][0], dp[i + 1][0]);
			}
			else if (a[i] + b[i] + 1 == c[i])
			{
				dp[i][0] = min(dp[i][0], dp[i + 1][1]);
			}
		}
		cout << dp[1][0] << endl;
	}
	return 0;
}
```
# [Cafe Bazaar](https://vjudge.net/problem/UVALive-8329)
```cpp
#include <bits/stdc++.h>
#define L first
#define R second
using namespace std;
typedef long long ll;
ll trans(ll a[])
{
	ll r = 0;
	for (ll i = 0; i < 5; ++i)
		r = r * 256 + a[i];
	return r;
}
int main()
{
	for (ll n; ~scanf("%lld", &n) && n;)
	{
		vector<pair<ll, ll>> v;
		for (ll a[5], t, m; n--;)
		{
			char c;
			scanf("%lld.%lld.%lld.%lld.%lld%c", &a[0], &a[1], &a[2], &a[3], &a[4], &c);
			t = trans(a);
			if (c == '-')
			{
				scanf("%lld.%lld.%lld.%lld.%lld", &a[0], &a[1], &a[2], &a[3], &a[4]);
				v.push_back({t, trans(a)});
			}
			else
			{
				scanf("%lld", &m);
				v.push_back({t, t + (1LL << 40 - m) - 1});
			}
		}
		sort(v.begin(), v.end());
		vector<pair<ll, ll>> vp(1, v[0]);
		for (auto p : v)
		{
			if (p.L > vp.back().R + 1)
				vp.push_back(p);
			else
				vp.back().R = max(vp.back().R, p.R);
		}
		v.clear();
		for (auto p : vp)
			while (p.L <= p.R)
				for (ll i = 40; ~i; --i)
					if (p.L >> i << i == p.L && p.L + (1LL << i) - 1 <= p.R)
					{
						v.push_back({p.L >> i << i, 40 - i});
						p.L += 1LL << i;
						break;
					}
		printf("%d\n", v.size());
		for (ll i = 0, a[5]; i < v.size(); ++i)
		{
			for (ll j = 0; j < 5; ++j)
				a[j] = v[i].L % 256, v[i].L /= 256;
			for (ll j = 4; ~j; --j)
				printf("%lld%c", a[j], j ? '.' : '/');
			printf("%lld\n", v[i].R);
		}
	}
}
```
# [Mars](https://vjudge.net/problem/UVALive-8331)
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 1e5 + 7, M1 = 1e7 + 3, M2 = 998244353;
int tot, ans;
bool p[N];
char s[N];
ll b[N], c[N], an[N], f[N], g[N];
ll h[M1 + 7], to[M1 + 7];
struct Node
{
	int x, y, z, f;
	bool operator<(const Node &b) const
	{
		return z != b.z ? z < b.z : y < b.y;
	}
} a[N];
void ins(ll x, ll y)
{
	ll t = x;
	while (h[t] != -1 && h[t] != y)
		t = (t + 1) % M1;
	if (h[t] == -1)
	{
		to[++tot] = t;
		h[t] = y;
	}
}
bool check(ll x, ll y)
{
	ll t = x;
	while (h[t] != -1 && h[t] != y)
		t = (t + 1) % M1;
	if (h[t] == -1)
		return 1;
	else
		return 0;
}
void dfs(int x, int n, ll t1, ll t2, int y, int z)
{
	if (ans)
		return;
	if (check(t1, t2))
	{
		ans = y;
		return;
	}
	if (x > y)
		return;
	for (int i = z; i <= n; i++)
	{
		if (p[i])
			continue;
		ll tt1 = (t1 - c[i] * 1LL * f[n - i] % M1 + M1) % M1, tt2 = (t2 - c[i] * 1LL * g[n - i] % M2 + M2) % M2;
		p[i] = 1;
		c[i] ^= 1;
		tt1 = (tt1 + c[i] * 1LL * f[n - i] % M1) % M1;
		tt2 = (tt2 + c[i] * 1LL * g[n - i] % M2) % M2;
		dfs(x + 1, n, tt1, tt2, y, i + 1);
		p[i] = 0;
		c[i] ^= 1;
	}
}
void bfs(int n)
{
	ll t1 = 0, t2 = 0;
	ans = 0;
	for (int i = 1; i <= n; i++)
		t1 = (t1 * 1LL * 2 % M1 + c[i]) % M1, t2 = (t2 * 1LL * 2 % M2 + c[i]) % M2;
	for (int i = 1; i <= n; i++)
	{
		dfs(1, n, t1, t2, i, 1);
		if (ans)
			break;
	}
}
int main()
{
	f[0] = g[0] = 1;
	for (int i = 1; i <= 100000; i++)
		f[i] = f[i - 1] * 1LL * 2 % M1, g[i] = g[i - 1] * 1LL * 2 % M2;
	for (int i = 0; i < M1; i++)
		h[i] = -1;
	for (int n, m; ~scanf("%d%d%s", &n, &m, s + 1) && (n || m);)
	{
		for (int i = 1; i <= n; i++)
			b[i] = s[i] - '0';
		for (int i = 1; i <= m; i++)
		{
			scanf("%d%d", &a[i].x, &a[i].y);
			a[i].z = a[i].y - a[i].x + 1;
			a[i].f = i;
		}
		sort(a + 1, a + 1 + m);
		for (int i = 1; i <= m;)
		{
			int j = 1;
			while (a[i].z == a[i + j].z)
				j++;
			ll t = a[i].z, t1 = 0, t2 = 0;
			for (int k = 1; k <= t; k++)
				t1 = (t1 * 1LL * 2 % M1 + b[k]) % M1, t2 = (t2 * 1LL * 2 % M2 + b[k]) % M2;
			tot = 0;
			ins(t1, t2);
			for (int k = t + 1; k <= n; k++)
			{
				t1 = ((t1 * 1LL * 2 % M1 + b[k]) % M1 - f[t] * 1LL * b[k - t] % M1 + M1) % M1;
				t2 = ((t2 * 1LL * 2 % M2 + b[k]) % M2 - g[t] * 1LL * b[k - t] % M2 + M2) % M2;
				ins(t1, t2);
			}
			for (int k = i; k < i + j; k++)
			{
				int tt = 0;
				for (int l = a[k].x; l <= a[k].y; l++)
					c[++tt] = b[l];
				bfs(tt);
				an[a[k].f] = ans;
			}
			for (int k = 1; k <= tot; k++)
				h[to[k]] = -1;
			i += j;
		}
		for (int i = 1; i <= m; i++)
		{
			if (an[i])
				printf("%lld\n", an[i]);
			else
				printf("Impossible\n");
		}
	}
}
```
{% endraw %}