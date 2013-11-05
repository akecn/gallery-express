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
                        var authorTagsData = JSON.parse(authorTagsData);
                        var arr = [];
                        for(tagName in authorTagsData){
                            arr.push({tagName:tagName,coms:authorTagsData[tagName]});
                        }
                        arr.sort(function(a,b){
                            var al = a.coms.split(',').length;
                            var bl = b.coms.split(',').length;
                            return bl-al;
                        });
                        authorTagsData = {};
                        for(var i = 0;i<arr.length;i++){
                            var item = arr[i];
                            console.log(item);
                            authorTagsData[item.tagName] = item.coms;
                        }
                        data.authorTags = authorTagsData;
                        res.render('coms', data);
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