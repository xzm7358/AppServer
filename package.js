/**
 * Created by zzs on 2017/1/3.
 */

var package = exports;
var fs = require('fs');
var dbhandler= require('./dbhandler');
var logger = require('./log');
package.get = function (req, res, next) {
    logger.log('logFile').info("GET ", req.url);
    var type = req.query.type;
    var selectsql;
    if (( 'ios' === type)||('1' === type)) {
        selectsql = 'SELECT * from AppPackage where type = 1 order by id desc limit 1';
    }
    else if (( 'android' === type)||('0' === type) || undefined === type) {
        selectsql = 'SELECT * from AppPackage where type = 0 order by id desc limit 1';
    }

    dbhandler(selectsql, function (error , result) {
        if (error)
        {
            logger.log('logFile').fatal('[SELECT ERROR - ', error.message);
            res.send({code:101});
        }
        else if (result.length === 0)
        {
            logger.log('logFile').error('no data in database');
            res.send({code: 101});
        }
        else {
            var path = './app/' + result[0].fileName;
            logger.log('logFile').info("fileName:",result[0].fileName);
            fs.stat(path, function (error, stats) {
                if (error) {
                    logger.log('logFile').error("file " +path + "not found");
                    res.send({code: 101});
                }
                else {
                    res.set({
                        'Content-Type': 'application/vnd.android.package-archive',
                        'Content-Disposition': 'attachment; filename=package',
                        'Content-Length': stats.size
                    });
                    fs.createReadStream(path).pipe(res);
                    logger.log('logFile').info("db proc package OK");
                }
            });
        }
    });

    return next();

}