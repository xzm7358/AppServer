/**
 * Created by jk on 2016-12-28.
 */

TopClient = require('topSdk').ApiClient;

exports.put = function (req, res, next) {
    var telphone = req.params.telphone;

    var client = new TopClient({
        'appkey': '23499944',
        'appsecret': 'ee15cc89c463c7ce775569e6e05a4ec2',
        'REST_URL': 'http://gw.api.taobao.com/router/rest?'
    });

    client.execute('alibaba.aliqin.fc.tts.num.singlecall', {
        'extend':'12345',
        'tts_param':'{\"AckNum\":\"123456\"}',
        'called_num':telphone,
        'called_show_num':'01053912804',
        'tts_code':'TTS_25315181'
    }, function(error, response) {
        if (!error)
            console.log(response);
        else
            console.log(error);
    })

    res.contentType = 'json';
    res.send({code: 0});

    return next();
};
