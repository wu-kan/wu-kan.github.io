---
title: ACM ICPC 2013–2014, Northeastern European Regional Contest
categories: [ACM,题解]
abbrlink: 6702
date: 2018-08-28 17:25:38
---
# [Bonus Cards](https://vjudge.net/problem/Gym-100307B)
概率dp。
```cpp
#include<bits/stdc++.h>
#define cin fin
#define cout fout
using namespace std;
ifstream fin("bonus.in");
ofstream fout("bonus.out");
double f[3009][3009]/*= {1}*/;//去掉注释会因为生成文件过大而过不了编译？
double dp(int n,int a,int b,int c)
{
    for(int i=f[0][0]=1; i<=n; ++i)
        for(int j=0; j<=i; ++j)
        {
            f[i][j]=0;
            if(a-j+1>0&&b-i+j>=0)f[i][j]+=2*(a-j+1)/(2.0*(a-j+1)+b-i+j+c)*f[i-1][j-1];
            if(a-j>=0&&b-i+j+1>0)f[i][j]+=(b-i+j+1)/(2.0*(a-j)+b-i+j+1+c)*f[i-1][j];
        }
    return accumulate(f[n],f[n]+min(a,n)+1,0.0);
}
int main()
{
    int n,a,b;
    cin>>n>>a>>b;
    cout.precision(9);
    cout<<1-dp(n,a,b,2)<<'\n'<<1-dp(n,a,b,1);
}
```
# [Fraud Busters](https://vjudge.net/problem/Gym-100307F)
```cpp
#include<bits/stdc++.h>
#define cin fin
#define cout fout
using namespace std;
ifstream fin("fraud.in");
ofstream fout("fraud.out");
vector<string> ans;
string s,t;
int n,flag;
int main()
{
    for(cin>>s>>n; n--;)
    {
        cin>>t;
        for(int i=flag=0; !flag&&i<t.size(); ++i)
            if(s[i]!='*'&&s[i]!=t[i])
                flag=1;
        if(!flag)ans.push_back(t);
    }
    cout<<ans.size();
    for(int i=0; i<ans.size(); ++i)
        cout<<'\n'<<ans[i];
}
```
# [Hack Protection](https://vjudge.net/problem/Gym-100307H)
感觉相当复杂的一题，两小时就有一堆神仙过了……
```cpp
#include<bits/stdc++.h>
#define cin fin
#define cout fout
#define log2(n) LOG2[n]
#define at(n) operator[](n)
using namespace std;
typedef int ll;
const int N=1e5+9;
ifstream fin("hack.in");
ofstream fout("hack.out");
struct Log:vector<ll>
{
    Log(int N,ll E):vector<ll>(N,-1)
    {
        for(int i=1; i<N; ++i)at(i)=at(i/E)+1;
    }
} LOG2(N,2);
struct RangeAnd
{
    vector<vector<ll> > f;
    RangeAnd(const vector<ll> &a):f(log2(a.size())+1,a)
    {
        for(int k=0; k+1<f.size(); ++k)
            for(int i=0; i+(1<<k)<a.size(); ++i)
                f[k+1][i]=min(f[k][i],f[k][i+(1<<k)]);
    }
    ll min(ll l,ll r)//区间位与和区间最小值用一样的求法
    {
        return l&r;
    }
    ll ask(int l,int r)//[l,r]区间内的位与和
    {
        int k=log2(r-l+1);
        return min(f[k][l],f[k][r+1-(1<<k)]);
    }
    int bs(int l,int r,int b,ll val)//[l,r)区间内找最大的m使ask(b,m)==val
    {
        if(r-l<2)return l;
        int m=l+(r-l)/2;
        return ask(b,m)<val?bs(l,m,b,val):bs(m,r,b,val);
    }
};
struct RangeXor:vector<ll>
{
    unordered_map<ll,vector<int> > mp;
    RangeXor(int N):vector<ll>(N,0) {}
    void init()
    {
        for(int i=1; i<size(); ++i)mp[at(i)^=at(i-1)].push_back(i);
    }
};
int main()
{
    long long n,ans=0;
    cin>>n;
    RangeXor rx(n+1);
    for(int i=1; i<=n; ++i)cin>>rx[i];
    RangeAnd ra(rx);
    rx.init();
    for(int i=1; i<=n; ++i)
        for(int l,r; l<=n; l=r+1)
        {
            const vector<int> &v=rx.mp[ra.ask(i,l)^rx[i-1]];
            r=ra.bs(l,n+1,i,ra.ask(i,l));//[l,r]内任意m，[i,m]区间位与值均为ra.ask(i,l)^rx[i-1]
            ans+=upper_bound(v.begin(),v.end(),r)-lower_bound(v.begin(),v.end(),l);
        }
    cout<<ans;
}
```
# [Join the Conversation](https://vjudge.net/problem/Gym-100307J)
玄学字符串处理题，注意不要写丑了…
```cpp
#include<bits/stdc++.h>
#define cin fin
#define cout fout
using namespace std;
ifstream fin("join.in");
ofstream fout("join.out");
struct Identifier:unordered_map<string,int>
{
    int operator()(const string &a)
    {
        if(!count(a))insert(make_pair(a,size()));
        return at(a);
    }
} id;
string s;
unordered_map<int,int> mp;
pair<int,int> p[50005];
int n,user,mention,ans;
void print(int ans)
{
    if(ans)print(p[ans].second),cout<<ans<<' ';
}
int main()
{
    getline(cin>>n,s);
    for(int i=1; i<=n; ++i)
    {
        getline(cin,s,':');
        user=id(s);
        getline(cin,s);
        s+="  "+s+"  ";
        for(int pos=0,len; pos=s.find('@',pos),pos!=s.npos; pos+=len)
        {
            len=s.find(' ',pos)-pos;
            if(s[pos-1]==' '&&s[pos+len]==' ')
                if(mention=id(s.substr(pos,len)),mention!=user)
                    if(p[i].first<p[mp[mention]].first)
                    {
                        p[i].first=p[mp[mention]].first;
                        p[i].second=mp[mention];
                    }
        }
        if(++p[i].first,p[mp[user]].first<p[i].first)mp[user]=i;
        if(p[ans].first<p[i].first)ans=i;
    }
    cout<<p[ans].first<<'\n';
    print(ans);
}
```