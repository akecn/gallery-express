mCom = require('../model/com')

###
获取所有组件
###
exports.all  = (req,res)->
  stream = mCom.all(req,res)