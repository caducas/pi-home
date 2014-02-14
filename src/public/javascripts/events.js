var socket = io.connect();
var activeEventConfig;


function configureEvent(eventId) {
	socket.emit('getEventConfig',eventId);
}

function createNewEvent() {
	activeEventConfig = {
		"listenerName" : "Event-Name",
		"plugin" : "UI",
		"ip" : "127.0.0.1",
		"variable" : "",
		"sendData" : "false",
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
	activeEventConfig.sendData = document.getElementById("txtListenerSendData").value;

	try {
		for(var i in activeEventConfig.params) {
			activeEventConfig.params[i] = document.getElementById("setting_"+activeEventConfig.plugin+"_"+i).value;
		}
	} catch (err) {
		console.log("Error setting params");
	}

	socket.emit('updateEventListenerConfig',activeEventConfig);
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

	//delete existing conditions if plugin is set to UI or set to other plugin from UI
	if(activeEventConfig.plugin === 'UI' || document.getElementById('txtListenerPlugin').value) {
		activeEventConfig.conditions = [];
	}

	activeEventConfig.plugin = document.getElementById('txtListenerPlugin').value;

	activeEventConfig.params = {};
	
	var elements = [];
	elements.push(document.getElementsByTagName("input"));
	elements.push(document.getElementsByTagName("select"));

	var result = [];
	var checkString = "setting_"+activeEventConfig.plugin;
	for(var j in elements) {
		var element = elements[j];
		for(var i in element) {
			var elementsId = element[i].id;
			if(elementsId !== undefined && elementsId.slice(0,checkString.length)===checkString) {
				var paramName = elementsId.slice(-((elementsId.length-(checkString.length+1))));
				activeEventConfig.params[paramName] = "";
			}
		}
	}

	refreshPluginParams();
	refreshConditionList();
}

function refreshPluginParams() {

	$('div[id^=params_]').filter(function() {
		return (/^params_/).test(this.id);
	}).each(function() {
		$("#"+this.id).hide();
	});

	for(var i in activeEventConfig.params) {
		document.getElementById("setting_"+activeEventConfig.plugin+"_"+i).value = activeEventConfig.params[i];
	}

	$("#params_"+activeEventConfig.plugin).show();
}

function refreshConditionList() {
	var conditionListHtml = '';

	if(activeEventConfig.plugin !== "UI") {
		conditionListHtml = '<table class="table table-striped table-hover"><thead><tr><th>Condition name</th><th>Operator</th><th>value</th><th>&nbsp;</th></tr></thead><tbody>';
		for(var counter in activeEventConfig.conditions) {
			conditionListHtml += '<tr>';
			conditionListHtml += '<td>'+activeEventConfig.conditions[counter].conditionName+'</td>';
			conditionListHtml += '<td>'+activeEventConfig.conditions[counter].condition.operator+'</td>';
			conditionListHtml += '<td>'+activeEventConfig.conditions[counter].condition.value+'</td>';
			conditionListHtml += '<td><button type="button" class="btn btn-default button-config-list" onclick="removeConditionFromEventListener(' + counter + ')"><span class="glyphicon glyphicon-trash"></span></button></td>';
			conditionListHtml += '</tr>';
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
		conditionListHtml += '<td><button type="button" class="btn btn-default button-config-list" onclick="addCondition()"><span class="glyphicon glyphicon-plus"></span></button></td>';
		conditionListHtml += '</tr>';
		conditionListHtml += '</tbody></table>';
		$("#conditionList").html(conditionListHtml);

	} else {
		if(activeEventConfig.conditions.length===0) {
			var newCondition = {
				conditionName : 'pressed'
			};

			activeEventConfig.conditions.push(newCondition);
		}
		conditionListHtml = '<table class="table table-striped table-hover"><thead><tr><th>Condition name</th></tr></thead><tbody>';
		for(var i in activeEventConfig.conditions) {
			conditionListHtml += '<tr>';
			conditionListHtml += '<td>'+activeEventConfig.conditions[i].conditionName+'</td>';
			conditionListHtml += '</tr>';
		}
		conditionListHtml += '</tbody></table>';
		$("#conditionList").html(conditionListHtml);
	}
}

function addCondition() {
	var newCondition = {
		conditionName : document.getElementById("inputListenerName").value
	};

	if(activeEventConfig.plugin !== "UI") {
		newCondition.condition = {
			operator : document.getElementById("selectConditionOperator").value,
			value : document.getElementById("inputConditionValue").value			
		};
	}

	activeEventConfig.conditions.push(newCondition);

	refreshConditionList();
}

function refreshEventConfig() {
	document.getElementById("txtListenerName").value = activeEventConfig.listenerName;
	document.getElementById("txtListenerIp").value = activeEventConfig.ip;
	document.getElementById("txtListenerPlugin").value = activeEventConfig.plugin;
	document.getElementById("txtListenerVariable").value = activeEventConfig.variable;
	document.getElementById("txtListenerSendData").value = activeEventConfig.sendData;

	$("#eventGroupConfig").show();
	$("#addNewEvent").hide();

	refreshConditionList();

	$('div[id^=params_]').filter(function() {
		return (/^params_/).test(this.id);
	}).each(function() {
		$("#"+this.id).hide();
	});
	
	for(var i in activeEventConfig.params) {
		document.getElementById("setting_"+activeEventConfig.plugin+"_"+i).value = activeEventConfig.params[i];
	}

	$("#params_"+activeEventConfig.plugin).show();
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