/**
 * Created by zzs on 2017/1/5.
 */

var device = exports;

var http = require('http');
var querystring = require('querystring');

device.post = function (req, res, next) {
    console.log(req.body);
    console.log('POST '+ req.url);
    res.contentType = 'json';
    // var transurl =  'http://' + req.headers.host + ':8081/v1/device';//
    var transdata = JSON.stringify(req.body);
    console.log('transdata:', transdata);
    var options = {
        host: req.headers.host,
        port: 8081,
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
               console.log(data);
               body += data;
           }).on('end', function () {
               res.send(200, JSON.parse(body));
           })
       }
       else {
           res.send(500,"error");
       }

    });
    requset.write(transdata + "\n");
    requset.end();

    return next();
};