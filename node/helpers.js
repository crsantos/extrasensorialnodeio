var Pushover = require('node-pushover')

Helpers = {

  /**
  @
  */
  pusher: new Pushover({
    // WARNING: Please define those in your ~/.bashrc
    token:  process.env['PUSHOVER_TOKEN'],
    user:   process.env['PUSHOVER_USER']
  }),

  /** 
    @method Sends a push notif
      Usage:
    helpers.sendPushNotification('titletest', 'l0l0l0l0l', function(res, err){
      if(err.status != 1){
          console.log("We have an error:");
          console.log(err.stack);
        }else{
          console.log("Message sent successfully");
        }
    });
  *
  */
  sendPushNotification: function(title, message, callbackFunction){
    
    var push = this.pusher;
    // A callback function is defined:
    push.send(title, message, callbackFunction);
  },

  /**
  @method Gets the IP address
  @returns the IP addres or falls back to 0.0.0.0
  */
  getIPAddress: function () {
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
  },

  /**
  @method list serial ports
  @param the serialPort object initialized
  */
  listPorts: function (serialport) {
    serialport.list(function (err, ports) {
      ports.forEach(function(port) {
      console.log(port.comName + ", " + port.pnpId + ", " + port.manufacturer);
    });
  });
  }

}

module.exports = Helpers;