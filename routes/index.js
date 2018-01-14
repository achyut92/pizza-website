var express = require('express');
var router = express.Router();
var js = require('../public/javascripts/my')
var menuFile = require('../menu.json')

/* GET home page. */
router.get('/header.html', function (req, res) {
	var user = {
		email: 'a@a.c'
	}

    res.render('index.html');
});

router.get('/', function (req, res) {
	var user = {
		email: 'a@a.c'
    }
    
    var x = menuFile.menus
    var productChunk = [];
        var chunkSize = 3;
        for (var i = 0; i < x.length; i += chunkSize) {
            productChunk.push(x.slice(i, i + chunkSize));
        }

        var products = require('./menuJson.js');
        
    var cart = req.session.cart;
    cart = {
        "totalQty":1
    }

js.performRequest('/data/2.5/weather', 'GET','',
  function(data){
    var type = data.weather[0].main;
    var user = req.user;
    res.render('index.html', {title:'Penthesilesa',pic:'../../images/weather/icons8-rainy-weather-filled-50.png',temperature:data.main.temp,imgSrc:type,cart:cart,user:user,products :products});
  })

});

router.get('/footer.html', function (req, res) {
    res.render('footer.html');
});

router.get('/about', function (req, res) {
    res.render('about.html',{title:'About',imgSrc:null,user:null,products :null});
});

router.get('/contact', function (req, res) {
    res.render('contact',{title:'Contact',imgSrc:null,user:null,products :null});
});

module.exports = router;