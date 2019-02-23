---
title: Ural Championship 2010
categories: [ACM,题解]
abbrlink: 38787
date: 2018-10-20 20:15:13
---
# [The House of Doctor Dee](https://vjudge.net/problem/URAL-1767)
```cpp
#include<bits/stdc++.h>
#define X first
#define Y second
using namespace std;
typedef long long ll;
typedef pair<ll,ll> Coord;
pair<Coord,Coord> v[2];
int main()
{
	for(int i=0; i<2; ++i)
	{
		scanf("%lld%lld%lld%lld",&v[i].X.X,&v[i].X.Y,&v[i].Y.X,&v[i].Y.Y);
		if(v[i].X>v[i].Y)swap(v[i].X,v[i].Y);
	}
	if(v[0]>v[1])swap(v[0],v[1]);
	if(v[0].X.Y>v[0].Y.Y)
		for(int i=0; i<2; ++i)
		{
			v[i].X.Y*=-1,v[i].Y.Y*=-1;
			if(v[i].X>v[i].Y)swap(v[i].X,v[i].Y);
		}
	if(v[1].X.Y<v[1].Y.Y)
	{
		if(v[1].X.X>v[0].Y.X||v[1].X.Y>v[0].Y.Y||v[1].Y.Y<v[0].X.Y)return printf("0"),0;
		v[0].X.X=max(v[0].X.X,v[1].X.X);
		v[0].X.Y=max(v[0].X.Y,v[1].X.Y);
		v[0].Y.X=min(v[0].Y.X,v[1].Y.X);
		v[0].Y.Y=min(v[0].Y.Y,v[1].Y.Y);
		return printf("%lld",v[0].Y.X-v[0].X.X+v[0].Y.Y-v[0].X.Y),0;
	}
	else
	{
		if(v[1].X.X>v[0].Y.X||v[1].X.Y<v[0].X.Y||v[1].Y.Y>v[0].Y.Y)return printf("0"),0;
		v[0].X.X=max(v[0].X.X,v[1].X.X);
		v[0].X.Y=max(v[0].X.Y,v[1].Y.Y);
		v[0].Y.X=min(v[0].Y.X,v[1].Y.X);
		v[0].Y.Y=min(v[0].Y.Y,v[1].X.Y);
		return printf("%lld",max(v[0].Y.X-v[0].X.X,v[0].Y.Y-v[0].X.Y)),0;
	}
}
```
# [Circular Strings](https://vjudge.net/problem/URAL-1768)
```cpp
#include<bits/stdc++.h>
#define X real()
#define Y imag()
using namespace std;
typedef double lf;
typedef complex<lf> Coord;
lf x,y,z,PI=acos(-1),EPS=1e-11;
Coord p[127];
int n;
int sgn(lf d)
{
	return (d>EPS)-(d<-EPS);
}
int main()
{
	scanf("%d",&n);
	for(int i=0; i<n; ++i)
		scanf("%lf%lf",&x,&y),p[i]=Coord(x,y);
	for(int i=0; i<n; ++i)
	{
		x=abs(p[i]-p[(i+1)%n]),y=abs(p[(i+1)%n]-p[(i+2)%n]),z=abs(p[(i+2)%n]-p[i]);
		if(sgn(x-y)||sgn((n-2)*PI/n-acos((x*x+y*y-z*z)/2/x/y)))return printf("NO"),0;
	}
	printf("YES");
}
```
# [Old Ural Legend](https://vjudge.net/problem/URAL-1769)
```c
#include<stdio.h>
#define N 1000009
char s[N],f[N];
int main()
{
	scanf("%s",s);
	for(int i=0; s[i]; ++i)
		for(int j=i,p=0; s[j]&&j<i+6; ++j)
			f[p=p*10+s[j]-'0']=1;
	for(int i=1; i<N; ++i)if(!f[i])return printf("%d",i),0;
}
```
# [Ski-Trails for Robots](https://vjudge.net/problem/URAL-1772)
```c
#include<bits/stdc++.h>
#define X first
#define Y second
using namespace std;
typedef long long ll;
const ll INF=1e18;
int main()
{
	int n,s,k;
	map<int,ll> mp;
	scanf("%d%d%d",&n,&s,&k);
	for(int i=mp[s]=0,l,r; i<k; ++i)
	{
		scanf("%d%d",&l,&r);
		if(l>1&&!mp.count(l-1))mp[l-1]=INF;
		if(r<n&&!mp.count(r+1))mp[r+1]=INF;
		map<int,ll>::iterator b=mp.lower_bound(l),e=mp.upper_bound(r),it,jt;
		if(l>1)
		{
			jt=mp.find(l-1);
			--b;
			jt->Y=min(jt->Y,jt->X-b->X+b->Y);
			++b;
			for(it=b; it!=e; ++it)
				jt->Y=min(jt->Y,it->X-jt->X+it->Y);
		}
		if(r<n)
		{
			jt=mp.find(r+1);
			jt->Y=min(jt->Y,e->X-jt->X+e->Y);
			for(it=b; it!=e; ++it)
				jt->Y=min(jt->Y,jt->X-it->X+it->Y);
		}
		mp.erase(b,e);
	}
	ll ans=INF;
	for(map<int,ll>::iterator it=mp.begin(); it!=mp.end(); ++it)
		ans=min(ans,it->Y);
	printf("%lld",ans);
}
```
# [Metro to Every Home](https://vjudge.net/problem/URAL-1773)
```c
#include<bits/stdc++.h>
#define X first
#define Y second
using namespace std;
const int N=1e5+9;
pair<pair<int,int>,int> v[N];
int h,n,vis[N];
int main()
{
	scanf("%d%d",&h,&n);
	for(int i=0,l,r; i<n; ++i)
	{
		scanf("%d%d",&v[2*i].X.X,&v[2*i].X.Y);
		v[2*i+1].X.X=h-v[2*i].X.Y;
		v[2*i+1].X.Y=h-v[2*i].X.X;
		v[2*i].Y=i+1;
		v[2*i+1].Y=-i-1;
	}
	if(v[0].X.X>v[0].X.Y)
		for(int i=0; i<2*n; ++i)
			v[i].X.X=h-v[i].X.X,v[i].X.Y=h-v[i].X.Y;
	sort(v,v+2*n);
	vector<int> ans;
	for(int pre=v[0].X.X,d=v[0].X.Y-pre,i=0; i<2*n; ++i)
		if(v[i].X.X==pre&&!vis[abs(v[i].Y)])
		{
			if(v[i].X.Y-v[i].X.X!=d)return printf("0"),0;
			pre=v[i].X.Y;
			ans.push_back(v[i].Y);
			vis[abs(v[i].Y)]=1;
		}
	if(*min_element(vis+1,vis+n+1)==0)return printf("0"),0;
	for(int i=0; i<ans.size(); ++i)printf("%d ",ans[i]);
}
```