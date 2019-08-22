---
title: Japan Alumni Group Summer Camp 2015 Day 3
categories:
- ACM
- 题解
---
## [Bits Are Dangerous](https://vjudge.net/problem/AtCoder-1457)

```cpp
#include <bits/stdc++.h>
using namespace std;

const int maxn = 2e5 + 10, INF = 1e9;
int n;
char ch[maxn];
struct data
{
	int pre, bac;
} a[maxn];

int main()
{
	scanf("%s", ch);
	int L = strlen(ch);
	for (int i = 0; i < L; i++)
		if (ch[i] == '1')
			n++;
	if (n == 0)
	{
		printf("0\n");
		return 0;
	}

	int head = 0;
	for (int i = 0; i < L; i++)
	{
		a[i].pre = head;
		if (ch[i] == '1')
			head = i;
	}
	for (int i = L - 1; i >= 0; i--)
		if (ch[i] == '1')
		{
			a[0].pre = i;
			break;
		}

	int tail = 0;
	for (int i = L - 1; i >= 0; i--)
	{
		a[i].bac = tail;
		if (ch[i] == '1')
			tail = i;
	}
	for (int i = 0; i < L; i++)
		if (ch[i] == '1')
		{
			a[L - 1].bac = i;
			break;
		}

	int ans = n * 4 + min(a[0].pre, L - a[0].bac) * 7;
	for (int i = 0; i < L; i++) //turn left
	{
		if (ch[i] == '0')
			continue;
		int now = n * 4 + i * 7 + (L - (a[i].bac - i + L) % L) * 7;
		ans = min(ans, now);
	}
	for (int i = 0; i < L; i++) //turn right
	{
		if (ch[(-i + L) % L] == '0')
			continue;
		int now = n * 4 + i * 7 + (a[(-i + L) % L].pre + i) % L * 7;
		ans = min(ans, now);
	}
	printf("%d", ans);
}
```

## [Handicapped Onsite Prediction](https://vjudge.net/problem/AtCoder-1463)

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e5 + 9;
int n, x, a[N], p[N];
int ok(int m)
{
	if (m > n)
		return 0;
	swap(p[0], p[m - 1]);
	int sum = a[0] + p[0];
	multiset<int> se(p + 1, p + n);
	swap(p[0], p[m - 1]);
	for (int i = n - 1; i; --i)
	{
		if (n - se.size() - 1 > x - 1)
			return 0;
		multiset<int>::iterator it = se.upper_bound(sum - a[i]);
		if (it != se.end())
			se.erase(it);
		else
			return 1;
	}
	return n - se.size() - 1 <= x - 1;
}
int bs(int b, int e)
{
	if (e - b < 2)
		return b;
	int m = b + (e - b >> 1);
	return ok(m) ? bs(m, e) : bs(b, m);
}
int main()
{
	scanf("%d%d", &n, &x);
	if (n < 2)
		return printf("1"), 0;
	for (int i = 0; i < n; ++i)
		scanf("%d", &a[i]);
	for (int i = 0; i < n; ++i)
		scanf("%d", &p[i]);
	sort(a + 1, a + n);
	if (!ok(1))
		return printf("-1"), 0;
	printf("%d", bs(1, n + 1));
}
```

## [Jelly-Oxygen Beans](https://vjudge.net/problem/AtCoder-1465)

```cpp
#include <iostream>
#include <cmath>
#include <cstdio>
#define ll long long
using namespace std;
ll n, m, ans;
int main(void)
{
	scanf("%lld", &n);
	ans = 0;
	if (n == 1)
	{
		cout << 1;
		return 0;
	}
	for (ll i = 1; i * i <= n; i++)
	{
		if (n % i == 0)
		{
			ans++;
			ll val = n / i - 1;
			for (ll t = 2; t * t <= val; t++)
			{
				if (val % t == 0)
				{
					ans += 2;
				}
				if (t * t == val)
					ans--;
			}
			if (val != 1)
				ans++;

			if (i * i != n)
				ans++;
			if (i != 1 && i * i != n)
			{
				val = i - 1;
				for (ll t = 2; t * t <= val; t++)
				{
					if (val % t == 0)
					{
						ans += 2;
					}
					if (t * t == val)
						ans--;
				}
				if (val != 1)
					ans++;
			}
		}
	}
	printf("%lld", ans);
}
```
