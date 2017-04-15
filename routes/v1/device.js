/**
 * Created by zzs on 2017/1/5.
 */
var config = require('../config.json');
var http = require('http');
var logger = require('./log').log('logFile');
var redis = require('redis');
var url= require('url');

var path = require('path');
const Router = require('restify-router').Router;
const router = new Router();

router.post('',function (req, res, next) {
    logger.info('POST ', req.url);
    res.contentType = 'json';
    if ( !req.body )
    {
        logger.error('device.js error:app2server body empty!');
        res.send({code:102});
    }
    else
    {
        var imei = req.body.imei || req.body.IMEI;
        var transdata = JSON.stringify(req.body);
        logger.info('app2dev:', transdata);
        var RDS_OPTS = {auth_pass:config.redis_cli.pwd},
            client = redis.createClient(config.redis_cli.port,config.redis_cli.host,RDS_OPTS);

        client.on("error", function (err) {
            logger.error("device.js "+imei+": redis client error: "+ err);
            res.send({code:100});
        });
        client.on("connect", function () {
            logger.info("get into the connect");
            client.get(imei,function(getErr, getRes) {
                if (getErr) {
                    logger.error('device.js req.body:',req.body);
                    logger.error('device.js '+imei +': connect error:'+ getErr);
                    res.send({code:101});
                } else if(!getRes) {
                    logger.error('device.js '+imei+': error:Data in the redis server is empty,getRes empty,imei');
                    var noResRequest = http.request(config.device_http_options, function (response) {
                        if (response.statusCode === 200) {
                            var bodydata = "";
                            response.on('data', function (data) {
                                bodydata += data;
                            });
                            response.on('end', function () {
                                res.send(JSON.parse(bodydata));
                                logger.info('dev2app:', bodydata);
                            });
                        }
                        else {
                            logger.error("device.js "+imei+" :error:simcomServer no response ");
                            res.send({code:106});
                        }
                    });
                    noResRequest.on('error', function (reqerr) {
                        logger.fatal('device.js '+imei+' :connect error simcomServer with request:' + reqerr.message);
                        res.send({code:107})
                    });
                    noResRequest.end(transdata);
                }
                else {
                    var Url = url.parse('http://' + getRes);
                    config.device_http_options.host = Url.hostname;
                    config.device_http_options.port = Url.port;
                    config.device_http_options.path = req.url;
                    var requset = http.request(config.device_http_options, function (response) {
                        if (response.statusCode === 200) {
                            var bodydata = "";
                            response.on('data', function (data) {
                                bodydata += data;
                            });
                            response.on('end', function () {
                                logger.info('input:', bodydata);
                                res.send(JSON.parse(bodydata));
                                logger.info('dev2app:',bodydata);
                            });
                        }
                        else {
                            logger.error("device.js "+imei+" after connect simcomServer error:simcomServer no response ");
                            res.send({code:106});
                        }
                    });

                    requset.on('error', function (reqerr) {
                        logger.fatal('device.js '+imei+' connect with simcomServer problem with request:' + reqerr.message);
                        res.send({code:103})
                    });
                    requset.end(transdata);
                }
                client.quit();
            });
        })
    }
    return next();
});
module.exports = router;