
//针对gallery-db的处理

var fs = require('fs');
var dataJson =  './gallery-db/component-info.json';
//管理员配置的组件数据会覆盖dataJson
var adminComJson = './gallery-db/admin-com-info.json';
//系统标签
var systemTags = './gallery-db/system-tags.json';
//用户定义的标签
var authorTags = './gallery-db/author-tags.json';
//广告数据
var adJson = './gallery-db/ad.json';

/**
 * 获取组件数量
 * @param coms
 * @returns {*}
 */
function getComsLen(coms){
    coms = coms.split(',');
    var newComs = [];
    for(var i = 0;i<coms.length;i++){
        var isExist = false;
        for(var j = 0;j<newComs.length;j++){
            if(coms[i] == newComs[j]){
                isExist = true;
                return true;
            }
        }
        if(!isExist) newComs.push(coms[i]);
    }
    return newComs.length;
}

function pageData(data){
    var data = JSON.parse(data);
    var authors = data.authors;
    data.authorCount = 0;
    data.comsCount = 0;
    for(author in authors){
        data.authorCount ++;
    }
    for(com in data.components){
        data.comsCount ++;
    }
    data.pretty = true;
    return data;
}


//获取组件数据
exports.coms = function(callback){
    console.log(adminComJson)
    fs.readFile(dataJson, { encoding: 'utf8' }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            //组件数据
            var data = pageData(data);
            //管理员配置的组件数据会覆盖dataJson
            fs.readFile(adminComJson, { encoding: 'utf8' }, function (err, adminComData) {
                var adminComData = adminComData ? JSON.parse(adminComData) : null;
                //组件数据

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
                var components = data.components;
                var newComs = [];
                //管理员配置替换用户配置信息
                data.components.forEach(function(item){
                    if(adminComData){
                        var adminCom = adminComData[item.name];
                        //系统组件配置存在该组件
                        if(adminCom){
                            for(var infoKey in adminCom){
                                item[infoKey] = adminCom[infoKey];
                            }
                        }
                    }
                    if(item.name == 'uploader'){
                        console.log(item);
                    }
                    if(!item.beta){
                        if(item.name == 'uploader'){
                            console.log(2);
                        }
                        newComs.push(item);
                    }
                })
                data.components = newComs;
                //默认根据时间来排序
                data.components = newComs.sort(function(a,b){
                    return b.created_at - a.created_at ;
                });
                console.log(data.components);
                fs.readFile(systemTags,{encoding: 'utf8'},function(err,systemTagsData){
                    var systemTagsData = JSON.parse(systemTagsData);
                    data.systemTags = systemTagsData;
                    fs.readFile(authorTags,{encoding: 'utf8'},function(err,authorTagsData){
                        if(err){
                            console.log(err);
                        }else{
                            var arr = [];
                            var authorTagsData = JSON.parse(authorTagsData);
                            for(tagName in authorTagsData){
                                arr.push({tagName:tagName,coms:authorTagsData[tagName]});
                            }
                            arr.sort(function(a,b){
                                var al = getComsLen(a.coms);
                                var bl = getComsLen(b.coms);
                                return bl-al;
                            });
                            authorTagsData = {};
                            for(var i = 0;i<arr.length;i++){
                                var item = arr[i];
                                authorTagsData[item.tagName] = item.coms;
                            }
                            data.authorTags = authorTagsData;
                            //读取广告数据
                            fs.readFile(adJson,{encoding: 'utf8'},function(err,ads){
                                if(err){
                                    console.log(err);
                                }else{
                                    ads = JSON.parse(ads);
                                    var newAds = [];
                                    for(i in ads){
                                        var ad = ads[i];
                                        var expire = ad.expire;
                                        var timestamp = Number(new Date(expire).getTime());
                                        var now = Number(new Date().getTime());
                                        console.log(now-timestamp);
                                        //不显示过期的广告
                                        if(now-timestamp < 0){
                                            newAds.push(ad);
                                        }
                                    }
                                    data.ads = newAds;

                                    callback && callback(data);
                                }
                            })
                        }
                    })
                })

            })
        }
    });
}
