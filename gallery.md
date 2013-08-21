# 从kissy gallery的重构谈js框架社区建设

kissy是阿里前端自主开发的js框架，但生态圈的基础建设却非常薄弱，社区贡献代码的人寥寥无几。
kissy的困境，算是国内js框架的缩影，国内不缺js框架，但出现完整生态圈形态的极少，所以我们都很羡慕jQuery。

kissy早期的社区建设借鉴的是yui3 gallery，但发现这路子行不通，贡献代码的成本太高，从提交到部署整个流程走完，基本上把开发者吓跑了。

所以今年重构了gallery社区，通过建立工具和自动化的系统，降低开发者的贡献成本，我们希望建一个像jQuery一样的广场，尽可能拿掉门槛。

我们用到的工具有github、Nodejs、yeoman、grunt、markdown、RMS（阿里的cdn发布系统）。

社区系统的大致流程如下：

![flow](http://www.36ria.com/wp-content/uploads/2013/08/mockup.png)

### 社区依托于github

github是前端工程师的宝库，github还有开放大部分功能的API，缺少这些API，我们很难完成自动化的流程，所以github是社区最好的归属。

这里推荐个Node模块：*node-github*，封装了github的大部分接口，调用非常方便。

github的部分API是需要账户验证的，可以使用用户名和密码进行验证，比如下面的代码：

    var GitHubApi = require("github");
    var github = new GitHubApi({
        version: "3.0.0",
        timeout: 5000
    });
    github.authenticate({
        type: "basic",
        username: username,
        password: password
    });

不推荐使用这样的，会把用户名和密码暴露出去，github还支持token验证，进入github的applications页面创建一个token（一般选择“Personal Access Tokens”即可）。

    github.authenticate({
        type: "oauth",
        token: "这是你的token"
    });

接下来我们来完成文档服务器（域名：gallery.kissyui.com）pull一个开发者开发的组件uploader的例子：

	var shell = require('shelljs');
	var reposName = 'uploader';
	github.repos.get({
	    //组织名
		user: 'kissygalleryteam',
		//库名
		repo: reposName
	}, function(err) {
		if (err) {
			res.write('error to find repo');
			res.end();
		} else {
		    //进入uploader目录，执行git pull命令，更新文档服务器上的uploader库代码
            shell.exec('cd uploader && git pull', function(code, output) {
                if (code === 0) {
                    log('git pull success');
                } else {
                    log('git pull fail');
                }
            });
		}
	});

实际生产环境的代码要比上面的demo复杂的多，要考虑库是否存在，第一次是git clone等。

这里我们用到了*shelljs*模块，来运行git的命令。

在使用中发现一些坑，比如pull时老是提示代码已经最新...


### 打破“大锅饭”

yui3 gallery是一个库，开发者提交的代码都往里面丢，这样做造成如下问题：

* “大锅饭”思路，模糊了组件的独立性和私有性，降低开发者提交和维护的积极性
* 库代码很臃肿，用户如果有修改的需求，往往一个组件需要clone整个gallery库
* 不利用组件数据的追踪

kissy gallery是把gallery当成github中的组织，各个组件独立成库，化整为零，开发者对自己的组件负责。

日后做组件的数据报表时，就可以使用github的api拉取各个组件的的信息，比如star数、fork数、创建时间、更新时间、issue等。

如果采用yui3 gallery的方式，很难满足数据上的需求。

### 使用markdown解决文档混乱问题

旧的kissy gallery，开发者可以随意丢html页面上去做文档，导致文档千人千面，阅读体验极差，使用者骂声一片。

于是我们强制开发者使用markdown写文档，有如下好处：

* github可以自动解析markdown文档
* 用户只需关注文档内容
* 可以使用风格一致的文档皮肤

我们没有使用github文档服务，而是建了个文档服务器，服务器上挂了markdown解析器*marked*，创建了一套统一的模版和皮肤。

marked可以把md文件解析成html内容，结合jade就可以输出文档页面了。

    var marked = require('marked');

    function renderMD(urlPath, postTitle, res) {
    	fs.readFile(urlPath, 'utf8', function(err, data) {
    		if (err) {
    		    //...
    		} else {
    			//词法分析
    			var tokens = marked.lexer(data);
    			//解析成html内容
    			var htmlContent = marked.parser(tokens);
    			res.render('show', {
    			    postTitle:postTitle,
    				blogContent: htmlContent,
    				pretty: true
    			});
    		}
    	});
    }

    exports.demoMd = function(req, res, next) {
    	var baseUrl = process.cwd(),
    		urlPath = path.resolve(baseUrl, './uploader/1.4/guide/index.md');

    	renderMD(urlPath, 'Uploader 使用指南', res);
    };

配个路由，外部访问路径：http://gallery.kissyui.com/uploader/1.4/guide/index.html。

当然这样做成本比较高，我们需要解决文档服务器拉取github库代码的同步问题，最省力的方式，还是使用github的文档服务。

### 版本号的纠结

kissy gallery中版本号是作为目录名存在的，当用户使用时候，use的模块名会带上版本号，比如：

    KISSY.use('gallery/auth/1.5/index', function (S, Auth) {
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

yeoman就像个工厂，生产的不是产品，而是“流水线”，流水线可以保证输出工程的标准和高效率，网上还有generator-backbone、generator-angular、generator-ember等，您也可以定义属于自己的流水线。

第一步：copy一个demo生成器

    git clone https://github.com/passy/generator-generator.git

将generator-generator代码拉到本地，然后改下目录名称，比如将其改成generator-XXX。

第二步：执行npm link命令，链接成全局模块，供开发时使用。

第三步：修改app/index.js,类继承于yeoman.generators.Base

    var util = require('util');
    var path = require('path');
    var yeoman = require('yeoman-generator');

    module.exports = XXX;
    function XXX(args, options, config) {
        yeoman.generators.Base.apply(this, arguments);
        console.log("模块初始化完成！");
    }

    util.inherits(Gallery, yeoman.generators.Base);

到这里，你可以试着在命令行工具，输入yo XXX，正常的话就会在命令行界面打印出文案。

在yeoman中，可以定义些问询，让用户配置参数，比如下面的代码：

    XXX.prototype.askAuthor = function(){
        var cb = this.async();
        var prompts = [{
            name: 'author',
            message: 'author of component:',
            default: 'kissy-team'
        }];

        this.prompt(prompts, function (err, props) {
            if (err) {
                return this.emit('error', err);
            }
            this.author = props.author;
            cb();
        }.bind(this));
    }

一个最简单的流水线构造完毕，更详细的技术细节请看文章后面的《yeoman中文教程》链接。

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

如果像kissy gallery一样使用独立的文档服务器，会麻烦些，您还需要写个服务处理组件库代码的同步等。

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


* kissy gallery：http://gallery.kissyui.com
* yui3 gallery：https://github.com/yui/yui3-gallery
* node-github: http://mikedeboer.github.io/node-github/
* github的token申请：https://github.com/settings/applications
* uploader: https://github.com/kissygalleryteam/uploader
* ShellJS: https://github.com/arturadib/shelljs
* marked：https://github.com/chjj/marked
* yeoman：http://yeoman.io
* yeoman中文教程：http://www.36ria.com/6144
* grunt：http://gruntjs.com/



