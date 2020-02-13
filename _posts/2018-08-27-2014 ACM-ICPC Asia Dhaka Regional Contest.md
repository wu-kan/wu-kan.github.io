---
title: 2014 ACM-ICPC Asia Dhaka Regional Contest
tags:
  - ACM
  - 题解
---

## [Decoding Baby Boos](https://vjudge.net/problem/UVALive-6917)

另解：使用链表快速合并。

```cpp
#include<bits/stdc++.h>
using namespace std;
char s[1000009],a[9],b[9];
int t,r;
int main()
{
    for(scanf("%d",&t); t--;)
    {
        vector<list<int> > l(99);
        scanf("%s%d",s,&r);
        for(int i=0; s[i]; ++i)
            l[s[i]].push_back(i);
        for(; r--; l[a[0]].splice(l[a[0]].end(),l[b[0]]))
            scanf("%s%s",a,b);
        for(int i=0; i<l.size(); ++i)
            for(list<int>::iterator it=l[i].begin(); it!=l[i].end(); ++it)
                s[*it]=i;
        printf("%s\n",s);
    }
}
```

## [And Or](https://vjudge.net/problem/UVALive-6918)

```cpp
#include<stdio.h>
long long t,kase,a,b,ansOr,ansAnd;
int main()
{
    for(scanf("%lld", &t); t--;)
    {
        scanf("%lld%lld",&a,&b);
        ansAnd=a,ansOr=a;
        for(int i=0; !(a>>i&1)&&i<63; ++i)
            if(b-a>=1LL<<i)ansOr|=1LL<<i;
        for(; a<=b; a+=a&-a)
            ansOr|=a,ansAnd&=a;
        printf("Case %lld: %lld %lld\n",++kase,ansOr,ansAnd);
    }
}
```

## [A game for kids](https://vjudge.net/problem/UVALive-6919)

```cpp
#include<bits/stdc++.h>
#define mul(a,b,c) (1LL*(a)*(b)%(c))
using namespace std;
const int M=21092013,H=51;
struct GCD
{
    int a[H][H];
    GCD()
    {
        for(int i=1; i<H; ++i)
            for(int j=i; j<H; ++j)
                a[i][j]=a[j][i]=__gcd(i,j);
    }
} gcd;
#define __gcd(i,j) gcd.a[i][j]
struct Graph
{
    struct Vertex
    {
        vector<int> a,f;
        int l,h;
        Vertex():f(H,0) {}
    };
    struct Edge
    {
        int from,to;
    };
    vector<Vertex> v;
    vector<Edge> e;
    vector<int> ans;
    Graph(int n):v(n),ans(H,0) {}
    void add(const Edge &ed)
    {
        v[ed.from].a.push_back(e.size());
        e.push_back(ed);
    }
    void dfs(int u,int fa)
    {
        for(int i=0,to,g; i<v[u].a.size(); ++i)
            if(to=e[v[u].a[i]].to,to!=fa)
            {
                dfs(to,u);
                for(int j=1; j<H; ++j)
                    for(int k=1; k<H; ++k)
                        g=__gcd(j,k),ans[g]=(ans[g]+mul(v[to].f[k],v[u].f[j],M))%M;
                for(int k=1; k<H; ++k)
                    for(int j=v[u].l; j<=v[u].h; ++j)
                        g=__gcd(j,k),v[u].f[g]=(v[u].f[g]+v[to].f[k])%M;
            }
        for(int i=v[u].l; i<=v[u].h; ++i)v[u].f[i]=(v[u].f[i]+1)%M;
    }
};
int main()
{
    int t,n,kase=0;
    for(scanf("%d",&t); t--;)
    {
        printf("Case %d:\n",++kase);
        scanf("%d",&n);
        Graph g(n);
        for(int i=1,u,v; i<n; ++i)
            scanf("%d%d",&u,&v),g.add({u-1,v-1}),g.add({v-1,u-1});
        for(int i=0; i<n; ++i)scanf("%d",&g.v[i].l);
        for(int i=0; i<n; ++i)scanf("%d",&g.v[i].h);
        g.dfs(0,-1);
        for(int i=1; i<H; ++i)
        {
            for(int j=0; j<n; ++j)g.ans[i]=(g.ans[i]+g.v[j].f[i])%M;
            printf("%d: %d\n",i,g.ans[i]);
        }
    }
}
```

## [Refraction](https://vjudge.net/problem/UVALive-6921)

```cpp
#include<stdio.h>
#include<math.h>
double EPS=3e-6,W,H,x,xe,ye,mu;
int t;
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%lf%lf%lf%lf%lf%lf",&W,&H,&x,&xe,&ye,&mu);
        double tanH=(ye-H)/(xe-W),E=asin(1)-atan(tanH),sinCPN=sin(E)/mu,
               tanCPN=tan(asin(sinCPN)),h=(tanH*(W-x)-H)/(tanH*tanCPN-1);
        if(h-EPS>H)printf("Impossible\n");
        else printf("%.4f\n",h);
    }
}
```

## [Load Balancing](https://vjudge.net/problem/UVALive-6924)

```cpp
#include<stdio.h>
#include<math.h>
#define M 161
double f[M][4],d;
int t,n,kase,s[M],p[M][4];
void print(int i,int j)
{
    if(!j)return;
    print(p[i][j],j-1);
    printf(" %d",p[i][j]);
}
int main()
{
    for(scanf("%d",&t); t--; printf("Case %d:",++kase),print(M-1,3),printf("\n"))
    {
        scanf("%d", &n);
        for(int i=0; i<M; ++i)s[i]=0;
        for(int i=0,c; i<n; ++i)scanf("%d",&c),++s[c];
        for(int i=1; i<M; ++i)s[i]+=s[i-1];
        for(int i=0; i<M; ++i)
        {
            f[i][0]=fabs(s[i]-n/4.0),f[i][1]=f[i][2]=f[i][3]=1e9;
            for(int j=1; j<4; ++j)
                for(int k=0; k<i; ++k)
                    if(d=fabs(s[i]-s[k]-n/4.0),f[i][j]>f[k][j-1]+d)
                        f[i][j]=f[p[i][j]=k][j-1]+d;
        }
    }
}
```

## [Maximum Score](https://vjudge.net/problem/UVALive-6926)

```cpp
#include<bits/stdc++.h>
#define mul(a,b,c) ((a)*(b)%(c))
using namespace std;
typedef unsigned long long ll;
const ll N=1e5+7,M=1e9+7;
pair<ll,ll> p[N];
ll t,n,kase;
int main()
{
    for(scanf("%llu",&t); t--;)
    {
        scanf("%llu",&n);
        for(ll i=0; i<n; ++i)
            scanf("%llu%llu",&p[i].first,&p[i].second);
        sort(p,p+n);
        ll sum=p[0].second,ans=sum*p[0].second,per=1;
        for(ll i=1; i<n; ++i)
        {
            sum+=p[i].second;
            ans=ans+sum*p[i].second;
            per=mul(per,p[i-1].second+1,M);
        }
        printf("Case %llu: %llu %llu\n",++kase,ans,per);
    }
}
```
