/**
 * Created by zzs on 2017/1/12.
 */

var fs = require('fs');
var amrToMp3 = require('amrToMp3');
var path = require('path');
var logger = require('./log').log('logFile');

const Router = require('restify-router').Router;
const router = new Router();

router.get('/',function (req, res, next) {
  logger.info('GET %s', req.url);
  res.contentType = 'json';
  if (!req.query.name) {
    logger.error('record input: No name.');
    res.send({code:101});
    return next();
  }
  var name = req.query.name;
  var accept = '.amr';
  logger.info('accept before:',req.headers.accept);
  if(req.headers.accept === 'audio/mp3'){
    accept = '.mp3';
  } else if ((req.headers.accept === 'audio/AMR')||(!req.headers.hasOwnProperty('accept'))) {
    accept = '.amr';
  }
  logger.info('accept after:',accept);
  var serverpath = '/var/ftp/home/';
  var filepath = serverpath + name + '.amr';
  var mp3path = path.resolve(__dirname, '../../') + '/src/mp3';
  fs.stat(filepath, function (error, stats) {
    if (error) {
      logger.error('audio file ' +filepath + ' not found');
      res.send({code: 101});
    } else {
      logger.info('audio file exists');
      if (req.headers.accept === 'audio/mp3') {
        amrToMp3(filepath, mp3path).then(function (data) {
          logger.info('get into the amrtoMp3 transform:',path.basename(filepath, '.amr')+ '.mp3');
          res.set({
            'Content-Type': 'application/octet-stream',
            'Content-Disposition': 'attachment; filename='+path.basename(filepath, '.amr')+ '.mp3',
            'Content-Length': stats.size
          });
          filepath=path.join(data);
          logger.info('path:',filepath);
          fs.createReadStream(filepath).pipe(res);
          logger.info('monitor transform OK');
        }).catch(function (error) {
          logger.fatal('error:',error);
          res.send({code:101});
        });
      } else {
        res.set({
          'Content-Type': 'application/octet-stream',
          'Content-Disposition': 'attachment; filename='+path.basename(filepath),
          'Content-Length': stats.size
        });
        fs.createReadStream(filepath).pipe(res);
        logger.info('monitor transform OK');
      }

    }
  });
  return next();
});
module.exports=router;