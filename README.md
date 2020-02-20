---
layout: page
title: 关于
permalink: /about/
---

![Stars](https://img.shields.io/github/stars/wu-kan/wu-kan.github.io.svg)![Forks](https://img.shields.io/github/forks/wu-kan/wu-kan.github.io.svg)![Watchers](https://img.shields.io/github/watchers/wu-kan/wu-kan.github.io.svg)![License](https://img.shields.io/github/license/wu-kan/wu-kan.github.io.svg)![commit-activity](https://img.shields.io/github/commit-activity/m/wu-kan/wu-kan.github.io.svg)![last-commit](https://img.shields.io/github/last-commit/wu-kan/wu-kan.github.io.svg)![contributors](https://img.shields.io/github/contributors-anon/wu-kan/wu-kan.github.io.svg)![Issues](https://img.shields.io/github/issues/wu-kan/wu-kan.github.io.svg)![Release](https://img.shields.io/github/v/release/wu-kan/wu-kan.github.io.svg)![release-date](https://img.shields.io/github/release-date/wu-kan/wu-kan.github.io.svg)![CountLanguage](https://img.shields.io/github/languages/count/wu-kan/wu-kan.github.io.svg)![TopLanguage](https://img.shields.io/github/languages/top/wu-kan/wu-kan.github.io.svg)![CodeSize](https://img.shields.io/github/languages/code-size/wu-kan/wu-kan.github.io.svg)![RepoSize](https://img.shields.io/github/repo-size/wu-kan/wu-kan.github.io.svg)![Downloads](https://img.shields.io/github/downloads/wu-kan/wu-kan.github.io/total.svg)

## 开始

1. Fork [wu-kan/wu-kan.github.io](https://github.com/wu-kan/wu-kan.github.io/fork)到你的仓库，并在设置里开启 gh-pages
   - 由于我的博客仍然在持续更新调整，建议在 Tag 或者 Release 中选择已发布的稳定版本食用~
2. 修改`CNAME`中的网址为你自己的网址，如`wu-kan.github.io`或者`wu-kan.cn`
3. 现在你的网址应该可以访问了，配置`_config.yml`你自己的信息，能看懂多少就改多少；配置过程推荐以下几篇博文：
   - [基于 Jekyll 搭建个人博客](https://wu-kan.cn/_posts/2019-01-18-%E5%9F%BA%E4%BA%8EJekyll%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2/)
   - [Markdown 写作心得](https://wu-kan.cn/_posts/2019-01-18-%E5%9F%BA%E4%BA%8EJekyll%E6%90%AD%E5%BB%BA%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2/)
   - [个人网站优化之旅](https://wu-kan.cn/_posts/2020-02-06-%E4%B8%AA%E4%BA%BA%E7%BD%91%E7%AB%99%E4%BC%98%E5%8C%96%E4%B9%8B%E6%97%85/)
4. 删除`_post/`下的博文和`assets/image/`目录下的图片，开始写你自己的文章
5. 欢迎 Star、Fork、Issue！

## 声明

除特别声明或转载外，所有博文采用[署名-相同方式共享 4.0 国际](https://creativecommons.org/licenses/by-sa/4.0/deed.zh)协议进行许可。

博客基于[MIT License](https://github.com/wu-kan/wu-kan.github.io/blob/master/LICENSE)开源于[GitHub](https://github.com/wu-kan/wu-kan.github.io)。

## 初心

我曾做什么？

我正做什么？

我想做什么？

我该做什么？

> 章北海感到父亲的灵魂从冥冥中降落到飞船上，与他融为一体，他按动了操作界面上那个最后的按钮，心中默念出那个他用尽一生的努力所追求的指令：
>
> > “‘自然选择’，前进四！”

目标是实现一个尽可能简洁，而可定制内容又尽可能多的博客。目前博客的预览如下：

![Demo](/screenshot.png)

## 历程

### To Be Done

- [x] 更换 live2d 插件为[Dreamer-Paul/Pio](https://github.com/Dreamer-Paul/Pio)
  - [x] 更换 live2d 模型
  - [x] 定制一些 live2d 提示语
- [x] 更换竖屏下的壁纸
- [x] 部署 gitlab 镜像站，解决百度爬虫爬不到的问题

### 2020-02-14 v3.0.0

- 插件引入方式完全重构，现在直接嵌入 html 即可
- 更换 live2d 插件为[kooritea/live2d-helper](https://github.com/kooritea/live2d-helper)，从而支持 live2d 定制
  - 看板娘隐藏按钮
- 去除 jQuery
- 去除 categories 标签，使用 tags 代替
- 博客结构调整，把`/public`目录迁移到 jekyll 默认的`/assets`
- merger 打赏页
- 侧边栏样式调整，更加简洁
- 为竖屏显示增加壁纸
- 全局搜索
- $\KaTeX$ 行间公式

### 2020.01.31 v2.4.1

- 赞赏按钮样式修复
- 使用<https://loli.net>加速 gravatar，感谢~
- 网站字体更换为等宽字体+微软正黑体
- live2d 移动到页面右侧
- 更换爱酱壁纸

### 2019.11.11 v2.4.0

- 修复`sidebar-overlay`失效的 Bug
- 修复赞助按钮点两次才出现的 Bug
- 修复 mermaid 不显示的 Bug
- 去掉正文部分的白色半透明背景
- 动态背景增加 nest 粒子动画（花里胡哨，默认关闭
- Ribbon 动态背景默认关闭，可在配置文件中去掉注释打开（花 里 胡 哨
- 博文显示信息增加 tag
- 变迁页面增加 tag、categories 图标及对应分类文章数量
- 页面显示适应宽屏显示器
- layout 增加
  - index
  - tag
  - page404

### 2019-08-30 v2.3.0

- 更换 cdn 为[jsDelivr](https://www.jsdelivr.com/)
- 升级 fontaswsomev4.7.0 至 fontawesome-freev5.10.2，支持的图标数量由 675 增加至 1535
- 所有脚本和插件 JSLoader 化，增加移植性和访问速度
- 界面调整
  - 正文部分增加背景，从而减少动态 ribbon 背景影响的阅读体验
  - sidebar 微调
- layout 删除 document 页

### 2019-07-06 v2.2.1

- prismjs 使用[UNPKG](https://unpkg.com)加速
- 删去 layout 中的 404 页（因为只需要引入 js 脚本）

### 2019-06-28 v2.2.0

- 博客结构微调
- 将大部分博客用到的 jscdn 换成 unpkg.com，感谢其提供的加速服务~
- 留言板加入友链

### 2019-05-03 v2.1.4

- valine 更新
  - 现在支持记录访问者 IP
  - 每次重新拉取评论者头像

### 2019-04-29 v2.1.3

- 页面样式微调，将 masthead 调矮，将标题字号改小

### 2019-03-20 v2.1.2

- 修复 sidebar 展开时回到顶部的问题

### 2019-03-18 v2.1.1

- 一些界面上的小调整

### 2019-03-01 v2.1.0

- 调整某些插件
- layout 新增 document 页，一个只开启$\KaTeX$而不引入任何其他样式的页面，主要是方便自己生成可打印的 ICPC 模板和一些课程报告
- layout 新增 404 页，可选择开启腾讯公益
- mermaid 支持 markdown 扩展了

### 2019-02-24 v2.0.1

- sidebar 的触发按钮样式换成了 bars，原来的样式更像是菜单
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

- mathjax 换 katex
- post 访问量统计

### 2019-01-24

- 代码高亮
- 选中代码按钮
- 代码语言按钮

### 2019-01-23

- 加入文章目录到 SideBar

### 2019-01-22

- 加入 Ribbon 动态背景

### 2019-01-21

- 加入 valine 评论系统，留言页实现

### 2019-01-20

- 加入归档页

### 2019-01-19

- 加入标签页

### 2019-01-18

- 开始用 Jekyll 重构整个博客

折腾吧，折腾是才最好玩的。

### 2019-01-13

- 更换 Next.Muse 主题模板
- 少量修改页面自定义样式布局，主要是 sidebar
- 将网易云音乐 iframe 移动到 description，感觉挺有意思的

### 2019-01-12

- 将 NexT 版本更新至 v6.7.0

### 2018-12-23

- 页面字体修改
- 网易云音乐 iframe 加入 SideBar

### 2018-12-16

- 引入 mermaid 支持
- 修复部分 Latex 渲染的 Bug

### 2018-11-24

- 将 NexT 版本更新至 v6.5.0
- 用 Valine 更换失效的 Gitment 评论系统
- 加入 Leancloud 和 busuanzi 页面统计

### 2018-11-20

- 谷歌，百度搜索页面提交

### 2018-11-18

- 全局透明化
- 动态背景
- 页面加载动画
- Latex 支持

### 2018-11-16

- 主题由默认的 Landspace 换至 NexT v5.1.4
- 使用 Next.Pisces 主题模板
- 开始对网页进行自定义样式布局
- 尝试加入 Gitment，但初始化总是不成功

### 2018-11-15

- 在 Github 上成功部署博客
- 成功迁移[原 CSDN 博客](https://blog.csdn.net/w_weilan)上的所有文章
- live2d

## 致谢

托管于[Github Pages](https://pages.github.com/)，感谢。

博客引擎来自于[jekyll/jekyll](https://github.com/jekyll/jekyll)，感谢。

CDN 加速服务来自于<https://cdn.jsdelivr.net/>和<https://loli.net>，感谢。

ci/cd 来自于[gitlab](https://gitlab.com/wu-kan/wu-kan-github-io)，感谢。

博客主题基于[poole/lanyon](https://github.com/poole/lanyon)，感谢。

图标库来自于[<i class="fab fa-font-awesome"></i>fontawesome-free](https://fontawesome.com/)，感谢。

留言和阅读量系统来自于[Valine](https://valine.js.org/)和[LeanCloud](https://leancloud.cn/)，感谢。

捐赠页来自[hifocus/merger](https://github.com/hifocus/merger)，感谢。

页面统计来自于[不蒜子](http://busuanzi.ibruce.info/)，感谢。

博客搜索插件来自于[christian-fei/Simple-Jekyll-Search](https://github.com/christian-fei/Simple-Jekyll-Search)，感谢。

博文目录插件来自于[psalmody/html-contents](https://github.com/psalmody/html-contents)，感谢。

代码高亮及插件来自于[PrismJS](https://prismjs.com/)，感谢。

Live2D 前端插件来自于[Dreamer-Paul/Pio](https://github.com/Dreamer-Paul/Pio)，感谢。

Live2D Model 来自于[imuncle/live2d](https://github.com/imuncle/live2d)和[xiaoski/live2d_models_collection](https://github.com/xiaoski/live2d_models_collection)，感谢。

头像翻转效果来自于[leopardpan/leopardpan.github.io](https://github.com/leopardpan/leopardpan.github.io)，感谢。

头像、壁纸来自于<https://www.pixiv.net/artworks/72096124>、<https://www.pixiv.net/artworks/71932901>和<https://www.pixiv.net/artworks/74559485>，感谢（侵权必删）。
