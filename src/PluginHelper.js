/**
* Provides functionality to manage plugins.
*
* @class PluginHelper
*/

var fs = require('fs');
var path = __dirname + '/plugins/';

/**
* This method is used to get a list of all available plugin names.
*
* @method getListOfPluginNames
* @return {Array} A list containing all available plugin names.
*/
function getListOfPluginNames() {
	var pluginList = fs.readdirSync(path);
	return pluginList;
}

/**
* This method is used to get a list of all available plugins.
*
* @method getListOfPlugins
* @return {Array} A list containing all available plugins.
*/
function getListOfPlugins() {
	var pluginList = [];
	var pluginNameList = fs.readdirSync(path);
	pluginNameList.forEach(function(item) {
		pluginList[item] = require(path+item+'/'+item);
	});

	return pluginList;
	
}

/**
* This method is used to get a specific plugin.
*
* @method getPlugin
* @param {String} pluginName The name of the needed plugin.
* @return {Object} The plugin.
*/
function getPlugin(pluginName) {
	plugin = require(path+pluginName+'/'+pluginName);
	return plugin;
}

/**
* This method is used to set the location of the plugins.
*
* @method setPath
* @param {String} newPath The path where the plugins are installed.
*/
function setPath(newPath) {
	path = newPath;
}

if(typeof exports !== 'undefined') {
	exports.getListOfPlugins = getListOfPlugins;
	exports.getListOfPluginNames = getListOfPluginNames;
	exports.getPlugin = getPlugin;
	exports.setPath = setPath;
}
