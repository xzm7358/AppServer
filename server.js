/* Copyright (C) Xiaoan Technology Co., Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Tom Chiang <jiangtao@xiaoantech.com>, Feb 2017
 */

const restify = require('restify');
const plugins = require('restify-plugins');

const fs = require('fs');
// const heapdump = require('heapdump');
// const memwatch= require('memwatch-next');
const routerInstance = require('./routes/routes');
const adminRouter = require('./admin');

const http_options = {
  name: 'Electromble@xiaoan',
  version: '1.0.0'
};
const http_server = restify.createServer(http_options);

const keys_dir = './cert/';
var https_options = {
  name: 'Electromble@xiaoan',
  version: '1.0.0',
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


// Now, setup both servers in one step
setup_server(http_server);
setup_server(https_server);

http_server.listen(8083, function () {
  console.log('%s listening at %s', http_server.name, http_server.url);
});

https_server.listen(443, function () {
  console.log('%s listening at %s', https_server.name, https_server.url);
});
