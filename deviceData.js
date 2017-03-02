/**
 * Created by zouzh on 2017/3/1.
 */


var deviceData = exports;

var logger = require('./log');
var config = require('./config.json');
var redis = require('redis');
var url = require('url');
var http = require('http');
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
        res.send({code: 101});
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
                logger.log('logFile').error('No imei in the redis server.');
                res.send({code: 101});
            } else if (!getRes) {
                logger.log('logFile').error('Data in the redis server is empty.');

                var noResRequest = http.request(config.device_http_options, function (response) {
                    if (response.statusCode === 200) {
                        var bodydata = "";
                        response.on('data', function (data) {
                            bodydata += data;
                        });
                        response.on('end', function () {
                            res.send(String(bodydata));
                            logger.log('logFile').info('dev2manager:', bodydata);
                        });
                    }
                    else {
                        logger.log('logFile').err("ERROR: redis no response ");
                        res.send({code: 100});
                    }
                });
                noResRequest.on('error', function (reqerr) {
                    logger.log('logFile').fatal('problem with request:' + reqerr.message);
                    res.send({code: 100})
                });
                noResRequest.on('timeout',function (err) {
                    logger.log('logFile').fatal('problem with request timeout:' + err.message);
                });
                noResRequest.end();
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
                            res.send(String(bodydata));
                            logger.log('logFile').info('dev2Manager:', bodydata);
                        });
                    }
                    else {
                        logger.log('logFile').err("ERROR: simcom server no response ");
                        res.send({code: 100});
                    }
                });

                requset.on('error', function (reqerr) {
                    logger.log('logFile').fatal('problem with request after:' + reqerr.message);
                    res.send({code: 100})
                });
                requset.on('timeout',function (err) {
                    logger.log('logFile').fatal('problem with request timeout:' + err.message);
                });
                requset.end();
            }
            client.quit();
        });
    })
    return next();
};
