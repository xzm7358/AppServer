/**
 * Created by zzs on 2017/1/18.
 */
var event = exports;
var dbhandler = require('./dbhandler');
var logger = require('./log');
event.get = function (req, res, next) {
    logger.log('logFile').info('GET %s', req.url);
    res.contentType = 'json';
    if (!req.params.hasOwnProperty('imei')) {
        logger.log('logFile').error('event get url error: no imei');
        res.send({code:101});
    }
    var imei = req.params.imei;
    if (imei.length != 15) {
        logger.log('logFile').error('imei.length = '+ imei.length);
        res.send({code: 101});
    }
    logger.log('logFile').info('get imei: '+ imei);
    if (!req.query.hasOwnProperty('endAt')) {
        var selectsql = 'SELECT * FROM ' + 'gps_' + imei + ' order by timestamp desc limit 20';
    } else {
        var endAt = req.query.endAt;
        console.log('endAt:',endAt);
        selectsql = 'SELECT * FROM gps_' + imei + ' WHERE ' + 'timestamp <= ' + endAt +' order by timestamp desc limit 20';
    }	
    logger.log('logFile').info('selectsql:' + selectsql);

    dbhandler(selectsql, function (selecterr, selectres) {
        if (selecterr) {
            logger.log('logFile').fatal('[SELECT ERROR - ', selecterr.message);
            res.send({code:101});
        } else if (selectres.length === 0) {
            logger.log('logFile').error('selectres.length = '+ selectres.length);
            res.send({code:101});
        } else {
            logger.log('logFile').info('db proc OK');
            logger.log('logFile').info('res:' + selectres);
            res.send({event:selectres});
        }
    });
    return next();
}
