/**
 * Created by zzs on 2017/1/3.
 */

var packagedownload = exports;
var fs = require('fs');
var dbhandler= require('./dbhandler');
var logger = require('./log').log('logFile');
var path = require('path');
packagedownload.get = function (req, res, next) {
    logger.info("GET ", req.url);
    if (!fs.existsSync(path.resolve(__dirname,'../../app/'))) {
        fs.mkdirSync(path.resolve(__dirname,'../../app/'));
    }
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
            logger.fatal('package download get '+'[SELECT ERROR - '+ error.message);
            res.send({code:101});
        }
        else if (result.length === 0)
        {
            logger.error('package download get error:no data in database');
            res.send({code: 101});
        }
        else {
            var filepath = path.resolve(__dirname,'../../app') +"/"+ result[0].fileName;
            logger.info('App filepath:',filepath);
            var fileName = path.basename(filepath);
            logger.info("fileName:",fileName);
            fs.stat(filepath, function (error, stats) {
                if (error) {
                    logger.error("package download get :file " +filepath + "not found");
                    res.send({code: 101});
                }
                else {
                     res.set({
                        'Content-Type': 'application/vnd.android.package-archive',
                        'Content-Disposition': 'attachment; filename='+fileName,
                        'Content-Length': stats.size
                    });
                    fs.createReadStream(filepath).pipe(res);
                    logger.info("db proc package OK");
                }
            });
        }
    });

    return next();

}