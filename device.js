/**
 * Created by zzs on 2017/1/5.
 */

var device = exports;
var config = require('./config.json');
var http = require('http');
var logger = require('./log');
device.post = function (req, res, next) {
    logger.log('logFile').info('POST ', req.url);
    res.contentType = 'json';
    if ( !req.body )
    {
        logger.log('logFile').error('body empty!');
        res.send({code:100});
    }
    else
    {
        var transdata = JSON.stringify(req.body);
        logger.log('logFile').info('app2dev:', transdata);
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
                res.send({code:100});
            }
        });
        requset.end(transdata);
    }
    return next();
};
