/**
 * Created by zouzh on 2017/4/13.
 */
exports.setRequestUrl = function (router) {
    router.add("/v1",require("./v1/routes"));
};