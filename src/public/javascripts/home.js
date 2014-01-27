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
		frontpageTasksHtml += "<div class='well'><div class='well-header'>Test-Header</div>" +result[i].description;
		console.log(result[i]);
		if(result[i].type === 'button') {
			frontpageTasksHtml += '<input type="button" value="'+result[i].params.text+'" onclick="uiEvent(\''+result[i].name+'\')" class="btn btn-success pull-right" />';
		}
		if(result[i].type === 'label') {
			try {
				if(result[i].params.value !== 'undefined' && result[i].params.value.length > 0) {
					frontpageTasksHtml += "<div id='value_"+result[i].params.variable+"' class='pull-right'><h2>"+result[i].params.value+"</h2></div>";
				}
			} catch(err) {
			}
			try {
				if(result[i].params.variable !== 'undefined' && result[i].params.variable.length > 0) {
					frontpageTasksHtml += "<div id='variable_"+result[i].params.variable+"' class='pull-right'></div>";
					// frontpageTasksHtml += "<span class='label label-info pull-right' id='value_"+result[i].params.variable+"'>"+result[i].params.value+"</span><span class='label label-info pull-right' id='variable_"+result[i].params.variable+"'></span>";
					socket.emit('getVariableValue', result[i].params.variable);
				} else {
					throw "variable not defined";
				}
			} catch(err) {
			}
		}

		if(result[i].type !== 'button' && result[i].type !== 'label') {
			frontpageTasksHtml += "<div id='" + result[i].type + result[i].name + "' class='pull-right'></div>";
			socket.emit('getFrontpageItem', result[i]);			
		}
		
		frontpageTasksHtml += "<div style='clear: both;''></div>";
		frontpageTasksHtml += "</div>";
	}
	$('#tasks').html(frontpageTasksHtml);
});

socket.on('updateVariable', function(variable) {
	var htmlContent = "<h2>"+variable.value+"</h2>";
	// document.getElementById("variable_#WFROG_temperature_inside").html(htmlContent);
	$("#variable_"+variable.name).html(htmlContent);
	// document.getElementById("variable_"+variable.name).textContent = variable.value;
});

socket.on('getFrontpageItem', function(item, frontpageItem) {
	var frontpageItemHtml = frontpageItem;
	frontpageItemHtml += "<div style='clear: both;''></div>";
	$("#"+item.type + item.name).html(frontpageItemHtml);
});

$(document).ready(function(){
});