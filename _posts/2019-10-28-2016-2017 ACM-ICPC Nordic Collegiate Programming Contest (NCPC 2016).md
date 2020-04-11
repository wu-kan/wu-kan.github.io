---
title: 2016-2017 ACM-ICPC Nordic Collegiate Programming Contest (NCPC 2016)
tags:
  - ACM
  - 题解
---

## [Artwork](https://vjudge.net/problem/Gym-101550A)

先全部读进来离线处理完，然后反推回之前每一步的答案即可。

```cpp
#include <bits/stdc++.h>
using namespace std;
struct UnionfindSet : vector<int>
{
	int siz;
	UnionfindSet(int n) : vector<int>(n), siz(n)
	{
		for (int i = 0; i < n; ++i)
			at(i) = i;
	}
	void merge(int u, int w)
	{
		if (w = ask(w), u = ask(u), w != u)
			at(w) = u, --siz;
	}
	int ask(int u) { return at(u) != u ? at(u) = ask(at(u)) : u; }
} ufs(0);
#define X first
#define Y second
typedef pair<int, int> pii;
const int N = 1023;
pair<pii, pii> p[N * N];
int n, m, q, cnt[N][N], vis[N][N], ans[N];
int main()
{
	scanf("%d%d%d", &n, &m, &q);
	ufs = UnionfindSet(n * m);
	for (int k = 0; k < q; ++k)
	{
		scanf("%d%d%d%d", &p[k].X.X, &p[k].X.Y, &p[k].Y.X, &p[k].Y.Y);
		--p[k].X.X, --p[k].X.Y, --p[k].Y.X, --p[k].Y.Y;
		for (int i = p[k].X.X; i <= p[k].Y.X; ++i)
			for (int j = p[k].X.Y; j <= p[k].Y.Y; ++j)
				++cnt[i][j];
	}
	int dark = 0;
	for (int i = 0; i < n; ++i)
		for (int j = 0; j < m; ++j)
		{
			if (!cnt[i][j])
				for (deque<pii> q(1, pii(i, j)); !q.empty(); q.pop_front())
				{
					int x = q.front().X, y = q.front().Y;
					vis[x][y] = 1;
					ufs.merge(i * m + j, x * m + y);
#define WORK(x, y)                                  \
	if (0 <= (x) && (x) < n && 0 <= (y) && (y) < m) \
		if (!cnt[x][y] && !vis[x][y])               \
		{                                           \
			q.push_back(pii(x, y));                 \
			vis[x][y] = 1;                          \
		}
					WORK(x, y + 1);
					WORK(x, y - 1);
					WORK(x - 1, y);
					WORK(x + 1, y);
				}
			else
				++dark;
		}
	ans[q - 1] = ufs.siz - dark;
	for (int k = q - 1; k >= 1; --k)
	{
		for (int i = p[k].X.X; i <= p[k].Y.X; ++i)
			for (int j = p[k].X.Y; j <= p[k].Y.Y; ++j)
				if (!--cnt[i][j])
				{
#define ADD(x, y)                                   \
	if (0 <= (x) && (x) < n && 0 <= (y) && (y) < m) \
		if (!cnt[x][y])                             \
			ufs.merge(i *m + j, (x)*m + (y));
					ADD(i - 1, j);
					ADD(i + 1, j);
					ADD(i, j - 1);
					ADD(i, j + 1);
					--dark;
				}
		ans[k - 1] = ufs.siz - dark;
	}
	for (int k = 0; k < q; ++k)
		printf("%d\n", ans[k]);
}
```

## [Bless You Autocorrect!](https://vjudge.net/problem/Gym-101550B)

