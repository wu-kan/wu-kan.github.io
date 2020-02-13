---
title: 2012 ACM-ICPC Asia Dhaka Regional Contest
tags:
  - ACM
  - 题解
---

## [Wedding of Sultan](https://vjudge.net/problem/UVALive-6201)

```cpp
#include<stdio.h>
char s[63];
int t,k,kase=0,ans[99];
void dfs(char u)
{
    for(; s[++k]!=u; dfs(s[k]))++ans[s[k]],++ans[u];
}
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%s",s);
        for(char c='A'; c<='Z'; ++c)
            ans[c]=0;
        dfs(s[k=0]);
        printf("Case %d\n",++kase);
        for(char c='A'; c<='Z'; ++c)
            if(ans[c])
                printf("%c = %d\n",c,ans[c]);
    }
}
```

## [Memory Overflow](https://vjudge.net/problem/UVALive-6202)

```cpp
#include<stdio.h>
char s[511];
int t,n,k,kase=0,ans,pre[99];
int main()
{
    for(scanf("%d",&t); t--; printf("Case %d: %d\n",++kase,ans))
    {
        scanf("%d%d%s",&n,&k,s);
        for(char c='A'; c<='Z'; ++c)pre[c]=-1;
        for(int i=ans=0; i<n; ++i)
        {
            if(~pre[s[i]]&&i-pre[s[i]]<=k)++ans;
            pre[s[i]]=i;
        }
    }
}
```

## [Poker End Games](https://vjudge.net/problem/UVALive-6204)

```cpp
#include<stdio.h>
typedef double lf;
const lf EPS=1e-6;
int t,kase=0,a,b;
lf ans0,ans1;
void dfs(int a,int b,lf c,int d)
{
    if(c+c*d<EPS)return;
    if(!b)ans1+=c;
    if(!a||!b)
    {
        ans0+=c*d;
        return;
    }
    int e=a<b?a:b;
    dfs(a-e,b+e,c/2,d+1),dfs(a+e,b-e,c/2,d+1);
}
int main()
{
    for(scanf("%d",&t); t--; printf("Case %d: %.6f %.6f\n",++kase,ans0,ans1))
        scanf("%d%d",&a,&b),dfs(a,b,1,ans0=ans1=0);
}
```

## [Overlapping Characters](https://vjudge.net/problem/UVALive-6205)

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=17,M=43;
typedef bitset<N*M> bs;
bs b[99];
char s[M],t[N*M+9];
int n,q,kase=0;
int main()
{
    scanf("%d%d%s",&n,&q,s);
    for(int i=0; i<n; ++i)
    {
        for(int j=0; j<N; ++j)
            scanf("%s",t+j*M);
        b[s[i]]=bs(t,N*M,'.','*');//c++11
    }
    for(; q--; printf("\n"))
    {
        scanf("%s",s);
        printf("Query %d: ",++kase);
        for(int i=0; s[i]; ++i)
        {
            bs d=b[s[i]];
            for(int j=0; s[j]; ++j)
                if(s[j]!=s[i])
                    d&=~b[s[j]];
            printf(d.none()?"N":"Y");
        }
    }
}
```

## [Learning Vector](https://vjudge.net/problem/UVALive-6208)

```cpp
#include<bits/stdc++.h>
using namespace std;
const int INF=-1e9;
struct Vec
{
    int X,Y;
    bool operator<(const Vec &v)const
    {
        return v.Y*X<Y*v.X;
    }
} v[51];
int t,n,k,kase=0,f[51][51][51*51];
int main()
{

    for(scanf("%d",&t); t--;)
    {
        scanf("%d%d",&n,&k);
        for(int i=0; i<n; ++i)
            scanf("%d%d",&v[i].X,&v[i].Y);
        sort(v,v+n);
        for(int i=0; i<n; ++i)
            for(int j=0; j<=k; ++j)
                for(int h=51*51; h--;)
                {
                    if(i)
                    {
                        f[i][j][h]=f[i-1][j][h];
                        if(j&&h>=v[i].Y)
                            f[i][j][h]=max(f[i][j][h],
                                           f[i-1][j-1][h-v[i].Y]+v[i].X*(2*h-v[i].Y));
                    }
                    else
                    {
                        if(j==1)f[i][j][h]=h==v[i].Y?v[i].X*v[i].Y:INF;
                        else if(j==0)f[i][j][h]=h?INF:0;
                        else f[i][j][h]=INF;
                    }
                }
        int ans=0;
        for(int h=51*51; h--;)ans=max(ans,f[n-1][k][h]);
        printf("Case %d: %d\n",++kase,ans);
    }
}
```
