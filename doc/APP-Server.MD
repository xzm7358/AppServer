# API接口说明

----------
- 同时支持http和https
- 对于大部分API，Content-Type设置为application/json
- 请求响应格式为JSON编码
- 	通过HTTP状态吗来标识一个请求是否成功，2xx表示成功，4xx表示失败(详见RFC 定义)。当请求失败时，响应格式的JSON对象里包含code字段

# 修订记录

|   日期     | 版本  | 修改描述                              |
| ----------:| -----:| -------------------------------------:|
| 2017-04-14 | 6.00  | 从word格式切换到MarkDown格式          |

# API版本

|   版本     |  内容                              |
| ----------:|  -------------------------------------:|
| v1         | 2016-10-15号发布第一版本          |

# 错误码
|   错误码   | 错误代码                       | 错误描述                              |
| ----------:| ------------------------------:| -------------------------------------:|
| 100        | CODE _INTERNAL_ERR             | 服务器内部错误                        |
| 101        | CODE _CODE_IMEI_NOT_FOUND      | IMEI非法                              |
| 102        | CODE_NO_GPS_POINT              | 请求时段内无GPS轨迹点                 |
| 103        | CODE_RANGE_TOO_LARGE           | 请求范围太大                          |
| 104        | CODE_NO_ITINERARY              | 请求时段内无有效行程                  |

# API列表

## 历史轨迹
|   URL              | HTTP ACTION   | Function                              |
| ------------------:| -------------:| -------------------------------------:|
| /v1/history        | GET           | 获取历史轨迹                          |

## 报警记录
|   URL              | HTTP ACTION   | Function                              |
| ------------------:| -------------:| -------------------------------------:|
| /v1/log            | GET           | 获取报警记录                          |

## 行程记录
|   URL              | HTTP ACTION   | Function                              |
| ------------------:| -------------:| -------------------------------------:|
| /v1/itinerary      | GET           | 获取行程信息                          |

## 电话报警
|   URL              | HTTP ACTION   | Function                              |
| ------------------:| -------------:| -------------------------------------:|
| /v1/telephone      | GET           | 查询电话报警号码                      |
| /v1/telephone      | POST          | 设置电话报警号码                      |
| /v1/telephone      | DELETE        | 取消电话报警                          |
| /v1/telephone      | PUT           | 测试电话报警                          |


# API详解

## 历史轨迹
### 获取历史轨迹

`GET /v1/history/<imei>?start=<start>&end=<end>`

|   名称             | 类型          | 参数描述                          |
| ------------------:| -------------:| ---------------------------------:|
| start              | integer       | 起始时间戳                        |
| end                | integer       | 结束时间戳                        |

**end参数缺失时，默认为start所在日的24点**

**start，end参数均缺失时，返回设备历史纪录中最新的一个位置点**

Request

	GET /v1/history/865067022386620?start=1480144397&end=1480148344 HTTP/1.1
	Host: api.xiaoan110.com

