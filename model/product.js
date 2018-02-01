
module.exports.getProductById = function (id, req, callback) {
    console.log('Product by id ' + id);
    req.getConnection(function(error, conn) {
                    conn.query('SELECT * FROM fooditem where foodItemID = ?', id, callback)
                });
}

module.exports.getProductByCategory = function (category, req, callback) {
    console.log('Product by category ' + category);
    req.getConnection(function(error, conn) {
                    conn.query('SELECT * FROM fooditem where category  = ?', category, callback)
                });
}

module.exports.getProducts = function (req, callback) {
	var res = []
    req.getConnection(function(error, conn) {
        conn.query('(SELECT * FROM fooditem where category  = "pizza") UNION (SELECT * FROM fooditem where category  = "baked rice")', callback)
    })
}

module.exports.addReview = function (review, req, callback) {
    req.getConnection(function(error, conn) {
        conn.query('INSERT INTO review SET ?', review, callback)
    })
}

module.exports.reviewsByFoodItemId = function (id, req, callback) {
    req.getConnection(function(error, conn) {
        conn.query('SELECT * FROM review WHERE FoodItem_foodItemID = ?', id, callback)
    })
}

module.exports.updateReview = function(editReview, reviewID, req, callback){
    req.getConnection(function(error,conn){
        conn.query('SELECT * FROM review WHERE reviewID = ?',reviewID , function(err, result){
            if(result){
                conn.query('UPDATE review SET ? where reviewID = ?', [editReview, reviewID], callback)
            }            
        });
    });
}