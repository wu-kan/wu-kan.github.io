---
title: "Codeforces Round #685 (Div. 2)"
tags:
  - ACM
---

[官方题解](https://codeforces.com/blog/entry/84885)

~~今晚的题怎么都带点博弈的味道~~

## [Subtract or Divide](https://vjudge.net/problem/CodeForces-1451A)

一开始以为无脑除就行了，结果 WA 了…后来一想，反正偶数可以变成 2 然后快速收敛，奇数可以减一变成偶数然后快速收敛，答案一定小于 4，于是启发式搜索一下算了。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 2e5 + 9, INF = 1e9;
int cal(int n, int ep)
{
	if (ep < 0)
		return INF;
	if (n == 1)
		return min(0, ep);
	if (n == 2)
		return 1;
	if (n % 2 == 0)
		return 1 + cal(2, ep - 1);
	int ans = 1 + cal(n - 1, ep - 1);
	for (int i = 3; i * i <= n; ++i)
		if (n % i == 0)
			ans = min(ans, 1 + cal(i, ans - 1));
	return ans;
}
int t, n;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		printf("%d\n", cal(n, INF));
	}
}
```

实际上答案就是上面的方案，直接输出来也可以过。

```cpp
#include <bits/stdc++.h>
using namespace std;
int t, n;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d", &n);
		printf("%d\n", n < 4 ? n - 1 : 2 + (n & 1));
	}
}
```

## [Non-Substring Subsequence](https://vjudge.net/problem/CodeForces-1451B)

只要存在这样一个子序列，那我把他除了左右端点之外的序列都移动回原来的子串，左右端点再移动一个回去，不改变答案的正确性。于是问题就变成，左端点以左或者右端点之右是否存在一点和端点值相同。

可以通过预处理前缀后缀达到 $O(n+q)$ 的复杂度，但是这个题直接 $O(nq)$ 就可以了。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 127;
char s[N];
int t, n, q;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d%s", &n, &q, s);
		for (int i = 0, l, r; i < q; ++i)
		{
			scanf("%d%d", &l, &r);
			--l, --r;
			int ans = 0;
			for (int i = 0; !ans && i < l; ++i)
				if (s[i] == s[l])
					ans = 1;
			for (int i = r + 1; !ans && i < n; ++i)
				if (s[i] == s[r])
					ans = 1;
			printf(ans ? "YES\n" : "NO\n");
		}
	}
}
```

## [String Equality](https://vjudge.net/problem/CodeForces-1451C)

