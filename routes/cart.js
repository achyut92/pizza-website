var express = require('express');
var router = express.Router();
var Cart = require('../model/cart');
var Product = require('../model/product');
var js = require('../public/javascripts/my')


router.get('/add-to-cart/:id', function (req, res) {
    var itemId = req.params.id;
    console.log(itemId);
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    /*var product = '';
    cart.add(product, itemId);

        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');*/
    Product.getProductById(itemId, req, function (err, product) {
        console.log(JSON.stringify(product))
        if (err) {
            return res.redirect('/');
        }

        cart.add(product[0], itemId);

        req.session.cart = cart;
        console.log(req.session.cart);
        res.redirect('/');
    });
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
    console.log(cart)
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

    router.post('/checkout', isLoggedIn, function (req, res) {

    if (!req.session.cart) {
        return res.redirect('products/my-cart');
    }

    var cart = new Cart(req.session.cart);

    var stripe = require("stripe")(
        "sk_test_wZfbLxB0sxmn3DlCJ0YCrJVP"
    );

    stripe.charges.create({
        amount: cart.totalPrice*100,
        currency: "usd",
        source: req.body.stripeToken, // obtained with Stripe.js
        description: "Charge for " + req.user.name
    }, function (err, charge) {
        if (err) {
            req.flash('error', err.message);
            return res.redirect('/cart/checkout');
        }

        var order = {
            orderID: charge.id,
            paymentStatus: 'paid',
            orderStatus: 'delivered',
            Customer_customerID1: req.user.customerID,
            Payment_paymentID: charge.id,
            total: cart.totalPrice
        };

        req.getConnection(function(error, conn) {
                    conn.query('INSERT INTO pizza_app.order SET ?', order, function (err, result) {
            if (err) throw err;
            req.flash('success', 'Your order has been placed.Thank you.');
            req.session.cart = null;
            res.redirect('/');
                });
                });

        /*Order.createOrder(order, function (err, result) {
            if (err) throw err;
            req.flash('success', 'Your order has been placed.Thank you.');
            req.session.cart = null;
            res.redirect('/');
        });
*/        
    });
    
});
    
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/');
}
module.exports = router;