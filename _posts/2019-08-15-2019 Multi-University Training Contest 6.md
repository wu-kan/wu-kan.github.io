---
title: 2019 Multi-University Training Contest 6
tags:
  - ACM
  - 题解
---

## [Nonsense Time](https://vjudge.net/problem/HDU-6635)

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long LL;

const int maxn=5e4+100;
int T,n,Max,tim;
int p[maxn],k[maxn],f[maxn],bac[maxn],g[maxn],gg[maxn],ans[maxn],lin[maxn];
bool ok[maxn];

void lis()
{
	Max=0;
	for (int i=1;i<=n;i++) g[i]=maxn;
	for (int i=1;i<=n;i++)
	{
		if (!ok[i]) continue;
		int t=lower_bound(g+1,g+1+n,p[i])-g;
		f[i]=t;Max=max(Max,f[i]);
		bac[i]=gg[t-1];
		g[t]=p[i];
		gg[t]=i;
	}

	tim++;
	for (int i=1; i<=n; i++)
	{
		if (f[k[i]]!=Max) continue;
		lin[k[i]]=tim;
		int t=k[i];
		while (bac[t]!=0)
		{
			lin[bac[t]]=tim;
			t=bac[t];
		}
		break;
	}
}

int main()
{
	scanf("%d",&T);
	while (T--)
	{
		scanf("%d",&n);
		for (int i=1; i<=n; i++)
		{
			scanf("%d",&p[i]);
			ok[i]=true;
		}
		for (int i=1; i<=n; i++) scanf("%d",&k[i]);

		lis();
		ans[n]=Max;
		ok[k[n]]=false;
		for (int i=n; i>=2; i--)
		{
			ok[k[i]]=false;
			if (lin[k[i]]==tim) lis();
			ans[i-1]=Max;
		}
		for (int i=1; i<n; i++) printf("%d ",ans[i]);
		printf("%d\n",ans[n]);
	}

	return 0;
}
```

## [Snowy Smile](https://vjudge.net/problem/HDU-6638)

```cpp
#include<bits/stdc++.h>
#define X first.first
#define Y first.second
#define W second
using namespace std;
typedef long long ll;
const int N=2047<<1|1,NPOS=-1;
struct Ranker
{
	int siz,v[N];
	void init()
	{
		sort(v,v+siz), siz=unique(v, v+siz) - v;
	}
	void push_back(int x)
	{
		v[siz++]=x;
	}
	int ask(int x) const
	{
		return lower_bound(v,v+siz, x) - v;
	}
} rk,tbd;
struct SegmentTree
{
	struct Seg
	{
		int l, r;
		ll ans,ansl,ansr,sum;
		void upd(ll mul, ll add)
		{
			ansl=ansr=ans=max(sum = sum * mul + add * (r - l + 1), 0LL);
		}
		friend Seg up(const Seg &lc, const Seg &rc)
		{
			Seg fa;
			fa.l=lc.l;
			fa.r=rc.r;
			fa.ansl=max(lc.ansl,lc.sum+rc.ansl);
			fa.ansr=max(rc.ansr,rc.sum+lc.ansr);
			fa.ans=max(max(lc.ans,rc.ans),lc.ansr+rc.ansl);
			fa.sum=lc.sum+rc.sum;
			return fa;
		}
	} v[N<<2];
	void build(int l,int r,int rt=1)
	{
		v[rt]= {l,r,0,0,0,0};
		if(r>l)
		{
			int m=l+(r-l>>1);
			build(l,m,rt<<1);
			build(m+1,r,rt<<1|1);
		}
	}
	void upd(int l, int r, ll mul, ll add, int rt = 1)
	{
		if (l <= v[rt].l && v[rt].r <= r)
			return v[rt].upd(mul, add);
		if (r <= v[rt<<1].r)
			upd(l, r, mul, add, rt<<1);
		else if (l >= v[rt<<1|1].l)
			upd(l, r, mul, add, rt<<1|1);
		else
			upd(l, v[rt<<1].r, mul, add,rt<<1), upd(v[rt<<1|1].l, r, mul, add, rt<<1|1);
		v[rt]=up(v[rt<<1], v[rt<<1|1]);
	}
} tr;
pair<pair<int,int>,int> xy[N];
int t,n,mi[N],ma[N];
int main()
{
	for(scanf("%d",&t); t--;)
	{
		rk.siz=tbd.siz=0;
		scanf("%d",&n);
		for(int i=0; i<n; ++i)
			scanf("%d%d%d",&xy[i].X,&xy[i].Y,&xy[i].W),rk.push_back(xy[i].X),rk.push_back(xy[i].Y);
		rk.init();
		sort(xy,xy+n);
		fill(mi,mi+rk.siz,n);
		fill(ma,ma+rk.siz,-1);
		for(int i=0; i<n; ++i)
		{
			tbd.push_back(xy[i].X=rk.ask(xy[i].X));
			xy[i].Y=rk.ask(xy[i].Y);
			mi[xy[i].X]=min(mi[xy[i].X],i);
			ma[xy[i].X]=max(mi[xy[i].X],i);
		}
		tbd.init();
		ll ans=0;
		for(int i=0; i<tbd.siz; ++i)
		{
			tr.build(0,rk.siz-1);
			for(int j=i; j<tbd.siz; ++j)
			{
				for(int k=mi[tbd.v[j]]; k<=ma[tbd.v[j]]; ++k)
					tr.upd(xy[k].Y,xy[k].Y,1,xy[k].W);
				ans=max(ans,tr.v[1].ans);
			}
		}
		cout<<ans<<'\n';
	}
}
```

## [Faraway](https://vjudge.net/problem/HDU-6639)

```cpp
//待修改
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N=15;
int t,n,m,x[N],y[N],k[N],b[N];
ll ans=0;
struct Ranker : vector<ll>
{
	void init()
	{
		sort(begin(), end()), resize(unique(begin(), end()) - begin());
	}
	int ask(ll x) const
	{
		return lower_bound(begin(), end(), x) - begin();
	}
};
ll ans[60][60][2][2];
int main()
{
	for(scanf("%d",&t); t--;)
	{
		Ranker xx,yy;
		scanf("%d%d",&n,&m);
		for(int i=0; i<n; ++i)
			scanf("%d%d%d%d",&x[i],&y[i],&k[i],&b[i]),xx.push_back(x[i]),yy.push_back(y[i]);
		xx.push_back(-1);
		xx.push_back(m);
		yy.push_back(-1);
		yy.push_back(m);
		xx.init();
		yy.init();
		memset(ans,sizeof(ans),0);
		for(int xe=0; xe<60; ++xe)
			for(int ye=0; ye<60; ++ye)
			{
				ans[xe][ye][0][0]=ans[xe][ye][0][1]=ans[xe][ye][1][0]=ans[xe][ye][1][1]=1;
				for(int i=0; i<n; ++i)
				{
					if(((xe-x[i]+ye-y[i])%k[i]+k[i])%k[i]!=b[i])
					{
						ans[xe][ye][0][0]=0;
					}
					if(((xe-x[i]+y[i]-ye)%k[i]+k[i])%k[i]!=b[i])
					{
						ans[xe][ye][0][1]=0;
					}
					if(((x[i]-xe+ye-y[i])%k[i]+k[i])%k[i]!=b[i])
					{
						ans[xe][ye][1][0]=0;
					}
					if(((x[i]-xe+y[i]-ye)%k[i]+k[i])%k[i]!=b[i])
					{
						ans[xe][ye][1][1]=0;
					}
				}
			}
		ll a=0;
		for(int i=1; i<xx.size(); ++i)
			for(int j=1; j<yy.size(); ++j)
			{
				for(int yl=yy[i-1]+1,yr=yy[i],xl=xx[i-1]+1,xr=xx[i],xe=0; xe<60; ++xe)
					for(int ye=0; ye<60; ++ye)
					{

					}
			}
		cout<<a<<'\n';
	}
}
```

## [TDL](https://vjudge.net/problem/HDU-6641)

```cpp
#include<bits/stdc++.h>
#define ll long long
#define int ll
using namespace std;
ll n,m,k;
ll gcd(ll a,ll b){while(b){ll c=a%b;a=b,b=c;}return a;}
ll f(ll n,ll m){
	ll t=m;
	for(ll i=1;t;i++){
		if(__gcd(i,n)==1LL)t--;
//		cout<<i<<" "<<t<<endl;
		if(t==0)return i;
	}

}
ll ans[2000],q;
signed main(void){
	int t;
	cin>>t;
	while(t--){
		cin>>k>>m;
		q=0;
		for(int i=1;i<=1000;i++){
			n=i^k;
			if(n==0)continue;
			if(f(n,m)==i){
				ans[++q]=n;
			}
		}
		ll minn=2000000000000000000;
		if(q==0){
			cout<<-1<<endl;
		}
		else{
		for(int i=1;i<=q;i++)minn=min(minn,ans[i]);
		cout<<minn<<endl;
	}
	}
}
```

## [Stay Real](https://vjudge.net/problem/HDU-6645)

```cpp
#include<bits/stdc++.h>
#define ll long long
#define int ll
using namespace std;
ll n,m,k;
ll gcd(ll a,ll b){while(b){ll c=a%b;a=b,b=c;}return a;}
ll f(ll n,ll m){
	ll t=m;
	for(ll i=1;t;i++){
		if(__gcd(i,n)==1LL)t--;
//		cout<<i<<" "<<t<<endl;
		if(t==0)return i;
	}

}
ll ans[2000],q;
signed main(void){
	int t;
	cin>>t;
	while(t--){
		cin>>k>>m;
		q=0;
		for(int i=1;i<=1000;i++){
			n=i^k;
			if(n==0)continue;
			if(f(n,m)==i){
				ans[++q]=n;
			}
		}
		ll minn=2000000000000000000;
		if(q==0){
			cout<<-1<<endl;
		}
		else{
		for(int i=1;i<=q;i++)minn=min(minn,ans[i]);
		cout<<minn<<endl;
	}
	}
}
```
