/**
 * Created by jk on 2016-12-28.
 */
var history = exports;
var dbhandler = require('./dbhandler');
var logger = require('./log').log('logFile');
history.get = function(req, res, next) {

    logger.info('GET %s', req.url);
    res.contentType = 'json';

    if(!req.params.hasOwnProperty('imei')){
        logger.error('history get req.body no imei');
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if(imei.length != 15) {
        logger.error('history.js '+imei+' imei.length = '+ imei.length);
        res.send({code: 101});
        return next();
    }
    logger.info('get imei: '+ imei);

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
    logger.info('selectsql:' + selectsql);

    dbhandler(selectsql, function (starterr, startresult){
        if (starterr)
        {
            logger.fatal('history.js get '+imei+' [SELECT ERROR - '+ starterr.message);
            res.send({code: 101});
        }
        else if(startresult.length === 0){
            logger.error('history.js get '+imei + ' history get startresult.length = ' + startresult.length);
            res.send({code: 101});
        }
        else{
            logger.info('db proc OK');
            res.send({gps: startresult});
        }
    });
    return next();
};
