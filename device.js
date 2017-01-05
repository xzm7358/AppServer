/**
 * Created by zzs on 2017/1/5.
 */

var device = exports;

var request = require('request');

device.post = function (req, res, next) {
    console.log(req.body);
    console.log('POST '+ req.url);
    res.contentType = 'json';
    var transurl =  'http://' + req.headers.host + ':8081/v1/device';//
    console.log('transurl %s',transurl);
    var pipe = req.pipe(request.post(transurl, {form:req.body}));//
    console.log('pipe: %s', pipe);
    // var response = [];
    // pipe.on('data', function (chunk) {
    //     response.push(chunk);
    // })
    pipe.on('end',function () {
        var res2 = pipe.response;
        console.log('res2 %s',res2);
        res.send(res2);
    });

    return next();

};