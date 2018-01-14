var express = require('express');
var router = express.Router();
var js = require('../public/javascripts/my')
var products = require('./menuJson.js');

router.get('/pizza', function (req, res) {
	js.performRequest('/data/2.5/weather', 'GET','',
    function(data){
	    var type = data.weather[0].main;
		var user = req.user;
		var cart = req.session.cart;
	    res.render('menu/menu_pizza', {title:'Pizza - Menu',cart:cart,temperature:data.main.temp,imgSrc:type,user:user,products :products});
  	})
});

router.get('/pasta', function (req, res) {
	js.performRequest('/data/2.5/weather', 'GET','',
    function(data){
	    var type = data.weather[0].main;
		var user = req.user;
		var cart = req.session.cart;
	    res.render('menu/menu_pasta', {title:'Pasta - Menu',cart:cart,temperature:data.main.temp,imgSrc:type,user:user,products :products});
  	})
});

router.get('/specials', function (req, res) {
    js.performRequest('/data/2.5/weather', 'GET','',
    function(data){
	    var type = data.weather[0].main;
		var user = req.user;
		var cart = req.session.cart;
	    res.render('menu/menu_specials', {title:'Specials - Menu',cart:cart,temperature:data.main.temp,imgSrc:type,user:user,products :products});
  	})
});

router.get('/bakedrice', function (req, res) {
    js.performRequest('/data/2.5/weather', 'GET','',
    function(data){
	    var type = data.weather[0].main;
		var user = req.user;
		var cart = req.session.cart;
	    res.render('menu/menu_bakedrice', {title:'BakedRice - Menu',cart:cart,temperature:data.main.temp,imgSrc:type,user:user,products :products});
  	})
});

router.get('/beverages', function (req, res) {
    js.performRequest('/data/2.5/weather', 'GET','',
    function(data){
	    var type = data.weather[0].main;
		var user = req.user;
		var cart = req.session.cart;
	    res.render('menu/menu_beverages', {title:'Beverages - Menu',cart:cart,temperature:data.main.temp,imgSrc:type,user:user,products :products});
  	})
});


module.exports = router;