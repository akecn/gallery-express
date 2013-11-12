/*
 * GET home page.
 */

var config = require('../config');
var fs = require('fs');
var dataJson =  './gallery-db/component-info.json';
//系统标签
var systemTags = './gallery-db/system-tags.json';
//用户定义的标签
var authorTags = './gallery-db/author-tags.json';
var adJson = './gallery-db/ad.json';

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

exports.index = function (req, res) {
    fs.readFile(dataJson, {
        encoding: 'utf8'
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var data = pageData(data);
            res.render('index', data);
        }
    });
};
exports.coms = function (req, res) {
    fs.readFile(dataJson, { encoding: 'utf8' }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var data = pageData(data);
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
                                res.render('coms', data);
                            }
                        })
                    }
                })
            })
        }
    });
};

exports.list = function (req, res) {
    fs.readFile(dataJson, {
        encoding: 'utf8'
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.parse(data);
            res.render('list', data);
        }
    });
};

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