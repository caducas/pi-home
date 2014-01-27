var socket = io.connect();
var activeEventConfig;


function configureEvent(eventId) {
	socket.emit('getEventConfig',eventId);
}

function createNewEvent() {
	activeEventConfig = {
		"listenerName" : "",
		"plugin" : "UI",
		"ip" : "127.0.0.1",
		"conditions" : [
		],
		"params" : {
			"uiName" : ""
		}
	};

	refreshEventConfig();
}

function removeConditionFromEventListener(pos) {

	activeEventConfig.conditions.splice(pos,1);

	refreshConditionList();
}

function cancelEventListenerConfig() {
	activeEventConfig = null;
	$("#eventGroupConfig").hide();
	$("#addNewEvent").show();
}

function saveEventListenerConfig() {
	activeEventConfig.listenerName = document.getElementById("txtListenerName").value;
	activeEventConfig.ip = document.getElementById("txtListenerIp").value;
	activeEventConfig.plugin = document.getElementById("txtListenerPlugin").value;
	activeEventConfig.variable = document.getElementById("txtListenerVariable").value;
	console.log("activeEventConfig set");

	try {
		for(var i in activeEventConfig.params) {
			activeEventConfig.params[i] = document.getElementById("setting_"+activeEventConfig.plugin+"_"+i).value;
		}
	} catch (err) {
		console.log("Error setting params");
	}

	socket.emit('updateEventListenerConfig',activeEventConfig);
	console.log("event to update sent");
	$("#eventGroupConfig").hide();
	$("#addNewEvent").show();
}

function refreshPluginList(pluginList) {

    var pluginListHtml = '<select class="form-control" id="txtListenerPlugin" onchange="pluginChanged()">';
    for(var i in pluginList) {
    	pluginListHtml += '<option>'+pluginList[i]+'</option>';
    }
    pluginListHtml += '</select>';
	$("#plugin").html(pluginListHtml);
}

function pluginChanged() {
	activeEventConfig.plugin = document.getElementById('txtListenerPlugin').value;
	activeEventConfig.params = {};
	
	var elements = [];
	elements.push(document.getElementsByTagName("input"));
	elements.push(document.getElementsByTagName("select"));

	var result = [];
	var checkString = "setting_"+activeEventConfig.plugin;
	for(var i in elements) {
		var element = elements[i];
		for(var i in element) {
			var elementsId = element[i].id;
			if(elementsId !== undefined && elementsId.slice(0,checkString.length)===checkString) {
				var paramName = elementsId.slice(-((elementsId.length-(checkString.length+1))));
				activeEventConfig.params[paramName] = "test";
			}
		}
	}

	refreshPluginParams();
	refreshConditionList();
}

function refreshPluginParams() {

	$('div[id^=params_]').filter(function() {
		return /^params_/.test(this.id);
	}).each(function() {
		$("#"+this.id).hide();
	});

	for(var i in activeEventConfig.params) {
		console.log(i);
		document.getElementById("setting_"+activeEventConfig.plugin+"_"+i).value = activeEventConfig.params[i];
	}

	$("#params_"+activeEventConfig.plugin).show();
}

