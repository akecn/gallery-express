var fs = require('fs');
var path = require('path');

//首页广告数据
var adJson = './gallery-db/kissy-index-ad.json';
//所有组件信息数据
var comsJson = './gallery-db/component-info.json';

//kissy首页广告
exports.indexAd = function(req, res){
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
            newAds = JSON.stringify(newAds);
            res.send(newAds);
        }
    });
}
/**
 * 获取所有最新的组件列表
 * @param req
 *      req.query.len 返回的数据量
 *      req.query.callback jsonp回掉
 * @param res
 */
exports.coms = function(req,res){
    //默认取12条组件数据
    var len = req.query.len || 12;
    var callback = req.query.callback;
    fs.readFile(comsJson, { encoding: 'utf8' }, function (err, coms) {
        if (err) {
            console.log(err);
        } else {
            var comsData = JSON.parse(coms);
            /* demo :
             [
                {
                    "name": "auth",
                    "version": "1.5",
                    "desc": "表单验证组件，新版测试中...",
                    "cover": "",
                    "tag": "表单,表单验证",
                    "author": {
                        "name": "张挺/明河",
                        "email": "zhangting@taobao.com",
                        "page": "https://github.com/czy88840616",
                        "md5": "78be5c66a336222dd063f8a115712a38"
                    },
                    "type": "kissy-pie",
                    "type-url": "http://abc.alibaba-inc.com/r/kissy-pie",
                    "forks": 2,
                    "watchers": 3,
                    "updated_at": 1377782551000,
                    "created_at": 1369624383000,
                    "description": "表单验证组件",
                    "size": 299
                }
            ]*/
            comsData = comsData.components;

            var newComsData = comsData.sort(function(a,b){
                return b.created_at - a.created_at ;
            });
            //截取指定数量的数据
            newComsData = newComsData.splice(0,len);
            newComsData = {
                result: newComsData,
                success:1
            }
            newComsData = JSON.stringify(newComsData);
            //如果带有callback，组装jsonp数据
            if(callback){
                newComsData = callback + '('+newComsData+')';
            }
            res.send(newComsData);
        }
    });
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
    r = JSON.stringify(r)
    res.send(r);
}
