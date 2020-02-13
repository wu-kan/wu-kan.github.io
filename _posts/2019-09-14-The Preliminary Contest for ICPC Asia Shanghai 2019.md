---
title: The Preliminary Contest for ICPC Asia Shanghai 2019
tags:
  - ACM
  - 题解
---

## [Maomao's candy](https://nanti.jisuanke.com/t/41407)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Mod
{
	const ll M;
	Mod(ll M) : M(M) {}
	ll qadd(ll &a, ll b) const { return a += b, a >= M ? a -= M : a; }
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }
	ll mul(ll a, ll b) const { return add(a * b, -M * ll((long double)a / M * b)); }
} M(1025436931);
typedef array<array<ll, 2>, 2> Mat;
Mat operator*(const Mat &a, const Mat &b)
{
	Mat r;
	for (int i = 0; i < r.size(); ++i)
		for (int j = 0; j < r.size(); ++j)
			for (int k = r[i][j] = 0; k < r.size(); ++k)
				M.qadd(r[i][j], M.mul(a[i][k], b[k][j]));
	return r;
}
Mat pow(Mat a, ll b)
{
	Mat r;
	for (int i = 0; i < r.size(); ++i)
		for (int j = 0; j < r[i].size(); ++j)
			r[i][j] = i == j;
	for (; b; b >>= 1, a = a * a)
		if (b & 1)
			r = r * a;
	return r;
}
int main()
{
	int t, n, m, x1, y1, x2, y2;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d%d%d%d%d", &n, &m, &x2, &y2, &x1, &y1);
		if (x1 > x2)
			x1 = n - x1 + 1, x2 = n - x2 + 1;
		if (y1 > y2)
			y1 = m - y1 + 1, y2 = m - y2 + 1;
		if (n < m)
			swap(n, m), swap(x1, y1), swap(x2, y2);
		int ans = (x2 - 1) + (y2 - 1) - 1, dx = x2 - x1, dy = y2 - y1;
		if (m == 1)
			ans = (x1 + x2) & 1 ? x2 - 1 : x2 - 2;
		else if ((x1 + x2 + y1 + y2) & 1)
			ans = -1;
		else
		{
			if (dx > dy)
				ans = max(ans, (x2 - 1) + (m - y2) - 1);
			if (dy > dx)
				ans = max(ans, (n - x2) + (y2 - 1) - 1);
		}
		if (ans < 0)
			printf("countless\n");
		else
		{
			Mat a;
			a[0] = {0, 1};
			a[1] = {1, 1};
			a = pow(a, ans);
			printf("%lld\n", M.add(M.add(a[0][1], a[1][1]), M.M - 1));
		}
	}
}
```

## [Dudu's maze](https://nanti.jisuanke.com/t/41402)

由于只有一个 magic portal，先把当前所在的连通块的糖果全拿走，之 后在第一次遇到敌人的时候使用肯定是最优的。 先用并查集将没有敌人的点合并起来，用一个数组存放该连通块所含点的 数量（称作权值），再用搜索搜出和起点所在连通块相连的怪物点，把这些怪 物点枚举一下，遍历连接这个怪物点的所有边，求边的另一端的连通块的权值 （1 这个点所在连通块的权值要改为 0，因为已经拿过了），求和之后再除以与 该点相连的边数，取最大值，加上 1 所在连通块的权重即可。 因为遇到敌人是随机选择边逃跑，因此遇到重边的时候连通块的权值要累 计多次。同时也是除以连接的边数而不是连接的连通块数量或者房间数量。拿 到的糖果数量至少是 1 所在连通块的权重值，不论经过哪里，都一定能拿到那 些糖果，所以最后答案直接加上即可

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef double lf;
struct Graph
{
	struct Vertex
	{
		vector<int> o;
	};
	typedef pair<int, int> Edge;
	vector<Vertex> v; //点集
	vector<Edge> e;   //边集
	Graph(int n) : v(n) {}
	void add(const Edge &ed)
	{
		v[ed.first].o.push_back(e.size());
		e.push_back(ed);
	}
};
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
			at(w) = u, siz[u] += siz[w];
	}
	int ask(int u) { return at(u) != u ? at(u) = ask(at(u)) : u; }
};
int main()
{
	int t, n, m, k;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d%d", &n, &m, &k);
		Graph g(n), h(n);
		UnionfindSet ufs(n);
		vector<int> x(n, 0);
		for (int i = 0, a, b; i < m; ++i)
		{
			scanf("%d%d", &a, &b);
			g.add({a - 1, b - 1});
			g.add({b - 1, a - 1});
		}
		for (int i = 0, t; i < k; ++i)
			scanf("%d", &t), x[t - 1] = 1;
		for (auto e : g.e)
			if (!x[e.first] && !x[e.second])
				ufs.merge(e.first, e.second);
		lf ans = 0;
		for (int i = 0, adj; i < n; ++i)
			if (x[i])
			{
				lf sum = adj = 0;
				for (auto k : g.v[i].o)
					if (!x[g.e[k].second])
					{
						if (ufs.ask(g.e[k].second) == ufs.ask(0))
							adj = 1;
						else
							sum += ufs.siz[ufs.ask(g.e[k].second)];
					}
				if (adj)
					ans = max(ans, sum / g.v[i].o.size());
			}
		printf("%.9lf\n", ans + ufs.siz[ufs.ask(0)]);
	}
}
```

