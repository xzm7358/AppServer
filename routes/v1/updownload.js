/**
 * Created by zouzh on 2017/2/28.
 */
var updownload = exports;
var logger = require('./log').log('logFile');
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
const uploadDir = "../upload/";

const Router = require('restify-router').Router;
const router = new Router();

router.get('/:imeiName',function (req, res, next) {
    res.contentType = 'json';
    logger.info('GET %s',req.url);
    if (!req.params.imeiName) {
        logger.error('GET ftp input params: no imei');
        res.send({code:101});
        return next();
    }
    var imeiName = req.params.imeiName;

    var basefile = uploadDir + imeiName + '.amr';
    logger.info('basepath in download file process:',basefile);
    fs.stat(basefile, function (error, stats) {
        if (error) {
            logger.error("download ftp file failed, file " +basefile + "not found");
            res.send({code: 101});
        }
        else {
            res.set({
                'Content-Type': 'application/octet-stream',
                'Content-Disposition': 'attachment; filename='+path.basename(basefile),
                'Content-Length': stats.size
            });
            fs.createReadStream(basefile).pipe(res);
            logger.info("ftp file trans OK");
        }
    });

    return next();

});

router.post('',function (req, res, next) {
    logger.info('POST %s',req.url);
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
        logger.info('mkdir '+ uploadDir + 'in upload process');
    }
	var receiveBodyData = [];
	var nread = 0;
	var fileName =  req.headers.filename;
	logger.info(fileName);
	req.on('data',function (chunk) {
		nread += chunk.length;
		receiveBodyData.push(chunk);
    });
	req.on('end',function () {
		var BodyDataBuff = Buffer.concat(receiveBodyData);
		logger.info('BodyDataBuff.length:',BodyDataBuff.length);
        logger.info("receiveBodyData.length:",nread);

		var pattern = /\d{15}\_[-]?\d*\.amr/;
		if(pattern.test(fileName)) {
			logger.info('fileName.length:',fileName.length);
			var amrName = fileName.match(pattern)[0];
			logger.info("amrName:",amrName);
			fs.writeFileSync("./upload/"+amrName,BodyDataBuff);
			res.send({code:0});
		} else {
			res.send({code:100});
		}
    });
	
    return next();
});
module.exports=router;