/**
 * Created by jk on 2016-12-28.
 */
TopClient = require('topSdk').ApiClient;
var mysql = require('mysql');
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
    var imei = req.params.imei;
    res.contentType = 'json';

    var arr = [];
    req.on("data",function(data){
        arr.push(data);
    });
    req.on("end",function(){
        var data= Buffer.concat(arr).toString();
        var ret = JSON.parse(data);
        req.body = ret;
    });
    var caller = req.body["caller"];
    console.log(imei);
    console.log(caller);
    if(caller >= 10 || caller < 0 || !imei)
    {
        res.send({code: 101});
        return next();
    }
    var selectsql = 'select * from imei2Telnumber where imei = \''+ imei + '\'';
    var connnection = mysql.createConnection({
        host : 'test.xiaoan110.com',
        user : 'eelink',
        password: 'eelink',
        database: 'gps',
    });
    connnection.connect();
    connnection.query(selectsql, function (starterr, startresult){
        if (starterr)
        {
            console.log('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
            return next();
        }
        var telephone = startresult[0].Telnumber;
        var client = new TopClient({
            'appkey': '23499944',
            'appsecret': 'ee15cc89c463c7ce775569e6e05a4ec2',
            'REST_URL': 'http://gw.api.taobao.com/router/rest?'
        });

        client.execute('alibaba.aliqin.fc.tts.num.singlecall', {
            'extend':'12345',
            'tts_param':'{\"AckNum\":\"123456\"}',
            'called_num': telephone,
            'called_show_num': telnumber[caller],
            'tts_code':'TTS_25315181'
        }, function(error, response) {
            if (!error) {
                console.log(response);
            }
            else {
                console.log(error);
                res.send({code: 101});
                return next();
            }
        })
    });
    selectsql = 'update imei2Telnumber set CallNumber = \'' + telnumber[caller] + '\'where imei = \''+imei+'\'';
    var connnection = mysql.createConnection({
        host : 'test.xiaoan110.com',
        user : 'eelink',
        password: 'eelink',
        database: 'gps',
    });
    connnection.connect();
    connnection.query(selectsql, function (starterr, startresult) {
        if (starterr) {
            console.log('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
        }
        else {
            res.send({code: 0});
        }
    });

    return next();
}

telephone.post = function(req, res, next) {
    var imei = req.params.imei;
    res.contentType = 'json';
    var arr = [];
    req.on("data",function(data){
        arr.push(data);
    });
    req.on("end",function(){
        var data= Buffer.concat(arr).toString();
        var ret = JSON.parse(data);
        req.body = ret;
    });
    var telephone = req.body["telephone"];
    console.log(imei);
    console.log(telephone);
    if(!telephone || !imei)
    {
        res.send({code: 101});
        return next();
    }
    var selectsql = 'replace into imei2Telnumber(imei,Telnumber) values(\'' + imei + '\',\'' + telephone + '\')';
    var connnection = mysql.createConnection({
        host : 'test.xiaoan110.com',
        user : 'eelink',
        password: 'eelink',
        database: 'gps',
    });
    connnection.connect();
    connnection.query(selectsql, function (starterr, startresult){
        if (starterr) {
            console.log("post3");
            console.log('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
            return next();
        }
        else {
            res.send({code: 0});
        }
    });

    return next();
}

telephone.get = function(req, res, next) {
    var imei = req.params.imei;
    res.contentType = 'json';

    console.log(imei);
    if(!imei)
    {
        res.send({code: 101});
        return next();
    }
    var selectsql = 'select * from imei2Telnumber where imei = \'' + imei + '\'';
    var connnection = mysql.createConnection({
        host : 'test.xiaoan110.com',
        user : 'eelink',
        password: 'eelink',
        database: 'gps',
    });
    connnection.connect();
    connnection.query(selectsql, function (starterr, startresult){
        if (starterr)
        {
            console.log("here3");
            console.log('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
        }
        else {
            var telephone = startresult[0].Telnumber;
            console.log(telephone);
            if (telephone) {
                res.send({telephone: telephone});
            }
        }
    });

    return next();
}

telephone.del = function(req, res, next) {
    var imei = req.params.imei;
    res.contentType = 'json';
    console.log(imei);
    if(!imei){
        res.send({code: 101});
        return next();
    }
    var selectsql = 'delete from imei2Telnumber where imei = \'' + imei + '\'';
    var connnection = mysql.createConnection({
        host : 'test.xiaoan110.com',
        user : 'eelink',
        password: 'eelink',
        database: 'gps',
    });
    connnection.connect();
    connnection.query(selectsql, function (starterr, startresult){
        if (starterr) {
            console.log('[SELECT ERROR - ', starterr.message);
            res.send({code: 101});
        }
        else {
            res.send({code: 0});
        }
    });

    return next();
}