## [Dawn-K's water](https://nanti.jisuanke.com/t/41401)

背包搞一搞。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1023, INF = 1e9 + 9;
int main()
{
	for (int n, m; ~scanf("%d%d", &n, &m);)
	{
		vector<int> f(2e4 + 9, INF);
		for (int i = f[0] = 0, p, c; i < n; ++i)
		{
			scanf("%d%d", &p, &c);
			for (int j = c; j < f.size(); ++j)
				f[j] = min(f[j], f[j - c] + p);
		}
		pair<int, int> ans(INF, INF);
		for (int i = m; i < f.size(); ++i)
			ans = min(ans, {f[i], -i});
		printf("%d %d\n", ans.first, -ans.second);
	}
}
```

## [Fish eating fruit](https://nanti.jisuanke.com/t/41403)

树上 DP 搞一搞。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Mod
{
	const ll M, SM;
	Mod(ll M) : M(M), SM(sqrt(M) + 0.5) {}
	ll qadd(ll &a, ll b) const { return a += b, a >= M ? a -= M : a; } //假如a和b都已经在同余系内，就不必取模了，取模运算耗时很高
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }	  //考虑a和b不在同余系内甚至为负数的情况
	ll mul(ll a, ll b) const { return add(a * b, M); }
	ll inv(ll a) const { return pow(a, M - 2); } //要求M为素数，否则return pow(a, phi(M) - 1);
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a = add(a, M); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
	/*
	ll mul(ll a, ll b) const { return add(a * b, -M * ll((long double)a / M * b)); }
	ll mul(ll a, ll b) const //无循环快速计算同余乘法，根据a*b是否爆ll替换a*b%M，需要a<M且b<M，可以调用时手动取模
	{
		ll c = a / SM, d = b / SM;
		a %= SM, b %= SM;
		ll e = add(add(a * d, b * c), c * d / SM * (SM * SM - M));
		return add(add(a * b, e % SM * SM), add(c * d % SM, e / SM) * (SM * SM - M));
	}
	ll inv(ll a) const
	{ //模m下a的乘法逆元，不存在返回-1（m为素数时a不为0必有逆元）
		ll x, y, d = gcd(a, M, x, y);
		return d == 1 ? add(x, M) : -1;
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
	*/
} M(1e9 + 7);
struct Graph
{
	struct Vertex
	{
		vector<int> o;
		vector<ll> ans, sum, cnt;
	};
	struct Edge
	{
		int first, second;
		ll len; //边长、容量，图论算法使用
	};
	vector<Vertex> v; //点集
	vector<Edge> e;   //边集
	Graph(int n) : v(n) {}
	void add(const Edge &ed)
	{
		v[ed.first].o.push_back(e.size());
		e.push_back(ed);
	}
	void dp(int u, int fa)
	{
		v[u].ans.assign(3, 0);
		v[u].sum.assign(3, 0);
		v[u].cnt.assign(3, 0);
		int to;
		for (auto k : v[u].o)
			if (to = e[k].second, to != fa)
			{
				dp(to, u);
				for (int i = 0; i < 3; ++i)
					for (int j = 0; j < 3; ++j)
					{
						M.qadd(v[u].sum[(i + j + e[k].len) % 3], M.mul(v[u].ans[i], v[to].cnt[j]));
						M.qadd(v[u].sum[(i + j + e[k].len) % 3], M.mul(v[u].cnt[i], v[to].ans[j]));
						M.qadd(v[u].sum[(i + j + e[k].len) % 3], M.mul(M.mul(v[u].cnt[i], v[to].cnt[j]), e[k].len));
					}
				for (int i = 0; i < 3; ++i)
				{
					M.qadd(v[u].sum[(i + e[k].len) % 3], v[u].ans[i]);
					M.qadd(v[u].sum[(i + e[k].len) % 3], M.mul(v[u].cnt[i], e[k].len));
				}
				//cerr << v[u].sum[0] << endl;
				for (int i = 0; i < 3; ++i)
				{
					M.qadd(v[u].cnt[(i + e[k].len) % 3], v[to].cnt[i]);
					M.qadd(v[u].ans[(i + e[k].len) % 3], v[to].ans[i]);
					M.qadd(v[u].ans[(i + e[k].len) % 3], M.mul(e[k].len, v[to].cnt[i]));
				}
				M.qadd(v[u].cnt[e[k].len % 3], 1);
				M.qadd(v[u].ans[e[k].len % 3], e[k].len);
			}
		/*
		for (int i = 0; i < 3; ++i)
			for (int j = 0; j < i; ++j)
			{
				M.qadd(v[u].sum[(i + j) % 3], M.mul(v[u].cnt[j], v[u].ans[i]));
				M.qadd(v[u].sum[(i + j) % 3], M.mul(v[u].cnt[i], v[u].ans[j]));
			}
		*/
		/*
		for (int i = 0; i < 3; ++i)
			cerr << v[u].ans[i] << ',' << v[u].cnt[i] << ',' << v[u].sum[i] << '!';
		cerr << u << endl;*/
	}
};
int main()
{
	for (int n; ~scanf("%d", &n);)
	{
		Graph g(n);
		for (int i = 1, x, y, z; i < n; ++i)
		{
			scanf("%d%d%d", &x, &y, &z);
			g.add({x, y, z});
			g.add({y, x, z});
		}
		g.dp(0, -1);
		for (ll i = 0, ans; i < 3; ++i)
		{
			for (ll j = ans = 0; j < n; ++j)
			{
				M.qadd(ans, g.v[j].sum[i]);
				M.qadd(ans, g.v[j].ans[i]);
			}
			printf("%lld%c", M.mul(2, ans), " \n"[i == 2]);
		}
	}
}
```

