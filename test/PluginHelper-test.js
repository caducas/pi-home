var assert = require('chai').assert;
var sinon = require('sinon');

describe('PluginHelper', function(){

	it("checks that method 'getListOfPluginNames' returns correct list", function() {

		//preparation
		var path = __dirname + '/utils/PluginHelper/';
		var pluginHelper = require('./../src/PluginHelper');
		pluginHelper.setPath(__dirname + '/utils/PluginHelper/');

		//execution
		var list = pluginHelper.getListOfPluginNames();

		//assertion
		assert.equal(list[0],'plugin01', "returned list should contain element with key 'plugin01'");
		assert.equal(list[1],'plugin02', "returned list should contain element with key 'plugin02'");
	});

	it("checks that method 'getListOfPlugins' returns correct list", function() {

		//preparation
		var path = __dirname + '/utils/PluginHelper/';
		var pluginHelper = require('./../src/PluginHelper');
		pluginHelper.setPath(__dirname + '/utils/PluginHelper/');

		//execution
		var list = pluginHelper.getListOfPlugins();

		//assertion
		assert.isObject(list.plugin01, "returned list should contain item on key 'plugin01' with an containing object");
		assert.isObject(list.plugin02, "returned list should contain item on key 'plugin02' with an containing object");
		assert.isNotObject(list.plugin03, "returned list should NOT contain item on key 'plugin03' with an containing object");
	});

	it("checks that method 'getPlugin' returns correct plugin", function() {

		//preparation
		var pluginHelper = require('./../src/PluginHelper');
		var error;
		pluginHelper.setPath(__dirname + '/utils/PluginHelper/');

		//execution
		var plugin1 = pluginHelper.getPlugin('plugin01');
		var plugin2 = pluginHelper.getPlugin('plugin02');
		try {
			var plugin3 = pluginHelper.getPlugin('plugin03');
		} catch (err) {
			error = err;
		}

		//assertion
		assert.equal(plugin1.test(),1,"returned wrong plugin");
		assert.equal(plugin2.test(),2,"returned wrong plugin");
		assert.include(error.message, "Cannot find module");
	});
});