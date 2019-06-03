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

### 实验结果示例
![](/public/image/2019-06-03-1.png)

Canny串行实现示例C语言代码：
示例见附件。其中示例代码包含两个实现项目，实现步骤一致但具体使用的工具有区别；测试图片则包含各种格式的图片，而示例中的图片输入均为pgm格式，如果需要自行测试可使用在线转换工具。
参考资料：
http://agner.org/optimize/
http://www.opencv.org.cn/opencvdoc/2.3.2/html/doc/tutorials/imgproc/table_of_content_imgproc/table_of_content_imgproc.html
http://opencv-python-tutroals.readthedocs.io/en/latest/py_tutorials/py_imgproc/py_canny/py_canny.html
http://marathon.csee.usf.edu/edge/edge_detection.html
https://en.wikipedia.org/wiki/Canny_edge_detector
http://matlabserver.cs.rug.nl/

## 实验过程
### [安装IPP库](https://software.intel.com/zh-cn/articles/installing-intel-free-libs-and-python-apt-repo)
[官方网站](https://software.intel.com/zh-cn/intel-ipp)

[安装向导](https://software.intel.com/zh-cn/articles/intel-integrated-performance-primitives-intel-ipp-install-guide)
```bash
tar -zxvf l_ipp_2019.4.243_online.tgz
```

```bash
./ippvars.sh -arch intel64 -platform linux
```

```bash
wget https://apt.repos.intel.com/intel-gpg-keys/GPG-PUB-KEY-INTEL-SW-PRODUCTS-2019.PUB
sudo apt-key add GPG-PUB-KEY-INTEL-SW-PRODUCTS-2019.PUB
sudo sh -c 'echo deb https://apt.repos.intel.com/ipp all main > /etc/apt/sources.list.d/intel-ipp.list'
sudo apt-get update
sudo apt-get install intel-ipp-64bit-2019.4-070
```
