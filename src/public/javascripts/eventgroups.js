var socket = io.connect();
var activeEventGroupConfig;


$(document).ready(function(){
	$("#eventGroupConfig").hide();
   	$("#cancelEventGroupConfig").click(function() {cancelEventGroupConfig();});
   	$("#saveEventGroupConfig").click(function() {saveEventGroupConfig();});
   	$('#newEventGroup').click(function() {createNewEventGroup();});
   	$('#removeEventGroup').click(function() {removeEventGroup();});
});

function createNewEventGroup() {
	activeEventGroupConfig = {
			eventGroupId : "",
			events : [],
			taskGroups : []
	};

	socket.emit('getTaskGroupNames');

	showEventGroupConfig();
	$("#newEventGroup").hide();
}

function cancelEventGroupConfig() {
	activeEventGroupConfig = null;
	$("#eventGroupConfig").hide();
	$("#newEventGroup").show();
}

function removeEventGroup() {
	socket.emit('removeEventGroup', activeEventGroupConfig._id);
}

function configureEventGroup(eventGroupId) {
	socket.emit('getEventGroupConfig', eventGroupId);
}

function showEventGroupConfig() {
	document.getElementById("txtEventGroupId").value = activeEventGroupConfig.eventGroupId;

	refreshEventList();
	// socket.emit('getListenerNames');

	refreshTaskGroupList();
	// socket.emit('getTaskGroupNames');

	$("#eventGroupConfig").show();
	$("#newEventGroup").hide();
}

function removeEventFromEventGroup(pos) {
	activeEventGroupConfig.events.splice(pos,1);

	refreshEventList();
}

function removeTaskGroupFromEventGroup(pos) {
	activeEventGroupConfig.taskGroups.splice(pos,1);

	refreshTaskGroupList();
}

function refreshEventList() {

    var eventListHtml = '<table class="table table-striped table-hover"><thead><tr><th>Listener name</th><th>Condition name</th><th>Delay (ms)</th><th></th></tr></thead><tbody>';
    for(var i in activeEventGroupConfig.events) {
    	eventListHtml += '<tr>';
    	eventListHtml += '<td class="config-table-list-content">'+activeEventGroupConfig.events[i].listenerName+'</td>';
    	eventListHtml += '<td class="config-table-list-content">'+activeEventGroupConfig.events[i].conditionName+'</td>';
    	eventListHtml += '<td class="config-table-list-content">'+activeEventGroupConfig.events[i].timeDifference+'</td>';
    	eventListHtml += '<td><input type="button" class="btn btn-default button-config-list" value="Remove" onclick="removeEventFromEventGroup(' + i + ')" /></td>';
    	eventListHtml += '</tr>';
    }
    eventListHtml += '<tr><td><div id="divSelectListenerName"></div></td>';
    eventListHtml += '<td><div id="divSelectConditionName"></div></td>';
    eventListHtml += '<td><input type="text" id="inputTimeDifference" value="0" class="form-control" /></td>';
    eventListHtml += '<td><input type="button" class="btn btn-default button-config-list" value="Add" onclick="addEvent()" /></td></tr>'
    eventListHtml += '</tbody></table>';
	$("#eventList").html(eventListHtml);

	socket.emit('getListenerNames');
}

function refreshTaskGroupList() {

    var taskGroupListHtml = '<table class="table table-striped table-hover"><thead><tr><th>TaskGroup Id</th><th></th></tr></thead><tbody>';
    for(var i in activeEventGroupConfig.taskGroups) {
    	taskGroupListHtml += '<tr>';
    	taskGroupListHtml += '<td class="config-table-list-content">'+activeEventGroupConfig.taskGroups[i]+'</td>';
    	taskGroupListHtml += '<td><input type="button" class="btn btn-default button-config-list" value="Remove" onclick="removeTaskGroupFromEventGroup(' + i + ')" /></td>';
    	taskGroupListHtml += '</tr>';
    }
    taskGroupListHtml += '<tr><td><div id="divSelectTaskGroupName"></div></td>';
    taskGroupListHtml += '<td><input type="button" class="btn btn-default button-config-list" value="Add" onclick="addTaskGroup()" /></td></tr>'
    taskGroupListHtml += '</tbody></table>';
	$("#taskGroupList").html(taskGroupListHtml);
	
	socket.emit('getTaskGroupNames');
}

function selectListenerNameChanged() {
	socket.emit('getConditionNames', document.getElementById("selectListenerName").value);
}

function addEvent() {
	for(var i in activeEventGroupConfig.events) {
		if(activeEventGroupConfig.events[i].listenerName === document.getElementById("selectListenerName").value && activeEventGroupConfig.events[i].conditionName === document.getElementById("selectConditionName").value) {
			alert("Event with this listenerName and conditionName is already in eventGroup!");
			return;
		}
	}
	var newEvent = {
		listenerName : document.getElementById("selectListenerName").value,
		conditionName : document.getElementById("selectConditionName").value,
		timeDifference : document.getElementById("inputTimeDifference").value
	}
	activeEventGroupConfig.events.push(newEvent);

	refreshEventList();
	showEventGroupConfig();
}

function addTaskGroup() {
	for(var i in activeEventGroupConfig.taskGroups) {
		if(activeEventGroupConfig.taskGroups[i] === document.getElementById("selectTaskGroupName").value) {
			alert("TaskGroup with this ID is already in eventGroup!");
			return;
		}
	}
	activeEventGroupConfig.taskGroups.push(document.getElementById("selectTaskGroupName").value);

	refreshTaskGroupList();
}

function saveEventGroupConfig() {
	activeEventGroupConfig.eventGroupId = document.getElementById("txtEventGroupId").value;
	socket.emit('updateEventGroupConfig',activeEventGroupConfig);
	$("#eventGroupConfig").hide();
	$("#newEventGroup").show();
}

socket.on('eventGroupsIdList', function(data) {
	var html = '<div class="col-md-4"><div class="bs-example"><div class="panel panel-default"><div class="panel-heading">Eventgroups</div></div>';
	$("#eventGroupList").html("");
	for(var i in data) {
		html+='<a href="#" class="list-group-item" onclick="configureEventGroup(\''+data[i].eventGroupId+'\')">'+data[i].eventGroupId+'</a>';
	}
	html+='</div></div>';
	$("#eventGroupList").append(html);
});

socket.on('getEventGroupConfigResult', function(result) {
	activeEventGroupConfig = result;

	showEventGroupConfig();
});

socket.on('getListenerNames', function(result) {
	var selectListenerName= '<select class="form-control pull-right" id="selectListenerName" onChange="selectListenerNameChanged()">';
	for(var i in result) {
		selectListenerName += '<option>'+result[i]+'</option>';
	}
	$("#divSelectListenerName").html(selectListenerName);

	socket.emit('getConditionNames', document.getElementById("selectListenerName").value);

});

socket.on('getConditionNames', function(result) {
	var selectConditionName = '<select class="form-control pull-right" id="selectConditionName">';
	for(var i in result) {
		selectConditionName += '<option>'+result[i]+'</option>';
	}

	$("#divSelectConditionName").html(selectConditionName);
})

socket.on('removedEventGroup', function() {
	cancelEventGroupConfig();
});

socket.on('getTaskGroupNames', function(result) {
	var selectTaskGroupName= '<select class="form-control pull-right" id="selectTaskGroupName">';
	for(var i in result) {
		selectTaskGroupName += '<option>'+result[i].taskGroupId+'</option>';
	}
	$("#divSelectTaskGroupName").html(selectTaskGroupName);

});


