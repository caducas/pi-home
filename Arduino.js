function Arduino(opts) {
}

var arduino = require('duino'),
    board = new arduino.Board({
		device: "USB",
    	debug: true
    });

function execute(opts) {
}

function listenEvent(eventId, opts) {
	if(!opts.pin) {
		throw new Error("option 'pin' is missing");
	}
	var listenPort = new arduino.Sensor({
		board: board,
		pin: pin
	});

	listenOnPort(eventId, listenPort);
}

//after value change on listener port was noticed, listener gets deactivated for 20 ms (to not call listener more than once)
function listenOnPort(eventId, listenPort) {
	console.log('should start listener for Arduino');
	listenPort.on('read', function(err, value) {
		// listenPort.on('read', function(err, value) {
		// });
		// setTimeout(function() {
		// 	listenOnPort(eventId, listenPort);
		// }, 20);
		value = +value;
		console.log(value);
		process.emit(eventId+'', value);
	});
}

// If we're running under Node, 
if(typeof exports !== 'undefined') {
	exports.execute = execute;
	exports.listenEvent = listenEvent;
}