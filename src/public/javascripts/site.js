var socket = io.connect();
var site = {
	name : "",
	description : "",
	containers : []
};

function uiEvent(id) {
	socket.emit('uiEvent', id);
}

function refreshSite() {
	var containersHtml = "<div class='row'>";
	var currentWidth = 0;

	for(var i in site.containers) {
		if((currentWidth +  parseInt(site.containers[i].container.width))>12) {
			containersHtml += "</div><div class='row'>";
			currentWidth = 0;
		}
		currentWidth = currentWidth +  parseInt(site.containers[i].container.width);

		containersHtml += "<div class='col-lg-"+site.containers[i].container.width+"'>";
		containersHtml += "<div class='well'><div class='well-header'>"+site.containers[i].name+"</div>" +site.containers[i].container.description;

		for(var j in site.containers[i].container.elements) {
			var element = site.containers[i].container.elements[j].element;
			if(element === undefined) {
				continue;
			};

			if(element.type === 'button') {
				containersHtml += '<input type="button" value="'+element.params.text+'" onclick="uiEvent(\''+element.name+'\')" class="btn btn-success pull-right" />';
			}
			if(element.type === 'label') {
				try {
					if(element.params.value !== 'undefined' && element.params.value.length > 0) {
						containersHtml += "<div id='value_"+element.params.variable+"' class='pull-right'><h2>"+element.params.value+"</h2></div>";
					}
				} catch(err) {
				}
				try {
					if(element.params.variable !== 'undefined' && element.params.variable.length > 0) {
						containersHtml += "<div id='variable_"+element.params.variable+"' class='pull-right'></div>";
						socket.emit('getVariableValue', element.params.variable);
					} else {
						throw "variable not defined";
					}
				} catch(err) {
				}
			}

			if(element.type !== 'button' && element.type !== 'label') {
				containersHtml += "<div id='" + element.type + element.name + "' class='pull-right'></div>";
				socket.emit('getFrontpageItem', element);
				if(element.params.refresh>0) {
					refreshElement(element.type+element.name, element.params.refresh);				
				}
			}

		}

		containersHtml += "<div style='clear: both;''></div>";
		containersHtml += "</div></div>";	
	}
	containersHtml += "</div>";
	$('#containers').html(containersHtml);

}

function refreshElement(elementName, interval) {
	setInterval(function()
	{
		$('#'+elementName).html(document.getElementById(elementName).innerHTML);
	}, interval);
}

socket.on('getFrontpageItems', function(result) {
	var containersHtml = "";
	for(var i in result) {
		containersHtml += "<div class='col-lg-"+result[i].width+"'><div class='well'><div class='well-header'>Test-Header</div>" +result[i].description;
		containersHtml += "<div style='clear: both;''></div>";
		containersHtml += "</div></div>";
	}
	$('#containers').html(containersHtml);
});

socket.on('getFrontpageItem', function(item, frontpageItem) {
	var frontpageItemHtml = frontpageItem;
	frontpageItemHtml += "<div style='clear: both;''></div>";
	$("#"+item.type + item.name).html(frontpageItemHtml);
});

socket.on('getSite', function(data) {
	site = data;
	refreshSite();
});

socket.on('getContainer', function(data) {
	for(var i in site.containers) {
		if(site.containers[i].name === data.name) {
			site.containers[i].container = data;
		}
	}
	refreshSite();
});

socket.on('getElement', function(data) {
	for(var i in site.containers) {
		try{
			for(var j in site.containers[i].container.elements) {
				if(site.containers[i].container.elements[j].name === data.name) {
					site.containers[i].container.elements[j].element = data;
				}
			}
		} catch(err) {
		}
	}
	refreshSite();
});


socket.on('updateVariable', function(variable) {
	var htmlContent = "<h2>"+variable.value+"</h2>";
	// document.getElementById("variable_#WFROG_temperature_inside").html(htmlContent);
	$("#variable_"+variable.name).html(htmlContent);
	// document.getElementById("variable_"+variable.name).textContent = variable.value;
});

$(document).ready(function(){
});