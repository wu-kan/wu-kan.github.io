---
title: 2018 Multi-University Training Contest 7
tags:
  - ACM
  - 题解
---

## [Sequence](https://vjudge.net/problem/HDU-6395)

```cpp
#include<bits/stdc++.h>
#define mul(a,b,c) (1LL*(a)*(b)%(c))
using namespace std;
typedef int ll;
const ll N=3,M=1e9+7;
struct Matrix
{
    static int n;
    ll a[N][N];
    Matrix(ll k=0)
    {
        for(int i=0; i<n; ++i)fill(a[i],a[i]+n,0),a[i][i]=k;
    }
};
int Matrix::n=N;
Matrix operator*(const Matrix &a,const Matrix &b)
{
    Matrix r(0);
    for(int i=0; i<r.n; ++i)
        for(int j=0; j<r.n; ++j)
            for(int k=0; k<r.n; ++k)
                r.a[i][j]=(r.a[i][j]+mul(a.a[i][k],b.a[k][j],M))%M;
    return r;
}
Matrix pow(Matrix a,ll b)
{
    Matrix r(1);
    for(; b; b>>=1,a=a*a)
        if(b&1)r=r*a;
    return r;
}
int main()
{
    int t,a,b,c,d,p,n;
    for(scanf("%d",&t); t--;)
    {
        scanf("%d%d%d%d%d%d",&a,&b,&c,&d,&p,&n);
        Matrix ans,e;
        ans.a[0][0]=a,ans.a[1][0]=b;
        e.a[1][0]=c,e.a[1][1]=d,e.a[0][1]=e.a[1][2]=e.a[2][2]=1;
        for(int i=3,last; i<=n; i=last+1)
        {
            if(ans.a[2][0]=p/i,ans.a[2][0])last=min(p/ans.a[2][0],n);
            else last=n;
            ans=pow(e,last-i+1)*ans;
        }
        printf("%lld\n",ans.a[1][0]);
    }
}
```
