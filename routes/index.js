var express = require('express');
var router = express.Router();
var js = require('../public/javascripts/my')
//var menuFile = require('../menu.json')
var Products = require('../model/product');
var products = require('./menuJson.js');

/* GET home page. */
/*router.get('/header.html', function (req, res) {
	var user = req.user;

    res.render('index.html');
});*/

router.get('/', function (req, res) {
    var successMsg = req.flash('success')[0];
        
        
    var cart = req.session.cart;

js.performRequest('/data/2.5/weather', 'GET','',
  function(data){
    var type = data.weather[0].main;
    var user = req.user;
    Products.getProducts(req, function(error,rows,fields){
            if(rows){
                products.chunkProduct(rows, function(result){
                    //console.log('test'+JSON.stringify(result))
                    res.render('index', {title:'Penthesilesa',temperature:data.main.temp,imgSrc:type,cart:cart,user:user,products :result, successMsg: successMsg, noMessage: !successMsg});
                })
            }
        })
    
  })

});

router.get('/footer.html', function (req, res) {
    var user = req.user;
    res.render('footer.html');
});

router.get('/about', function (req, res) {
    var user = req.user;
    res.render('about.html',{title:'About',imgSrc:null,user:user,products :null});
});

router.get('/contact', function (req, res) {
    var user = req.user;
    res.render('contact',{title:'Contact',imgSrc:null,user:user,products :null});
});

module.exports = router;