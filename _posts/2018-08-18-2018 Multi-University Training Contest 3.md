---
title: 2018 Multi-University Training Contest 3
tags:
  - ACM
  - 题解
---

## [Problem A. Ascending Rating](https://vjudge.net/problem/HDU-6319)

从后向前扫描维护当前位置开始的 m 个区间的 LIS。
全程使用 `long long` 减少取模次数，否则会 T。

```c
#include<stdio.h>
#define N 10000009
long long t,n,m,k,p,q,r,M,a[N],Q[N];
int main()
{
    for(scanf("%lld",&t); t--;)
    {
        scanf("%lld%lld%lld%lld%lld%lld%lld",&n,&m,&k,&p,&q,&r,&M);
        for(int i=1; i<=k; ++i)scanf("%lld",&a[i]);
        for(int i=k+1; i<=n; ++i)a[i]=(p*a[i-1]+q*i+r)%M;
        for(int i=n,l=r=p=q=0; i; --i)
        {
            while(l<r&&a[Q[r-1]]<=a[i])--r;
            Q[r++]=i;
            if(i<=n-m+1)
            {
                if(Q[l]-Q[r-1]+1>m)++l;
                p+=i^a[Q[l]];
                q+=i^(r-l);
            }
        }
        printf("%lld %lld\n",p,q);
    }
}
```

## [Problem C. Dynamic Graph Matching](https://vjudge.net/problem/HDU-6321)

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
using namespace std;

const int maxv=3000;
const int mod=1e9+7;

int num[maxv],f[maxv];
int g[12][12];
int t,n,m,k,x,y,v;
char s[4];
int ans[10];

void init()
{
    for (int i=0;i<1024;i++)
    {
        for (int j=0;j<10;j++)
         if ((1<<j)&i) num[i]++;
        if (num[i]&1) num[i]=0;
         else num[i]/=2;
    }
}

int main()
{
    init();
    scanf("%d",&t);
    while (t--)
    {
        memset(g,0,sizeof(g));
        memset(f,0,sizeof(f));
        f[0]=1;
        scanf("%d%d",&n,&m);
        k=n/2; v=(1<<n)-1;
        while (m--)
        {
            scanf("%s%d%d",s,&x,&y);
            if (s[0]=='+')
            {
                for (int i=0;i<=v;i++)
                {
                    if (((1<<(x-1))&i) && ((1<<(y-1))&i))
                      f[i]+=f[i-(1<<(x-1))-(1<<(y-1))];
                    f[i]%=mod;
                }
                g[x][y]++;
            }
            else
            {
                for (int i=0;i<=v;i++)
                {
                    if (((1<<(x-1))&i) && ((1<<(y-1))&i))
                     f[i]-=f[i-(1<<(x-1))-(1<<(y-1))];
                    if (f[i]<0) f[i]+=mod;
                }
                g[x][y]--;
            }
        //  for (int i=1;i<=v;i++) printf("%d ",f[i]);
        //  printf("\n");
            memset(ans,0,sizeof(ans));
            for (int i=1;i<=v;i++) ans[num[i]]+=f[i],ans[num[i]]%=mod;
            for (int i=1;i<k;i++) printf("%d ",ans[i]);
            printf("%d\n",ans[k]);
        }
    }
}
```

## [Problem D. Euler Function](https://vjudge.net/problem/HDU-6322)

```c
#include<stdio.h>
int t,k;
int main()
{
    for(scanf("%d",&t); t--; printf("%d\n",k==1?5:k+5))
        scanf("%d",&k);
}
```

## [Grab The Tree](https://vjudge.net/problem/HDU-6324)

```c
#include<stdio.h>
int t,n,s,w;
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%d",&n);
        for(int i=s=0; i<n; ++i)
            scanf("%d",&w),s^=w;
        for(printf("%c\n",s?'Q':'D'); --n;)
            scanf("%d%d",&s,&w);
    }
}
```

## [Problem L. Visual Cube](https://vjudge.net/problem/HDU-6330)

```c
#include<stdio.h>
char s[99][99];
int t,a,b,c;
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%d%d%d",&a,&b,&c);
        for(int i=0; i<(b+c)*2+1; ++i)
            for(int j=0; j<(a+b)*2+1; ++j)
                s[i][j]='.';
        for(int i=0; i<b; ++i)
        {
            for(int j=0; j<a; ++j)
            {
                s[2*i][2*b-2*i+2*j]='+';
                s[2*i+1][2*b-2*i+2*j-1]='/';
                s[2*i][2*b-2*i+2*j+1]='-';
            }
            s[2*i][2*b-2*i+a*2]='+';
        }
        for(int i=0; i<=c; ++i)
        {
            for(int j=0; j<b; ++j)
            {
                s[2*i+2*b-2*j-1][2*a+2*j+1]='/';
                s[2*i+2*b-2*j-2][2*a+2*j+2]='+';
                if(i<c)s[2*i+2*b-2*j-1][2*a+2*j+2]='|';
            }
            for(int j=0; j<a; ++j)
            {
                if(i)s[2*i+2*b-1][j*2]='|';
                s[2*i+2*b][j*2]='+';
                s[2*i+2*b][j*2+1]='-';
            }
            s[2*i+2*b][2*a]='+';
            if(i)s[2*i+2*b-1][2*a]='|';
        }
        for(int i=0; i<(b+c)*2+1; ++i,printf("\n"))
            for(int j=0; j<(a+b)*2+1; ++j)
                printf("%c",s[i][j]);
    }
}
```
