/* Copyright (C) Xiaoan Technology Co., Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Tom Chiang <jiangtao@xiaoantech.com>, Feb 2017
 */

const Router = require('restify-router').Router;
const router = new Router();
router.add('/version', require('./version'));
router.add('/telephone', require('./telephone'));

router.add('/record',require('./record'));

router.add('/device',require('./device'));
router.add('/imeiData',require('./deviceData'));
router.add('/deviceEvent',require('./deviceEvent'));

router.add('/event',require('./event'));
router.add('/history',require('./history'));
router.add('/itinerary',require('./itinerary'));
router.add('/motorcycle',require('./motorcycle'));

router.add('/uploadFile',require('./updownload'));

router.add('/user2dev',require('./user2dev'));

router.add('/package',require('./packagedownload'));


module.exports = router;
