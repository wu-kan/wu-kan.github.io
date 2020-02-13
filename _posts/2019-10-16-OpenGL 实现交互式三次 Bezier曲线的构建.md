---
title: OpenGL 实现交互式三次 Bezier曲线的构建
tags:
  - 计算机图形学
---

## 功能要求

1. 使用鼠标在程序窗口内任意选取 4 个控制顶点
2. 根据选定的控制顶点，绘制出对应的三次 Bezier 曲线，以及其控制多边形
3. 语言不限，开发平台不限。具体效果展示允许略有差异

## 实现提示

使用鼠标回调函数，捕获屏幕窗口内点的坐标。

## 开发环境

### 硬件

所用机器型号为 VAIO Z Flip 2016

- Intel(R) Core(TM) i7-6567U CPU @3.30GHZ 3.31GHz
- 8.00GB RAM

### 软件

- Windows 10, 64-bit (Build 17763) 10.0.17763
- Visual Studio Code 1.39.2
  - Remote - WSL 0.39.9：配合 WSL，在 Windows 上获得 Linux 接近原生环境的体验。
- Windows Subsystem for Linux [Ubuntu 18.04.2 LTS]：WSL 是以软件的形式运行在 Windows 下的 Linux 子系统，是近些年微软推出来的新工具，可以在 Windows 系统上原生运行 Linux。
  - gcc version 7.4.0 (Ubuntu 7.4.0-1ubuntu1~18.04.1)

## 实验原理

- 三次贝塞尔曲线的公式为$B(t)=P_0(1-t)^3+3P_1t(1-t)^2+3P_2t^2(1-t)+P_3t,t\in [0,1]$
- 使用鼠标回调函数，捕获屏幕窗口内点的坐标
- 实现了一个鼠标点击计数器，根据点击的次数决定是画顶点、折线还是贝塞尔曲线

## 实现效果

Windows 下运行`bezier.exe`，或 Linux 下运行`bezier.out`，得到如下结果。

![1](/assets/image/2019-10-16-1.jpg)

## 源代码`bezier.c`

```c
#include <math.h>
#include <GL/gl.h>
#include <GL/glut.h>
GLfloat p[4][2];
int cnt = 0;
void mouse(int button, int state, int x, int y)
{
	if (state == GLUT_DOWN)
	{
		if (cnt < 4)
		{
			glBegin(GL_POINTS);
			glVertex2i(x, 500 - y);
			glEnd();
			p[cnt][0] = x;
			p[cnt][1] = 500 - y;
		}
		else if (cnt == 4)
		{
			glPointSize(1);
			for (int i = 1; i < 4; ++i)
			{
				glBegin(GL_LINES);
				glVertex2f(p[i - 1][0], p[i - 1][1]);
				glVertex2f(p[i][0], p[i][1]);
				glEnd();
			}
		}
		else if (cnt == 5)
		{
			glPointSize(1);
			for (GLfloat t = 0; t < 1; t += 0.001)
			{
				glBegin(GL_POINTS);
				glVertex2f(
					p[0][0] * pow(1 - t, 3) + 3 * p[1][0] * t * pow(1 - t, 2) + 3 * p[2][0] * t * t * (1 - t) + p[3][0] * pow(t, 3),
					p[0][1] * pow(1 - t, 3) + 3 * p[1][1] * t * pow(1 - t, 2) + 3 * p[2][1] * t * t * (1 - t) + p[3][1] * pow(t, 3));
				glEnd();
			}
		}
		else
		{
			glClear(GL_COLOR_BUFFER_BIT);
			glPointSize(5);
			cnt = -1;
		}
		++cnt;
		glFlush();
	}
}
void display()
{
	glClear(GL_COLOR_BUFFER_BIT);
	glFlush();
}
int main(int argc, char **argv)
{
	glutInit(&argc, argv);
	glutInitDisplayMode(GLUT_RGB | GLUT_SINGLE);
	glutInitWindowPosition(0, 0);
	glutInitWindowSize(500, 500);
	glutCreateWindow("17341163_吴坎_CG_HW4");
	glClearColor(0, 0, 0, 0);
	glPointSize(5);
	glMatrixMode(GL_MODELVIEW);
	glLoadIdentity();
	gluOrtho2D(0, 500, 0, 500);
	glutDisplayFunc(display);
	glutMouseFunc(mouse);
	glutMainLoop();
}
```

### 编译指令

```bash
gcc bezier.c -o bezier.out -lGL -lGLU -lglut -lm
./bezier.out
```
