var fs = require('fs');
var path = require('path');

//首页广告数据
var adJson = './gallery-db/kissy-index-ad.json';
//所有组件信息数据
var comsJson = './gallery-db/component-info.json';
var dbMap = require('../lib/db-map');
/**
 * kissy首页广告
 * @param req
 *      req.query.callback jsonp回调
 * @param res
 */
exports.indexAd = function(req, res){
    var callback = req.query.callback;
    fs.readFile(adJson, { encoding: 'utf8' }, function (err, ads) {
        if (err) {
            console.log(err);
        } else {
            ads = JSON.parse(ads);
            var newAds = [];
            for(i in ads){
                var ad = ads[i];
                var expire = ad.expire;
                var timestamp = Number(new Date(expire).getTime());
                var now = Number(new Date().getTime());
                //不显示过期的广告
                if(now-timestamp < 0){
                    newAds.push(ad);
                }
            }
            newAds = {data:newAds};
            newAds = JSON.stringify(newAds);
            //如果带有callback，组装jsonp数据
            if(callback){
                newAds = callback + '('+newAds+')';
            }
            res.send(newAds);
        }
    });
}
/**
 * 获取所有最新的组件列表
 * @param req
 *      req.query.len 返回的数据量
 *      req.query.callback jsonp回调
 * @param res
 */
exports.coms = function(req,res){
    //默认取12条组件数据
    var len = req.query.len || 12;
    var callback = req.query.callback;
    dbMap.coms(function(data){
        var coms = data.components;
        //截取指定数量的数据
        coms = coms.splice(0,len);
        coms = {
            result: coms,
            success:1
        }
        coms = JSON.stringify(coms);
        //如果带有callback，组装jsonp数据
        if(callback){
            coms = callback + '('+coms+')';
        }
        res.send(coms);
    })

}

/**
 * 获取组件所有的历史版本（主要用于文档页面）
 * @param req
 * @param res
 */
exports.version = function(req,res){
    var r = [];
    var name = req.query["name"];
    var dirPath = path.join('./',name);
    if(!fs.existsSync(dirPath)){
        r = {
            "success":false
        };
    }else{
        fs.readdirSync(dirPath).forEach(function(i){
            var stat = fs.statSync(path.join(dirPath,i));
            if(stat.isDirectory()&&new RegExp(/\d+.\d+/).test(i)){
                r.push(i);
            }
        });
        r = {
            "success":true,
            "list":r
        };
    }
    r = JSON.stringify(r);
    res.send(r);
}

/**
 * 搜索组件接口
 * @param req
 * @param res
 */
exports.search = function(req,res){
    var name = req.query.name;
    var callback = req.query.callback;
    //读取组件
    dbMap.coms(function(data){
        var coms = data.components;
        var searchComs = [];
        var reg;
        coms.forEach(function(com){
            reg = new RegExp(name);
            if(reg.test(com.name)){
                searchComs.push(com);
            }
        })

        var sData = JSON.stringify({
            result : searchComs,
            success: searchComs.length > 0
        });
        //如果带有callback，组装jsonp数据
        if(callback){
            sData = callback + '('+sData+')';
        }
        res.send(sData);
    })
}
