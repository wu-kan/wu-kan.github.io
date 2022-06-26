---
title: 用 scipy 求解 The Diet Problem
---

> Formulate the following [Diet Problem](https://ftp.mcs.anl.gov/pub/tech_reports/reports/P602.pdf). Transform the formulation into LP standard form. Use some LP solver to solve the problem. Try to find the dual of the problem (optional). Suppose that we have three foods and two nutritional requirements to satisfy:
>
> |      Food       | Cost / Serving | Vitamin A | Calories | Maximum Servings |
> | :-------------: | :------------: | :-------: | :------: | :--------------: |
> |    Corn (C)     |     $0.18      |    107    |    72    |        10        |
> |   2% milk (M)   |     $0.23      |    500    |   121    |        10        |
> | Wheat bread (W) |     $0.05      |     0     |    65    |        10        |
>
> |     \          | Minimum Amount Nutrient in Diet | Maximum Amount in Diet |
> | :------------: | :-----------------------------: | :--------------------: |
> | Calories (Cal) |              2000               |          2250          |
> | Vitamin A (VA) |              5000               |         50000          |

## Formulate the problem

$$
\begin{aligned}
\min\, && 0.18x_1+0.23x_2+0.05x_3 \\
\textit{s.t.}\, & 2000\le & 72x_1+121x_2+65x_3 &\le 2250 \\
& 5000\le & 107x_1+500x_2 &\le 50000 \\
& 0\le & x_1&\le 10 \\
& 0\le & x_2&\le 10 \\
& 0\le & x_3&\le 10\\ 
\end{aligned}
$$

## Transform the formulation into LP standard form

$$
\mathbf{A}=\begin{bmatrix}
107 & 500 & 0 \\
-107& -500&0 \\
72 & 121 & 65 \\
-72 & -121 & -65 \\
1 & 0 & 0 \\
-1 & 0 & 0 \\
0 & 1 & 0 \\
0 & -1 & 0 \\
0 & 0 & 1 \\
0 & 0 & -1
\end{bmatrix}\\
\mathbf{b}=\left[50000,-5000,2250,-2000,10, 0, 10, 0, 10, 0\right]^T\\
\mathbf{c}=\left[0.18,0.23,0.05\right]
$$

## Use some LP solver to solve the problem

此处使用了 `scipy.optimize.linprog`，方便又快捷。

```python
from scipy.optimize import linprog

if __name__ == "__main__":
    A_ub = [[107, 500, 0],
            [-107, -500, 0],
            [72, 121, 65],
            [-72, -121, -65],
            [1, 0, 0],
            [-1, 0, 0],
            [0, 1, 0],
            [0, -1, 0],
            [0, 0, 1],
            [0, 0, -1]]
    b_ub = [50000, -5000, 2250, -2000, 10, 0, 10, 0, 10, 0]
    c = [0.18, 0.23, 0.05]
    print(linprog(c, A_ub, b_ub))
```

运行上面这段代码，得到结果，与参考答案一致。

```bash
     con: array([], dtype=float64)
     fun: 3.1500000382242486
 message: 'Optimization terminated successfully.'
     nit: 9
   slack: array([4.47919444e+04, 2.08055583e+02, 2.49999993e+02, 7.18327624e-06,
       8.05555529e+00, 1.94444471e+00, 2.22118501e-09, 1.00000000e+01,
       1.78711305e-07, 9.99999982e+00])
  status: 0
 success: True
       x: array([ 1.94444471, 10.        ,  9.99999982])
```
