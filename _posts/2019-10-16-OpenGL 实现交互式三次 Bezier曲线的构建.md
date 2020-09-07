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

![1]

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

[1]: data:image/webp;base64,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
