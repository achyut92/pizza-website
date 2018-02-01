/*var menuFile = require('../menu.json')
var x = menuFile.menus
var productChunk = [];
var chunkSize = 3;
for (var i = 0; i < x.length; i += chunkSize) {
    productChunk.push(x.slice(i, i + chunkSize));
}

var products = productChunk;
module.exports = products;*/
module.exports.chunkProduct = function(products, callback){
	var productChunk1 = products;
    console.log('chunk'+JSON.stringify(productChunk1))
	var chunkSize1 = 3;
	for (var i = 0; i < productChunk1.length; i += chunkSize1) {
	    productChunk1.push(productChunk1.slice(i, i + chunkSize1));
	}
	callback(productChunk1);
}

