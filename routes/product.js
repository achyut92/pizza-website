var express = require('express');
var router = express.Router();
var shortid = require('shortid');
var Product = require('../model/product');

var Cart = require('../model/cart');

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
	var userId = 'rkPM4biSM'//req.user.customerID;
	var review = {
		reviewID: shortid.generate(),
		rating: 3,
		reviewComments: 'Good',
		Customer_customerID: userId,
		FoodItem_foodItemID: foodItemId
	}
	Product.addReview(review, req, function(error,result){
            if (error){
                res.send(error)
            }else{
            	res.send('Review saved')
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

module.exports = router;