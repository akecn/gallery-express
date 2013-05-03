# 十五分钟开发一个kissy组件

## Step1: 安装kissy gallery组件工具

````sh
npm install yo grunt-cli -g
````

````sh
npm install generator-kissy-gallery -g
````

请确保本地带有NodeJs和Npm环境。

## Step2:创建组件目录

手动创建一个组件目录，比如offline。

进入该目录，打开命令行工具，执行如下命令：

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

## Step5:补充组件描述

打开*abc.json*，修改组件信息：


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


## Step5:发布组件

![kissy gallery组件发布流程](http://img02.taobaocdn.com/tps/i2/T1dBKnXtNgXXaGUE2E-714-565.png)

第一次发布会麻烦些，需要在kpm下建一个issue，需要gallery管理员在kissygalleryteam用户名下fork你的库。

后面的发布就简单了，发个pull request，然后通知承玉发布即可。

当你的组件发布成功后，系统会反馈发布消息到你建的issue。

issue的内容可以参考：[velocity组件](https://github.com/kissygalleryteam/kpm/issues/5)，正文带上你用户名下的组件库路径。

issue标题统一为:add module 组件名称。

发布成功后，系统返回的消息类似如下：

![发布消息](http://img03.taobaocdn.com/tps/i3/T1jc9mXpNiXXbmmmfY-272-368.png)

*组件的abc.json中写上author的name和email，不然会发布失败！*









