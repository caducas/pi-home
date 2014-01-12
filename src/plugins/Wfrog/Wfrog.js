var fs = require('fs'),
    xml2js = require('xml2js'),
    dbHelper = require(__dirname + '/../../DBHelper');

var parser = new xml2js.Parser();

function execute(opts) {
}

function listenEvent(eventId, opts) {
	var interval = opts.interval || 5000;

	setInterval(function() {
		fs.readFile('/var/lib/wfrog/wfrog-current.xml', function(err, data) {
		    parser.parseString(data, function (err, result) {
		    	console.log("current data read");
				process.emit(eventId+'', eventId, result);
		    });
		});
	}, interval);
}

function processPluginData(data, callback) {
	console.log("set outside temp" + data.current.thInt[0].temp[0]);
	dbHelper.setVariable("WFROG_temperature_outside", data.current.th1[0].temp[0], function() {
		callback("WFROG_temperature_outside");
	});
	dbHelper.setVariable("WFROG_temperature_inside", data.current.thInt[0].temp[0], function() {
		callback("WFROG_temperature_inside");
	});
	dbHelper.setVariable("WFROG_humidity_outside", data.current.th1[0].humidity[0], function() {
		callback("WFROG_humidity_outside");
	});
	dbHelper.setVariable("WFROG_humidity_inside", data.current.thInt[0].humidity[0], function() {
		callback("WFROG_humidity_inside");
	});
	dbHelper.setVariable("WFROG_rain_rate", data.current.rain[0].rate[0], function() {
		callback("WFROG_rain_rate");
	});
	dbHelper.setVariable("WFROG_wind_avgSpeed", data.current.wind[0].avgSpeed[0], function() {
		callback("WFROG_wind_avgSpeed");
	});
	dbHelper.setVariable("WFROG_wind_dirDeg", data.current.wind[0].dirDeg[0], function() {
		callback("WFROG_wind_dirDeg");
	});
	dbHelper.setVariable("WFROG_wind_gustSpeed", data.current.wind[0].gustSpeed[0], function() {
		callback("WFROG_wind_gustSpeed");
	});
	dbHelper.setVariable("WFROG_barometer_pressure", data.current.barometer[0].pressure[0], function() {
		callback("WFROG_barometer_pressure");
	});
}


// If we're running under Node, 
if(typeof exports !== 'undefined') {
	exports.execute = execute;
	exports.listenEvent = listenEvent;
	exports.processPluginData = processPluginData;
}