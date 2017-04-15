/**
 * Created by zouzh on 2017/1/18.
 */

var logger = require('./log').log('logFile');
var dbhandler = require('./dbhandler')

const Router = require('restify-router').Router;
const router = new Router();


//seek
router.get('/:tel',function (req, res, next) {
    logger.info('GET %s', req.url);
    res.contentType = 'json';
    if (!req.params.hasOwnProperty('tel')) {
        logger.error('no tel in the url');
        res.send({code:101});
        return next();
    }
    var tel = req.params.tel;
    var reg = /^1[0-9]{10}/;
    if (!reg.test(tel)) {
        logger.error("user's tel-format is not correct: "+ tel);
        res.send({code:101});
        return next();
    }
    logger.info('get tel: '+tel);

    if (!req.query.hasOwnProperty('imei')) {
        logger.error('no imei in the url');
        res.send({code:101});
        return next();
    }
    var imei = req.query.imei;
    if (imei.length != 15) {
        logger.error('imei is not correct: '+ imei);
        res.send({code:101});
        return next();
    }
    logger.info('get imei: '+ imei );
    var getsql = "select userTel from imei2User where imei=" + imei;
    logger.info("Sql:",getsql)
    dbhandler(getsql,function (geterr, getres) {
        if (geterr) {
            logger.fatal('[SELECT ERROR - ', geterr.message);
            res.send({code:101});
            return next();
        } else {
            logger.info('findres:',getres);
            if (getres) {
                logger.info(getres);
                res.send({userTel:getres});
            } else {
                logger.error('No imei in the Object table:', imei);
                res.send({code:101});
            }
        }

    })
    return next();
});
//bingding
router.post('/:tel',function (req, res, next) {
    logger.info('POST %s', req.url);
    res.contentType = 'json';

    if (!req.params.hasOwnProperty('tel')) {
        logger.error('no tel in the url');
        res.send({code:101});
        return next();
    }
    var tel = req.params.tel;
    var reg = /^1[0-9]{10}/;
    if (!reg.test(tel)) {
        logger.error("user's tel-format is not correct: "+ tel);
        res.send({code:101});
        return next();
    }
    logger.info('get tel: '+tel);

    if (!req.query.hasOwnProperty('imei')) {
        logger.error('no imei in the url');
        res.send({code:101});
        return next();
    }
    var imei = req.query.imei;
    if (imei.length != 15) {
        logger.error('imei is not correct: '+ imei);
        res.send({code:101});
        return next();
    }
    logger.info('get imei: '+ imei );
    var bindingsql = "insert into imei2User(imei,userTel) values(" + imei + "," + tel +")"
    dbhandler(bindingsql,function (bindingerr, bindingres) {
        if (bindingerr) {
            logger.fatal('[SELECT ERROR - ', bindingerr.message);
            res.send({code:101});
            return next();
        } else {
            logger.info('findres:',bindingres);
            res.send({code:0})
        }

    })
    return next();
});
//delete
router.del('/:tel',function (req, res, next) {
    logger.info('DEL %s', req.url);
    res.contentType = 'json';

    if (!req.params.hasOwnProperty('tel')) {
        logger.error('no tel in the url');
        res.send({code:101});
        return next();
    }
    var tel = req.params.tel;
    var reg = /^1[0-9]{10}/;
    if (!reg.test(tel)) {
        logger.error("user's tel-format is not correct: "+ tel);
        res.send({code:101});
        return next();
    }
    logger.info('get tel: '+tel);

    if (!req.query.hasOwnProperty('imei')) {
        logger.error('no imei in the url');
        res.send({code:101});
        return next();
    }
    var imei = req.query.imei;
    if (imei.length != 15) {
        logger.error('imei is not correct: ' + imei);
        res.send({code: 101});
        return next();
    }
    logger.info('get imei: '+ imei );
    var deletesql = "delete from imei2User where imei=" + imei
    dbhandler(deletesql,function (deleteerr, deleteres) {
        if (deleteerr) {
            logger.fatal('[SELECT ERROR - ', deleteerr.message);
            res.send({code:101});
            return next();
        } else {
            logger.info('findres:',deleteres);
            res.send({code:0})
        }

    })
    return next();
});
module.exports=router;