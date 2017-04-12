/**
 * Created by zouzh on 2017/1/16.
 */
const restify = require('restify');
const plugins = require('restify-plugins');
const Router = require('restify-router').Router;
const routerInstance = new Router();
const fs = require('fs');
const config = require('./routes/config.json');
//const heapdump = require('heapdump');

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
    function respond(req, res, next) {
        res.send('I see you ' + req.params.name);
    }
    // Middleware
    app.use(plugins.acceptParser(acceptable));
    app.use(plugins.queryParser());
    app.use(plugins.bodyParser());
    // Routes
    var history = require('./routes/v1/history');
    routerInstance.get('/history/:imei', history.get);

    var itinerary = require('./routes/v1/itinerary');
    routerInstance.get('/itinerary/:imei', itinerary.get);

    var telephone = require('./routes/v1/telephone');
    routerInstance.put('/telephone/:imei', telephone.put);
    routerInstance.post('/telephone/:imei', telephone.post);
    routerInstance.get('/telephone/:imei', telephone.get);
    routerInstance.del('/telephone/:imei', telephone.del);

    var version = require('./routes/v1/version');
    routerInstance.get('/version', version.get);

    var packagedownload = require('./routes/v1/packagedownload');
    routerInstance.get('/package', packagedownload.get);

    var device = require('./routes/v1/device');
    routerInstance.post('/device', device.post);

    var record = require('./routes/v1/record');
    routerInstance.get('/record', record.get);

    var user2dev = require('./routes/v1/user2dev');
    routerInstance.get('/user/:tel',user2dev.get);
    routerInstance.post('/user/:tel',user2dev.post);
    routerInstance.del('/user/:tel',user2dev.del);

    var event = require('./routes/v1/event');
    routerInstance.get('/event/:imei',event.get);

    var deviceEvent = require('./routes/v1/deviceEvent');
    routerInstance.get('/deviceEvent/:imei', deviceEvent.get);

    var deviceData = require('./routes/v1/deviceData');
    routerInstance.get('/imeiData/:imei',deviceData.get);
    routerInstance.del('/imeiData/:imei',deviceData.del);
    
    var upload = require('./routes/v1/updownload');
    routerInstance.post('/uploadFile',upload.post);
    routerInstance.get('/uploadFile/:imeiName',upload.get);

    routerInstance.applyRoutes(app,'/v1');
    
}
// Now, setup both servers in one step
setup_server(http_server);
setup_server(https_server);

/*setInterval(function(){
    heapdump.writeSnapshot('./' + Date.now() + '.heapsnapshot');
}, 3000*10);*/

http_server.listen(8083, function () {
    console.log('%s listening at %s', http_server.name, http_server.url);
});

https_server.listen(443, function () {
    console.log('%s listening at %s', https_server.name, https_server.url);
});
