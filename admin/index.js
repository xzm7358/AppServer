/* Copyright (C) Xiaoan Technology Co., Ltd - All Rights Reserved
 * Unauthorized copying of this file, via any medium is strictly prohibited
 * Proprietary and confidential
 * Written by Tom Chiang <jiangtao@xiaoantech.com>, Feb 2017
 */

const restify = require('restify');
const Router = require('restify-router').Router;
const router = new Router();

//http://stackoverflow.com/questions/18411946/what-is-the-best-way-to-implement-a-token-based-authentication-for-restify-js/27442155#27442155
router.use(function (req, res, next) {
  var users;

    // if (/* some condition determining whether the resource requires authentication */) {
    //    return next();
    // }

  users = {
    foo: {
      id: 1,
      password: 'bar'
    }
  };

    // Ensure that user is not anonymous; and
    // That user exists; and
    // That user password matches the record in the database.
  if (req.username == 'anonymous' || !users[req.username] || req.authorization.basic.password !== users[req.username].password) {
        // Respond with { code: 'NotAuthorized', message: '' }
    next(new restify.NotAuthorizedError());
  } else {
    next();
  }

  next();
});

router.add('/event', require('./event'));

module.exports = router;
