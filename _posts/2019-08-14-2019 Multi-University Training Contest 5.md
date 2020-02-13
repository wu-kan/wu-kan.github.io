---
title: 2019 Multi-University Training Contest 5
tags:
  - ACM
  - 题解
---

## [three arrays](https://vjudge.net/problem/HDU-6625)

Trie+贪心。

```cpp
#include <bits/stdc++.h>
using namespace std;
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
		for (int j = 0; j < 2; ++j)
			for (int i = 0, x; i < n; ++i)
				scanf("%d", &x), t[j].add(x);
		vector<int> ans;
		for (int i = 0, val; i < n; ++i)
		{
			for (int rt[2] = {val = 0, 0}, i = 29; ~i; --i)
			{
#define OK(i, j) (t[i].v[rt[i]].ch[j] != NPOS && t[i].v[t[i].v[rt[i]].ch[j]].cnt)
				if (OK(0, 1) && OK(1, 1))
					rt[0] = t[0].v[rt[0]].ch[1], rt[1] = t[1].v[rt[1]].ch[1], val <<= 1;
				else if (OK(0, 0) && OK(1, 0))
					rt[0] = t[0].v[rt[0]].ch[0], rt[1] = t[1].v[rt[1]].ch[0], val <<= 1;
				else if (OK(0, 1) && OK(1, 0))
					rt[0] = t[0].v[rt[0]].ch[1], rt[1] = t[1].v[rt[1]].ch[0], val = val << 1 | 1;
				else
					rt[0] = t[0].v[rt[0]].ch[0], rt[1] = t[1].v[rt[1]].ch[1], val = val << 1 | 1;
				--t[0].v[rt[0]].cnt, --t[1].v[rt[1]].cnt;
			}
			ans.push_back(val);
		}
		sort(ans.begin(), ans.end());
		for (int i = 0; i < ans.size(); ++i)
			printf("%d%c", ans[i], i + 1 < ans.size() ? ' ' : '\n');
	}
}
```

## [permutation 1](https://vjudge.net/problem/HDU-6628)

```cpp
#include<iostream>
#include<vector>
#include<algorithm>
#include<string.h>
using namespace std;
int n,k,l,t;
struct tem{
	int a[30];
	int size;
	tem():size(0){}
};
tem p,q[1000000];
bool ed[100];
bool operator<(const tem& p,const tem& q){
	if(n>=9)if(p.a[0]!=q.a[0])return p.a[0]<q.a[0];
	for(int i=1;i<p.size;i++){
		if(p.a[i]-p.a[i-1]==q.a[i]-q.a[i-1])continue;
		return p.a[i]-p.a[i-1]<q.a[i]-q.a[i-1];
	}
}

void dfs(tem p){

	if(p.size>=min(n,8)){
		q[++l]=p;
	//	cout<<l<<endl;
		return;
	}
	for(int i=1;i<=n;i++){
		if(!ed[i]){
			p.a[p.size++]=i;
			ed[i]=1;
			dfs(p);
			p.size--;
			ed[i]=0;
		}
	}
}

int main(void){
	cin>>t;
	while(t--){
	cin>>n>>k;
	l=0;
	memset(ed,0,sizeof(ed));
	if(n>8){
	ed[n]=1;
	cout<<n<<" ";
	for(int i=1;i<n-8;i++){
		ed[i]=1;
		cout<<i<<" ";
	}}
	dfs(p);
	sort(q+1,q+l+1);
	for(int i=0;i<q[k].size-1;i++){
		cout<<q[k].a[i]<<" ";
 }
 cout<<q[k].a[q[k].size-1]<<endl;

}}
```

## [string matching](https://vjudge.net/problem/HDU-6629)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;

const int maxn=1e6+10;
int T;
int ne[maxn];
char ch[maxn];

int main()
{
	scanf("%d",&T);
	while (T--)
	{
		scanf("%s",ch);
		int L=strlen(ch);

		int j=0,p=0;
		ne[0]=L;
		for (int i=1;i<L;i++)
		{
			if (i>=j || i+ne[i-p]>=j)
			{
				if (i>=j) j=i;
				while (j<L && ch[j]==ch[j-i]) j++;
				ne[i]=j-i;
				p=i;
			}
			else ne[i]=ne[i-p];
		}

		LL ans=0;
		for (int i=1;i<L;i++)
		{
			ans+=(LL)ne[i];
			if (i+ne[i]<L) ans++;

		}
		printf("%lld\n",ans);
	}

	return 0;
}
```

## [permutation 2](https://vjudge.net/problem/HDU-6630)

```cpp
#include<iostream>
using namespace std;
int f[500006]={0,1,1,1},t,n,a,b;
int main(void){
	cin>>t;
	for(int i=4;i<=100000;i++)f[i]=f[i-1]+f[i-3],f[i]%=998244353;
	while(t--){
		cin>>n>>a>>b;
		if(a>b)swap(a,b);
		if(a!=1&&b!=n)cout<<f[b-a-1]<<endl;
		else if(a==1&&b==n)cout<<f[n]<<endl;
		else cout<<f[b-a]<<endl;
	}
}
```
