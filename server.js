var restify = require('restify');
var plugins = require('restify-plugins');


const server = restify.createServer({
  name: 'Electromble@xiaoan',
  version: '1.0.0'
});
server.use(plugins.acceptParser(server.acceptable));
server.use(plugins.queryParser());
server.use(plugins.bodyParser());


server.get('/v1/history/:imei', function (req, res, next) {
  res.send(req.params);
  return next();
});

server.listen(8080, function () {
  console.log('%s listening at %s', server.name, server.url);
});
