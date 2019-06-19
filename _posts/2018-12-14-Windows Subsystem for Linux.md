---
title: Windows Subsystem for Linux入门：安装+配置图形界面+中文环境+vscode
categories: Linux
---
## 什么是WSL

> Windows Subsystem for Linux（简称WSL）是一个为在Windows 10上能够原生运行Linux二进制可执行文件（ELF格式）的兼容层。它是由微软与Canonical公司合作开发，目标是使纯正的Ubuntu 14.04 "Trusty Tahr"映像能下载和解压到用户的本地计算机，并且映像内的工具和实用工具能在此子系统上原生运行。

以上来自[百度百科](https://baike.baidu.com/item/wsl/20359185)。简单来说，WSL是以软件的形式运行在Windows下的子系统。先来看一下我的最终完成效果吧，其实和真正的Linux已经很接近了。

![1](/public/image/2018-12-14-1.jpg)

### 相对于虚拟机的优势

相比于VMware等虚拟机，WSL占用内存和CPU资源更少，在WSL上运行软件的消耗和直接在Windows上差不多。而且，Windows下可以直接访问WSL的环境。

### 相对于多系统的优势

省事呀。假如需要重启Linux系统，WSL只需要把软件关掉重开即可。同时，相较于多系统，文件交互也更为简单。

## 安装

[官方教程地址](https://docs.microsoft.com/zh-cn/windows/wsl/install-win10)，可以看到还是很简单的。

本文大部分内容写于18/12/14，所用的机器是VAIO Z Flip 2016，处理器`i7-6567U`，内存`8G`，操作系统版本号`Windows 10.0.17763.134 x64`。可以看到即使是以轻薄本的配置也足够流畅完成下述环节。

### 开启WSL可选特性

在控制面板的“启动或关闭Windows功能”中勾选“适用于Linux的Windows子系统”。
![2](/public/image/2018-12-14-2.jpg)
或在PowerShell 中运行下述代码：

```bash
Enable-WindowsOptionalFeature -Online -FeatureName Microsoft-Windows-Subsystem-Linux
```

修改完毕后，重启使选项生效。

### 下载安装

打开Microsoft Store，搜索Linux，就会显示Ubuntu、suse等几个发行版，点击进行安装即可。这里选择了Ubuntu。
![3](/public/image/2018-12-14-3.jpg)
下载之后启动菜单里就会出现`Ubuntu`的图标了。让我们启动它，按照上面的提示等待几分钟，就可以进入初次登陆设置账号的界面。
![4](/public/image/2018-12-14-4.jpg)
好像用户名不可以有大写字母…不管怎样，到这里就算安装成功了。
![5](/public/image/2018-12-14-5.jpg)

## 配置图形界面

WSL没有原生支持GUI的。这里通过XServer实现可视化操作，用到的软件是`VcXsrv`。

### 实现原理

1. VcXsrv启动Xserver服务用于监听；
2. WSL启动程序后把界面数据发送给Xserver；
3. Xserver接收到数据进行绘制，于是在Win下看到图形界面。

> [这里](https://www.jianshu.com/p/bc38ed12da1d)给出了另外一种通过VNC远程控制的解决方案，可能会比XServer流畅一些。

### 下载并安装VcXsrv

点[这里](https://sourceforge.net/projects/vcxsrv/)下载安装包，一路next即可。第一步是选择组件，默认是全部安装；第二步是安装路径。

### 启动VcXsrv

开始菜单里现在出现了一个文件夹`VcXsrv`，选择里面的XLaunch，一路选择下一步即可。然后这个软件就后台运行了。之后如果有需要使用Linux的图形界面的，都需要提前打开`XLaunch`。
提一下打开`Xlaunch`后第一页的四个选项设置，我个人是喜欢选择全屏的，最接近原生系统的体验。假如你不需要打开完整的桌面环境而只需要图形化某些软件，那么就用默认的`Multiple windows`也不错。

#### 配置DISPLAY

为了方便，打开Ubuntu bash，运行如下代码：

```bash
echo "export DISPLAY=:0.0" >> ~/.bashrc
```

这样，每次打开图形界面程序就不需要额外指定`DISPLAY`了。

### 切换源

默认源速度缓慢，这里切换到阿里源。

```bash
sudo vim /etc/apt/sources.list
```

使用vim打开，参考[这里](https://www.sunzhongwei.com/mip/modify-the-wsl-ubuntu-1804-default-source-for-ali-cloud-images)。在vim中输入如下的控制代码（需要先熟悉上古神器vim的操作）：

```vim
:%s/security.ubuntu/mirrors.aliyun/g
:%s/archive.ubuntu/mirrors.aliyun/g
```

保存并退出。执行一下以下代码更新软件包到最新状态。

> > Remark:在sudo apt upgrade之前要先sudo apt update
>
> 感谢[@](https://wu-kan.github.io/posts/linux/Windows-Subsystem-for-Linux#5c5079d2303f394f828dd8e0)在评论区指出

```bash
sudo apt update
sudo apt upgrade
```

### 检验

运行下述代码，安装firefox检验效果：

```bash
sudo apt install firefox
```

随后直接运行下述代码即可查看效果。

```bash
firefox
```

![6](/public/image/2018-12-14-6.jpg)
可以看到，这里虽然能正常打开网页，但是中文显示是乱码的。

### 解决中文乱码问题

运行下述代码，成功解决。现在可以正常显示中文了。

```bash
sudo apt install fonts-noto-cjk
```

![7](/public/image/2018-12-14-7.jpg)

### 修改默认语言环境为中文（可选）

安装中文语言包

```bash
sudo apt install language-pack-zh-hans language-pack-zh-hans-base
```

设置本地化环境变量

```bash
echo "LANG=zh_CN.UTF-8" >> ~/.profile
```

### 安装桌面

这里选择`xfce4`桌面，它的优点是轻量、美观、占用系统资源少。

```bash
sudo apt install xfce4 dbus-x11
```

完成后，执行下面这段代码就可以看到桌面的图形界面了。

```bash
xfce4-session
```

### 中文输入法

```bash
sudo apt install fcitx fcitx-pinyin
echo -e "export XMODIFIERS=@im=fcitx\nexport GTK_IM_MODULE=fcitx\nexport QT_IM_MODULE=fcitx\n" >> .profile
```

软件包已装，在应用程序 - 设置 - 会话与启动 - 应用程序自启动，添加 /usr/bin/fcitx。

## 配置工作环境

这里以安装、配置vscode为例。vscode宇宙第一！

### 安装umake

```bash
sudo add-apt-repository ppa:ubuntu-desktop/ubuntu-make
sudo apt update
sudo apt install ubuntu-make
```

### 安装vscode

```bash
sudo umake ide visual-studio-code
```

执行后分别会让你选择安装地址，然后输入`a`确认。稍等片刻就安装好啦。重启bash，重新进入xfce桌面，在应用程序-开发里就可以找到安装好的vscode啦。
![8](/public/image/2018-12-14-8.jpg)
安装`Setting Sync`来同步别的平台的设置吧。设置好自己用于同步vscode设置的`GitHub Token`和`GitHub Gist`，一起来喝上一杯咖啡吧。
![9](/public/image/2018-12-14-9.jpg)
现在你可以把很多事迁到WSL内来做了（折腾才是最好玩的），丢开虚拟机和双系统吧。完结撒花~
