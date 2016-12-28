/**
 * Created by jk on 2016-12-28.
 */
var history = exports;

history.get = function(req, res, next) {
    console.log('GET %s', req.url);

    var imei = req.params.imei;
    var start = req.query.start;
    var end = req.query.end;
    
    console.log(imei);
    //TODO: get the data from the DB

    res.send(req.params);
    return next();
}
