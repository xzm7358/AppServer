/**
 * Created by zouzh on 2017/3/1.
 */

var deviceEvent = exports;

var dbhandler = require('./dbhandler');

var logger = require('./log');

deviceEvent.get = function (req, res, next) {
    logger.log('logFile').info('GET %s', req.url);
    res.contentType = 'json';

    if (!req.params.hasOwnProperty('imei')) {
        logger.log('logFile').error('device event url error: no imei');
        res.send({code:101});
        return next();
    }
    var imei = req.params.imei;

    if (imei.length != 15)
    {
        logger.log('logFile').error('imei.length = ' + imei.length);
        res.send({code:101});
        return next();
    }
    logger.log('logFile').info('get imei: '+ imei);

    if(!req.query.hasOwnProperty('start')&&!req.query.hasOwnProperty('end')){
        logger.log('logFile').info('no start or end parameter in the url');
        var selectsql = 'SELECT time FROM log WHERE imei='+imei+' order by time desc limit 1';
        dbhandler(selectsql, function (selecterr, selectres) {
            if (selecterr) {
                logger.log('logFile').fatal('Find in the no start or end para :[SELECT ERROR - ', selecterr.message);
                res.send({code:101});
            } else {
                logger.log('logFile').info('select result from log success in the findoneSql');
                var date = new Date(selectres[0].time);
                logger.log('logFile').info('date:'+date);
                var end = date.valueOf() / 1000;
                logger.log('logFile').info('time:'+end);

                end = deviceEvent.getDate(end);
                var newStart =  deviceEvent.getDate(end - (end % 86400));
                selectsql = 'SELECT * FROM log where (imei=' + imei + ' AND '+ '(time >= ' + newStart + ' AND time <= ' + end +'))';
                logger.log('logFile').info('wait for next find sql');
            }
        });
    }
    else if(!req.query.hasOwnProperty('start')){
        logger.log('logFile').info('no start parameter in the url');
        var end = req.query.end;
        var start =  deviceEvent.getDate(end - (end % 86400));
        end = deviceEvent.getDate(end);
        var selectsql = 'SELECT * FROM log where (imei=' + imei + ' AND '+ '(time >= ' + start + ' AND time <= ' + end +'))';
    } else {

        var start = deviceEvent.getDate(req.query.start);
        if(!req.query.hasOwnProperty('end')){
            logger.log('logFile').info('no end parameter in the url');
            var selectsql = 'SELECT * FROM log where imei='+imei+' AND ' + 'time' + ">=" + start;
        }
        else {
            logger.log('logFile').info('start and end para all on');
            var end = deviceEvent.getDate(req.query.end);
            var selectsql = 'SELECT * FROM log where (imei=' + imei + ' AND '+ '(time >= ' + start + ' AND time <= ' + end +'))';
        }

    }
    logger.log('logFile').info('selectsql1111111:' + selectsql);

    dbhandler(selectsql, function (selecterr, selectres) {
        if (selecterr) {
            logger.log('logFile').fatal('[SELECT ERROR - ', selecterr.message);
            res.send({code:101});
        } else {
            var deviceEventReply = [];
            logger.log('logFile').info('select result from log success');
            for (var i = 0; i < selectres.length; i++) {
                var eventReply = {};
                // eventReply.timestamp = new Date(selectres[i].time).getTime()/1000;
                eventReply.timestamp = selectres[i].time;
                eventReply.event     = selectres[i].event;
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