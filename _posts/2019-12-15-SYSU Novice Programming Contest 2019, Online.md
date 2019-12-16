---
title: SYSU Novice Programming Contest 2019, Online
categories:
- ACM
- 题解
---
如愿亲手出了一场完整比赛，祝大家A题开心~[题目数据&现场榜单](https://github.com/wu-kan/SYSU-Novice-Programming-Contest-2019--Online)

{% raw %}

## FranChouChou

FranChouChou is an idol group founded by Kōtarō Tatsumi and led by Saki Nikaidō, consisting of zombies of legendary girls resurrected by Kotaro. Their objective is to save Saga and resurrect the local idol trend in the process.

![p44](https://cdn.jsdelivr.net/gh/wu-kan/MizunoAi/EP12/EP12(44).jpg)

The idol group's tentative name was Death Musume, which was later changed to Green Face by Kotaro. The idol members of the group, however, found the names not satisfactory, eventually deciding to rename it to Franchouchou based on the sound Tae made when she sneezed.

![p43](https://cdn.jsdelivr.net/gh/wu-kan/MizunoAi/EP12/EP12(43).jpg)

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

那么我们增加一点难度，考虑使用$O(n)$时间和$O(1)$空间（比如1M内存），怎么解决问题呢？注意，在这样的内存限制之下，甚至不能把整个数组存下来。

我们先考虑这个问题的一个简单版本：当$k=2$的时候，略有经验的同学应该会知道，这是一个[经典问题](https://leetcode.com/problems/single-number/)，对整个序列求一遍[异或](https://baike.baidu.com/item/%E5%BC%82%E6%88%96/10993677)和即可。

当我们增加$k$的时候，会发生什么？$k=3$的时候，[这个题目](https://leetcode.com/problems/single-number-ii/)仍然可以使用更加复杂的位运算，“看起来很巧妙”的做掉这个题。详细的题法这里我略掉，可以去看[这篇博客](https://blog.csdn.net/D5__J9/article/details/89842946)。然而我觉得，这些解法并没有触及到问题的本质，于是就有了这道题。

先来说这题的解法，其实非常简单：**对二进制的每一位做模$k$意义下的加法**，这样，恰好出现$k$次的输入就会被筛掉。

现在我们再回去看最初的版本，当$k=2$的时候，对二进制的每一位做模2的加法就相当于取异或和。上过数字电路设计、自己实现过加法器的同学是不是更加能够理解了，**异或运算的本质是没有进位的二进制加法**呢~

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

~~关于演员Reeeeein的故事可以看[这篇博客](https://wu-kan.github.io/posts/acm/%E5%86%8D%E8%A7%81-%E7%AE%97%E6%B3%95%E7%AB%9E%E8%B5%9B)~~

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

```markdown
# Welcome
Welcome to [my blog](https://ender-coder.github.io/)!
## H2 title

```

### Sample Output

```html
<h1>Welcome</h1><br/>
Welcome to <a href="https://ender-coder.github.io/">my blog</a>!<br/>
<h2>H2 title</h2><br/>
```

### Note

You can output to a "html" file and open it with Web browser.

### Solution

一道比较考验基本功的字符串处理题，一个简易的Markdown渲染器。出这个题的时候，本来想再增加一些别的规则（无序列表、有序列表、代码块、引用、加粗、斜体……）的，不过考虑到大家的水平，最后题目还是被简化成这个样子，并且规则之间没有嵌套，希望大家能够写的开心，不要出成毒瘤模拟题。并且，这篇Solution就是使用Markdown排版。

Markdown渲染器其实有很多实现，大家有空可以继续完善自己的渲染器框架，甚至可以实现一个基于markdown的博客引擎（比如用Ruby实现的[jekyll](https://github.com/jekyll/jekyll)，用Node.js实现的[hexo](https://github.com/hexojs/hexo)……），相信对代码能力和工程能力都会有比较大的提升。

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

这道题其实是一道非常经典的2-SAT（2元约束）问题。考虑过参加新手赛的大家可能都没怎么学过图论，数据范围是调整成直接搜索也可以过的。

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

然而，这一类问题其实是有经典的图论解法的。问题可以抽象成，对于$n$个布尔变量$x_0\ldots x_{n-1}$，逻辑表达式$Y=(A_0+B_0)(A_1+B_1)\ldots(A_{m-1}+B_{m-1})$，其中$A_i,B_i\in\{x_j,\overline{x_j}\}$，判断是否存在$x_0\ldots x_{n-1}$的取值使得Y值为1。对于本题中要求异或关系，可以这样转换：$A \oplus B=(A+B)(\overline{A}+\overline{B})$。

在这个问题里，某个玩家是否是狼人能构成布尔变量，我们把每个狼人拆两个点建图，分别对应是狼人的情况和不是狼人的情况。因为$A+B=(\overline A\to B)(\overline B\to A)$，所以对于一个要求$A+B$，我们连$\overline A\to B,\overline B\to A$两条边。如果有一条边$A\to B$，意味着如果A成立那么B必然成立。这样我们就建好图了。

如果$\exists i,x_i,\overline{x_i}\in$同一SCC（Strongly Connected Componenet，强连通分量），则不存在。求SCC可以使用线性复杂度的[Tarjan算法](https://wu-kan.github.io/posts/acm/template/%E5%9B%BE%E8%AE%BA#%E6%97%A0%E5%90%91%E5%9B%BE%E6%B1%82%E8%BE%B9%E5%8F%8C%E8%BF%9E%E9%80%9A%E5%88%86%E9%87%8F%E6%9C%89%E5%90%91%E5%9B%BE%E6%B1%82%E5%BC%BA%E8%BF%9E%E9%80%9A%E5%88%86%E9%87%8F)，可以自行学习。这样我们就判断了是否有解。

下面我们再来构造一组可行解。将使用Tarjan算法缩点后的森林中每条边反向，按照拓扑序（因为已经进行缩点，所以不存在环路）进行如下操作：

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

这一题的出题灵感来自于[南京网络赛的super_log](https://wu-kan.github.io/posts/acm/%E9%A2%98%E8%A7%A3/The-Preliminary-Contest-for-ICPC-Asia-Nanjing-2019#super_log)这一题：欧拉函数的变换收敛速度非常快。在这个题里，17792以内的数至多变换27次就会收敛到1，因此我们在修改的时候检查一下当前区间最大值，如果小于等于1我们就可以提前退出这个区间的修改。这样，线段树每个节点被修改的次数都不会超过27次，时间上完全没问题。欧拉函数变换我们可以先用线性[欧拉筛](https://wu-kan.github.io/posts/acm/template/%E6%95%B0%E8%AE%BA#%E6%AC%A7%E6%8B%89%E7%AD%9B)算出17792以内所有数的欧拉函数；考虑到新手可能不会欧拉筛，这里如果使用$O(\sqrt{n})$的[暴力求欧拉函数](https://wu-kan.github.io/posts/acm/template/%E6%95%B0%E8%AE%BA#%E7%9B%B4%E6%8E%A5%E6%B1%82%E6%AC%A7%E6%8B%89%E5%87%BD%E6%95%B0)应该也是可以过的。~~什么，你$O(n\log n)$求单个欧拉函数？~~

区间整除也是同理，只不过要特殊判断一下除数为1的时候也要提前退出去（有一组数据除数全为1），否则永远不会收敛，复杂度会被卡到$O(n^2)$。

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

~~命题组日常，E题又被水过去了~~

![E题又被水过去了](/public/image/2019-12-15-1.jpg)

{% endraw %}
