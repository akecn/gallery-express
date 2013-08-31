/*
 * GET home page.
 */

var config = require('../config');
var fs = require('fs');
var dataJson =  './gallery-express/component-info.json';
//系统标签
var systemTags = './gallery-db/system-tags.json';
//用户定义的标签
var authorTags = './gallery-db/author-tags.json';

exports.index = function (req, res) {
    fs.readFile(dataJson, {
        encoding: 'utf8'
    }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.parse(data);
            data.pretty = true;
            res.render('index', data);
        }
    });
};
exports.coms = function (req, res) {
    fs.readFile(dataJson, { encoding: 'utf8' }, function (err, data) {
        if (err) {
            console.log(err);
        } else {
            var data = JSON.parse(data);
            data.pretty = true;
            fs.readFile(systemTags,{encoding: 'utf8'},function(err,systemTagsData){
                var systemTagsData = JSON.parse(systemTagsData);
                data.systemTags = systemTagsData;
                fs.readFile(authorTags,{encoding: 'utf8'},function(err,authorTagsData){
                    if(err){
                        console.log(err);
                    }else{
                        var authorTagsData = JSON.parse(authorTagsData);
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