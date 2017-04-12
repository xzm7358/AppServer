/**
 * Created by zzs on 2017/1/16.
 */
var log4js = require('log4js');
var fs = require('fs');
var path = require('path');
exports.log = function (name) {
    if (!fs.existsSync(path.resolve(__dirname, '../../logs/'))) {
        fs.mkdirSync(path.resolve(__dirname, '../../logs/'));
    }
    var filename = path.resolve(__dirname, '../../') + "/logs/time";
    console.log('filename:',filename);
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
                    "filename":filename,
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