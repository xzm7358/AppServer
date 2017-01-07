/**
 * Created by jk on 2016-12-28.
 */
var mysql = require('mysql');
var history = exports;
var config = require('./config.json');

history.get = function(req, res, next) {
    var start;
    var end;
    var selectsql;

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
        selectsql = 'SELECT * FROM ' + 'gps_' + imei + ' order by timestamp desc limit 1 ';
    }
    else{
        start = req.query.start;
        if(!req.query.hasOwnProperty('end')){
            end =  start + 86400 - (start % 86400);
        }
        else {
            end = req.query.end;
        }
        selectsql = 'SELECT * FROM ' + 'gps_' + imei + ' WHERE '+ 'timestamp' + ' BETWEEN ' + start + ' AND ' + end;
    }

    console.log(selectsql);
    var connnection = mysql.createConnection(config.mysql);
    connnection.connect();
    connnection.query(selectsql, function (starterr, startresult){
        connnection.end();
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
}
