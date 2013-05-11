/*
  serialserver.js 
  based on Tom Igoe serialServer.js 
  Patches and improvements suggested by Steve Klise, Lia Martinez, and Will Jennings
*/

var serialport = require("serialport"),         // include the serialport library
  SerialPort  = serialport.SerialPort,          // make a local instance of serial
    app = require('express')(),                 // start Express framework
    server = require('http').createServer(app), // start an HTTP server
    io = require('socket.io').listen(server)    // filter the server using socket.io
    TTY = "/dev/ttyUSB0",
    PORT = 8080;

var serialData = {};                // object to hold what goes out to the client

var out = server.listen(PORT);                // listen for incoming requests on the server
console.log("Listening for new clients on port" + PORT);

// open the serial port. Change the name to the name of your port, just like in Processing and Arduino:
var myPort = new SerialPort(TTY, { 
  // look for return and newline at the end of each data packet:
  parser: serialport.parsers.readline("\r\n"),
});

// respond to web GET requests with the index.html page:
app.get('/', function (request, response) {
  console.log("Incoming request from: " + request.headers['user-agent']);
  response.sendfile(__dirname + '/index.html');
});

// listen for new socket.io connections:
io.sockets.on('connection', function (socket) {
  console.log("Connected!");
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
