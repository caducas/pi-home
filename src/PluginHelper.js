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

	// for(var i = 0; i<pluginList.length; i++) {
	// 	plugin = require(path+pluginList[i]+'/'+pluginList[i]);
	// 	console.log("checking plugin:" + pluginList[i]);
	// 	if (typeof(plugin.listenEvent) === "undefined") { 
	// 		console.log("removing plugin:" + pluginList[i]);
	// 		pluginList.splice(i,1);
	// 		i--;
	// 	}
	// }
	// console.log(pluginList);
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
	var plugin;
	try {
		plugin = require(path+pluginName+'/'+pluginName);
	} catch(err) {
		console.log('PLUGINHELPER: plugin with path "'+path+pluginName+'/'+pluginName+'" not found');
		console.log(err);
		return undefined;
	}
	return plugin;
}

function getPluginAsync(pluginName, callback) {
	plugin = require(path+pluginName+'/'+pluginName, function(result) {
		callback(result);
	});
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
	exports.getPluginAsync = getPluginAsync;
}
