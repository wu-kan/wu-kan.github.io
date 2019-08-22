---
title: 2019 Multi-University Training Contest 9
categories:
- ACM
- 题解
---
## [Rikka with Cake](https://vjudge.net/problem/HDU-6681)

根据平面上的欧拉定理，此题交点数+1就是所求答案。扫描线+树状数组维护之。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;

const int maxn=3e5+99;
int T,n,m,k;
int tree[maxn*2];
char ch[10];
struct data
{
	int ux,uy,dx,dy;
} f[maxn],g[maxn],t[maxn];
struct Ranker:vector<int>
{
	void init()
	{
		sort(begin(),end()),resize(unique(begin(),end())-begin());
	}
	int ask(int x) const
	{
		return lower_bound(begin(),end(),x)-begin();
	}
};

bool cmp1(data a,data b)
{
	return (a.ux<b.ux);
}
bool cmp2(data a,data b)
{
	return (a.dx<b.dx);
}
bool cmp3(data a,data b)
{
	return (a.dx<b.dx);
}

void add(int loc,int val)
{
	loc+=9;
	while (loc<maxn*2)
	{
		tree[loc]+=val;
		loc+=(loc&(-loc));
	}
}
int query(int loc)
{
	loc+=9;
	int ans=0;
	while (loc) ans+=tree[loc],loc-=(loc&(-loc));
	return ans;
}

int main()
{
	scanf("%d",&T);
	while (T--)
	{
		scanf("%d%d%d",&n,&m,&k);

		Ranker rk;
		rk.push_back(0);
		rk.push_back(n);
		rk.push_back(m);
		int fi=0,gi=0;
		for (int i=1; i<=k; i++)
		{
			int x,y;
			scanf("%d%d%s",&x,&y,ch);
			rk.push_back(x);
			rk.push_back(y);
			if (ch[0]=='U')
			{
				f[++fi].ux=x;
				f[fi].uy=m;
				f[fi].dx=x;
				f[fi].dy=y;
			}
			if (ch[0]=='D')
			{
				f[++fi].ux=x;
				f[fi].uy=y;
				f[fi].dx=x;
				f[fi].dy=0;
			}
			if (ch[0]=='L')
			{
				g[++gi].ux=0;
				g[gi].uy=y;
				g[gi].dx=x;
				g[gi].dy=y;
			}
			if (ch[0]=='R')
			{
				g[++gi].ux=x;
				g[gi].uy=y;
				g[gi].dx=n;
				g[gi].dy=y;
			}
		}
		rk.init();
		for (int i=1; i<=fi; i++)
		{
			f[i].ux=rk.ask(f[i].ux);
			f[i].uy=rk.ask(f[i].uy);
			f[i].dx=rk.ask(f[i].dx);
			f[i].dy=rk.ask(f[i].dy);
		}
		for (int i=1; i<=gi; i++)
		{
			g[i].ux=rk.ask(g[i].ux);
			g[i].uy=rk.ask(g[i].uy);
			g[i].dx=rk.ask(g[i].dx);
			g[i].dy=rk.ask(g[i].dy);
			t[i].ux=g[i].ux;
			t[i].uy=g[i].uy;
			t[i].dx=g[i].dx;
			t[i].dy=g[i].dy;
		}

		fill(tree,tree+2*maxn,0);
		sort(g+1,g+1+gi,cmp1);
		sort(t+1,t+1+gi,cmp2);
		sort(f+1,f+1+fi,cmp3);
		int head=1,tail=1;
		LL ans=1ll;
		for (int i=1; i<=fi; i++)
		{
			while (g[head].ux<=f[i].ux && head<=gi)
			{
				add(g[head].uy,1);
				head++;
			}
			while (t[tail].dx<f[i].ux && tail<=gi)
			{
				add(t[tail].uy,-1);
				tail++;
			}
			int now=query(f[i].uy)-query(f[i].dy-1);//-1
			ans+=(LL)now;
		}
		printf("%lld\n",ans);
	}

	return 0;
}
```

## [Rikka with Game](https://vjudge.net/problem/HDU-6684)

```cpp
#include<iostream>
using namespace std;
int t;
char s[1000];
int main(void){
	cin>>t;
	while(t--){

	cin>>s;
	for(int i=0;s[i]!='\0';i++){
		if(s[i]!='y'&&s[i]!='z')break;
		if(s[i]=='z'){s[i]='b';break;}
	}
	cout<<s<<endl;
}
}
```

## [Rikka with Coin](https://vjudge.net/problem/HDU-6685)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 127, INF = 1e9;
int t, n, ans, w[N];
int cal(int i5, int i2, int i1)
{
	int ret = 0;
	for (int i = 0; i < n; ++i)
	{
		int tmp = INF;
		for (int j5 = 0; j5 <= i5; ++j5)
			for (int j2 = 0; j2 <= i2; ++j2)
				for (int j1 = 0; j1 <= i1; ++j1)
				{
					int sum = w[i] - j5 * 50 - j2 * 20 - j1 * 10;
					if (sum >= 0 && sum % 100 == 0)
						tmp = min(tmp, sum / 100);
				}
		ret = max(ret, tmp);
	}
	return ret;
}
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		ans = INF;
		for (int i = 0; i < n; ++i)
			scanf("%d", &w[i]);
		for (int i5 = 0; i5 <= 1; ++i5)
			for (int i2 = 0; i2 <= 4; ++i2)
				for (int i1 = 0; i1 <= 1; ++i1)
					ans = min(ans, cal(i5, i2, i1) + i5 + i2 + i1);
		printf("%d\n", ans < INF ? ans : -1);
	}
}
```

