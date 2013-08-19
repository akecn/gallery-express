# 从kissy gallery的重构谈js框架社区建设

kissy是阿里几百号前端使用的js框架，生态圈的基础建设却非常薄弱，社区贡献代码的人寥寥无几。
kissy的困境，算是国内js框架的缩影，国内不缺js框架，但出现完整生态圈形态的极少，所以我们都很羡慕jQuery。

kissy早期的社区建设借鉴的是yui3 gallery，但发现这路子行不通，贡献代码的成本太高，开发者不愿意跟你玩。

所以今年重构了gallery社区，我们希望建一个像jQuery一样的广场，把门槛拿掉，只要开发者知道地方都能来玩，并且能玩得开心。


### 社区依托于github

大部分的js框架社区代码都是放在github上，但很少人会用到github的api。

github开发的api非常有用，我们的部署环境和文档环境想要串起来，离不开API的使用。

这里推荐个Node模块：*node-github*，封装了github的大部分接口，调用非常方便。

想要调用github接口，绕不开用户验证，推荐使用token验证：

    github.authenticate({
        type: "oauth",
        token: "这是用户名token"
    });

还需要个*shelljs*模块用于服务器执行*git pull*拉取库代码，在使用中发现一些坑，比如pull时老是提示代码已经最新等。

    shell.exec('cd uploader && git pull', function(code, output) {
        if (code === 0) {
            log('git pull success');
        } else {
            log('git pull fail');
        }
    });

### 打破“大锅饭”

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

我们没有使用github文档服务，而是建了个文档服务器，服务器上挂了markdown解析器*marked*，创建了一套统一的模版和皮肤。

当然这样做成本比较高，我们需要解决文档服务器拉取github库代码的同步问题，最省力的方式，还是使用github的文档服务。

### 版本号的纠结

kissy gallery中版本号是作为目录名存在的，当用户使用时候，use的模块名会带上版本号，比如：

    S.use('gallery/auth/1.5/index', function (S, Auth) {
        var auth = new Auth('#J_Auth');
    })

这种方式属于简单粗暴型，优雅的方式建议使用git的分支机制来处理版本，新版本开发打个版本分支出来，发布时打个tag，不推荐使用kissy gallery这样的方式。

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

理想的部署方案是使用github的web hook，用户提交代码时，就可以自动触发部署， 但发布系统一般是在内网，hook的方式只能放弃。

社区代码的部署分二个部分：

* 代码cdn的部署
* 文档、demo等的部署

核心的目标是开发者可以自主部署自己的代码，强调部署的敏捷性。

当然安全性需要考虑，kissy gallery代码会部署到阿里的cdn，如果让人随意提交，是很危险的，所以需要考虑权限问题。

务必避免开发者使用覆盖式的发布！可以通过系统手段强制开发者打个新版本。

我的同事翰文完成了个kpm的内部发布系统。

![kpm](http://www.36ria.com/wp-content/uploads/2013/08/2013-8-18-18-03-27.png)

内网账号匹配组件中的邮箱信息的方式控制部署权限。

核心还是调用github的api拉取代码，并将发布后的cdn信息反馈到github的issue上。

文档、demo的部署，最省力的方式还是直接使用github的静态文件功能。

如果像kissy gallery一样使用独立的文档服务器，会麻烦些，您还需要写个服务处理组件库代码的同步，篇幅有限，就不展开论述。

### 谈谈社区的运营

社区好了，没有卖力的运营，再好的楼盘，最后也会变成鬼城。

目前kissy gallery的运营措施：

* 数据运营：每周向作者披露组件数据和社区发展状态
* 社区宣传：每周推荐高质量组件
* 活动运营：组织组件大赛

运营的关键字在于坚持，数据的运营特别重要，可以让人直观的感受到这是一个活着的社区。

### 总结

目前我们还在做单元测试的接入，单元测试的话题很有意思，限于篇幅，无法展开论述。

万事开头难，社区的建设难在初期，当您的社区有100+的组件，40+的作者时，“孩子”就可以断奶，运转起来。


kissy gallery：http://gallery.kissyui.com
yui3 gallery：https://github.com/yui/yui3-gallery
node-github: http://mikedeboer.github.io/node-github/
ShellJS: https://github.com/arturadib/shelljs
marked：https://github.com/chjj/marked
yeoman：http://yeoman.io
grunt：http://gruntjs.com/



