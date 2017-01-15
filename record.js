/**
 * Created by zzs on 2017/1/12.
 */

var monitor = exports;
var fs = require('fs');
var amrToMp3 = require('amrToMp3');
var path = require('path');
monitor.get = function (req, res, next) {
    console.log('GET %s', req.url);
    // res.contentType = 'json';
    if (!req.query.hasOwnProperty('name')) {
        console.log('no name');
        res.send({code:101});
        return next();
    }
    var name = req.query.name;
    var accept = '.amr';
    console.log('accept:',req.headers.accept);
    if(req.headers.accept === 'audio/mp3'){
        accept = '.mp3';
    } else if ((req.headers.accept === 'audio/AMR')||(!req.headers.hasOwnProperty('accept'))) {
        accept = '.amr';
    }
    console.log('accept:',accept);
    var serverpath = '/var/ftp/home/';
    var filepath = serverpath + name + '.amr';
    fs.stat(filepath, function (error, stats) {
        if (error) {
            console.log("file " +filepath + " not found");
            res.send({code: 101});
        } else {
            console.log("file exists");
            if (req.headers.accept === "audio/mp3") {
                amrToMp3(filepath, './src/mp3/').then(function (data) {
                    console.log('data:',data);
                    res.set({
                        'Content-Type': 'application/octet-stream',
                        'Content-Disposition': 'attachment; filename='+path.basename(filepath, '.amr')+ '.mp3',
                        'Content-Length': stats.size
                    });
                    filepath=path.join(__dirname,data);
                    console.log('path:',filepath);
                    fs.createReadStream(filepath).pipe(res);
                    console.log("monitor transform OK");
                }).catch(function (error) {
                    console.log('error:',error);
                    res.send({code:101});
                })
            } else {
                res.set({
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename='+path.basename(filepath),
                    'Content-Length': stats.size
                });
                fs.createReadStream(filepath).pipe(res);
                console.log("monitor transform OK");
            }

        }
    });
    return next();
};
