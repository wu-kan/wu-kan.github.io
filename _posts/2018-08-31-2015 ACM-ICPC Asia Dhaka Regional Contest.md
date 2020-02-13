---
title: 2015 ACM-ICPC Asia Dhaka Regional Contest
tags:
  - ACM
  - 题解
---

## [Automatic Cheater Detection](https://vjudge.net/problem/UVALive-7336)

没注意到难度取值范围小于十，于是写了个二分跑过去了，还挺快的。

```cpp
#include<bits/stdc++.h>
using namespace std;
char r[9];
int t,q;
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%d",&q);
        vector<int> dui,cuo;
        long long ans=0;
        for(int i=0,s,d; i<q; ++i)
        {
            scanf("%d%d%s",&d,&s,r);
            if(s&&r[0]=='c')dui.push_back(d);
            if(!s&&r[0]=='i')cuo.push_back(d);
        }
        sort(dui.begin(),dui.end());
        sort(cuo.begin(),cuo.end());
        for(int i=0; i<dui.size(); ++i)
            ans+=lower_bound(cuo.begin(),cuo.end(),dui[i])-cuo.begin();
        printf("%lld\n",ans);
    }
}
```

## [Counting Weekend Days](https://vjudge.net/problem/UVALive-7337)

```cpp
#include<bits/stdc++.h>
using namespace std;
int mo(const string &s)
{
    return s=="FEB"?28:
           s=="APR"||s=="JUN"||s=="SEP"||s=="NOV"?30:31;
}
int da(const string &s)
{
    return s=="SUN"?0:
           s=="MON"?1:
           s=="TUE"?2:
           s=="WED"?3:
           s=="THU"?4:
           s=="FRI"?5:6;
}
int main()
{
    int t,ans;
    string mth,day;
    for(cin>>t; t--; cout<<ans<<'\n')
    {
        cin>>mth>>day;
        for(int i=ans=0,m=mo(mth),d=da(day); i<m; ++i,++d)
            if(d%7>4)++ans;
    }
}
```

## [Owllen](https://vjudge.net/problem/UVALive-7339)

```cpp
#include<bits/stdc++.h>
using namespace std;
char s[100009];
int t,kase,cnt[26];
int main()
{
    for(scanf("%d",&t); t--;)
    {
        fill(cnt,cnt+26,0);
        scanf("%s",s);
        for(int i=0; s[i]; ++i)++cnt[s[i]-'a'];
        printf("Case %d: %d\n",++kase,*min_element(cnt,cnt+26));
    }
}
```

## [Sum of MSLCM](https://vjudge.net/problem/UVALive-7340)

```cpp
#include<bits/stdc++.h>
#define at operator[]
using namespace std;
const int N=2e7+7;
struct EulerSieve
{
    vector<int> p,m;
    EulerSieve(int N):m(N,0)
    {
        for(long long i=2,k; i<N; ++i)
        {
            if(!m[i])p.push_back(m[i]=i);
            for(int j=0; j<p.size()&&(k=i*p[j])<N; ++j)
                if((m[k]=p[j])==m[i])break;
        }
    }
} e(N);
typedef long long ll;
struct Solve:vector<ll>
{
    Solve(int N):vector<ll>(N,0)
    {
        for(int i=2; i<N; ++i)at(i)=at(i-1)+cal(i);
    }
    ll cal(int x)
    {
        if(x==1)return 1;
        if(at(x))return at(x)-at(x-1);
        int t=e.m[x];
        x/=t;
        if(x%t==0)return cal(x)*(t+1)-cal(x/t)*t;
        return cal(x)*(t+1);
    }
} s(N);
int main()
{
    for(int n; scanf("%d",&n),n;)printf("%lld\n",s[n]);
}
```

## [Design New Capital](https://vjudge.net/problem/UVALive-7343)

