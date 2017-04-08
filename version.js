/**
 * Created by zzs on 2017/1/3.
 */
var version = exports;
var mysql = require('mysql');
var dbhandler = require('./dbhandler');
var fs = require('fs');
var logger = require('./log');

version.get = function(req , res, next) {
    var selectsql;
    logger.log('logFile').info("GET ", req.url);
    res.contentType = 'json';
    var type = req.query.type;
    logger.log('logFile').info('type: ', type);
    if (( 'ios' === type)||('1' === type))
    {
        selectsql = 'SELECT * from AppPackage where type = 1 order by id desc limit 1';
    }
    else if (( 'android' === type)||('0' === type)|| undefined === type)
    {
        selectsql = 'SELECT * from AppPackage where type = 0 order by id desc limit 1';
    }
    logger.log('logFile').info(selectsql);
    dbhandler(selectsql, function (error, result) {
        if (error) {
            logger.log('logFile').fatal('version.js '+'[SELECT ERROR - '+ error.message);
            res.send({code: 101});
        } else if(result.length === 0) {
            logger.log('logFile').error('no data in database');
            res.send({code:101});
        } else {
            var app_path = './app/' + result[0].fileName;
            if (!fs.existsSync('./app/')) {
                fs.mkdirSync("./app/");
            }
            fs.stat(app_path,function (err,stats) {
                if (err) {
                    logger.log('logFile').error('no App in the path:',app_path);
                    res.send({code:101});
                    return next();
                } else {
                    var size = (stats.size / (1024*1024)).toFixed(2);
                    logger.log('logFile').info('db AppPackge info OK');
                    res.send({
                        versionName:result[0].versionName,
                        versionCode:result[0].versionCode,
                        changelog:result[0].changeLog,
                        packageSize:size + "MB"
                    });
                }
            });
        }
    })
    return next();
};
