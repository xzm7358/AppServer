/**
 * Created by zzs on 2017/1/3.
 */

var version = exports;
var mysql = require('mysql');
var fs = require('fs');
var config = require('./config.json');

version.get = function(req , res, next) {
    var type;
    var app_path;
    var size;
    var selectsql;
    console.log("GET ", req.url);
    res.contentType = 'json';
    type = req.query.type;
    console.log('type: ', type);
    if (( 'ios' === type)||('1' === type))
    {
        selectsql = 'SELECT * from AppPackage where type = 1 order by id desc limit 1';
    }
    else if (( 'android' === type)||('0' === type)|| undefined === type)
    {
        selectsql = 'SELECT * from AppPackage where type = 0 order by id desc limit 1';
    }
    console.log(selectsql);
    var connnection = mysql.createConnection(config.mysql);
    connnection.connect();
    connnection.query(selectsql, function (error, result) {
        connnection.end();
        if (error)
        {
            console.log('[SELECT ERROR - ', error.message);
            res.send({code: 101});
        }
        else if (res.length === 0)
        {
            console.log('no data in database');
            res.send({code: 101});
        }
        else
        {
            app_path = './app/' + result[0].fileName;
            size = (fs.statSync(app_path).size / (1024*1024)).toFixed(2);
            console.log('db AppPackge info OK');
            res.send({
                versionName:result[0].versionName,
                versionCode:result[0].versionCode,
                changelog:result[0].changeLog,
                packageSize:size + "MB"
            });
        }
    });
    return next();
}
