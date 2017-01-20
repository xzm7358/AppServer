/**
 * Created by jk on 2016-12-28.
 */
TopClient = require('topSdk').ApiClient;
var mysql = require('mysql');
var callAlarm = require('./alarm');
var dbhandler = require('./dbhandler');
var logger = require('./log');

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
    logger.log('logFile').info('PUT %s', req.url);
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
    logger.log('logFile').info('get imei: '+ imei);

    var arr = [];
    req.on("data",function(data){
        arr.push(data);
    });
    req.on("end",function(){
        var data= Buffer.concat(arr).toString();
        var ret = JSON.parse(data);
        req.body = ret;
    });
    if(!req.body.hasOwnProperty('caller')) {
        logger.log('logFile').error('no caller in the url');
        res.send({code: 101});
        return next();
    }
    var caller = req.body['caller'];
    if(caller > 10 || caller < 0 )
    {
        logger.log('logFile').error('caller range is too large: ' + caller);
        res.send({code: 101});
        return next();
    }
    logger.log('logFile').info('get caller: ' + telnumber[caller]);

    var selectsql = 'select * from imei2Telnumber where imei = \''+ imei + '\'';
    logger.log('logFile').info(selectsql);

    dbhandler(selectsql, function (starterr, startresult){
        if (starterr)
        {
            logger.log('logFile').error('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
            return next();
        }
        if(startresult.length === 0) {
            logger.log('logFile').error('startresult.length = ' + startresult.length);
            res.send({code: 101});
            return next();
        }
        if(!startresult[0].hasOwnProperty('Telnumber')) {
            logger.log('logFile').error('no telnumber in result.');
            res.send({code: 101});
            return next();
        }
        var telephone = startresult[0].Telnumber;
        logger.log('logFile').info('test call: '+ telephone + ' ' + telnumber[caller]);
        callAlarm.put(telnumber[caller], telephone);

        //因为 nodejs 有回调的函数非阻塞，异步执行，所以这个地方应该嵌套执行
        selectsql = 'update imei2Telnumber set CallNumber = \'' + telnumber[caller] + '\'where imei = \''+imei+'\'';
        dbhandler(selectsql, function (starterr, startresult) {
            if (starterr) {
                logger.log('logFile').error('[SELECT ERROR - ', starterr.message);
                res.send({code: 101});
            }
            else {
                logger.log('logFile').error('db proc OK');
                res.send({code: 0});
            }
        });
    });

    return next();
}

telephone.post = function(req, res, next) {
    logger.log('logFile').info('POST %s', req.url);
    res.contentType = 'json';

    if(!req.params.hasOwnProperty('imei')){
        logger.log('logFile').error('no imei ');
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if(imei.length != 15) {
        logger.log('logFile').error('imei not correct: '+ imei);
        res.send({code: 101});
        return next();
    }
    logger.log('logFile').error('get imei: '+ imei);

    var arr = [];
    req.on("data",function(data){
        arr.push(data);
    });
    req.on("end",function(){
        var data= Buffer.concat(arr).toString();
        var ret = JSON.parse(data);
        req.body = ret;
    });
    if(!req.body.hasOwnProperty('telephone'))
    {
        logger.log('logFile').error('no telephon');
        res.send({code: 101});
        return next();
    }
    var telephone = req.body.telephone;
    logger.log('logFile').info('telephon: ' + telephone);

    var selectsql = 'replace into imei2Telnumber(imei,Telnumber) values(\'' + imei + '\',\'' + telephone + '\')';
    logger.log('logFile').info('selectsql:' + selectsql);
    dbhandler(selectsql, function (starterr, startresult){
        if (starterr) {
            logger.log('logFile').fatal('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
        }
        else {
            logger.log('logFile').info('db proc OK');
            res.send({code: 0});
        }
    });
    return next();
}

telephone.get = function(req, res, next) {
    logger.log('logFile').info('GET %s', req.url);
    res.contentType = 'json';

    if(!req.params.hasOwnProperty('imei')){
        logger.log('logFile').error('no imei');
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if(imei.length != 15) {
        logger.log('logFile').error('imei not correct: '+ imei);
        res.send({code: 101});
        return next();
    }
    logger.log('logFile').info('get imei: '+ imei);

    var selectsql = 'select * from imei2Telnumber where imei = \''+imei+'\'';
    logger.log('logFile').info('selectsql:'+ selectsql);
    dbhandler(selectsql, function (starterr, startresult){
        if (starterr)
        {
            logger.log('logFile').fatal('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
        }
        else {
            if(startresult.length === 0)
            {
                logger.log('logFile').error("no telnumber in database");
                res.send({code: 101});
            }
            else{
                if(startresult[0].hasOwnProperty('Telnumber')) {
                    logger.log('logFile').info('db proc OK');
                    var telephone = startresult[0].Telnumber;
                    res.send({telephone: telephone});
                }
                else{
                    logger.log('logFile').error("no telnumber in result");
                    res.send({code: 101});
                }
            }
        }
    });

    return next();
}

telephone.del = function(req, res, next) {
    logger.log('logFile').info('DELETE %s', req.url);
    res.contentType = 'json';

    if(!req.params.hasOwnProperty('imei')){
        logger.log('logFile').error('no imei');
        res.send({code: 101});
        return next();
    }
    var imei = req.params.imei;
    if(imei.length != 15) {
        logger.log('logFile').error('imei not correct: '+ imei);
        res.send({code: 101});
        return next();
    }
    logger.log('logFile').info('get imei: '+ imei);

    var selectsql = 'delete from imei2Telnumber where imei = \'' + imei + '\'';
    logger.log('logFile').info(selectsql);
    dbhandler(selectsql, function (starterr, startresult){
        if (starterr) {
            logger.log('logFile').error('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
        }
        else {
            logger.log('logFile').error('db proc OK');
            res.send({code: 0});
        }
    });

    return next();
}
