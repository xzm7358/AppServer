/**
 * Created by zouzh on 2017/4/13.
 */

const Router = require('restify-router').Router
const router = new Router();
console.log('get into');
var history = require('./history');
router.get('/history/:imei', history.get);

var itinerary = require('./itinerary');
router.get('/itinerary/:imei', itinerary.get);

var telephone = require('./telephone');
router.put('/telephone/:imei', telephone.put);
router.post('/telephone/:imei', telephone.post);
router.get('/telephone/:imei', telephone.get);
router.del('/telephone/:imei', telephone.del);

var version = require('./version');
router.get('/version', version.get);

var packagedownload = require('./packagedownload');
router.get('/package', packagedownload.get);

var device = require('./device');
router.post('/device', device.post);

var record = require('./record');
router.get('/record', record.get);

var user2dev = require('./user2dev');
router.get('/user/:tel',user2dev.get);
router.post('/user/:tel',user2dev.post);
router.del('/user/:tel',user2dev.del);

var event = require('./event');
router.get('/event/:imei',event.get);

var deviceEvent = require('./deviceEvent');
router.get('/deviceEvent/:imei', deviceEvent.get);

var deviceData = require('./deviceData');
router.get('/imeiData/:imei',deviceData.get);
router.del('/imeiData/:imei',deviceData.del);

var upload = require('./updownload');
router.post('/uploadFile',upload.post);
router.get('/uploadFile/:imeiName',upload.get);

var motorcycle = require('./motorcycle');

router.post('/motorcycle',motorcycle.post);
router.del('/motorcycle/:imei',motorcycle.del);


module.exports=router;

