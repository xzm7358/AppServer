1/**
 * Created by zzs on 2017/1/3.
 */

var package = exports;
var mysql = require('mysql');
var fs = require('fs');
package.get = function (req, res, next) {
    var type;
    console.log("GET ", req.url);
    res.contentType = 'json';
    type = req.query.type;
    if (( 'android' === type)||('0' === type))
    {
        selectsql = 'SELECT * from AppPackage order by id desc limit 1';
    }
    else
    {
        res.end({code:101});
        return next();
    }
    var connnection = mysql.createConnection({
        host : 'test.xiaoan110.com',
        user : 'eelink',
        password: 'eelink',
        database: 'gps',
    });
    connnection.connect();
    connnection.query(selectsql, function (error , result) {
        connnection.end();
        if (error)
        {
            console.log('[SELECT ERROR - ', error.message);
            res.end({code:101});
        }
        else if (res.length === 0)
        {
            console.log('no data in database');
            res.end({code: 101});
        }
        else {
            var path = './app/' + result[0].fileName;
            var stats = fs.statSync(path);
            if (stats.isFile())
            {
                res.set({
                    'Content-Type': 'application/octet-stream',
                    'Content-Disposition': 'attachment; filename=package',
                    'Content-Length': stats.size
                });
                fs.createReadStream(path).pipe(res);
            }
            else
            {
                res.end(404);
            }

        }
    });

    return next();

}