# 十五分钟开发一个kissy组件

gallery首页地址为：[http://gallery.kissyui.com/](http://gallery.kissyui.com/)，

请先加入组件作者旺旺群：*600859238*。

合并代码到官方库：伯才

（PS:请使用yo kissy-gallery:merge命令自助merge）

发布：承玉

答疑：伯方、翰文

组件迁移：伯才

视频教程：[优酷](http://v.youku.com/v_show/id_XNTYwMzgxNDI4.html)，[youtube](http://youtu.be/quMgyoO8zB8)

## Step0: 在github中创建个组件库

比如，你的组件名称是EditorUploader，创建个库名叫[editorUploader](https://github.com/minghe/editorUploader)。

然后clone这个库到你本地。

留意：库名必须是组件名，fork到官方库后，如果有修改需求，请联系翰文，不然会出现无法发布的问题！

## Step1: 安装kissy gallery组件工具

````sh
npm install yo grunt-cli -g
````

````sh
npm install generator-kissy-gallery -g
````

请确保本地带有NodeJs和Npm环境。

## Step2:创建组件目录

进入之前clone的库目录，比如editorUploader/。

打开命令行工具，执行如下命令：

````sh
yo kissy-gallery 1.0
````

1.0为组件起始版本目录，可以自由设置。

工具会询问您组件的作者和email，这是必须输入的：

![ask](http://s2.36ria.com/201305/4922/35447_o.png)

构建成功后的目录如下：

![fold](http://s1.36ria.com/201305/4922/35448_o.png)

目录和各个文件的用途可以看[Kissy Gallery组件开发规范说明](http://gallery.kissyui.com/guide)。

## Step3:打包文件

假设组件已经开发完成，发布前需要打包压缩下文件，运行如下命令：

````sh
grunt
````

（PS:默认只打包index.js，如果组件有其他需求，请修改gruntfile.js的打包配置）

打包成功后，会在build目录下生成*index.js*和*index-min.js*。

## Step4:补充组件描述、教程、demo

打开abc.json，修改组件信息，比如像下面的内容：


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

page字段指向你的个人主页，

cover字段为组件封面图片。


### 组件使用教程和demo

组件的所有的教程，必须放在guide目录下，而且必须是md文件，服务器会自动渲染成html页面。

demo必须放在demo目录，所有的demo请仿照着demo/index.html来写，特别是gallery包的配置。

guide的访问地址示例：[http://gallery.kissyui.com/imgcrop/2.0/guide/index.html](http://gallery.kissyui.com/imgcrop/2.0/guide/index.html)。

demo的访问地址示例：[http://gallery.kissyui.com/imgcrop/2.0/demo/index.html](http://gallery.kissyui.com/imgcrop/2.0/demo/index.html)。

请把demo的入口放在guide的md文件内。

## Step5:发布组件

### 第一次发布在[kpm](https://github.com/kissygalleryteam/kpm/issues)下建一个issue

issue的内容可以参考：[editorUploader组件](https://github.com/kissygalleryteam/kpm/issues/26)，正文带上你用户名下的组件库路径。

issue标题统一为:add 组件名称。

新建issue的目的有二个：

* 通知官方库管理员fork你的组件库(审核)
* 当你的组件发布成功后，系统会反馈发布消息到你建的issue。


### 向官方库发送pull request

前提是管理员已经fork你的组件库。

将你的代码提交到自己的github库后，使用命令：

````sh
yo kissy-gallery:merge
````

该命令实现如下功能：

* 自动将更新推送到官方库，相当于执行github的pull request
* 官方库自动merge你的更新
* 同步组件文档
* 预发你的代码

### 通知承玉发布代码

发布同时会合并你的代码到官方库。

发布成功后，系统返回的消息类似如下：

![发布消息](http://img03.taobaocdn.com/tps/i3/T1jc9mXpNiXXbmmmfY-272-368.png)

*组件的abc.json中写上author的name和email，不然会发布失败！*

### 完整流程如下

![kissy gallery组件发布流程](http://img02.taobaocdn.com/tps/i2/T1dBKnXtNgXXaGUE2E-714-565.png)