队友做的，建一棵 Trie 树即可。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int maxm = 1e6 + 9;
int n, m, ans, col;
int nL[maxm], head[maxm], tail[maxm], h[maxm], t[maxm];
char ch[maxm];
struct node
{
	int rk, num[31];
} tree[maxm];
int NewNode()
{
	col++;
	tree[col].rk = 0;
	for (int i = 0; i < 26; i++)
		tree[col].num[i] = 0;
	return col;
}
void add(int k, int fir, int L)
{
	for (int i = 0; i < L; i++)
	{
		if (tree[k].num[ch[i] - 'a'])
			k = tree[k].num[ch[i] - 'a'];
		else
		{
			tree[k].num[ch[i] - 'a'] = NewNode();
			k = tree[k].num[ch[i] - 'a'];
		}
		if (!tree[k].rk)
			tree[k].rk = fir;
	}
}
void query(int k, int L)
{
	int i = 0, K = k;
	for (i = 0; i < L; i++)
	{
		if (tree[k].num[ch[i] - 'a'])
			k = tree[k].num[ch[i] - 'a'];
		else
			break;
		if (!head[tree[k].rk])
		{
			head[tree[k].rk] = i + 1;
			h[tree[k].rk] = k;
		}
		tail[tree[k].rk] = i + 1;
		t[tree[k].rk] = k;
	}
	k = K;
	for (i = 0; i < L; i++)
	{
		ans++;
		if (tree[k].num[ch[i] - 'a'])
			k = tree[k].num[ch[i] - 'a'];
		else
			break;
		if (1 + nL[tree[k].rk] - tail[tree[k].rk] < tail[tree[k].rk] - (i + 1))
		{
			i = tail[tree[k].rk] - 1;
			ans += 1 + nL[tree[k].rk] - tail[tree[k].rk];
			k = t[tree[k].rk];
		}
	}
	if (i < L)
		ans += L - (i + 1);
}
int main()
{
	scanf("%d%d", &n, &m);
	int root = NewNode();
	for (int i = 1; i <= n; i++)
	{
		scanf("%s", ch);
		nL[i] = strlen(ch);
		add(root, i, nL[i]);
	}
	for (int i = 1; i <= m; i++)
	{
		scanf("%s", ch);
		int L = strlen(ch);
		ans = 0;
		query(root, L);
		printf("%d\n", ans);
	}
}
```

## [Card Hand Sorting](https://vjudge.net/problem/Gym-101550C)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int maxn = 63;
int n, ans = maxn;
int b[maxn], f[maxn], ok[maxn], ud[maxn], lin[maxn], app[maxn][maxn];
char ch[maxn];
struct Node
{
	int num, fl;
} a[maxn];
int lis()
{
	memset(f, 0, sizeof(f));
	for (int i = 1; i <= n; i++)
		for (int j = 0; j < i; j++)
			if (b[j] < b[i])
				f[i] = max(f[i], f[j] + 1);
	int Max = 0;
	for (int i = 1; i <= n; i++)
		Max = max(Max, f[i]);
	return Max;
}
void dfs2(int k)
{
	if (k > 4)
	{
		int t = 0;
		for (int i = 1; i <= 4; i++)
		{
			int now = lin[i];
			if (ud[now] == 0)
			{
				for (int j = 14; j >= 1; j--)
					if (app[now][j] > 0)
						app[now][j] = ++t;
			}
			else
			{
				for (int j = 1; j <= 14; j++)
					if (app[now][j] > 0)
						app[now][j] = ++t;
			}
		}
		for (int i = 1; i <= n; i++)
			b[i] = app[a[i].fl][a[i].num];

		ans = min(ans, n - lis());
		return;
	}
	ud[k] = 0;
	dfs2(k + 1);
	ud[k] = 1;
	dfs2(k + 1);
}

void dfs(int k)
{
	if (k > 4)
		return dfs2(1);
	for (int i = 1; i <= 4; i++)
		if (!ok[i])
		{
			ok[i] = 1;
			lin[k] = i;
			dfs(k + 1);
			ok[i] = 0;
		}
}
int main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; i++)
	{
		scanf("%s", ch);
		if (ch[0] == 'T')
			a[i].num = 10;
		else if (ch[0] == 'J')
			a[i].num = 11;
		else if (ch[0] == 'Q')
			a[i].num = 12;
		else if (ch[0] == 'K')
			a[i].num = 13;
		else if (ch[0] == 'A')
			a[i].num = 14;
		else
			a[i].num = ch[0] - '0';
		if (ch[1] == 's')
			a[i].fl = 1;
		else if (ch[1] == 'h')
			a[i].fl = 2;
		else if (ch[1] == 'd')
			a[i].fl = 3;
		else
			a[i].fl = 4;
		app[a[i].fl][a[i].num] = 1;
	}
	dfs(1);
	printf("%d", ans);
}
```

## [Daydreaming Stockbroker](https://vjudge.net/problem/Gym-101550D)

DP，每一步在上一步的结果下求这一天之后手上持有钱币数最多的情况和货物最多的情况。不要忘记同一时刻手上最多`100000`个货物。

