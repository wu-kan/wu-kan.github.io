---
title: SYSU Novice Programming Contest 2019, Online
tags:
  - ACM
  - 题解
---

如愿亲手出了一场完整比赛，祝大家 A 题开心~[题目数据&现场榜单](https://github.com/wu-kan/SYSU-Novice-Programming-Contest-2019--Online)

{% raw %}

## FranChouChou

FranChouChou is an idol group founded by Kōtarō Tatsumi and led by Saki Nikaidō, consisting of zombies of legendary girls resurrected by Kotaro. Their objective is to save Saga and resurrect the local idol trend in the process.

![p44](<https://Mizuno-Ai.wu-kan.cn/EP12/EP12(44).jpg>)

The idol group's tentative name was Death Musume, which was later changed to Green Face by Kotaro. The idol members of the group, however, found the names not satisfactory, eventually deciding to rename it to Franchouchou based on the sound Tae made when she sneezed.

![p43](<https://Mizuno-Ai.wu-kan.cn/EP12/EP12(43).jpg>)

The followings are members in the group:

- Zombie #0 Yamada Tae
- Zombie #1 Minamoto Sakura
- Zombie #2 Nikaido Saki
- Zombie #3 Mizuno Ai
- Zombie #4 Konno Junko
- Zombie #5 Yugiri
- Zombie #6 Hoshikawa Lily

Now with given a name of an idol, you are asked about her/his number.

### Input

The input contains only single line, one of the names mentioned above.

### Output

You should output the number of the zombie.

### Sample Input

```bash
Mizuno Ai
```

### Sample Output

```bash
3
```

### Solution

用于签到的字符串比较题，认真读题的同学应该都不会写错~

```cpp
#include <bits/stdc++.h>
using namespace std;
int main()
{
	string s;
	getline(cin, s);
	cout << map<string, int>{{"Yamada Tae", 0},
							 {"Minamoto Sakura", 1},
							 {"Nikaido Saki", 2},
							 {"Mizuno Ai", 3},
							 {"Konno Junko", 4},
							 {"Yugiri", 5},
							 {"Hoshikawa Lily", 6}}
				.at(s);
}
```

~~我永远喜欢水野爱~~

## Number

Reeeeein is good at math problems, because he always holds $n-1$ integers in his brain, and every element exactly appears $k$ times. However, when he once took part in a programming contest, a new integer suddenly squeezed into his brain. This made him so confused that he wrote 5 mistakes within 20 code lines.

Now please help Reeeeein to find this new integer which appears exactly once!

### input

The first line contains two integers $n,k$.

The second line contains $n$ integers $a_0,a_1,\ldots,a_{n-1}$.

$1<k<n\leq 114514$

$\forall i \in [0,n),a_i \in [0,1919810)$

### output

You should output the number.

### Sample Input

```bash
5 2
2 2 3 29 3
```

### Sample Output

```bash
29
```

### Note

The best algorithm for this problem has a linear time complexity and a constant space complexity. However, solutions with $O(n\log n)$ time complexity will also be accepted!

### Solution

一个使用$O(n\log n)$时间、$O(n)$空间的解法是不难想的，直接排序，或是使用`map<int, int>`即可。

一个使用$O(\max\{n,\mid a_i \mid\})$时间和$O(\mid a_i \mid)$空间的解法也是不难想的，把上一步的`map`换成一个`int`数组即可。

那么我们增加一点难度，考虑使用$O(n)$时间和$O(1)$空间（比如 1M 内存），怎么解决问题呢？注意，在这样的内存限制之下，甚至不能把整个数组存下来。

我们先考虑这个问题的一个简单版本：当$k=2$的时候，略有经验的同学应该会知道，这是一个[经典问题](https://leetcode.com/problems/single-number/)，对整个序列求一遍[异或](https://baike.baidu.com/item/%E5%BC%82%E6%88%96/10993677)和即可。

当我们增加$k$的时候，会发生什么？$k=3$的时候，[这个题目](https://leetcode.com/problems/single-number-ii/)仍然可以使用更加复杂的位运算，“看起来很巧妙”的做掉这个题。详细的题法这里我略掉，可以去看[这篇博客](https://blog.csdn.net/D5__J9/article/details/89842946)。然而我觉得，这些解法并没有触及到问题的本质，于是就有了这道题。

先来说这题的解法，其实非常简单：**对二进制的每一位做模$k$意义下的加法**，这样，恰好出现$k$次的输入就会被筛掉。

现在我们再回去看最初的版本，当$k=2$的时候，对二进制的每一位做模 2 的加法就相当于取异或和。上过数字电路设计、自己实现过加法器的同学是不是更加能够理解了，**异或运算的本质是没有进位的二进制加法**呢~

总之，由于是新手赛，就没有在题目限制上搞大家了，我还是想出一个大家都可以做，但是存在优秀解法的题目~

```cpp
#include <bits/stdc++.h>
using namespace std;
const int BIT = 31;
int n, k, a, b[BIT];
int main()
{
	scanf("%d%d", &n, &k);
	for (int i = 0, j; i < n; ++i)
		for (scanf("%d", &a), j = 0; a; ++j, a >>= 1)
			if (a & 1)
				++b[j];
	for (int j = a = 0; j < BIT; ++j)
		a |= b[j] % k << j;
	printf("%d", a);
}
```

~~关于演员 Reeeeein 的故事可以看[这篇博客](https://wu-kan.cn/_posts/2019-11-04-%E5%86%8D%E8%A7%81-%E7%AE%97%E6%B3%95%E7%AB%9E%E8%B5%9B/)~~

## Markdown

Ender starts his blog life today! The first thing for him to learn is markdown, which is a system for annotating a document in a way that is syntactically distinguishable from the text. The user can control the display of the document; formatting words as bold or italic, adding images, and creating lists are just a few of the things one can do with markdown, and the markdown renderer will convert the text to html format.

There are many implementations of markdown renderer. But we only consider a (extremely!) simplified subset here.

- title: Convert `# TITLE` to `<h1>TITLE</h1>`, `## TITLE` to `<h2>TITLE</h2>`, $\ldots$, `###### TITLE` to `<h6>TITLE</h6>`.
- link: Convert `[TEXT](LINK)` to `<a href="LINK">TEXT</a>` tag.
- newline: Put a `<br/>` tag to the end of a line.

You can simply assume that:

- No extra space at the beginning and end of each line.
- Any character in `<>` will not appear in the context.
- There is a whitespace between `#` and TITLE.
- There are no links in title.
- The title always occupies a whole line.
- `#` will not appear in the context unless it represents a title.
- Any character in `[]()` will not appear in the context unless it is a link.
- `[]()` will not be nested.

If you still have any questions, you can refer to the sample output.

### Input

A markdown style text, only using the rules above.

An empty line represents the end of input, and should be ignored.

The total length of the input will not exceed $10^6$.

### Output

A html format text, each line of input corresponds to each line of output.

You should not output extra whitespaces or emptylines, but a newline at the end of output will be ignored.

### Sample Input

```bash
# Welcome
Welcome to [my blog](https://ender-coder.github.io/)!
## H2 title

```

### Sample Output

```bash
<h1>Welcome</h1><br/>
Welcome to <a href="https://ender-coder.github.io/">my blog</a>!<br/>
<h2>H2 title</h2><br/>
```

### Note

You can output to a "html" file and open it with Web browser.

### Solution

一道比较考验基本功的字符串处理题，一个简易的 Markdown 渲染器。出这个题的时候，本来想再增加一些别的规则（无序列表、有序列表、代码块、引用、加粗、斜体……）的，不过考虑到大家的水平，最后题目还是被简化成这个样子，并且规则之间没有嵌套，希望大家能够写的开心，不要出成毒瘤模拟题。并且，这篇 Solution 就是使用 Markdown 排版。

Markdown 渲染器其实有很多实现，大家有空可以继续完善自己的渲染器框架，甚至可以实现一个基于 markdown 的博客引擎（比如用 Ruby 实现的[jekyll](https://github.com/jekyll/jekyll)，用 Node.js 实现的[hexo](https://github.com/hexojs/hexo)……），相信对代码能力和工程能力都会有比较大的提升。

考虑到`gets`不安全（详见[这里](https://zh.cppreference.com/w/cpp/io/c/gets)），标程使用了`fgets`进行读入，会把换行符一起读进来，要记得去掉。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 1e6 + 9;
char s[N];
int main()
{
	for (; fgets(s, N, stdin) && s[0] != '\n'; printf("<br/>\n"))
	{
		*strchr(s, '\n') = 0;
		if (s[0] == '#')
		{
			int hn = strchr(s, ' ') - s;
			printf("<h%d>%s</h%d>", hn, s + hn + 1, hn);
			continue;
		}
		for (int i = 0; s[i]; ++i)
		{
			if (s[i] != '[')
			{
				printf("%c", s[i]);
				continue;
			}
			int title = i + 1,
				link = strchr(s + title, '(') + 1 - s;
			s[link - 2] = s[i = strchr(s + link, ')') - s] = 0;
			printf("<a href=\"%s\">%s</a>", s + link, s + title);
		}
	}
}
```

~~样例里的[链接](https://ender-coder.github.io/)是可以点的~~

## Werewolves

"Werewolves" is a popular card game among young people. In the basic game, there are 2 different groups: the werewolves and the villagers. The purpose of each side is to kill all the opponents, and at least one of themselves survives. During each round of the game, the player will debate players they think are werewolves or not.

Since Emily plays quite well in the Werewolves games, her friends decided to confuse her in the following ways: Like "Player a is a werewolf, or player b is a villager", the statements they give will contain two pieces of information connected by "or" relationships, of which only one is true.

Now Emily is going to point out all the werewolves, so she wants to know if there's a situation (even if all of them are werewolves or villagers) that meets the above restrictions.

### Input

The first line contains an integer $N$, indicating the number of players.

Then follows $N$ lines, i-th line contains $4$ string $X,S,Y,T$, indicating the i-th player tells Emily, "Player X is a S or Player Y is a T."

$1\le N\le 26$

$X,Y\in\{'a','b',\ldots,'z'\}$

$S,T\in\{"villager","werewolf"\}$

### Output

Print a line of lowercase letters denote the werewolves players, separated by white space.

If all players are villagers print "All".

If there are no situation which obey the rules above, print "Nie" instead.

If there are multiple solutions, any solution will be accepted.

### Sample Input 1

```bash
2
a villager a villager
b werewolf b villager
```

### Sample Output 1

```bash
Nie
```

### Sample Input 2

```bash
2
a villager a werewolf
a werewolf b villager
```

### Sample Output2

```bash
All
```

### Sample Input 3

```bash
7
a werewolf f werewolf
a werewolf e werewolf
e werewolf f villager
c villager f werewolf
c villager d villager
d villager f villager
c werewolf c villager
```

### Sample Output 3

```bash
c e f
```

### Solution

这道题其实是一道非常经典的 2-SAT（2 元约束）问题。考虑过参加新手赛的大家可能都没怎么学过图论，数据范围是调整成直接搜索也可以过的。

```cpp
#include <bits/stdc++.h>
using namespace std;
struct Graph
{
	struct Vertex
	{
		vector<int> o;
	};
	typedef pair<int, int> Edge;
	vector<Vertex> v;
	vector<Edge> e;
	Graph(int n) : v(n) {}
	void add(const Edge &ed)
	{
		v[ed.first].o.push_back(e.size());
		e.push_back(ed);
	}
};
struct TwoSat : Graph
{
	vector<int> ok;
	TwoSat(int n) : Graph(n) {}
	void addOR(int a, int b) { add({a ^ 1, b}), add({b ^ 1, a}); }
	void addXOR(int a, int b) { addOR(a, b), addOR(a ^ 1, b ^ 1); }
	void addXNOR(int a, int b) { addOR(a, b ^ 1), addOR(a ^ 1, b); }
	int dfs(int u, vector<int> &stak)
	{
		if (ok[u ^ 1])
			return 0;
		if (ok[u])
			return 1;
		ok[u] = 1;
		stak.push_back(u);
		for (int i = 0; i < v[u].o.size(); ++i)
			if (!dfs(e[v[u].o[i]].second, stak))
				return 0;
		return 1;
	}
	int ask()
	{
		ok.assign(v.size(), 0);
		for (int i = 0; i < v.size(); i += 2)
			if (!ok[i] && !ok[i ^ 1])
			{
				vector<int> stak;
				if (!dfs(i, stak))
				{
					for (int j = 0; j < stak.size(); ++j)
						ok[stak[j]] = 0;
					if (!dfs(i ^ 1, stak))
						return 0;
				}
			}
		return 1;
	}
};
int main()
{
	int n;
	scanf("%d", &n);
	TwoSat g(n << 1);
	for (int i = 0; i < n; ++i)
	{
		char x[9], s[9], y[9], t[9];
		scanf("%s%s%s%s", x, s, y, t);
		g.addXOR(x[0] - 'a' << 1 | s[0] == 'w', y[0] - 'a' << 1 | t[0] == 'w');
	}
	if (!g.ask())
		return printf("Nie"), 0;
	for (int i = n = 0; i < g.ok.size(); i += 2)
		if (!g.ok[i])
			printf("%c ", 'a' + (i >> 1)), ++n;
	if (!n)
		printf("All");
}
```

然而，这一类问题其实是有经典的图论解法的。问题可以抽象成，对于$n$个布尔变量$x_0\ldots x_{n-1}$，逻辑表达式$Y=(A_0+B_0)(A_1+B_1)\ldots(A_{m-1}+B_{m-1})$，其中$A_i,B_i\in\{x_j,\overline{x_j}\}$，判断是否存在$x_0\ldots x_{n-1}$的取值使得 Y 值为 1。对于本题中要求异或关系，可以这样转换：$A \oplus B=(A+B)(\overline{A}+\overline{B})$。

在这个问题里，某个玩家是否是狼人能构成布尔变量，我们把每个狼人拆两个点建图，分别对应是狼人的情况和不是狼人的情况。因为$A+B=(\overline A\to B)(\overline B\to A)$，所以对于一个要求$A+B$，我们连$\overline A\to B,\overline B\to A$两条边。如果有一条边$A\to B$，意味着如果 A 成立那么 B 必然成立。这样我们就建好图了。

如果$\exists i,x_i,\overline{x_i}\in$同一 SCC（Strongly Connected Componenet，强连通分量），则不存在。求 SCC 可以使用线性复杂度的[Tarjan 算法](https://wu-kan.cn/_posts/2019-02-02-%E5%9B%BE%E8%AE%BA/#%E6%97%A0%E5%90%91%E5%9B%BE%E6%B1%82%E8%BE%B9%E5%8F%8C%E8%BF%9E%E9%80%9A%E5%88%86%E9%87%8F%E6%9C%89%E5%90%91%E5%9B%BE%E6%B1%82%E5%BC%BA%E8%BF%9E%E9%80%9A%E5%88%86%E9%87%8F)，可以自行学习。这样我们就判断了是否有解。

下面我们再来构造一组可行解。将使用 Tarjan 算法缩点后的森林中每条边反向，按照拓扑序（因为已经进行缩点，所以不存在环路）进行如下操作：

1. 初始时所有节点为无色。
2. 若当前节点未被染色，染成红色，然后将所有互斥点所在有向子树中的点全部染成黑色。
3. 否则什么都不做，继续处理下一个节点。

容易证明上述操作不会使同一个节点被染上两种颜色，最终红点集构成一组解。时间复杂度$O(\mid V \mid +\mid E \mid)$，其中$V$是顶点集，$E$是边集。

最终总的时间复杂度是$O(N)$，远远好于题目要求的$1\le N\le 26$。

```cpp
#include <bits/stdc++.h>
using namespace std;
struct Graph
{
	struct Vertex
	{
		vector<int> o;
	};
	typedef pair<int, int> Edge;
	vector<Vertex> v;
	vector<Edge> e;
	Graph(int n) : v(n) {}
	void add(const Edge &ed)
	{
		v[ed.first].o.push_back(e.size());
		e.push_back(ed);
	}
};
struct StronglyConnectedComponenet : Graph
{
	vector<int> dep, sid, stak; //sid=点所属连通块内一点
	StronglyConnectedComponenet(int n) : Graph(n) {}
	void ask()
	{
		dep.assign(v.size(), v.size());
		sid.assign(v.size(), v.size());
		for (int i = 0; i < v.size(); ++i)
			if (dep[i] == v.size())
				dfs(i, v.size());
	}
	int dfs(int u, int fa)
	{
		int low = dep[u] = fa != v.size() ? dep[fa] + 1 : 0;
		stak.push_back(u);
		for (int i = 0, k, to; i < v[u].o.size(); ++i)
			if (k = v[u].o[i], to = e[k].second, to != fa, 1) //求强连通分量把注释去掉，即允许走回边
			{
				if (dep[to] == v.size())
					low = min(low, dfs(to, u));
				else if (sid[to] == v.size())
					low = min(low, dep[to]);
			}
		if (low == dep[u])
			for (;;)
			{
				int x = stak.back();
				stak.pop_back();
				sid[x] = u;
				if (x == u)
					break;
			}
		return low;
	}
};
struct TwoSat : StronglyConnectedComponenet
{
	vector<int> ok;
	TwoSat(int n) : StronglyConnectedComponenet(n) {}
	void addOR(int a, int b) { add({a ^ 1, b}), add({b ^ 1, a}); }
	void addXOR(int a, int b) { addOR(a, b), addOR(a ^ 1, b ^ 1); }
	void addXNOR(int a, int b) { addOR(a, b ^ 1), addOR(a ^ 1, b); }
	int ask()
	{
		StronglyConnectedComponenet::ask();
		for (int i = 0; i < v.size(); i += 2)
			if (sid[i] == sid[i ^ 1])
				return 0;
		vector<vector<int>> g(v.size());
		vector<int> ind(v.size(), 0), cf(v.size(), 0), stak;
		for (int i = 0; i < v.size(); ++i)
		{
			cf[sid[i]] = sid[i ^ 1];
			for (int j = 0, k; j < v[i].o.size(); ++j)
				if (sid[e[k = v[i].o[j]].second] != sid[i])
					g[sid[e[k].second]].push_back(sid[i]), ++ind[sid[i]];
		}
		for (int i = 0; i < v.size(); ++i)
			if (sid[i] == i && !ind[i])
				stak.push_back(i);
		for (ok.assign(v.size(), -1); !stak.empty();)
		{
			int u = stak.back();
			stak.pop_back();
			if (ok[u] < 0)
				ok[u] = 1, ok[cf[u]] = 0;
			for (int i = 0; i < g[u].size(); ++i)
				if (!--ind[g[u][i]])
					stak.push_back(g[u][i]);
		}
		for (int i = 0; i < v.size(); ++i)
			if (i != sid[i])
				ok[i] = ok[sid[i]];
		return 1;
	}
};
int main()
{
	int n;
	scanf("%d", &n);
	TwoSat g(n << 1);
	for (int i = 0; i < n; ++i)
	{
		char x[9], s[9], y[9], t[9];
		scanf("%s%s%s%s", x, s, y, t);
		g.addXOR(x[0] - 'a' << 1 | s[0] == 'w', y[0] - 'a' << 1 | t[0] == 'w');
	}
	if (!g.ask())
		return printf("Nie"), 0;
	for (int i = n = 0; i < g.ok.size(); i += 2)
		if (!g.ok[i])
			printf("%c ", 'a' + (i >> 1)), ++n;
	if (!n)
		printf("All");
}
```

## TianHe-2A

TianHe-2 is the fastest supercomputer in the world from June 2013 to June 2016. In September 2017, National Supercomputer Center in Guangzhou announced to upgrade TianHe-2 supercomputing system by the end of the year, replacing the original Intel Xeon Phi accelerator with the domestic accelerator matrix 2000. The upgraded TianHe-2 is called TianHe-2A. The number of nodes has increased from 16000 to 17792, and the floating-point performance has increased from 54.9pflops to 94.97pflops.

During a TianHe-2A's schedule, the cluster workload manager allocates $n$ computing nodes to users so they can perform work. To simplify this problem, all the $n$ computing nodes are considered to be in a line from left to right and indexed from $0$ to $n-1$. At the beginning each node $i$ holds a nonnegative integer $a_i$. Then the nodes are ready to work, by executing any of the following commands:

- $div\,l\,r\,w$: $\forall i \in [l,r],a_i\to \lfloor\frac{a_i}{w}\rfloor$
- $sqr\,l\,r$: $\forall i \in [l,r],a_i\to \lfloor\sqrt{a_i}\rfloor$
- $phi\,l\,r$: $\forall i \in [l,r],a_i\to \phi(a_i)$
- $ask\,l\,r$: Ask the max value from $a_l$ to $a_r$.

Now WuK wants you to simulate the operation of Tianhe-2A.

### Input

The first line of the input gives the number of test cases, $t$. $t$ test cases follow.

Each test case starts with a line containing two integers $n,m$, the number of computing nodes and the number of opeartions.

The next line contains $n$ integers $a_0,a_1,\ldots,a_{n-1}$.

Then, there are $m$ more lines, each line contains a command as before.

$1<t\leq 20$

$0<n,m,w\leq17792$, and $w$ is an integer

$0\le l\le r<n$

$\forall i \in [0,n),0\le a_i<17792$

### Output

For each $ask$ command, you are asked to output a integer on a new line.

### Sample Input

```bash
1
10 10
0 1 2 3 4 5 6 7 8 9
ask 0 4
phi 4 4
ask 4 4
ask 0 4
ask 6 9
sqr 5 9
ask 7 7
ask 9 9
div 0 9 3
ask 0 9
```

### Sample Output

```bash
4
2
3
9
2
3
1
```

### Note

The Euler function $\phi$ is an important kind of function in number theory, $\phi(n)$ represents the amount of the numbers which are smaller than n and coprime to n, and this function has a lot of beautiful characteristics.

Let me put it another way, Euler function $\phi(i)=\sum_{j=1}^{i-1}[\gcd(i,j)=1]$. Moreover, $\phi(0)=0,\phi(1)=1,\phi(2)=1,\phi(3)=2,\phi(4)=2,\ldots$

### Solution

裸的线段树，顺便普及一下超算知识。要用线段树维护区间最大值，支持的修改操作是区间开方、区间整除、区间欧拉函数变换。

这一题的出题灵感来自于[南京网络赛的 super_log](https://wu-kan.cn/_posts/2019-09-01-The-Preliminary-Contest-for-ICPC-Asia-Nanjing-2019/#super_log)这一题：欧拉函数的变换收敛速度非常快。在这个题里，17792 以内的数至多变换 27 次就会收敛到 1，因此我们在修改的时候检查一下当前区间最大值，如果小于等于 1 我们就可以提前退出这个区间的修改。这样，线段树每个节点被修改的次数都不会超过 27 次，时间上完全没问题。欧拉函数变换我们可以先用线性[欧拉筛](https://wu-kan.cn/_posts/2019-02-01-%E6%95%B0%E8%AE%BA/#%E6%AC%A7%E6%8B%89%E7%AD%9B)算出 17792 以内所有数的欧拉函数；考虑到新手可能不会欧拉筛，这里如果使用$O(\sqrt{n})$的[直接求欧拉函数](https://wu-kan.cn/_posts/2019-02-01-%E6%95%B0%E8%AE%BA/#%E7%9B%B4%E6%8E%A5%E6%B1%82%E6%AC%A7%E6%8B%89%E5%87%BD%E6%95%B0)应该也是可以过的。~~什么，你$O(n\log n)$求单个欧拉函数？~~

区间整除也是同理，只不过要特殊判断一下除数为 1 的时候也要提前退出去（有一组数据除数全为 1），否则永远不会收敛，复杂度会被卡到$O(n^2)$。

区间开方同理，是三个操作里面套路最少、最简单的。

```cpp
#include <bits/stdc++.h>
using namespace std;
const int N = 17792;
struct EulerSieve
{
	vector<int> p, m, phi;
	EulerSieve(int N) : m(N, 0), phi(N, 0)
	{
		phi[1] = 1;
		for (long long i = 2, k; i < N; ++i)
		{
			if (!m[i])
				p.push_back(m[i] = i), phi[i] = i - 1;
			for (int j = 0; j < p.size() && (k = i * p[j]) < N; ++j)
			{
				phi[k] = phi[i] * p[j];
				if ((m[k] = p[j]) == m[i])
					break;
				phi[k] -= phi[i];
			}
		}
	}
} e(N);
int t, n, m, a[N];
struct SegmentTree
{
	int l, r, val;
	vector<SegmentTree> ch;
	SegmentTree(int l, int r) : l(l), r(r), val(a[l])
	{
		if (l >= r)
			return;
		int m = l + (r - l >> 1);
		ch = {{l, m}, {m + 1, r}};
		val = max(ch[0].val, ch[1].val);
	}
	void div(int l, int r, int w)
	{
		if (val < 1 || w == 1)
			return;
		if (this->l >= this->r)
		{
			val /= w;
			return;
		}
		if (r <= ch[0].r)
			ch[0].div(l, r, w);
		else if (l >= ch[1].l)
			ch[1].div(l, r, w);
		else
			ch[0].div(l, ch[0].r, w), ch[1].div(ch[1].l, r, w);
		val = max(ch[0].val, ch[1].val);
	}
	void sqr(int l, int r)
	{
		if (val < 2)
			return;
		if (this->l >= this->r)
		{
			val = sqrt(val);
			return;
		}
		if (r <= ch[0].r)
			ch[0].sqr(l, r);
		else if (l >= ch[1].l)
			ch[1].sqr(l, r);
		else
			ch[0].sqr(l, ch[0].r), ch[1].sqr(ch[1].l, r);
		val = max(ch[0].val, ch[1].val);
	}
	void phi(int l, int r)
	{
		if (val < 2)
			return;
		if (this->l >= this->r)
		{
			val = e.phi[val];
			return;
		}
		if (r <= ch[0].r)
			ch[0].phi(l, r);
		else if (l >= ch[1].l)
			ch[1].phi(l, r);
		else
			ch[0].phi(l, ch[0].r), ch[1].phi(ch[1].l, r);
		val = max(ch[0].val, ch[1].val);
	}
	int ask(int l, int r)
	{
		if (l <= this->l && this->r <= r)
			return val;
		if (r <= ch[0].r)
			return ch[0].ask(l, r);
		if (l >= ch[1].l)
			return ch[1].ask(l, r);
		return max(ch[0].ask(l, ch[0].r), ch[1].ask(ch[1].l, r));
	}
};
int main()
{
	for (scanf("%d", &t); t--;)
	{
		scanf("%d%d", &n, &m);
		for (int i = 0; i < n; ++i)
			scanf("%d", &a[i]);
		SegmentTree t(0, n - 1);
		for (int i = 0, l, r, w; i < m; ++i)
		{
			char s[9];
			scanf("%s%d%d", s, &l, &r);
			if (!strcmp(s, "div"))
				scanf("%d", &w), t.div(l, r, w);
			else if (!strcmp(s, "sqr"))
				t.sqr(l, r);
			else if (!strcmp(s, "phi"))
				t.phi(l, r);
			else
				printf("%d\n", t.ask(l, r));
		}
	}
}
```

~~命题组日常，E 题又被水过去了~~

![E题又被水过去了](data:image/webp;base64,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)

{% endraw %}
