var express = require('express');
var router = express.Router();
var js = require('../public/javascripts/my')
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;
var User = require('../model/user.js');
var shortid = require('shortid');

router.get('/login', function (req, res) {
	var errMsg = req.flash('error')[0];
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
	var errMsg = req.flash('error')[0];
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
    passport.authenticate('local.register', { failureRedirect: './register', failureFlash: true }),
    function (req, res) {
        req.flash('success', 'Welcome');
        res.redirect('/');
    });

router.post('/loginUser',
    passport.authenticate('local.login', { failureRedirect: './login', failureFlash: true, successRedirect: '/' }),
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

router.delete('/deleteUser/:userId', function(req, res){
    var id = req.params.userId;
    User.deleteUser(id, req, function(err, result){
        if(result){
            res.send('User with id '+id+' deleted')
        }
        else{
            res.send(err)
        }
    })
})

router.post('/updateUser/:userId', function(req, res){
    var id = req.params.userId;
    var user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dob: req.body.dob,
            address: req.body.address,
            pincode: req.body.pincode,
            phone: req.body.phone
    }
    User.updateUser(user, id, req, function(err, result){
        if(result.affectedRows>0){
            req.user = result[0]
            req.flash('success', 'Updated successfully.');
            res.redirect('/');
        }else{
            req.flash('error', 'Error updating your details.');
            res.redirect('/');
        }
    })
})

router.put('/updateUser/:userId', function(req, res){
    var id = req.params.userId;
    var user = {
            firstname: req.body.firstname,
            lastname: req.body.lastname,
            dob: req.body.dob,
            address: req.body.address,
            pincode: req.body.pincode,
            phone: req.body.phone
    }
    User.updateUser(user, id, req, function(err, result){
        if(result.affectedRows>0){
            req.user = result[0]
            req.flash('success', 'Updated successfully.');
            res.redirect('/');
        }else{
            req.flash('error', 'Error updating your details.');
            res.redirect('/');
        }
    })
})

router.get('/profile', isLoggedIn, function (req, res, next) {
    var user = req.user;
    var products = req.session.cart;
        res.render('user/profile', { title: 'Profile', user: user, cart: products, imgSrc:'' });
      
});
    
    passport.use('local.register', new LocalStrategy({
        usernameField: 'email',
        passwordField: 'password',
        passReqToCallback: true
    }, function (req, email, password, done) {
        var firstname = req.body.firstname;
        var email = req.body.email;
        var password = req.body.password;
        var lastname = req.body.lastname;
        var address = req.body.address;
        var pincode = req.body.pincode;
        var phone = req.body.phone;
        var dob = req.body.dob;
    
        req.checkBody('firstname', 'Name field is required').notEmpty();
        req.checkBody('email', 'Email field is required').notEmpty();
        req.checkBody('email', 'Email is not valid').isEmail();
        req.checkBody('password', 'Password field is required').notEmpty();
        req.checkBody('password', 'Password should be minimum of 4 characters').isLength({ min: 4 });
        req.checkBody('address', 'Address field is required').notEmpty();
        req.checkBody('pincode', 'Pincode field is required').notEmpty();
        req.checkBody('phone', 'Mobile number field is required').notEmpty();    
        var errors = req.validationErrors();
    
        if (errors) {
            var message = [];
            errors.forEach(function (error) {
                message.push(error.msg);
            });
            return done(null, false, req.flash('error', message));
        }
        var newUser = {
            customerID: shortid.generate(),
            firstname: firstname,
            lastname: lastname,
            dob: dob,
            address: address,
            pincode: pincode,
            phone: phone,
            username: email,
            password: password
        }
        User.createUser(newUser, req, function(error,result){
            if (error){
                return done(null, false, { message: 'Email already in use.' });
            }
            return done(null, result[0]);
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
        User.getUserByUsername(email, req, function (err, result) {
            var user = result[0]
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Email not found.' });
                res.status(403).send();
            }
    
            User.comparePassword(password, user.password, req, function (err, isMatch) {
                console.log(isMatch)
                if (err) return done(err);
                if (isMatch) {
                    return done(null, user);
                    res.send();
                } else {
                    return done(null, false, { message: 'Oops.. Wrong Password.' });
                    res.status(403).send();
                }
            });
        });
        }));
    
    router.get('/logout', function (req, res) {
        req.logout();
    
        req.flash('success', 'You have been Logged out');
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
