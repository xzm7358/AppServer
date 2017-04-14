/* Copyright (C) Xiaoan Technology Co., Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Tom Chiang <jiangtao@xiaoantech.com>, Feb 2017
 */

const Router = require('restify-router').Router;

const router = new Router();
router.add('/v1', require('./v1/routes'));
 
module.exports = router;
