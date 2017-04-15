/**
 * Created by zzs on 2017/1/12.
 */
const config = require('../../config.json');
var mysql = require('mysql');
var pool = mysql.createPool(config.mysql);


var dbhandler = function (selectsql, callback) {
  pool.getConnection(function (error, connection) {
    if (error) {
      callback(error,null,null);
    } else {
      connection.query(selectsql, function (qerror, value) {
        connection.release();
        callback(qerror,value);
      });
    }

  });

};
module.exports = dbhandler;
