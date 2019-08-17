---
title: Petrozavodsk Summer-2013. Moscow IPT Contest
categories:
- ACM
- 题解
---
## [Sum of Powers](https://vjudge.net/problem/EOlymp-6465)

```cpp
#include <bits/stdc++.h>
using namespace std;
vector<string> s;
void f(int n, int k)
{
	if (n > k)
	{
		cout << s[n - 1];
		return;
	}
	f(n - 1, k), f(n - 1, k);
}
int main(void)
{
	for (int n, k; ~scanf("%d%d", &n, &k);)
	{
		s.assign(1, "AB");
		for (int i = 1; i < n; ++i)
		{
			s.push_back(s.back());
			for (int j = 0; j < s[i - 1].size(); ++j)
				s[i].push_back(s[i - 1][j] == 'A' ? 'B' : 'A');
		}
		f(n, k);
	}
}
```

## [Dot Product](https://vjudge.net/problem/EOlymp-6467)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int NPOS = -1;
struct Mod
{
	const ll M;
	Mod(ll M) : M(M) {}
	ll add(ll a, ll b) const { return (a + b) % M; }
	ll mul(ll a, ll b) const { return add(a * b, M); }
} M(1e9 + 7);
struct SegmentTree
{
	struct Seg
	{
		int l, r;
		ll suma, sumb, ans;
		void upd(ll bdd, ll add)
		{
			ans = M.add(ans, M.mul(sumb, add));
			suma = M.add(suma, M.mul(r - l + 1, add));
			ans = M.add(ans, M.mul(suma, bdd));
			sumb = M.add(sumb, M.mul(r - l + 1, bdd));
		}
		friend Seg up(const Seg &lc, const Seg &rc) { return {lc.l, rc.r, M.add(lc.suma, rc.suma), M.add(lc.sumb, rc.sumb), M.add(lc.ans, rc.ans)}; }
	};
	struct Node : Seg
	{
		int lc, rc;
		ll bdd, add;
	};
	vector<Node> v;
	SegmentTree(int l, int r) { build(l, r); }
	void build(int l, int r)
	{
		int rt = v.size();
		v.push_back({});
		v[rt].Seg::operator=({l, r, 0, 0, 0});
		v[rt].lc = v[rt].rc = NPOS;
		v[rt].bdd = 0, v[rt].add = 0;
	}
	void down(int rt)
	{
		int m = v[rt].l + v[rt].r >> 1;
		if (v[rt].lc == NPOS)
			v[rt].lc = v.size(), build(v[rt].l, m);
		if (v[rt].rc == NPOS)
			v[rt].rc = v.size(), build(m + 1, v[rt].r);
		upd(v[v[rt].lc].l, v[v[rt].lc].r, v[rt].bdd, v[rt].add, v[rt].lc);
		upd(v[v[rt].rc].l, v[v[rt].rc].r, v[rt].bdd, v[rt].add, v[rt].rc);
		v[rt].bdd = 0, v[rt].add = 0;
	}
	void upd(int l, int r, ll bdd, ll add, int rt = 0)
	{
		if (l <= v[rt].l && v[rt].r <= r)
			return v[rt].bdd = M.add(v[rt].bdd, bdd), v[rt].add = M.add(v[rt].add, add), v[rt].upd(bdd, add);
		down(rt);
		if (r <= v[v[rt].lc].r)
			upd(l, r, bdd, add, v[rt].lc);
		else if (l >= v[v[rt].rc].l)
			upd(l, r, bdd, add, v[rt].rc);
		else
			upd(l, v[v[rt].lc].r, bdd, add, v[rt].lc), upd(v[v[rt].rc].l, r, bdd, add, v[rt].rc);
		v[rt].Seg::operator=(up(v[v[rt].lc], v[v[rt].rc]));
	}
	Seg ask(int l, int r, int rt = 0)
	{
		if (l <= v[rt].l && v[rt].r <= r)
			return v[rt];
		down(rt);
		if (r <= v[v[rt].lc].r)
			return ask(l, r, v[rt].lc);
		if (l >= v[v[rt].rc].l)
			return ask(l, r, v[rt].rc);
		return up(ask(l, v[v[rt].lc].r, v[rt].lc), ask(v[v[rt].rc].l, r, v[rt].rc));
	}
};
int main()
{
	int n, m;
	scanf("%d%d", &n, &m);
	SegmentTree t(1, n);
	for (int i = 0, l, r, x; i < m; ++i)
	{
		char s[9];
		scanf("%s%d%d", s, &l, &r);
		if (s[0] == '?')
			printf("%lld\n", t.ask(l, r).ans);
		else
			scanf("%d", &x), t.upd(l, r, s[0] != '*' ? x : 0, s[0] == '*' ? x : 0);
	}
}
```
