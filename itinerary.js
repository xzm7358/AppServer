/**
 * Created by lc on 2016-12-28.
 */
var dbhandler = require('./dbhandler');
var itinerary = exports;
var logger = require('./log');
itinerary.get = function(req, res, next) {
    var selectsql;

    logger.log('logFile').info('GET %s', req.url);
    res.contentType = 'json';

    if(!req.params.hasOwnProperty('imei')){
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if(imei.length != 15) {
        res.send({code: 101});
        return next();
    }
    logger.log('logFile').info('get imei: '+ imei);

    if(!req.query.hasOwnProperty('start')){
        selectsql = 'SELECT itinerary FROM object WHERE imei = \''+ imei + '\'';
    }
    else{
        var start = req.query.start;
        if(!req.query.hasOwnProperty('end')){
            var end =  start + 86400 - (start % 86400);
        }
        else {
            end = req.query.end;
        }
        selectsql = 'SELECT * FROM ' + 'itinerary_' + imei + ' WHERE '+ 'starttime >= ' + start + ' AND endtime <= ' + end;
    }
    logger.log('logFile').info('selectsql:' + selectsql);

    dbhandler(selectsql, function (starterr, startresult){
        if (starterr)
        {
            logger.log('logFile').fatal('itinerary.js get '+imei+' [SELECT ERROR - '+ starterr.message);
            res.send({code: 101});
        }
        else if(startresult.length === 0){
            logger.log('logFile').error('itinerary.js '+imei+' get no data in result');
            res.send({code: 101});
        }
        else{
            var itinerary = [];
            if(start) {//里程
                for (var i = 0; i < startresult.length; i++) {
                    var iItinerary = {};
                    var iStart = {};
                    var iEnd = {};
                    iStart.timestamp = startresult[i].starttime;
                    iStart.lat = startresult[i].startlat;
                    iStart.lon = startresult[i].startlon;

                    iEnd.timestamp = startresult[i].endtime;
                    iEnd.lat = startresult[i].endlat;
                    iEnd.lon = startresult[i].endlon;

                    iItinerary.start = iStart;
                    iItinerary.end = iEnd;
                    iItinerary.miles = startresult[i].itinerary;

                    itinerary.push(iItinerary);
                }
            }
            else {//总里程
                var iItinerary = {};
                iItinerary.start = 0;
                iItinerary.end = 0;
                iItinerary.miles = startresult[0].itinerary;
                itinerary.push(iItinerary);
            }
            logger.log('logFile').info('db proc OK');
            res.send({itinerary: itinerary});
        }
    });

    return next();
}
