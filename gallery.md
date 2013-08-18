# 从kissy gallery的重构谈js框架社区建设

从前有个门派，门上挂着御赐金牌，位处黄金位置，据说里面高手如云，但奇怪的是门可罗雀，来学艺的人很少，门外风言四起，掌门终于发话了，我们需要改变...

这个门派叫kissy，挂着阿里集团UED的牌子，阿里几百号前端使用的js框架，生态圈的基础建设（指的是文档、规范、组件数量、用户参与度）却非常糟糕，为使用者所诟病。
kissy的困境，算是国内js框架的缩影，国内不缺js框架，但出现完整生态圈形态的极少，所以我们都很羡慕jQuery。

kissy早期的社区建设借鉴的是yui3 gallery，但发现这路子行不通，贡献代码的成本太高，第三方开发者不愿意跟你玩。

所以社区建设的第一步应该是建一个像jQuery一样的广场，去掉门槛，只要开发者知道地方都能来玩。

### 社区依托于github

大部分的js框架社区代码都是放在github上，但很少人会用到github的api。

github开发的api非常有用，我们的部署环境和文档环境想要串起来，离不开API的使用。

这里推荐个Node模块：*node-github*，封装了github的大部分接口，调用非常方便。


### 化整为零解决臃肿问题

yui3 gallery是一个库，开发者提交的代码都往里面丢，这样做造成如下问题：

* “大锅饭”思路，模糊了组件的独立性和私有性，降低开发者提交和维护的积极性
* 库代码很臃肿，用户如果有修改的需求，往往一个组件需要clone整个gallery库
* 不利用组件数据的追踪

kissy gallery是把gallery当成github中的组织，各个组件独立成库，化整为零，开发者对自己的组件负责，解决了上述说的问题。

### 使用markdown解决文档混乱问题

旧的kissy gallery，开发者可以随意丢html页面上去做文档，导致文档千人千面，阅读体验极差，使用者骂声一片。

于是我们强制开发者使用markdown写文档，有如下好处：

* github可以自动解析markdown文档
* 用户只需关注文档内容
* 可以使用风格一致的文档皮肤

我们没有使用github文档服务，而是建了个文档服务器，服务器上挂了markdown解析器*marked*，创建了一套gallery专用的模版和皮肤。

当然这样做成本比较高，我们需要解决文档服务器拉取github库代码的同步问题，最省力的方式，还是使用github的文档服务。


## 如何拆除门槛？

我们给kissy gallery标榜的一个关键词是快，所以我写了篇文章叫《十五分钟开发一个kissy组件》（-_-!有点英语教材的味道，先把人坑进来再说...）。

想要快，需要解决第三方开发者的二个问题：

* 如何快速构建规范工程？
* 如何快速部署代码？

### 使用yeoman解决工程问题

大部分js框架在社区开放前，会定义下接入规范，比如目录结构该如何组织，文档、demo如何写，代码如何部署等。理想很美好,现实很残酷，执行的时候会遇到各种麻烦，很多开发者放弃提交代码了。

规范是必须的，但我们需要解决规范带来的门槛问题，幸运的是我们找到了yeoman。

yeoman是解决工程问题的最佳工具，在yeoman下我们创建了kissy gallery的构建工具，用户只要输入几行命令，就可以构建出符合gallery规范要求的目录和文件。

    npm install yo grunt-cli -g
    npm install generator-kissy-gallery -g

安装完成后，进入组件目录（比如demo），运行

    yo kissy-gallery 1.0

![gallery fold](http://s1.36ria.com/201305/4922/35448_o.png)

该目录包含了组件的js、doc、demo、Gruntfile.js（用于grunt打包）模版，开发者可以立即开始写hello world！

同时我们还需要解决代码的打包压缩问题，在kissy gallery中我们需要把待发布的代码文件打包并压缩到build目录下，这时候就轮到grunt上场了。

kissy gallery的构建工具可以自动拉取grunt构建的依赖，这样您只需要使用*grunt*命令，即可顺利打包，无需关心Gruntfile.js该如何写。

### 使用github和内部系统解决部署问题

社区代码的部署分二个部分：

* 文档、demo等的部署
* 代码cdn的部署

文档、demo的部署，最省力的方式是直接使用github的静态文件功能。

如果像kissy gallery一样使用独立的文档服务器，会比较麻烦些，需要写

kissy gallery：http://gallery.kissyui.com
yui3 gallery：https://github.com/yui/yui3-gallery
node-github: http://mikedeboer.github.io/node-github/
marked：https://github.com/chjj/marked
yeoman：http://yeoman.io
grunt：http://gruntjs.com/



