---
title: 2017-2018 ACM-ICPC Southeastern European Regional Programming Contest(SEERC 2017)
tags:
  - ACM
  - 题解
---

## [Concerts](https://vjudge.net/problem/Gym-101669A)

题目的辣鸡数据范围有问题。滚动 DP。

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e7+9,M=1e9+7;
char a[N],b[N];
int n,k,f[2][N],h[127];
int main()
{
	scanf("%d%d",&k,&n);
	for(char c='A'; c<='Z'; ++c)scanf("%d",&h[c]);
	scanf("%s%s",a+1,b+1);
	fill(f[0],f[0]+n+1,1);
	int nxt=0;
	for(int i=1; i<=k; ++i)
	{
		f[nxt^=1][0]=0;
		for(int j=1; j<=n; ++j)
		{
			f[nxt][j]=f[nxt][j-1];
			if(b[j]==a[i]&&j-1-h[a[i-1]]>=0)
				f[nxt][j]+=f[nxt^1][j-1-h[a[i-1]]];
			if(f[nxt][j]>=M)f[nxt][j]-=M;
		}
	}
	printf("%d",f[nxt][n]);
}
```

## [Robots](https://vjudge.net/problem/Gym-101669G)

```cpp
#include <cstdio>
#include <cstdlib>
#include <algorithm>

using namespace std;

struct S
{
	int a,t;
}s[10010];

bool cmp(const S &x,const S &y)
{
	return x.a>y.a;
}

int n;

int main()
{
	scanf("%d",&n);
	for (int i=1;i<=n;++i) scanf("%d%d",&s[i].a,&s[i].t);

	int v=0;
	double ans=0;
	for (int i=1;i<=n;++i)
	{
		ans-=v*s[i].t+0.5*s[i].a*s[i].t*s[i].t;
		v+=s[i].a*s[i].t;
	}


	sort(s+1,s+n+1,cmp);
	v=0;
	for (int i=1;i<=n;++i)
	{
		ans+=v*s[i].t+0.5*s[i].a*s[i].t*s[i].t;
		v+=s[i].a*s[i].t;
	}

	printf("%.1lf\n",ans);

}
```

## [Escape Room](https://vjudge.net/problem/Gym-101669K)

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=1e5+9;
pair<int,int> a[N];
int n,b[N];
int main()
{
	scanf("%d",&n);
	for(int i=0; i<n; ++i)scanf("%d",&a[i].first),a[i].second=i;
	sort(a,a+n);
	for(int i=n; i; --i)
		b[a[n-i].second]=i;
	for(int i=0; i<n; ++i)printf("%d ",b[i]);
}
```
