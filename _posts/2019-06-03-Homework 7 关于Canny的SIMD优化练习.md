---
title: Homework 7 关于Canny的SIMD优化练习
categories: 超级计算机原理与操作
---
[题目链接](https://easyhpc.org/problems/program/374/)

## 题目简述

针对经典的边缘检测Canny算子，使用串行代码按四个步骤实现其基本功能，再应用SIMD优化串行实现（可使用Intel IPP库），并且分析优化的思路和流程，最终给出实验结果（使用图表总结），考虑优化前后边缘检测算法性能和运行效率有哪些变化。

## 详细说明

### Canny算法

Canny是最早由John F. Canny在1986年提出的边缘检测算法，并沿用至今。
> Canny, John. "A computational approach to edge detection." Readings in Computer Vision. 1987. 184-203.

John F. Canny给出了评价边缘检测性能优劣的三个指标：

1. Good detection。即要使得标记真正边缘点的失误率和标记非边缘点的错误率尽量低。
2. Good localization。即检测出的边缘点要尽可能在实际边缘的中心；
3. Only one response to a single edge。当同一条边有多个响应时，仅能取其一作为标记。即数学上单个边缘产生多个响应的概率越低越好，并且尽量抑制图像噪声产生虚假边缘。

Canny算法是以上述三个指标为优化目标的求解问题的最优解，即在对图像中物体边缘敏感性的同时，也抑制或消除噪声的影响。其主要步骤如下：

1. Noise Reduction（可使用高斯滤波器去噪）
2. Finding Intensity Gradient of the Image（可在横纵轴分别用Sobal算子初步计算出两张梯度图，再最终计算出原图梯度的幅值和方向，其中方向最终近似到四个角度0, 45, 90, 135）
3. Non-maximum Suppression（边缘细化，使其更清晰）
4. Hysteresis Thresholding（最终使用双阈值来选择边缘像素，生成边缘检测结果）

### SIMD

SIMD全称Single Instruction Multiple Data，单指令多数据流，它已经成为Intel处理器的重要性能扩展。目前Intel处理器支持的SIMD技术包括MMX,SS,,AVX,AVX256,AVX512等。

MMX提供了8个64bit的寄存器进行SIMD操作，SSE系列提供了128bit的8个寄存器进行SIMD指令操作，而AVX指令则支持256/512bit的SIMD操作。

目前SIMD指令可以有多种方法进行使用，如下图所示，包括使用编译器的自动向量化（Auto-vectorization）支持、使用编译器指示符（compiler directive）、使用编译器的内建函数（intrinsic）和直接使用汇编语言编写汇编函数再从C++代码中调用汇编函数。

### 参考资料

- <http://agner.org/optimize/>
- <http://www.opencv.org.cn/opencvdoc/2.3.2/html/doc/-tutorials/imgproc/table_of_content_imgproc/table_of_content_imgproc.html>
- <http://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_imgproc/py_canny/py_canny.html>
- <http://marathon.csee.usf.edu/edge/edge_detection.html>
- <https://en.wikipedia.org/wiki/Canny_edge_detector>
- <http://matlabserver.cs.rug.nl/>

## 实验环境

### 软件

- Windows 10, 64-bit  (Build 17763) 10.0.17763
- Windows Subsystem for Linux [Ubuntu 18.04.2 LTS]：WSL是以软件的形式运行在Windows下的Linux子系统，是近些年微软推出来的新工具，可以在Windows系统上原生运行Linux。
- gcc version 7.3.0 (Ubuntu 7.3.0-27ubuntu1~18.04)：C语言程序编译器，Ubuntu自带的编译器。

大部分开发环境安装在WSL上，较之于双系统、虚拟机等其他开发方案，更加方便，也方便直接使用Linux下的一些指令。

### 硬件

所用机器型号为VAIO Z Flip 2016。

- [Intel(R) Core(TM) i7-6567U CPU @3.30GHZ 3.31GHz](https://ark.intel.com/content/www/cn/zh/ark/products/91167/intel-core-i7-6567u-processor-4m-cache-up-to-3-60-ghz.html)：2核心4线程，TDP 28W，支持的指令集扩展包括SSE4.1、SSE4.2、AVX2。
- 8.00GB RAM

## 实验过程

### 编译代码

```bash
$ gcc -o canny_edge canny_edge.c hysteresis.c pgm_io.c -lm -fopenmp -fopt-info -O3
canny_edge.c:439:3: note: loop vectorized
canny_edge.c:422:3: note: loop vectorized
canny_edge.c:422:3: note: loop versioned for vectorization because of possible aliasing
canny_edge.c:439:3: note: loop turned into
non-loop; it never loops.
canny_edge.c:439:3: note: loop with 7 iterations completely unrolled
canny_edge.c:422:3: note: loop turned into
non-loop; it never loops.
canny_edge.c:422:3: note: loop with 14 iterations completely unrolled
canny_edge.c:392:6: note: loop turned into
non-loop; it never loops.
canny_edge.c:392:6: note: loop with 7 iterations completely unrolled
canny_edge.c:560:2: note: loop vectorized
canny_edge.c:560:2: note: loop turned into
non-loop; it never loops.
canny_edge.c:560:2: note: loop with 6 iterations completely unrolled
canny_edge.c:536:6: note: loop turned into
non-loop; it never loops.
canny_edge.c:536:6: note: loop with 3 iterations completely unrolled
hysteresis.c:28:2: note: loop turned into non-loop; it never loops.
hysteresis.c:28:2: note: loop with 9 iterations completely unrolled
hysteresis.c:31:48: note: basic block vectorized
hysteresis.c:28:54: note: basic block vectorized
hysteresis.c:28:2: note: loop turned into non-loop; it never loops.
hysteresis.c:28:2: note: loop with 9 iterations completely unrolled
hysteresis.c:98:9: note: Loop 2 distributed: split to 1 loops and 1 library calls.
hysteresis.c:89:11: note: Loop 8 distributed: split to 0 loops and 1 library calls.
hysteresis.c:98:9: note: loop vectorized
hysteresis.c:78:7: note: loop vectorized
hysteresis.c:71:7: note: loop vectorized
hysteresis.c:63:10: note: loop vectorized
hysteresis.c:48:6: note: loop turned into non-loop; it never loops
hysteresis.c:48:6: note: loop turned into non-loop; it never loops.
hysteresis.c:48:6: note: loop with 2 iterations completely unrolled
hysteresis.c:48:6: note: loop turned into non-loop; it never loops
hysteresis.c:48:6: note: loop turned into non-loop; it never loops.
hysteresis.c:48:6: note: loop with 15 iterations completely unrolled
hysteresis.c:48:6: note: loop turned into non-loop; it never loops.
hysteresis.c:48:6: note: loop with 15 iterations completely unrolled
hysteresis.c:48:6: note: loop turned into non-loop; it never loops.
hysteresis.c:48:6: note: loop with 15 iterations completely unrolled
hysteresis.c:28:54: note: basic block vectorized
hysteresis.c:28:54: note: basic block vectorized
hysteresis.c:175:49: note: loop vectorized
hysteresis.c:172:46: note: loop vectorized
hysteresis.c:165:6: note: loop turned into
non-loop; it never loops.
hysteresis.c:165:6: note: loop with 15 iterations completely unrolled
hysteresis.c:165:6: note: loop turned into
non-loop; it never loops.
hysteresis.c:165:6: note: loop with 15 iterations completely unrolled
```

稍微解释一下某些编译参数。

- `-lm`，为正常使用`sqrt`函数，需要链接到数学库。
- `-fopenmp`，打开`openmp`的支持，因为在这里我是使用编译制导`#pragma omp simd`来将原来的算法`simd`化的。
- `-fopt-info`，显示被优化的部分。可以看到上面的输出中，很多循环和代码块被向量化了。
- `-O3`，启用空间换速度的代码优化。之所以要开启`O3`选项，是因为simd向量化通常是需要内存对齐的，因此会需要额外的空间。作为对比，关闭`-O3`的时候没有被向量化（没有输出），而只开到`-O2`的时候只有六个循环被向量化（`-O3`会将某些内部循环展开，使得更多的可被向量化的语句被发现）。此外，还有一个优化级别最高的`-Ofast`，经过测试，向量化语句的数量和`-O3`一样是14个，而这一级别的优化却可能会使得算法的输出不符合预期，因此没有选用。

### 将输入图片转码成pgm格式

由于实现的算法只支持pgm格式，需要先将输入文件转码：

```bash
ffmpeg -i MizunoAi.jpg MizunoAi.pgm
```

由于老师给的图片尺寸不够大，在我的机器上很难明显显示出并行化优化后加速的效果，这里我使用[waifu2x算法](https://wu-kan.github.io/posts/并行与分布式计算/并行与分布式计算-1)生成了一张`12000*6748`的图片作为测试。当然使用老师提供的图片也是可以正常运行的，只是优化的效果就不太明显了。

### 测试运行时间

使用`time`指令来测试运行时间，以下测试时间均为多次测试后得到的稳定时间。

根据原作者写的README和我自己的调参，发现当运行参数设置为`2.4 0.5 0.9`时有不错的运行效果。

#### -O3优化

```bash
$ time ./canny_edge MizunoAi.pgm 2.4 0.5 0.9

real    0m8.387s
user    0m7.125s
sys     0m1.203s
```

#### -O2优化

```bash
$ time ./canny_edge MizunoAi.pgm 2.4 0.5 0.9
real    0m9.052s
user    0m7.719s
sys     0m1.281s
```

#### -O1优化

```bash
$ time ./canny_edge MizunoAi.pgm 2.4 0.5 0.9
real    0m9.640s
user    0m8.266s
sys     0m1.234s
```

#### 无优化

```bash
$ time ./canny_edge MizunoAi.pgm 2.4 0.5 0.9
real    0m20.856s
user    0m19.469s
sys     0m1.250s
```

### 运行结果

将图片转化回png格式方便查看：

```bash
ffmpeg -i MizunoAi.pgm_s_2.40_l_0.50_h_0.90.pgm MizunoAi.png
```

下面对比算法的效果。

|`MizunoAi.jpg`|![`MizunoAi.jpg`](/public/image/2019-06-03-1.jpg)|
|-|-|
|`MizunoAi.png`|![`MizunoAi.png`](/public/image/2019-06-03-2.png)|

可以看到，从无优化到`-O1`优化这一段的提速是最多的。原因所在，我猜想是`-O1`优化的大部分其实是一些其他的优化，例如循环分支预测等。随着优化等级的提升，某些内嵌的循环被展开，就会有更多的语句块被编译器判断为可向量化，运行时间会有不断的减少。

## 源代码

### `canny_edge.c`

上层代码，接受运行参数。

```c
/*

## 个人信息
吴坎
中山大学数据科学与计算机学院
17级计算机科学技术（超级计算方向）
17341163
wukan3@mail2.sysu.edu.cn
## 简单说明
使用OpenMP的SIMD指令将原作者（见下）实现的Canny边缘检测的算法并行化。在原先的算法上去除了一些循环依赖，并加上了编译制导。
### 编译指令
`gcc -o canny_edge canny_edge.c hysteresis.c pgm_io.c -lm -fopenmp -fopt-info -O3`
### 使用说明
运行下述指令，可以运行并行化的边缘检测算法。参数的用法和原先串行版本相同，可以在下面或者代码中找到解释。

`./canny_edge <image> <sigma> <tlow> <thigh> [writedirim]`

可以阅读[我的这篇博客](https://wu-kan.github.io/posts/超级计算机原理与操作/Homework-7-关于Canny的SIMD优化练习)

*/

/*******************************************************************************
* --------------------------------------------
*(c) 2001 University of South Florida, Tampa
* Use, or copying without permission prohibited.
* PERMISSION TO USE
* In transmitting this software, permission to use for research and
* educational purposes is hereby granted.  This software may be copied for
* archival and backup purposes only.  This software may not be transmitted
* to a third party without prior permission of the copyright holder. This
* permission may be granted only by Mike Heath or Prof. Sudeep Sarkar of
* University of South Florida (sarkar@csee.usf.edu). Acknowledgment as
* appropriate is respectfully requested.
*
*  Heath, M., Sarkar, S., Sanocki, T., and Bowyer, K. Comparison of edge
*    detectors: a methodology and initial study, Computer Vision and Image
*    Understanding 69 (1), 38-54, January 1998.
*  Heath, M., Sarkar, S., Sanocki, T. and Bowyer, K.W. A Robust Visual
*    Method for Assessing the Relative Performance of Edge Detection
*    Algorithms, IEEE Transactions on Pattern Analysis and Machine
*    Intelligence 19 (12),  1338-1359, December 1997.
*  ------------------------------------------------------
*
* PROGRAM: canny_edge
* PURPOSE: This program implements a "Canny" edge detector. The processing
* steps are as follows:
*
*   1) Convolve the image with a separable gaussian filter.
*   2) Take the dx and dy the first derivatives using [-1,0,1] and [1,0,-1]'.
*   3) Compute the magnitude: sqrt(dx*dx+dy*dy).
*   4) Perform non-maximal suppression.
*   5) Perform hysteresis.
*
* The user must input three parameters. These are as follows:
*
*   sigma = The standard deviation of the gaussian smoothing filter.
*   tlow  = Specifies the low value to use in hysteresis. This is a
*           fraction (0-1) of the computed high threshold edge strength value.
*   thigh = Specifies the high value to use in hysteresis. This fraction (0-1)
*           specifies the percentage point in a histogram of the gradient of
*           the magnitude. Magnitude values of zero are not counted in the
*           histogram.
*
* NAME: Mike Heath
*       Computer Vision Laboratory
*       University of South Floeida
*       heath@csee.usf.edu
*
* DATE: 2/15/96
*
* Modified: 5/17/96 - To write out a floating point RAW headerless file of
*                     the edge gradient "up the edge" where the angle is
*                     defined in radians counterclockwise from the x direction.
*                     (Mike Heath)
*******************************************************************************/
#include <stdio.h>
#include <stdlib.h>
#include <math.h>
#include <omp.h>

#define VERBOSE 0
#define BOOSTBLURFACTOR 90.0

int read_pgm_image(char *infilename, unsigned char **image, int *rows, int *cols);
int write_pgm_image(char *outfilename, unsigned char *image, int rows, int cols, char *comment, int maxval);
void canny(unsigned char *image, int rows, int cols, float sigma, float tlow, float thigh, unsigned char **edge, char *fname);
void non_max_supp(short *mag, short *gradx, short *grady, int nrows, int ncols, unsigned char *result);
void gaussian_smooth(unsigned char *image, int rows, int cols, float sigma, short int **smoothedim);
void make_gaussian_kernel(float sigma, float **kernel, int *windowsize);
void derrivative_x_y(short int *smoothedim, int rows, int cols, short int **delta_x, short int **delta_y);
void magnitude_x_y(short int *delta_x, short int *delta_y, int rows, int cols, short int **magnitude);
void apply_hysteresis(short int *mag, unsigned char *nms, int rows, int cols, float tlow, float thigh, unsigned char *edge);
void radian_direction(short int *delta_x, short int *delta_y, int rows, int cols, float **dir_radians, int xdirtag, int ydirtag);
double angle_radians(double x, double y);

int main(int argc, char *argv[])
{
	char *infilename = NULL, /* Name of the input image */
		*dirfilename = NULL, /* Name of the output gradient direction image */
		outfilename[128],	/* Name of the output "edge" image */
		composedfname[128];  /* Name of the output "direction" image */
	unsigned char *image,	/* The input image */
		*edge;				 /* The output edge image */
	int rows, cols;			 /* The dimensions of the image. */
	float sigma,			 /* Standard deviation of the gaussian kernel. */
		tlow,				 /* Fraction of the high threshold in hysteresis. */
		thigh;				 /* High hysteresis threshold control. The actual
					  threshold is the (100 * thigh) percentage point
					  in the histogram of the magnitude of the
					  gradient image that passes non-maximal
					  suppression. */

	/****************************************************************************
* Get the command line arguments.
****************************************************************************/
	if (argc < 5)
	{
		fprintf(stderr,
				"<USAGE> %s image sigma tlow thigh [writedirim]\n\n"
				"      image:      An image to process. Must be in PGM format.\n"
				"      sigma:      Standard deviation of the gaussian blur kernel.\n"
				"      tlow:       Fraction (0.0-1.0) of the high edge strength threshold.\n"
				"      thigh:      Fraction (0.0-1.0) of the distribution of non-zero edge strengths for hysteresis. The fraction is used to compute the high edge strength threshold.\n"
				"      writedirim: Optional argument to output  a floating point  direction image.\n\n",
				argv[0]);
		exit(1);
	}

	infilename = argv[1];
	sigma = atof(argv[2]);
	tlow = atof(argv[3]);
	thigh = atof(argv[4]);

	if (argc >= 6)
		dirfilename = infilename;
	else
		dirfilename = NULL;

	/****************************************************************************
* Read in the image. This read function allocates memory for the image.
****************************************************************************/
	if (VERBOSE)
		printf("Reading the image %s.\n", infilename);
	if (read_pgm_image(infilename, &image, &rows, &cols) == 0)
	{
		fprintf(stderr, "Error reading the input image, %s.\n", infilename);
		exit(1);
	}

	/****************************************************************************
* Perform the edge detection. All of the work takes place here.
****************************************************************************/
	if (VERBOSE)
		printf("Starting Canny edge detection.\n");
	if (dirfilename != NULL)
	{
		sprintf(composedfname, "%s_s_%3.2f_l_%3.2f_h_%3.2f.fim", infilename,
				sigma, tlow, thigh);
		dirfilename = composedfname;
	}
	canny(image, rows, cols, sigma, tlow, thigh, &edge, dirfilename);
	/****************************************************************************
* Write out the edge image to a file.
****************************************************************************/
	sprintf(outfilename, "%s_s_%3.2f_l_%3.2f_h_%3.2f.pgm", infilename, sigma, tlow, thigh);
	if (VERBOSE)
		printf("Writing the edge iname in the file %s.\n", outfilename);
	if (write_pgm_image(outfilename, edge, rows, cols, "", 255) == 0)
	{
		fprintf(stderr, "Error writing the edge image, %s.\n", outfilename);
		exit(1);
	}
}

/*******************************************************************************
* PROCEDURE: canny
* PURPOSE: To perform canny edge detection.
* NAME: Mike Heath
* DATE: 2/15/96
*******************************************************************************/
void canny(unsigned char *image, int rows, int cols, float sigma, float tlow, float thigh, unsigned char **edge, char *fname)
{
	FILE *fpdir = NULL;	/* File to write the gradient image to.     */
	unsigned char *nms;	/* Points that are local maximal magnitude. */
	short int *smoothedim, /* The image after gaussian smoothing.      */
		*delta_x,		   /* The first devivative image, x-direction. */
		*delta_y,		   /* The first derivative image, y-direction. */
		*magnitude;		   /* The magnitude of the gadient image.      */
	int r, c, pos;
	float *dir_radians = NULL; /* Gradient direction image.                */

	/****************************************************************************
* Perform gaussian smoothing on the image using the input standard
* deviation.
****************************************************************************/
	if (VERBOSE)
		printf("Smoothing the image using a gaussian kernel.\n");
	gaussian_smooth(image, rows, cols, sigma, &smoothedim);

	/****************************************************************************
* Compute the first derivative in the x and y directions.
****************************************************************************/
	if (VERBOSE)
		printf("Computing the X and Y first derivatives.\n");
	derrivative_x_y(smoothedim, rows, cols, &delta_x, &delta_y);

	/****************************************************************************
* This option to write out the direction of the edge gradient was added
* to make the information available for computing an edge quality figure
* of merit.
****************************************************************************/
	if (fname != NULL)
	{
		/*************************************************************************
* Compute the direction up the gradient, in radians that are
* specified counteclockwise from the positive x-axis.
*************************************************************************/
		radian_direction(delta_x, delta_y, rows, cols, &dir_radians, -1, -1);

		/*************************************************************************
* Write the gradient direction image out to a file.
*************************************************************************/
		if ((fpdir = fopen(fname, "wb")) == NULL)
		{
			fprintf(stderr, "Error opening the file %s for writing.\n", fname);
			exit(1);
		}
		fwrite(dir_radians, sizeof(float), rows * cols, fpdir);
		fclose(fpdir);
		free(dir_radians);
	}

	/****************************************************************************
* Compute the magnitude of the gradient.
****************************************************************************/
	if (VERBOSE)
		printf("Computing the magnitude of the gradient.\n");
	magnitude_x_y(delta_x, delta_y, rows, cols, &magnitude);

	/****************************************************************************
* Perform non-maximal suppression.
****************************************************************************/
	if (VERBOSE)
		printf("Doing the non-maximal suppression.\n");
	if ((nms = (unsigned char *)calloc(rows * cols, sizeof(unsigned char))) == NULL)
	{
		fprintf(stderr, "Error allocating the nms image.\n");
		exit(1);
	}

	non_max_supp(magnitude, delta_x, delta_y, rows, cols, nms);

	/****************************************************************************
* Use hysteresis to mark the edge pixels.
****************************************************************************/
	if (VERBOSE)
		printf("Doing hysteresis thresholding.\n");
	if ((*edge = (unsigned char *)calloc(rows * cols, sizeof(unsigned char))) == NULL)
	{
		fprintf(stderr, "Error allocating the edge image.\n");
		exit(1);
	}

	apply_hysteresis(magnitude, nms, rows, cols, tlow, thigh, *edge);

	/****************************************************************************
* Free all of the memory that we allocated except for the edge image that
* is still being used to store out result.
****************************************************************************/
	free(smoothedim);
	free(delta_x);
	free(delta_y);
	free(magnitude);
	free(nms);
}

/*******************************************************************************
* Procedure: radian_direction
* Purpose: To compute a direction of the gradient image from component dx and
* dy images. Because not all derriviatives are computed in the same way, this
* code allows for dx or dy to have been calculated in different ways.
*
* FOR X:  xdirtag = -1  for  [-1 0  1]
*         xdirtag =  1  for  [ 1 0 -1]
*
* FOR Y:  ydirtag = -1  for  [-1 0  1]'
*         ydirtag =  1  for  [ 1 0 -1]'
*
* The resulting angle is in radians measured counterclockwise from the
* xdirection. The angle points "up the gradient".
*******************************************************************************/
void radian_direction(short int *delta_x, short int *delta_y, int rows,
					  int cols, float **dir_radians, int xdirtag, int ydirtag)
{
	float *dirim = NULL;

	/****************************************************************************
* Allocate an image to store the direction of the gradient.
****************************************************************************/
	if ((dirim = (float *)calloc(rows * cols, sizeof(float))) == NULL)
	{
		fprintf(stderr, "Error allocating the gradient direction image.\n");
		exit(1);
	}
	*dir_radians = dirim;

#pragma omp simd
	for (int pos = 0; pos < rows * cols; ++pos)
	{
		double dx = (double)delta_x[pos];
		double dy = (double)delta_y[pos];

		if (xdirtag == 1)
			dx = -dx;
		if (ydirtag == -1)
			dy = -dy;

		dirim[pos] = (float)angle_radians(dx, dy);
	}
}

/*******************************************************************************
* FUNCTION: angle_radians
* PURPOSE: This procedure computes the angle of a vector with components x and
* y. It returns this angle in radians with the answer being in the range
* 0 <= angle <2*PI.
*******************************************************************************/
double angle_radians(double x, double y)
{
	double xu, yu, ang;

	xu = fabs(x);
	yu = fabs(y);

	if ((xu == 0) && (yu == 0))
		return (0);

	ang = atan(yu / xu);

	if (x >= 0)
	{
		if (y >= 0)
			return (ang);
		return (2 * acos(-1) - ang);
	}
	if (y >= 0)
		return (acos(-1) - ang);
	return (acos(-1) + ang);
}

/*******************************************************************************
* PROCEDURE: magnitude_x_y
* PURPOSE: Compute the magnitude of the gradient. This is the square root of
* the sum of the squared derivative values.
* NAME: Mike Heath
* DATE: 2/15/96
*******************************************************************************/
void magnitude_x_y(short int *delta_x, short int *delta_y, int rows, int cols,
				   short int **magnitude)
{

	/****************************************************************************
* Allocate an image to store the magnitude of the gradient.
****************************************************************************/
	if ((*magnitude = (short *)calloc(rows * cols, sizeof(short))) == NULL)
	{
		fprintf(stderr, "Error allocating the magnitude image.\n");
		exit(1);
	}

#pragma omp simd
	for (int pos = 0; pos < rows * cols; ++pos)
	{
		int sq1 = (int)delta_x[pos] * (int)delta_x[pos];
		int sq2 = (int)delta_y[pos] * (int)delta_y[pos];
		(*magnitude)[pos] = (short)(0.5 + sqrt((float)sq1 + (float)sq2));
	}
}

/*******************************************************************************
* PROCEDURE: derrivative_x_y
* PURPOSE: Compute the first derivative of the image in both the x any y
* directions. The differential filters that are used are:
*
*                                          -1
*         dx =  -1 0 +1     and       dy =  0
*                                          +1
*
* NAME: Mike Heath
* DATE: 2/15/96
*******************************************************************************/
void derrivative_x_y(short int *smoothedim, int rows, int cols,
					 short int **delta_x, short int **delta_y)
{

	/****************************************************************************
* Allocate images to store the derivatives.
****************************************************************************/
	if (((*delta_x) = (short *)calloc(rows * cols, sizeof(short))) == NULL)
	{
		fprintf(stderr, "Error allocating the delta_x image.\n");
		exit(1);
	}
	if (((*delta_y) = (short *)calloc(rows * cols, sizeof(short))) == NULL)
	{
		fprintf(stderr, "Error allocating the delta_x image.\n");
		exit(1);
	}

	/****************************************************************************
* Compute the x-derivative. Adjust the derivative at the borders to avoid
* losing pixels.
****************************************************************************/
	if (VERBOSE)
		printf("   Computing the X-direction derivative.\n");
#pragma omp simd
	for (int r = 0; r < rows; r++)
	{
		int pos = r * cols;
		(*delta_x)[pos] = smoothedim[pos + 1] - smoothedim[pos];
		pos++;
		for (int c = 1; c < (cols - 1); c++, pos++)
			(*delta_x)[pos] = smoothedim[pos + 1] - smoothedim[pos - 1];
		(*delta_x)[pos] = smoothedim[pos] - smoothedim[pos - 1];
	}

	/****************************************************************************
* Compute the y-derivative. Adjust the derivative at the borders to avoid
* losing pixels.
****************************************************************************/
	if (VERBOSE)
		printf("   Computing the Y-direction derivative.\n");
#pragma omp simd
	for (int c = 0; c < cols; c++)
	{
		int pos = c;
		(*delta_y)[pos] = smoothedim[pos + cols] - smoothedim[pos];
		pos += cols;
		for (int r = 1; r < (rows - 1); r++, pos += cols)
		{
			(*delta_y)[pos] = smoothedim[pos + cols] - smoothedim[pos - cols];
		}
		(*delta_y)[pos] = smoothedim[pos] - smoothedim[pos - cols];
	}
}

/*******************************************************************************
* PROCEDURE: gaussian_smooth
* PURPOSE: Blur an image with a gaussian filter.
* NAME: Mike Heath
* DATE: 2/15/96
*******************************************************************************/
void gaussian_smooth(unsigned char *image, int rows, int cols, float sigma,
					 short int **smoothedim)
{
	int windowsize, /* Dimension of the gaussian kernel. */
		center;		/* Half of the windowsize. */
	float *tempim,  /* Buffer for separable filter gaussian smoothing. */
		*kernel;	/* A one dimensional gaussian kernel. */

	/****************************************************************************
* Create a 1-dimensional gaussian smoothing kernel.
****************************************************************************/
	if (VERBOSE)
		printf("   Computing the gaussian smoothing kernel.\n");
	make_gaussian_kernel(sigma, &kernel, &windowsize);
	center = windowsize / 2;

	/****************************************************************************
* Allocate a temporary buffer image and the smoothed image.
****************************************************************************/
	if ((tempim = (float *)calloc(rows * cols, sizeof(float))) == NULL)
	{
		fprintf(stderr, "Error allocating the buffer image.\n");
		exit(1);
	}
	if (((*smoothedim) = (short int *)calloc(rows * cols,
											 sizeof(short int))) == NULL)
	{
		fprintf(stderr, "Error allocating the smoothed image.\n");
		exit(1);
	}

	/****************************************************************************
* Blur in the x - direction.
****************************************************************************/
	if (VERBOSE)
		printf("   Bluring the image in the X-direction.\n");
#pragma omp simd
	for (int r = 0; r < rows; r++)
		for (int c = 0; c < cols; c++)
		{
			float dot = 0.0, sum = 0.0;
			for (int cc = (-center); cc <= center; cc++)
			{
				if (((c + cc) >= 0) && ((c + cc) < cols))
				{
					dot += (float)image[r * cols + (c + cc)] * kernel[center + cc];
					sum += kernel[center + cc];
				}
			}
			tempim[r * cols + c] = dot / sum;
		}

	/****************************************************************************
* Blur in the y - direction.
****************************************************************************/
	if (VERBOSE)
		printf("   Bluring the image in the Y-direction.\n");
#pragma omp simd
	for (int c = 0; c < cols; c++)
		for (int r = 0; r < rows; r++)
		{
			float sum = 0.0, dot = 0.0;
			for (int rr = (-center); rr <= center; rr++)
			{
				if (((r + rr) >= 0) && ((r + rr) < rows))
				{
					dot += tempim[(r + rr) * cols + c] * kernel[center + rr];
					sum += kernel[center + rr];
				}
			}
			(*smoothedim)[r * cols + c] = (short int)(dot * BOOSTBLURFACTOR / sum + 0.5);
		}

	free(tempim);
	free(kernel);
}

/*******************************************************************************
* PROCEDURE: make_gaussian_kernel
* PURPOSE: Create a one dimensional gaussian kernel.
* NAME: Mike Heath
* DATE: 2/15/96
*******************************************************************************/
void make_gaussian_kernel(float sigma, float **kernel, int *windowsize)
{
	int center;
	float x, fx, sum = 0.0;

	*windowsize = 1 + 2 * ceil(2.5 * sigma);
	center = (*windowsize) / 2;

	if (VERBOSE)
		printf("      The kernel has %d elements.\n", *windowsize);
	if ((*kernel = (float *)calloc((*windowsize), sizeof(float))) == NULL)
	{
		fprintf(stderr, "Error callocing the gaussian kernel array.\n");
		exit(1);
	}

	for (int i = 0; i < (*windowsize); i++)
	{
		x = (float)(i - center);
		fx = pow(2.71828, -0.5 * x * x / (sigma * sigma)) / (sigma * sqrt(6.2831853));
		(*kernel)[i] = fx;
		sum += fx;
	}

	for (int i = 0; i < (*windowsize); i++)
		(*kernel)[i] /= sum;

	if (VERBOSE)
	{
		printf("The filter coefficients are:\n");
		for (int i = 0; i < (*windowsize); i++)
			printf("kernel[%d] = %f\n", i, (*kernel)[i]);
	}
}
```

### hysteresis.c

```c
//并行化(6/10/19)：在原先的算法上去除了一些循环依赖，并加上了OpenMP编译制导。

/*******************************************************************************
* FILE: hysteresis.c
* This code was re-written by Mike Heath from original code obtained indirectly
* from Michigan State University. heath@csee.usf.edu (Re-written in 1996).
*******************************************************************************/

#include <stdio.h>
#include <stdlib.h>

#define VERBOSE 0

#define NOEDGE 255
#define POSSIBLE_EDGE 128
#define EDGE 0

/*******************************************************************************
* PROCEDURE: follow_edges
* PURPOSE: This procedure edges is a recursive routine that traces edgs along
* all paths whose magnitude values remain above some specifyable lower
* threshhold.
* NAME: Mike Heath
* DATE: 2/15/96
*******************************************************************************/
void follow_edges(unsigned char *edgemapptr, short *edgemagptr, short lowval, int cols)
{
	for (int i = 0, x[8] = {1, 1, 0, -1, -1, -1, 0, 1}, y[8] = {0, 1, 1, 1, 0, -1, -1, -1}; i < 8; ++i)
	{
		unsigned char *tempmapptr = edgemapptr - y[i] * cols + x[i];
		short *tempmagptr = edgemagptr - y[i] * cols + x[i];
		if ((*tempmapptr == POSSIBLE_EDGE) && (*tempmagptr > lowval))
		{
			*tempmapptr = (unsigned char)EDGE;
			follow_edges(tempmapptr, tempmagptr, lowval, cols);
		}
	}
}

/*******************************************************************************
* PROCEDURE: apply_hysteresis
* PURPOSE: This routine finds edges that are above some high threshhold or
* are connected to a high pixel by a path of pixels greater than a low
* threshold.
* NAME: Mike Heath
* DATE: 2/15/96
*******************************************************************************/
void apply_hysteresis(short int *mag, unsigned char *nms, int rows, int cols, float tlow, float thigh, unsigned char *edge)
{
	int numedges = 0, lowcount, highcount, lowthreshold, highthreshold, hist[32768];
	short int maximum_mag, sumpix;

/****************************************************************************
* Initialize the edge map to possible edges everywhere the non-maximal
* suppression suggested there could be an edge except for the border. At
* the border we say there can not be an edge because it makes the
* follow_edges algorithm more efficient to not worry about tracking an
* edge off the side of the image.
****************************************************************************/
#pragma omp simd
	for (int pos = 0; pos < rows * cols; ++pos)
	{
		if (nms[pos] == POSSIBLE_EDGE)
			edge[pos] = POSSIBLE_EDGE;
		else
			edge[pos] = NOEDGE;
	}
#pragma omp simd
	for (int r = 0; r < rows; r++)
	{
		int pos = r * cols;
		edge[pos] = NOEDGE;
		edge[pos + cols - 1] = NOEDGE;
	}
#pragma omp simd
	for (int c = 0; c < cols; c++)
	{
		int pos = (rows - 1) * cols + c;
		edge[c] = NOEDGE;
		edge[pos] = NOEDGE;
	}

/****************************************************************************
* Compute the histogram of the magnitude image. Then use the histogram to
* compute hysteresis thresholds.
****************************************************************************/
#pragma omp simd
	for (int r = 0; r < 32768; r++)
		hist[r] = 0;

	for (int pos = 0; pos < rows * cols; ++pos)
		if (edge[pos] == POSSIBLE_EDGE)
			++hist[mag[pos]]; //这里不可以向量化，可能会访问到同一块地址

/****************************************************************************
* Compute the number of pixels that passed the nonmaximal suppression.
****************************************************************************/
#pragma omp simd reduction(+                         \
						   : numedges) reduction(max \
												 : maximum_mag)
	for (int r = 1; r < 32768; ++r)
		if (hist[r])
		{
			maximum_mag = r;
			numedges += hist[r];
		}

	highcount = (int)(numedges * thigh + 0.5);

	/****************************************************************************
* Compute the high threshold value as the (100 * thigh) percentage point
* in the magnitude of the gradient histogram of all the pixels that passes
* non-maximal suppression. Then calculate the low threshold as a fraction
* of the computed high threshold value. John Canny said in his paper
* "A Computational Approach to Edge Detection" that "The ratio of the
* high to low threshold in the implementation is in the range two or three
* to one." That means that in terms of this implementation, we should
* choose tlow ~= 0.5 or 0.33333.
****************************************************************************/
	highthreshold = 1;
	numedges = hist[1];
	while ((highthreshold < (maximum_mag - 1)) && (numedges < highcount))
	{
		highthreshold++;
		numedges += hist[highthreshold];
	}
	lowthreshold = (int)(highthreshold * tlow + 0.5);

	if (VERBOSE)
	{
		printf("The input low and high fractions of %f and %f computed to\n",
			   tlow, thigh);
		printf("magnitude of the gradient threshold values of: %d %d\n",
			   lowthreshold, highthreshold);
	}

/****************************************************************************
* This loop looks for pixels above the highthreshold to locate edges and
* then calls follow_edges to continue the edge.
****************************************************************************/
#pragma omp simd
	for (int pos = 0; pos < rows * cols; ++pos)
		if ((edge[pos] == POSSIBLE_EDGE) && (mag[pos] >= highthreshold))
		{
			edge[pos] = EDGE;
			follow_edges((edge + pos), (mag + pos), lowthreshold, cols);
		}

/****************************************************************************
* Set all the remaining possible edges to non-edges.
****************************************************************************/
#pragma omp simd
	for (int pos = 0; pos < rows * cols; ++pos)
		if (edge[pos] != EDGE)
			edge[pos] = NOEDGE;
}

/*******************************************************************************
* PROCEDURE: non_max_supp
* PURPOSE: This routine applies non-maximal suppression to the magnitude of
* the gradient image.
* NAME: Mike Heath
* DATE: 2/15/96
*******************************************************************************/
void non_max_supp(short *mag, short *gradx, short *grady, int nrows, int ncols, unsigned char *result)
{
/****************************************************************************
* Zero the edges of the result image.
****************************************************************************/
#pragma omp simd
	for (int count = 0; count < ncols; count++)
		result[count] = result[ncols * (nrows - 1) + count] = 0;
#pragma omp simd
	for (int count = 0; count < nrows; count++)
		result[ncols * count] = result[ncols * (count + 1) - 1] = 0;

/****************************************************************************
* Suppress non-maximum points.
****************************************************************************/
#pragma omp simd
	for (int rowcount = 1; rowcount < nrows - 2; rowcount++)
	{
		short *magrowptr = mag + ncols * rowcount + 1,
			  *gxrowptr = gradx + ncols * rowcount + 1,
			  *gyrowptr = grady + ncols * rowcount + 1,
			  *magptr = magrowptr,
			  *gxptr = gxrowptr,
			  *gyptr = gyrowptr;

		unsigned char *resultrowptr = result + ncols * rowcount + 1,
					  *resultptr = resultrowptr;
		for (int colcount = 1;
			 colcount < ncols - 2;
			 colcount++, magptr++, gxptr++, gyptr++, resultptr++)
		{
			short z1, z2;
			short m00, gx, gy;
			float mag1, mag2, xperp, yperp;
			m00 = *magptr;
			if (m00 == 0)
			{
				*resultptr = (unsigned char)NOEDGE;
			}
			else
			{
				xperp = -(gx = *gxptr) / ((float)m00);
				yperp = (gy = *gyptr) / ((float)m00);
			}

			if (gx >= 0)
			{
				if (gy >= 0)
				{
					if (gx >= gy)
					{
						/* 111 */
						/* Left point */
						z1 = *(magptr - 1);
						z2 = *(magptr - ncols - 1);

						mag1 = (m00 - z1) * xperp + (z2 - z1) * yperp;

						/* Right point */
						z1 = *(magptr + 1);
						z2 = *(magptr + ncols + 1);

						mag2 = (m00 - z1) * xperp + (z2 - z1) * yperp;
					}
					else
					{
						/* 110 */
						/* Left point */
						z1 = *(magptr - ncols);
						z2 = *(magptr - ncols - 1);

						mag1 = (z1 - z2) * xperp + (z1 - m00) * yperp;

						/* Right point */
						z1 = *(magptr + ncols);
						z2 = *(magptr + ncols + 1);

						mag2 = (z1 - z2) * xperp + (z1 - m00) * yperp;
					}
				}
				else
				{
					if (gx >= -gy)
					{
						/* 101 */
						/* Left point */
						z1 = *(magptr - 1);
						z2 = *(magptr + ncols - 1);

						mag1 = (m00 - z1) * xperp + (z1 - z2) * yperp;

						/* Right point */
						z1 = *(magptr + 1);
						z2 = *(magptr - ncols + 1);

						mag2 = (m00 - z1) * xperp + (z1 - z2) * yperp;
					}
					else
					{
						/* 100 */
						/* Left point */
						z1 = *(magptr + ncols);
						z2 = *(magptr + ncols - 1);

						mag1 = (z1 - z2) * xperp + (m00 - z1) * yperp;

						/* Right point */
						z1 = *(magptr - ncols);
						z2 = *(magptr - ncols + 1);

						mag2 = (z1 - z2) * xperp + (m00 - z1) * yperp;
					}
				}
			}
			else
			{
				if ((gy = *gyptr) >= 0)
				{
					if (-gx >= gy)
					{
						/* 011 */
						/* Left point */
						z1 = *(magptr + 1);
						z2 = *(magptr - ncols + 1);

						mag1 = (z1 - m00) * xperp + (z2 - z1) * yperp;

						/* Right point */
						z1 = *(magptr - 1);
						z2 = *(magptr + ncols - 1);

						mag2 = (z1 - m00) * xperp + (z2 - z1) * yperp;
					}
					else
					{
						/* 010 */
						/* Left point */
						z1 = *(magptr - ncols);
						z2 = *(magptr - ncols + 1);

						mag1 = (z2 - z1) * xperp + (z1 - m00) * yperp;

						/* Right point */
						z1 = *(magptr + ncols);
						z2 = *(magptr + ncols - 1);

						mag2 = (z2 - z1) * xperp + (z1 - m00) * yperp;
					}
				}
				else
				{
					if (-gx > -gy)
					{
						/* 001 */
						/* Left point */
						z1 = *(magptr + 1);
						z2 = *(magptr + ncols + 1);

						mag1 = (z1 - m00) * xperp + (z1 - z2) * yperp;

						/* Right point */
						z1 = *(magptr - 1);
						z2 = *(magptr - ncols - 1);

						mag2 = (z1 - m00) * xperp + (z1 - z2) * yperp;
					}
					else
					{
						/* 000 */
						/* Left point */
						z1 = *(magptr + ncols);
						z2 = *(magptr + ncols + 1);

						mag1 = (z2 - z1) * xperp + (m00 - z1) * yperp;

						/* Right point */
						z1 = *(magptr - ncols);
						z2 = *(magptr - ncols - 1);

						mag2 = (z2 - z1) * xperp + (m00 - z1) * yperp;
					}
				}
			}

			/* Now determine if the current point is a maximum point */

			if ((mag1 > 0.0) || (mag2 > 0.0))
			{
				*resultptr = (unsigned char)NOEDGE;
			}
			else
			{
				if (mag2 == 0.0)
					*resultptr = (unsigned char)NOEDGE;
				else
					*resultptr = (unsigned char)POSSIBLE_EDGE;
			}
		}
	}
}
```

### pgm_io.c

读pgm格式图片的库，没有在原来的基础上变动。

```c
/*******************************************************************************
* FILE: pgm_io.c
* This code was written by Mike Heath. heath@csee.usf.edu (in 1995).
*******************************************************************************/

#include <stdio.h>
#include <stdlib.h>
#include <string.h>

/******************************************************************************
* Function: read_pgm_image
* Purpose: This function reads in an image in PGM format. The image can be
* read in from either a file or from standard input. The image is only read
* from standard input when infilename = NULL. Because the PGM format includes
* the number of columns and the number of rows in the image, these are read
* from the file. Memory to store the image is allocated in this function.
* All comments in the header are discarded in the process of reading the
* image. Upon failure, this function returns 0, upon sucess it returns 1.
******************************************************************************/
int read_pgm_image(char *infilename, unsigned char **image, int *rows, int *cols)
{
	FILE *fp;
	char buf[71];

	/***************************************************************************
	* Open the input image file for reading if a filename was given. If no
	* filename was provided, set fp to read from standard input.
	***************************************************************************/
	if (infilename == NULL)
		fp = stdin;
	else
	{
		if ((fp = fopen(infilename, "r")) == NULL)
		{
			fprintf(stderr, "Error reading the file %s in read_pgm_image().\n",
					infilename);
			return (0);
		}
	}

	/***************************************************************************
	* Verify that the image is in PGM format, read in the number of columns
	* and rows in the image and scan past all of the header information.
	***************************************************************************/
	fgets(buf, 70, fp);
	if (strncmp(buf, "P5", 2) != 0)
	{
		fprintf(stderr, "The file %s is not in PGM format in ", infilename);
		fprintf(stderr, "read_pgm_image().\n");
		if (fp != stdin)
			fclose(fp);
		return (0);
	}
	do
	{
		fgets(buf, 70, fp);
	} while (buf[0] == '#'); /* skip all comment lines */
	sscanf(buf, "%d %d", cols, rows);
	do
	{
		fgets(buf, 70, fp);
	} while (buf[0] == '#'); /* skip all comment lines */

	/***************************************************************************
	* Allocate memory to store the image then read the image from the file.
	***************************************************************************/
	if (((*image) = (unsigned char *)malloc((*rows) * (*cols))) == NULL)
	{
		fprintf(stderr, "Memory allocation failure in read_pgm_image().\n");
		if (fp != stdin)
			fclose(fp);
		return (0);
	}
	if ((*rows) != fread((*image), (*cols), (*rows), fp))
	{
		fprintf(stderr, "Error reading the image data in read_pgm_image().\n");
		if (fp != stdin)
			fclose(fp);
		free((*image));
		return (0);
	}

	if (fp != stdin)
		fclose(fp);
	return (1);
}

/******************************************************************************
* Function: write_pgm_image
* Purpose: This function writes an image in PGM format. The file is either
* written to the file specified by outfilename or to standard output if
* outfilename = NULL. A comment can be written to the header if coment != NULL.
******************************************************************************/
int write_pgm_image(char *outfilename, unsigned char *image, int rows, int cols, char *comment, int maxval)
{
	FILE *fp;

	/***************************************************************************
	* Open the output image file for writing if a filename was given. If no
	* filename was provided, set fp to write to standard output.
	***************************************************************************/
	if (outfilename == NULL)
		fp = stdout;
	else
	{
		if ((fp = fopen(outfilename, "w")) == NULL)
		{
			fprintf(stderr, "Error writing the file %s in write_pgm_image().\n",
					outfilename);
			return (0);
		}
	}

	/***************************************************************************
	* Write the header information to the PGM file.
	***************************************************************************/
	fprintf(fp, "P5\n%d %d\n", cols, rows);
	if (comment != NULL)
		if (strlen(comment) <= 70)
			fprintf(fp, "# %s\n", comment);
	fprintf(fp, "%d\n", maxval);

	/***************************************************************************
	* Write the image data to the file.
	***************************************************************************/
	if (rows != fwrite(image, cols, rows, fp))
	{
		fprintf(stderr, "Error writing the image data in write_pgm_image().\n");
		if (fp != stdout)
			fclose(fp);
		return (0);
	}

	if (fp != stdout)
		fclose(fp);
	return (1);
}

/******************************************************************************
* Function: read_ppm_image
* Purpose: This function reads in an image in PPM format. The image can be
* read in from either a file or from standard input. The image is only read
* from standard input when infilename = NULL. Because the PPM format includes
* the number of columns and the number of rows in the image, these are read
* from the file. Memory to store the image is allocated in this function.
* All comments in the header are discarded in the process of reading the
* image. Upon failure, this function returns 0, upon sucess it returns 1.
******************************************************************************/
int read_ppm_image(char *infilename, unsigned char **image_red, unsigned char **image_grn, unsigned char **image_blu, int *rows, int *cols)
{
	FILE *fp;
	char buf[71];
	int p, size;

	/***************************************************************************
	* Open the input image file for reading if a filename was given. If no
	* filename was provided, set fp to read from standard input.
	***************************************************************************/
	if (infilename == NULL)
		fp = stdin;
	else
	{
		if ((fp = fopen(infilename, "r")) == NULL)
		{
			fprintf(stderr, "Error reading the file %s in read_ppm_image().\n",
					infilename);
			return (0);
		}
	}

	/***************************************************************************
	* Verify that the image is in PPM format, read in the number of columns
	* and rows in the image and scan past all of the header information.
	***************************************************************************/
	fgets(buf, 70, fp);
	if (strncmp(buf, "P6", 2) != 0)
	{
		fprintf(stderr, "The file %s is not in PPM format in ", infilename);
		fprintf(stderr, "read_ppm_image().\n");
		if (fp != stdin)
			fclose(fp);
		return (0);
	}
	do
	{
		fgets(buf, 70, fp);
	} while (buf[0] == '#'); /* skip all comment lines */
	sscanf(buf, "%d %d", cols, rows);
	do
	{
		fgets(buf, 70, fp);
	} while (buf[0] == '#'); /* skip all comment lines */

	/***************************************************************************
	* Allocate memory to store the image then read the image from the file.
	***************************************************************************/
	if (((*image_red) = (unsigned char *)malloc((*rows) * (*cols))) == NULL)
	{
		fprintf(stderr, "Memory allocation failure in read_ppm_image().\n");
		if (fp != stdin)
			fclose(fp);
		return (0);
	}
	if (((*image_grn) = (unsigned char *)malloc((*rows) * (*cols))) == NULL)
	{
		fprintf(stderr, "Memory allocation failure in read_ppm_image().\n");
		if (fp != stdin)
			fclose(fp);
		return (0);
	}
	if (((*image_blu) = (unsigned char *)malloc((*rows) * (*cols))) == NULL)
	{
		fprintf(stderr, "Memory allocation failure in read_ppm_image().\n");
		if (fp != stdin)
			fclose(fp);
		return (0);
	}

	size = (*rows) * (*cols);
	for (p = 0; p < size; p++)
	{
		(*image_red)[p] = (unsigned char)fgetc(fp);
		(*image_grn)[p] = (unsigned char)fgetc(fp);
		(*image_blu)[p] = (unsigned char)fgetc(fp);
	}

	if (fp != stdin)
		fclose(fp);
	return (1);
}

/******************************************************************************
* Function: write_ppm_image
* Purpose: This function writes an image in PPM format. The file is either
* written to the file specified by outfilename or to standard output if
* outfilename = NULL. A comment can be written to the header if coment != NULL.
******************************************************************************/
int write_ppm_image(char *outfilename, unsigned char *image_red, unsigned char *image_grn, unsigned char *image_blu, int rows, int cols, char *comment, int maxval)
{
	FILE *fp;
	long size, p;

	/***************************************************************************
	* Open the output image file for writing if a filename was given. If no
	* filename was provided, set fp to write to standard output.
	***************************************************************************/
	if (outfilename == NULL)
		fp = stdout;
	else
	{
		if ((fp = fopen(outfilename, "w")) == NULL)
		{
			fprintf(stderr, "Error writing the file %s in write_pgm_image().\n",
					outfilename);
			return (0);
		}
	}

	/***************************************************************************
	* Write the header information to the PGM file.
	***************************************************************************/
	fprintf(fp, "P6\n%d %d\n", cols, rows);
	if (comment != NULL)
		if (strlen(comment) <= 70)
			fprintf(fp, "# %s\n", comment);
	fprintf(fp, "%d\n", maxval);

	/***************************************************************************
	* Write the image data to the file.
	***************************************************************************/
	size = (long)rows * (long)cols;
	for (p = 0; p < size; p++)
	{ /* Write the image in pixel interleaved format. */
		fputc(image_red[p], fp);
		fputc(image_grn[p], fp);
		fputc(image_blu[p], fp);
	}

	if (fp != stdout)
		fclose(fp);
	return (1);
}
```
