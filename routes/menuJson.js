var menuFile = require('../menu.json')
var x = menuFile.menus
var productChunk = [];
var chunkSize = 3;
for (var i = 0; i < x.length; i += chunkSize) {
    productChunk.push(x.slice(i, i + chunkSize));
}

var products = productChunk;

module.exports = products;