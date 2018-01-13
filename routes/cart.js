var express = require('express');
var router = express.Router();
var Cart = require('../model/cart');
var js = require('../public/javascripts/my')


router.get('/add-to-cart/:id', function (req, res) {
    var productId = req.params.id;
    console.log(productId);
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    var product = '';
    cart.add(product, productId);

        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    /*Product.getProductById(productId, function (err, product) {
        if (err) {
            return res.redirect('/');
        }

        cart.add(product, productId);

        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });*/
});

router.get('/my-cart', isLoggedIn, function (req, res) {

    js.performRequest('/data/2.5/weather', 'GET','q=singapore&appid=ccf19010dc251e2fea5173f57fed9a15&units=metric',
  function(data){
    var type = data.weather[0].main;
    var user = req.user;
    if (!req.session.cart) {
        return res.render('shop/shopping-cart', { title: 'Your Cart', temperature:data.main.temp,imgSrc:type,cart:cart,user:user,products :null });
    }
    var cart = new Cart(req.session.cart);
    
    res.render('shop/shopping-cart', { title: 'Your Cart', user: req.user, temperature:data.main.temp, products:cart ,imgSrc:type, cart: cart.generateArray(), totalPrice: cart.totalPrice });

  })
    });

    router.get('/checkout', isLoggedIn, function (req, res) {
        if (!req.session.cart) {
            return res.redirect('./my-cart');
        }
        var cart = new Cart(req.session.cart);
        js.performRequest('/data/2.5/weather', 'GET','q=singapore&appid=ccf19010dc251e2fea5173f57fed9a15&units=metric',
  function(data){
    var type = data.weather[0].main;
    var user = req.user;
    res.render('shop/checkout', { title: 'Checkout',cart:cart, user: req.user, imgSrc:type, temperature:data.main.temp, products: cart, errMsg: '', noError: true, totalPrice: cart.totalPrice });
    })
        //var errMsg = req.flash('error')[0];
        
    });
    
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
module.exports = router;