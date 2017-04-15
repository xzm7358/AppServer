/**
 * Created by zouzh on 2017/1/16.
 */
const restify = require('restify');
const plugins = require('restify-plugins');

var hd;
const fs = require('fs');
const config = require('./routes/config.json');
const memwatch= require('memwatch-next');

const routerInstance = require('./routes/routes');
const adminRouter = require('./admin/routes');

const logger = require('./routes/v1/log').log('logFile');

const keys_dir = './cert/';
const http_server = restify.createServer(config.server.http_options);

var https_options = {
    name: 'Electromble@xiaoan',
    key: fs.readFileSync(keys_dir + 'privatekey.key'), //on current folder
    certificate: fs.readFileSync(keys_dir + 'certificate.cert'),
};

const https_server = restify.createServer(https_options);
const acceptable = [
    'application/json',
    'text/plain',
    'application/octet-stream',
    'application/javascript',
    'audio/mp3',
    'audio/AMR'];

// Put any routing, response, etc. logic here. This allows us to define these functions
// only once, and it will be re-used on both the HTTP and HTTPs servers
var setup_server = function (app) {
    // Middleware
    app.use(plugins.acceptParser(acceptable));
    app.use(plugins.queryParser());
    app.use(plugins.bodyParser());
    app.use(restify.authorizationParser());
    // Routes
    routerInstance.applyRoutes(app);
    adminRouter.applyRoutes(app, '/admin');
};


memwatch.on('leak',function (info) {
    logger.error('server.js Memory leak detected:',info);
    if (!hd) {
        hd = new memwatch.HeapDiff();
    } else {
        var diff= hd.end();
        logger.error(util.inspect(diff, true, null));
        hd = null;
    }
});
// Now, setup both servers in one step
setup_server(http_server);
setup_server(https_server);

http_server.listen(8083, function () {
    console.log('%s listening at %s', http_server.name, http_server.url);
});

https_server.listen(443, function () {
    console.log('%s listening at %s', https_server.name, https_server.url);
});
