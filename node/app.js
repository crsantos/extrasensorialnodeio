
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./routes/user')
  , http = require('http')
  , path = require('path')
  , serialport = require("serialport")    // include the serialport library
  , SerialPort  = serialport.SerialPort   // make a local instance of serial
  , sio = require('socket.io')
  , os = require('os')
  , ifaces = os.networkInterfaces()
  , TTY = "/dev/ttyUSB0"
  , PORT = 8080
  , serialData = {}                      // object to hold what goes out to the client
  , IP_ADDRESS = getIPAddress()
  , app = express();

// App configs
app.configure(function(){
  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
  app.use(express.favicon());
  app.use(express.logger('dev'));
  app.use(express.bodyParser());
  app.use(express.methodOverride());
  app.use(app.router);
  app.use(express.static(path.join(__dirname, 'public')));
});

app.configure('development', function(){
  app.use(express.errorHandler());
});

// App Routes
app.get('/', routes.index);
app.get('/users', user.list);


// Serial Port setup
var myPort = new SerialPort(TTY, { 
  // look for return and newline at the end of each data packet:
  parser: serialport.parsers.readline("\r\n"),
});
console.log("SerialPort => [" + myPort.path + "]");

// Server binding
var server =  http.createServer(app).listen(app.get('port'));

  console.log("Express server listening on "+ IP_ADDRESS + ":" + app.get('port'));
    // socketio listens on server
  var io =      sio.listen(server)    // filter the server using socket.io

  // listen for new socket.io connections:
  io.sockets.on('connection', function (socket) {

    socket.send("hello") // handshake

    // if there's a socket client, listen for new serial data:  
    myPort.on('data', function (data) {
      // set the value property of scores to the serial string:
      serialData.value = data;
      // for debugging, you should see this in Terminal:
      console.log(data);
      // send a serial event to the web client with the data:
      socket.emit('serialEvent', serialData);
    });
});

/**********************************************************************/

/**
    @method Gets the IP address
*/
function getIPAddress() {
  var interfaces = require('os').networkInterfaces();
  for (var devName in interfaces) {
    var iface = interfaces[devName];

    for (var i = 0; i < iface.length; i++) {
      var alias = iface[i];
      if (alias.family === 'IPv4' && alias.address !== '127.0.0.1' && !alias.internal)
        return alias.address;
    }
  }

  return '0.0.0.0';
}