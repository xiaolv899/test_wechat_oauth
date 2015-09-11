/**
 * Created by yecl on 15/9/11.
 */
var http = require('http'),
    express = require('express'),
    engine = require('hjs'),
    path = require('path'),
    uuid = require('uuid'),
    superagent = require('superagent');

var app = express(),
    router = express.Router();

var wechatAppId = 'appid',
    wechatAppSecret = 'appsecret';

router.get('/', function(req, res, next){

    var backUrl = 'http://www.1caifu.com/wechat_back'
    var r = uuid.v4();
    var loginurl = 'https://open.weixin.qq.com/connect/qrconnect?appid='+wechatAppId
        +'&redirect_uri='+encodeURIComponent(backUrl)+'&response_type=code&scope=snsapi_login&state='+r+'#wechat_redirect';
    //记录state，微信会返回此参数，以便进行验证

    res.redirect(loginurl);
});

router.get('/wechat_back', function(req, res, next){
    //req.query.state
    //验证state
    var geturl = 'https://api.weixin.qq.com/sns/oauth2/access_token?appid='+wechatAppId+'&secret='+wechatAppSecret+'&code='+req.query.code+'&grant_type=authorization_code';
    var client = superagent.get(geturl);
    /*
    //代理
    if(env !== 'development') {
        client.proxy(proxy);
    }*/
    client.end(function(err, result){
        if(err){
            return res.send(err);
        }
        res.send(result.text);
    });
});

app.engine('html', engine.__express);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine','html');

app.use('/', router);

var server = http.createServer(app);
server.listen(8080, function() {
    console.log('%s Server is listening on port 8080', new Date());
});