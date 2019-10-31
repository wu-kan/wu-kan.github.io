---
title: 2016-2017 ACM-ICPC, Central Europe Regional Contest (CERC 16)
categories:
- ACM
- 题解
---
## [Appearance Analysis](https://vjudge.net/problem/Gym-101173A)

```cpp
#include <bits/stdc++.h>
using namespace std;
int r, c;
char s[200][200];
set<string> st;
int main(void)
{
	scanf("%d%d", &r, &c);
	for (int i = 1; i <= r; i++)
		scanf("%s", s[i] + 1);
	int r2, c2;
	int ans = 0;
	for (int i = 2; s[2][i] != '#'; i++)
		c2 = i - 1;
	for (int i = 2; s[i][2] != '#'; i++)
		r2 = i - 1;
	//cout<<c2<<" "<<r2<<endl;
	for (int i = 2; i <= r; i += r2 + 1)
	{
		for (int j = 2; j <= c; j += c2 + 1)
		{
			ans++;
			string a = "", b = "", c = "", d = "";
			for (int ii = 1; ii <= r2; ii++)
			{
				for (int jj = 1; jj <= c2; jj++)
				{
					a.push_back(s[i + ii - 1][j + jj - 1]);
				}
			}
			for (int ii = 1; ii <= c2; ii++)
			{
				for (int jj = 1; jj <= r2; jj++)
				{
					b.push_back(s[i + r2 - jj][j + ii - 1]);
				}
			}
			for (int ii = 1; ii <= r2; ii++)
			{
				for (int jj = 1; jj <= c2; jj++)
				{
					c.push_back(s[i + r2 - ii][j + c2 - jj]);
				}
			}
			for (int ii = 1; ii <= c2; ii++)
			{
				for (int jj = 1; jj <= r2; jj++)
				{
					d.push_back(s[i + jj - 1][j + c2 - ii]);
				}
			}
			if (st.count(a) || st.count(b) || st.count(c) || st.count(d))
			{
				ans--;
			}
			else
				st.insert(a), st.insert(b), st.insert(c), st.insert(d);
			//cout<<a<<endl<<b<<endl<<c<<endl<<d<<endl;
		}
	}
	printf("%d\n", ans);
}
```

## [Convex Contour](https://vjudge.net/problem/Gym-101173C)

计算几何鲨我！

```cpp
#include <bits/stdc++.h>
#define ld long double
using namespace std;
int n;
char s[100];
int main(void)
{
	const ld sq3 = sqrt(3);
	const ld pi = 3.1415926535898;
	scanf("%d%s", &n, s + 1);
	int loc1 = 0, loc2 = 0;
	//	if(n==1&&s[1]=='T'){printf("3.000000000\n");return 0;}
	for (int i = 1; i <= n; i++)
	{
		if (s[i] != 'T')
		{
			loc1 = i;
			break;
		}
	}
	for (int i = n; i >= 1; i--)
	{
		if (s[i] != 'T')
		{
			loc2 = i;
			break;
		}
	}

	//	cout<<loc1<<" "<<loc2<<endl;
	if (loc1 != 0 && loc2 != 0)
	{
		ld ans = 0;
		ans += (loc2 - loc1);
		if (s[loc1] == 'S')
		{
			ans += 0.5;
			if (loc1 == 1)
			{
				ans += 1;
			}
			else
			{
				ans += sqrt((loc1 - 1.5) * (loc1 - 1.5) + (1 - sq3 / 2) * (1 - sq3 / 2));
				ans += 1;
			}
		}
		else if (s[loc1] == 'C')
		{
			if (loc1 != 1)
			{
				ld dis = (loc1 - 1) * (loc1 - 1) + (sq3 / 2 - 0.5) * (sq3 / 2 - 0.5);
				ans += sqrt(dis - 0.25);
				ans += (pi / 2 - asin((sq3 / 2 - 0.5) / sqrt(dis)) - acos(0.5 / sqrt(dis))) / 2;
				ans += 1;
			}
			else
			{
				ans += pi / 2;
			}
		}

		if (s[loc2] == 'S')
		{
			ans += 0.5;
			if (loc2 == n)
				ans += 1;
			else
			{
				ans += sqrt((n - loc2 - 0.5) * (n - loc2 - 0.5) + (1 - sq3 / 2) * (1 - sq3 / 2));
				ans += 1;
			}
		}
		else if (s[loc2] == 'C')
		{
			if (loc2 != n)
			{

				ld dis = (n - loc2) * (n - loc2) + (sq3 / 2 - 0.5) * (sq3 / 2 - 0.5);
				//				cout<<dis<<" "<<ans<<endl;
				ans += sqrt(dis - 0.25);
				//				cout<<ans<<endl;
				ans += (pi / 2 - acos((n - loc2) / sqrt(dis)) - acos(0.5 / sqrt(dis))) / 2;
				//				cout<<pi/2<<" "<<acos((n-loc2)/sqrt(dis))<<" "<<acos(0.5/sqrt(dis))<<" "<<ans<<endl;
				ans += 1;
			}
			else
			{
				ans += pi / 2;
			}
		}
		ans += n;
		if (s[1] == 'C')
			ans -= 0.5;
		if (s[n] == 'C')
			ans -= 0.5;

		printf("%.10Lf\n", ans);
	}
	else
	{
		printf("%.10Lf\n", (ld)2 * n + 1);
	}
}
```

## [Free Figurines](https://vjudge.net/problem/Gym-101173F)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, ans, p[N], q[N];
void open(int u)
{
	if (!u)
		return;
	++ans;
	while (p[u])
	{
		++ans;
		int pre = u;
		u = p[u];
		p[pre] = 0;
	}
}
int main()
{
	scanf("%d", &n);
	for (int i = 1; i <= n; ++i)
		scanf("%d", &p[i]);
	for (int i = 1; i <= n; ++i)
	{
		scanf("%d", &q[i]);
		if (p[i] != q[i])
			open(p[i]), open(q[i]);
	}
	printf("%d", ans);
}
```

## [Key Knocking](https://vjudge.net/problem/Gym-101173K)

三个三个的考虑，但每组实际上考虑的4个元素。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 3e5 + 9;
char s[N];
int main()
{
	scanf("%s", s);
	int len = strlen(s);
	s[len] = '0';
	vector<int> ans;
	for (int i = len - 3; i >= 0; i -= 3)
	{
		string t(s + i, s + i + 4);
		if (t[t.size() - 1] == '1')
			for (int i = 0; i < t.size(); ++i)
				t[i] ^= 1;
#define ANS(i) (ans.push_back(i), s[i] ^= 1, s[(i) + 1] ^= 1)
		if (t == "0000")
			ANS(i + 1);
		else if (t == "0010")
			;
		else if (t == "0100")
			;
		else if (t == "1000")
			ANS(i);
		else if (t == "0110")
			;
		else if (t == "1100")
			ANS(i + 1);
		else if (t == "1010")
			;
		else if (t == "1110")
			ANS(i);
	}
	cout << ans.size() << '\n';
	for (int i = 0; i < ans.size(); ++i)
		cout << ans[i] + 1 << ' ';
}
```
