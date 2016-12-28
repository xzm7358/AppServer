var restify = require('restify');
var plugins = require('restify-plugins');
var fs = require('fs');

var http_options = {
  name: 'Electromble@xiaoan',
  version: '1.0.0'
};

var keys_dir = './';

const http_server = restify.createServer(http_options);

/*var https_options = {
  name: 'Electromble@xiaoan',
  key: fs.readFileSync(keys_dir + 'privatekey.key'), //on current folder
  certificate: fs.readFileSync(keys_dir + 'certificate.cert')
};
*/
//const https_server = restify.createServer(https_options);

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
}

// Now, setup both servers in one step
setup_server(http_server);
//setup_server(https_server);

http_server.listen(8080, function () {
  console.log('%s listening at %s', http_server.name, http_server.url);
});
/*
https_server.listen(443, function () {
  console.log('%s listening at %s', https_server.name, https_server.url);
});
*/