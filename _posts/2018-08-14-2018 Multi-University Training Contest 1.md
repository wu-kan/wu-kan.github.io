---
title: 2018 Multi-University Training Contest 1
categories: [ACM,题解]
abbrlink: 61614
date: 2018-08-14 21:20:59
---
~~垫底~~进队之后第一次集训。 
# [Maximum Multiple](https://vjudge.net/problem/HDU-6298)
 3的倍数拆 `1,1,1` ，4的倍数拆 `1,1,2` ，优先拆3的倍数。
```c
#include<stdio.h>
long long t,n;
int main()
{
    for(scanf("%lld",&t); t--;
            printf("%lld\n",n%3==0?n*n*n/27:
                   n%4==0?n*n*n/32:-1))
        scanf("%lld",&n);
}
```
# [Balanced Sequence](https://vjudge.net/problem/HDU-6299)
 具体思想是把每个串按删去可以自匹配的括号后的剩余串（形如 `)))((` ）排序：   
 左括号多于右括号的串排在左括号少于右括号的串前面；   
 同类型的串中，左括号多于右括号的串右括号少的放前面，右括号多于左括号的串左括号少的放前面。   
 现场谜之排序 `WA` 了十一发…
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100009;
struct Node
{
    int l,r;
    bool operator<(const Node &t)const
    {
        return r<l?(t.r<t.l?r<t.r:1):(t.r<t.l?0:l>t.l);
    }
} v[N];
char s[N];
int t,n,ans;
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%d",&n);
        for(int i=ans=0; i<n; ++i)
        {
            scanf("%s",s);
            for(int j=v[i].l=v[i].r=0; s[j]; ++j)
            {
                if(s[j]=='(')++v[i].l;
                else if(v[i].l)--v[i].l,++ans;
                else ++v[i].r;
            }
        }
        sort(v,v+n);
        for(int i=0,cnt=0; i<n; ++i)
        {
            ans+=min(cnt,v[i].r);
            cnt+=v[i].l-min(cnt,v[i].r);
        }
        printf("%d\n",ans*2);
    }
}
```
# [Triangle Partition](https://vjudge.net/problem/HDU-6300)
把所有点按照横坐标-纵坐标的字典序排序，选取依次相邻三项。
```cpp
#include<bits/stdc++.h>
using namespace std;
struct Coord:pair<int,int>
{
    int id;
} p[10009];
int t,n;
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%d",&n);
        for(int i=0; i<3*n; ++i)
            scanf("%d%d",&p[i].first,&p[i].second),p[i].id=i;
        sort(p,p+3*n);
        for (int i=0; i<3*n; ++i)
            printf("%d%c",p[i].id+1,i%3!=2?' ':'\n');
    }
}
```
# [Distinct Values](https://vjudge.net/problem/HDU-6301)
 队友写的。
```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <queue>
using namespace std;

const int maxn=100000+10;

pair<int,int> a[maxn];
int ans[maxn];
int t,n,m;
priority_queue<int,vector<int>,greater<int> > q;

int main()
{
    scanf("%d",&t);
    while (t--)
    {
        scanf("%d%d",&n,&m);
        memset(ans,0,sizeof(ans));
        if (m==0)
        {
            for (int i=1;i<n;i++) printf("1 ");
            printf("1\n");
            continue;
        }
        for (int i=1;i<=m;i++)
         scanf("%d%d",&a[i].first,&a[i].second);
        sort(a+1,a+m+1);
        while (!q.empty()) q.pop();
    //  for (int i=1;i<=m;i++) printf("!%d %d\n",a[i].first,a[i].second);
        for (int i=1;i<a[1].first;i++) ans[i]=1;
        for (int i=a[1].first;i<=a[1].second;i++) ans[i]=i-a[1].first+1;

        int l=a[1].first,r=a[1].second,mx=ans[a[1].second];
        for (int i=2;i<=m;i++)
        {
            if (a[i].second<=r) continue;
            if (a[i].first<=r)
            {
                for (int j=l;j<a[i].first;j++) q.push(ans[j]);
                for (int j=r+1;j<=a[i].second;j++)
                 if (!q.empty()) ans[j]=q.top(),q.pop();
                  else ans[j]=++mx;
            }
            else
            {
                while (!q.empty()) q.pop();
                mx=0;
                for (int j=a[i].first;j<=a[i].second;j++) ans[j]=++mx;
            }
            l=a[i].first; r=a[i].second;
        }
        for (int i=1;i<=n;i++)
         if (ans[i]==0) ans[i]=1;
        for (int i=1;i<n;i++) printf("%d ",ans[i]);
        printf("%d\n",ans[n]);
    }
}
```
# [Maximum Weighted Matching](https://vjudge.net/problem/HDU-6302)
```cpp
//假装会写
```
# [Period Sequence](https://vjudge.net/problem/HDU-6303)
```cpp
//假装会写
```
# [Chiaki Sequence Revisited](https://vjudge.net/problem/HDU-6304)
队友$O(\log\⁡log ⁡N)$的二分强行跑掉！太强啦！
```cpp
#include <cstdio>

