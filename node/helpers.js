Helpers = {

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