## [Honk's pool](https://nanti.jisuanke.com/t/41406)

```cpp
#include <bits/stdc++.h>
#define ll long long
#define int ll
#define maxn 500005
using namespace std;
int a[maxn];
struct pa
{
	int val, num;
} p[maxn], p2[maxn];
int n, k, ct;
int sum[maxn], tt, ct1, ct2, val1, val2;
ll summ, req;
signed main(void)
{
	//freopen("qet","r",stdin);
	while (~scanf("%lld%lld", &n, &k))
	{
		req = summ = ct1 = ct2 = tt = val1 = val2 = ct = 0;
		for (int i = 1; i <= n; i++)
			scanf("%lld", &a[i]), summ += a[i];
		sort(a + 1, a + n + 1);

		if (summ % n == 0)
		{
			val1 = summ / n;
			for (int i = 1; i <= n; i++)
				req += abs(val1 - a[i]);
			if (req <= 2 * k)
			{
				printf("0\n");
				continue;
			}
		}
		else
		{
			val1 = summ / n;
			val2 = val1 + 1;
			ct2 = summ % n;
			ct1 = n - ct2;
			for (int i = 1; i <= ct1; i++)
				req += abs(val1 - a[i]);
			for (int i = n; i > ct1; i--)
				req += abs(val2 - a[i]);
			if (req <= 2 * k)
			{
				printf("1\n");
				continue;
			}
		}
		for (int i = 1; i <= n; i++)
		{
			if (a[i] == a[i - 1])
				p[ct].num++;
			else
				p[++ct].val = a[i], p[ct].num = 1;
		}
		for (int i = 1; i <= ct; i++)
		{
			sum[i] = sum[i - 1] + p[i].num;
		}
		int ans = a[n] - a[1], pt1 = 1, pt2 = ct, temk = k;
		while (k >= sum[pt1])
		{
			int tem = min(k / sum[pt1], p[pt1 + 1].val - p[pt1].val);
			k -= tem * sum[pt1];
			ans -= tem;
			//cout<<tem<<" "<<k<<" "<<ans<<endl;
			pt1++;
		}
		k = temk;
		while (k >= sum[ct] - sum[pt2 - 1])
		{
			int tem = min(k / (sum[ct] - sum[pt2 - 1]), p[pt2].val - p[pt2 - 1].val);
			k -= tem * (sum[ct] - sum[pt2 - 1]);
			ans -= tem;
			//cout<<tem<<" "<<k<<" "<<ans<<endl;
			pt2--;
		}
		cout << ans << endl;
	}
}
```

