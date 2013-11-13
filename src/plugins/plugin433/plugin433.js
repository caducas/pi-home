/**
* This module is used to handle tasks and events directly with GPIO Ports on Raspberry Pi.
* It is used within pi@home.
*
* @class plugin433
* @constructor
*/
function plugin433(opts) {
	if(opts==='undefined') {
		shellExecutor = opts.shellExecutor;	
	}
	if(opts.pathToSendCommand) {
		pathToSendCommand = opts.pathToSendCommand;
	}
	if(opts.shellExecutor) {
		shellExecutor = opts.shellExecutor;
	}
	return this;
}

var pathToSendCommand = "/opt/rcswitch-pi/send";
var shellExecutor = require('child_process');

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
	if(!opts.grpId) {
		throw new Error("option 'grpId' is missing");
	}
	if(!opts.deviceId) {
		throw new Error("option 'deviceId' is missing");
	}
	if(opts.value !== 1 && opts.value !== 0) {
			throw new Error("option 'value' is missing for pin output");
		//this.sendOutput(opts.pin, opts.value);
	}
	var cmd = getSendCommand(opts.grpId,opts.deviceId,opts.value);
	shellExecutor.exec(cmd);
	console.log(cmd);
}

function getSendCommand(grpId, deviceId, onOffCommand) {
	return "sudo " + pathToSendCommand + " " + grpId + " " + deviceId + " " + onOffCommand;
}

function listenEvents(eventId, opts) {
	//TODO
}


// If we're running under Node, 
if(typeof exports !== 'undefined') {
	exports.execute = execute;
	exports.plugin433 = plugin433;
	exports.listenEvents = listenEvents;
}