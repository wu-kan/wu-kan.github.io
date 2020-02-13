---
title: 2011 ACM-ICPC Asia Dhaka Regional Contest
tags:
  - ACM
  - 题解
---

## [Binary Matrix](https://vjudge.net/problem/UVALive-5809)

```cpp
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <algorithm>
#include <queue>

#define N 2010

using namespace std;

int const INF=(1<<30);

int ask(int *a,int n,int tot)
{
	vector<int> v(a,a+n);
	int ans=0;
	for(int i=0; i+1<v.size();++i)
	{
		ans+=abs(v[i]-tot);
		v[i+1]+=v[i]-tot;
	}
	return ans;
}

int a[N],b[N],n,m,T,sum;
char s[N];

int main()
{
	scanf("%d",&T);
	for (int t=1; t<=T; ++t)
	{
		scanf("%d%d",&n,&m);
		memset(a,0,sizeof(a));
		memset(b,0,sizeof(b));
		sum=0;
		for (int i=1; i<=n; ++i)
		{
			scanf("%s",s+1);
			for (int j=1; j<=m; ++j)
				if (s[j]=='1')
				{
					++a[i];
					++b[j];
					++sum;
				}
		}
		int ans1=INF,ans2=INF;
		if (sum%n==0)
		{
			for (int i=1; i<=n; ++i) a[i+n]=a[i];
			for (int i=1; i<=n; ++i) ans1=min(ans1,ask(a+i,n,sum/n));
		}
		if (sum%m==0)
		{
			for (int i=1; i<=m; ++i) b[i+m]=b[i];
			for (int i=1; i<=m; ++i) ans2=min(ans2,ask(b+i,m,sum/m));
		}
		printf("Case %d: ",t);
		if (ans1==INF && ans2==INF) puts("impossible");
		else if (ans1==INF) printf("column %d\n",ans2);
		else if (ans2==INF) printf("row %d\n",ans1);
		else printf("both %d\n",ans1+ans2);
	}
}
```

## [Candles](https://vjudge.net/problem/UVALive-5810)

```cpp
#include<bits/stdc++.h>
#define COUNT __builtin_popcount
using namespace std;
bool ask(int l,int r,int i)
{
	if(l==0)return i>>r&1;
	return l!=r&&(i>>r&1)&&(i>>l&1);
}
int main()
{
	for(int kase=0,n,a[15],ans; ~scanf("%d",&n)&&n; printf("\n"))
	{
		for(int i=0; i<n; ++i)scanf("%d",&a[i]);
		for(int i=0,len=ans=(1<<10)-1,flag; i<len; ++i)
			if(COUNT(i)<COUNT(ans))
			{
				for(int j=flag=0,l,r; !flag&&j<n; ++j)
				{
					l=a[j]/10,r=a[j]%10;
					if(ask(l,r,i))continue;
					flag=1;
					if(l==0)
					{
						for(int k=1; k+k<r; ++k)
							if((i>>k&1)&&(i>>r-k&1))
							{
								flag=0;
								break;
							}
					}
					else
					{
						for(int k=1,ii; flag&&k<10; ++k)
							if(i>>k&1)
							{
								l=(a[j]-k)/10,r=(a[j]-k)%10,ii=i&~(1<<k);
								if(ask(l,r,ii))
								{
									flag=0;
									break;
								}
								for(int kk=0,iii; kk<10; ++kk)
									if(ii>>kk&1)
									{
										if(a[j]-k*10-kk<0)break;
										l=(a[j]-k*10-kk)/10,r=(a[j]-k*10-kk)%10,iii=ii&~(1<<kk);
										if(ask(l,r,iii))
										{
											flag=0;
											break;
										}
									}
							}
					}
				}
				if(!flag)ans=i;
			}
		printf("Case %d: ",++kase);
		for(int i=9; ~i; --i)
			if(ans>>i&1)printf("%d",i);
	}
}
```

## [Cards](https://vjudge.net/problem/UVALive-5811)

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef double lf;
const lf EPS=1e-4,INF=1e4;
int t,a[4],kase;
lf f[15][15][15][15][5][5];
lf dp(int i,int j,int k,int l,int m,int n)
{
	if(f[i][j][k][l][m][n]>=-EPS)return f[i][j][k][l][m][n];
	lf &ans=f[i][j][k][l][m][n]=0;
	int need[4]= {a[0]-i,a[1]-j,a[2]-k,a[3]-l},res=54-i-j-k-l,ca[4]= {13-i,13-j,13-k,13-l};
	if(m<4)--need[m],--res;
	if(n<4)--need[n],--res;
	if(*max_element(need,need+4)<=0)return ans=54-res;
	if(ca[0])ans+=dp(i+1,j,k,l,m,n)/res*ca[0];
	if(ca[1])ans+=dp(i,j+1,k,l,m,n)/res*ca[1];
	if(ca[2])ans+=dp(i,j,k+1,l,m,n)/res*ca[2];
	if(ca[3])ans+=dp(i,j,k,l+1,m,n)/res*ca[3];
	if(m==4)
	{
		lf tmp=INF;
		for(int t=0; t<4; ++t)
			if(need[t]>0)
				tmp=min(tmp,dp(i,j,k,l,t,n));
		ans+=tmp/res*2;
	}
	else if(n==4)
	{
		lf tmp=INF;
		for(int t=0; t<4; ++t)
			if(need[t]>0)
				tmp=min(tmp,dp(i,j,k,l,m,t));
		ans+=tmp/res;
	}
	if(ans<EPS)ans=INF;
	return ans;
}
int main()
{
	for(scanf("%d",&t); t--;)
	{
		printf("Case %d: ",++kase);
		for(int i=0; i<4; ++i)scanf("%d",&a[i]);
		for(int i=0; i<15; ++i)
			for(int j=0; j<15; ++j)
				for(int k=0; k<15; ++k)
					for(int l=0; l<15; ++l)
						for(int m=0; m<5; ++m)
							for(int n=0; n<5; ++n)
								f[i][j][k][l][m][n]=-1;
		if(a[0]+a[1]+a[2]+a[3]==0)
		{
			printf("0.000\n");
			continue;
		}
		if(max(a[0]-13,0)+max(a[1]-13,0)+max(a[2]-13,0)+max(a[3]-13,0)>2)
		{
			printf("-1.000\n");
			continue;
		}
		printf("%.3f\n",dp(0,0,0,0,4,4));
	}
}
```

## [Packing for Holiday](https://vjudge.net/problem/UVALive-5814)

```cpp
#include<bits/stdc++.h>
using namespace std;
int t,a,b,c,kase;
int main()
{
	for(scanf("%d",&t); t--;)
	{
		scanf("%d%d%d",&a,&b,&c);
		printf("Case %d: %s\n",++kase,a<21&&b<21&&c<21?"good":"bad");
	}
}
```

## [Pair of Touching Circles](https://vjudge.net/problem/UVALive-5815)

```cpp
#include <cstdio>
#include <cmath>
#include <cstring>
#include <algorithm>
using namespace std;

