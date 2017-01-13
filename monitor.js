/**
 * Created by zzs on 2017/1/12.
 */

var monitor = exports;
var fs = require('fs');

monitor.get = function (req, res, next) {
    console.log('GET %s', req.url);
    res.contentType = 'json';
    if (!req.params.hasOwnProperty('name')) {
        console.log('no name');
        res.send({code:101});
        return next();
    }
    var name = req.params.name;
    var filepath = '/var/ftp/home/' + name;//
    fs.stat(filepath, function (error, stats) {
        if (error) {
            console.log("file " +filepath + "not found");
            res.send({code: 101});
        } else {
            console.log("file exists");
            res.sendfile({
                'Content-Type': 'audio/amr',
                'Content-Disposition': 'attachment; filename='+name,
                'Content-Length': stats.size
            });
            fs.createReadStream(filepath).pipe(res);
        }
        console.log("monitor transform OK");
    });
    return next();
};
