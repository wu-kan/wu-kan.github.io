---
title: 2009-2010 ACM-ICPC Northeastern European Regional Contest (NEERC 09)
categories: [ACM,题解]
abbrlink: 31904
date: 2018-10-06 16:11:56
---
# [Asteroids](https://vjudge.net/problem/UVALive-4589)
模板题，求两空间多面体重心最近的距离，将重心到所在凸包表面的最短距离相加即可。
蓝书上的原题，详见[这里](http://wu-kan.github.io/posts/35776/)。
# [Business Center](https://vjudge.net/problem/UVALive-4590)
```cpp
#include <cstdio>
#include <cstdlib>
#include <algorithm>

using namespace std;

int n,m;

int main()
{
	while (~scanf("%d%d",&n,&m))
	{
	int ans=1000000001;
	for (int i=1;i<=m;++i)
	{
		int x,y;
		scanf("%d%d",&x,&y);
		int ret=(x*n)%(x+y);
		if (ret==0) ret=x+y;
		ans=min(ans,ret);
	}
	printf("%d\n",ans);
	}
}
```
# [Database](https://vjudge.net/problem/UVALive-4592)
```cpp
#include<bits/stdc++.h>
using namespace std;
int main()
{
	for(int n,m,f; cin>>n>>m;)
	{
		unordered_map<string,set<int> > mp[15];
		string s;
		getline(cin,s);
		for(int i=f=1; i<=n; ++i)
		{
			unordered_map<int,int> mmp;
			for(int j=1; j<=m; ++j)
			{
				getline(cin,s,j<m?',':'\n');
				if(!f)continue;
				for(auto it:mp[j][s])
				{
					if(mmp.count(it))
					{
						cout<<"NO\n"<<it<<' '<<i<<'\n'<<mmp[it]<<' '<<j<<'\n';
						f=0;
						break;
					}
					mmp[it]=j;
				}
				mp[j][s].insert(i);
			}
		}
		if(f)cout<<"YES\n";
	}
}
```
# [Funny Language](https://vjudge.net/problem/UVALive-4594)
```cpp
#include<bits/stdc++.h>
using namespace std;
void cal(const string &s,int c[])
{
	fill(c,c+26,0);
	for(int i=0; i<s.size(); ++i)++c[s[i]-'A'];
}
string s[1023];
int c[1023][31];
int main()
{
	for(int n,m; cin>>m>>n;)
	{
		for(int i=0; i<n; ++i)
			cin>>s[i];
		sort(s,s+n);
		for(int i=0; i<n; ++i)cal(s[i],c[i]);
		priority_queue<pair<int,string> > q;
		q.push(make_pair(0,""));
		while(m)
		{
			pair<int,string> pis=q.top();
			q.pop();
			auto rg=equal_range(s,s+n,pis.second);
			if(rg.first==rg.second&&!pis.second.empty())cout<<pis.second<<'\n',--m;
			cal(pis.second,c[n]);
			for(pis.second+='A'; pis.second.back()<='Z'; ++pis.second.back())
			{
				++c[n][pis.second.back()-'A'];
				for(int i=pis.first=0; i<n; ++i)
				{
					++pis.first;
					for(int j=0; j<26; ++j)
						if(c[n][j]>c[i][j])
						{
							--pis.first;
							break;
						}
				}
				q.push(pis);
				--c[n][pis.second.back()-'A'];
			}
		}
	}
}
```
# [Headshot](https://vjudge.net/problem/UVALive-4596)
```cpp
#include<bits/stdc++.h>
using namespace std;
int main()
{
	for(string s; cin>>s;)
	{
		int a=s.size(),b=0,c=0,d=0;
		for(int i=0; i<a; ++i)
			if(s[i]=='0')
				++b,++c,d+=s[(i+1)%a]=='0';
		printf(a*d>b*c?"SHOOT\n":a*d<b*c?"ROTATE\n":"EQUAL\n");
	}
}
```