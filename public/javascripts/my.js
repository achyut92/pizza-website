
var http = require('http');
var weather = '';

module.exports = {

  weather,

  performRequest: function(endpoint, method, data, success) {
    data = "q=singapore&appid=<openweathermap API>&units=metric";
  var dataString = JSON.stringify(data);
  var headers = {};
  
  if (method == 'GET') {
    endpoint += '?' + data;
  }
  else {
    headers = {
      'Content-Type': 'application/json',
      'Content-Length': dataString.length
    };
  }
  var options = {
    host: 'api.openweathermap.org',
    path: endpoint,
    method: method,
    headers: headers
  };

  var req = http.request(options, function(res) {
    res.setEncoding('utf-8');

    var responseString = '';

    res.on('data', function(data) {
      responseString += data;
    });

    res.on('end', function() {
      var responseObject = JSON.parse(responseString);
      weather = responseString;
      success(responseObject);
    });
  });

  req.write(dataString);
  req.end();
}
}