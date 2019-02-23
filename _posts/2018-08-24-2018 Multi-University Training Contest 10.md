---
title: 2018 Multi-University Training Contest 10
categories: [ACM,题解]
abbrlink: 43121
date: 2018-08-24 21:07:34
---
# [Problem G. Cyclic](https://vjudge.net/problem/HDU-6432)
递推。
```c
#include<stdio.h>
#define N 100009
#define M 998244353
#define mul(a,b,c) ((a)*(b)%(c))
typedef long long ll;
ll t,n,f[N]= {0,1,0,1,1};
int main()
{
    for(ll i=5; i<N; ++i)
        f[i]=(mul(i-3,f[i-1],M)+mul(2*i-4,f[i-2],M)+mul(i-2,f[i-3],M))%M;
    for(scanf("%lld",&t); t--; printf("%lld\n",f[n]))
        scanf("%lld",&n);
}
```
# [Problem H. Pow](https://vjudge.net/problem/HDU-6433)
交了一个高精度。
```
#include<bits/stdc++.h>
using namespace std;
struct Wint:vector<int>
{
    static const int width=9,base=1e9;
    Wint(unsigned long long n=0)
    {
        for(; n; n/=base)push_back(n%base);
    }
    explicit Wint(const string &s)
    {
        for(int len=int(s.size()-1)/width+1,b,e,i=0; i!=len; ++i)
            for(e=s.size()-i*width,b=max(0,e-width),push_back(0); b!=e; ++b)
                back()=back()*10+s[b]-'0';
        trim(0);
    }
    Wint& trim(bool up=1)
    {
        for(int i=1; up&&i<size(); ++i)
        {
            if(at(i-1)<0)--at(i),at(i-1)+=base;
            if(at(i-1)>=base)at(i)+=at(i-1)/base,at(i-1)%=base;
        }
        while(!empty()&&back()<=0)pop_back();
        for(; up&&!empty()&&back()>=base; at(size()-2)%=base)
            push_back(back()/base);
        return *this;
    }
};
Wint& operator*=(Wint &a,const Wint &b)
{
    Wint c;
    c.assign(a.size()+b.size()+2,0);
    for(int j=0,k,l; j<b.size(); ++j)
        if(b[j])
            for(int i=0; i<a.size(); ++i)
            {
                unsigned long long n=a[i];
                for(n*=b[j],k=i+j; n; n/=c.base)c[k++]+=n%c.base;
                for(l=i+j; c[l]>=c.base||l<k; c[l++]%=c.base)c[l+1]+=c[l]/c.base;
            }
    return swap(a,c),a.trim(0);
}
ostream& operator<<(ostream &os,const Wint &n)
{
    if(n.empty())return os.put('0');
    os<<n.back();
    char ch=os.fill('0');
    for(int i=n.size()-2; ~i; --i)
        os.width(n.width),os<<n[i];
    return os.fill(ch),os;
}
typedef Wint ll;
ll pow(ll a,int b)
{
    ll r=1;
    for(; b; b>>=1,a*=a)
        if(b&1)r*=a;
    return r;
}
int main()
{
    int t,n;
    for(cin>>t; t--; cout<<pow(ll(2),n)<<'\n')
        cin>>n;
}
```
可以直接修改cout的浮点输出方式为指数形式输出。
```cpp
#include<bits/stdc++.h>
using namespace std;
int main()
{
    int t,n;
    for(cin>>t; t--; cout<<fixed<<setprecision(0)<<pow(2,n)<<'\n')
        cin>>n;
}
```
# [Problem I. Count](https://vjudge.net/problem/HDU-6434)
```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
struct EulerSieve
{
    vector<int> p,m,phi;
    vector<ll> sum;
    EulerSieve(int N):m(N,0),phi(N,0),sum(N,0)
    {
        phi[1]=1;
        for(long long i=2,k; i<N; ++i)
        {
            if(!m[i])p.push_back(m[i]=i),phi[i]=i-1;
            sum[i]=sum[i-1]+(i%2?phi[i]/2:phi[i]);
            for(int j=0; j<p.size()&&(k=i*p[j])<N; ++j)
            {
                phi[k]=phi[i]*p[j];
                if((m[k]=p[j])==m[i])break;
                phi[k]-=phi[i];
            }
        }
    }
} e(2e7+7);
int main()
{
    ll t,n;
    for(scanf("%lld",&t); t--; printf("%lld\n",e.sum[n]))scanf("%lld",&n);
}
```
# [Problem J. CSGO](https://vjudge.net/problem/HDU-6435)
```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
using namespace std;

const int maxn=100000+10;

int t,n,m,k,v;
long long f[70],g[70];
int x[10];
long long ans;

int main()
{
    scanf("%d",&t);
    while (t--)
    {
        memset(f,0,sizeof(f));
        memset(g,0,sizeof(g));
        ans=0;
        scanf("%d%d%d",&n,&m,&k);
        for (int i=1;i<=n;i++)
        {
            scanf("%d",&v);
            for (int i=1;i<=k;i++) scanf("%d",&x[i]);
            for (int j=0;j<(1<<(k+1));j++)
            {
                long long sum=v;
                for (int l=1;l<=k;l++)
                 if ((1<<l)&j) sum+=x[l];
                  else sum-=x[l];
                f[j]=max(f[j],sum);
            }
        }
        for (int i=1;i<=m;i++)
        {
            scanf("%d",&v);
            for (int i=1;i<=k;i++) scanf("%d",&x[i]);
            for (int j=0;j<(1<<(k+1));j++)
            {
                long long sum=v;
                for (int l=1;l<=k;l++)
                 if ((1<<l)&j) sum+=x[l];
                  else sum-=x[l];
                ans=max(ans,sum+f[(1<<(k+1))-1-j]);
            }
        }
        printf("%lld\n",ans);
    }
    return 0;
}
```
# [Problem L.Videos](https://vjudge.net/problem/HDU-6437)
最大费用流。
```cpp
#include<bits/stdc++.h>
using namespace std;
typedef int ll;
const ll INF=1e9,NPOS=-1;
struct Graph
{
    struct Vertex
    {
        vector<int> a;
    };
    struct Edge
    {
        int from,to;
        ll dist,cap;
    };
    vector<Vertex> v;
    vector<Edge> e;
    Graph(int n):v(n) {}
    void add(const Edge &ed)
    {
        v[ed.from].a.push_back(e.size());
        e.push_back(ed);
    }
};
struct EdmondKarp:Graph
{
    ll flow,cost;
    vector<ll> f;
    EdmondKarp(int n):Graph(n) {}
    void add(Edge ed)
    {
        Graph::add(ed);
        swap(ed.from,ed.to),ed.cap=0,ed.dist*=-1;
        Graph::add(ed);
    }
    void ask(int s,int t)
    {
        vector<int> p(v.size(),NPOS);
        for(f.assign(e.size(),flow=cost=0);;)
        {
            vector<ll> d(v.size(),INF);
            vector<int> flag(v.size(),d[s]=0);
            for(deque<int> q(flag[s]=1,s); !q.empty(); q.pop_front())
                for(int u=q.front(),i=flag[u]=0,k,to; i<v[u].a.size(); ++i)
                    if(k=v[u].a[i],to=e[k].to,
                            e[k].cap>f[k]&&d[to]>d[u]+e[k].dist)
                    {
                        d[to]=d[u]+e[k].dist,p[to]=k;
                        if(!flag[to])q.push_back(to),flag[to]=1;
                    }
            if(d[t]==INF)return;
            ll _f=INF;
            for(int u=t; u!=s; u=e[p[u]].from)
                _f=min(_f,e[p[u]].cap-f[p[u]]);
            for(int u=t; u!=s; u=e[p[u]].from)
                cost+=_f*e[p[u]].dist,f[p[u]]+=_f,f[p[u]^1]-=_f;
            flow+=_f;
        }
    }
};
int t,n,m,k,w,S[255],T[255],W[255],P[255];
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%d%d%d%d",&n,&m,&k,&w);
        EdmondKarp g(m*2+3);
        for(int i=1; i<=m; ++i)
            scanf("%d%d%d%d",&S[i],&T[i],&W[i],&P[i]);
        for(int i=1; i<=m; ++i)
        {
            for(int j=1; j<=m; ++j)
                if(S[j]>=T[i])
                    g.add({2*i+1,2*j,P[i]==P[j]?w:0,1});
            g.add({1,2*i,0,1});
            g.add({2*i,2*i+1,-W[i],1});
            g.add({2*i+1,2*m+2,0,1});
        }
        g.add({0,1,0,k});
        g.ask(0,2*m+2);
        printf("%d\n",-g.cost);
    }
}
```