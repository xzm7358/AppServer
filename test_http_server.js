/**
 * Created by zzs on 2017/1/5.
 */
const restify = require('restify');
const plugins = require('restify-plugins');

const http_options = {
    name: 'Electromble@xiaoan',
    version: '1.0.0',
    method:'POST',
};
const test_http_server = restify.createServer(http_options);

var setup_server = function (app) {
    function respond(req, res, next) {
        res.send('I see you' + req.params.name);
    }

    // Middleware
    app.use(plugins.acceptParser(app.acceptable));
    app.use(plugins.queryParser());
    app.use(plugins.bodyParser());
    // Routes
    app.post('/v1/device', function (req, res, next) {
        console.log('POST: %s' ,req.url);
        res.contentType = 'json';
        console.log('数据进来');
        console.log(req.body);
        res.send(200, req.body);
    })

};


setup_server(test_http_server);

test_http_server.listen(8081, function () {
    console.log('%s listening at %s', test_http_server.name, test_http_server.url);
});