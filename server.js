const restify = require('restify');
const plugins = require('restify-plugins');
const fs = require('fs');
const config = require('./config.json');

const keys_dir = './cert/';

const http_server = restify.createServer(config.server.http_options);


var https_options = {
  name: 'Electromble@xiaoan',
  key: fs.readFileSync(keys_dir + 'privatekey.key'), //on current folder
  certificate: fs.readFileSync(keys_dir + 'certificate.cert'),
};

const https_server = restify.createServer(https_options);


// Put any routing, response, etc. logic here. This allows us to define these functions
// only once, and it will be re-used on both the HTTP and HTTPs servers
var setup_server = function (app) {
  function respond(req, res, next) {
    res.send('I see you ' + req.params.name);
  }

  // Middleware
  app.use(plugins.acceptParser(app.acceptable));
  app.use(plugins.queryParser());
  app.use(plugins.bodyParser());
  // Routes
  var history = require('./history');
  app.get('/v1/history/:imei', history.get);

  var itinerary = require('./itinerary');
  app.get('/v1/itinerary/:imei', itinerary.get);

  var telephone = require('./telephone');
  app.put('/v1/telephone/:imei', telephone.put);
  app.post('/v1/telephone/:imei', telephone.post);
  app.get('/v1/telephone/:imei', telephone.get);
  app.del('/v1/telephone/:imei', telephone.del);

  var version = require('./version');
  app.get('/v1/version', version.get);

  var package = require('./package');
  app.get('/v1/package', package.get);

  var device = require('./device');
  app.post('/v1/device', device.post);

  var monitor = require('./monitor');
  app.get('/v1/monitor/:name', monitor.get);
}

// Now, setup both servers in one step
setup_server(http_server);
setup_server(https_server);

http_server.listen(8080, function () {
  console.log('%s listening at %s', http_server.name, http_server.url);
});

https_server.listen(443, function () {
  console.log('%s listening at %s', https_server.name, https_server.url);
});
