---
title: Deep Learning
tags:
  - 人工智能
---

## Convolutional Neural Networks (CNNs / ConvNets)

- Chinese version: <https://www.zybuluo.com/hanbingtao/note/485480>
- English version: <http://cs231n.github.io/convolutional-networks/#layers>

### Architecture Overview

Regular Neural Nets don’t scale well to full images. In CIFAR-10, images are only of size $32\times 32\times 3$ (32 wide, 32 high, 3 color channels), so a single fully-connected neuron in a first hidden layer of a regular Neural Network would have $32*32*3$ = 3072 weights. This amount still seems manageable, but clearly this fully-connected structure does not scale to larger images. For example, an image of more respectable size, e.g. $200\times 200\times 3$, would lead to neurons that have 200\*200\*3 = 120,000 weights. Moreover, we would almost certainly want to have several such neurons, so the parameters would add up quickly! Clearly, this full connectivity is wasteful and the huge number of parameters would quickly lead to overfitting.

Convolutional Neural Networks take advantage of the fact that the input consists of images and they constrain the architecture in a more sensible way. In particular, unlike a regular Neural Network, the layers of a ConvNet have neurons arranged in 3 dimensions: width, height, depth. (Note that the word depth here refers to the third dimension of an activation volume, not to the depth of a full Neural Network, which can refer to the total number of layers in a network.) For example, the input images in CIFAR-10 are an input volume of activations, and the volume has dimensions $32\times 32\times 3$ (width, height, depth respectively). As we will soon see, the neurons in a layer will only be connected to a small region of the layer before it, instead of all of the neurons in a fully-connected manner. Moreover, the final output layer would for CIFAR-10 have dimensions $1\times 1\times 10$, because by the end of the ConvNet architecture we will reduce the full image into a single vector of class scores, arranged along the depth dimension. Here is a visualization:

