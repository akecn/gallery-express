
var path = require('path'),
    fs = require('fs');

function getDemoData(url, filename, name) {
    var pathName = '../demo/' + filename + '.html';
    var urlPath = path.resolve(url, '../', pathName);

    var exists = fs.existsSync(urlPath);

    return exists ? {
        id: filename,
        text: name || filename,
        href: pathName
    } : null;
}

exports.getData = function(url) {

    var rt = [];

    // KISSY MINI
    var mini = getDemoData(url, 'mini', "KISSY MINI");
    mini && rt.push(mini);

    // ISV
    var isv = getDemoData(url, 'index-isv', 'ISV');
    isv && rt.push(isv);

    return rt;
};
