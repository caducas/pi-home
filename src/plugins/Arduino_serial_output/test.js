var SerialPort = require('serialport').SerialPort; 
var child  = require('child_process');


child.exec('ls /dev | grep "ttyACM"', function(err, stdout, stderr){
	console.log(stdout.toString());
	var device = "/dev/"+stdout.slice(0, stdout.length - 1);
	var receivedData = "";
	serialPort = new SerialPort(device, {
	    baudrate: 9600,
	    // defaults for Arduino serial communication
	     dataBits: 8, 
	     parity: 'none', 
	     stopBits: 1, 
	     flowControl: false 
	});

	serialPort.on("open", function () {
	     // Listens to incoming data
	    serialPort.on('data', function(data) {
	    	receivedData += data.toString();
	    	if (receivedData .indexOf('*') >= 0 && receivedData .indexOf('#') >= 0) {
	         // save the data between 'B' and 'E'
	           var pin = receivedData.substring(receivedData .indexOf('*') + 1, receivedData .indexOf('#'));
	           console.log("pin:"+pin);
	           receivedData = '';
	     	}
	     });
	  });  
});


