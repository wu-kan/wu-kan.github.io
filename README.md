---
layout: page
title: 关于
permalink: /about
---
## 开始

1. Fork [wu-kan/wu-kan.github.io](https://github.com/wu-kan/wu-kan.github.io)到你的仓库，并在设置里开启gh-pages
2. 修改_config.yml为你自己的信息
3. 删除_post/下的博文和public/image/文件夹下的图片，开始写你自己的文章

详细配置可以参见[这篇博文](https://wu-kan.github.io/posts/博客搭建/基于Jekyll搭建个人博客)

## 声明

除特别声明或转载外，所有博文采用[署名-相同方式共享 4.0 国际](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)协议进行许可。

博客基于[MIT License](https://github.com/wu-kan/wu-kan.github.io/blob/master/LICENSE)开源于[GitHub](https://github.com/wu-kan/wu-kan.github.io)。

## 致谢

托管于[Github Pages](https://pages.github.com/)，感谢。

由[jekyll/jekyll](https://github.com/jekyll/jekyll)驱动，感谢。

基于[poole/lanyon](https://github.com/poole/lanyon)主题进行修改，感谢。

使用了[jsdelivr](https://www.jsdelivr.com/)提供的CDN加速服务，感谢。

留言和阅读量系统基于[Valine](https://valine.js.org/)和[LeanCloud](https://leancloud.cn/)，感谢。

使用了[不蒜子](http://busuanzi.ibruce.info/)页面统计，感谢。

博文目录插件在[ghiculescu/jekyll-table-of-contents](https://github.com/ghiculescu/jekyll-table-of-contents)基础上修改，感谢。

博客搜索插件使用了[christian-fei/Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)，感谢。

代码高亮及插件使用了[PrismJS](https://prismjs.com/)，感谢。

Live2D基于[stevenjoezhang/live2d-widget](https://github.com/stevenjoezhang/live2d-widget)，感谢。

使用了[leopardpan/leopardpan.github.io](https://github.com/leopardpan/leopardpan.github.io)的头像翻转效果，感谢。

## Feature/Todo

从[这个页面](https://magical-girl.site/)得到的灵感，目标是博客上除了文章和作为导航的Live2D之外尽量不出现其他的模块。

- [x] 完成博客文章标签页
- [ ] 完成博客文章分类页（分类暂时和标签没区别）
- [ ] 重写博客首页，做一个有意思的封面，不再显示文章
- [x] 加入评论系统，暂时考虑用valine+leancloud实现
  - [x] 基于valine的阅读量统计
- [x] 加入不蒜子统计
- [x] <span class="fa fa-font-awesome"></span> Font Awesome
- [x] 全站搜索
- [x] 移植[原博客的ribbon动态背景](https://github.com/theme-next/theme-next-canvas-ribbon)
- [x] 调整代码块风格，并加上代码选中按钮
- [x] 加入可以自动展开、标号的目录
  - [ ] 自动展开
- [x] mermaid
  - [x] Markdown代码扩展
- [x] $\KaTeX$
- [x] Live2D
  - [x] 导航
  - [x] 一言
  - [ ] 找个人工智障对话的api接入现在的Live2D对话，当前是显示几个已有的句子或一言
  - [ ] 删改掉原来的的骚话-_-
  - [ ] 加上切换Live2D显示/关闭的按钮
  - [ ] 使用自己搭建的Live2D后端API
    - [ ] 收集一些Live2D Model

## 初心

我曾做什么？

我正做什么？

我想做什么？

我该做什么？

> 章北海感到父亲的灵魂从冥冥中降落到飞船上，与他融为一体，他按动了操作界面上那个最后的按钮，心中默念出那个他用尽一生的努力所追求的指令：
> > “‘自然选择’，前进四！”

## 历程

### 2019-07-06 v2.2.1

- prismjs使用unpkg.com加速
- 删去layout中的404页（因为只需要引入js脚本）

### 2019-06-28 v2.2.0

- 博客结构微调
- 将大部分博客用到的jscdn换成unpkg.com，感谢其提供的加速服务~
- 留言板加入友链

### 2019-05-03 v2.1.4

- valine更新
  - 现在支持记录访问者IP
  - 每次重新拉取评论者头像

### 2019-04-29 v2.1.3

- 页面样式微调，将masthead调矮，将标题字号改小

### 2019-03-20 v2.1.2

- 修复sidebar展开时回到顶部的问题

### 2019-03-18 v2.1.1

- 一些界面上的小调整

### 2019-03-01 v2.1.0

- 调整某些插件
- layout新增document页，一个只开启$\KaTeX$而不引入任何其他样式的页面，主要是方便自己生成可打印的ICPC模板和一些课程报告
- layout新增404页，可选择开启腾讯公益
- mermaid支持markdown扩展了

### 2019-02-24 v2.0.1

- sidebar的触发按钮样式换成了bars，原来的样式更像是菜单
- 一点页面上的小调整

### 2019-02-23 v2.0.0

- 重构完成
- 正式开源

### 2019-02-19

- 模块化·初步
- 博客搜索实现

### 2019-02-01

- [署名-相同方式共享 4.0 国际](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)。
- 社会主义核心价值观点击特效，感谢[dujin](https://www.dujin.org/9088.html)。
- 打赏。

### 2019-01-31

- mathjax换katex
- post访问量统计

### 2019-01-24

- 代码高亮
- 选中代码按钮
- 代码语言按钮

### 2019-01-23

加入文章目录到SideBar

### 2019-01-22

- 加入Ribbon动态背景

### 2019-01-21

- 加入valine评论系统，留言页实现

### 2019-01-20

- 加入归档页

### 2019-01-19

- 加入标签页

### 2019-01-18

- 开始用Jekyll重构整个博客

折腾吧，折腾是才最好玩的。

### 2019-01-13

- 更换Next.Muse主题模板
- 少量修改页面自定义样式布局，主要是sidebar
- 将网易云音乐iframe移动到description，感觉挺有意思的

### 2019-01-12

- 将NexT版本更新至v6.7.0

### 2018-12-23

- 页面字体修改
- 网易云音乐iframe加入SideBar

### 2018-12-16

- 引入mermaid支持
- 修复部分Latex渲染的Bug

### 2018-11-24

- 将NexT版本更新至v6.5.0
- 用Valine更换失效的Gitment评论系统
- 加入Leancloud和busuanzi页面统计

### 2018-11-20

- 谷歌，百度搜索页面提交

### 2018-11-18

- 全局透明化
- 动态背景
- 页面加载动画
- Latex支持

### 2018-11-16

- 主题由默认的Landspace换至NexT v5.1.4
- 使用Next.Pisces主题模板
- 开始对网页进行自定义样式布局
- 尝试加入Gitment，但初始化总是不成功

### 2018-11-15

- 在Github上成功部署博客
- 成功迁移[原CSDN博客](https://blog.csdn.net/w_weilan)上的所有文章
- live2d
