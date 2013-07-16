var GitHubApi, addGithubData, crypto, fs, galleryGithub, syncCom, writeJson;

GitHubApi = require("github");

fs = require('fs');

crypto = require('crypto');

galleryGithub = new GitHubApi({
  version: "3.0.0",
  timeout: 5000
});

galleryGithub.authenticate({
  type: "oauth",
  token: "7d9e8064e9b3e5d5311c6eabe9fcf6d1243481f8"
});

syncCom = function(com, callback) {
  var comInfos, path;
  path = "" + com + "/abc.json";
  comInfos = "gallery-express/component-info.json";
  return fs.readFile(path, 'utf8', function(err, data) {
    var md5;
    if (data) {
      try {
        data = JSON.parse(data);
        if (data.author.email) {
          md5 = crypto.createHash('md5');
          md5.update(data.author.email, 'utf8');
          data.author.md5 = md5.digest('hex');
        }
        return fs.readFile(comInfos, 'utf8', function(err, coms) {
          var authors, i, isExist, _i, _len, _ref;
          if (coms) {
            try {
              coms = JSON.parse(coms);
              authors = coms.authors;
              authors[data.author.name] = data.author;
              isExist = false;
              _ref = coms.components;
              for (i = _i = 0, _len = _ref.length; _i < _len; i = ++_i) {
                com = _ref[i];
                if (com.name === data.name) {
                  isExist = true;
                  addGithubData(data, function(comData) {
                    coms.components[i] = comData;
                    return writeJson(coms, function() {
                      return callback && callback(comData);
                    });
                  });
                  return true;
                }
              }
              if (!isExist) {
                return addGithubData(data, function(comData) {
                  coms.components.push(comData);
                  return writeJson(coms, function() {
                    return callback && callback(comData);
                  });
                });
              }
            } catch (_error) {}
          }
        });
      } catch (_error) {}
    }
  });
};

/*
����github�Ŀ���Ϣ
*/


addGithubData = function(data, callback) {
  return galleryGithub.repos.get({
    user: 'kissygalleryteam',
    repo: data.name
  }, function(err, result) {
    var key, keys, _i, _len;
    if (!result.message) {
      keys = ['forks', 'watchers', 'updated_at', 'created_at', 'description', 'size'];
      for (_i = 0, _len = keys.length; _i < _len; _i++) {
        key = keys[_i];
        data[key] = result[key];
      }
      return callback && callback(data);
    }
  });
};

/*
��������Ϣд�뵽component-info.json��
*/


writeJson = function(coms, callback) {
  return fs.writeFile('gallery-express/component-info.json', JSON.stringify(coms), function(err) {
    return callback && callback(coms);
  });
};

exports.sync = function(req, res) {
  var com;
  com = req.params.name;
  return syncCom(com, function(data) {
    return res.json(data);
  });
};

exports.syncAll = function(req, res) {};
