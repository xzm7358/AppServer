/**
 * Created by zouzh on 2017/2/28.
 */
var updownload = exports;
var logger = require('./log');
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
const uploadDir = "./upload/";

updownload.get = function (req, res, next) {
    res.contentType = 'json';
    logger.log('logFile').info('GET %s',req.url);
    if (!req.params.imeiName) {
        logger.log('logFile').error('GET ftp input params: no imei');
        res.send({code:101});
        return next();
    }
    var imeiName = req.params.imeiName;

    var basefile = uploadDir + imeiName + '.amr';
    logger.log('logFile').info('basepath in download file process:',basefile);
    fs.stat(basefile, function (error, stats) {
        if (error) {
            logger.log('logFile').error("download ftp file failed, file " +basefile + "not found");
            res.send({code: 101});
        }
        else {
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename='+path.basename(basefile),
                'Content-Length': stats.size
            });
            fs.createReadStream(basefile).pipe(res);
            logger.log('logFile').info("ftp file trans OK");
        }
    });

    return next();

};

updownload.post = function (req, res, next) {
    res.contentType = 'json';
    logger.log('logFile').info('GET %s',req.url);
    if (req.body) {
        logger.log('logFile').error('upload error: body is empty');
        res.send("error,body is empty");
    }
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
        logger.log('logFile').info('mkdir '+ uploadDir + 'in upload process');
    }
    res.contentType = 'json';
    var form = new multiparty.Form({
        uploadDir: uploadDir,
        encoding : 'utf-8',
        keepExtensions : true,
        maxFieldsSize : 2 * 1024 * 1024
    });
    form.on('error', function (err) {
        logger.log('logFile').error('Error occur at the upload file process from device during parsing form:' ,err.stack);
        res.send({code:100});
    });
    form.parse(req, function (err, fields, files) {
        if (err) {
            res.writeHead(400, {'content-type': 'text/plain'});
            res.end("invalid request in upload process: " + err.message);
            return next();
        } else {
            var fileNameArr = Object.keys(files);
            var firstFileName = fileNameArr[0];
            var fileDataArr = files[firstFileName];
            var fileData = fileDataArr[0];
            var uploadedPath = fileData.path;
            var dstPath = './upload/' + fileData.originalFilename;
            logger.log('logFile').info('rename file destination Path is ',dstPath);
            logger.log('logFile').info('rename file from the uploadPath:',uploadedPath);
            fs.rename(uploadedPath, dstPath, function (err) {
                if (err) {
                    logger.log('logFile').info('rename failed but file had been uploaded:', err);
                    res.send("file had been uploaded success but rename error:",err);
                } else {
                    logger.log('logFile').info('rename file success at the form parse');
                    res.send({fileName:fileData.originalFilename});
                }
                return next();
            });
        }
    });
    return next();
}
