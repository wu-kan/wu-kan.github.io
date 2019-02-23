---
title: 2018 Multi-University Training Contest 6
categories: [ACM,题解]
abbrlink: 13039
date: 2018-08-21 22:08:36
---
# [oval-and-rectangle](https://vjudge.net/problem/HDU-6362)
易积分得答案$\frac{1}{b}\int_0^b(4c+4a\sqrt{1-\frac{c^2}{b^2} })\,dc=2b-a\pi$。
```c
#include<stdio.h>
#include<math.h>
int t,a,b;
int main()
{
    for(scanf("%d",&t); t--; printf("%.6f\n",2*b+a*acos(-1)-5e-7))
        scanf("%d%d",&a,&b);
}
```
# [bookshelf](https://vjudge.net/problem/HDU-6363)
预处理阶乘需要两倍大…因为这个wa了七发，好气啊。
```cpp
#include<bits/stdc++.h>
#define mul(a,b,c) ((1LL)*(a)*(b)%(c))
#define inv(a,b) pow(a,(b)-2,b)
using namespace std;
typedef int ll;
const ll N=1e6+7,M=1e9+7;
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
} f(2*N,M);
struct Fibonacci:vector<ll>
{
    Fibonacci(int N,ll M):vector<ll>(N,0)
    {
        for(int i=at(1)=1; i+1<N; ++i)at(i+1)=(at(i)+at(i-1))%M;
    }
} fb(N,M-1);
struct Factor:vector<ll>
{
    Factor(ll n)
    {
        for(ll i=1; i*i<=n; ++i)
            if(n%i==0)push_back(i),push_back(n/i);
        sort(begin(),end()),resize(unique(begin(),end())-begin());
    }
};
int t,n,k,s,a[N];
int ask(int n,int k)
{
    if(~a[n])return a[n];
    if(n==1)return a[n]=k;
    Factor fac(n);
    for(ll i=a[n]=0; i<fac.size(); ++i)
        if(fac[i]>1)a[n]=(a[n]+ask(n/fac[i],k))%M;
    return a[n]=(f.c(n+k-1,k-1)-a[n]+M)%M;
}
int main()
{
    for(scanf("%d",&t); t--; printf("%lld\n",mul(inv(f.c(n+k-1,k-1),M),s,M)))
    {
        scanf("%d%d",&n,&k),fill(a,a+n+1,-1);
        Factor fac(n);
        for(ll i=s=0; i<fac.size(); ++i)
            s=(s+mul((pow(2,fb[fac[i]],M)-1+M)%M,ask(n/fac[i],k),M))%M;
    }
}
```
这个 `ask` 函数也可以不记忆化搜索直接通过莫比乌斯反演求。
```cpp
#include<bits/stdc++.h>
#define mul(a,b,c) ((1LL)*(a)*(b)%(c))
#define inv(a,b) pow(a,(b)-2,b)
using namespace std;
typedef int ll;
const ll N=1e6+7,M=1e9+7;
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
} f(2*N,M);
struct Fibonacci:vector<ll>
{
    Fibonacci(int N,ll M):vector<ll>(N,0)
    {
        for(int i=at(1)=1; i+1<N; ++i)at(i+1)=(at(i)+at(i-1))%M;
    }
} fb(N,M-1);
struct EulerSieve
{
    vector<int> p,m,mu;
    EulerSieve(int N):m(N,0),mu(N,0)
    {
        mu[1]=1;
        for(long long i=2,k; i<N; ++i)
        {
            if(!m[i])p.push_back(m[i]=i),mu[i]=-1;
            for(int j=0; j<p.size()&&(k=i*p[j])<N; ++j)
            {
                if((m[k]=p[j])==m[i])
                {
                    mu[k]=0;
                    break;
                }
                mu[k]=-mu[i];
            }
        }
    }
} e(N);
struct Factor:vector<ll>
{
    Factor(ll n)
    {
        for(ll i=1; i*i<=n; ++i)
            if(n%i==0)push_back(i),push_back(n/i);
        sort(begin(),end()),resize(unique(begin(),end())-begin());
    }
};
int ask(int n,int k)
{
    ll r=0;
    Factor fac(n);
    for(int i=0; i<fac.size(); ++i)
        if(n%fac[i]==0)
            r=(r+mul(f.c(n/fac[i]+k-1,k-1),(e.mu[fac[i]]+M)%M,M))%M;
    return r;
}
int main()
{
    int t,n,k,s;
    for(scanf("%d",&t); t--; printf("%lld\n",mul(inv(f.c(n+k-1,k-1),M),s,M)))
    {
        scanf("%d%d",&n,&k);
        Factor fac(n);
        for(ll i=s=0; i<fac.size(); ++i)
            s=(s+mul((pow(2,fb[fac[i]],M)-1+M)%M,ask(n/fac[i],k),M))%M;
    }
}
```
# [Ringland](https://vjudge.net/problem/HDU-6364)
队友写的wa了…有空改。
```cpp
#include <cstdio>
#include <algorithm>
using namespace std;

const int maxn=500000+10;

int t,n,l,u;
long long ans1,ans2,g;
int a[maxn],b[maxn];

int main()
{
    scanf("%d",&t);
    while (t--)
    {
        scanf("%d%d",&n,&l);
        u=l/2;
        for (int i=1;i<=n;i++) scanf("%d",&a[i]);
        for (int i=1;i<=n;i++) scanf("%d",&b[i]);
        if (a[1]<=b[1]) swap(a,b);
        ans1=ans2=0;
        for (int i=1;i<=n;i++)
        {
            g=a[i]-b[i];
            if (g<0) g=-g;
            if (g>u) g=l-g;
            ans1+=g;
        }
        for (int i=1;i<n;i++)
        {
            g=a[i]-b[i+1];
            if (g<0) g=-g;
            if (g>u) g=l-g;
            ans2+=g;
        }
        g=b[1]-a[n];
        if (g<0) g=-g;
        if (g>u) g=l-g;
        ans2+=g;
        printf("%I64d\n",min(ans1,ans2));
    }
    return 0;
}
```
# [Werewolf](https://vjudge.net/problem/HDU-6370)
```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <vector>
#include <queue>
using namespace std;

const int maxn=100000+10;

int t,n,ans;
vector <int> pre[maxn];
int nxt[maxn],v[maxn],ind[maxn];
bool vis[maxn];
char s[15];
queue <int> q;

int dfs(int cur)
{
    vis[cur]=true;
    if ((v[cur]==0)||(vis[nxt[cur]])) return cur;
    dfs(nxt[cur]);
}

int main()
{
    scanf("%d",&t);
    while (t--)
    {
        scanf("%d",&n);
        memset(ind,0,sizeof(ind));
        for (int i=1;i<=n;i++)
        {
            scanf("%d%s",&nxt[i],s);
            if (s[0]=='v') v[i]=1;//1 村民 
             else v[i]=0;
            pre[nxt[i]].push_back(i);
            ind[nxt[i]]++;
        }
        for (int i=1;i<=n;i++)
         if (ind[i]==0) q.push(i);
        while (!q.empty())
        {
            int g=q.front();
            q.pop();
            ind[nxt[g]]--;
            if (ind[nxt[g]]==0) q.push(nxt[g]);
        }
        memset(vis,false,sizeof(vis));
        for (int i=1;i<=n;i++)
         if (ind[i]&&(!vis[i])&&(v[i]==0))
         {
            int k=dfs(nxt[i]);
            if (k==i) q.push(nxt[i]);
         }
        ans=0;
        while (!q.empty())
        {
            int g=q.front();
            q.pop();
            ans++;
            for (int i=0;i<pre[g].size();i++)
             if (v[pre[g][i]]==1) q.push(pre[g][i]);
        }
        printf("0 %d\n",ans);
        for (int i=1;i<=n;i++) pre[i].clear();
    }
    return 0;
}
```
# [Pinball](https://vjudge.net/problem/HDU-6373)
模拟每次落点时的速度即可。
```cpp
#include<bits/stdc++.h>
#define X real()
#define Y imag()
using namespace std;
const double EPS=1e-9,PI=acos(-1),g=9.8;
typedef complex<double> Coord;
int sgn(double d)
{
    return (d>EPS)-(d<-EPS);
}
int t,ans;
int main()
{
    for(scanf("%d",&t); t--; printf("%d\n",ans))
    {
        double a,b,x,t;
        scanf("%lf%lf%lf%lf",&a,&b,&x,&t);
        for(Coord p(x,-x*b/a),v(ans=0,-sqrt(2*g*(t+x*b/a))); sgn(p.X)<=0; ++ans)
            v*=polar(1.0,2*arg(Coord(-a,b))-2*arg(v)+PI),
               t=2*(b*v.X/a+v.Y)/g,
               p=Coord(p.X+v.X*t,p.Y+v.Y*t-g*t*t/2),
               v=Coord(v.X,v.Y-g*t);
    }
}
```