typedef long long ll;
const ll mod=1e9+7;

int t;
ll n,v,ans,u;

inline ll geti(ll x)
{
    ll l=x/2-1,r=x;
    while (r-l>1)
    {
        ll mid=(l+r)/2,k=mid;
        ll g=0;
        while (k>0)
        {
            g+=k;
            k/=2;
        }
    //  printf("%lld %lld %lld %lld\n",l,r,mid,g);
        if (g<x) l=mid;
         else r=mid;
    }
    return r;
}

inline ll cal(ll x)
{
    ll ret=0,t=1;
    u=0;
    while (x>0) 
    {
        if (x&1) ret=(ret+((x%mod)*((x+1)/2%mod)%mod)*t)%mod;
         else ret=(ret+(((x+1)%mod)*((x/2)%mod)%mod)*t)%mod;
        //printf("ret=%lld\n",ret);
        u+=x;
        t=(t*2)%mod;
        x/=2;
    }
    return ret;
}

int main()
{
    scanf("%d",&t);
    while (t--)
    {
        scanf("%lld",&n);
        v=geti(n-1);
    //  printf("%lld ",v);
        ans=cal(v-1);
        ans=(ans+v*(n-1-u)+1)%mod;
        printf("%lld\n",ans);
    }
    return 0;
}
```
# [RMQ Similar Sequence](https://vjudge.net/problem/HDU-6305)
学习一个一队大爷的分治做法，正解好像和笛卡尔树有关？
dfs写起来奥妙重重…递归要尽量写在函数尾，而且写void形式，否则爆栈。
```cpp
#include<bits/stdc++.h>
#define mul(a,b,m) (1LL*(a)*(b)%(m))
#define inv(a,m) pow(a,(m)-2,m)
#define log2(n) LOG2[n]
using namespace std;
typedef int ll;
const int N=1e6+7,M=1e9+7;
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
} F(N,M);
struct Log:vector<ll>
{
    Log(int N,ll e):vector<ll>(N,-1)
    {
        for(int i=1; i<N; ++i)at(i)=at(i/e)+1;
    }
} LOG2(N,2);
int t,n,s;
struct SparseTable
{
    typedef pair<int,int> ll;
    vector<vector<ll> > f;
    SparseTable(const vector<ll> &a):f(log2(a.size())+1,a)
    {
        for(int k=0; k+1<f.size(); ++k)
            for(int i=0; i+(1<<k)<a.size(); ++i)
                f[k+1][i]=min(f[k][i],f[k][i+(1<<k)]);
    }
    ll ask(int l,int r)
    {
        int k=log2(r-l+1);
        return min(f[k][l],f[k][r+1-(1<<k)]);
    }
    void dfs(int l,int r)
    {
        if(l>r)return;
        int m=ask(l,r).second;
        if(l<m&&m<r)s=mul(s,F.c(r-l,m-l),M);
        dfs(l,m-1),dfs(m+1,r);
    }
};
int main()
{
    for(scanf("%d",&t); t--; printf("%d\n",s))
    {
        scanf("%d",&n);
        vector<pair<int,int> > a;
        for(int i=0; i<n; ++i)
            scanf("%d",&s),a.push_back(make_pair(-s,i));
        SparseTable st(a);
        s=mul(mul(n,F.ifac[2],M),F.ifac[n],M),st.dfs(0,n-1);
    }
}
```
# [Lyndon Substring](https://vjudge.net/problem/HDU-6306)
```cpp
//假装会写
```
# [Turn Off The Light](https://vjudge.net/problem/HDU-6307)
```cpp
//假装会写
```
# [Time Zone](https://vjudge.net/problem/HDU-6306)
读到的 `double` 乘十后要四舍五入，且 `istringstream` 速度太慢过不了。
```c
#include<stdio.h>
char s[9];
double d;
int t,a,b;
int main()
{
    for(scanf("%d",&t); t--; printf("%02d:%02d\n",(a+b/60)%24,b%60))
    {
        scanf("%d%d%s",&a,&b,&s);
        sscanf(s+3,"%lf",&d);
        if(d-=8,d<0)d+=24;
        b+=6*(int)(d*10+0.5);
    }
}
```