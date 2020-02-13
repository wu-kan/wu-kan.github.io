---
title: 2018 Multi-University Training Contest 4
tags:
  - ACM
  - 题解
---

## [Problem B. Harvest of Apples](https://vjudge.net/problem/HDU-6333)

```cpp
#include<bits/stdc++.h>
#define mul(a,b,c) ((a)*(b)%(c))
#define inv(a,m) pow(a,m-2,m)
#define C(n,m) mul(mul(f.fac[n],f.ifac[m],M),f.ifac[(n)-(m)],M)
using namespace std;
typedef long long ll;
const ll N=1e5+7,M=1e9+7,BS=sqrt(N);
ll t,n,m,ans[N];
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
    Factorial(int N):fac(N,1),ifac(N,1)
    {
        for(int i=1; i<N; ++i)fac[i]=mul(fac[i-1],i,M);
        ifac[N-1]=inv(fac[N-1],M);
        for(int i=N-1; i; --i)ifac[i-1]=mul(ifac[i],i,M);
    }
} f(N);
struct Mo
{
    struct Query
    {
        int l,r,id;
        bool operator<(const Query& q)const
        {
            return l/BS!=q.l/BS?l<q.l:r<q.r;
        }
    };
    vector<Query> q;
    ll L,R,ANS;
    void query(int l,int r)
    {
        q.push_back(Query {l,r,q.size()});
    }
    void cal(int id)
    {
        ans[id]=ANS;
    }
    void ask()
    {
        sort(q.begin(),q.end());
        ANS=L=1,R=0;
        for(int i=0; i<q.size(); ++i)
        {
            for(; L<q[i].l; ++L)ANS=(2*ANS-C(L,R)+M)%M;
            for(; R>q[i].r; --R)ANS=(ANS-C(L,R)+M)%M;
            for(; R<q[i].r; ++R)ANS=(ANS+C(L,R+1))%M;
            for(; L>q[i].l; --L)ANS=mul((ANS+C(L-1,R))%M,f.ifac[2],M);
            cal(q[i].id);
        }
    }
} mo;
int main()
{
    for(scanf("%lld",&t); t--; mo.query(n,m))scanf("%lld%lld",&n,&m);
    mo.ask();
    for(int i=0; i<mo.q.size(); ++i)printf("%lld\n",ans[i]);
}
```

## [Problem D. Nothing is Impossible](https://vjudge.net/problem/HDU-6335)

```cpp
#include<bits/stdc++.h>
using namespace std;
int t,n,m,a,b[127];
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%d%d",&n,&m);
        for(int i=0; i<n; ++i)scanf("%d%d",&a,&b[i]);
        sort(b,b+n);
        b[n]=2e9,a=0;
        for(long long p=1; p<=m; ++a)p*=b[a]+1;
        printf("%d\n",a-1);
    }
}
```

## [Problem E. Matrix from Arrays](https://vjudge.net/problem/HDU-6336)

```cpp
#include<stdio.h>
typedef long long ll;
ll t,l,q,a[15],x0,x1,y0,y1,M[999][999],b[31][31];
void init()
{
    ll cursor = 0,T=2*l;
    for (ll i = 0; i<3*T; ++i)
    {
        for (ll j = 0; j <= i; ++j)
        {
            M[j][i - j] = a[cursor];
            cursor = (cursor + 1) % l;
        }
    }
    for(ll i=0; i<T; ++i)
        for(ll j=0; j<T; ++j)
            b[i+1][j+1]=M[i][j]+b[i+1][j]+b[i][j+1]-b[i][j];
}
ll ask(ll x,ll y)
{
    ++x,++y;
    ll T=2*l,tx=x/T,ty=y/T,dx=x%T,dy=y%T;
    return tx*ty*b[T][T]+b[dx][T]*ty+b[T][dy]*tx+b[dx][dy];
}
int main()
{
    for(scanf("%lld",&t); t--;)
    {
        scanf("%lld",&l);
        for(ll i=0; i<l; ++i)scanf("%lld",&a[i]);
        init();
        for(scanf("%lld",&q); q--;)
        {
            scanf("%lld%lld%lld%lld",&x0,&y0,&x1,&y1);
            printf("%lld\n",ask(x1,y1)-ask(x0-1,y1)-ask(x1,y0-1)+ask(x0-1,y0-1));
        }
    }
}
```

## [Problem J. Let Sudoku Rotate](https://vjudge.net/problem/HDU-6341)

