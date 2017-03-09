/**
 * Created by zzs on 2017/1/5.
 */

var device = exports;
var Config = require('./config');
var config = new Config();
var http = require('http');
var logger = require('./log');
var redis = require('redis');
var url= require('url');

device.post = function (req, res, next) {
    logger.log('logFile').info('POST ', req.url);
    res.contentType = 'json';
    if ( !req.body )
    {
        logger.log('logFile').error('app2server body empty!');
        res.send({code:102});
    }
    else
    {
        var imei = req.body.imei;
        var transdata = JSON.stringify(req.body);
        logger.log('logFile').info('app2dev:', transdata);
        var RDS_OPTS = {auth_pass:config.redis_cli.pwd},
            client = redis.createClient(config.redis_cli.port,config.redis_cli.host,RDS_OPTS);

        client.on("error", function (err) {
            logger.log('logFile').error("Error: ",err);
            res.send({code:100});
        });
        client.on("connect", function () {
            logger.log('logFile').info("get into the connect");
            client.get(imei,function(getErr, getRes) {
                if (getErr) {
                    logger.log('logFile').error('No imei in the redis server.');
                    res.send({code:101});
                } else if(!getRes) {
                    logger.log('logFile').error('Data in the redis server is empty.');
                    var noResRequest = http.request(config.device_http_options, function (response) {
                        if (response.statusCode === 200) {
                            var bodydata = "";
                            response.on('data', function (data) {
                                bodydata += data;
                            });
                            response.on('end', function () {
                                res.send(JSON.parse(bodydata));
                                logger.log('logFile').info('dev2app:', bodydata);
                            });
                        }
                        else {
                            logger.log('logFile').err("ERROR: simcomServer no response ");
                            res.send({code:106});
                        }
                    });
                    noResRequest.on('error', function (reqerr) {
                        logger.log('logFile').fatal('problem with request:' + reqerr.message);
                        res.send({code:107})
                    });
                    noResRequest.end(transdata);
                }
                else {
                    var Url = url.parse('http://' + getRes);
                    config.device_http_options.host = Url.hostname;
                    config.device_http_options.port = Url.port;
                    var requset = http.request(config.device_http_options, function (response) {
                        if (response.statusCode === 200) {
                            var bodydata = "";
                            response.on('data', function (data) {
                                bodydata += data;
                            });
                            response.on('end', function () {
                                logger.log('logFile').info('input:', bodydata);
                                res.send(JSON.parse(bodydata));
                                logger.log('logFile').info('dev2app:',bodydata);
                            });
                        }
                        else {
                            logger.log('logFile').err("ERROR: simcomServer no response ");
                            res.send({code:106});
                        }
                    });

                    requset.on('error', function (reqerr) {
                        logger.log('logFile').fatal('problem with request:' + reqerr.message);
                        res.send({code:103})
                    });
                    requset.end(transdata);
                }
                client.quit();
            });
        })
    }
    return next();
};
