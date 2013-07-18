GitHubApi = require "github"
fs = require 'fs'
crypto = require 'crypto'

galleryGithub = new GitHubApi({
version: "3.0.0",
timeout: 5000
})
#验证github账号
galleryGithub.authenticate({
type: "oauth",
token: "7d9e8064e9b3e5d5311c6eabe9fcf6d1243481f8"
})

INFOS_URL = 'gallery-express/component-info.json'

#同步组件信息
syncCom = (com,callback)->
  path = "#{com}/abc.json";
  comInfos = INFOS_URL;
  fs.readFile path,'utf8',(err,data)->
    if err
      callback && callback({},{})
      return false
    if data
      try
        data = JSON.parse(data);
        if data.author.email
          md5 = crypto.createHash 'md5'
          md5.update data.author.email, 'utf8'
          data.author.md5 = md5.digest 'hex'
        #读取所有组件的信息
        fs.readFile comInfos,'utf8',(err,coms)->
          if coms
            try
              coms = JSON.parse coms
              authors = coms.authors
              authors[data.author.name] = data.author

              isExist = false
              for com,i in coms.components
                if com.name is data.name
                  isExist = true;
                  addGithubData(data,(comData)->
                    coms.components[i] = comData
                    writeJson(coms,->
                      callback && callback(comData,coms)
                    )
                  )
                  return true

              unless isExist
                addGithubData(data,(comData)->
                  coms.components.push(comData);
                  writeJson(coms,->
                    callback && callback(comData,coms)
                  )
                )
###
添加github的库信息
###
addGithubData = (data,callback)->
  #加入github的组件信息
  galleryGithub.repos.get({
  user: 'kissygalleryteam',
  repo: data.name
  },(err,result)->
    unless result.message
      keys = ['forks','watchers','updated_at','created_at','description','size']
      for key in keys
        data[key] = result[key]
      callback && callback(data)
  )
###
将组件信息写入到component-info.json内
###
writeJson = (coms,callback)->
  coms.count = coms.components.length
  coms.update = Date.now()
  fs.writeFile(INFOS_URL, JSON.stringify(coms),(err)->
    callback && callback(coms);
  )

exports.sync = (req,res)->
  com = req.params.name
  syncCom(com,(data)->
    res.json data
  )

exports.syncAll = (req,res)->
  result =
    authors: {},
    components: [],
    date: Date.now()
  writeJson(result,->
    dirs = fs.readdirSync('./')
    i = 0

    sync = (name,coms)->
      i++
      if i is dirs.length+1
        coms && res.json coms
        return true
      syncCom(name,(com,coms)->
        sync dirs[i],coms
      )

    sync dirs[i]
  )

exports.getInfo = (req,res)->
  comName = req.params.name
  json = {}
  unless comName
    return res.send('组件名不能为空！')
  fs.readFile INFOS_URL,'utf8',(err,data)->
    data = JSON.parse data
    coms = data.components
    for com in coms
       if com.name is comName
         json = com
    res.json json