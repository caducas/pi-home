var socket = io.connect();
var activeTaskConfig;

function configureTask(taskId) {
	socket.emit('getTaskConfig',taskId);
}

function saveTaskConfig() {
	activeTaskConfig.taskId = document.getElementById('txtTaskId').value;
	activeTaskConfig.host = document.getElementById('txtHost').value;
	activeTaskConfig.plugin = document.getElementById('pluginList').value;

	for (var i in activeTaskConfig.params) {
		activeTaskConfig.params[i] = document.getElementById("setting_"+activeTaskConfig.plugin+"_"+i).value;
	};
	socket.emit('updateTaskConfig',activeTaskConfig);
	$("#taskConfig").hide();
}

function cancelTaskConfig() {
	activeTaskConfig = null;
	$("#taskConfig").hide();
}

function refreshPluginList(pluginList) {

    var pluginListHtml = '<select class="form-control" id="pluginList">';
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
	document.getElementById("txtTaskId").value = activeTaskConfig.taskId;
	document.getElementById("txtHost").value = activeTaskConfig.host;
	document.getElementById("pluginList").value = activeTaskConfig.plugin;

	$('div[id^=params_]').filter(function() {
		return /^params_/.test(this.id);
	}).each(function() {
		$("#"+this.id).hide();
	});


	$("#taskConfig").show();

	for(var i in activeTaskConfig.params) {
		document.getElementById("setting_"+activeTaskConfig.plugin+"_"+i).value = activeTaskConfig.params[i];
	}

	$("#params_"+activeTaskConfig.plugin).show();

});

$(document).ready(function(){
   $("#saveTaskConfig").click(function() {saveTaskConfig();});
   $("#cancelTaskConfig").click(function() {cancelTaskConfig();});
	$("#taskConfig").hide();
   // $("#saveTaskConfig").hide();
});