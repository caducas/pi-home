alert("Test");
var socket = io.connect();

function showTest() {
	socket.emit('printTest');
   //alert("Pressed");
}

function addMessage(msg, pseudo) {
   // $("#chatEntries").append('<div class="message"><p>' + pseudo + ' : ' + msg + '</p></div>');
   $("#chatEntries").append('<tr><td>Test</td><td>Button</td></tr>');
}

function addTaskToList() {
	$("#taskList").append('<tr><td>Test</td><td>Button</td></tr>');
}

function loadTasks() {
	$("#tasks").append('<tr><td>Test</td><td>Button</td></tr>');
}

function configureTask(taskId) {
	// alert("configure task with id ");
	alert("configure task with id " + taskId);
}

$(document).ready(function(){
   $("#testSet").click(function() {showTest();});
});

socket.on('message', function(data) {
	alert("message received");
   addMessage(data['message'], data['pseudo']);
});

socket.on('taskIdList', function(data) {
	$("#taskList").html("");
	for(var i in data) {
		$("#taskList").append('<tr><td>' + data[i].taskId + '</td><td><button onclick="configureTask(\''+data[i].taskId+'\')">Configure</button></td></tr>');
	}
});