const int maxn=1000+10;
typedef long long ll;

struct r
{
	int a,b,c;
}f[maxn*maxn];

int t,h,w,cnt;
ll ans;

void init()
{
	for (int i=1;i<=1000;i++)
	{
		for(int j=1;j<=1000;++j)
		{
			int k=sqrt(i*i+j*j)+0.5;
			if(k>1000) break;
			if(i*i+j*j==k*k)
			{f[++cnt].a=i; f[cnt].b=j; f[cnt].c=k;}
		}
	}
}

int main()
{
	init();
	scanf("%d",&t);
	for (int cc=1;cc<=t;cc++)
	{
		ans=0;
		scanf("%d%d",&h,&w);
		for (int i=1;i<=cnt;i++)
		{
			int j,k;
			ll x=f[i].a+f[i].c,y=f[i].b+f[i].c;
			if ((x>h)||(y>w)) continue;
		//	printf("%d %d %d\n",f[i].a,f[i].b,f[i].c);
			for (j=1;((f[i].c-j-f[i].b)>j) || ((f[i].c-j-f[i].a)>j);j++)
			{
		//		printf("%d %d %d ans=%lld ",f[i].a,f[i].b,f[i].c,ans);
				x=max(f[i].a+f[i].c,(f[i].c-j)*2); y=max(f[i].b+f[i].c,(f[i].c-j)*2);
				if ((x>h)||(y>w)) continue;
				ans+=(h-x+1)*(w-y+1)*2;
			}
			for (k=f[i].c-1;((k-f[i].b)>(f[i].c-k)) || ((k-f[i].a)>(f[i].c-k));k--)
			{
		//		printf("%d %d %d ans=%lld ",f[i].a,f[i].b,f[i].c,ans);
				x=max(f[i].a+f[i].c,k*2); y=max(f[i].b+f[i].c,k*2);
				if ((x>h)||(y>w)) continue;
				ans+=(h-x+1)*(w-y+1)*2;
			}
		//	printf("%d %d\n",j,k);
			x=f[i].a+f[i].c;y=f[i].b+f[i].c;
			ll g=(k-j+1)*2;
			ans+=(h-x+1)*(w-y+1)*g;
		//	if (f[i].c==10) printf("%lld\n",ans);
		}
	//	printf("! %lld\n",ans);
		for (int i=1;i<=h;i++)
		 for (int j=1;j<=w;j++)
		 {
		 	if ((i&1)||(j&1)) continue;
		 	if (i==j) continue;
		 	if (max(i,j)>(min(i,j)*2)) continue;
		 	ll g;
		 	if (max(i,j)==(min(i,j)*2)) g=1;
		 	 else g=2;
		 	ans+=(ll)(h-i+1)*(w-j+1)*g;
		 }
		printf("Case %d: %lld\n",cc,ans);
	}
	return 0;
}
```

## [As Long as I Learn, I Live](https://vjudge.net/problem/UVALive-5818)

```cpp
#include <cstdio>
#include <cstring>

using namespace std;

int T,n,m;
int line[200][200];
int go[200],a[200];

int main()
{
	scanf("%d",&T);
	for (int t=1;t<=T;++t)
	{
		int ans=0;
		memset(line,0,sizeof(line));
		memset(go,0,sizeof(go));
		scanf("%d%d",&n,&m);
		for (int i=0;i<n;++i) scanf("%d",&a[i]);
		for (int i=0;i<m;++i)
		{
			int u,v;
			scanf("%d%d",&u,&v);
			line[u][v]=true;
			++go[u];
		}
		int now=0;
		while (go[now])
		{
			int maxid=-1,maxa=0;
			for (int i=0;i<n;++i) if (line[now][i] && maxa<a[i])
			{
				maxa=a[i];maxid=i;
			}
			ans+=maxa;
			now=maxid;
		}
		printf("Case %d: %d %d\n",t,ans,now);
	}

}
```