Response
- 成功


	HTTP/1.1 200 OK
    Content-Length: 18280
    Content-Type: application/json; charset=UTF-8

    {
      "gps": [
        {
          "timestamp": 1480144397,
          "lat": 30.612673,
          "lon": 114.185974,
          "speed": 0,
          "course": 132
        },
        {
          "timestamp": 1480144452,
          "lat": 30.612593,
          "lon": 114.18634,
          "speed": 10,
          "course": 118
        },
        {
          "timestamp": 1480144457,
          "lat": 30.612553,
          "lon": 114.186455,
          "speed": 8,
          "course": 108
        },
    }

- IMEI不存在


	HTTP/1.1 404
    Content-Length: 13
    Content-Type: application/json; charset=UTF-8

    {
      "code":101
    }

- 该时段内无GPS记录时




	HTTP/1.1 13
    Content-Length: 18280
    Content-Type: application/json; charset=UTF-8

    {
      "code":102
    }

## 报警记录
### 获取报警记录

`GET /v1/log/<imei>?start=<start>&end=<end>`

## 行程记录
### 获取行程信息

`GET /v1/itinerary/<imei>?start=<start>&end=<end>`

|   名称             | 类型          | 参数描述                          |
| ------------------:| -------------:| ---------------------------------:|
| start              | integer       | 起始时间戳                        |
| end                | integer       | 结束时间戳                        |

**end参数缺失时，默认为start所在日的24点；**

**start，end参数均缺失时，返回设备的总里程数。**

    GET /v1/itinerary/865067022386620?start=1480144397&end=1480148344 HTTP/1.1
    Host: api.xiaoan110.com

    HTTP/1.1 200 OK
    Date: Sat, 26 Nov 2016 08:53:21 GMT
    Content-Length: 161
    Content-Type: text/html; charset=UTF-8

    {
      "itinerary": [
        {
          "start": {
            "timestamp": 1480144397,
            "lat": 30.612673,
            "lon": 114.185974
          },
          "end": {
            "timestamp": 1480148344,
            "lat": 30.574663,
            "lon": 114.242218
          },
          "miles": 20235
        }
      ]
    }

获取总里程

    GET /v1/itinerary/865067022386620 HTTP/1.1
    Host: api.xiaoan110.com

    HTTP/1.1 200 OK
    Date: Sat, 26 Nov 2016 08:53:21 GMT
    Content-Length: 161
    Content-Type: text/html; charset=UTF-8

    {
      "itinerary": [
        {
          "start": 0,
          "end": 0,
          "miles": 202000
        }
      ]
    }

## 电话报警
###	设置电话报警号码

`POST /v1/telephone/<IMEI>`


    POST /v1/telephone/865067029889999 HTTP/1.1
    Host: api.xiaoan110.com
    Content-Length: 30
    Content-Type: application/json
    Accept: */*

    {
    "telephone":"15527265353"
    }

###	取消电话报警
`DELETE  /v1/telephone/<IMEI>`

    DELETE /v1/telhpne/865067029889999 HTTP/1.1
    Host: api.xiaoan110.com
    Content-Length: 30
    Content-Type: application/json

    {
    "telephone":"15527265353"
    }

### 测试电话报警
`PUT /v1/telephone/<IMEI>`

    PUT /v1/telhpne/865067029889999 HTTP/1.1
    Host: api.xiaoan110.com
    Content-Length: 30
    Content-Type: application/json
    Accept: */*

    {
    "caller":"0"
    }

###	查询电话报警号码
`GET /v1/telephone/<IMEI>`

    GET /v1/telephone/865067022359999 HTTP/1.1
    Host: api.xiaoan110.com

    HTTP/1.1 200 OK
    Content-Length: 27
    Content-Type: application/json; charset=UTF-8

    {"telephone":"13437198039"}

##	设备接口

服务器对该接口的命令不做直接处理，转发给设备进行处理，保证服务器接口的稳定性。

请求消息格式为：

    {
      "imei":"865067028767999",
      "cmd": {
            xxx
       }
    }

响应消息格式为：

    {
      "imei":"865067028767999",
      "code": xxx
      "result": {
            xxx
       }
    }

##	版本
`GET /v1/version?type=<ios/android>`

返回字段：


|   名称             | 类型          | 参数描述                     |
| ------------------:| -------------:| ----------------------------:|
| versionName        | String       | 版本号                        |
| versionCode        | integer      | 版本编号                      |
| changelog          | String       | 变更记录                      |

##	应用包
`GET /v1/package?type=<ios/android>`

##	事件
`GET /v1/event/<imei>?endAt=<timestamp>`


|   名称             | 类型          | 参数描述                     |
| ------------------:| -------------:| ----------------------------:|
| endAt              | int           | 起始时间戳                   |

注：
1.  返回截止事件点未endAt的最近20条记录；
2.  当endAt参数缺失时，返回最小的20条记录。


    GET /v1/event/865067022386620? endAt=1480144397 HTTP/1.1
    Host: api.xiaoan110.com

    HTTP/1.1 200 OK
    Content-Length: 18280
    Content-Type: text/html; charset=UTF-8

    {
      "event": [
        {
          "timestamp": 1480144397,
          "event": 1
        },
        {
          "timestamp": 1480144370,
          "event": 2
        },
        {
          "timestamp": 1480144098,
          "event": 3
        }
       ]
    }