![常规三层神经网络](http://cs231n.github.io/assets/nn1/neural_net2.jpeg)

A regular 3-layer Neural Network

![ConvNet](http://cs231n.github.io/assets/cnn/cnn.jpeg)

A ConvNet arranges its neurons in three dimensions (width, height, depth), as visualized in one of the layers. Every layer of a ConvNet transforms the 3D input volume to a 3D output volume of neuron activations. In this example, the red input layer holds the image, so its width and height would be the dimensions of the image, and the depth would be 3 (Red, Green, Blue channels)

### Layers used to build ConvNets

A simple ConvNet is a sequence of layers, and every layer of a ConvNet transforms one volume of activations to another through a differentiable function. We use three main types of layers to build ConvNet architectures: **Convolutional Layer**, **Pooling Layer**, and **Fully-Connected Layer** (exactly as seen in regular Neural Networks). We will stack these layers to form a full ConvNet architecture.

![CNN](http://upload-images.jianshu.io/upload_images/2256672-a36210f89c7164a7.png)

_Example Architecture_: Overview. We will go into more details below, but a simple ConvNet for CIFAR-10 classification could have the architecture [**INPUT - CONV - RELU - POOL - FC**]. In more detail:

- INPUT [$32\times 32\times 3$] will hold the raw pixel values of the image, in this case an image of width 32, height 32, and with three color channels R,G,B.
- CONV layer will compute the output of neurons that are connected to local regions in the input, each computing a dot product between their weights and a small region they are connected to in the input volume. This may result in volume such as [$32\times 32\times 12$] if we decided to use 12 filters.
- RELU layer will apply an elementwise activation function, such as the $max(0,x)$ thresholding at zero. This leaves the size of the volume unchanged ([$32\times 32\times 12$]).
- POOL layer will perform a downsampling operation along the spatial dimensions (width, height), resulting in volume such as [$16\times 16\times 12$].
- FC (i.e. fully-connected) layer will compute the class scores, resulting in volume of size [$1\times 1\times 10$], where each of the 10 numbers correspond to a class score, such as among the 10 tags of CIFAR-10. As with ordinary Neural Networks and as the name implies, each neuron in this layer will be connected to all the numbers in the previous volume.

#### Convolutional Layer

To summarize, the Conv Layer:

- Accepts a volume of size $W_1\times H_1\times D_1$
- Requires four hyperparameters:
  - Number of filters $K$,
  - their spatial extent $F$,
  - the stride $S$,
  - the amount of zero padding $P$.
- Produces a volume of size $W_2\times H_2\times D_2$ where:
  - $W_2=(W_1-F+2P)/S+1$
  - $H_2=(H_1-F+2P)/S+1$ (i.e. width and height are computed equally by symmetry)
  - $D_2=K$
- With parameter sharing, it introduces $F\cdot F\cdot D_1$ weights per filter, for a total of $(F\cdot F\cdot D_1)\cdot K$ weights and $K$ biases.
- In the output volume, the $d$-th depth slice (of size $W_2\times H_2$) is the result of performing a valid convolution of the $d$-th filter over the input volume with a stride of $S$, and then offset by $d$-th bias.

A common setting of the hyperparameters is $F=3$,$S=1$,$P=1$. However, there are common conventions and rules of thumb that motivate these hyperparameters.

![1](http://upload-images.jianshu.io/upload_images/2256672-273e3d9cf9dececb.png)

![2](http://upload-images.jianshu.io/upload_images/2256672-7f362ea9350761d9.png)

![3](http://upload-images.jianshu.io/upload_images/2256672-f5fa1e904cb0287e.png)

![4](http://upload-images.jianshu.io/upload_images/2256672-7919cabd375b4cfd.png)

#### Pooling Layer

It is common to periodically insert a Pooling layer in-between successive Conv layers in a ConvNet architecture. Its function is to progressively reduce the spatial size of the representation to reduce the amount of parameters and computation in the network, and hence to also control overfitting. The Pooling Layer operates independently on every depth slice of the input and resizes it spatially, using the \textbf{MAX} operation. The most common form is a pooling layer with filters of size $2\times 2$ applied with a stride of 2 downsamples every depth slice in the input by 2 along both width and height, discarding $75\%$ of the activations. Every MAX operation would in this case be taking a max over 4 numbers (little $2\times 2$ region in some depth slice). The depth dimension remains unchanged. More generally, the pooling layer:

- Accepts a volume of size $W_1\times H_1\times D_1$
- Requires two hyperparameters:
  - their spatial extent $F$,
  - the stride $S$,
- Produces a volume of size $W_2\times H_2\times D_2$ where:
  - $W_2=(W_1-F)/S+1$
  - $H_2=(H_1-F)/S+1$
  - $D2=D1$
- Introduces zero parameters since it computes a fixed function of the input
- For Pooling layers, it is not common to pad the input using zero-padding.

## The CIFAR-10 dataset

The CIFAR-10 dataset (<http://www.cs.toronto.edu/~kriz/cifar.html>) consists of 60000 $32\times 32$ colour images in 10 classes, with 6000 images per class. There are 50000 training images and 10000 test images.

The dataset is divided into five training batches and one test batch, each with 10000 images. The test batch contains exactly 1000 randomly-selected images from each class. The training batches contain the remaining images in random order, but some training batches may contain more images from one class than another. Between them, the training batches contain exactly 5000 images from each class. Here are the classes in the dataset, as well as 10 random images from each:

![cifar10](https://img-blog.csdnimg.cn/20190730170546931.png)

The classes are completely mutually exclusive. There is no overlap between automobiles and trucks. "Automobile" includes sedans, SUVs, things of that sort. "Truck" includes only big trucks. Neither includes pickup trucks.

## Tasks

- Given the data set in the first section, please implement a convolutional neural network to calculate the accuracy rate. The major steps involved are as follows:
  - Reading the input image.
  - Preparing filters.
  - Conv layer: Convolving each filter with the input image.
  - ReLU layer: Applying ReLU activation function on the feature maps (output of conv layer).
  - Max Pooling layer: Applying the pooling operation on the output of ReLU layer.
  - Stacking conv, ReLU, and max pooling layers
- You can refer to the codes in **cs231n**. Don't use Keras, TensorFlow, PyTorch, Theano, Caffe, and other deep learning softwares.

## Codes and Results

在终端中执行下述指令，获取 cs231n 的数据集并本地编译。

```bash
cd cs231n/datasets
./get_datasets.sh
cd ../
python setup.py build_ext --inplace
```

回到初始目录，执行下属指令进行学习，并将日志写入`screen.log`。（CPU 上跑了快一个小时…）

```bash
python main.py | tee screen.log
```

训练了 10 个 Epoch 共 4900 次迭代，最后得到的结果如下（`screen.log`），在训练集上得到了大约百分之七十的准确度。

```bash
(Epoch 10 / 10) train acc: 0.706000; val_acc: 0.598000
```

运行结果过程中的 Loss 函数变化如下图。

![运行结果](data:image/webp;base64,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)

### `main.py`

所需要实现的部分已经在`cs231n`中有了，这里只用`import`进来进行训练即可。这里使用了默认的参数进行训练，已经得到了比较不错的结果。

```python
from cs231n.data_utils import get_CIFAR10_data
from cs231n.classifiers.cnn import ThreeLayerConvNet
from cs231n.solver import Solver
from matplotlib import pyplot
if __name__ == '__main__':
    solver = Solver(ThreeLayerConvNet(), get_CIFAR10_data())
    solver.train()
    pyplot.plot(solver.loss_history)
    pyplot.xlabel("Iteration")
    pyplot.ylabel("Loss")
    pyplot.show()
```

## Reflection

由于临近期末，本次实验没有假如像之前 BP 算法和神经网络一样完全手写，而是参考了来自 cs231n 的代码，剩下的核心任务就是编写 main 函数来训练 CNN 了。其中使用到的 CNN 示意图大致如下。![CNN](http://upload-images.jianshu.io/upload_images/2256672-a36210f89c7164a7.png)

和全连接网络相比，卷积神经网络使用了**局部连接**（每个神经元之和上一层的少数而非全部神经元连接）、**权值共享**（一组连接共享同一个权重）、**下采样**（增加一个池化的步骤提取样本特征）三个方面的方法，通过尽可能保留重要的参数（利用样本数据的特征，例如图像识别中相邻像素关系紧密），去掉大量不重要的参数，来达到更好的学习效果。

和全连接神经网络相比，卷积神经网络的训练要复杂一些。但训练的原理是一样的：利用链式求导计算损失函数对每个权重的偏导数（梯度），然后根据梯度下降公式更新权重。训练算法依然是反向传播算法，详细的公式推导在前面的作业引导中已经有了。

由于不可以使用常见的深度学习框架，这次大量的计算在 CPU 上跑了将近一个小时…做机器学习是真的吃计算资源。想来近些年深度学习能够如此火热的原因很大一部分也要归功于算力的发展吧。

话说回来，一个学期的实验课终于到此结束。回看这一学期，一共做了 16 个 Lab、4 个 Project、4 个 Theory、1 个 Presentation（因为没有经验被老师怼的很惨）。总的来说，我觉得这门人工智能是我这个学期知识容量最大的一门课，也确实让人学到了很多知识（我奇怪于这门课在前一个年级是必修课，但是在今年却变成了选修）。从最开始的搜索（宽搜、迭代加深搜索、对抗搜索以及最小最大剪枝等等），再之后的知识表达（Prolog、Strips），最后到机器学习，课程和实验的难度都在不断提升，每个礼拜都要花掉好几整天的时间在这门课上，远远超出了 TA 说的“实验内容都可以在课上完成”，可能还是我太菜了吧。尤其是最后的机器学习部分，写代码的过程中伴随着大量的公式推导，让人感叹自己数学直觉和功底的差劲。不过，这门课的设计还是非常棒的，各种作业的背景也很有趣且有用。希望这门课上学到的知识能够在以后真正的派上用场~
