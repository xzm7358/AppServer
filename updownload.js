/**
 * Created by zouzh on 2017/2/28.
 */
var updownload = exports;
var logger = require('./log');
var fs = require('fs');
var path = require('path');
var multiparty = require('multiparty');
const uploadDir = "./upload/";
const MAXNAMENUM = 32;
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
    logger.log('logFile').info('POST %s',req.url);
   /*if (!req.body) {
        logger.log('logFile').error('upload error: body is empty');
        res.send("error,body is empty");
    }
	*/
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
        logger.log('logFile').info('mkdir '+ uploadDir + 'in upload process');
    }
	var receiveBodyData = [];
	var nread = 0;
	
	req.on('data',function (chunk) {
		nread += chunk.length;
		receiveBodyData.push(chunk);
    });
	req.on('end',function () {
		var BodyDataBuff = Buffer.concat(receiveBodyData);
		logger.log('logFile').info('BodyDataBuff.length:',BodyDataBuff.length);
		
        logger.log('logFile').info("receiveBodyData.length:",nread);
		
		var fileName = BodyDataBuff.toString('utf-8',0,MAXNAMENUM);
		var pattern = /\d{15}\_[-]?\d*\.amr/;
		if(pattern.test(fileName)) {
			logger.log('logFile').info('fileName.length:',fileName.length);
			var amrName = fileName.match(pattern)[0];
			logger.log('logFile').info("amrName:",amrName);
			var storeBodyDataBuf = BodyDataBuff.slice(MAXNAMENUM,nread);
			logger.log('logFile').info('After ,BodyDataBuff.length:',storeBodyDataBuf.length);
			fs.writeFileSync("./upload/"+amrName,storeBodyDataBuf);
			res.send({code:0});
		} else {
			res.send({code:100});
		}
    });
	
    return next();
}
