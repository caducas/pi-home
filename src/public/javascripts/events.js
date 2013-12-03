var socket = io.connect();
var activeEventConfig;


function configureEvent(eventId) {
	socket.emit('getEventConfig',eventId);
}

function removeConditionFromEventListener(pos) {

	activeEventConfig.conditions.splice(pos,1);

	refreshConditionList();
}

function cancelEventListenerConfig() {
	activeEventConfig = null;
	$("#eventGroupConfig").hide();
}

function saveEventListenerConfig() {
	alert(activeEventConfig.listenerName);
	activeEventConfig.listenerName = document.getElementById("txtListenerName").value;
	alert(activeEventConfig.listenerName);
	activeEventConfig.ip = document.getElementById("txtListenerIp").value;
	alert(activeEventConfig.ip);
	activeEventConfig.plugin = document.getElementById("txtListenerPlugin").value;
	alert(activeEventConfig.plugin);

	for(var i in activeEventConfig.params) {
		activeEventConfig.params[i] = document.getElementById("setting_"+activeEventConfig.plugin+"_"+i).value;
	}

	socket.emit('updateEventListenerConfig',activeEventConfig);
	$("#eventGroupConfig").hide();
}

function refreshPluginList(pluginList) {

    var pluginListHtml = '<select class="form-control" id="txtListenerPlugin">';
    for(var i in pluginList) {
    	pluginListHtml += '<option>'+pluginList[i]+'</option>';
    }
    pluginListHtml += '</select>';
	$("#plugin").html(pluginListHtml);
}

function refreshConditionList() {

	if(activeEventConfig.plugin !== "UI") {
	    var conditionListHtml = '<table class="table table-striped table-bordered table-hover"><thead><tr><th>Condition name</th><th>Operator</th><th>value</th><th>Remove</th></tr></thead><tbody>';
	    for(var i in activeEventConfig.conditions) {
	    	conditionListHtml += '<tr>';
	    	conditionListHtml += '<td>'+activeEventConfig.conditions[i].conditionName+'</td>';
	    	conditionListHtml += '<td>'+activeEventConfig.conditions[i].condition.operator+'</td>';
	    	conditionListHtml += '<td>'+activeEventConfig.conditions[i].condition.value+'</td>';
	    	conditionListHtml += '<td><input type="button" class="btn btn-default" value="Remove" onclick="removeConditionFromEventListener(' + i + ')" /></td>';
	    	conditionListHtml += '</tr>';
	    }
	    conditionListHtml += '</tbody></table>';
		$("#conditionList").html(conditionListHtml);
	} else {
	    var conditionListHtml = '<table class="table table-striped table-bordered table-hover"><thead><tr><th>Condition name</th></tr></thead><tbody>';
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
		conditionName : document.getElementById("inputListenerName").value,
		condition : {
			operator : document.getElementById("selectConditionOperator").value,
			value : document.getElementById("inputConditionValue").value
		}
	};

	activeEventConfig.conditions.push(newCondition);

	refreshConditionList();

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
});

socket.on('getAvailablePlugins', function(listOfPlugins) {
	refreshPluginList(listOfPlugins);
});

$(document).ready(function(){
   $("#saveEventListenerConfig").click(function() {saveEventListenerConfig();});
   $("#cancelEventListenerConfig").click(function() {cancelEventListenerConfig();});
   $("#eventGroupConfig").hide();
});