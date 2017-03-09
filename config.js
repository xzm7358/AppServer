/**
 * Created by zouzh on 2017/3/4.
 */

var logger = require('./log');

logger.log('logFile').info('before env:',process.env.NODE_ENV);


module.exports = function (){
    switch (process.env.NODE_ENV) {
        case 'development':
            return {
                "name": "server config",
                "description": "serve for the server configuration",
                "server": {
                    "http_options": {
                        "name": "Electromble@xiaoan",
                        "version": "1.0.0"
                    },
                    "https_options": {
                        "name": "Electromble@xiaoan"
                    }
                },
                "mysql": {
                    "host": "localhost",
                    "user": "eelink",
                    "password": "eelink",
                    "database": "gps",
                    "multipleStatements" : true
                },
                "device_http_options":{
                    "host": "www.xiaoan110.com",
                    "port": 8082,
                    "path": "/v1/device",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                },
                "deviceData_http_options":{
                    "host": "www.xiaoan110.com",
                    "port": 8082,
                    "path":"/v1/imeiData",
                    "method":"GET",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                },
                "redis_cli":{
                    "host":"localhost",
                    "port": 6379,
                    "pwd" :"ZzsLcc2017"
                }

            }

        case 'production':
            return {
                "name": "server config",
                "description": "serve for the server configuration",
                "server": {
                    "http_options": {
                        "name": "Electromble@xiaoan",
                        "version": "1.0.0"
                    },
                    "https_options": {
                        "name": "Electromble@xiaoan"
                    }

                },
                "mysql": {
                    "host": "localhost",
                    "user": "eelink",
                    "password": "eelink",
                    "database": "gps",
                    "multipleStatements" : true
                },
                "device_http_options":{
                    "host": "www.xiaoan110.com",
                    "port": 8082,
                    "path": "/v1/device",
                    "method": "POST",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                },
                "deviceData_http_options":{
                    "host": "www.xiaoan110.com",
                    "port": 8082,
                    "path":"/v1/imeiData",
                    "method":"GET",
                    "headers": {
                        "Content-Type": "application/json"
                    }
                },
                "redis_cli":{
                    "host":"innerredis.xiaoan110.com",
                    "port": 6379,
                    "pwd" :"Bbj4VzYmDTufJU8KPBP9FKj5"
                }

            };

        default:
            return {settings:'error'};
    }

}