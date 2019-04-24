---
title: Homework 5-2 修改程序为不使用reduction
categories: 超级计算机原理与操作
---
[题目链接](https://easyhpc.org/problems/program/364/)

> 给出以下openmp程序（点击参考代码获取），修改代码为不使用reduction的版本。

原网页上下下来的代码很坑，乘号和减号都不是ascii字符……

这个求PI的代码也很迷，步长必须设成`1e-3`才能得到比较精确的值…
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
