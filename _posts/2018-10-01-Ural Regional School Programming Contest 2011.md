---
title: Ural Regional School Programming Contest 2011
categories: [ACM,题解]
abbrlink: 54384
date: 2018-10-01 18:47:57
---
# [GOV Chronicles](https://vjudge.net/problem/URAL-1873)
体验极差的四级阅读理解，大致是在文章里找每个人参加了多少比赛…用一下Ctrl+F。  
漏了最后面还有两个人各参加了一场比赛还wa了一发。  
有几个人的信息比较含糊所幸样例里还给了答案。 
```c
#include<stdio.h>
int n,a[14]= {5,21,12,2,1,4,6,1,4,4,1,0,1,1};
int main()
{
	scanf("%d",&n);
	printf("%d",a[n]);
}
```
# [Football Goal](https://vjudge.net/problem/URAL-1874)
固定两条棒所成夹角后，显然当树和地面在门内长度相等时面积最大，此时面积可以表示成角度的一个函数，可计算出在135度角时取最大值。
```c
#include<stdio.h>
#include<math.h>
double a,b;
int main()
{
	scanf("%lf%lf",&a,&b);
	printf("%.9f",(a*a+b*b)/4+a*b/sqrt(2));
}
```
# [Angry Birds](https://vjudge.net/problem/URAL-1875)
```cpp
//待补题
```
# [Centipede’s Morning](https://vjudge.net/problem/URAL-1876)
蜈蚣穿鞋子，要求最坏情况下要用多少时间，考虑两种情况：  
一开始全抽到右脚鞋，这样是2b+40；  
先抽到39只右脚鞋，然后再给左脚穿上所有的鞋，然后再把所有的剩下的左鞋去试右脚，然后再穿上右鞋，这样是2*a+39。
```c
#include<stdio.h>
int a,b;
int main()
{
	scanf("%d%d",&a,&b);
	a=a*2+39,b=b*2+40;
	printf("%d",a>b?a:b);
}
```
# [Bicycle Codes](https://vjudge.net/problem/URAL-1877)
```c
#include<stdio.h>
int a,b;
int main()
{
	scanf("%d%d",&a,&b);
	printf(a%2==0||b%2==1?"yes":"no");
}
```
# [Rubinchik’s Cube](https://vjudge.net/problem/URAL-1878)
看似复杂，实际上只要考虑把红色移到目标位置即可。
```c
#include<bits/stdc++.h>
using namespace std;
int s[4],ans=1e9;
int main()
{
	for(int i=0,c; i<4; ++i)
		for(int j=0; j<4; ++j)
		{
			scanf("%d",&c);
			if(c==1)
				++s[i<2&&j<2?0:
				    i<2&&j>=2?1:
				    i>=2&&j>=2?2:3];
		}
	for(int i=0; i<4; ++i)
		ans=min(ans,s[(i+1)%4]+s[(i+2)%4]*2+s[(i+3)%4]);
	printf("%d",ans);
}
```
# [GOV-internship 2](https://vjudge.net/problem/URAL-1879)
贪心，把0分别换成另一个串中非0且最多的字母或一种指定字母，依次求一遍取最小值。
```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=100009;
typedef long long ll;
ll n[2],v[2][N];
int main()
{
	for(int j=0,t; j<2; ++j)
	{
		scanf("%lld",&n[j]);
		for(int i=0; i<n[j]; ++i)
			scanf("%d",&t),++v[j][t];
	}
	ll tmp=n[0]*n[1];
	for(int i=1; i<N; ++i)
		tmp-=v[0][i]*v[1][i];
	ll ans=tmp-v[0][0]**max_element(v[1]+1,v[1]+N)-v[1][0]**max_element(v[0]+1,v[0]+N);
	for(int i=1; i<N; ++i)
		ans=min(ans,tmp-v[0][0]*v[1][i]-v[1][0]*v[0][i]-v[0][0]*v[1][0]);
	printf("%lld",ans);
}
```
# [Psych Up’s Eigenvalues](https://vjudge.net/problem/URAL-1880)
```cpp
#include<bits/stdc++.h>
using namespace std;
int a[16383],siz=0,ans=0;
int main()
{
	for(int i=0,n; i<3; ++i)
		for(scanf("%d",&n); n--;)
			scanf("%d",&a[siz++]);
	sort(a,a+siz);
	for(int i=2; i<siz; ++i)
		if(a[i-2]==a[i]&&a[i-1]==a[i])
			++ans;
	printf("%d",ans);
}
```
# [Long problem statement](https://vjudge.net/problem/URAL-1881)
```cpp
#include<bits/stdc++.h>
using namespace std;
string s;
int h,w,n,r=1,c=0;
int main()
{
	for(cin>>h>>w>>n; n--;)
	{
		cin>>s;
		if(c+s.size()+1<w)c+=s.size()+1;
		else if(c+s.size()<=w&&w<=c+s.size()+1)c=0,++r;
		else c=s.size()+1,++r;
	}
	if(!c)--r;
	printf("%d",r/h+(r%h?1:0));
}
```
# [Old Nokia](https://vjudge.net/problem/URAL-1882)
```
//待补
```
# [Ent’s Birthday](https://vjudge.net/problem/URAL-1883)
在平面上划出一块凸多边形区域使得里面恰好有给定点集的k个。  
按横纵坐标的字典序排序后选择前k个，用一个五角梯形（不知道怎么形容，看代码，矩形挖掉一个角之后的情况）包住即可。特殊情况是第k个点在上边界，此时退化成四角梯形。
```cpp
#include<bits/stdc++.h>
#define X first
#define Y second
using namespace std;
const int INF=1e9;
typedef pair<int,int> Coord;
int main()
{
	int n,k;
	scanf("%d%d",&n,&k);
	vector<Coord> p(n),ans;
	for(int i=0,x,y; i<n; ++i)
		scanf("%d%d",&p[i].X,&p[i].Y);
	sort(p.begin(),p.end());
	ans.push_back(p[k-1]);
	if(p[k-1].X-1!=-INF)ans.push_back(Coord(p[k-1].X-1,INF));
	ans.push_back(Coord(-INF,INF));
	ans.push_back(Coord(-INF,-INF));
	ans.push_back(Coord(p[k-1].X,-INF));
	printf("%d\n",ans.size());
	for(int i=0; i<ans.size(); ++i)
		printf("%d %d\n",ans[i].X,ans[i].Y);
}
```
# [Way to the University](https://vjudge.net/problem/URAL-1884)
让人比较头疼的模拟，我的做法是把其中一条车道的车等效到另一个车道上。尽量用整数运算避开浮点运算。
```cpp
#include<bits/stdc++.h>
using namespace std;
int n,d,v[16383];
int main()
{
	for(scanf("%d",&n); n--;)
		scanf("%d",&d),fill(v+d+8,v+d+5+8,1);//8==20/5*2
	for(scanf("%d",&n); n--;)
		scanf("%d",&d),fill(v+d,v+d+5,1);
	for(int i=0;; ++i)
		if(*max_element(v+i+8,v+i+8+8)==0)
			return printf("%.6f",i*0.18),0;//0.18==3600/20000
}
```