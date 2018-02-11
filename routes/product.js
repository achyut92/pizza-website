var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var Product = require('../model/product');
var js = require('../public/javascripts/my');
var products = require('./menuJson.js');

var Cart = require('../model/cart');

router.get('/increase/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.increase(productId);

    req.session.cart = cart;
    res.redirect('/cart/my-cart');
});

router.get('/reduce/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.reduceByOne(productId);

    req.session.cart = cart;
    res.redirect('/cart/my-cart');
});

router.get('/remove-item/:id', function (req, res) {
    var productId = req.params.id;
    var cart = new Cart(req.session.cart ? req.session.cart : {});
    cart.removeItem(productId);

    req.session.cart = cart;
    res.redirect('/cart/my-cart');
});

router.post('/addReview/:foodItemId', function(req,res){
	var foodItemId = req.params.foodItemId;
    var reviewComments = req.body.reviewComments;
    var rating = req.body.rating;
	var userId = req.user.customerID;
	var review = {
		reviewID: shortid.generate(),
		rating: rating,
		reviewComments: reviewComments,
		Customer_customerID: userId,
		FoodItem_foodItemID: foodItemId
	}
    console.log(review)
	Product.addReview(review, req, function(error,result){
            if (error){
                res.send(error)
            }else{
            	res.redirect('../productDetail/'+foodItemId);
            }
        });
})

router.get('/getReviewsByFoodItemId/:foodItemId', function(req,res){
	var id = req.params.foodItemId;
	Product.reviewsByFoodItemId(id, req, function(error,result){
            if (error){
                res.send(error)
            }else{
            	res.send(result)
            }
        });
})

router.put('/updateReview/:reviewID', function(req, res){
    var id = req.params.reviewID;
    var review = {
            rating: req.body.rating,
            reviewComments: req.body.reviewComments,
            image: req.body.image
    }
    Product.updateReview(review, id, req, function(err, result){
        if(result.affectedRows>0){
            res.send('Review updated')
        }else{
            res.send('No Review found')
        }
    })
})

router.get('/deleteReview/:reviewID', function(req, res){
    var id = req.params.reviewID;
    var foodId = req.query.foodId;
    Product.deleteReview(id, req, function(err, result){
        console.log(result)
        if(result.affectedRows>0){
            req.flash('success', 'Deleted successfully.');
            res.redirect('../productDetail/'+foodId);
        }else{
            req.flash('error', 'No Review found.');
            res.redirect('../productDetail/'+foodId);
        }
    })
})

router.get('/productDetail/:id', function(req, res){
    var successMsg = req.flash('success')[0];
    var cart = req.session.cart;
    var id = req.params.id;
    js.performRequest('/data/2.5/weather', 'GET','q=singapore&appid=ccf19010dc251e2fea5173f57fed9a15&units=metric',
  function(data){
    var type = data.weather[0].main;
    var user = req.user;
    var reviews = []
    var avgRating = 0
    var sumRating = 0
    Product.reviewsByFoodItemId(id,req, function(error, rows){
        if(rows){
            reviews = rows;
            for(var i in rows){
                sumRating += parseInt(rows[i].rating)
            }
            avgRating = Math.round(sumRating/rows.length)
        }
    })
    Product.getProductById(id,req, function(error,rows,fields){
            if(rows){
                res.render('shop/productDetail.html', {title:'Penthesilesa',temperature:data.main.temp,imgSrc:type,cart:cart,user:user,product :rows[0], reviews:reviews,avgRating:avgRating, successMsg: successMsg, noMessage: !successMsg});
            }
        })
    
  })
})

module.exports = router;