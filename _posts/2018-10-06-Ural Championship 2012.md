---
title: Ural Championship 2012
tags:
  - ACM
  - 题解
---

## [Brainwashing Device](https://vjudge.net/problem/URAL-1900)

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=511,INF=1e9;
int n,K,f[N][N],a[N][N],c[N][N],s[N][N],g[N][N];
int main()
{
	scanf("%d%d",&n,&K);
	for(int i=1,t; i<=n; ++i)
		for(int j=i+1; j<=n; ++j)
		{
			scanf("%d",&a[i][j]);
		}
	for (int i=1; i<=n; i++)
		for (int j=i+1; j<=n; j++)
			for (int k=1; k<=i; k++)
				c[i][j]+=a[k][j];
	for (int i=1;i<=n;i++)
		for (int j=i+1; j<=n;j++)
		 for (int k=i+1;k<=j;k++)
		  s[i][j]+=c[i][k];
	for (int i=1;i<=n;i++) f[i][1]=s[i][n];
	for (int i=2; i<=K;i++)
	 for (int j=1;j<=n;j++)
	  for (int k=j+1;k<=n;k++)
	  {
	    if (s[j][k]+f[k][i-1]>f[j][i]) f[j][i]=s[j][k]+f[k][i-1],g[j][i]=k;
	  }
	int ans=0,ansnum;
	for (int i=1;i<=n;i++)
	 if (f[i][K]>ans) ans=f[i][K],ansnum=i;
	printf("%d\n",ans);
	printf("%d ",ansnum);
	while (K>1)
	{
		printf("%d ",g[ansnum][K]);
		ansnum=g[ansnum][K];
		K--;
	}
}
```

## [Space Elevators](https://vjudge.net/problem/URAL-1901)

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <queue>
using namespace std;

const int maxn=100000+10;

int n,s,cnt,num,l,r;
int v[maxn],ans[maxn];
queue <int> q;

int main()
{
	scanf("%d%d",&n,&s);
	for (int i=1;i<=n;i++) scanf("%d",&v[i]);
	sort(v+1,v+n+1);
	cnt=num=0; l=1; r=n;
	while (l<=r)
	{
		if (q.empty())
		{
			q.push(v[l++]);
		//	printf("%d %d\n",l,r);
			continue;
		}
		if (q.front()+v[r]>s)
		{
			ans[++cnt]=q.front();
			q.pop();
			ans[++cnt]=v[r];
			r--;
			num+=2;
		}
		else
		{
			ans[++cnt]=q.front();
			q.pop();
			ans[++cnt]=v[l++];
			num++;
		}
	}
	if (!q.empty()) ans[++cnt]=q.front(),num++;
	printf("%d\n",num);
	for (int i=1;i<=cnt;i++) printf("%d ",ans[i]);
	return 0;
}
```

## [Neo-Venice](https://vjudge.net/problem/URAL-1902)

```cpp
#include <cstdio>
#include <cstdlib>

using namespace std;

int n,t,s;
int a[200];

int main()
{
	scanf("%d%d%d",&n,&t,&s);
	for (int i=1;i<=n;++i) scanf("%d",&a[i]);
	for (int i=1;i<=n;++i)
	{
		int del=a[i]-s;
		double ans=double(t-del);
		ans=ans/2+del+s;
		printf("%.6lf\n",ans);
	}
	return 0;
}

```

## [Unidentified Ships](https://vjudge.net/problem/URAL-1903)

```cpp
#include<bits/stdc++.h>
#define inv(a,b) pow(a,(b)-2,b)
#define mul(a,b,c) (1LL*(a)*(b)%(c))
using namespace std;
typedef int ll;
const int N=8191,M=1e9+7;
ll pow(ll a,ll b,ll m)
{
	ll r=1;
	for(a%=m; b; b>>=1,a=mul(a,a,m))
		if(b&1)r=mul(r,a,m);
	return r;
}
struct Factorial
{
	vector<ll> fac,ifac;
	ll M;
	Factorial(int N,ll M):fac(N,1),ifac(N,1),M(M)
	{
		for(int i=1; i<N; ++i)fac[i]=mul(fac[i-1],i,M);
		ifac[N-1]=inv(fac[N-1],M);
		for(int i=N-1; i; --i)ifac[i-1]=mul(ifac[i],i,M);
	}
	ll c(int n,int m)
	{
		return mul(mul(fac[n],ifac[m],M),ifac[n-m],M);
	}
} f(N,M);
int n,t,c[N],k,x,s[3];
int main()
{
	scanf("%d%d",&n,&t);
	for(int i=0; i<n; ++i)scanf("%d",&c[i]);
	scanf("%d%d",&k,&x);
	for(int i=0; i<n; ++i)++s[c[i]>c[k-1]?2:c[i]==c[k-1]];
	for(int i=min(s[k=0],x-1); ~i; --i)
		for(int j=min(s[2],t-x); ~j; --j)
			if(1<=t-i-j&&t-i-j<=s[1])
				k=(k+mul(mul(f.c(s[0],i),f.c(s[2],j),M),f.c(s[1]-1,t-i-j-1),M))%M;
	printf("%d\n",k);
}
```

