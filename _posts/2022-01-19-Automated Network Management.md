---
title: Automated Network Management
---

> 作业内容：
>
> 课程论文主要关注：目的目标、系统架构、运行机制、应用场景、后续发展等。学习并总结以下几个方面的子课题内容：
>
> - [YANG - A Data Modeling Language for the Network Configuration Protocol (NETCONF)](https://tools.ietf.org/html/rfc6020)
> - [Network Configuration Protocol (NETCONF)](https://tools.ietf.org/html/rfc6241)
> - [RESTCONF Protocol](https://tools.ietf.org/html/rfc8040)
> - [A Reference Model for Autonomic Networking](https://tools.ietf.org/html/rfc8993)
> - [An Autonomic Control Plane (ACP)](https://tools.ietf.org/html/rfc8994)
> - [An Autonomic Mechanism for Resource-based Network Services Auto-deployment](https://tools.ietf.org/html/draft-dang-anima-network-service-auto-deployment/)

## 前言

选择了 Automated Network Management（网络管理自动化）作为“高级计算机网络”课程的的期末论文。写这篇论文的时候，我不由得想起快两年前本科计网课的[实验](https://wu-kan.cn/2019/06/19/%E7%BB%BC%E5%90%88%E7%BB%84%E7%BD%91%E5%AE%9E%E9%AA%8C/)：大家分成小组，在机房按照要求配置路由器，搭建符合要求的子网并将其接入校园网。在度过若干下午并经历很多玄学问题后，我们终于跌跌撞撞做完了实验，而那时的我唯一的想法就是以后千万不要接手网络运维的锅。

彼时我刚刚开始接触了解各种虚拟化相关的工具和应用，什么 Docker、K8S，深感这才是未来的方向，无需关注机器的硬件配置和软件环境，而是关注于实现的功能本身。上面提到的两个工具主要降低了运维在部署软件时的工作量，而 Automated Network Management 我的理解则是为了降低运维在部署硬件方面的工作量。

在不知道相关技术的前提下，那时我们在实验课上配置网络的做法则是：`ssh` 或者 `telnet` 连接到设备上，一条一条的输入指令。显然，对于一个更大更复杂的网络，从一个超算中心的内部互联网络，乃至云服务商的一个大区域内的互联网络。在当今云计算的浪潮之下，不适用于网络中的大规模自动化部署，可编程能力有限，这其中工作量和开发难度巨大。

## NETCONF 与 YANG

在以上基础上，[Network Configuration Protocol (NETCONF)](https://www.rfc-editor.org/rfc/rfc6241.html) 协议应运而生。可以理解 NETCONF 为一种通用的协议，通过它可以管理网络设备，可以检索配置数据信息，并且可以上传和操作新的配置数据。最初的 NETCONF 只规定了协议的基本框架和操作，定义考虑 RFC3535 的一些问题的解决方法，没有规定统一的建模语言，所以早期部分厂商的设备只是支持 NETCONF 的一些基本操作，底层没有使用统一的数据建模语言。

这里有一个概念需要解释，什么是面向网络配置的数据建模？理想的情况下，所有的设备都用相同的配置，NETCONF 会自己处理他们到相应的机器上。然而现实中网络设备的配置结构往往是是不同的。实现同样的功能的不同设备需要的配置结构也往往不同；厂商之间的命令集存在巨大差异；何止是厂商，同型号不同软件版本可能差异都非常大。我们需要在 NETCONF 上再加一层，抽象出我们真正关心的网络功能，而底层实现方式则在这里并不那么重要，于是我们就得到了一个面向网络配置的数据建模。

解释完面向网络配置的数据建模，则其必要性自然也随之而出。在 2010 年发布了 [RFC6020](https://tools.ietf.org/html/rfc6020)， 提出了 YANG Model 建模语言，以及和 NETCONF 的结合方法。YANG 定义的是数据建模的语言统一各厂商之间的底层资源逻辑，而 NETCONF 定义的是对配置数据、状态数据的操作统一各厂商的命令集。YANG 模型创建的数据实例包裹在 NETCONF 协议之中传输，二者相互结合，构建了一套新的基于 YANG 模型的使用 NETCONF 协议驱动的新时代的通用网络可编程接口。

YANG 可以非常简单的用结构化语言描述出这个网络设备。比如对于一个接口的定义（这个例子来自于[rfc7950#section-4.2.3](https://datatracker.ietf.org/doc/html/rfc7950#section-4.2.3)）：

```yang
list interface {
    key "name";
    config true;

    leaf name {
        type string;
    }
    leaf speed {
        type enumeration {
            enum 10m;
            enum 100m;
            enum auto;
        }
    }
    leaf observed-speed {
        type uint32;
        config false;
    }
}
```

它可以很好的转换成 XML 数据，包裹在 NETCONF 协议之中进行传输。YANG 建模网络世界的数字描述，NETCONF 定义了对数据的获取（get）与调整（config），对 YANG 建模的世界的数据封装操作，实现对网络的管理。

```bash
            Layer                 Example
       +-------------+      +-----------------+      +----------------+
   (4) |   Content   |      |  Configuration  |      |  Notification  |
       |             |      |      data       |      |      data      |
       +-------------+      +-----------------+      +----------------+
              |                       |                      |
       +-------------+      +-----------------+              |
   (3) | Operations  |      |  <edit-config>  |              |
       |             |      |                 |              |
       +-------------+      +-----------------+              |
              |                       |                      |
       +-------------+      +-----------------+      +----------------+
   (2) |  Messages   |      |     <rpc>,      |      | <notification> |
       |             |      |   <rpc-reply>   |      |                |
       +-------------+      +-----------------+      +----------------+
              |                       |                      |
       +-------------+      +-----------------------------------------+
   (1) |   Secure    |      |  SSH, TLS, BEEP/TLS, SOAP/HTTP/TLS, ... |
       |  Transport  |      |                                         |
       +-------------+      +-----------------------------------------+
```

上图来自于 [rfc6241#section-1.2](https://datatracker.ietf.org/doc/html/rfc6241#section-1.2)，有层次的描述了 NETCONF 这个协议的一些细节：

1. 安全传输(Secure Transport)层提供客户端和服务器之间的通信路径。NETCONF 是通过 SSH 协议传输，面向连接，且有安全保障。
2. 消息(Messages)层为编码 RPC 和通知提供了一个简单的，与传输无关的成帧机制。通过 RPC 进行对网络设备的远端调用，网管发出 rpc 请求，网络设备恢复 rpc-reply。
3. 操作(Operations)层定义了一组使用 XML 编码参数作为 RPC 方法调用的基本协议操作。这是 NETCONF 的灵魂所在，它支持 get（配置及运行数据）、get-config（获取配置数据，且一个设备可以有多个配置数据，一个 running，一个 startup，多个 candidate 候选）、edit-config（配置网络设备的参数，支持增删改）这些常用的，还有 delete-config、copy-config（复制配置到目的地，目的地可以是 ftp、文件或者是正在 running 的配置等等）、lock\unlock(对配置进行锁定，防止多进程操作导致的配置冲突或者失败等情况)等等。
4. 内容(Content)层不在本文的范围之内。 预计将分别开展标准化 NETCONF 数据模型的工作。图上的 data 就是 xml 包裹的 yang data，如上图我们所描述的那个端口一样，结构化数据易于编程。用来描述要配置或者删除或者获取的数据。

在实际中基于一些开源的软件，比如 python 的 ncclient，我们可以非常方便的对网络设备进行自动化配置，实现网络可编程。这就是 NETCONF 与 YANG Model 的使命所在。

网络人员阅读格式良好的 YANG Model 定义，基于 NETCONF 定义的操作，使用相关的编程语言对网络设备进行可编程操作。通过这种方式铸就网络可编程的道路。

## RESTCONF

随着网络规模的增大、复杂性的增加，自动化运维的需求日益增加。NETCONF 提供基于 RPC 机制的应用编程接口。但是 NETCONF 已无法满足网络发展中对设备编程接口提出的新要求，希望能够提供支持 WEB 应用访问和操作网络设备的标准化接口。基于 NETCONF 的成功，人们又创新出 RESTCONF。RESTCONF 是通过 REST 来实现对网络设备管理的协议。其本质和 NETCONF 很像，使用 YANG 进行数据的定义和约束，使用 HTTP 进行交互。通过 REST 的方式，更合理的实现 WEB 服务之间的交互。RESTCONF 也使用 NETCONF 中 datastore 的概念，进行信息的储存。下表显示了 NETCONF 和 RESTCONF 的区别。

|                  |      NETCONF      |  RESTCONF   |
| :--------------: | :---------------: | :---------: |
|      客户端      |  NETCONF client   | HTTP Client |
| 配置格式由谁约定 | YANG module / XSD | YANG module |
|   发送内容格式   |        XML        |  XML/JSON   |
|     交互方式     |        RPC        |    HTTP     |
|     传输协议     |        SSH        |   HTTP(s)   |
|      服务端      |  NETCONF server   | HTTP server |

可以说，RESTCONF = NETCONF / YANG + HTTP(s)。得益于 RESTCONF 标准化的接口，兼容多家厂商的设备，开发和维护成本进一步降低了。

## ANI 和 ACP

事实上，大多数网络都会运行一些自主功能，而网络的其余部分则是传统的管理。RFC8993 提出了一个参考模型，允许这种混合方法。这项工作的目标不是专门关注完全自主的节点或网络。下图显示了自主网络的高级视图。它由许多自主节点组成，这些节点直接相互作用。这些自主节点在整个网络中提供一组通用功能，称为“自主网络基础设施（ANI）”。ANI 提供命名、寻址、协商、同步、发现和消息传递等功能。

```bash
   +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
   :            :       Autonomic Function 1        :                 :
   : ASA 1      :      ASA 1      :      ASA 1      :          ASA 1  :
   +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
                :                 :                 :
                :   +- - - - - - - - - - - - - - +  :
                :   :   Autonomic Function 2     :  :
                :   :  ASA 2      :      ASA 2   :  :
                :   +- - - - - - - - - - - - - - +  :
                :                 :                 :
   +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
   :                Autonomic Networking Infrastructure               :
   +- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - +
   +--------+   :    +--------+   :    +--------+   :        +--------+
   | Node 1 |--------| Node 2 |--------| Node 3 |----...-----| Node n |
   +--------+   :    +--------+   :    +--------+   :        +--------+
```

自主网络是一种自我管理的概念：自主功能自我配置，并跨网络协商参数和设置。如今，IP 网络的 OAM 和控制平面通常被称为带内管理和/或信令：其管理和控制协议流量取决于路由和转发表、安全性、策略、QoS，以及可能的其他配置，首先必须通过完全相同的管理和控制协议建立。错误的配置，包括意外的副作用或相互依赖，可能会中断 OAM 和控制操作，尤其是中断对受影响节点本身的远程管理访问，并可能中断对受影响节点位于网络路径上的大量节点的访问。

自主功能需要一个自主构建的通信基础设施。此基础架构需要安全、有弹性，并且可供所有自主功能重用。该架构被称为自主控制平面（ACP）。ACP 在设计上有如下目标：

1. 自主功能通过 ACP 进行通信。因此，ACP 直接支持自主网络功能，如 RFC8993 所述。
2. 控制器或网络管理系统可以使用 ACP 安全地引导远程位置的网络设备，即使中间的（数据平面）网络尚未配置；不需要依赖于数据平面的引导配置。
3. 即使网络配置错误或未配置，操作员也可以使用 ACP 通过 SSH 或网络配置协议（NETCONF）等协议访问远程设备。

传统上，使用物理上独立的所谓带外（管理）网络来避免这些问题，或者至少允许从这些问题中恢复。在最坏的情况下，人员被派到现场，通过带外管理端口（也称为工艺端口、串行控制台或管理以太网端口）访问设备。然而，这两种选择的代价都很高。在日益自动化的网络中，网络中的集中式管理系统和分布式自主服务代理都需要一个独立于其管理的网络配置的控制平面，以避免通过其所采取的配置操作影响其自身的操作。

## 总结

总的来说，网络运维很明显是朝着自动化方向的演进的，倒不如说，一切可以被机器代替的工作都终将被机器替代。不过在做这样一次作业的过程中，也发现国内的很多软件都是基于老的 CLI 或 snmp，大家工作还是在用文本工具和 SSH 工具，相关的参考资料也不是很多。除上述 RFC 协议之外，我也参考了以下内容，感谢作者们。

- [有人可以解释一下 YANG，NETCONF，RESTCONF，XML 之间的关系吗？ - facetothefate 的回答 - 知乎](https://www.zhihu.com/question/40822826/answer/139443624)
- [通往未来的网络可编程之路：NETCONF 协议与 YANG Model](https://zhuanlan.zhihu.com/p/139500393)