```cpp
#include<bits/stdc++.h>
#define mul(a,b,c) (1LL*(a)*(b)%(c))
#define inv(a,b) pow(a,(b)-2,b)
using namespace std;
typedef int ll;
const ll N=1e5+7,M=7340033,G=3;
struct Factorial
{
	vector<ll> fac,ifac;
	ll M;
	Factorial(int N,ll M):fac(N,1),ifac(N,1),M(M)
	{
		for(int i=2; i<N; ++i)
			fac[i]=mul(fac[i-1],i,M),ifac[i]=mul(M-M/i,ifac[M%i],M);
		for(int i=2; i<N; ++i)ifac[i]=mul(ifac[i],ifac[i-1],M);
	}
	ll c(int n,int m)
	{
		return mul(mul(fac[n],ifac[m],M),ifac[n-m],M);
	}
} f(N,M);
ll pow(ll a,ll b,ll m)
{
	ll r=1;
	for(; b; b>>=1,a=mul(a,a,m))
		if(b&1)r=mul(r,a,m);
	return r;
}
struct Rader:vector<int>
{
	Rader(int n):vector<int>(1<<int(ceil(log2(n))))
	{
		for(int i=at(0)=0; i<size(); ++i)
			if(at(i)=at(i>>1)>>1,i&1)
				at(i)+=size()>>1;
	}
};
struct FNTT:Rader
{
	ll M,G;
	vector<ll> w;
	FNTT(int N,ll M,ll G):Rader(N),M(M),G(G),w(size(),pow(G,(M-1)/size(),M))
	{
		for(int i=w[0]=1; i<size(); ++i)w[i]=mul(w[i],w[i-1],M);
	}
	vector<ll> fntt(const vector<ll> &a)const
	{
		vector<ll> x(size());
		for(int i=0; i<a.size(); ++i)x[at(i)]=a[i];
		for(int i=1; i<size(); i<<=1)
			for(int j=0; j<i; ++j)
				for(int k=j; k<size(); k+=i<<1)
				{
					ll &l=x[k],&r=x[k+i],t=mul(w[size()/(i<<1)*j],r,M);
					if(r=l-t,r<0)r+=M;
					if(l+=t,l>=M)l-=M;
				}
		return x;
	}
	vector<ll> ask(vector<ll> a,vector<ll> b)const
	{
		a=fntt(a),b=fntt(b);
		for(int i=0; i<size(); ++i)a[i]=mul(a[i],b[i],M);
		a=fntt(a),reverse(a.begin()+1,a.end());
		ll u=inv(size(),M);
		for(int i=0; i<size(); ++i)a[i]=mul(a[i],u,M);
		return a;
	}
};
int t,n,kase;
int main()
{
	for(scanf("%d",&t); t--;)
	{
		scanf("%d",&n);
		vector<ll> a(n+1),b(n+1),c(4,0);
		for(int i=0,x,y; i<n; ++i)
		{
			scanf("%d%d",&x,&y);
			++c[x<0&&y<0?3:
			    x<0&&y>0?2:
			    x>0&&y>0];
		}
		for(int i=min(c[0],c[2]); ~i; --i)a[i]=mul(f.c(c[0],i),f.c(c[2],i),M);
		for(int i=min(c[1],c[3]); ~i; --i)b[i]=mul(f.c(c[1],i),f.c(c[3],i),M);
		a=FNTT(n+1,M,G).ask(a,b);
		printf("Case %d:\n",++kase);
		for(int i=1; i<=n; ++i)
			printf("%lld%c",i&1?0:a[i>>1],i<n?' ':'\n');
	}
}
```

## [Numbered Cards](https://vjudge.net/problem/UVALive-7344)

```cpp
#include<bits/stdc++.h>
#define mul(a,b,c) (1LL*(a)*(b)%(c))
using namespace std;
const int N=1e9+7,M=1e9+7;
long long t,n,casenum,f[11][1<<11],u[11][1<<11],g[1<<11],h[1<<11];
long long ans[1<<11][1<<11];
int main()
{
    f[0][0]=1;
    for (int i=1; i<10; ++i)f[1][1<<i]=1;
    for(int i=1; i<10; ++i)
        for(int j=1<<10; j--;)
            for(int k=1<<9; k; k>>=1)
                f[i+1][j|k]=(f[i+1][j|k]+f[i][j])%M;
    u[0][0]=1;
    for(int i=0; i<10; ++i)
        for(int j=1<<10; j--;)
            for(int k=1<<9; k; k>>=1)
                u[i+1][j|k]=(u[i+1][j|k]+u[i][j])%M;
//  for (int i=1;i<1<<6;i++) printf("%d ",f[2][i]);
    for(scanf("%lld",&t); t--;)
    {
        fill(g,g+(1<<10),0);
        vector<int> v;
        scanf("%lld",&n);
        for(int j=n+1; j; j/=10)v.push_back(j%10);
        for(int i=1; i<v.size(); ++i)
            for(int j=1<<10; j--;)
                g[j]=(g[j]+f[i][j])%M;
        for(int i=v.size()-1,now=0; ~i; --i)
        {
            for(int j=i==v.size()-1?1:0; j<v[i]; ++j)
             for(int k=1<<10; k--;) g[k|now|1<<j]=(g[k|now|1<<j]+u[i][k])%M;
            now|=1<<v[i];
        }
        /*
        for(int i=1;i<(1<<10);i++)
            if (g[i]) printf("%d %d\n",i,g[i]);
        */
        memset(ans,0,sizeof(ans));
        ans[0][0]=1;
        for(int i=0;i<(1<<10)-1;i++)
            for(int j=0;j<1<<10;j++)
            {
                ans[i+1][j]=(ans[i+1][j]+ans[i][j])%M;
                if (((i+1)&j)==0) ans[i+1][(i+1)|j]=(ans[i+1][(i+1)|j]+(ans[i][j]*g[i+1])%M)%M;
            }
        long long val=0;
        for (int i=0;i<1<<10;i++) val=(val+ans[(1<<10)-1][i])%M;
        val=(val+M-1)%M;
        printf("Case %lld: %lld\n",++casenum,val);
    }
}
```
