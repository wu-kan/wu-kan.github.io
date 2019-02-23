---
title: 2012-2013 ACM-ICPC, Central Europe Regional Contest (CERC 12)
categories: [ACM,题解]
tags: [搜索,拓扑排序]
abbrlink: 18625
date: 2018-10-16 10:44:48
---
# [Kingdoms](https://vjudge.net/problem/Gym-100624A)
破产是收支不平衡时才**有概率**发生，并且一个国家破产之后**有概率**导致破产（而不是必定导致连锁破产）。搜索的时候要记忆化。
```cpp
#include<bits/stdc++.h>
using namespace std;
int t,n,a[31][31],cnt[1<<20],ans;
void dfs(int s)
{
	if(cnt[s])return;
	for(int i=0; i<n; ++i)
		if(!(s>>i&1))++cnt[s];
	for(int i=0,sum; i<n; ++i)
		if(!(s>>i&1))
		{
			if(cnt[s]==1)
			{
				ans|=1<<i;
				return;
			}
			for(int j=sum=0; j<n; ++j)
				if(!(s>>j&1))
					sum+=a[j][i];
			if(sum<0)dfs(s|1<<i);
		}
}
int main()
{
	for(scanf("%d",&t); t--;)
	{
		scanf("%d",&n);
		for(int i=0; i<n; ++i)
			for(int j=0; j<n; ++j)
				scanf("%d",&a[i][j]);
		fill(cnt,cnt+(1<<20),ans=0);
		dfs(0);
		if(!ans)printf("0");
		for(int i=0; i<n; ++i)
			if(ans>>i&1)printf("%d ",i+1);
		printf("\n");
	}
}
```
# [Chemist’s vows](https://vjudge.net/problem/Gym-100624C)
```cpp
#include <cstdio>
#include <cstdlib>
#include <cstring>

using namespace std;

bool a[200],s[200][200];
char t[50010];
bool ok[50010];
int n;

void pre()
{
	a['h']=a['b']=a['c']=a['n']=a['o']=a['f']=a['p']=a['s']=a['k']=a['v']=a['y']=a['i']=a['w']=a['u']=true;
	s['h']['e']=s['l']['i']=s['b']['e']=s['n']['e']=s['n']['a']=s['m']['g']=s['a']['l']=s['s']['i']=s['c']['l']=s['a']['r']=true;
	s['c']['a']=s['s']['c']=s['t']['i']=s['c']['r']=s['m']['n']=s['f']['e']=s['c']['o']=s['n']['i']=s['c']['u']=s['z']['n']=s['g']['a']=s['g']['e']=s['a']['s']=s['s']['e']=s['b']['r']=s['k']['r']=true;
	s['r']['b']=s['s']['r']=s['z']['r']=s['n']['b']=s['m']['o']=s['t']['c']=s['r']['u']=s['r']['h']=s['p']['d']=s['a']['g']=s['c']['d']=s['i']['n']=s['s']['n']=s['s']['b']=s['t']['e']=s['x']['e']=true;
	s['c']['s']=s['b']['a']=s['h']['f']=s['t']['a']=s['r']['e']=s['o']['s']=s['i']['r']=s['p']['t']=s['a']['u']=s['h']['g']=s['t']['l']=s['p']['b']=s['b']['i']=s['p']['o']=s['a']['t']=s['r']['n']=true;
	s['f']['r']=s['r']['a']=s['r']['f']=s['d']['b']=s['s']['g']=s['b']['h']=s['h']['s']=s['m']['t']=s['d']['s']=s['r']['g']=s['c']['n']=s['f']['l']=s['l']['v']=true;
	s['l']['a']=s['c']['e']=s['p']['r']=s['n']['d']=s['p']['m']=s['s']['m']=s['e']['u']=s['g']['d']=s['t']['b']=s['d']['y']=s['h']['o']=s['e']['r']=s['t']['m']=s['y']['b']=s['l']['u']=true;
	s['a']['c']=s['t']['h']=s['p']['a']=s['n']['p']=s['p']['u']=s['a']['m']=s['c']['m']=s['b']['k']=s['c']['f']=s['e']['s']=s['f']['m']=s['m']['d']=s['n']['o']=s['l']['r']=true;
}

int main()
{
	pre();
	scanf("%d",&n);
	while (n--)
	{
		scanf("%s",t);
		memset(ok,0,sizeof(ok));
		ok[0]=true;
		int i;
		for (i=0;t[i];++i)
		{
			if (!ok[i]) continue;
			if (a[t[i]]) ok[i+1]=true;
			if (s[t[i]][t[i+1]]) ok[i+2]=true;
		}
		
		if (ok[i]) puts("YES");
		else	puts("NO");
	}
}
```
# [Non-boring sequences](https://vjudge.net/problem/Gym-100624D)
卡了很久，暴力划分子区间的时候要从左右一起找，单方向找会被卡。
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=2e5+9;
int t,n,pre[N],nxt[N];
int dfs(int l,int r)
{
	for(int L=l,R=r; L<=R; ++L,--R)
	{
		if(pre[L]<l&&nxt[L]>r)
			return dfs(L+1,r)&&dfs(l,L-1);
		if(pre[R]<l&&nxt[R]>r)
			return dfs(l,R-1)&&dfs(R+1,r);
	}
	return l>=r;
}
int main()
{
	for(scanf("%d",&t); t--;)
	{
		scanf("%d",&n);
		unordered_map<int,int> mp;
		fill(pre,pre+n,-1);
		fill(nxt,nxt+n,n);
		for(int i=0,a; i<n; ++i)
		{
			scanf("%d",&a);
			if(mp.count(a))
			{
				int &lst=mp[a];
				nxt[lst]=i;
				pre[i]=lst;
				lst=i;
			}
			else mp[a]=i;
		}
		if(dfs(0,n-1))printf("non-");
		printf("boring\n");
	}
}
```
# [Darts](https://vjudge.net/problem/Gym-100624H)
```cpp
#include <cstdio>
#include <cstdlib>

