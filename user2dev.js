/**
 * Created by zouzh on 2017/1/18.
 */
var user2dev = exports;
var logger = require('./log');
var dbhandler = require('./dbhandler')
//seek
user2dev.get = function (req, res, next) {
    logger.log('logFile').info('GET %s', req.url);
    res.contentType = 'json';
    if (!req.params.hasOwnProperty('tel')) {
        logger.log('logFile').error('no tel in the url');
        res.send({code:101});
        return next();
    }
    var tel = req.params.tel;
    var reg = /^1[0-9]{10}/;
    if (!reg.test(tel)) {
        logger.log('logFile').error("user's tel-format is not correct: "+ tel);
        res.send({code:101});
        return next();
    }
    logger.log('logFile').info('get tel: '+tel);

    if (!req.query.hasOwnProperty('imei')) {
        logger.log('logFile').error('no imei in the url');
        res.send({code:101});
        return next();
    }
    var imei = req.query.imei;
    if (imei.length != 15) {
        logger.log('logFile').error('imei is not correct: '+ imei);
        res.send({code:101});
        return next();
    }
    logger.log('logFile').info('get imei: '+ imei );
    getsql = "select userTel from imei2User where imei=" + imei;
    logger.log('logFile').info("Sql:",getsql)
    dbhandler(getsql,function (geterr, getres) {
        if (geterr) {
            logger.log('logFile').fatal('[SELECT ERROR - ', geterr.message);
            res.send({code:101});
            return next();
        } else {
            logger.log('logFile').info('findres:',getres);
            if (getres) {
                logger.log('logFile').info(getres);
                res.send({userTel:getres});
            } else {
                logger.log('logFile').error('No imei in the Object table:', imei);
                res.send({code:101});
            }
        }

    })
    return next();
}
//bingding
user2dev.post = function (req, res, next) {
    logger.log('logFile').info('POST %s', req.url);
    res.contentType = 'json';

    if (!req.params.hasOwnProperty('tel')) {
        logger.log('logFile').error('no tel in the url');
        res.send({code:101});
        return next();
    }
    var tel = req.params.tel;
    var reg = /^1[0-9]{10}/;
    if (!reg.test(tel)) {
        logger.log('logFile').error("user's tel-format is not correct: "+ tel);
        res.send({code:101});
        return next();
    }
    logger.log('logFile').info('get tel: '+tel);

    if (!req.query.hasOwnProperty('imei')) {
        logger.log('logFile').error('no imei in the url');
        res.send({code:101});
        return next();
    }
    var imei = req.query.imei;
    if (imei.length != 15) {
        logger.log('logFile').error('imei is not correct: '+ imei);
        res.send({code:101});
        return next();
    }
    logger.log('logFile').info('get imei: '+ imei );
    bindingsql = "insert into imei2User(imei,userTel) values(" + imei + "," + tel +")"
    dbhandler(bindingsql,function (bindingerr, bindingres) {
        if (bindingerr) {
            logger.log('logFile').fatal('[SELECT ERROR - ', bindingerr.message);
            res.send({code:101});
            return next();
        } else {
            logger.log('logFile').info('findres:',bindingres);
            res.send({code:0})
        }

    })
    return next();
};
//delete
user2dev.del = function (req, res, next) {
    logger.log('logFile').info('DEL %s', req.url);
    res.contentType = 'json';

    if (!req.params.hasOwnProperty('tel')) {
        logger.log('logFile').error('no tel in the url');
        res.send({code:101});
        return next();
    }
    var tel = req.params.tel;
    var reg = /^1[0-9]{10}/;
    if (!reg.test(tel)) {
        logger.log('logFile').error("user's tel-format is not correct: "+ tel);
        res.send({code:101});
        return next();
    }
    logger.log('logFile').info('get tel: '+tel);

    if (!req.query.hasOwnProperty('imei')) {
        logger.log('logFile').error('no imei in the url');
        res.send({code:101});
        return next();
    }
    var imei = req.query.imei;
    if (imei.length != 15) {
        logger.log('logFile').error('imei is not correct: ' + imei);
        res.send({code: 101});
        return next();
    }
    logger.log('logFile').info('get imei: '+ imei );
    deletesql = "delete from imei2User where imei=" + imei
    dbhandler(deletesql,function (deleteerr, deleteres) {
        if (deleteerr) {
            logger.log('logFile').fatal('[SELECT ERROR - ', deleteerr.message);
            res.send({code:101});
            return next();
        } else {
            logger.log('logFile').info('findres:',deleteres);
            res.send({code:0})
        }

    })
    return next();
};