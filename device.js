/**
 * Created by zzs on 2017/1/5.
 */

var device = exports;

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
        console.log('transdata:', transdata);
        var options = {
            host: "test.xiaoan110.com",
            port: 8082,
            path: "/v1/device",
            method: "POST",
            headers: {
                "Content-Type": 'application/json',
                "Content-Length": transdata.length
            }
        };
        var requset = http.request(options, function (response) {
            console.log('status:', response.statusCode);
            console.log('headers:', response.headers);
            if (response.statusCode === 200) {
                var body = "";
                response.on('data', function (data) {
                    body += data;
                    console.log(data);
                }).on('end', function () {
                    console.log('json:', JSON.parse(body));
                    res.send(200, JSON.parse(body));
                })
            }
            else {
                res.send({code:100});
            }
        });
        requset.write(transdata);
        requset.end();
    }

    return next();
};