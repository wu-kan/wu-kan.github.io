---
title: The 16th Zhejiang Provincial Collegiate Programming Contest Sponsored by TuSimple
categories:
  - ACM
  - 题解
---
# [Element Swapping](http://acm.zju.edu.cn/onlinejudge/showContestProblem.do?problemId=5990)
```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const ll N = 1e5 + 9;
ll t, n, x, y, ans, b[N];
int main()
{
	for (scanf("%lld", &t); t--;)
	{
		scanf("%lld%lld%lld", &n, &x, &y);
		ll x1 = ans = 0, y1 = 0;
		unordered_map<ll, ll> mp;
		for (ll i = 1; i <= n; ++i)
		{
			scanf("%lld", &b[i]);
			x1 += i * b[i], y1 += i * b[i] * b[i];
			++mp[b[i]];
		}
		//cerr << x1 << ' ' << y1 << "!\n";
		if (x == x1)
		{
			if (y == y1)
			{
				for (auto it : mp)
					ans += it.second * (it.second - 1);
				printf("%lld\n", ans / 2);
				continue;
			}
			else
			{
				printf("0\n");
				continue;
			}
			continue;
		}
		if ((y - y1) % (x - x1))
		{
			printf("0\n");
			continue;
		}
		for (ll i = 1; i <= n; ++i)
		{
			ll bj = (y - y1) / (x - x1) - b[i];
			if (b[i] != bj)
				if ((x - x1) % (b[i] - bj) == 0)
				{
					ll j = i + (x - x1) / (b[i] - bj);
					//cerr << i << ' ' << b[i] << ' ' << j << ' ' << bj << ' ' << b[j] << "?\n";
					if (1 <= j && j <= n && bj == b[j])
						++ans;
				}
		}
		printf("%lld\n", ans / 2);
	}
}
```
# [Array in the Pocket](http://acm.zju.edu.cn/onlinejudge/showContestProblem.do?problemId=5991)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;
int t, n, a[N], c[N], r[N], ans[N];
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		fill(c + 1, c + n + 1, 0);
		fill(ans + 1, ans + n + 1, 0);
		for (int i = 1; i <= n; ++i)
			scanf("%d", &a[i]), ++c[a[i]];
		set<pair<int, int>> re;
		set<int> se;
		for (int i = 1; i <= n; ++i)
			if (c[i])
				se.emplace(i), re.emplace(r[i] = 2 * c[i], i);
		int imp = 0;
		for (int i = 1; !imp && i <= n; ++i)
		{
			int p = re.rbegin()->second;
			if (r[p] > n - i + 1)
			{
				imp = 1;
				printf("Impossible\n");
				break;
			}
			else if (r[p] < n - i + 1 || a[i] == p)
			{
				auto it = se.begin();
				if (*it == a[i])
					++it;
				p = *it;
			}
			re.erase({r[a[i]], a[i]});
			re.erase({r[p], p});
			--r[a[i]];
			--r[p];
			if (r[a[i]])
				re.emplace(r[a[i]], a[i]);
			if (r[p])
				re.emplace(r[p], p);
			if (--c[ans[i] = p] == 0)
				se.erase(p);
		}
		if (!imp)
			for (int i = 1; i <= n; ++i)
				printf("%d%c", ans[i], i < n ? ' ' : '\n');
	}
}
```
# [Sequence in the Pocket](http://acm.zju.edu.cn/onlinejudge/showContestProblem.do?problemId=5993)
```cpp
#include <bits/stdc++.h>

using namespace std;
const int N=1e5+10;

int t, n, b[N];

struct Node{
	int x;
	int id;
	bool operator < (const Node& rhs) const {
		if (x!=rhs.x) return x>rhs.x;
		else return id>rhs.id;
	}
}a[N];

