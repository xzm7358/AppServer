/**
 * Created by zzs on 2017/1/18.
 */
var dbhandler = require('./dbhandler');
var logger = require('./log').log('logFile');

const Router = require('restify-router').Router;
const router = new Router();

router.get('/:imei',function (req, res, next) {
  logger.info('GET %s', req.url);
  res.contentType = 'json';
  if (!req.params.hasOwnProperty('imei')) {
    logger.error('event get url error: no imei');
    res.send({code:101});
  }
  var imei = req.params.imei;
  if (imei.length != 15) {
    logger.error('imei.length = '+ imei.length);
    res.send({code: 101});
  }
  logger.info('get imei: '+ imei);
  if (!req.query.hasOwnProperty('endAt')) {
    var selectsql = 'SELECT * FROM ' + 'gps_' + imei + ' order by timestamp desc limit 20';
  } else {
    var endAt = req.query.endAt;
    logger.log('endAt:',endAt);
    selectsql = 'SELECT * FROM gps_' + imei + ' WHERE ' + 'timestamp <= ' + endAt +' order by timestamp desc limit 20';
  }	
  logger.info('selectsql:' + selectsql);

  dbhandler(selectsql, function (selecterr, selectres) {
    if (selecterr) {
      logger.fatal('[SELECT ERROR - ', selecterr.message);
      res.send({code:101});
    } else if (selectres.length === 0) {
      logger.error('selectres.length = '+ selectres.length);
      res.send({code:101});
    } else {
      logger.info('db proc OK');
      res.send({event:selectres});
    }
  });
  return next();
});
module.exports=router;
