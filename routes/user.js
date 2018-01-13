var express = require('express');
var router = express.Router();
var js = require('../public/javascripts/my')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

router.get('/login', function (req, res) {
	var errMsg = ''//req.flash('error')[0];
    var products = ''//req.session.cart;
    var user = null;
    res.render('user/login', { title: 'Login', user: user, products: products, errMsg: errMsg, noError: !errMsg,imgSrc:null });
    /*js.performRequest('/data/2.5/weather', 'GET','q=singapore&appid=ccf19010dc251e2fea5173f57fed9a15&units=metric',
    function(data){
	    var type = data.weather[0].main;
	    res.render('user/login', { title: 'Login', user: user, products: products, errMsg: errMsg, noError: !errMsg,temperature:data.main.temp,imgSrc:type,user:null });
  	})*/
    
});

router.get('/register', function (req, res) {
	var errMsg = ''//req.flash('error')[0];
    var products = ''//req.session.cart;
    var user = null;
    res.render('user/register', { title: 'Register', user: user, products: products, errMsg: errMsg, noError: !errMsg,imgSrc:null});
    /*js.performRequest('/data/2.5/weather', 'GET','q=singapore&appid=ccf19010dc251e2fea5173f57fed9a15&units=metric',
    function(data){
	    var type = data.weather[0].main;
	    res.render('user/register', { title: 'Register', user: user, products: products, errMsg: errMsg, noError: !errMsg,temperature:data.main.temp,imgSrc:type,user:null });
  	})*/
    
});

router.post('/registerUser',
    passport.authenticate('local.register', { failureRedirect: '/users/register', failureFlash: true }),
    function (req, res) {
        req.flash('success', 'Welcome ' + req.user.name);
        res.redirect('/');
    });

router.post('/loginUser',
    passport.authenticate('local.login', { failureRedirect: '/users/login', failureFlash: true, successRedirect: '/' }),
    function (req, res) {
        res.send();
    });

    passport.serializeUser(function (user, done) {
        done(null, user);
    });
    
    passport.deserializeUser(function (user, done) {
        //User.getUserById(id, function (err, user) {
            done(null, user);
       // });
    });
    
    passport.use('local.register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
    
        req.checkBody('name', 'Name field is required').notEmpty();
        req.checkBody('email', 'Email field is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('password', 'Password field is required').notEmpty();
        req.checkBody('password', 'Password should be minimum of 4 characters').isLength({ min: 4 });
    
        var errors = req.validationErrors();
    
        if (errors) {
            var message = [];
            errors.forEach(function (error) {
                message.push(error.msg);
            });
            return done(null, false, req.flash('error', message));
        }
        User.getUserByEmail(email, function (err, user) {
            if (err) throw err;
            if (user) {
                return done(null, false, { message: 'Email already in use.' });
            }
            var newUser = new User({
                name: name,
                email: email,
                password: password
            });
    
            User.createUser(newUser, function (err, user) {
                if (err) throw err;
                return done(null, newUser);
            });
          
        });
    
        }));
    
    
    passport.use('local.login',new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
        }, function (req, email, password, done) {
            console.log('LocalStrategy');
    
            var name = req.body.name;
        var email = req.body.email;
        var password = req.body.password;
            req.checkBody('password', 'password field is required').notEmpty();
            req.checkBody('email', 'Email field is required').notEmpty();
            req.checkBody('email', 'Email is not valid').isEmail();
            req.checkBody('password', 'Password should be minimum of 4 characters').isLength({ min: 4 });
    
            var errors = req.validationErrors();
    
            if (errors) {
                var message = [];
                errors.forEach(function (error) {
                    message.push(error.msg);
                });
                return done(null, false, req.flash('error', message));
            }
            var newUser = {
                name: name,
                email: email,
                password: password
            };
            return done(null, newUser);
        /*User.getUserByEmail(email, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Email not found.' });
                //res.status(403).send();
            }
    
            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) return done(err);
                if (isMatch) {
                    return done(null, user);
                    //res.send();
                } else {
                    return done(null, false, { message: 'Oops.. Wrong Password.' });
                    //res.status(403).send();
                }
            });
        });*/
        }));
    
    router.get('/logout', function (req, res) {
        req.logout();
    
        //req.flash('success', 'You have been Logged out');
        res.redirect('/');
    });
    
    module.exports = router;
    
    function isLoggedIn(req, res, next) {
        if (req.isAuthenticated()) {
            return next();
        }
        res.redirect('/');
    }

module.exports = router;