注意到第一个操作是交换两个元素的位置，那么无论 a 串 b 串是什么顺序，只要相同字母数量也相同，就一定可以通过位置交换来使两个串相等。于是只要考虑两个串对于每个字母的数量即可。注意到操作二是不可逆的，我们只要从字母 `z` 开始倒序判断即可。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
const int N = 1e6 + 9;
char a[N], b[N];
int ok(int k)
{
	vector<int> va(26, 0), vb(26, 0);
	for (int i = 0; a[i]; ++i)
		++va[a[i] - 'a'];
	for (int i = 0; b[i]; ++i)
		++vb[b[i] - 'a'];
	for (int i = 25; i >= 1; --i)
	{
		while (va[i] < vb[i])
			va[i] += k, va[i - 1] -= k;
		if (va[i] > vb[i])
			return 0;
	}
	return 1;
}
int t, n, k;
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d%s%s", &n, &k, a, b);
		printf(ok(k) ? "Yes\n" : "No\n");
	}
}
```

## [Circle Game](https://vjudge.net/problem/CodeForces-1451D)

发现后出手的人只要下反方向的模仿棋，在某种情况下存在必胜策略…

然后交上去直接就过了 17 组 Pretest…慌得一笔。

```cpp
#include <bits/stdc++.h>
using namespace std;
typedef long long ll;
ll t, d, k;
int main()
{
	for (scanf("%lld", &t); t--;)
	{
		scanf("%lld%lld", &d, &k);
		ll x = sqrt(d * d / (2 * k * k));
		printf((k * x) * (k * x) + k * (x + 1) * k * (x + 1) > d * d ? "Utkarsh\n" : "Ashish\n");
	}
}
```

赛后翻题解发现 $d^2 \lt k^2(x+1)^2 + k^2(x+1)^2 \lt k^2x^2 + k^2(x+2)^2$，因此对于另外一种情况也同理，于是先手必胜。

## [Bitwise Queries (Easy Version)](https://vjudge.net/problem/CodeForces-1451E1)

见下题。

## [Bitwise Queries (Hard Version)](https://vjudge.net/problem/CodeForces-1451E2)

注意到异或运算具有可逆性，即 $\left(a\oplus b\right)\oplus a = b$，于是比赛时候一个很自然的想法就是先使用 $n-1$ 次询问其他数和 $a_1$ 的异或，然后我只要使用 2\~3 次询问得到 $a_1$ 的值就可以推出整个序列了。

同时也注意到 $\left\lbrace a_i\right\rbrace $ 元素数量为 $n$，值域大小也为 $n$，很容易想到使用抽屉原理进行讨论：

1. 若存在 $a_i=a_j$，于是询问 `AND i j`，即可得到 $a_i$ 和 $a_j$ 的值，与之前的值异或可得 $a_1$ 的值。注意这里 $i,j$ 的值可以有一个是 $1$。
2. 若不存在 $a_i=a_j$，说明 $\left\lbrace a_i\right\rbrace $ 恰完整覆盖了 $\left[1,n-1\right]$。于是要考虑使用 2 次询问求得 $a_1$ 的值。
   - 官方题解找了一组 $a_i\&a_j=n-1$ ，然后用了一个稍微复杂的方式推导出来，详见官方题解。
   - 后来来我翻其他人的代码，发现一种更简洁的方法：此时必存在唯一的 $a_i\oplus a_1=1,a_j\oplus a_1=2$，则有 $a_i\vert a_j=\left(1\oplus a_1\right)\vert\left(2\oplus a_1\right)=a_1$（后一个等号很容易按位证明，实际上只要满足 $a_i\&a_j=0$ 即可。）

比赛时只想到第一部分，第二部分没想到，呜哇…

```cpp
#include <bits/stdc++.h>
using namespace std;
int queries(string s, int i, int j)
{
	int x;
	cout << s << " " << i << " " << j << endl;
	cin >> x;
	return x;
}
int main()
{
	int n, ansa = -1;
	cin >> n;
	vector<int> xorvals(n + 1), pos(n);
	for (int i = 2; i <= n; ++i)
		xorvals[i] = queries("XOR", 1, i);
	for (int b = 1; b <= n; ++b)
	{
		if (pos[xorvals[b]])
		{
			int c = pos[xorvals[b]],
				ansb = queries("AND", b, c);
			ansa = ansb ^ xorvals[b];
			break;
		}
		pos[xorvals[b]] = b;
	}
	if (ansa < 0)
		ansa = queries("AND", 1, pos[1]) | queries("AND", 1, pos[2]);
	cout << "! " << ansa;
	for (int i = 2; i <= n; ++i)
		cout << " " << (ansa ^ xorvals[i]);
}
```

## [Nullify The Matrix](https://vjudge.net/problem/CodeForces-1451F)

结论是，如果开始状态下存在一条左下到右上异或和不为 0 的“对角线”，则先手必胜，反之后手胜。

证明：记不存在一条左下到右上异或和不为 0 的“对角线”的状态集合为 $S$，反之状态为 $S'$。

1. 任意在 $S$ 上的操作都会导致 $S\to S'$。
2. 对于 $S'$ 一定可以找到使得 $S'\to S$ 的转换。

上述两条引理的证明可以见官方题解。因此主动权在掌握了 $S'$ 的玩家手上，而结束态属于 $S$。

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	int t, n, m;
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &m);
		vector<int> xorsum(n + m - 1, 0);
		for (int i = 0; i < n; ++i)
			for (int a, j = 0; j < m; ++j)
				scanf("%d", &a), xorsum[i + j] ^= a;
		printf(count(xorsum.begin(), xorsum.end(), 0) != xorsum.size() ? "Ashish\n" : "Jeel\n");
	}
}
```
