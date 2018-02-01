var bcrypt = require('bcryptjs');

module.exports.comparePassword = function(candidatePassword, hash, req, callback){
    console.log('comapre password '+candidatePassword+' '+hash)
	bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
    callback(null,isMatch);
	});
}

module.exports.createUser = function(newUser, req, callback){
    req.getConnection(function(error,conn){
        conn.query('SELECT username FROM customer where username = ?',newUser.username, function(err, result){
            if(!result.length){
                bcrypt.genSalt(10, function(err, salt) {
                bcrypt.hash(newUser.password, salt, function(err, hash) {
                    newUser.password = hash;
                    req.getConnection(function(error, conn) {
                        conn.query('INSERT INTO customer SET ?', newUser)
                    });
                    conn.query('SELECT * FROM customer where username = ?', newUser.username, callback)
                    });
                });
            }            
        });
    });
}

module.exports.deleteUser = function(id, req, callback){
    req.getConnection(function(error, conn) {
            conn.query('DELETE FROM customer where customerID = ?', id, callback)
    });
}

module.exports.getUserById = function(id, req,callback){
    console.log('By id '+id);
    req.getConnection(function(error, conn) {
                    conn.query('SELECT * FROM customer where customerID = ?', id, callback)
                });
}

module.exports.getUserByUsername = function(username, req,callback){
    console.log('By username '+username);
    req.getConnection(function(error, conn) {
                    conn.query('SELECT * FROM customer where username = ?', username, callback)
                });
}

module.exports.updateUser = function(editUser, id, req, callback){
    req.getConnection(function(error,conn){
        conn.query('SELECT username FROM customer where customerID = ?',id , function(err, result){
            if(result){
                conn.query('UPDATE customer SET ? where customerID = ?', [editUser, id], callback)
            }            
        });
    });
}