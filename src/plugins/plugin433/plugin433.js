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

function listenEvent(eventId, opts) {
	console.log('plugin 433 listen event');
	console.log("eventId");
	console.log(eventId);
	console.log('opts');
	console.log(opts);
	if(opts==='undefined') {
		throw new Error("arguments for execute missing");
	}
	if(!opts.pin) {
		throw new Error("option 'port' is missing");
	}
	console.log('should start listener for plugin433');
	var pin = parseInt(opts.pin);

	var path = "sudo "+__dirname + '/receive' + " -p " + pin;
	var executor = shellExecutor.exec(path,function(error, stdout, stderr){
	});
	listenForInput(executor, eventId);

}

function listenForInput(executor, eventId) {
	var block = false;
	executor.stdout.on('data', function(buf) {
		if(!block) {
			block = true;
			setTimeout(function() {
				block=false;
			},500);

			var result = String(buf);
			if(result.substring(0,5) === 'event') {
				console.log('Event emit:' + result.substring(5,result.indexOf("\n")));
				process.emit(eventId+'', eventId, result.substring(5,result.indexOf("\n")));
			}
		} else {
			var result = String(buf);
			console.log("not");
		}
	});
}


if(typeof exports !== 'undefined') {
	exports.execute = execute;
	exports.plugin433 = plugin433;
	exports.listenEvent = listenEvent;
}