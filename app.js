"use strict"

const express = require('express');
const bodyParser = require('body-parser');
var path = require('path');
var bcrypt = require('bcryptjs');
var passport = require('passport');
var session = require('express-session');
var cookieParser = require('cookie-parser');
var expressValidator = require('express-validator');

var app = express();
var host = "127.0.0.1";
var port = 8080;
var home_file = "./index.html";

app.use(express.static('./public'));
//app.use(express.static('./view'));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(expressValidator());
app.use(cookieParser());

//Handle session
app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    cookie: { maxAge: 180 * 60 * 1000 }
}));

//Passport
app.use(passport.initialize());
app.use(passport.session());

app.set('views', path.join(__dirname+'/view'))
app.engine('html', require('ejs').renderFile)
app.set('view engine', 'html')
//routes.routeComments(app);
var routes = require('./routes/index');
var menu = require('./routes/menu');
var user = require('./routes/user');
var cart = require('./routes/cart');

app.use('/', routes);
app.use('/menu', menu);
app.use('/user', user);
app.use('/cart', cart);

app.use(function (req, res, next) {
    res.locals.messages = require('express-messages')(req, res);
    res.locals.session = req.session;
    
    next();
});


app.get('*', function (req, res, next) {
    res.locals.user = req.user || null;
    next();
});

var server = app.listen(port, host, function() {
    var host = server.address().address;
    var port = server.address().port;

    console.log("Example app listening at http://%s:%s", host, port);
});

module.exports = app;