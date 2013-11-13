var onOff = require('onoff').Gpio;
var pluginHelper = require('./PluginHelper');
var gpioPlugin = pluginHelper.getPlugin('Gpio');//require('./plugins/Gpio/Gpio').Gpio({'gpioPlugin':onOff});
var plugin433 = pluginHelper.getPlugin('plugin433');//require('./plugins/plugin433/plugin433');
var events = require('events');
var eventEmitter = new events.EventEmitter();

process.on('1234', function(value) {
	gpioPlugin.execute({'direction':'out','pin':27,'value':value});
	plugin433.execute({'grpId':1,'deviceId':1,'value':value});
});

var list = pluginHelper.getListOfPlugins();
for (var key in list) {
	console.log(key);
	}
console.log(list);

var namesList = pluginHelper.getListOfPluginNames({'path':'./../test/utils/PluginHelper/'});
console.log('names:'+namesList);
gpioPlugin.listenEvents(1234, {'pin':18});
