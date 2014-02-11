var socket = io.connect();

socket.on('getUIEventElementsResult', function(data) {
	var uiElementsHtml = '<select class="form-control" id="setting_UI_uiName">';
	for(var i in data) {
		uiElementsHtml += '<option>'+data[i].name+'</option>';
	}
	uiElementsHtml += '</select>';
	$("#uiName").html(uiElementsHtml);
});

$(document).ready(function(){
	socket.emit('getUIEventElements');
});