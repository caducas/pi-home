/**
* This module is used to handle tasks and events directly with GPIO Ports on Raspberry Pi.
* It is used within pi@home.
*
* @class GpioPlugin
*/

var onOff;

/**
* The constructor can be used to change settings of GpioPlugin by using options.
*
* @method GpioPlugin
* @param {opts} opts The options:
*	- 'gpioPlugin' = Plugin for using onOff functionality (can be set for testing i.e.)
*/
function GpioPlugin(opts) {
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
		if(!opts.value) {
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
		var gpioPin = onOff.Gpio(pin, 'out');
		gpioPin.writeSync(value);
		gpioPin.unexport();
}

/**
* This method listens on a GPIO pin and throws events with eventId when value of pin changes.
*
* @method listenEvents
* @param {int} eventId The eventId like configured in event config.
* @param {opts} opts The opts must contain 'pin' on which should be listened.
*/
function listenEvents(eventId, opts) {
	if(!opts.pin) {
		throw new Error("option 'pin' is missing");
	}
	//TODO check eventId = valid int
	var listenPort = new onOff.Gpio(opts.pin, 'in', 'both', {persistentWatch: true});
	var eventIdString = eventId + '';

	listenPort.watch(function(err, value) {
		process.emit(eventId+'', value);
	});
}

// If we're running under Node, 
if(typeof exports !== 'undefined') {
	exports.execute = execute;
	exports.GpioPlugin = GpioPlugin;
	exports.sendOutput = sendOutput;
	exports.listenEvents = listenEvents;
}