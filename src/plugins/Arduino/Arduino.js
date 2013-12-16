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
	var interval = opts.interval || 5000;

	console.log("interval:" + interval);
	console.log(interval);
	var listenPort = new arduino.Sensor({
		board: board,
		pin: opts.pin,
		throttle: interval
	});

	listenOnPort(eventId, listenPort);
}

//after value change on listener port was noticed, listener gets deactivated for 20 ms (to not call listener more than once)
function listenOnPort(eventId, listenPort) {
	console.log('should start listener for Arduino');
	listenPort.on('read', function(err, value) {
		value = +value;
		console.log(value);
		process.emit(eventId+'', eventId, value);
	});
}

// If we're running under Node, 
if(typeof exports !== 'undefined') {
	exports.execute = execute;
	exports.listenEvent = listenEvent;
}