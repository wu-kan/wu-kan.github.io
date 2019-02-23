---
title: 2018 Multi-University Training Contest 9
categories: [ACM,题解]
abbrlink: 13999
date: 2018-08-24 00:27:03
---
# [Rikka with Nash Equilibrium](https://vjudge.net/problem/HDU-6415)
递推很慢的跑掉了，有的编译器会T掉。
```c
#include<stdio.h>
#include<string.h>
typedef long long ll;
ll t,n,m,k,f[2][99][99];
int main()
{
    for(scanf("%lld",&t); t--;)
    {
        scanf("%lld%lld%lld",&n,&m,&k);
        memset(f,0,sizeof(f));
        f[1][1][1]=n*m;
        for(int i=2,pre=1; i<=n*m; ++i,pre^=1)
            for(int x=1; x<=n&&x<=i; ++x)
                for(int y=1; y<=m&&y<=i; ++y)
                    f[pre^1][x][y]=((n-x+1)*y*f[pre][x-1][y]+
                                    (m-y+1)*x*f[pre][x][y-1]+
                                    (x*y-i+1)*f[pre][x][y])%k;
        printf("%lld\n",f[n*m%2][n][m]);
    }
}
```
赛后翻题解才知道有现成公式…
```c
#include<stdio.h>
typedef long long ll;
ll t,n,m,k,ans;
int main()
{
    for(scanf("%lld",&t); t--; printf("%lld\n",ans))
    {
        scanf("%lld%lld%lld",&n,&m,&k);
        for(ll i=ans=1; i<=n; ++i)ans=ans*i%k;
        for(ll i=1; i<=m; ++i)ans=ans*i%k;
        for(ll i=n+m; i<=n*m; ++i)ans=ans*i%k;
    }
}
```
# [Rikka with Stone-Paper-Scissors](https://vjudge.net/problem/HDU-6418)
```c
#include<stdio.h>
typedef long long ll;
ll t,a1,b1,c1,a2,b2,c2;
ll gcd(ll a,ll b)
{
    return b?gcd(b,a%b):a;
}
int main()
{
    for(scanf("%lld",&t); t--; printf("\n"))
    {
        scanf("%lld%lld%lld%lld%lld%lld",&a1,&b1,&c1,&a2,&b2,&c2);
        ll n=a2*(c1-b1)+b2*(a1-c1)+c2*(b1-a1),d=a1+b1+c1,g;
        if(n<0)printf("-"),n=-n;
        g=gcd(n,d),printf("%lld",n/=g);
        if(d/=g,d>1)printf("/%lld",d);
    }
}
```
# [Rikka with Time Complexity](https://vjudge.net/problem/HDU-6424)
```cpp
#include<bits/stdc++.h>
using namespace std;
int t,a,b,INF=1e9+7;
vector<int> cal(const vector<int> &A)
{
    vector<int> r(4,INF);
    if(A.size()==1)
    {
        r[0]=A[0]+2;
    }
    if(A.size()==2)
    {
        r[0]=min(A[0]+2,A[1]+1);
        r[2]=max(A[0]+2,A[1]+1);
    }
    if(A.size()==3)
    {
        if(A[0]+2<min(A[1]+1,A[2]))
        {
            r[0]=A[0]+2;
            r[2]=min(A[1]+1,A[2]);
            r[3]=max(A[1]+1,A[2]);
        }
        else
        {
            r[0]=min(A[1]+1,A[2]);
            r[1]=max(A[1]+1,A[2]);
            r[2]=A[0]+2;
        }
    }
    return r;
}
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%d%d",&a,&b);
        vector<int> A(a),B(b);
        for(int i=0,t; i<a; ++i)scanf("%d",&A[i]);
        for(int i=0,t; i<b; ++i)scanf("%d",&B[i]);
        printf("%d\n",cal(A)>cal(B)?-1:cal(A)<cal(B));
    }
}
```
# [Rikka with Badminton](https://vjudge.net/problem/HDU-6425)
```c
#include<stdio.h>
#define mul(a,b,c) ((a)*(b)%(c))
typedef long long ll;
ll M=998244353,t,a,b,c,d;
ll pow(ll a,ll b,ll m)
{
    ll r=1;
    for(; b; b>>=1,a=mul(a,a,m))
        if(b&1)r=mul(r,a,m);
    return r;
}
int main()
{
    for(scanf("%lld",&t); t--;
            printf("%lld\n",mul(pow(2,a,M),(pow(2,b,M)-b-1+mul(pow(2,c,M),(b+d+1)%M,M)+M)%M,M)))
        scanf("%lld%lld%lld%lld",&a,&b,&c,&d);
}
```