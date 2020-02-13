---
title: 2015-2016 Petrozavodsk Winter Training Camp, Saratov SU Contest
tags:
  - ACM
  - 题解
---

## [Maximum Product](https://vjudge.net/problem/Gym-100886G)

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
vector<ll> a,b,ans;
ll n;
ll product(const vector<ll> &v)
{
	ll ret=1,i=0;
	while(!v[i])++i;
	for(; i<v.size(); ++i)ret*=v[i];
	return ret;
}
int main()
{
	for(scanf("%lld",&n); n; n/=10)a.push_back(n%10);
	for(scanf("%lld",&n); n; n/=10)b.push_back(n%10);
	while(a.size()<b.size())a.push_back(0);
	reverse(a.begin(),a.end());
	reverse(b.begin(),b.end());
	ans=b;
	for(ll i=0; i<b.size(); ++i)
		if(b[i])
		{
			vector<ll> v(b);
			--v[i];
			fill(v.begin()+i+1,v.end(),9);
			if(v>=a&&product(ans)<product(v))ans=v;
		}
	reverse(ans.begin(),ans.end());
	while(ans.back()==0)ans.pop_back();
	for(ll i=ans.size()-1; ~i; --i)printf("%lld",ans[i]);
}
```

## [Biathlon 2.0](https://vjudge.net/problem/Gym-100886H)

```cpp
#include <cstdio>
#include <cstring>
#include <algorithm>
using namespace std;

const int maxn=500000+10;
typedef long long ll;

struct track
{
	ll a,b,id;
}t[maxn];

struct rifle
{
	ll c,d;
}q[maxn],r[maxn];

ll n,m,cur,cnt;
ll ans[maxn];

bool cmp0(rifle x,rifle y)
{
	if (x.c!=y.c) return x.c<y.c;
	 else return x.d<y.d;
}
bool cmp1(track x,track y){return (x.a*y.b)>(y.a*x.b);}

int main()
{
	scanf("%lld",&n);
	for (int i=1;i<=n;i++) scanf("%lld%lld",&t[i].a,&t[i].b),t[i].id=i;
	scanf("%lld",&m);
	for (int i=1;i<=m;i++) scanf("%lld%lld",&q[i].c,&q[i].d);
	sort(t+1,t+n+1,cmp1);
//	for (int i=1;i<=n;i++) printf("%lld %lld %lld\n",t[i].a,t[i].b,t[i].id);
	sort(q+1,q+m+1,cmp0);
	r[1]=q[1]; cnt=1;
	for (int i=2;i<=m;i++)
	{
		if (q[i].c==r[cnt].c) continue;
		if (q[i].d>=r[cnt].d) continue;
		r[++cnt]=q[i];
	}
//	for (int i=1;i<=cnt;i++) printf("%d %d\n",r[i].c,r[i].d);
	memset(q,0,sizeof(q));
	q[1]=r[1];
	q[2]=r[2];
	int l=2;
	for (int i=3;i<=cnt;i++)
	{
		while ((l>1)&&((q[l].d-q[l-1].d)*(q[l].c-r[i].c)<(q[l-1].c-q[l].c)*(r[i].d-q[l].d))) l--;
		q[++l]=r[i];
	}
	cur=1;
	if (cnt==1) l=1;
	for (int i=1;i<=n;i++)
	{
		while ((cur<l)&&((t[i].a*q[cur].c+t[i].b*q[cur].d)>(t[i].a*q[cur+1].c+t[i].b*q[cur+1].d))) cur++;
		ans[t[i].id]=t[i].a*q[cur].c+t[i].b*q[cur].d;
	}
	for (int i=1;i<=n;i++) printf("%lld ",ans[i]);
	return 0;
}
```

## [Sockets](https://vjudge.net/problem/Gym-100886J)

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N=2e5+9;
ll n,m,a[N],b[N],c[N],s[N];
int main()
{
	scanf("%lld%lld",&n,&m);
	for(ll i=0; i<n; ++i)scanf("%lld",&a[i]);
	for(ll i=0; i<m; ++i)scanf("%lld",&b[i]);
	sort(a,a+n),sort(b,b+m);
	c[0]=1;
	for(ll i=0,now=0; i<m; ++i)
	{
		if(c[now]==0)
		{
			if(!n)break;
			for(ll j=0; j<b[i]; ++j)
				if(s[j])
				{
					--s[j];
					c[now=j+1]+=a[--n];
					break;
				}
		}
		while(n&&now<b[i])
		{
			c[now+1]+=a[--n];
			--c[now];
			while(!c[now])++now;
		}
		if(now<=b[i])
		{
			--c[now],++s[now];
			if(!c[now])++now;
		}
	}
	ll ans=0;
	for(ll i=0; i<=m; ++i)ans+=s[i];
	printf("%lld",ans);
}
```
