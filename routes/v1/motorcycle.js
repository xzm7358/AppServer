/**
 * Created by zouzh on 2017/4/14.
 */
const dbhandler = require('./dbhandler');

const logger = require('./log').log('logFile');
const async = require('async');
const motorcycle = exports;

motorcycle.post = function (req, res, next) {
  logger.info('POST %s',req.url);
  res.contentType = 'json';

  if (!req.body) {
      logger.error('motorcycle.js post error: req.body empty!');
      res.send({code:102});
  }
  else {
      var imei = req.body.imei;
      logger.info('motorcycle.js get function get imei:'+imei);
      if(imei.length != 15) {
          res.send({code: 101});
          return next();
      }
      var ifExistSql = "select * from motorcycle where imei="+imei;
      var insertSql = "insert into motorcycle values("+imei+")";
      logger.info(ifExistSql);
      logger.info(insertSql);
      async.waterfall([
          function (callback) {
            dbhandler(ifExistSql,function (existerr, existres) {
                if (existerr) {
                    logger.fatal('motorcycle.js ifexist imei:'+imei+' [SELECT ERROR - ' + existerr);
                    callback(null,1);
                } else if (existres[0] == undefined) {//not exist
                    callback(null,0);
                } else {//exist
                    callback(null,2);
                }

            })
          },
          function (ifexist, callback) {
            logger.info(ifexist);
              if (ifexist === 0) {
                  dbhandler(insertSql,function (inserterr, insertres) {
                      if (inserterr) {
                          logger.fatal('motorcycle.js insert imei:'+imei+' [SELECT ERROR - ' + inserterr);
                          callback(null,"insert error");
                      } else {
                          logger.info("motorcycle.js imei:"+imei+" insert res is " +insertres);
                          callback(null,0);
                      }
                  })
              } else if (ifexist === 1){
                  callback(null,"ifexist error");
              } else {
                  callback(null,"imei exist");
              }
          }
      ],function (err, caption) {
          logger.error("motorcycle.js imei "+imei+" async.waterfall error:"+err);
          logger.info("motorcycle.js imei "+imei+" async.waterfall caption:"+caption);
          if ( err ) {
              res.send({code:101});
          } else {
              res.send({code:0});
          }
      });
  }
  return next();
};

motorcycle.del = function (req, res, next) {
    logger.info('DEL %s',req.url);
    res.contentType = 'json';
    logger.info(req.params);
    if(!req.params.hasOwnProperty('imei')){
        logger.error('history get req.param no imei');
        res.send({code: 101});
        return next();
    } else {
        var imei = req.params.imei;
        logger.info('motorcycle.js del function get imei:'+imei);
        if(imei.length != 15) {
            res.send({code: 101});
            return next();
        }
        logger.info('motorcycle.js get imei:'+imei);
        var deleteSql = "delete from motorcycle where imei="+imei;
        dbhandler(deleteSql,function (deleteerr, deleteres) {
            if (deleteerr) {
                logger.fatal("motorcycle.js del imei:"+imei+" [SELECT ERROR - "+ deleteerr.message);
                res.send({code:101});
                return next();
            } else {
                logger.info("motorcycle.js del imei:"+imei+" del success");
                res.send({code:0})
                return next();
            }

        })
    }
    return next();
};
