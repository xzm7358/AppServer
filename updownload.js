/**
 * Created by zouzh on 2017/2/28.
 */
var updownload = exports;
var logger = require('./log');
var fs = require('fs');
var formidable = require('formidable');

updownload.get = function (req, res, next) {
    req.contentType = 'json';
    logger.log('logFile').info('GET %s',req.url);
    if (!req.params.imei) {
        logger.log('logFile').error('GET ftp input params: no imei');
        res.send({code:101});
        return next();
    }
    var imei = req.params.imei;


    return next();

};

updownload.post = function (req, res, next) {
    req.contentType = 'json';
    logger.log('logFile').info('POST %s',req.url);
    if (!req.params.imei) {
        logger.log('logFile').error('POST ftp input params: no imei');
        res.send({code:101});
        return next();
    }
    var imei = req.params.imei;
    var form = formidable.IncomingForm();
    var filePath = '/var/ftp/home/' + imei;
    if (!fs.existsSync(filePath)) {
        fs.mkdirSync(filePath);
    }
    form.uploadDir = filePath;
    form.parse(req, function (err, fields, files) {
        if (err)
        {
            logger.log('logFile').error('upload file failed, error:',err);
            res.send({code:0});
            return next();
        }

    })

    return next();
}
