var adJson = './gallery-db/kissy-index-ad.json';
var fs = require('fs');
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