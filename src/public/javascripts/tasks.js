var socket = io.connect();
var activeTaskConfig;

function configureTask(taskId) {
	socket.emit('getTaskConfig',taskId);
}

function createNewTask() {
	activeTaskConfig = {
		"taskId" : "Task-Name",
		"host" : "127.0.0.1",
		"plugin" : "",
		"params" : {
		}
	};
	refreshTaskConfig();
	pluginChanged();
}

function removeTask() {
	socket.emit('removeTask', activeTaskConfig._id);
	$("#addNewTask").show();
}

function refreshTaskConfig() {
	document.getElementById("txtTaskId").value = activeTaskConfig.taskId;
	document.getElementById("txtHost").value = activeTaskConfig.host;
	document.getElementById("pluginList").value = activeTaskConfig.plugin;

	refreshPluginParams();

	$("#taskConfig").show();
	$("#addNewTask").hide();
}

function pluginChanged() {
	activeTaskConfig.plugin = document.getElementById('pluginList').value;
	activeTaskConfig.params = {};
	
	var elements = [];
	elements.push(document.getElementsByTagName("input"));
	elements.push(document.getElementsByTagName("select"));

	var result = [];
	var checkString = "setting_"+activeTaskConfig.plugin;
	for(var i in elements) {
		var element = elements[i];
		for(var i in element) {
			var elementsId = element[i].id;
			if(elementsId !== undefined && elementsId.slice(0,checkString.length)===checkString) {
				var paramName = elementsId.slice(-((elementsId.length-(checkString.length+1))));
				activeTaskConfig.params[paramName] = "";
			}
		}
	}

	refreshPluginParams();
}

function refreshPluginParams() {

	$('div[id^=params_]').filter(function() {
		return /^params_/.test(this.id);
	}).each(function() {
		$("#"+this.id).hide();
	});

	for(var i in activeTaskConfig.params) {
		document.getElementById("setting_"+activeTaskConfig.plugin+"_"+i).value = activeTaskConfig.params[i];
	}

	$("#params_"+activeTaskConfig.plugin).show();
}

function saveTaskConfig() {
	activeTaskConfig.taskId = document.getElementById('txtTaskId').value;
	activeTaskConfig.host = document.getElementById('txtHost').value;

	for (var i in activeTaskConfig.params) {
		activeTaskConfig.params[i] = document.getElementById("setting_"+activeTaskConfig.plugin+"_"+i).value;
	};
	socket.emit('updateTaskConfig',activeTaskConfig);
	$("#taskConfig").hide();
	$("#addNewTask").show();
}

function cancelTaskConfig() {
	activeTaskConfig = null;
	$("#taskConfig").hide();
	$("#addNewTask").show();
}

function refreshPluginList(pluginList) {

    var pluginListHtml = '<select class="form-control" id="pluginList" onchange="pluginChanged()">';
    for(var i in pluginList) {
    	pluginListHtml += '<option>'+pluginList[i]+'</option>';
    }
    pluginListHtml += '</select>';
	$("#plugin").html(pluginListHtml);
}

socket.on('message', function(data) {
   addMessage(data['message'], data['pseudo']);
});

socket.on('getAvailablePlugins', function(listOfPlugins) {
	refreshPluginList(listOfPlugins);
});

socket.on('taskIdList', function(data) {
	var htmlTaskList = '<div class="col-md-4"><div class="bs-example"><div class="panel panel-default"><div class="panel-heading">Tasks</div></div>';
	$("#taskList").html("");
	for(var i in data) {
		htmlTaskList+='<a href="#" class="list-group-item" onclick="configureTask(\''+data[i].taskId+'\')">'+data[i].taskId+'</a>';
	}
	htmlTaskList+='</div></div>';
	$("#taskList").append(htmlTaskList);
});

socket.on('getTaskConfigResult', function(result) {
	activeTaskConfig = result;

	refreshTaskConfig();
});

socket.on('removedTask', function() {
	activeTaskConfig = null;
	$("#taskConfig").hide();
});

$(document).ready(function(){
   $("#saveTaskConfig").click(function() {saveTaskConfig();});
   $("#cancelTaskConfig").click(function() {cancelTaskConfig();});
   $('#addNewTask').click(function() {createNewTask();});
   	$('#removeTaskConfig').click(function() {removeTask();});
	$("#taskConfig").hide();
   // $("#saveTaskConfig").hide();
});