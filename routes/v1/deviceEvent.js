/**
 * Created by zouzh on 2017/3/1.
 */

var deviceEvent = exports;

var dbhandler = require('./dbhandler');

var logger = require('./log').log('logFile');

deviceEvent.get = function (req, res, next) {
    logger.info('GET %s', req.url);
    res.contentType = 'json';

    if (!req.params.hasOwnProperty('imei')) {
        logger.error('deviceEvent.js device event url error: no imei');
        res.send({code:101});
        return next();
    }
    var imei = req.params.imei;

    if (imei.length != 15)
    {
        logger.error('deviceEvent.js'+imei+' imei.length = ' + imei.length);
        res.send({code:101});
        return next();
    }
    logger.info('get imei: '+ imei);

    if(!req.query.hasOwnProperty('start')&&!req.query.hasOwnProperty('end')){
        logger.info('no start or end parameter in the url');
        var selectsql = 'SELECT * FROM log WHERE imei='+imei+' order by time desc limit 1';
    }
    else if(!req.query.hasOwnProperty('start')){
        logger.info('no start parameter in the url');
        var end = req.query.end;
        var start =  deviceEvent.getDate(end - (end % 86400));
        end = deviceEvent.getDate(end);
        var selectsql = 'SELECT * FROM log where (imei=' + imei + ' AND '+ '(time >= ' + start + ' AND time <= ' + end +'))';
    } else {

        var start = deviceEvent.getDate(req.query.start);
        if(!req.query.hasOwnProperty('end')){
            logger.info('no end parameter in the url');
            var selectsql = 'SELECT * FROM log where imei='+imei+' AND ' + 'time' + ">=" + start;
        }
        else {
            logger.info('start and end para all on');
            var end = deviceEvent.getDate(req.query.end);
            var selectsql = 'SELECT * FROM log where (imei=' + imei + ' AND '+ '(time >= ' + start + ' AND time <= ' + end +'))';
        }

    }
    logger.info('selectsql:' + selectsql);

    dbhandler(selectsql, function (selecterr, selectres) {
        if (selecterr) {
            logger.fatal('deviceEvent.js'+imei+' [SELECT ERROR - ', selecterr.message);
            res.send({code:101});
        } else {
            var deviceEventReply = [];
            logger.info('select result from log success');
            for (var i = 0; i < selectres.length; i++) {
                var eventReply = {};
                eventReply.event     = selectres[i].event;
                eventReply.timestamp = new Date(selectres[i].time).getTime()/1000;
                logger.info('timestamp:',eventReply.timestamp);
                deviceEventReply.push(eventReply);
            }
            res.send(deviceEventReply);
        }
    });
    return next();
}

deviceEvent.getDate = function(timestamp) {
    var data = new Date(timestamp * 1000);
    var time = data.getFullYear() + '-' + (data.getMonth() + 1 < 10 ? '0' + (data.getMonth() + 1) : data.getMonth() + 1) + '-' + data.getDate() + ' ' + data.getHours() + ':' + data.getMinutes() + ':' + data.getSeconds();
    time = '\''+time+'\'';
    return time;
};