---
redirect_from: /_posts/2019-04-22-Homework-5-2-%E4%BF%AE%E6%94%B9%E7%A8%8B%E5%BA%8F%E4%B8%BA%E4%B8%8D%E4%BD%BF%E7%94%A8reduction/

title: Homework 5-2 修改程序为不使用reduction
tags: 超级计算机原理与操作
---

[题目链接](https://easyhpc.org/problems/program/364/)

> 给出以下 openmp 程序（点击参考代码获取），修改代码为不使用 reduction 的版本。

原网页上下下来的代码很坑，乘号和减号都不是 ascii 字符……

这个求 PI 的代码也很迷，步长必须设成`1e-3`才能得到比较精确的值…

```c
#include <stdio.h>
#include <omp.h>
double calculate_pi(double step)
{
	int i;
	double x, sum = 0.0;
#pragma omp parallel for private(x)
	for (i = 0; i < 1000000; ++i)
	{
		x = (i - 0.5) * step;
#pragma omp critical
		sum += 2.0 / (1.0 + x * x);
	}
	return step * sum;
}
int main()
{
	printf("%.9f", calculate_pi(1e-3));
}
```