int main() {
	scanf("%d", &t);
	for(int i=1; i<=t; i++) {
		scanf("%d", &n);
		for(int i=1; i<=n; i++) {
			scanf("%d", &a[i].x);
			a[i].id=i;
			b[i]=a[i].x;//original
		}
		sort(a+1, a+n+1);
		int p=n+1;
		int ans=0;
		for(int i=1; i<=n; i++) {
			p--;
			//cout<<a[i].x<<' '<<a[i].id<<endl;
			while(a[i].x!=b[p]&&p) p--;
			if (!p) {
				ans=n-i+1;
				break;
			}
		}
		cout<<ans<<endl;
	}
	return 0;
}
```
# [Abbreviation](http://acm.zju.edu.cn/onlinejudge/showContestProblem.do?problemId=5994)
```cpp
#include <bits/stdc++.h>
using namespace std;
char vowel[6] = {'a', 'e', 'i', 'y', 'o', 'u'}, s[127];
int t;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%s", s);
		for (int i = 0; s[i]; ++i)
			if (!i || find(vowel, vowel + 6, s[i]) == vowel + 6)
				putchar(s[i]);
		putchar('\n');
	}
}
```
# [Lucky 7 in the Pocket](http://acm.zju.edu.cn/onlinejudge/showContestProblem.do?problemId=5995)
```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int t, n;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		while (n % 7 || n % 4 == 0)
			++n;
		printf("%d\n", n);
	}
}
```
# [Singing Everywhere](http://acm.zju.edu.cn/onlinejudge/showContestProblem.do?problemId=5996)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int t, n, ans, a[N];
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		for (int i = 0; i < n; ++i)
			scanf("%d", &a[i]);
		if (n < 4)
		{
			printf("0\n");
			continue;
		}
		for (int i = ans = 0; i < n; ++i)
		{
			int cnt = 0;
			for (int j = i - 1; j <= i + 1; ++j)
			{
				if (j <= 0 || j >= n - 1)
					continue;
				if (j == 1)
				{
					if ((i == 0 || i == 1) && a[j - 1] < a[j] && a[j + 1] < a[j])
						--cnt;
					if (i == 2)
					{
						if (a[j - 1] < a[j] && a[j + 1] < a[j])
							--cnt;
						if (a[j - 1] < a[j] && a[j + 2] < a[j])
							++cnt;
					}
					continue;
				}
				if (j == n - 2)
				{
					if ((i == n - 1 || i == n - 2) && a[j - 1] < a[j] && a[j + 1] < a[j])
						--cnt;
					if (i == n - 3)
					{
						if (a[j - 1] < a[j] && a[j + 1] < a[j])
							--cnt;
						if (a[j - 2] < a[j] && a[j + 1] < a[j])
							++cnt;
					}
					continue;
				}
				if (j == i)
				{
					if (a[j - 1] < a[j] && a[j + 1] < a[j])
						--cnt;
					continue;
				}
				if (j == i - 1)
				{
					if (a[j - 1] < a[j] && a[j + 1] < a[j])
						--cnt;
					if (a[j - 1] < a[j] && a[j + 2] < a[j])
						++cnt;
					continue;
				}
				if (j == i + 1)
				{
					if (a[j - 1] < a[j] && a[j + 1] < a[j])
						--cnt;
					if (a[j - 2] < a[j] && a[j + 1] < a[j])
						++cnt;
					continue;
				}
			}
			ans = min(ans, cnt);
		}
		for (int i = 1; i + 1 < n; ++i)
			if (a[i - 1] < a[i] && a[i + 1] < a[i])
				++ans;
		printf("%d\n", ans);
	}
}
```
# [Fibonacci in the Pocket](http://acm.zju.edu.cn/onlinejudge/showContestProblem.do?problemId=5997)
```cpp
#include <bits/stdc++.h>

using namespace std;
const int N=1e4+10;

int t;
char a[N], b[N];

int solve(char* s) {
	int len=strlen(s);
	int ret=0;
	for(int i=0; i<len; i++) {
		ret=ret*10+s[i]-'0';
		ret%=3;
	}
	return ret;
}

int main() {
	scanf("%d", &t);
	for(int i=1; i<=t; i++) {
		scanf("%s %s", &a, &b);
		int ans1=solve(a);
		int ans2=solve(b);
		ans1--;
		ans1=(ans1+3)%3;
		if (ans1==2||ans1==0) ans1=0;else ans1=1;
		if (ans2==2||ans2==0) ans2=0;else ans2=1;
		if (ans1==ans2) printf("0\n");else printf("1\n");
	}
	return 0;
}
```
# [Welcome Party](http://acm.zju.edu.cn/onlinejudge/showContestProblem.do?problemId=6000)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;