## [Rikka with Stable Marriage](https://vjudge.net/problem/HDU-6687)

和几天前做的[多校五](https://wu-kan.github.io/posts/acm/题解/2019-Multi-University-Training-Contest-5)的B题完全相同，只是这里要求最大值。代码复用率很高。

{% raw %}

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int NPOS = -1;
struct Trie
{
	struct Node
	{
		int cnt, ch[2];
	};
	vector<Node> v;
	Trie() : v(1, Node{0, {NPOS, NPOS}}) {}
	void add(int x)
	{
		for (int rt = 0, i = 29; ~i; --i)
		{
			int nxt = x >> i & 1;
			if (v[rt].ch[nxt] == NPOS)
			{
				v[rt].ch[nxt] = v.size();
				v.push_back(Node{0, {NPOS, NPOS}});
			}
			rt = v[rt].ch[nxt];
			++v[rt].cnt;
		}
	}
};
int main()
{
	int t, n;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		Trie t[2];
		for (int i = 0; i < 2; ++i)
			for (int j = 0, x; j < n; ++j)
				scanf("%d", &x), t[i].add(x);
		ll ans = 0;
		for (int i = 0, val[2]; i < n; ++i)
		{
			for (int rt[2] = {val[0] = 0, val[1] = 0}, i = 29; ~i; --i)
			{
#define OK(i, j) (t[i].v[rt[i]].ch[j] != NPOS && t[i].v[t[i].v[rt[i]].ch[j]].cnt)
				if (OK(0, 1) && OK(1, 0))
					rt[0] = t[0].v[rt[0]].ch[1], rt[1] = t[1].v[rt[1]].ch[0], val[0] = val[0] << 1 | 1, val[1] = val[1] << 1;
				else if (OK(0, 0) && OK(1, 1))
					rt[0] = t[0].v[rt[0]].ch[0], rt[1] = t[1].v[rt[1]].ch[1], val[0] = val[0] << 1, val[1] = val[1] << 1 | 1;
				else if (OK(0, 1) && OK(1, 1))
					rt[0] = t[0].v[rt[0]].ch[1], rt[1] = t[1].v[rt[1]].ch[1], val[0] = val[0] << 1 | 1, val[1] = val[1] << 1 | 1;
				else
					rt[0] = t[0].v[rt[0]].ch[0], rt[1] = t[1].v[rt[1]].ch[0], val[0] = val[0] << 1, val[1] = val[1] << 1;
				--t[0].v[rt[0]].cnt, --t[1].v[rt[1]].cnt;
			}
			ans += val[0] ^ val[1];
		}
		printf("%lld\n", ans);
	}
}
```

{% endraw %}
