---
title: NVCPC preview contest from Tailmon
categories: [ACM,题解]
abbrlink: 4509
date: 2017-12-13 13:41:12
---
[overview](http://soj.acmm.club/contest_detail.php?cid=2653) 
# [Tailmon’s Multiple 30](http://soj.acmm.club/show_problem.php?pid=1000&cid=2653)
算法显而易见，要特判各位数相加为0的情况。
```cpp
#include<bits/stdc++.h>
using namespace std;
int main()
{
	int sum=0;
	string s;
	cin>>s;
	sort(s.rbegin(),s.rend());
	for(int i=0; i<s.size(); ++i)sum+=s[i]-'0';
	cout<<(sum&&sum%3==0&&s.back()=='0'?s:"-1")<<'\n';
}                               
```
# [Tailmon’s Fibnacci Sequence](http://soj.acmm.club/show_problem.php?pid=1001&cid=2653)
```cpp
#include<bits/stdc++.h>
using namespae std;
typedef long long ll;
int main()
{
	ll n,a=0,b=1,c,sum=1;
	for(cin>>n; --n;)
	{
		c=b;
		sum+=b+=a;
		b%=1000000007;
		sum%=1000000007;
		a=c;
	}
	cout<<sum<<'\n';
}                                 
```
# [Tailmon’s Evolution](http://soj.acmm.club/show_problem.php?pid=1002&cid=2653)
题面没有说明的是，无论输入单词间有多少空格间隔，输出时统一按一个，结尾也要空格。 
```cpp
#include<bits/stdc++.h>
using namespace std;
int main()
{
	for(string s; cin>>s;)
		cout<<(s!="tailmon"?s:"angewomon")<<' ';
	cout<<'\n'; 
}                                 
```
# [Tailmon with God Ye](http://soj.acmm.club/show_problem.php?pid=1003&cid=2653)
判断是否要对时间最长的任务上标签。 
```cpp
#include<bits/stdc++.h>
using namespace std;
int main()
{
	int n,sum=0,g=0;
	cin>>n;
	for(int i=0,t; i<n; ++i)
		cin>>t,sum+=t,g=max(g,t);
	if(g>2)sum-=g-2;
	cout<<sum<<'\n';
}                                 
```
# [Tailmon Compares Numbers](http://soj.acmm.club/show_problem.php?pid=1004&cid=2653)
```cpp
#include<bits/stdc++.h>
using namespace std;
bool less(const string &s0,
		  const string &s1)
{
	if(s0.size()!=s1.size())return s0.size()<s1.size();
	for(int i=0; i!=s0.size(); ++i)
		if(s0[i]!=s1[i])
			return s0[i]<s1[i];
	return 0;
}
int main()
{
	string s[2];
	for(int i=0,pos; i<2; ++i)
	{
		cin>>s[i];
		for(pos=0;
				pos<s[i].size()&&
				s[i][pos]=='0';
				++pos);
		s[i]=s[i].substr(pos);
	}
	cout<<(less(s[0],s[1])?'<':
		   less(s[1],s[0])?'>':'=')
		<<'\n';
}                                 
```
# [Tailmon Wants to Make a Big News](http://soj.acmm.club/show_problem.php?pid=1005&cid=2653)
```cpp
#include<bits/stdc++.h>
using namespace std;
int cal(int n)
{
	static int f[64]={0,1,2,0};
	if(f[n])return f[n];
	return f[n]=cal(n-1)+cal(n-2);
}
int main()
{
	int n;
	cin>>n;
	cout<<cal(n)<<'\n';
}                                 
```
# [Tailmon on a Chessboard](http://soj.acmm.club/show_problem.php?pid=1006&cid=2653)
卡cin读入，换C做这题。
```c
#include<stdio.h>
char chess[111][11111]= {0};
int n,m,q,t,x,y,pos[111]= {0};
int main()
{
	scanf("%d%d%d",&n,&m,&q);
	for(int i=1; i<=n; pos[i]=i++)
		for(int j=1; j<=m; ++j)
			chess[i][j]='.';
	while(q--)
	{
		scanf("%d",&t);
		if(t==1)
		{
			scanf("%d%d%d",&t,&x,&y);
			chess[pos[x]][y]=(t==1?'w':'b');
		}
		else
		{
			scanf("%d%d",&x,&y);
			t=pos[x];
			pos[x]=pos[y];
			pos[y]=t;
		}
	}
	for(int i=1; i<=n; ++i)
		printf("%s\n",chess[pos[i]]+1);
}                                 
```
# [Tailmon Found Hakurei Shrine](http://soj.acmm.club/show_problem.php?pid=1007&cid=2653)
对于询问的每个点，既然没有摧毁并且不能到达源点，那么与它们相邻的每个点一定不可以到达（反证：如果可以到达，那么询问点只需到达该点就可转至源点，与题意矛盾；前提：地震前所有点都连通）。于是强行摧毁所有与询问点联通且非询问点的点，便得到最优解。   
出题人良心，凭借上述算法过不了第二个样例。原因是当上述点被摧毁后，又有新的点无法到达源点（样例中的9号点）。于是从源点DFS并避开所有询问点和摧毁点，此次DFS中没有访问到的点总数就是所求答案。 
```cpp
#include<bits/stdc++.h>
using namespace std;
struct Edge
{
	int from,to;
}e_tmp;
struct Graph:vector<Edge>
{
	int n;
	vector<vector<int> > a;
	void to_list(int _n)
	{
		n=_n;
		a.assign(n,vector<int>());
		for(iterator i=begin(); i!=end(); ++i)
			a[i->from].push_back(i-begin());
	}
}g;
int m,k,ans=0;
bool flag[30001]={0},vis[30001]={0}; 
void dfs(int k)
{
	if(flag[k]||vis[k])return;
	vis[k]=1;
	for(int i=0;i!=g.a[k].size();++i)
		dfs(g[g.a[k][i]].to);
}
int main()
{
	cin>>g.n>>m>>k;
	while(m--)
	{
		cin>>e_tmp.from>>e_tmp.to;
		g.push_back(e_tmp);
		swap(e_tmp.from,e_tmp.to);
		g.push_back(e_tmp);
	}
	g.to_list(++g.n);
	while(k--)
	{
		cin>>m;
		flag[m]=1;
		for(int i=0;i!=g.a[m].size();++i)
			flag[g[g.a[m][i]].to]=1;
	}
	dfs(1);
	for(int i=1;i!=g.n;++i)
		if(flag[i]||!vis[i])
			++ans;
	cout<<ans<<'\n';
}                                 
```
# [Tailmon %%%YSX](http://soj.acmm.club/show_problem.php?pid=1008&cid=2653)
线段树，每个节点维护的值见注释，能过样例（比赛结束所以没办法评测？）。 
```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll INF=1e18;
struct SegmentTree
{
	struct Node
	{
		ll add,hl,hr;//该点add值，左右端点值
		int ldown,rup,lman,rman,man;//依次是包含左端点的最长下降序列右端点、右…左、包含左端点的最长人字序列右端点、右…左、最长人字序列长度-1
	};
	vector<Node> v;
	int LAST,L,R;
	SegmentTree(int n):LAST(n),v(2*n+1) {}
	Node& lv(int l,int r)
	{
		return v[l+r|l!=r];
	}
	void push_down(Node &lc,Node &rc,Node &fa)
	{
		lc.add+=fa.add;
		rc.add+=fa.add;
		fa.add=0;
	}
	void push_up(const Node &lc,const Node &rc,Node &fa,int l,int r)//将区间左右相连的lc、rc归并到fa
	{
		int m=l+(r-l)/2;

		fa.hl=lc.hl,fa.hr=rc.hr;

		fa.ldown=lc.ldown;
		if(fa.ldown==m&&lc.hr>rc.hl)
			fa.ldown=rc.ldown;

		fa.rup=rc.rup;
		if(fa.rup==m+1&&lc.hr<rc.hl)
			fa.rup=lc.rup;

		fa.lman=lc.lman;
		if(fa.lman==m&&lc.hr>rc.hl)
			fa.lman=max(fa.lman,rc.ldown);
		if(lc.rup==l&&lc.hr<rc.hl)
			fa.lman=max(fa.lman,rc.lman);

		fa.rman=rc.rman;
		if(fa.rman==m+1&&lc.hr<rc.hl)
			fa.rman=min(fa.rman,lc.rup);
		if(rc.ldown==r&&lc.hr>rc.hl)
			fa.rman=min(fa.rman,lc.rman);

		fa.man=max(lc.man,rc.man);
		fa.man=max(fa.man,rc.ldown-lc.rup);
		fa.man=max(fa.man,fa.lman-l);
		fa.man=max(fa.man,r-fa.rman);
		if(lc.hr<rc.hl)fa.man=max(fa.man,rc.lman-lc.rup);
		if(lc.hr>rc.hl)fa.man=max(fa.man,rc.ldown-lc.rman);
	}
	void maintain(int l,int r)
	{
		Node &fa=lv(l,r);
		if(l<r)
		{
			int m=l+(r-l)/2;
			push_up(lv(l,m),lv(m+1,r),fa,l,r);
		}
		else
		{
			fa.ldown=fa.rup=fa.lman=fa.rman=l;
			fa.hl=fa.hr=fa.man=0;
		}
		fa.hl+=fa.add,fa.hr+=fa.add;
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
	int n,m;
	cin>>n>>m;
	SegmentTree teemo(n);
	for(int i=1,d; i<=n; ++i)
		cin>>d,teemo.add(i,i,d);
	for(int i=1,l,r,d; i<=m; ++i)
	{
		cin>>l>>r>>d,teemo.add(l,r,d);
		cout<<teemo.lv(1,n).man+1<<'\n';
	}
}
```
## 队友的过评测代码
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N=100005;
const int M=N*5;
int n,m,mx1L[M],mx1R[M],mx2L[M],mx2R[M],mxL[M],mxR[M],mx[M];
ll a[N],Left[M],Right[M],tag[M];
inline void cmax(int&x,int y){if(y>x)x=y;}
void up(int l,int r,int x){
	int mid=(l+r)>>1;
	Left[x]=Left[x<<1];
	Right[x]=Right[x<<1|1];
	mx1L[x]=mx1L[x<<1];
	if(mx1L[x<<1]==mid-l+1&&Right[x<<1]<Left[x<<1|1])mx1L[x]+=mx1L[x<<1|1];
	mx1R[x]=mx1R[x<<1|1];
	if(mx1R[x<<1|1]==r-mid&&Right[x<<1]<Left[x<<1|1])mx1R[x]+=mx1R[x<<1];
	mx2L[x]=mx2L[x<<1];
	if(mx2L[x<<1]==mid-l+1&&Right[x<<1]>Left[x<<1|1])mx2L[x]+=mx2L[x<<1|1];
	mx2R[x]=mx2R[x<<1|1];
	if(mx2R[x<<1|1]==r-mid&&Right[x<<1]>Left[x<<1|1])mx2R[x]+=mx2R[x<<1];
	mxL[x]=mxL[x<<1];
	if(mxL[x<<1]==mid-l+1&&Right[x<<1]>Left[x<<1|1])mxL[x]+=mx2L[x<<1|1];
	if(mx1L[x<<1]==mid-l+1&&Right[x<<1]<Left[x<<1|1])cmax(mxL[x],mid-l+1+mxL[x<<1|1]);
	mxR[x]=mxR[x<<1|1];
	if(mxR[x<<1|1]==r-mid&&Right[x<<1]<Left[x<<1|1])mxR[x]+=mx1R[x<<1];
	if(mx2R[x<<1|1]==r-mid&&Right[x<<1]>Left[x<<1|1])cmax(mxR[x],r-mid+mxR[x<<1]);
	mx[x]=max(mxL[x],mxR[x]);
	cmax(mx[x],max(mx[x<<1],mx[x<<1|1]));
	if(Right[x<<1]>Left[x<<1|1])cmax(mx[x],mxR[x<<1]+mx2L[x<<1|1]);
	if(Right[x<<1]<Left[x<<1|1])cmax(mx[x],mx1R[x<<1]+mxL[x<<1|1]);
}
void down(int l,int r,int x){
	if(tag[x]){
		tag[x<<1]+=tag[x];
		tag[x<<1|1]+=tag[x];
		Left[x<<1]+=tag[x];
		Left[x<<1|1]+=tag[x];
		Right[x<<1]+=tag[x];
		Right[x<<1|1]+=tag[x];
		tag[x]=0;
	}
}
void build(int l,int r,int x){
	if(l==r){
		Left[x]=Right[x]=a[l];
		mx1L[x]=mx1R[x]=mx2L[x]=mx2R[x]=mxL[x]=mxR[x]=mx[x]=1;
		return;
	}
	int mid=(l+r)>>1;
	build(l,mid,x<<1);
	build(mid+1,r,x<<1|1);
	up(l,r,x);
}
void update(int v,int L,int R,int l,int r,int x){
	if(l>=L&&r<=R){
		Left[x]+=v;
		Right[x]+=v;
		tag[x]+=v;
		return;
	}
	down(l,r,x);
	int mid=(l+r)>>1;
	if(L<=mid)update(v,L,R,l,mid,x<<1);
	if(R>mid)update(v,L,R,mid+1,r,x<<1|1);
	if(L==l)Left[x]+=v;
	if(R==r)Right[x]+=v;
	up(l,r,x);
}
int main(){
	//freopen("aa.in","r",stdin);
	int i,j,l,r,x;
	scanf("%d%d",&n,&m);
	for(i=1;i<=n;++i)cin>>a[i];
	build(1,n,1);
	for(i=1;i<=m;++i){
		scanf("%d%d%d",&l,&r,&x);
		update(x,l,r,1,n,1);
		printf("%d\n",mx[1]);
	}
	return 0;
}
```