## [The Lessons of the Past](https://vjudge.net/problem/URAL-1904)

```cpp
using namespace std;
const int N=10009;
int k,a[15],c[N*2];
int check(int t)
{
	for(int i=0; i<k; ++i)
		t=abs(t-a[i]);
	return t<=1;
}
int main()
{
	scanf("%d",&k);
	for(int i=0; i<k; ++i)scanf("%d",&a[i]);
	vector<pair<int,int> > ans;
	for(int i=-N,l=N; i<N; ++i)
		if(check(i))
		{
			if(l==N)l=i;
			if(!check(i+1))
			{
				ans.push_back(make_pair(l,i));
				l=N;
			}
		}
	printf("%d\n",ans.size());
	for(int i=0; i<ans.size(); ++i)
		printf("%d %d\n",ans[i].first,ans[i].second);
}
```

## [Travel in Time](https://vjudge.net/problem/URAL-1905)

```cpp
#include<bits/stdc++.h>
#define F first
#define S second
using namespace std;
typedef int ll;
const int N=1e5+9,NPOS=-1;
pair<pair<int,int>,pair<int,int> > P[N];
vector<int> V[N];
int q[N],cur[N],p[N],n,m,s,t,st,tt;
bool cmp(int i,int j)
{
	return P[i]<P[j];
}
int main()
{
	scanf("%d%d",&n,&m);
	for(int i=0; i<m; ++i)
		scanf("%d%d%d%d",&P[i].S.F,&P[i].S.S,&P[i].F.F,&P[i].F.S);
	for(int i=m; i<m+2; ++i)scanf("%d",&P[i].S.F),P[i].S.S=P[i].S.F;
	for(int i=m; i<m+2; ++i)scanf("%d",&P[i].F.F),P[i].F.S=P[i].F.F;
	for(int i=0; i<m+2; ++i)
		V[P[i].S.F].push_back(i);
	for(int i=1; i<=n; ++i)sort(V[i].begin(),V[i].end(),cmp),cur[i]=V[i].size()-1;
	fill(p,p+m+2,NPOS);
	q[0]=m;
	for(int ql=0,qr=1; ql<qr; ++ql)
		for(int &u=q[ql],&j=cur[P[u].S.S],to; ~j; --j)
			if(to=V[P[u].S.S][j],to!=u)
			{
				if(P[u].F.S>P[to].F.F)break;
				if(p[to]==NPOS)p[to]=u,q[qr++]=to;
			}
	if(p[m+1]==NPOS)return printf("Impossible"),0;
	vector<int> ans;
	for(int u=m+1; u!=m; u=p[u])
		ans.push_back(u);
	printf("%d\n",ans.size()-1);
	for(int i=ans.size()-1; i; --i)
		printf("%d ",ans[i]+1);
}
```

## [The Lost Civilization](https://vjudge.net/problem/URAL-1906)

```cpp
//没人做的题，待补
```

## [Coffee and Buns](https://vjudge.net/problem/URAL-1907)

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
using namespace std;

typedef long long ll;

ll a,at,n,ans;
int cnt;
ll f[100];

void dfs1(int cur,int num,ll tot)
{
	if (tot>n) return ;
	if (cur>cnt)
	{
		if (num==0) return ;
		ans+=(num&1?1:-1)*(n/tot);
		return ;
	}
	dfs1(cur+1,num,tot);
	dfs1(cur+1,num+1,tot*f[cur]);
}

void dfs2(int cur,int num,ll tot)
{
	if (cur>cnt)
	{
		if (num==0) return ;
		ans+=(num&1?1:-1)*(((n/tot)+1)/2);
	//	printf("%d %d\n",tot,ans);
		return ;
	}
	dfs2(cur+1,num,tot);
	dfs2(cur+1,num+1,tot*f[cur]);
}

