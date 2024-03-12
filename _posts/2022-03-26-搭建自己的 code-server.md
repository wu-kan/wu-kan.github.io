---
title: "搭建自己的 code-server"
---

码字ing…

自己开始逐渐把自己的编程环境搬上云服务器。

```shell
mkdir -p $HOME/code-server/home/coder/.config
chmod 777 $HOME/code-server/home/coder/.config
mkdir -p $HOME/code-server/workspace
chmod 777 $HOME/code-server/workspace
docker run \
  --privileged \
  --restart always \
  -p 8080:8080 \
  -p 4000:4000 \
  -v "$HOME/code-server/workspace:/workspace" \
  -v "$HOME/code-server/home/coder/.config:/home/coder/.config" \
  -e PASSWORD="<PASSWORD>" \
  -d -it \
  codercom/code-server:latest
```

可以看到，有了 docker，想启动一些应用变得非常方便。
