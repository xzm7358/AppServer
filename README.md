# AppServer
HTTP Server for Electrombile

Official documentation:

[http://restify.com](http://restify.com/)

refer to the following:
- [https://www.npmjs.com/package/restify](https://www.npmjs.com/package/restify "restify")
- [http://blog.fens.me/nodejs-restify/](http://blog.fens.me/nodejs-restify/)
   
http and https together
- [http://stackoverflow.com/questions/33666226/get-restify-rest-api-server-to-support-both-https-and-http](http://stackoverflow.com/questions/33666226/get-restify-rest-api-server-to-support-both-https-and-http)
- [http://stackoverflow.com/questions/8355473/listen-on-http-and-https-for-a-single-express-app](http://stackoverflow.com/questions/8355473/listen-on-http-and-https-for-a-single-express-app)

http://blog.fens.me/nodejs-https-server/

http://www.selfsignedcertificate.com/

- 生成私钥key文件：openssl genrsa -out privatekey.pem 1024
- 通过私钥生成CSR证书签名 openssl req -new -key privatekey.pem -out certrequest.csr
-  通过私钥和证书签名生成证书文件 openssl x509 -req -in certrequest.csr -signkey privatekey.pem -out certificate.pem


https://github.com/dresende/node-orm2

https://github.com/balderdashy/waterline
https://github.com/balderdashy/waterline-docs
