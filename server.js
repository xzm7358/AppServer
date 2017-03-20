/**
 * Created by zouzh on 2017/1/16.
 */
const restify = require('restify');
const plugins = require('restify-plugins');
const fs = require('fs');
const Config = require('./config');
const config = new Config();

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
	const bodyParser = plugins.bodyParser();
	const bodyReader = plugins.bodyReader();
	
    // Routes
    var history = require('./history');
    app.get('/v1/history/:imei',bodyParser, history.get);

    var itinerary = require('./itinerary');
    app.get('/v1/itinerary/:imei',bodyParser, itinerary.get);

    var telephone = require('./telephone');
    app.put('/v1/telephone/:imei',bodyParser, telephone.put);
    app.post('/v1/telephone/:imei',bodyParser, telephone.post);
    app.get('/v1/telephone/:imei',bodyParser, telephone.get);
    app.del('/v1/telephone/:imei',bodyParser, telephone.del);

    var version = require('./version');
    app.get('/v1/version',bodyParser, version.get);

    var packagedownload = require('./packagedownload');
    app.get('/v1/package',bodyParser, packagedownload.get);

    var device = require('./device');
    app.post('/v1/device',bodyParser, device.post);

    var record = require('./record');
    app.get('/v1/record',bodyParser, record.get);

    var user2dev = require('./user2dev');
    app.get('/v1/user/:tel',bodyParser,user2dev.get);
    app.post('/v1/user/:tel',bodyParser,user2dev.post);
    app.del('/v1/user/:tel',bodyParser,user2dev.del);

    var event = require('./event');
    app.get('/v1/event/:imei',bodyParser,event.get);

    var deviceEvent = require('./deviceEvent');
    app.get('/v1/deviceEvent/:imei',bodyParser, deviceEvent.get);

    var deviceData = require('./deviceData');
    app.get('/v1/imeiData/:imei',bodyParser, deviceData.get);
    app.del('/v1/imeiData/:imei',bodyParser,deviceData.del);
    
    var upload = require('./updownload');
    app.post('/v1/uploadFile', bodyReader,upload.post);
    app.get('/v1/uploadFile/:imeiName',bodyParser,upload.get);

}
// Now, setup both servers in one step
setup_server(http_server);
setup_server(https_server);

http_server.listen(8083, function () {
    console.log('%s listening at %s', http_server.name, http_server.url);
});

https_server.listen(443, function () {
    console.log('%s listening at %s', https_server.name, https_server.url);
});
