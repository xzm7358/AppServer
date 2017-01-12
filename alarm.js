/**
 * Created by jk on 2016-12-28.
 */

TopClient = require('topSdk').ApiClient;

var alarm = exports;

alarm.put = function(callnumber, telephone){
        var client = new TopClient({
            'appkey': '23499944',
            'appsecret': 'ee15cc89c463c7ce775569e6e05a4ec2',
            'REST_URL': 'http://gw.api.taobao.com/router/rest?'
        });

        client.execute('alibaba.aliqin.fc.tts.num.singlecall', {
            'extend': '12345',
            'tts_param': '{\"AckNum\":\"123456\"}',
            'called_num': telephone,
            'called_show_num': callnumber,
            'tts_code': 'TTS_25315181'
        }, function (error, response) {
            if (!error)
                console.log(response);
            else
                console.log(error);
        })
};
