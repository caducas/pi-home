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

	// console.log('EVENTHELPER: eventConfig:');
	// console.log(eventConfig);

	for(var eventPos in eventConfig) {
		var eventListener = eventConfig[eventPos];
		if(eventListener.plugin !== "UI") {

			var listener = eventListener;
			listeners[listener.listenerName] = listener;
			var plugin = pluginHelper.getPlugin(listener.plugin);
			plugin.listenEvent(listener.listenerName, listener.params);
			process.on(listener.listenerName, function(listenerName, value) {

				var list = listeners[listenerName];

				try {
					if(list.sendData === 'true') {
						var jsonObjectToSend = {"command" : "data", "plugin" : list.plugin, "value" : value};
						networkCommunicator.sendToServer(jsonObjectToSend);
					}
				} catch(err) {

				}

				try {
					if(list.variable.length > 0 && list.variable.length !== 'undefined') {
						var jsonObjectToSend = {"command" : "variable", "variable" : list.variable, "value" : value};
						networkCommunicator.sendToServer(jsonObjectToSend);
					}
				} catch(err) {

				}

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
