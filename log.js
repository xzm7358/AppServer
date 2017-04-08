/**
 * Created by zzs on 2017/1/16.
 */
var log4js = require('log4js');
var fs = require('fs');

exports.log = function (name) {
    if (!fs.existsSync("./logs/")) {
        fs.mkdirSync("./logs/");
    }
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
                    "alwaysIncludePattern":true
                }
            ],
        "replaceConsole": true,
        "levels":
            {
                "logFile":"INFO"
            }
    });
    var dataFilelog = log4js.getLogger(name);
    return dataFilelog;
}