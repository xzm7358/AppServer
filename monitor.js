/**
 * Created by zzs on 2017/1/12.
 */
// const config = require("./config.json");
var monitor = exports;
var fs = require('fs');

monitor.get = function (req, res, next) {
    var name;
    var filepath;

    console.log('GET %s', req.url);
    res.contentType = 'json';
    if (!req.params.hasOwnProperty('name')) {
        console.log('no name');
        res.send({code:101});
        return next();
    }
    name = req.params.name;
    filepath = '/var/ftp/home/' + name;//
    fs.stat(filepath, function (error, stats) {
        if (error) {
            console.log("file " +filepath + "not found");
            res.send({code: 101});
        } else {
            console.log("file exists");
            res.set({
                'Content-Type': 'application/vnd.android.package-archive',
                'Content-Disposition': 'attachment; filename=package',
                'Content-Length': stats.size
            });
            fs.createReadStream(filepath).pipe(res);
        }
        console.log("monitor transform OK");
    });
    return next();
};