using namespace std;

const int r[11]={200,180,160,140,120,100,80,60,40,20,0};

int sc(int x,int y)
{
	int t=x*x+y*y;
	for (int i=0;i<=10;++i)
	{
		if (t>r[i]*r[i]) return i;
	}
	return 10;
}

int main()
{
	int T;
	scanf("%d",&T);
	while (T--)
	{
		int n,ans=0;
		scanf("%d",&n);
		while (n--)
		{
			int x,y;
			scanf("%d%d",&x,&y);
			ans+=sc(x,y);
		}
		printf("%d\n",ans);
	}
}
```
# [Conservation](https://vjudge.net/problem/Gym-100624J)
拓扑排序的时候把普通队列换成双端队列即可，每次入队时按照两种点的类型分别插入队尾/队首，出队是按照上次点的类型选择从队尾/队首出。分别枚举两类点作为起点，取最小值。
```cpp
#include<bits/stdc++.h>
using namespace std;
struct Graph
{
	struct Vertex
	{
		vector<int> a;
		int pos;
	};
	struct Edge
	{
		int from,to;
	};
	vector<Vertex> v;
	vector<Edge> e;
	Graph(int n):v(n) {}
	void add(const Edge &ed)
	{
		v[ed.from].a.push_back(e.size());
		e.push_back(ed);
	}
	int topo(int first)
	{
		vector<int> deg(v.size(),0);
		for(int i=0; i<e.size(); ++i)++deg[e[i].to];
		deque<int> q;
		for(int i=0; i<deg.size(); ++i)
			if(!deg[i])
				v[i].pos==first?q.push_front(i):q.push_back(i);
		int ans=0,pre=q.back(),u;
		while(!q.empty())
		{
			if(v[q.back()].pos==v[pre].pos)
				u=q.back(),q.pop_back();
			else u=q.front(),q.pop_front();
			if(v[u].pos!=v[pre].pos)++ans;
			for(int i=0,k,to; i<v[u].a.size(); ++i)
				if(k=v[u].a[i],to=e[k].to,!--deg[to])
					v[to].pos==first?q.push_front(to):q.push_back(to);
			pre=u;
		}
		return ans;
	}
};
int main()
{
	int t,n,m;
	for(scanf("%d",&t); t--;)
	{
		scanf("%d%d",&n,&m);
		Graph g(n);
		for(int i=0; i<n; ++i)scanf("%d",&g.v[i].pos);
		for(int i=0,u,v; i<m; ++i)
			scanf("%d%d",&u,&v),g.add({u-1,v-1});
		printf("%d\n",min(g.topo(1),g.topo(2)));
	}
}
```