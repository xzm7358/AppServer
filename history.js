/**
 * Created by jk on 2016-12-28.
 */
var history = exports;
var dbhandler = require('./dbhandler');

history.get = function(req, res, next) {

    console.log('GET %s', req.url);
    res.contentType = 'json';

    if(!req.params.hasOwnProperty('imei')){
        console.log('no imei');
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if(imei.length != 15) {
        console.log('imei.length = '+ imei.length);
        res.send({code: 101});
        return next();
    }
    console.log('get imei: '+ imei);

    if(!req.query.hasOwnProperty('start')){
        var selectsql = 'SELECT * FROM ' + 'gps_' + imei + ' order by timestamp desc limit 1 ';
    }
    else{
        var start = req.query.start;
        if(!req.query.hasOwnProperty('end')){
            var end =  start + 86400 - (start % 86400);
        }
        else {
            end = req.query.end;
        }
        selectsql = 'SELECT * FROM ' + 'gps_' + imei + ' WHERE '+ 'timestamp' + ' BETWEEN ' + start + ' AND ' + end;
    }
    console.log(selectsql);

    dbhandler(selectsql, function (starterr, startresult){
        if (starterr)
        {
            console.log('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
        }
        else if(startresult.length === 0){
            console.log('startresult.length = ' + startresult.length);
            res.send({code: 101});
        }
        else{
            console.log('db proc OK');
            res.send({gps: startresult});
        }
    });
    return next();
};