```cpp
#include <bits/stdc++.h>
#define F first
#define S second
using namespace std;
typedef long long ll;
typedef pair<ll, ll> pll;
int main()
{
	ll d, a;
	vector<pll> v(2, pll(100, 0));
	for (scanf("%lld", &d); d--;)
	{
		scanf("%lld", &a);
		vector<pll> t = v;
		for (ll i = 0; i < v.size(); ++i)
		{
			ll num = min(v[i].F / a, 100000 - v[i].S);
			t.push_back(pll(v[i].F - num * a, v[i].S + num));
			num = v[i].S;
			t.push_back(pll(v[i].F + num * a, 0));
		}
		for (ll i = 0; i < t.size(); ++i)
		{
			if (v[0] < t[i])
				v[0] = t[i];
			if (pll(v[1].S, v[1].F) < pll(t[i].S, t[i].F))
				v[1] = t[i];
		}
	}
	printf("%lld", v[0].F);
}
```

## [Exponial](https://vjudge.net/problem/Gym-101550E)

队友做的这个题，因为做过[这一题](https://wu-kan.cn/_posts/2019-09-01-The-Preliminary-Contest-for-ICPC-Asia-Nanjing-2019/#super_log)，欧拉降幂的姿势很熟练。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll phi(ll n)
{
	ll phi = n;
	for (ll i = 2; i * i <= n; ++i)
		if (!(n % i))
			for (phi = phi / i * (i - 1); !(n % i);)
				n /= i;
	if (n > 1)
		phi = phi / n * (n - 1);
	return phi;
}
ll ksm(ll a, ll b, ll mod)
{
	ll ret = 1, tem = a;
	while (b)
	{
		if (b & 1)
			ret = ret * tem % mod;
		tem = tem * tem % mod;
		b >>= 1;
	}
	return ret;
}
int solve(int n, int m)
{
	if (m == 1)
		return 0;
	if (n == 1)
		return 1 % m;
	if (n == 2)
		return n % m;
	if (n == 3)
		return (ll)n * n % m;
	if (n == 4)
		return ksm(n, 9, m);
	if (n == 5)
		return ksm(n, 1 << 18, m);
	int faim = phi(m);
	return ksm(n, solve(n - 1, faim) + faim, m);
}
int main(void)
{
	int n, m;
	scanf("%d%d", &n, &m);
	printf("%d", solve(n, m));
}
```

## [Fleecing the Raffle](https://vjudge.net/problem/Gym-101550F)

求概率，手推一下即可。

```cpp
#include <bits/stdc++.h>
#define ld long double
using namespace std;
int n, m, p, k;
int main(void)
{
	scanf("%d%d", &n, &p);
	m = ceil((double)(n + 1 - p) / (p - 1));
	ld ans = 1;
	for (int i = 1; i < p; i++)
	{
		ans = ans * (n - i + 1);
		ans /= n + m + 1 - i;
	}
	ans /= n + m - p + 1;
	ans *= p;
	ans *= m;
	printf("%.9Lf", ans);
}
```

## [Game Rank](https://vjudge.net/problem/Gym-101550G)

毫无技术含量的模拟题。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e4 + 9;
char s[N];
int ask(int rk)
{
	if (21 <= rk && rk <= 25)
		return 2;
	if (16 <= rk && rk <= 20)
		return 3;
	if (11 <= rk && rk <= 15)
		return 4;
	if (1 <= rk && rk <= 10)
		return 5;
	return 1e9;
}
void inc(int &rk, int &star)
{
	if (++star > ask(rk))
		star = 1, --rk;
}
void dec(int &rk, int &star)
{
	if (!star && rk == 20 || rk >= 21)
		return;
	if (--star < 0)
		star = ask(++rk) - 1;
}
int main()
{
	scanf("%s", s);
	int rk = 25;
	for (int i = 0, win = 0, star = 0; s[i]; ++i)
	{
		if (s[i] == 'W')
		{
			if (++win >= 3 && 6 <= rk && rk <= 25)
				inc(rk, star);
			inc(rk, star);
		}
		else
		{
			win = 0;
			dec(rk, star);
		}
		if (rk <= 0)
			return printf("Legend"), 0;
	}
	printf("%d", rk);
}
```

## [Highest Tower](https://vjudge.net/problem/Gym-101550H)

```cpp
//待补
```

## [Interception](https://vjudge.net/problem/Gym-101550I)

```cpp
//无人通过的神仙题，待补
```

## [Jumbled Compass](https://vjudge.net/problem/Gym-101550J)

已经堕落到这种题要模拟去做了…

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int n1, n2, d1 = 0, d2 = 0;
	scanf("%d%d", &n1, &n2);
	while ((n1 + d1) % 360 != n2)
		++d1;
	while ((n1 + d2 + 360) % 360 != n2)
		--d2;
	printf("%d", abs(d2) < abs(d1) ? d2 : d1);
}
```

## [Keeping the Dogs Apart](https://vjudge.net/problem/Gym-101550K)

```cpp
//计算几何，和DogDistance这题很像
```
