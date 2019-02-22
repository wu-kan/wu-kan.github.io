---
title: 配置TensorFlow
categories: 机器学习
date: 2019-02-06 18:00:00
---
该补上的文章🕊了太久了…
## 工具准备
### jupyter notebook
### Anaconda
Anaconda集成了很多 Python的第三方库。 安装它之后就可以不用再去一个一个地下载这些库并解决它们之间的依赖关系了，是十分方便的。
在[Anaconda Distribution](https://www.anaconda.com/distribution/)上下载。
运行下述脚本
```
bash Anaconda3-2018.12-Linux-x86_64.sh
```
运行下述命令检查
```
conda list
```
#### 报错：conda:未找到命令
修改环境变量
```
vim ~/.bashrc
```
在最后添加：
```
export PATH=~/anaconda3/bin:$PATH
```
重启环境变量：
```
source ~/.bashrc
```
### TensorFlow

 - [坑](https://my.oschina.net/lupeng/blog/2986495)

建立TensorFlow的运行环境，并将其激活，执行：
```
conda create -n tensorflow python=3.7
source activate tensorflow
```
这样就激活了虚拟环境。 
执行以下代码进行 TensorFlow 的安装： 
```
pip3 install tensorflow
``` 
执行以下代码测试 TensorFlow 是否安装成功，运行一个 Hello TensorFlow
```python
import tensorflow as tf
hello = tf.constant('Hello, TensorFlow!')
sess = tf.Session()
print sess.run(hello)
```
```
Hello, TensorFlow!
```