int v[N*2],nex[N*2],g[N],fa[N],an[N];
bool p[N];

int tot;
void add(int x,int y){v[++tot] = y;nex[tot] = g[x];g[x] = tot;}
int gf(int x) {return (x == fa[x])? x : fa[x] = gf(fa[x]);}

int main()
{
	int T;cin >> T;
	while (T--)
	{
		priority_queue<int,vector<int>,greater<int>> q;
		int n,m;scanf("%d%d",&n,&m);
		tot = 0;
		for(int i=1; i<=n; i++) fa[i] = i,p[i] = 0,g[i] = 0;
		for(int i=1; i<=m; i++)
		{
			int x,y;scanf("%d%d",&x,&y);
			add(x,y);add(y,x);
			int fx = gf(x),fy = gf(y);
			if (fx != fy)
			{
				if (fx<fy) fa[fy] = fx;
				else fa[fx] = fy;
			}
		}
		int l = 1,r = 0;
		int ans = 0;
		for(int i=1; i<=n; i++) if (i == fa[i]) q.push(i),p[i] = 1,ans++,r++;
		while (l<=r)
		{
			int x = q.top();q.pop();
			an[l++] = x;
			for(int i=g[x]; i; i = nex[i])
			{
				if (p[v[i]]) continue;
				p[v[i]] = 1;q.push(v[i]);
				r++;
			}
		}
		printf("%d\n",ans);
		for(int i=1; i<n; i++) printf("%d ",an[i]);
		printf("%d\n",an[n]);
	}
}
```
# [Strings in the Pocket](http://acm.zju.edu.cn/onlinejudge/showContestProblem.do?problemId=5998)
```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;

int v[N*2],nex[N*2],g[N],fa[N],an[N];
bool p[N];

int tot;
void add(int x,int y){v[++tot] = y;nex[tot] = g[x];g[x] = tot;}
int gf(int x) {return (x == fa[x])? x : fa[x] = gf(fa[x]);}

int main()
{
	int T;cin >> T;
	while (T--)
	{
		priority_queue<int,vector<int>,greater<int>> q;
		int n,m;scanf("%d%d",&n,&m);
		tot = 0;
		for(int i=1; i<=n; i++) fa[i] = i,p[i] = 0,g[i] = 0;
		for(int i=1; i<=m; i++)
		{
			int x,y;scanf("%d%d",&x,&y);
			add(x,y);add(y,x);
			int fx = gf(x),fy = gf(y);
			if (fx != fy)
			{
				if (fx<fy) fa[fy] = fx;
				else fa[fx] = fy;
			}
		}
		int l = 1,r = 0;
		int ans = 0;
		for(int i=1; i<=n; i++) if (i == fa[i]) q.push(i),p[i] = 1,ans++,r++;
		while (l<=r)
		{
			int x = q.top();q.pop();
			an[l++] = x;
			for(int i=g[x]; i; i = nex[i])
			{
				if (p[v[i]]) continue;
				p[v[i]] = 1;q.push(v[i]);
				r++;
			}
		}
		printf("%d\n",ans);
		for(int i=1; i<n; i++) printf("%d ",an[i]);
		printf("%d\n",an[n]);
	}
}
```
