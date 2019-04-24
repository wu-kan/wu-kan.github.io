---
title: 2018 Multi-University Training Contest 2
categories:
  - ACM
  - 题解
---
# [Game](https://vjudge.net/problem/HDU-6312)
先手的人可以通过 `选1,不选1` 的方式操纵游戏的进程，因此有必胜策略。
```c
#include <stdio.h>
int main()
{
	for (int n; ~scanf("%d", &n);)
		printf("Yes\n");
}
```
# [Swaps and Inversions](https://vjudge.net/problem/HDU-6318)
一个逆序对对答案的贡献是 `min(x,y)` 。
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll merge_sort(ll *b, ll *e)
{
	if (e - b < 2)
		return 0;
	ll *m = b + (e - b) / 2, ans = merge_sort(b, m) + merge_sort(m, e);
	for (ll *i = b, *j = m; i < m && j < e; ++i)
		for (; j < e && *j < *i; ++j)
			ans += m - i;
	return inplace_merge(b, m, e), ans;
}
ll n, x, y, a[100009];
int main()
{
	while (~scanf("%lld%lld%lld", &n, &x, &y))
	{
		for (int i = 0; i < n; ++i)
			scanf("%lld", &a[i]);
		printf("%lld\n", merge_sort(a, a + n) * min(x, y));
	}
}
```
# [Naive Operations](https://vjudge.net/problem/HDU-6315)
线段树暴力维护每个区间被加的值、达到下一更新点所需要增加的最小值及该区间的答案，每次 `maintain` 时检查如果超过这个值就把该区间的add标记下传到子区间并递归维护子区间。
```cpp
#include<bits/stdc++.h>
using namespace std;
typedef int ll;
int n,q,l,r,b[100009];
struct SegmentTree
{
	struct Node
	{
		ll add,need,sum;
	};
	vector<Node> v;
	int LAST,L,R;
	SegmentTree(int n):LAST(n),v(2*n+1) {}
	Node &lv(int l,int r)
	{
		return v[l+r|l!=r];
	}
	void push_down(Node &lc,Node &rc,Node &fa)
	{
		lc.add+=fa.add,rc.add+=fa.add,fa.add=0;
	}
	void build(ll b[],int l,int r)
	{
		if(l<r)
		{
			int m=l+(r-l)/2;
			build(b,l,m),build(b,m+1,r),lv(l,r).add=0;
		}
		else lv(l,r).add=0,lv(l,r).need=b[l];
		maintain(l,r);
	}
	void push_up(const Node &lc,const Node &rc,Node &fa)
	{
		fa.need=min(lc.need-lc.add,rc.need-rc.add);
		fa.sum=lc.sum+rc.sum;
	}
	void maintain(int l,int r)
	{
		if(l<r)
		{
			int m=l+(r-l)/2;
			if(lv(l,r).add>=lv(l,r).need)
			{
				push_down(lv(l,m),lv(m+1,r),lv(l,r));
				maintain(l,m),maintain(m+1,r);
			}
			push_up(lv(l,m),lv(m+1,r),lv(l,r));
			return;
		}
		for(; lv(l,r).add>=lv(l,r).need; ++lv(l,r).sum)
			lv(l,r).add-=lv(l,r).need,lv(l,r).need=b[l];
	}
	Node ask(int l,int r,ll val=0,bool out=1)
	{
		if(out)return L=l,R=r,ask(1,LAST,val,0);
		else if(L<=l&&r<=R)v[0]=lv(l,r);
		else
		{
			int m=l+(r-l)/2;
			if(R<=m)return ask(l,m,lv(l,r).add+val,0);
			if(L>m)return ask(m+1,r,lv(l,r).add+val,0);
			push_up(ask(l,m,lv(l,r).add+val,0),ask(m+1,r,lv(l,r).add+val,0),v[0]);
		}
		return v[0];
	}
	void add(int l,int r,ll val,bool out=1)
	{
		if(out)return L=l,R=r,add(1,LAST,val,0);
		if(L<=l&&r<=R)lv(l,r).add+=val;
		else
		{
			int m=l+(r-l)/2;
			push_down(lv(l,m),lv(m+1,r),lv(l,r));
			if(L<=m)add(l,m,val,0);
			else maintain(l,m);
			if(R>m)add(m+1,r,val,0);
			else maintain(m+1,r);
		}
		maintain(l,r);
	}
};
int main()
{
	while(~scanf("%d%d",&n,&q))
	{
		for(int i=1; i<=n; ++i)scanf("%d",&b[i]);
		SegmentTree t(n);
		t.build(b,1,n);
		for(char s[9]; q--;)
		{
			scanf("%s%d%d",s,&l,&r);
			if(s[0]=='a')t.add(l,r,1);
			else printf("%d\n",t.ask(l,r).sum);
		}
	}
}
```