```cpp
#include <cstdio>
#include <cstdlib>
#include <cstring>
#include <algorithm>

using namespace std;

struct reg
{
    int X[4],Y[4];
}C[20];

void turn(int k)
{
    int a=C[k].X[0],b=C[k].X[1],c=C[k].X[2],d=C[k].X[3];
    C[k].X[0]=C[k].Y[0];
    C[k].X[1]=C[k].Y[1];
    C[k].X[2]=C[k].Y[2];
    C[k].X[3]=C[k].Y[3];
    C[k].Y[0]=d;C[k].Y[1]=c;C[k].Y[2]=b;C[k].Y[3]=a;
}

int ans;
int y[20];

void DFS(int k,int cnt,int x0,int x1,int x2,int x3)
{
    if (k>15)
    {
        ans=min(ans,cnt);
        return;
    }
    if (k%4==0) x0=x1=x2=x3=0;
    if (cnt>=ans) return;
    for (int i=0;i<=3;++i)
    {
        bool ok=true;
        for (int j=k%4*4;j<=k%4*4+3;++j)
            if (y[j]&C[k].Y[j%4]) {ok=false;break;}

        if (ok && ((x0&C[k].X[0])==0) && ((x1&C[k].X[1])==0) && ((x2&C[k].X[2])==0) && ((x3&C[k].X[3])==0))
        {
            for (int j=k%4*4;j<=k%4*4+3;++j)
                y[j]|=C[k].Y[j%4];

            DFS(k+1,cnt+i,x0|C[k].X[0],x1|C[k].X[1],x2|C[k].X[2],x3|C[k].X[3]);

            for (int j=k%4*4;j<=k%4*4+3;++j)
                y[j]-=C[k].Y[j%4];
        }
        turn(k);
    }

}

int n;
char s[20][20];

int change(char c)
{
    if ('0'<=c && c<='9') return (1<<(c-'0'));
    return (1<<(c-'A'+10));
}

int main()
{
    scanf("%d",&n);
    while (n--)
    {
        memset(C,0,sizeof(C));
        ans=50;
        for (int i=0;i<=15;++i)
            scanf("%s",s[i]);
        for (int i=0;i<=15;++i)
        {
            int X=i/4,Y=i%4;
            int x1=X*4,x2=X*4+3,y1=Y*4,y2=Y*4+3;
            for (int x=x1;x<=x2;++x)
            for (int y=y1;y<=y2;++y)
            {
                C[i].X[x-x1]|=change(s[x][y]);
                C[i].Y[y-y1]|=change(s[x][y]);
            }
        }
        memset(y,0,sizeof(y));
        DFS(0,0,0,0,0,0);
        printf("%d\n",ans);
    }
}
```

## [Problem K. Expression in Memories](https://vjudge.net/problem/HDU-6342)

```cpp
#include <cstdio>
#include <cstdlib>

using namespace std;

int T;
char s[1000];

int main()
{
    scanf("%d",&T);
    while (T--)
    {
        scanf("%s",s+1);
        bool op=true,zero=false,OK=true;
        for (int i=1;s[i];++i)
        {
            if (s[i]=='?')
            {
                if (zero)
                {
                    zero=false;op=true;s[i]='+';
                }else
                {
                    op=zero=false;s[i]='1';
                }
            }
            else
            if (s[i]=='+' || s[i]=='*')
            {
                if (op) {OK=false;break;}
                op=true;zero=false;
            }
            else
            if (s[i]=='0')
            {
                if (zero) {OK=false;break;}
                if (op) zero=true;
                op=false;
            }
            else
            if ('1'<=s[i] && s[i]<='9')
            {
                if (zero) {OK=false;break;}
                op=zero=false;
            }
        }
        if (op) OK=false;
        if (OK) printf("%s\n",s+1);
        else    printf("IMPOSSIBLE\n");
    }
}
```

## [Problem L. Graph Theory Homework](https://vjudge.net/problem/HDU-6343)

```cpp
#include <cstdio>
#include <cstdlib>
#include <cmath>

using namespace std;

int t,n;
int a[100010];

int main()
{
    scanf("%d",&t);
    while (t--)
    {
        scanf("%d",&n);
        for (int i=1;i<=n;++i) scanf("%d",&a[i]);
        int del=abs(a[1]-a[n]);
        for (int i=1;i<=100000;++i)
        {
            if (i*i>del) {printf("%d\n",i-1);break;}
        }
    }
}
```
