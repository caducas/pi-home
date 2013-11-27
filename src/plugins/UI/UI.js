/**
* This module is used to handle tasks and events directly with GPIO Ports on Raspberry Pi.
* It is used within pi@home.
*
* @class Gpio
* @constructor
*/
function Gpio(opts) {
	if(opts==='undefined') {
		onOff = require('onoff').Gpio;		
	}
	if(opts.gpioPlugin) {
		onOff = opts.gpioPlugin;
	} else {
		onOff = require('onoff').Gpio;
	}
	return this;
}

var onOff = require('onoff').Gpio;

/**
* This method is used to execute a pi@home command concerning GPIO Ports.
*
* @method execute
* @param {opts} opts The options:
*	- 'direction' = 'in' or 'out'
*	- 'pin' = the pin number on RPi GPIOs
*	- 'value' = the value for direction 'out'
*/
function execute(opts) {
	if(opts==='undefined') {
		throw new Error("arguments for execute missing");
	}
	if(!opts.direction) {
		throw new Error("option 'direction' is missing");
	}
	if(!opts.pin) {
		throw new Error("option 'pin' is missing");
	}

	if(opts.direction === 'out') {
		if(!(opts.value<=0 || opts.value >0)) {
			throw new Error("option 'value' is missing for pin output");
		}
		this.sendOutput(opts.pin, opts.value);
	}
}

/**
* This method is used to send a output to a GPIO pin.
*
* @method sendOutput
* @param {int} pin The pin on which the signal/value should be send.
* @param {int} value The value which should be send (1 = HIGH, 0 = LOW).
*/
function sendOutput(pin, value) {
		var gpioPin = new onOff(pin, 'out');
		gpioPin.writeSync(value);
		gpioPin.unexport();
}

/**
* This method listens on a GPIO pin and throws events with eventId when value of pin changes.
*
* @method listenEvent
* @param {int} eventId The eventId like configured in event config.
* @param {opts} opts The opts must contain 'pin' on which should be listened.
*/
function listenEvent(eventId, opts) {
}

//after value change on listener port was noticed, listener gets deactivated for 20 ms (to not call listener more than once)
function listenOnPort(eventId, listenPort) {
	listenPort.watch(function(err, value) {
		listenPort.unwatch();
		setTimeout(function() {
			process.emit(eventId+'', listenPort.readSync());
			listenOnPort(eventId, listenPort);
		},20);
	});
}

// If we're running under Node, 
if(typeof exports !== 'undefined') {
	exports.execute = execute;
	exports.Gpio = Gpio;
	exports.sendOutput = sendOutput;
	exports.listenEvent = listenEvent;
}