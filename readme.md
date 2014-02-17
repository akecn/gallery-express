# kissy gallery组件开发规范说明

## 安装工具

```javascript
npm install generator-kpm -g
```

generator-kpm 由明正开发和维护，工具的详细使用说明请看[generator-kpm](https://github.com/kissygalleryteam/generator-kpm)。

工具依赖于yoeman，如果本机没有安装，请先安装yeoman：

```javascript
npm install yo -g
```

## 使用工具生成组件目录

```javascript
yo kpm 1.0
```

打包运行：

```javascript
grunt
```

## 目录规范

拿 offline 举例，具体的可以参考[example](https://github.com/kissygalleryteam/offline "例子") :

```
offline           // 组件目录名, 小写, 多字符用 – 分隔
|          |-----1.0    // 版本名字, 两个数字表示 x.x
|          |         |---------demo                         // 用于存放demo的文件夹
|          |         |---------doc                          // 用于存放组件api文档的文件夹
|          |         |---------plugin                       // 用于存放组件的插件，可以没有
|          |         |---------build                       // 用于存放组件打包后的文件
|          |         |---------guide                        // 用于介绍组件入门的文件夹
|          |         |              |--------index.md       // 用于介绍组件入门的文档
|          |         |---------spec                        // 单元测试放的目录
|          |         |---------index.js                     // 组件入口文件
|          |         |---------index.deps.js                    // 组件combo时使用的配置信息
|          |-----README.md                                  	// 用于介绍组件信息和版本更新
|          |-----abc.json                                 // 组件信息（用于首页显示信息）
|          |-----gruntfile.js                                 // grunt打包时使用的配置信息
```

### 规范说明

* 统一使用 UTF-8编码；
* 模块起始必须是gallery名，比如"gallery/offline/1.0/index"
* index.js为组件入口文件，必须存在
* abc.json为组件信息，用于首页的组件信息显示，必须存在（有工具后会自动生成）
* 组件的教程放在<code>guide</code>目录下，必须是<code>md</code>文件，不能是静态html页面！
* 可以在package.json中指定打包发布模块
* 打包后的文件会放在<code>build</code>目录中，发布到cdn上的只是build目录下的文件
* **.deps.js为组件combo配置，日后工具会自动生成
* README.md必须存在，简单介绍下组件信息！

### abc.json内容

```javascript
{
    "name": "uploader",
    "version":"1.4",
    "author":{"name":"明河","email":"minghe36@126.com","page":"https://github.com/minghe"},
    "cover":"http://img02.taobaocdn.com/tps/i2/T1C1X_Xs8gXXcd0fwt-322-176.png",
    "desc":"异步文件上传组件"
}
```

想要在首页显示头像，email字段需要是[gravatar](http://cn.gravatar.com/)上的，没有的话可以到gravatar上传一个。

page字段指向你的个人主页。

cover字段为组件封面图片


## 组件发布

我们需要把组件发布到淘宝cdn上，方便用户直接引用，kissy1.3配置了<code>gallery</code>包指向，淘宝cdn的地址，这样用户不需要额外配置gallery的包路径。

## 组件调试

组件初始化脚本demo：

```javascript
    KISSY.use('gallery/offline/1.0/index',function (S,Offiline) {
        var a = new Offiline();
    });
```

<code>use()</code>加载的模块命名起始为gallery，缺少这个层级，在本地调试时就会报模块找不到的错误。

### 配置gallery包

本地调试，请配置gallery包路径

```javascript
    if (KISSY.Config.debug) {
        KISSY.config({
          packages:[
            {
              name:"gallery",
              tag:"20111220",
              path:"../../../",
              ignorePackageNameInUri:true,
              charset:"utf-8"
            }
          ]
        });
    }
```

这样就可以使用本地源码文件进行调试了。

ignorePackageNameInUri这个配置参数，可以不让路径带上gallery目录，这样本地就不需要创建一个gallery目录。

## 如何组织组件代码

一个组件模块代码如下

```javascript
/**
 * @fileoverview 文件用户
 * @author 作者的
 **/
KISSY.add(function(S, Node, Base) {
    var EMPTY = '';
    var $ = Node.all;
    /**
     * @name ImageZoom
     * @class 图片放大器
     * @since 1.4
     * @constructor
     * @extends Base
     */
    function ImageZoom(config) {
        var self = this;
        //调用父类构造函数
        ImageZoom.superclass.constructor.call(self, config);
    }
    S.extend(ImageZoom, Base, /** @lends ImageZoom.prototype*/{

    }, {ATTRS : /** @lends ImageZoom*/{

    }});
    return ImageZoom;
}, {requires : ['node','base']});
/**
 * changes:
 * 明河：1.4
 *           - XXXX
 */
```

use时

``` 
KISSY.use('gallery/uploader/1.4/plugins/imageZoom/imageZoom', function(S, ImageZoom) {
   new ImageZoom();
});
```

## 代码规范

* 代码基于kissy1.3，无需兼容kissy1.1.6
* add()模块时，不要加上模块名称，使用工具自定生成
* 组件请继承base模块，使用get()和set()方法获取/设置属性
* 推荐使用Node方式获取节点
* 不在模块内动态<code>use()</code>js和css
* 复杂组件请继承RichBase
* 组件注释符合YUIDoc规范
* js中需要模版的请使用xtemplate模块
* 请不要直接向KISSY全局变量注入属性或方法