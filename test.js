/**
 * Created by zouzh on 2017/2/20.
 */
tel = 31250794722
var reg = /^1[0-9]{10}/;
if (!reg.test(tel)) {
    console.log('falied')
} else {
    console.log('success')
}