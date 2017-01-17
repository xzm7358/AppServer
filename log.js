/**
 * Created by zzs on 2017/1/16.
 */
var log4js = require('log4js');
var config = require('./config.json');

exports.log = function (name) {
    log4js.configure({
        "appenders":
            [
                {
                    "type":"console",
                    "category":"console"
                },
                {
                    "type":"dateFile",
                    "category":"logFile",
                    "filename":"./logs/time",
                    "pattern":"-yyyy-MM-dd.log",
                    "level":"ERROR",
                    "alwaysIncludePattern":true
                }
            ],
        "replaceConsole": true
    });
    var dataFilelog = log4js.getLogger(name);
    return dataFilelog;
}