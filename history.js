/**
 * Created by jk on 2016-12-28.
 */
var mysql = require('mysql');
var history = exports;

history.get = function(req, res, next) {
    console.log('GET %s', req.url);

    var imei = req.params.imei;
    console.log(imei);
    var start = req.query.start;
    console.log(start);
    var end = req.query.end;
    console.log(end);

    res.contentType = 'json';
    var selectsql = 'SELECT * FROM ' + 'gps_' + imei + ' WHERE '+ 'timestamp' + ' BETWEEN ' + start + ' AND ' + end;
    if(!imei)
    {
        res.send({code: 101});
        return next();
    }
    if(start && !end)
    {
        end =  start + 86400 - (start % 86400);
        selectsql = 'SELECT * FROM ' + 'gps_' + imei + ' WHERE '+ 'timestamp' + ' BETWEEN ' + start + ' AND ' + end;
    }
    if(!start)
    {
        selectsql = 'SELECT * FROM ' + 'gps_' + imei + ' order by timestamp desc limit 1 ';
    }

    var connnection = mysql.createConnection({
        host : 'test.xiaoan110.com',
        user : 'eelink',
        password: 'eelink',
        database: 'gps',
    });
    connnection.connect();
    connnection.query(selectsql, function (starterr, startresult){
        if (starterr)
        {
            console.log('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
        }
        res.send({gps:startresult});
    });
    connnection.end();
    return next();
}
