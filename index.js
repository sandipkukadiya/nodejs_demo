var express = require('express');
var app = express();
var http = require('http').createServer(app);
var bodyParser = require('body-parser')
var helmet = require('helmet')
var routes = require('./route/appRoute');

app.use(helmet());
app.use(bodyParser.urlencoded({ extended: true , limit: '5mb'}));
app.use(bodyParser.json());

routes(app);

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/view/index.html');
});

app.use(function (err, req, res, next) {
    if (!err) {
        return next();
    }
    res.send({status:err.status, message: err.message, error:req.app.get('env') === 'development' ? err : {}});
});

http.listen(3000, function () {
    console.log('listening on *:3000');
});