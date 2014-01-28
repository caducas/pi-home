var socket = io.connect();
var activeTaskGroupConfig;

function removeTaskGroup() {
	socket.emit('removeTaskGroup', activeTaskGroupConfig._id);
}

function configureTaskGroup(taskGroupId) {
	socket.emit('getTaskGroupConfig', taskGroupId);
}

function addTask() {
	var toAdd = document.getElementById("selectUnassignedTask").value;

	for(var i in activeTaskGroupConfig.tasks) {
		if(activeTaskGroupConfig.tasks[i] === toAdd) {
			alert("Task is already in taskGroup!");
			return;
		}
	}
	activeTaskGroupConfig.tasks.push(toAdd);

	refreshTaskList();
	socket.emit('updateUnassignedTaskList', activeTaskGroupConfig.tasks);
}

function removeTaskFromTaskGroup(pos) {
	activeTaskGroupConfig.tasks.splice(pos,1);

	refreshTaskList();
}

function refreshTaskList() {


    var taskListHtml = '<table class="table table-striped table-bordered table-hover"><thead><tr><th>Task</th><th>Remove</th></tr></thead><tbody>';
    for(var i in activeTaskGroupConfig.tasks) {
    	taskListHtml += '<tr>';
    	taskListHtml += '<td>'+activeTaskGroupConfig.tasks[i]+'</td>';
    	taskListHtml += '<td><input type="button" class="btn btn-default" value="Remove" onclick="removeTaskFromTaskGroup(' + i + ')" /></td>';
    	taskListHtml += '</tr>';
    }
    taskListHtml += '</tbody></table>';
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
	$("#divSelectTaskName").html(unassignedTaskListHtml);
});

socket.on('removedTaskGroup', function() {
	cancelTaskGroupConfig();
});

$(document).ready(function(){
	$("#taskGroupConfig").hide();
	$("#saveTaskGroupConfig").click(function() {saveTaskGroupConfig();});
   	$("#cancelTaskGroupConfig").click(function() {cancelTaskGroupConfig();});
   	$("#addTask").click(function() {addTask();});
   	$('#newTaskGroup').click(function() {createNewTaskGroup();});
   	$('#removeTaskGroup').click(function() {removeTaskGroup();});
});