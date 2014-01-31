/*
 * GET home page.
 */

var config = require('../config');
var fs = require('fs');
var dataJson =  './gallery-db/component-info.json';
var dbMap = require('../lib/db-map');

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
/**
 * 获取组件列表
 * @param req
 * @param res
 */
exports.coms = function (req, res) {
    dbMap.coms(function(data){
        res.render('coms', data);
    })
};
/**
 * list页面新版已经废弃
 * @param req
 * @param res
 */
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
