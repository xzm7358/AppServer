/**
 * Created by zzs on 2017/1/5.
 */

var device = exports;
var config = require('./config.json');
var http = require('http');

device.post = function (req, res, next) {
    console.log('POST '+ req.url);
    res.contentType = 'json';
    if ( !req.body )
    {
        console.log('error');
        res.send({code:100});
    }
    else
    {
        var transdata = JSON.stringify(req.body);
        console.log('app2dev:', transdata);
        var requset = http.request(config.device_http_options, function (response) {
            if (response.statusCode === 200) {
                var bodydata = "";
                response.on('data', function (data) {
                    bodydata += data;
                });
                response.on('end', function () {
                    res.send(JSON.parse(bodydata));
                    console.log('dev2app:', bodydata);
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