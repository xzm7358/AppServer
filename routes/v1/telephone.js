/**
 * Created by jk on 2016-12-28.
 */
TopClient = require('topSdk').ApiClient;
var mysql = require('mysql');
var callAlarm = require('./alarm');
var dbhandler = require('./dbhandler');
var logger = require('./log').log('logFile');

var telephone = exports;
var telnumber = [
    "01053912804",
    "057126883072",
    "051482043270",
    "01053912805",
    "051482043271",
    "057126883073",
    "051482043272",
    "01053912806",
    "051482043273",
    "057126883074",
    "051482043274",
];
telephone.put = function(req, res, next) {
    logger.info('PUT %s', req.url);
    res.contentType = 'json';
    if(!req.params.hasOwnProperty('imei')){
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if(imei.length != 15) {
        res.send({code: 101});
        return next();
    }
    logger.info('get imei: '+ imei);

    var arr = [];
    req.on("data",function(data){
        arr.push(data);
    });
    req.on("end",function(){
        var data = Buffer.concat(arr).toString();
        var ret = JSON.parse(data);
        req.body = ret;
    });
    if(!req.body.hasOwnProperty('caller')) {
        logger.error('telephone.js put method no caller in the url');
        logger.error('PUT %s', req.url);
        res.send({code: 101});
        return next();
    }
    var caller = req.body['caller'];
    if(caller > 10 || caller < 0 )
    {
        logger.error('telephone.js put method caller range is too large: ' + caller);
        logger.error('PUT %s', req.url);
        res.send({code: 101});
        return next();
    }
    logger.info('get caller: ' + telnumber[caller]);

    var selectsql = 'select * from imei2Telnumber where imei = \''+ imei + '\'';
    logger.info(selectsql);

    dbhandler(selectsql, function (starterr, startresult){
        if (starterr)
        {
            logger.error('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
            return next();
        }
        if(startresult.length === 0) {
            logger.error('select from imei2Telnumber result.length = ' + startresult.length);
            res.send({code: 101});
            return next();
        }
        if(!startresult[0].hasOwnProperty('Telnumber')) {
            logger.error('telephone.js put no telnumber in result.');
            logger.error('PUT %s', req.url);
            res.send({code: 101});
            return next();
        }
        var telephone = startresult[0].Telnumber;
        logger.info('test call: '+ telephone + ' ' + telnumber[caller]);
        callAlarm.put(telnumber[caller], telephone);

        //因为 nodejs 有回调的函数非阻塞，异步执行，所以这个地方应该嵌套执行
        selectsql = 'update imei2Telnumber set CallNumber = \'' + telnumber[caller] + '\'where imei = \''+imei+'\'';
        dbhandler(selectsql, function (starterr, startresult) {
            if (starterr) {
                logger.error('telephone.js put update imei2Telnumber [SELECT ERROR - ', starterr.message);
                res.send({code: 101});
            }
            else {
                logger.info('db proc OK');
                res.send({code: 0});
            }
        });
    });

    return next();
};

telephone.post = function(req, res, next) {
    logger.info('POST %s', req.url);
    res.contentType = 'json';

    if(!req.params.hasOwnProperty('imei')){
        logger.error('no imei');
        logger.error('POST %s', req.url);
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if(imei.length != 15) {
        logger.error('telephone.js imei not correct: '+ imei);
        logger.error('POST %s', req.url);
        res.send({code: 101});
        return next();
    }
    logger.info('get imei: '+ imei);

    var arr = [];
    req.on("data",function(data){
        arr.push(data);
    });
    req.on("end",function(){
        var data= Buffer.concat(arr).toString();
        var ret = JSON.parse(data);

        if(!ret.hasOwnProperty('telephone'))
        {
            logger.error('no telephone');
            logger.error('POST %s', req.url);
            res.send({code: 101});
            return next();
        }
        var phonenumber = ret.telephone;

        var selectsql = 'replace into imei2Telnumber(imei,Telnumber) values(\'' + imei + '\',\'' + phonenumber + '\')';
        logger.info('selectsql:' + selectsql);
        dbhandler(selectsql, function (starterr, startresult){
            if (starterr) {
                logger.fatal('[SELECT ERROR - ', starterr.message);
                res.send({code: 101});
            }
            else {
                logger.info('db proc OK');
                res.send({code: 0});
            }
        });
        return next();
    });

    if (req.body.hasOwnProperty('telephone')) {
        var phoneNumber = req.body.telephone;

        var selectsql = 'replace into imei2Telnumber(imei,Telnumber) values(\'' + imei + '\',\'' + phoneNumber + '\')';
        logger.info('selectsql:' + selectsql);
        dbhandler(selectsql, function (starterr, startresult){
            if (starterr) {
                logger.fatal('[SELECT ERROR - ', starterr.message);
                res.send({code: 101});
            }
            else {
                logger.info('db proc OK');
                res.send({code: 0});
            }
        });
        return next();
    }


    //兼容老版本的协议，telephone在URL中
    if(req.query.hasOwnProperty('telephone')){
        var phonenumber = req.query.telephone;

        var selectsql = 'replace into imei2Telnumber(imei,Telnumber) values(\'' + imei + '\',\'' + phonenumber + '\')';
        logger.info('selectsql:' + selectsql);
        dbhandler(selectsql, function (starterr, startresult){
            if (starterr) {
                logger.fatal('[SELECT ERROR - ', starterr.message);
                res.send({code: 101});
            }
            else {
                logger.info('db proc OK');
                res.send({code: 0});
            }
        });
        return next();
    }
    return next();
};

telephone.get = function(req, res, next) {
    logger.info('GET %s', req.url);
    res.contentType = 'json';

    if(!req.params.hasOwnProperty('imei')){
        logger.error('no imei');
        logger.error('POST %s', req.url);
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if(imei.length != 15) {
        logger.error('imei not correct: '+ imei);
        logger.error('POST %s', req.url);
        res.send({code: 101});
        return next();
    }
    logger.info('get imei: '+ imei);

    var selectsql = 'select * from imei2Telnumber where imei = \''+imei+'\'';
    logger.info('selectsql:'+ selectsql);
    dbhandler(selectsql, function (starterr, startresult){
        if (starterr)
        {
            logger.fatal('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
        }
        else {
            if(startresult.length === 0)
            {
                logger.error("telephone.js "+imei+ " get method select * from imei2Telnumber : no telnumber in database");
                res.send({code: 101});
            }
            else{
                if(startresult[0].hasOwnProperty('Telnumber')) {
                    logger.info('db proc OK');
                    var telephone = startresult[0].Telnumber;
                    res.send({telephone: telephone});
                }
                else{
                    logger.error("telephone.js " +imei+" get method select * from imei2Telnumber :no telnumber in sql result");
                    res.send({code: 101});
                }
            }
        }
    });

    return next();
};

telephone.del = function(req, res, next) {
    logger.info('DELETE %s', req.url);
    res.contentType = 'json';

    if(!req.params.hasOwnProperty('imei')){
        logger.error('telephone.js del method url no imei');
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if(imei.length != 15) {
        logger.error('telephone.js del method url\'s imei not correct: '+ imei);
        res.send({code: 101});
        return next();
    }
    logger.info('get imei: '+ imei);

    var selectsql = 'delete from imei2Telnumber where imei = \'' + imei + '\'';
    logger.info(selectsql);
    dbhandler(selectsql, function (starterr, startresult){
        if (starterr) {
            logger.error('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
        }
        else {
            logger.info('db proc OK');
            res.send({code: 0});
        }
    });

    return next();
};
