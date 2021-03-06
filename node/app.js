
/**
 * Module dependencies.
 */

 var express = require('express')
 , routes = require('./routes')
 , http = require('http')
 , path = require('path')
  , serialport = require("serialport")    // include the serialport library
  , SerialPort  = serialport.SerialPort   // make a local instance of serial
  , sio = require('socket.io')
  , os = require('os')
  , ifaces = os.networkInterfaces()
  // , TTY = "/dev/ttyUSB0"
  , TTY = '/dev//tty.usbserial-A700e17k'
  , PORT = 3000
  , serialData = {}                      // object to hold what goes out to the client
  , helpers = require('./helpers.js')
  , IP_ADDRESS = helpers.getIPAddress() 
  , redis = require("redis").createClient()
  , app = express()
  , config = require('./config/environment.js')(app, express)
  , routes = require('./config/routes.js')(app, express, routes);

exports.ipaddress = IP_ADDRESS+":"+PORT;

// App configs
app.configure(function(){
  app.set('port', process.env.PORT || PORT);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});


// Serial Port setup
var myPort = new SerialPort(TTY, { 
  // look for return and newline at the end of each data packet:
  parser: serialport.parsers.readline("\r\n"),
});
console.log("Binded serialPort =>\t\t[\033[34m" + myPort.path + "]\033[0m");

// Server binding
var server =  http.createServer(app).listen(app.get('port'));
exports.ipaddress = IP_ADDRESS + ":" + app.get('port');

console.log("Server[" + process.platform + "] listening on =>\t\t[\033[31m"+ exports.ipaddress + "\033[0m]");

// socket.io listens on server
var io =      sio.listen(server);

// listen for new socket.io connections:
io.sockets.on('connection', function (socket) {

  socket.send("hello") // kind of handshake

  // if there's a socket client, listen for new serial data:  
  myPort.on('data', function (data) {

    var json= JSON.parse(data);
    var keys = Object.keys(json);
    for (var i = keys.length - 1; i >= 0; i--) {
      var key = keys[i];
      redis.get(key, function(error, result) {
          if (error)
            console.log('Error: '+ error);
          else
            console.log('Previous '+ key + ': ' + result);
          redis.set(key, json[key]);
      });
      
    };

    // set the value property of scores to the serial string:
    serialData.value = data;
    // for debugging, you should see this in Terminal:
    console.log(data);
    // send a serial event to the web client with the data:
    socket.emit('serialEvent', serialData);
  });
});
