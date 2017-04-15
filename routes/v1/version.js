/* Copyright (C) Xiaoan Technology Co., Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Tom Chiang <jiangtao@xiaoantech.com>, Feb 2017
 */

var dbhandler = require('./dbhandler');
var fs = require('fs');
var logger = require('./log').log('logFile');
var path = require('path');

const Router = require('restify-router').Router;
const router = new Router();


router.get('/', function(req , res, next) {
  var selectsql;
  logger.trace('GET ', req.url);
  res.contentType = 'json';
  var type = req.query.type;
  logger.info('type: ', type);
  if (( 'ios' === type)||('1' === type))
    {
    selectsql = 'SELECT * from AppPackage where type = 1 order by id desc limit 1';
  }
  else if (( 'android' === type)||('0' === type)|| undefined === type)
    {
    selectsql = 'SELECT * from AppPackage where type = 0 order by id desc limit 1';
  }
  var appPath = path.resolve(__dirname,'../../app/');
  if (!fs.existsSync(appPath)) {
    fs.mkdirSync(appPath);
    logger.log('create appPath:',appPath);
  }
  logger.info(selectsql);
  dbhandler(selectsql, function (error, result) {
    if (error) {
      logger.fatal('version.js '+'[SELECT ERROR - '+ error.message);
      res.send({code: 101});
    } else if(result.length === 0) {
      logger.error('no data in database');
      res.send({code:101});
    } else {
      var app_path = appPath+ '/' + result[0].fileName;
      logger.log('app_path:',app_path);
      fs.stat(app_path,function (err,stats) {
        if (err) {
          logger.error('no App in the path:',app_path);
          res.send({code:101});
          return next();
        } else {
          var size = (stats.size / (1024*1024)).toFixed(2);
          logger.info('db AppPackge info OK');
          res.send({
            versionName:result[0].versionName,
            versionCode:result[0].versionCode,
            changelog:result[0].changeLog,
            packageSize:size + 'MB'
          });
        }
      });
    }
  });
  return next();
});

module.exports = router;
