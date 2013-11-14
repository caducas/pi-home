var gpioPlugin = require(__dirname + '/../../../src/plugins/Gpio/Gpio');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('GPIO-tests', function(){

	it("should throw error because one or more options are missing", function() {
		var gpio = gpioPlugin.Gpio({'gpioPlugin':null});
		var error;
		//without arguments
		try {
			gpio.execute();
		} catch (err) {
			error = err;
		}
		assert.include(error.message, "Cannot read property 'direction' of undefined");

		//empty arguments
		error = null;
		try {
			gpio.execute({});
		} catch (err) {
			error = err;
		}
		assert.include(error.message, "option 'direction' is missing");

		//missing pin
		error = null;
		try {
			gpio.execute({'direction':'in'});
		} catch (err) {
			error = err;
		}
		assert.include(error.message, "option 'pin' is missing");

		//value missing
		error = null;
		try {
			gpio.execute({'direction':'out','pin':17});
		} catch (err) {
			error = err;
		}
		assert.include(error.message, "option 'value' is missing");
	});

	it("should execute function 'sendOutput' with correct values", function() {
		//Preparation
		var onOff = require('onoff').Gpio;
		var spy1 = sinon.spy(onOff.prototype, "writeSync");
		var spy2 = sinon.spy(onOff.prototype, "unexport");
		var gpio = gpioPlugin.Gpio({'gpioPlugin':onOff});

		//execution
		gpio.execute({'direction':'out','pin':17,'value':1});

		//assertion
		assert(spy1.calledWith(1), "method writeSync should be called once");
		assert(spy2.calledOnce, "method unexport should be called once");
	});

	//TODO
	it("method 'watch' from module 'onOff' should be called in method 'listenEvents'", function() {
		//Preparation
		var onOff = require('onoff').Gpio;
		var spy1 = sinon.spy(onOff.prototype, "watch");

		//execution
		var gpio = gpioPlugin.Gpio({'gpioPlugin':onOff});
		gpio.listenEvents(1234, {'pin':18});

		//assertion
		assert(spy1.calledOnce, "not called 1");
	});
});