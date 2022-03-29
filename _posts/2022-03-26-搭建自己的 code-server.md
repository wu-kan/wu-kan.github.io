---
title: "搭建自己的 code-server"
---

码字ing…

自己开始逐渐把自己的编程环境搬上云服务器。

```bash
docker run \
  -it \
  -d codercom/code-server:latest \
  --name code-server \
  -p 8080:8080 \
  -p 4000:4000 \
  -v "$HOME/.config:/home/coder/.config" \
  -v "$PWD/project:/home/coder/project" \
  -u "$(id -u):$(id -g)" \
  -e "DOCKER_USER=$USER" \
  -e PASSWORD="<PASSWORD>"
```

可以看到，有了 docker，想启动一些应用变得非常方便。
