/**
 * Created by zzs on 2017/1/5.
 */

var device = exports;
var config = require('./config.json');
var http = require('http');
var logger = require('./log');
var redis = require('redis');
var url= require('url');

device.post = function (req, res, next) {
    logger.log('logFile').info('POST ', req.url);
    res.contentType = 'json';
    // console.log("req.body:",req.body.imei);
    if ( !req.body )
    {
        logger.log('logFile').error('app2server body empty!');
        res.send({code:100});
    }
    else
    {
        var imei = req.body.imei;
        var transdata = JSON.stringify(req.body);
        logger.log('logFile').info('app2dev:', transdata);

        var client = redis.createClient(6379,'test.xiaoan110.com');
        client.on("error", function (err) {
            logger.log('logFile').err("Error: ",err);
        });
        client.get(imei,function(getErr, getRes) {
            if (getErr) {
                logger.log('logFile').error('No imei in the redis server.');
                res.send({code:101});
            } else if(!getRes) {
                logger.log('logFile').error('Data in the redis server is empty.');
                res.send({code:101});
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
                            res.send(String(bodydata));
                            logger.log('logFile').info('dev2app:', bodydata);
                        });
                    }
                    else {
                        logger.log('logFile').err("ERROR: redis no response ");
                        res.send({code:100});
                    }
                });

                requset.on('error', function (reqerr) {
                    logger.log('logFile').fatal('problem with request:' + reqerr.message);
                    res.send({code:100})
                })
                requset.end(transdata);
            }
            client.quit();
        });

    }
    return next();
};
