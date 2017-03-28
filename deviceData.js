/**
 * Created by zouzh on 2017/3/1.
 */


var deviceData = exports;

var logger = require('./log');
var config = require('./config.json');
var redis = require('redis');
var url = require('url');
var http = require('http');
var dbhandler = require('./dbhandler');
var async = require('async');

deviceData.get = function (req, res, next) {
    logger.log('logFile').info('GET %s', req.url);
    res.contentType = 'json';

    if (!req.params.hasOwnProperty('imei')) {
        logger.log('logFile').error('Qt2server imei empty');
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if (imei.length != 15) {
        logger.log('logFile').error('imei.length = ' + imei.length);
        res.send({code: 103});
        return next();
    }
    logger.log('logFile').info('get imei: ' + imei);
    var RDS_OPTS = {auth_pass: config.redis_cli.pwd},
        client = redis.createClient(config.redis_cli.port, config.redis_cli.host, RDS_OPTS);

    client.on("error", function (err) {
        logger.log('logFile').error("Error: ", err);
    });
    client.on("connect", function () {
        logger.log('logFile').info("get into the connect");
        client.get(imei, function (getErr, getRes) {
            if (getErr) {
                logger.log('logFile').error('deviceData.js error:No imei in the redis server.');
                res.send({code: 101});
            } else if (!getRes) {
                logger.log('logFile').error('deviceData.js error:Data in the redis server is empty.');
                res.send({code:109})
            }
            else {
                var Url = url.parse('http://' + getRes);
                config.deviceData_http_options.host = Url.hostname;
                config.deviceData_http_options.path = '/v1/imeiData/' + imei;
                config.deviceData_http_options.port = Url.port;

                logger.log('logFile').info("ready into the http connect:",config.deviceData_http_options);
                var requset = http.request(config.deviceData_http_options, function (response) {
                    if (response.statusCode === 200) {
                        var bodydata = "";
                        response.on('data', function (data) {
                            bodydata += data;
                        });
                        response.on('end', function () {
                            res.send(JSON.parse(bodydata));
                            logger.log('logFile').info('dev2Manager:', JSON.parse(bodydata));
                        });
                    }
                    else {
                        logger.log('logFile').error("deviceData.js ERROR: simcom server no response ");
                        res.send({code: 106});
                    }
                });
                requset.on('error', function (reqerr) {
                    logger.log('logFile').fatal('deviceData.js problem with request after:' + reqerr.message);
                    res.send({code: 100})
                });
                requset.on('timeout',function (err) {
                    logger.log('logFile').fatal('deviceData.js problem with request timeout:' + err.message);
                });
                requset.end();
            }
            client.quit();
        });
    })
    return next();
};


deviceData.del = function (req, res, next) {
    logger.log('logFile').info('DEL %s', req.url);
    res.contentType = 'json';

    if (!req.params.hasOwnProperty('imei')) {
        logger.log('logFile').error('Qt2server imei empty');
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if (imei.length != 15) {
        logger.log('logFile').error('imei.length = ' + imei.length);
        res.send({code: 103});
        return next();
    }
    logger.log('logFile').info('get imei at the delete function: ' + imei);
    var delGpsSql = "delete from gps_" + imei;
    var delItinerarySql = "TRUNCATE TABLE itinerary_" + imei;
    var delVoltageSql = "update object set voltage=0 where imei=" + imei;
    var delItinerary = "update object set itinerary=0 where imei=" + imei;
    var delTelnumber = "delete from imei2Telnumber where imei="+imei;
    var Sqls = [
        delGpsSql,
        delItinerarySql,
        delVoltageSql,
        delItinerary,
        delTelnumber
    ];

    async.eachSeries(Sqls, function (item, callback) {
        //遍历每条SQL并执行
        dbhandler(item,function (err, results) {
            if (err) {
                //异常后调用callback并传入err
                callback(err);
                logger.log('logFile').error("SQL:"+ item +"failed at deviceData.del");
            } else {
                logger.log('logFile').info("SQL:"+ item +"success at deviceData.del");
                callback();
            }
        });

    },function (allerr) {
        //所有SQL执行完成后回调
        if (allerr) {
            logger.log('logFile').error("All SQL finished at deviceData.del ,but error occured:",allerr);
            res.send({code:100})
        } else {
            logger.log('logFile').info("ALL SQL success.");
            res.send({code:0});
        }
    });
    return next();
}
