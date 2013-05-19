/*
 * GET home page.
 */

var config = require('../config');
var fs = require('fs');

exports.index = function (req, res) {
    fs.readFile('./gallery-express/component-info.json', {
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

exports.list = function (req, res) {
    res.render('list');
};