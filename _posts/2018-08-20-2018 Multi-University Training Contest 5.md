---
title: 2018 Multi-University Training Contest 5
tags:
  - ACM
  - 题解
---

## [Beautiful Now](https://vjudge.net/problem/HDU-6351)

以为是贪心但是贪心的策略过不了 `2311` ，于是暴搜。

```cpp
#include<bits/stdc++.h>
using namespace std;
char s[15];
int t,k,mi,ma;
void dfs(int n,int k,int v)
{
    if(k<0)return;
    if(!s[n])mi=min(mi,v),ma=max(ma,v);
    for(int i=n; s[i]; ++i)
    {
        swap(s[n],s[i]);
        if(s[0]!='0')dfs(n+1,k-(s[n]!=s[i]),v*10+s[n]-'0');
        swap(s[n],s[i]);
    }
}
int main()
{
    for(scanf("%d",&t); t--; printf("%d %d\n",mi,ma))
        scanf("%s%d",s,&k),mi=1e9,dfs(0,k,ma=0);
}
```

## [Everything Has Changed](https://vjudge.net/problem/HDU-6354)

对于每个小圆 B，在最终答案里加上其在主圆 C 内部的弧长、减去 C 在 B 中的弧长。

```cpp
#include<bits/stdc++.h>
using namespace std;
const double EPS=1e-9,PI=acos(-1);
typedef complex<double> Coord;
struct Circle
{
    Coord c;
    double r;
    Circle(Coord c=Coord(),double r=0):c(c),r(r) {}
};
int sgn(double d)
{
    return (d>EPS)-(d<-EPS);
}
double cal(Circle C,Circle B)
{
    double d=abs(B.c-C.c);
    return sgn(B.r+C.r-d)<0||sgn(fabs(B.r-C.r)-d)>0?0:
           2*C.r*acos((d*d+C.r*C.r-B.r*B.r)/2/d/C.r);
}
int main()
{
    int t,m,x,y,r;
    for(scanf("%d",&t); t--;)
    {
        Circle C(Coord(0,0));
        double s=0;
        for(scanf("%d%lf",&m,&C.r); m--;)
        {
            scanf("%d%d%d",&x,&y,&r);
            Circle B(Coord(x,y),r);
            s+=cal(B,C)-cal(C,B);
        }
        printf("%.9f\n",s+2*PI*C.r);
    }
}
```

## [Glad You Came](https://vjudge.net/problem/HDU-6356)

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
typedef unsigned ul;
ul rng61(ul &x,ul &y,ul &z)
{
    return x^=x<<11,x^=x>>4,x^=x<<5,x^=x>>14,swap(x,y),swap(y,z),z^=x^y;
}
struct SegmentTree
{
    struct Node
    {
        ll set;
    };
    vector<Node> v;
    int LAST,L,R;
    SegmentTree(int n):LAST(n),v(2*n+1) {}
    Node &lv(int l,int r)
    {
        return v[l+r|l!=r];
    }
    void set(int l,int r,ll val,bool out=1)
    {
        if(out)return L=l,R=r,set(1,LAST,val,0);
        if(val<lv(l,r).set)return;
        if(L<=l&&r<=R)
        {
            lv(l,r).set=val;
            return;
        }
        int m=l+(r-l)/2;
        if(L<=m)set(l,m,val,0);
        if(R>m)set(m+1,r,val,0);
    }
    ll ask(int l,int r)
    {
        if(l==r)return l*lv(l,r).set;
        int m=l+(r-l)/2;
        lv(l,m).set=max(lv(l,m).set,lv(l,r).set);
        lv(m+1,r).set=max(lv(m+1,r).set,lv(l,r).set);
        return ask(l,m)^ask(m+1,r);
    }
};
int main()
{
    ul t,n,m,x,y,z;
    for(scanf("%u",&t); t--;)
    {
        scanf("%u%u%u%u%u",&n,&m,&x,&y,&z);
        SegmentTree tree(n);
        for(int i=0,l,r; i<m; ++i)
        {
            if(l=rng61(x,y,z)%n+1,r=rng61(x,y,z)%n+1,l>r)swap(l,r);
            tree.set(l,r,rng61(x,y,z)%(1<<30));
        }
        printf("%lld\n",tree.ask(1,n));
    }
}
```