function refreshConditionList() {

	if(activeEventConfig.plugin !== "UI") {
	    var conditionListHtml = '<table class="table table-striped table-bordered table-hover"><thead><tr><th>Condition name</th><th>Operator</th><th>value</th><th>Remove</th></tr></thead><tbody>';
	    for(var i in activeEventConfig.conditions) {
	    	// if(activeEventConfig.conditions[i].condition.operator !== 'undefined' && activeEventConfig.conditions[i].condition.value !== 'undefined') {}
		    	conditionListHtml += '<tr>';
		    	conditionListHtml += '<td>'+activeEventConfig.conditions[i].conditionName+'</td>';
		    	conditionListHtml += '<td>'+activeEventConfig.conditions[i].condition.operator+'</td>';
		    	conditionListHtml += '<td>'+activeEventConfig.conditions[i].condition.value+'</td>';
		    	conditionListHtml += '<td><input type="button" class="btn btn-default" value="Remove" onclick="removeConditionFromEventListener(' + i + ')" /></td>';
		    	conditionListHtml += '</tr>';
		    // }
	    }
	    conditionListHtml += '<tr>';
	    conditionListHtml += '<td><input type="text" id="inputListenerName" value="" class="form-control" /></td>';
	    conditionListHtml += '<td><select class="form-control pull-right" id="selectConditionOperator">';
	    conditionListHtml += '<option>=</option>';
	    conditionListHtml += '<option>!=</option>';
	    conditionListHtml += '<option>></option>';
	    conditionListHtml += '<option><</option>';
	    conditionListHtml += '<option>>=</option>';
	    conditionListHtml += '<option><=</option>';
	    conditionListHtml += '</select></td>';
	    conditionListHtml += '<td><input type="text" id="inputConditionValue" value="" class="form-control" /></td>';
	    conditionListHtml += '<td><input type="button" class="btn btn-default" value="Add" onclick="addCondition()" /></td>';
	    conditionListHtml += '</tr>';
	    conditionListHtml += '</tbody></table>';
		$("#conditionList").html(conditionListHtml);

	} else {
	    var conditionListHtml = '<table class="table table-striped table-bordered table-hover"><thead><tr><th>Condition name</th></tr></thead><tbody>';
	    for(var i in activeEventConfig.conditions) {
	    	conditionListHtml += '<tr>';
	    	conditionListHtml += '<td>'+activeEventConfig.conditions[i].conditionName+'</td>';
	    	conditionListHtml += '</tr>';
	    }
	    conditionListHtml += '<tr>';
	    conditionListHtml += '<td><select class="form-control pull-right" id="inputListenerName">';
	    conditionListHtml += '<option>pressed</option>';
	    conditionListHtml += '</select></td>';
	    conditionListHtml += '<td><input type="button" class="btn btn-default" value="Add" onclick="addCondition()" /></td>';
	    conditionListHtml += '</tr>';
	    conditionListHtml += '</tbody></table>';
		$("#conditionList").html(conditionListHtml);
	}

	// $('div[id^=eventListenerConditions_]').filter(function() {
	// 	return /^eventListenerConditions_/.test(this.id);
	// }).each(function() {
	// 	$("#"+this.id).hide();
	// });

	// $("#eventListenerConditions_"+activeEventConfig.plugin).show();
}

function addCondition() {
	var newCondition = {
		conditionName : document.getElementById("inputListenerName").value
		// ,
		// condition : {
		// 	operator : document.getElementById("selectConditionOperator").value,
		// 	value : document.getElementById("inputConditionValue").value
		// }
	};

	if(activeEventConfig.plugin !== "UI") {
		newCondition.condition = {
			operator : document.getElementById("selectConditionOperator").value,
			value : document.getElementById("inputConditionValue").value			
		}
	}

	activeEventConfig.conditions.push(newCondition);

	refreshConditionList();
}

function refreshEventConfig() {
	document.getElementById("txtListenerName").value = activeEventConfig.listenerName;
	document.getElementById("txtListenerIp").value = activeEventConfig.ip;
	document.getElementById("txtListenerPlugin").value = activeEventConfig.plugin;

	$("#eventGroupConfig").show();

	refreshConditionList();

	$('div[id^=params_]').filter(function() {
		return /^params_/.test(this.id);
	}).each(function() {
		$("#"+this.id).hide();
	});
	
	for(var i in activeEventConfig.params) {
		document.getElementById("setting_"+activeEventConfig.plugin+"_"+i).value = activeEventConfig.params[i];
	}

	$("#params_"+activeEventConfig.plugin).show();
	$("#addNewEvent").hide();
}

function removeEventConfig() {
	socket.emit('removeEventConfig', activeEventConfig._id);
}

socket.on('listenerNamesList', function(data) {
	var htmlEventList = '<div class="col-md-4"><div class="bs-example"><div class="panel panel-default"><div class="panel-heading">Eventlistener Names</div></div>';
	$("#eventList").html("");
	for(var i in data) {
		htmlEventList+='<a href="#" class="list-group-item" onclick="configureEvent(\''+data[i]+'\')">'+data[i]+'</a>';
	}
	htmlEventList+='</div></div>';
	$("#eventList").append(htmlEventList);
});

socket.on('getEventListenerConfigResult', function(data) {
	activeEventConfig = data;

	refreshEventConfig();
});

socket.on('getAvailablePlugins', function(listOfPlugins) {
	refreshPluginList(listOfPlugins);
});

socket.on('removedEventConfig', function() {
	activeEventConfig = null;
	$("#eventGroupConfig").hide();
	$("#addNewEvent").show();
});

$(document).ready(function(){
   $("#saveEventListenerConfig").click(function() {saveEventListenerConfig();});
   $("#cancelEventListenerConfig").click(function() {cancelEventListenerConfig();});
   $("#removeEventListenerConfig").click(function() {removeEventConfig();});
   $('#addNewEvent').click(function() {createNewEvent();});

   $("#eventGroupConfig").hide();
});