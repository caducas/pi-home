/**
* This module is used to handle tasks. It uses PluginHelper to load correct plugin and executes the 'execute' method of the plugin with params.
*
* @class TaskExecutor
*/

var pluginHelper = require('./PluginHelper');

/**
* This method is used to execute the 'execute' method from a plugin. The plugin and the params must be defined in the parameter.
*
* @method executeTask
* @param {Object} taskConfig The configuration for the task. Must be valid JSON object. Must include 'plugin' and 'params' with correct params as child.
*/
function executeTask(taskConfig) {

	var plugin = pluginHelper.getPlugin(taskConfig.plugin);

	plugin.execute(taskConfig.params);
}

if(typeof exports !== 'undefined') {
	exports.executeTask = executeTask;
}
