---
title: 2018 Multi-University Training Contest 8
categories: [ACM,题解]
abbrlink: 63086
date: 2018-08-23 00:15:13
---
# [Character Encoding](https://vjudge.net/problem/HDU-6397)
容斥一下即可。
```cpp
#include<bits/stdc++.h>
#define mul(a,b,c) ((a)*(b)%(c))
#define inv(a,b) pow(a,(b)-2,b)
using namespace std;
typedef long long ll;
const ll N=1e5+7,M=998244353;
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
int main()
{
    int t,n,m,k,ans;
    for(scanf("%d",&t); t--; printf("%d\n",ans))
    {
        scanf("%d%d%d",&n,&m,&k);
        for(int i=ans=0; k+m-1-i*n>=m-1&&i<=m; ++i)
        {
            if(i%2)ans=(ans-mul(f.c(m,i),f.c(k+m-1-i*n,m-1),M)+M)%M;
            else ans=(ans+mul(f.c(m,i),f.c(k+m-1-i*n,m-1),M))%M;
        }
    }
}
```
# [Parentheses Matrix](https://vjudge.net/problem/HDU-6400)
两种方案并行选最优。
```cpp
#include<bits/stdc++.h>
using namespace std;
void printH(int h,int w)
{
    for(int i=0; i<h; ++i,printf("\n"))
        for(int j=0; j<w; ++j)
            printf(i%2?")":"(");
}
void printW(int h,int w)
{
    for(int i=0; i<h; ++i,printf("\n"))
        for(int j=0; j<w; ++j)
            printf(j%2?")":"(");
}
char s[255][255];
void PH(int h,int w)
{
    for(int i=0; i<h; ++i)
        for(int j=0; j<w; ++j)
            s[i][j]=i%2?')':'(';
    for(int i=1; i<h-2; i+=2)
        for (int j=0; j<w/2; ++j)swap(s[i][j],s[i+1][j]);
    for(int i=0; i<h; ++i,printf("\n"))
        for (int j=0; j<w; ++j)printf("%c",s[i][j]);
}
void PW(int h,int w)
{
    for(int i=0; i<h; ++i)
        for(int j=0; j<w; ++j)
            s[i][j]=j%2?')':'(';
    for(int j=1; j<w-2; j+=2)
        for (int i=0; i<h/2; ++i)swap(s[i][j],s[i][j+1]);
    for(int i=0; i<h; ++i,printf("\n"))
        for (int j=0; j<w; ++j)printf("%c",s[i][j]);
}
void cal1(int h,int w)
{
    if(h>w)PW(h,w);
    else PH(h,w);
}
void cal(int h,int w)
{
    for(int i=0; i<h; ++i,printf("\n"))
        for(int j=0; j<w; ++j)
            printf(!i?"(":
                   i==h-1?")":
                   !j?"(":
                   j==w-1?")":
                   (i+j)%2?"(":")");
}
int main()
{
    int t,h,w;
    for(scanf("%d",&t); t--;)
    {
        scanf("%d%d",&h,&w);
        if(h%2&&w%2)printW(h,w);
        else if(h%2)printW(h,w);
        else if(w%2)printH(h,w);
        else if(h+w-min(h,w)/2-1>h+w-4)cal1(h,w);
        else cal(h,w);
    }
}
```
# [Magic Square](https://vjudge.net/problem/HDU-6401)
```cpp
#include<bits/stdc++.h>
using namespace std;
struct Matrix
{
    char a[9][9];
    void spin(int x,int y)
    {
        swap(a[x][y],a[x+1][y]),swap(a[x+1][y],a[x+1][y+1]),swap(a[x+1][y+1],a[x][y+1]);
    }
} m;
int t,n;
int main()
{
    for(scanf("%d",&t); t--;)
    {
        scanf("%d",&n);
        for(int i=0; i<3; ++i)scanf("%s",&m.a[i]);
        for(char s[9]; n--;)
        {
            scanf("%s",s);
            for(int i=s[1]=='C'?1:3; i; --i)
                m.spin(s[0]=='3'||s[0]=='4',s[0]=='2'||s[0]=='4');
        }
        for(int i=0; i<3; ++i)printf("%s\n",m.a[i]);
    }
}
```
# [Taotao Picks Apples](https://vjudge.net/problem/HDU-6406)
```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
#include <vector>
using namespace std;

const int maxn=200000+10;

struct query
{
    int id,p,q;
}q[maxn];

bool cmp(query x,query y) {return x.p>y.p;}

int t,n,m,tr,br,cur;
int h[maxn],a[maxn],b[maxn],f[maxn],ans[maxn];
vector <int> k[maxn];
bool inans[maxn];

int getpos(int v)
{
    int l=0,r=br,mid;
    while (r-l>1)
    {
        mid=(l+r)/2;
        if (h[b[mid]]>v) l=mid;
         else r=mid;
    }
    return l;
}

int main()
{
    scanf("%d",&t);
    while (t--)
    {
        scanf("%d%d",&n,&m);
        for (int i=1;i<=n;i++) scanf("%d",&h[i]);
        for (int i=1;i<=m;i++)
        {
            scanf("%d%d",&q[i].p,&q[i].q);
            q[i].id=i;
        }
        sort(q+1,q+m+1,cmp);
        tr=1; cur=1; h[0]=1e9*2;    
        for (int i=n;i>=1;i--)
        {
            while ((tr>1)&&(h[a[tr-1]]<=h[i])) k[i].push_back(h[a[tr-1]]),tr--;
            a[tr++]=i;
        }
        memset(inans,false,sizeof(inans));
        for (int i=1;i<tr;i++) inans[a[i]]=true;
        cur=0;
        for (int i=1;i<=n;i++) 
        {
            f[i]=cur;
            if (i==a[tr-cur-1]) cur++;
        }
        br=1; cur=1;
        for (int i=n;i>=1;i--)
        {
            while ((cur<=m)&&(q[cur].p==i))
            {
                if (q[cur].q>h[i])
                {
                    if ((h[a[tr-f[i]]]>=q[cur].q)&&(i!=1)) ans[q[cur].id]=tr-1;
                    else
                    {
                        int g=getpos(q[cur].q);
                        //printf("??%d ",g);
                        ans[q[cur].id]=f[i]+g+1;
                    }
                }
                else if (q[cur].q<h[i])
                {
                    if (!inans[i]) ans[q[cur].id]=tr-1;
                    else
                    {
                        int g1=upper_bound(k[i].begin(),k[i].end(),q[cur].q)-k[i].begin();
                        int g2=upper_bound(k[i].begin(),k[i].end(),h[a[tr-f[i]]])-k[i].begin();
                        if (i==1) g2=-1;
                        ans[q[cur].id]=tr-1+k[i].size()-max(g1,g2);
                    //  printf("? %d %d\n",g1,g2);
                        if ((q[cur].q<=h[a[tr-f[i]]])&&(i!=1)) ans[q[cur].id]--;
                    }   
                }
                else ans[q[cur].id]=tr-1;
            //  printf("! %d %d %d %d\n",q[cur].id,q[cur].p,q[cur].q,ans[q[cur].id]);
                cur++; 
            }
            while ((br>1)&&(h[b[br-1]]<=h[i])) br--;
            b[br++]=i;
        }
        for (int i=1;i<=m;i++) printf("%d\n",ans[i]);
        for (int i=1;i<=n;i++) 
        {
            vector <int> x;
            swap(k[i],x);
        }
        memset(ans,0,sizeof(ans));
    }
    return 0;
}
```