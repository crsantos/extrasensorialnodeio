
/*
 * GET home page.
 */

// require the app tp access its exports
var app = require("../app");

exports.index = function(req, res){
  res.render('index', { title: 'Express' , ipaddress: app.ipaddress });
};