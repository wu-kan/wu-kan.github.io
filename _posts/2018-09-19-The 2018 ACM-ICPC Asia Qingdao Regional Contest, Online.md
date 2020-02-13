---
title: The 2018 ACM-ICPC Asia Qingdao Regional Contest, Online
tags:
  - ACM
  - 题解
---

## [Live Love](https://vjudge.net/problem/ZOJ-4047)

```c
#include<stdio.h>
int t,n,m;
int main()
{
	for(scanf("%d",&t); t--;)
	{
		scanf("%d%d",&n,&m);
		if(n==1||!m)printf("%d %d\n",m,m);
		else for(int i=1,tmp,res; i<=m; ++i)
				if(tmp=n/(i+1),res=n-tmp*(i+1),tmp*i+res>=m)
				{
					printf("%d %d\n",m,i);
					break;
				}
	}
}
```

## [Halting Problem](https://vjudge.net/problem/ZOJ-4049)

```c
#include<bits/stdc++.h>
using namespace std;
struct Instruction
{
	char s[9];
	int v,k,vis[256];
} a[10009];
int t,n,i,r;
int main()
{
	for(scanf("%d",&t); t--;)
	{
		scanf("%d",&n);
		for(i=1; i<=n; ++i)
		{
			fill(a[i].vis,a[i].vis+256,0);
			scanf("%s%d",&a[i].s,&a[i].v);
			if(a[i].s[1]!='d')scanf("%d",&a[i].k);
		}
		for(i=1,r=0; i<=n&&!a[i].vis[r]; ++i)
			switch(a[i].vis[r]=1,a[i].s[1])
			{
			case 'd':
				r=(r+a[i].v)%256;
				break;
			case 'e':
				if(r==a[i].v)i=a[i].k-1;
				break;
			case 'n':
				if(r!=a[i].v)i=a[i].k-1;
				break;
			case 'l':
				if(r<a[i].v)i=a[i].k-1;
				break;
			case 'g':
				if(r>a[i].v)i=a[i].k-1;
				break;
			}
		printf(i>n?"Yes\n":"No\n");
	}
}
```

## [Traveling on the Axis](https://vjudge.net/problem/ZOJ-4054)

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
char s[100009];
ll t,ans;
int main()
{
	for(scanf("%lld",&t); t--; printf("%lld\n",ans))
	{
		scanf("%s",s);
		for(ll i=ans=0,n=strlen(s); i<n; ++i)
		{
			ans+=(i+1)*(n-i);
			if(s[i]=='0')ans+=n-i;
			if(i&&s[i]==s[i-1])ans+=i*(n-i);
		}
	}
}
```

## [XOR Clique](https://vjudge.net/problem/ZOJ-4057)

```cpp
#include<bits/stdc++.h>
using namespace std;
int t,n,a,k,cnt[31];
int main()
{
	for(scanf("%d",&t); t--;)
	{
		fill(cnt,cnt+31,0);
		for(scanf("%d",&n); n--;)
		{
			scanf("%d",&a);
			for(k=0; a; ++k)a>>=1;
			++cnt[k];
		}
		printf("%d\n",*max_element(cnt,cnt+31));
	}
}
```
