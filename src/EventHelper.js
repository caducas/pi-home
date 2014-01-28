/**
* This module is used to handle tasks. It uses PluginHelper to load correct plugin and executes the 'execute' method of the plugin with params.
*
* @class TaskExecutor
*/

var pluginHelper = require('./PluginHelper');
var networkCommunicator = require(__dirname + '/NetworkCommunicator');
var conditionHelper = require(__dirname + '/ConditionHelper');

/**
* This method is used to execute the 'execute' method from a plugin.
*
* @method executeTask
* @param {Object} taskConfig The list of eventListener configuration for the task. Must be valid JSON objects.
*/
function startListeners(eventConfig) {

	var listeners = [];

	console.log('EVENTHELPER: eventConfig:');
	console.log(eventConfig);

	for(var eventPos in eventConfig) {
		var eventListener = eventConfig[eventPos];
		if(eventListener.plugin !== "UI") {

			console.log("test");
			// var listener = JSON.parse(JSON.stringify(eventListener));
			// var listener = jQuery.extend({}, eventListener);
			var listener = eventListener;
			listeners[listener.listenerName] = listener;
			console.log('eventListener.plugin');
			console.log(listener.plugin);
			var plugin = pluginHelper.getPlugin(listener.plugin);
			// console.log(plugin);
			console.log("starts listenEvent function");
			plugin.listenEvent(listener.listenerName, listener.params);

			console.log("should start listener for "+listener.plugin + "." + listener.listenerName);
			process.on(listener.listenerName, function(listenerName, value) {
				console.log('listenerName');
				console.log(listenerName);
				var list = listeners[listenerName];
				console.log('listener');
				console.log(listener);
				console.log('list');
				console.log(list);
				console.log('sendData:'+listener.sendData);
				try {
					if(list.sendData === 'true') {
						var jsonObjectToSend = {"command" : "data", "plugin" : list.plugin, "value" : value};
						console.log('SEND PLUGIN DATA:' + value);
						networkCommunicator.sendToServer(jsonObjectToSend);
					}
				} catch(err) {

				}

				try {
					if(list.variable.length > 0 && list.variable.length !== 'undefined') {
						var jsonObjectToSend = {"command" : "variable", "variable" : list.variable, "value" : value};
						console.log('SEND VALUE:' + value);
						networkCommunicator.sendToServer(jsonObjectToSend);
					}
				} catch(err) {

				}

				// console.log('list');
				// console.log(list);
				for(var conditionPos in list.conditions) {
					var condition = list.conditions[conditionPos];

					if(conditionHelper.checkCondition(value, condition.condition)) {
							var jsonObjectToSend = {"command" : "event", "listener" : list.listenerName, "condition" : condition.conditionName};
							networkCommunicator.sendToServer(jsonObjectToSend);						
					}
				}
			})
		}
	}
}

if(typeof exports !== 'undefined') {
	exports.startListeners = startListeners;
}
