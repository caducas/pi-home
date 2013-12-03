var socket = io.connect();
var activeTaskGroupConfig;



$(document).ready(function(){
	$("#taskGroupConfig").hide();
	$("#saveTaskGroupConfig").click(function() {saveTaskGroupConfig();});
   	$("#cancelTaskGroupConfig").click(function() {cancelTaskGroupConfig();});
   	$('#removeFromTaskList').click(function() {removeFromTaskList();});
   	$("#addToTaskList").click(function() {addToTaskList();});
   	$('#newTaskGroup').click(function() {createNewTaskGroup();});
   	$('#removeTaskGroup').click(function() {removeTaskGroup();});
});

function removeTaskGroup() {
	socket.emit('removeTaskGroup', activeTaskGroupConfig._id);
}

function configureTaskGroup(taskGroupId) {
	socket.emit('getTaskGroupConfig', taskGroupId);
}

function addToTaskList() {
	var toAdd = document.getElementById("selectUnassignedTask").value;
	activeTaskGroupConfig.tasks.push(toAdd);
	refreshTaskList();
	socket.emit('updateUnassignedTaskList', activeTaskGroupConfig.tasks);
}

function removeFromTaskList() {
	var toRemove = document.getElementById("assignedTaskList").value;
	var index = activeTaskGroupConfig.tasks.indexOf(toRemove);
	activeTaskGroupConfig.tasks.splice(index,1);
	refreshTaskList();
	socket.emit('updateUnassignedTaskList', activeTaskGroupConfig.tasks);
}

function refreshTaskList() {

    var taskListHtml = '<select class="form-control" id="assignedTaskList" size="'+activeTaskGroupConfig.tasks.length+'">';
    for(var i in activeTaskGroupConfig.tasks) {
    	taskListHtml += '<option>'+activeTaskGroupConfig.tasks[i]+'</option>';
    }
    taskListHtml += '</select>';
	$("#taskList").html(taskListHtml);
}

function saveTaskGroupConfig() {
	activeTaskGroupConfig.taskGroupId = document.getElementById("txtTaskGroupId").value;
	socket.emit('updateTaskGroupConfig',activeTaskGroupConfig);
	$("#taskGroupConfig").hide();
}

function cancelTaskGroupConfig() {
	activeTaskGroupConfig = null;
	$("#taskGroupConfig").hide();
}

function createNewTaskGroup() {
	activeTaskGroupConfig = {
			taskGroupId : "",
			tasks : []
	};
	socket.emit('updateUnassignedTaskList');

	showTaskGroupConfig();

}

function showTaskGroupConfig() {
	document.getElementById("txtTaskGroupId").value = activeTaskGroupConfig.taskGroupId;

	refreshTaskList();

	$("#taskGroupConfig").show();
}

socket.on('taskGroupsIdList', function(data) {
	var htmlTaskList = '<div class="col-md-4"><div class="bs-example"><div class="panel panel-default"><div class="panel-heading">Taskgroups</div></div>';
	$("#taskGroupList").html("");
	for(var i in data) {
		htmlTaskList+='<a href="#" class="list-group-item" onclick="configureTaskGroup(\''+data[i].taskGroupId+'\')">'+data[i].taskGroupId+'</a>';
	}
	htmlTaskList+='</div></div>';
	$("#taskGroupList").append(htmlTaskList);
});


socket.on('getTaskGroupConfigResult', function(result) {
	activeTaskGroupConfig = result;

	showTaskGroupConfig();
});

socket.on('getUnassignedTaskList', function(result) {
	var unassignedTaskListHtml = '<select class="form-control pull-right" id="selectUnassignedTask">';
	for(var i in result) {
		unassignedTaskListHtml += '<option>'+result[i].taskId+'</option>';
	}
	$("#unassignedTaskList").html(unassignedTaskListHtml);
});

socket.on('removedTaskGroup', function() {
	cancelTaskGroupConfig();
});
