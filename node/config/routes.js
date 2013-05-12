module.exports = function(app, express, routes){

// Load models
var user = require('../routes/user')

  // App Routes
app.get('/', routes.index);
app.get('/users', user.list);

};