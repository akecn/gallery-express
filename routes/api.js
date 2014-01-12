var adJson = './gallery-db/kissy-index-ad.json';
var fs = require('fs');
var path = require('path');
//kissy首页广告
exports.indexAd = function(req, res){
    fs.readFile(adJson, { encoding: 'utf8' }, function (err, ads) {
        if (err) {
            console.log(err);
        } else {
            ads = JSON.parse(ads);
            var newAds = [];
            for(i in ads){
                var ad = ads[i];
                var expire = ad.expire;
                var timestamp = Number(new Date(expire).getTime());
                var now = Number(new Date().getTime());
                //不显示过期的广告
                if(now-timestamp < 0){
                    newAds.push(ad);
                }
            }
            newAds = JSON.stringify(newAds);
            res.send(newAds);
        }
    });
}
exports.version = function(req,res){
    var r = [];
    var name = req.query["name"];
    var dirPath = path.join('./',name);
    fs.readdirSync(dirPath).forEach(function(i){
        var stat = fs.statSync(path.join(dirPath,i));
        if(stat.isDirectory()&&new RegExp(/\d+.\d+/).test(i)){
            r.push(i);
        }
    });
    r = {
        "success":true,
        "list":r
    };
    r = JSON.stringify(r)
    res.send(r);
}
