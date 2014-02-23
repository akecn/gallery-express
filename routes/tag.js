// Generated by CoffeeScript 1.6.3
var AUTHOR_TAGS, SYSTEM_TAGS, dbMap, fs, getcoms, _;

fs = require('fs');

_ = require('underscore');

dbMap = require('../lib/db-map');

AUTHOR_TAGS = './gallery-db/author-tags.json';

SYSTEM_TAGS = './gallery-db/system-tags.json';

/*
获取标签的组件列表
*/


getcoms = function(tag, tags) {
  var coms;
  console.log(tag);
  console.log(tags);
  tags = JSON.parse(tags);
  coms = tags[tag];
  console.log(coms);
  if (!coms) {
    return [];
  }
  coms = tags.split(',');
  return coms;
};

/*
获取指定tag的组件列表
*/


exports.coms = function(req, res) {
  var tagName;
  tagName = req.params.name;
  return fs.readFile(SYSTEM_TAGS, 'utf8', function(err, systemTags) {
    var systemComs;
    if (err) {
      console.log(err);
      return false;
    }
    systemTags = JSON.parse(systemTags);
    systemComs = systemTags[tagName];
    systemComs = systemComs && systemComs.split(',' || []);
    return fs.readFile(AUTHOR_TAGS, 'utf8', function(err, authorTags) {
      var authorComs, coms;
      if (err) {
        console.log(err);
        return false;
      }
      authorTags = JSON.parse(authorTags);
      authorComs = authorTags[tagName];
      authorComs = authorComs && authorComs.split(',') || [];
      console.log(systemComs);
      coms = _.union(authorComs, systemComs);
      if (!coms.length) {
        res.render('404', {
          "msg": tagName + "标签下不存在组件"
        });
      }
      return dbMap.coms(function(data) {
        var components, newcoms;
        newcoms = [];
        components = data.components;
        coms.forEach(function(comName) {
          return components.forEach(function(com) {
            if (com.name === comName) {
              newcoms.push(com);
              return true;
            }
          });
        });
        data.components = newcoms;
        data.tag = tagName;
        return res.render('tag-coms', data);
      });
    });
  });
};
