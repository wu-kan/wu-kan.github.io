---
title: 2019 Multi-University Training Contest 8
categories:
- ACM
- 题解
---
## [Quailty and CCPC](https://vjudge.net/problem/HDU-6666)

```cpp
#include <bits/stdc++.h>
using namespace std;
struct Team
{
	int penalty, timu, id;
	bool operator<(const Team &q) const
	{
		return timu == q.timu ? penalty < q.penalty : timu > q.timu;
	}
} tt[1004000];
char s[1000040][20];
int n, m, t;
int main(void)
{
	scanf("%d", &t);
	while (t--)
	{
		scanf("%d%d", &n, &m);
		for (int i = 1; i <= n; i++)
			scanf("%s%d%d", s[i], &tt[i].timu, &tt[i].penalty), tt[i].id = i;
		if (n * m % 10 == 5)
		{
			sort(tt + 1, tt + n + 1);
			printf("%s\n", s[tt[n * m / 10 + 1].id]);
		}
		else
			puts("Quailty is very great");
	}
}
```
