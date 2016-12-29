/**
 * Created by lc on 2016-12-28.
 */
var mysql = require('mysql');
var itinerary = exports;

itinerary.get = function(req, res, next) {
    console.log('GET %s', req.url);
    res.contentType = 'json';

    var imei = req.params.imei;
    console.log(imei);
    var start = req.query.start;
    console.log(start);
    var end = req.query.end;
    console.log(end);

    var selectsql = 'SELECT * FROM ' + 'itinerary_' + imei + ' WHERE '+ 'starttime >= ' + start + ' AND endtime <= ' + end;
    if(!imei)
    {
        res.send({code: 101});
        return next();
    }
    if(start && !end)
    {
        end =  start + 86400 - (start % 86400);
        selectsql = 'SELECT * FROM ' + 'itinerary_' + imei + ' WHERE '+ 'starttime >= ' + start + ' AND endtime <= ' + end;
    }
    if(!start)
    {
        selectsql = 'SELECT itinerary FROM object WHERE imei = \''+ imei + '\'';
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
        else if(startresult.length === 0){
            res.send({code: 101});
        }
        else{
            var itinerary = [];
            if(start) {//历史轨迹
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
            else {//最后的GPS定位
                var iItinerary = {};
                iItinerary.start = 0;
                iItinerary.end = 0;
                iItinerary.miles = startresult[0].itinerary;
                itinerary.push(iItinerary);
            }
            console.log(itinerary);
            res.send({itinerary: itinerary});
        }
    });
    connnection.end();
    return next();
}
