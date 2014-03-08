fs = require 'fs'
_ = require 'underscore'
dbMap = require '../lib/db-map'

#作者定义的标签列表
AUTHOR_TAGS = './gallery-db/author-tags.json'
#管理员定义的标签
SYSTEM_TAGS = './gallery-db/system-tags.json'


###
获取标签的组件列表
###
getcoms = (tag,tags)->
  console.log tag
  console.log tags
  tags = JSON.parse tags
  coms = tags[tag]
  console.log coms
  unless coms
    return []
  coms = tags.split(',')
  return coms

###
获取指定tag的组件列表
###
exports.coms = (req,res)->
  #标签名称
  tagName = req.params.name
  fs.readFile SYSTEM_TAGS,'utf8',(err,systemTags)->
    if err
      console.log err
      return false
    systemTags = JSON.parse systemTags
    systemComs = systemTags[tagName]
    systemComs = systemComs && systemComs.split ',' || []

    fs.readFile AUTHOR_TAGS,'utf8',(err,authorTags)->
      if err
        console.log err
        return false

      authorTags = JSON.parse authorTags
      authorComs = authorTags[tagName]
      authorComs = authorComs && authorComs.split(',') || []
      console.log systemComs
      #合并管理员标签和用户标签定义的组件
      coms = _.union(authorComs,systemComs)
      unless coms.length
        res.render '404', {"msg":tagName+"标签下不存在组件"}

      #获取所有组件数据
      dbMap.coms (data)->
        newcoms = [];
        components = data.components
        coms.forEach (comName)->
          components.forEach (com)->
            if com.name == comName
              newcoms.push(com)
              return true
        data.components = newcoms
        data.tag = tagName
        res.render 'coms', data