## [Guanguan's Happy water](https://nanti.jisuanke.com/t/41411)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
struct Mod
{
	const ll M, SM;
	Mod(ll M) : M(M), SM(sqrt(M) + 0.5) {}
	ll qadd(ll &a, ll b) const { return a += b, a >= M ? a -= M : a; } //假如a和b都已经在同余系内，就不必取模了，取模运算耗时很高
	ll add(ll a, ll b) const { return qadd(a = (a + b) % M, M); }	  //考虑a和b不在同余系内甚至为负数的情况
	ll mul(ll a, ll b) const { return add(a * b, M); }
	ll inv(ll a) const { return pow(a, M - 2); } //要求M为素数，否则return pow(a, phi(M) - 1);
	ll pow(ll a, ll b) const
	{
		ll r = 1;
		for (a = add(a, M); b; b >>= 1, a = mul(a, a))
			if (b & 1)
				r = mul(r, a);
		return r;
	}
	/*
	ll mul(ll a, ll b) const { return add(a * b, -M * ll((long double)a / M * b)); }
	ll mul(ll a, ll b) const //无循环快速计算同余乘法，根据a*b是否爆ll替换a*b%M，需要a<M且b<M，可以调用时手动取模
	{
		ll c = a / SM, d = b / SM;
		a %= SM, b %= SM;
		ll e = add(add(a * d, b * c), c * d / SM * (SM * SM - M));
		return add(add(a * b, e % SM * SM), add(c * d % SM, e / SM) * (SM * SM - M));
	}
	ll inv(ll a) const
	{ //模m下a的乘法逆元，不存在返回-1（m为素数时a不为0必有逆元）
		ll x, y, d = gcd(a, M, x, y);
		return d == 1 ? add(x, M) : -1;
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
	*/
} M(1e9 + 7);
ll t, k, n, a[255];
int main()
{
	for (scanf("%lld", &t); t--;)
	{
		scanf("%lld%lld", &k, &n);
		for (int i = 0; i < k * 2; ++i)
			scanf("%lld", &a[i]);
		if (n <= k)
		{
			ll ans = 0;
			for (int i = 0; i < n; ++i)
				ans = M.add(ans, a[i]);
			printf("%lld\n", ans);
			continue;
		}
		ll ans = 0, sum = 0;
		for (int i = 0; i < k; ++i)
			ans = M.add(ans, a[i]), sum = M.add(sum, a[i + k]);
		M.qadd(ans, M.mul(sum, (n - k) / k % M.M));
		n %= k;
		for (int i = 0; i < n; ++i)
			ans = M.add(ans, a[i + k]);
		printf("%lld\n", ans);
	}
}
```
