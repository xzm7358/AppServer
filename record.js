/**
 * Created by zzs on 2017/1/12.
 */

var record = exports;
var fs = require('fs');
var amrToMp3 = require('amrToMp3');
var path = require('path');
var logger = require('./log');

record.get = function (req, res, next) {
    logger.log('logFile').info('GET %s', req.url);
    res.contentType = 'json';
    if (!req.query.name) {
        logger.log('logFile').error('record input: No name.');
        res.send({code:101});
        return next();
    }
    var name = req.query.name;
    var accept = '.amr';
    logger.log('logFile').info('accept:',req.headers.accept);
    if(req.headers.accept === 'audio/mp3'){
        accept = '.mp3';
    } else if ((req.headers.accept === 'audio/AMR')||(!req.headers.hasOwnProperty('accept'))) {
        accept = '.amr';
    }
    logger.log('logFile').info('accept:',accept);
    var serverpath = '/var/ftp/home/';
    var filepath = serverpath + name + '.amr';
    fs.stat(filepath, function (error, stats) {
        if (error) {
            logger.log('logFile').error("file " +filepath + " not found");
            res.send({code: 101});
        } else {
            logger.log('logFile').info("file exists");
            if (req.headers.accept === "audio/mp3") {
                amrToMp3(filepath, './src/mp3/').then(function (data) {
                    res.set({
                        'Content-Type': 'application/octet-stream',
                        'Content-Disposition': 'attachment; filename='+path.basename(filepath, '.amr')+ '.mp3',
                        'Content-Length': stats.size
                    });
                    filepath=path.join(__dirname,data);
                    logger.log('logFile').info('path:',filepath);
                    fs.createReadStream(filepath).pipe(res);
                    logger.log('logFile').info("monitor transform OK");
                }).catch(function (error) {
                    logger.log('logFile').fatal('error:',error);
                    res.send({code:101});
                })
            } else {
                res.set({
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename='+path.basename(filepath),
                    'Content-Length': stats.size
                });
                fs.createReadStream(filepath).pipe(res);
                logger.log('logFile').info("monitor transform OK");
            }

        }
    });
    return next();
};
