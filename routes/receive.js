/**
 * GET gallery docs.
 */
var path = require('path');
var fs = require('fs');
var getDb = require('../mongo').getDb;
var writeDb = require('../mongo').writeDb;
var updateDb = require('../mongo').updateDb;
var removeDb = require('../mongo').removeDb;
var dateFormat = require('dateformat');

function writeLog(msg, detail){
  var time = new Date();
  var obj = {
    time: time,
    msg: msg,
    detail: detail
  };
  writeDb('log', obj, new Function());
}

exports.write = function(req, res, next) {

  var time = Date.now();

  if (!req.body.payload) {
    var commits = req.body;
  } else {
    var commits = JSON.parse(req.body.payload);
  }

  var action = commits.action;
  // 只对pull请求接受
  if (action && (action == 'opened' || action == 'closed')) {

    var recode = {
      action: action,
      name: commits.repository.name,
      time: dateFormat(time, 'isoDateTime'),
      html_url: commits.pull_request.html_url,
      number: commits.number
    };

    updateDb('commits', {number: recode.number, name: recode.name}, recode, function(err){
      if (err) {
        writeLog('commit记录写入失败', req.body);
        next();
      } else {
        writeLog('commit记录写入成功');
      }
      res.json({"status": 200});
    });
  } else {
    res.json({"status": 200, "message": "ignored info"});
  }

};

exports.commits = function(req, res, next){
  var name = req.query.name;
  var action = req.query.action;
  var emptyHistory = req.query.emptyHistory;
  var query = {};
  if (name) query = {name: name};
  if (action) query.action = action;
  getDb('commits', query, function(err, json){
    res.json(json);
    //清空数据
    //if (emptyHistory) removeDb('commits', function(err){
      //writeLog('清空commits表数据', err);
    //});
  });
};

exports.log = function(req, res, next){
  var emptyHistory = req.query.emptyHistory;
  getDb('log', {}, function(err, json){
    res.json(json);
    //清空数据
    //if (emptyHistory) removeDb('log', function(err){
      //writeLog('清空log表数据', err);
    //});
  });
};