int main()
{
	scanf("%lld%lld",&a,&n);
	at=a;
	for (int i=2;(ll)i*i<=a;i++)
	 if (at%i==0)
	 {
	 	f[++cnt]=i;
	 	while (at%i==0) at/=i;
	 }
	if (at>1) f[++cnt]=at;
	if (a&1)
	{
		ans+=(n+1)/2;
		n/=2;
		dfs1(1,0,1);
	}
	else
	{
		ans+=n/2;
		dfs2(2,0,1);
	}
	printf("%lld",ans);
	return 0;
}
```

## [Brute-force Search](https://vjudge.net/problem/URAL-1908)

```cpp
//待补
```

## [Space Recon](https://vjudge.net/problem/URAL-1909)

```cpp
//全场193提交无人通过，待补
#include <cstdio>
#include <cstdlib>
#include <cmath>
#include <algorithm>

using namespace std;

double X0,X1,X2,Y0,Y1,Y2,z0,z1,z2,vx,vy,vz,r;
double A,B,C,D;

const double eps=1e-6;

void getN()
{
	double dx=X1-X2,dy=Y1-Y2,dz=z1-z2;
	A=dy*vz-dz*vy;
	B=dz*vx-dx*vz;
	C=dx*vy-dy*vx;
	D=-X1*A-Y1*B-z1*C;
}

bool dir()
{
	double Dx=X1-X0,Dy=Y1-Y0,Dz=z1-z0;
	if (Dx*vx+Dy*vy+Dz*vz<eps) return true;
	Dx=X2-X0,Dy=Y2-Y0,Dz=z2-z0;
	if (Dx*vx+Dy*vy+Dz*vz<eps) return true;
	return false;
}

double DD(double x,double y,double z)
{
	double dx=X0-x,dy=Y0-y,dz=z0-z;
	double L1=(dx*vx+dy*vy+dz*vz)/sqrt(vx*vx+vy*vy+vz*vz);
	double L2=(dx*dx+dy*dy+dz*dz)-L1*L1;
	if (L2-r*r>-eps) return -1;
	double L3=sqrt(r*r-L2);
	return L1-L3;
}

int main()
{
//	freopen("J.txt","r",stdin);
	scanf("%lf%lf%lf%lf",&X0,&Y0,&z0,&r);
	scanf("%lf%lf%lf",&X1,&Y1,&z1);
	scanf("%lf%lf%lf",&X2,&Y2,&z2);
	scanf("%lf%lf%lf",&vx,&vy,&vz);

	getN();
	double dis=(A*X0+B*Y0+C*z0+D)/sqrt(A*A+B*B+C*C);
	if (dis-r>eps) {printf("False alarm");return 0;}
	if (!dir()) {printf("False alarm");return 0;}

	double d1=DD(X1,Y1,z1);
	double d2=DD(X2,Y2,z2);
	double d3;
	if (d1<-eps && d2<-eps) {printf("Warning");return 0;}
	if (d1<-eps || d2<-eps) d3=max(d1,d2);
	else d3=min(d1,d2);

	double T=d3/sqrt(vx*vx+vy*vy+vz*vz);
	X1+=vx*T;Y1+=vy*T;z1+=vz*T;
	X2+=vx*T;Y2+=vy*T;z2+=vz*T;

	double Px=X1-X2,Py=Y1-Y2,Pz=z1-z2;
	double Qx=X0-X2,Qy=Y0-Y2,Qz=z0-z2;
	double Rx=X0-X1,Ry=Y0-Y1,Rz=z0-z1;
	if (Px*Qx+Py*Qy+Pz*Qz>-eps || Rx*Px+Ry*Py+Rz*Pz<eps) {printf("Crash");return 0;}


	double k=((X1-X2)*(X0-X2)+(Y1-Y2)*(Y0-Y2)+(z1-z2)*(z0-z2))/((X1-X2)*(X1-X2)+(Y1-Y2)*(Y1-Y2)+(z1-z2)*(z1-z2));
	double d4=sqrt(((X1-X2)*k+X2-X0)*((X1-X2)*k+X2-X0)+((Y1-Y2)*k+Y2-Y0)*((Y1-Y2)*k+Y2-Y0)+((z1-z2)*k+z2-z0)*((z1-z2)*k+z2-z0));
	if (d4-r<eps) {printf("Warning");return 0;}
	else {printf("Crash");return 0;}
}
```
