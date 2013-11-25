/**
* This module is used to handle tasks. It uses PluginHelper to load correct plugin and executes the 'execute' method of the plugin with params.
*
* @class TaskExecutor
*/

var pluginHelper = require('./PluginHelper');
var networkCommunicator = require(__dirname + '/NetworkCommunicator');
var conditionHelper = require(__dirname + '/ConditionHelper');

/**
* This method is used to execute the 'execute' method from a plugin. The plugin and the params must be defined in the parameter.
*
* @method executeTask
* @param {Object} taskConfig The configuration for the task. Must be valid JSON object. Must include 'plugin' and 'params' with correct params as child.
*/
function startListeners(eventConfig) {

	var events = eventConfig;

	for (var eventPos in events) {

		var pluginEvent = events[eventPos];

		var plugin = pluginHelper.getPlugin(pluginEvent.plugin);

		for (var listenerPos in pluginEvent.listeners) {
			var listener = pluginEvent.listeners[listenerPos];

			plugin.listenEvent(listener.listenerName, listener.params);

			process.on(listener.listenerName, function(value) {

				for (var conditionPos in listener.events) {
					var condition = listener.events[conditionPos];

					//check condition
					if(conditionHelper.checkCondition(value, condition.condition)) {
						var jsonObjectToSend = {"command" : "event", "listener" : listener.listenerName, "condition" : condition.conditionName};
						networkCommunicator.sendToServer(jsonObjectToSend);
					}
				}
			});
		}
	}
}

if(typeof exports !== 'undefined') {
	exports.startListeners = startListeners;
}
