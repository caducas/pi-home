var gpioPlugin = require('./../../../src/plugins/GpioPlugin/GpioPlugin');
var assert = require('chai').assert;
var sinon = require('sinon');

describe('GPIO-tests', function(){

	it("should throw error because one or more options are missing", function() {
		var gpio = gpioPlugin.GpioPlugin({'GpioPlugin':null});
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

		var gpioMock = {
			writeSync:function(value) {
				assert.equal(value,1);
			},
			unexport:function() {
			}
		};

		var onOffMock = {
			Gpio:function(pin,direction) {
				assert.equal(pin,18);
				assert.equal(direction,'out');
				return gpioMock;
			}
		};

		gpio = gpioPlugin.GpioPlugin({'gpioPlugin':onOffMock});

		var spy1 = sinon.spy(onOffMock, "Gpio");
		var spy2 = sinon.spy(gpioMock, "writeSync");
		var spy3 = sinon.spy(gpioMock, "unexport");

		//execution
		gpio.execute({'direction':'out','pin':18,'value':1});

		//assertion
		assert(spy1.calledOnce, "method Gpio should be called");
		assert(spy2.calledOnce, "method writeSync should be called");
		assert(spy3.calledOnce, "method unexport should be called");
	});

	it("should check functionality of method 'listenEvents'", function() {
		//Preparation
		var eventId = 1234;
		var onOff = require('onoff').Gpio;
		var success = false;

		process.on("1234", function(value) {
			if(value===1) {
				success = true;
			}
		});

		var gpioMock = {
			watch:function(callback) {
				callback(false, 1);
			}
		};

		var onOffMock = {
			Gpio:function(pin,direction,edge,options) {
				assert.equal(pin,18);
				assert.equal(direction,'in');
				assert.equal(edge,'both');
				assert.equal(options.persistentWatch,true);
				return gpioMock;
			}
		};

		gpio = gpioPlugin.GpioPlugin({'gpioPlugin':onOffMock});

		var spy1 = sinon.spy(onOffMock, "Gpio");
		var spy2 = sinon.spy(gpioMock, "watch");


		//execution
		gpio.listenEvents(eventId, {'pin':18});

		//assertion
		assert.equal(success, true, "should return correct event with correct value");

		//after test
		process.removeAllListeners("1234");
	});
});