/**
 * Created by jk on 2016-12-28.
 */
var history = exports;

history.get = function(req, res, next) {
    console.log('GET %s', req.url);
    res.send(req.params);
    return next();
}
