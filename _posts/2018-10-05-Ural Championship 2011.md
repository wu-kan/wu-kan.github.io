---
title: Ural Championship 2011
tags:
  - ACM
  - 题解
---

## [Help in the RNOS](https://vjudge.net/problem/URAL-1830)

```cpp
#include<bits/stdc++.h>
using namespace std;
typedef long long ll;
ll cal(char s[],int n)
{
	char t[63];
	fill(t,t+n,'0');
	t[n-1]='1';
	ll ans=0;
	for(int i=n-1; ~i; --i)
		if(s[i]!=t[i])
		{
			if(!i)++ans;
			else t[i-1]='1',ans+=1ll<<i;
		}
	return ans;
}
char a[63],b[63];
ll n;
int main()
{
	scanf("%lld%s%s",&n,a,b);
	while(n&&a[n-1]==b[n-1])--n;
	cout<<(n<2?n:cal(a,n-1)+cal(b,n-1)+1);
}
```

## [Arirang Show](https://vjudge.net/problem/URAL-1832)

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=300009;
char s[N]= {0,'a',0};
int n,p[N],ps=0,use[127];
int main()
{
	scanf("%d",&n);
	for(int i=1; i*2<=n; ++i)if(n%i==0)p[ps++]=i;
	for(int i=2; i<=n; ++i)
	{
		fill(use+'a',use+'z'+1,0);
		for(int j=0,k; j<ps; ++j)
		{
			if(k=i+p[j],k>n)k-=n;
			use[s[k]]=1;
			if(k=i-p[j],k<1)k+=n;
			use[s[k]]=1;
		}
		for(s[i]='a'; s[i]<='z'; ++s[i])
			if(!use[s[i]])break;
		if(s[i]>'z')return printf("Impossible"),0;
	}
	printf("%s",s+1);
}
```

## [Babel Fish](https://vjudge.net/problem/URAL-1836)

```cpp
//待修改
#include<bits/stdc++.h>
using namespace std;
const double EPS=1e-9;
struct Coord3
{
	double X,Y,Z;
	Coord3(double X=0,double Y=0,double Z=0):X(X),Y(Y),Z(Z) {}
};

int sgn(double d)
{
	return (d>EPS)-(d<-EPS);
}
bool operator!=(const Coord3 &a,const Coord3 &b)//不等运算符，涉及到浮点数比较要重写
{
	return sgn(a.X-b.X)||sgn(a.Y-b.Y)||sgn(a.Z-b.Z);
}
bool operator==(const Coord3 &a,const Coord3 &b)
{
	return !(a!=b);
}

Coord3& operator+=(Coord3 &a,const Coord3 &b)
{
	return a.X+=b.X,a.Y+=b.Y,a.Z+=b.Z,a;
}
Coord3 operator+(Coord3 a,const Coord3 &b)
{
	return a+=b;
}

Coord3& operator-=(Coord3 &a,const Coord3 &b)
{
	return a.X-=b.X,a.Y-=b.Y,a.Z-=b.Z,a;
}
Coord3 operator-(Coord3 a,const Coord3 &b)
{
	return a-=b;
}

int t,l,a,b,c,d;
int main()
{
	for(scanf("%d",&t); t--;)
	{
		scanf("%d%d%d%d%d",&l,&a,&b,&c,&d);
		switch(sgn(a)+sgn(b)+sgn(c)+sgn(d))
		{
		case 4:
		{
			Coord3 A(0,0,a),B(0,1,b),C(1,1,c),D(1,0,d);
			if(B-A+D-A==C-A)printf("%.7f\n",l*l*(a+c)/2.0);
			else printf("error\n");
		}
		break;
		case 3:
		{
			int s[4]= {a,b,c,d},p=min_element(s,s+4)-s;
			a=s[(p+1)%4],b=s[(p+2)%4],c=s[(p+3)%4],d=b-a-c;
			if(b<a+c)
			{
				printf("error\n");
				break;
			}
			printf("%.7f\n",l*l*((a+c)/2.0-d*d*d/6.0/(a+d)/(c+d)));
			break;
		}
		case 2:
			printf((a&&c)||(b&&d)?"error\n":"ambiguous\n");
			break;
		case 1:
			printf("ambiguous\n");
			break;
		case 0:
			printf("0\n");
		};
	}
}
```

## [Isenbaev’s Number](https://vjudge.net/problem/URAL-1837)

```cpp
#include<bits/stdc++.h>
using namespace std;
const int N=511,INF=1e9;
struct Id:map<string,int>
{
	int operator()(const string &s)
	{
		if(!count(s))insert(make_pair(s,size()));
		return at(s);
	}
} id;
string s[3];
int n,f[N][N];
int main()
{
	for(int i=0; i<N; ++i)fill(f[i],f[i]+N,INF),f[i][i]=0;
	cin>>n;
	for(int i=0; i<n; ++i)
	{
		cin>>s[0]>>s[1]>>s[2];
		int p[3]= {id(s[0]),id(s[1]),id(s[2])};
		for(int j=0; j<3; ++j)
			for(int k=0; k<j; ++k)
				f[p[j]][p[k]]=f[p[k]][p[j]]=min(f[p[j]][p[k]],1);
	}
	for(int k=0; k<N; ++k)
		for(int i=0; i<N; ++i)
			for(int j=0; j<N; ++j)
				f[i][j]=min(f[i][j],f[i][k]+f[k][j]);
	int flag=!id.count("Isenbaev"),p=id("Isenbaev");
	for(Id::iterator it=id.begin(); it!=id.end(); ++it)
		if(!(flag&&it->second==p))
		{
			cout<<it->first<<' ';
			if(f[p][it->second]==INF)cout<<"undefined\n";
			else cout<<f[p][it->second]<<'\n';
		}
}
```

## [Samurai’s Stroke](https://vjudge.net/problem/URAL-1838)

```cpp
#include<bits/stdc++.h>
using namespace std;
int l,n,a[100009];
int main()
{
	scanf("%d%d",&l,&n),a[n+1]=l;
	for(int i=1; i<=n; ++i)scanf("%d",&a[i]);
	if (n<=3) return printf("%d",l),0;
	int ans=a[2]+l-a[n-1];
//	printf("%d\n",ans);
	for (int i=3;i<=n-1;i++)
	{
		int x=a[i-1],y=a[i];
		int q=max(2*a[1],2*y-l),p=min(2*x,2*a[n]-l);
		if (q<x) q=x;
		if (p>y) p=y;
		if ((q>y)||(p<x)) {ans+=y-x; continue;}
		if (p>q) ans+=(y-x-(p-q));
		 else ans+=y-x;
//		printf("%d %d\n",i,ans);
	}
	printf("%d",ans);
}
```
