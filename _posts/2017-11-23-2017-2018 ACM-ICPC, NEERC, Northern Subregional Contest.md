---
title: 2017-2018 ACM-ICPC, NEERC, Northern Subregional Contest
categories: [ACM,题解]
abbrlink: 64193
date: 2017-11-23 20:53:31
---
第一次练习团队配合。五小时三人共做出ABCIK五题。配合有待加强。 
# [Auxiliary Project](https://vjudge.net/problem/Gym-101612A)
最开始是用DP做的。
```cpp
#include<fstream>
using namespace std;
ifstream fin("auxiliary.in");
ofstream fout("auxiliary.out");
int work(int k)
{
	static int f[1000001]= {0},
		cost[10]= {6,2,5,5,4,5,6,3,7,6};
	if(k<0)return 0;
	if(f[k])return f[k];
	for(int i=0; i!=10; ++i)
		if(work(k-cost[i])>0||k==cost[i])
			f[k]=max(f[k],work(k-cost[i])+i);
	return f[k];
}
int main()
{
	int n;
	fin>>n;
	fout<<work(n);
}
```
其实这题可以贪心：尽量用性价比最高的7，多余的用4和1去补。 
```cpp
int work(int k)
{
	return k%3==1 ? k/3*7-3:
		   k%3==2 ? k/3*7+1:
					k/3*7;
}
```
# [Boolean Satisfability](https://vjudge.net/problem/Gym-101612B)
做的时候没注意每个标识符长度为1，导致代码长了很多。
```cpp
#include<fstream>
#include<string>
#include<set>
using namespace std;
ifstream fin("boolean.in");
ofstream fout("boolean.out");
set<string> b[3];
bool flag=1,sign=0;
int main()
{
	for(string s,ss; getline(fin,s,'|');)
	{
		while(!isalpha(s.back()))
			s.pop_back();//不加这个有的样例过不掉
		sign=s[0]=='~';
		ss=s.substr(sign);
		b[sign].insert(ss);
		if(b[!sign].find(ss)
				!=b[!sign].end())
			flag=0;
	}
	b[2].insert(b[0].begin(),b[0].end());
	b[2].insert(b[1].begin(),b[1].end());
	fout<<(1LL<<b[2].size())-flag;
}
```
可以用bitset和位运算弄个大新闻。 
```cpp
#include<fstream>
#include<bitset>
using namespace std;
ifstream fin("boolean.in");
ofstream fout("boolean.out");
bitset<'z'-'A'+1> b[3];
bool flag=1,sign=0;
int main()
{
	for(char ch; fin>>ch;)
	{
		if(isalpha(ch))
		{
			b[sign][ch-'A']=1;
			if(b[!sign][ch-'A'])
				flag=0;
			sign=0;
		}
		if(ch=='~')sign=1;
	}
	b[2]=b[0]|b[1];
	fout<<(1LL<<b[2].count())-flag;
}
```
# [Consonant Fencity](https://vjudge.net/problem/Gym-101612C)
暴力dfs。   
算`consonant fencity`的时候应当边搜索边计算，如果等搜索到达终点再从头计算会TLE。
```cpp
#include<fstream>
#include<vector>
using namespace std;
ifstream fin("consonant.in");
ofstream fout("consonant.out");
string s,con("bcdfghjklmnpqrstvxz");
vector<vector<int> > adjmap(con.size(),vector<int>(con.size(),0));
vector<bool> state(con.size(),0),ans_state(con.size(),0);
int v=0,ans_v=0;
void dfs(int k)
{
	if(k==con.size())
	{
		if(ans_v<v)
		{
			ans_v=v;
			ans_state=state;
		}
		return;
	}
	dfs(k+1);
	state[k]=1;
	int t_v=v;
	for(int i=0; i!=con.size(); i++)
		if(i!=k)
			v+=(state[i]?-1:1)*adjmap[i][k];
	dfs(k+1);
	state[k]=0;
	v=t_v;
}
int main()
{
	fin>>s;
	for(int i=1,p=con.find(s[0]),q; i!=s.size(); ++i,p=q)
	{
		q=con.find(s[i]);
		if(p!=con.npos&&q!=con.npos)
		{
			++adjmap[p][q];
			++adjmap[q][p];
		}
	}
	dfs(0);
	for(int i=0,p; i!=s.size(); ++i)
	{
		p=con.find(s[i]);
		fout<<char(p!=con.npos&&ans_state[p]?
				   toupper(s[i]):s[i]);
	}
}
```
# [Equal Numbers](https://vjudge.net/problem/Gym-101612E)
这n个数第n-1次操作后全变成他们的最小公倍数
有两种贪心策略：
1. 每次在**未处理的数**中选择出现次数最少的数变成最小公倍数。 
2. 每次在**倍数仍在这组数中的数**中选择出现次数最少的数变成其倍数。  最优方案由以上两种策略产生。由于局部最优的方案不一定整体最优，因此将两种策略并行，每次输出其中最优的方案。 
```cpp
#include<fstream>
#include<vector>
#include<algorithm>
using namespace std;
ifstream fin("equal.in");
ofstream fout("equal.out");
vector<int> a,b,d(1e6+1,0);
int n;
int main()
{
	fin>>n;
	for(int i=0,t; i<n; ++i)
	{
		fin>>t;
		++d[t];
	}
	for(int i=1; i<d.size(); ++i)
		if(d[i])
		{
			a.push_back(d[i]);
			for(int j=2*i; j<d.size(); j+=i)
				if(d[j])
				{
					b.push_back(d[i]);
					break;
				}
		}
	sort(a.begin(),a.end());
	sort(b.begin(),b.end());
	for(int i=0,p=0,q=0,sp=0,sq=0; i<=n; ++i)
	{
		while(p<a.size()&&sp+a[p]<=i)
			sp+=a[p++];
		while(q<b.size()&&sq+b[q]<=i)
			sq+=b[q++];
		fout<<a.size()-max(p-1,q)<<' ';
	}
}
```
# [Fygon 2.0](https://vjudge.net/problem/Gym-101612F)
dfs。
```cpp
#include<cstdio>
#include<map>
#include<bitset>
typedef long long ll;
typedef std::bitset<32> Bs;
Bs bs[32],t;
void add(char a,char b)
{
	a=(a=='1'?0:a-'a'+1);
	b=(b=='1'?0:b-'a'+1);
	bs[a][b]=1;
	bs[a][a]=1;
	bs[b][b]=1;
}
ll dfs(Bs x)
{
	static std::map<ll,ll> f;
	if(f.find(x.to_ulong())!=f.end())
		return f[x.to_ulong()];
	ll &ret=f[x.to_ulong()]=x.none();
	for(int i=0; i<32; ++i)
		if((x&bs[i])==(1<<i))
		{
			x[i]=0;
			ret+=dfs(x);
			x[i]=1;
		}
	return ret;
}
ll gcd(ll a,ll b)
{
	return b?gcd(b,a%b):a;
}
int main()
{
	freopen("fygon20.in","r",stdin);
	freopen("fygon20.out","w",stdout);
	int m;
	scanf("%d",&m);
	for(char a,b,c; m--;)
	{
		scanf(" for %c in range(%c, %c):",&a,&b,&c);
		add(b,a);
		add(a,c);
	}
	add('1','n');
	for(int i=0; i<32; ++i)
		for(int j=0; j<32; ++j)
			if(bs[j][i])
				bs[j]|=bs[i];
	for(int i=0; i<32; ++i)
	{
		if(bs[i].none())
			t[i]=1;
		for(int j=i+1; j<32; ++j)
			if(bs[i]==bs[j])
				t[j]=1;
	}
	ll an=dfs(t.flip()),ad=1,ag;
	for(int i=2; i<t.count()-1; ++i)ad*=i;
	ag=gcd(an,ad);
	printf("%d %lld/%lld",t.count()-2,an/ag,ad/ag);
}
```
# [Intelligence in Perpendicularia](https://vjudge.net/problem/Gym-101612I)
求多边形多边形内部可以看到，但在外部看不到的线条长度。   
只要拿总周长减去最小外接矩形周长即可。 
```cpp
#include<fstream>
using namespace std;
ifstream fin("intel.in");
ofstream fout("intel.out");
int n,ans=0,x[1024],y[1024];
int abs(int n)
{
	return n<0?-n:n;
}
int main()
{
	fin>>n;
	x[1023]=y[1023]=-1e7;
	x[1022]=y[1022]=1e7;
	for(int i=0; i!=n; ++i)
	{
		fin>>x[i]>>y[i];
		x[1023]=max(x[1023],x[i]);
		y[1023]=max(y[1023],y[i]);
		x[1022]=min(x[1022],x[i]);
		y[1022]=min(y[1022],y[i]);
	}
	for(int i=0; i!=n; ++i)
		ans+=abs(x[(i+1)%n]+y[(i+1)%n]-x[i]-y[i]);
	fout<<ans-2*(x[1023]+y[1023]-x[1022]-y[1022]);
}
```
# [Kotlin Island](https://vjudge.net/problem/Gym-101612K)
样例是骗人的。例如，第二个样例其实不做任何处理就行。   
其次，只要处理奇数行和奇数列（编号从0开始）即可。   
`f[i][j]` 表示将前i个奇数行和j个奇数列被充水后剩下的联通块数量，容易列出转移方程。转移的时候如果发现 `f[i][j]==n` 就可以输出了。 
```cpp
#include<fstream>
using namespace std;
ifstream fin("kotlin.in");
ofstream fout("kotlin.out");
int h,w,n,f[64][64]= {1,0};
int main()
{
	fin>>h>>w>>n;
	for(int i=0; 2*i<h; ++i)
		for(int j=0; 2*j<w; ++j)
		{
			if(i)f[i][j]=max(f[i][j],f[i-1][j]+j+1);
			if(j)f[i][j]=max(f[i][j],f[i][j-1]+i+1);
			if(f[i][j]==n)
			{
				for(int x=0; x<h; ++x,fout<<'\n')
					for(int y=0; y<w; ++y)
						fout<<((x%2&&x/2<i)||
							   (y%2&&y/2<j)?
							   '#':'.');
				return 0;
			}
		}
	fout<<"Impossible";
}
```