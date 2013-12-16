var socket = io.connect();

function showTest() {
	socket.emit('printTest');
}

function activatePhysicalButton() {
	socket.emit('activatePhysicalButton');
}

function uiEvent(id) {
	socket.emit('uiEvent', id);
}

socket.on('getFrontpageItems', function(result) {
	var frontpageTasksHtml = "";
	for(var i in result) {
		frontpageTasksHtml += "<div class='well'>" +result[i].description;
		if(result[i].type === 'button') {
			frontpageTasksHtml += '<input type="button" value="'+result[i].params.text+'" onclick="uiEvent(\''+result[i].name+'\')" class="btn btn-success pull-right" />';
		}
		if(result[i].type === 'label') {
			frontpageTasksHtml += "<span class='label label-info pull-right'>"+result[i].params.value+"</span>";			
		}
		frontpageTasksHtml += "</div>";
	}
	$('#tasks').html(frontpageTasksHtml);
});

$(document).ready(function(){
});