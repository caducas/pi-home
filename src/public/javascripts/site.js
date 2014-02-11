var socket = io.connect();
var site = {
	name : "",
	description : "",
	containers : []
};

function uiEvent(id) {
	socket.emit('uiEvent', id);
}

function radiobuttonChange(id, value) {
	uiEvent(id+'_'+value);

	changeRadiobuttonSelectedValue(id, value);
}

function changeRadiobuttonSelectedValue(id, value) {

	if(value === 'on') {
		$('#radio-view-'+id+'-on-label').addClass('ui-btn-active');
		$('#radio-view-'+id+'-off-label').removeClass('ui-btn-active');
	}

	if(value === 'off') {
		$('#radio-view-'+id+'-off-label').addClass('ui-btn-active');
		$('#radio-view-'+id+'-on-label').removeClass('ui-btn-active');
	}

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
		containersHtml += "<div class='well'><div class='well-header well-header-site'>"+site.containers[i].name+"</div>" +site.containers[i].container.description;

		for(var j in site.containers[i].container.elements) {
			var element = site.containers[i].container.elements[j].element;
			if(element === undefined) {
				continue;
			}

			if(element.type === 'button') {
				containersHtml += '<input type="button" value="'+element.params.text+'" onclick="uiEvent(\''+element.name+'\')" class="btn btn-success pull-right" />';
			}
			if(element.type === 'onOffSwitch') {
				var switchOnClass = "";
				var switchOffClass = "";
				switchOnClass += " switch_variable_"+element.params.variable+"_active_on_"+element.params.onValue;
				switchOnClass += " switch_variable_"+element.params.variable+"_deactive_on_"+element.params.offValue;
				switchOffClass += " switch_variable_"+element.params.variable+"_active_on_"+element.params.offValue;
				switchOffClass += " switch_variable_"+element.params.variable+"_deactive_on_"+element.params.onValue;
				containersHtml += '<fieldset data-role="controlgroup" data-type="horizontal" class="ui-controlgroup ui-controlgroup-horizontal ui-corner-all">';
				containersHtml += '<div class="ui-controlgroup-controls">';
				containersHtml += '<div class="ui-radio">';
				containersHtml += '<label data-form="ui-btn-up-b" class="ui-btn ui-corner-all ui-btn-b ui-radio-on ui-first-child'+switchOnClass+'" id="radio-view-'+element.name+'-on-label" onclick="radiobuttonChange(\''+element.name+'\',\'on\');">'+element.params.onText+'</label>';
				// containersHtml += '<input type="radio" data-theme="b" name="radio-view-'+element.name+'" id="radio-view-'+element.name+'-on" value="list" checked="checked" onchange="radiobuttonChange(\''+element.name+'\',\'on\');">';
				containersHtml += '</div>';
				containersHtml += '<div class="ui-radio">';
				containersHtml += '<label for="radio-view-'+element.name+'-off" data-form="ui-btn-up-b" class="ui-btn ui-corner-all ui-btn-b ui-radio-off ui-btn-active ui-last-child'+switchOffClass+'" id="radio-view-'+element.name+'-off-label" onclick="radiobuttonChange(\''+element.name+'\',\'off\');">'+element.params.offText+'</label>';
				// containersHtml += '<input type="radio" data-theme="b" name="radio-view-'+element.name+'" id="radio-view-'+element.name+'-off" value="grid" onchange="radiobuttonChange(\''+element.name+'\',\'off\');">';
				containersHtml += '</div>';
				containersHtml += '</div>';
				containersHtml += '</fieldset>';

				
				// containersHtml += '<form><label for="flip-checkbox">Flip toggle switch checkbox:</label><input type="checkbox" data-role="flipswitch" name="flip-checkbox" id="flip-checkbox" data-on-text="'+element.params.onText+'" data-off-text="'+element.params.offText+'" data-wrapper-class="custom-label-flipswitch"></form>';
			}

			if(element.type === 'label') {
				containersHtml += "<div class='pull-right'>";
				try {
					if(element.params.value !== 'undefined' && element.params.value.length > 0) {
						containersHtml += "<div id='value_"+element.params.variable+"' class='pull-right'><h2>"+element.params.value+"</h2></div>";
					}
				} catch(err) {
				}
				try {
					if(element.params.variable !== 'undefined' && element.params.variable.length > 0) {
						containersHtml += "<div id='variable_"+element.params.variable+"' class='pull-right'></div>";
						console.log('SITE: sending request for variable '+element.params.variable);
						socket.emit('getVariableValue', element.params.variable);
					} else {
						throw "variable not defined";
					}
				} catch(err) {
				}
				try {
					if(element.description !== 'undefined' && element.description.length > 0) {
						containersHtml += "<div id='description_"+element.params.variable+"' class='pull-right'><h2>"+element.description+"</h2></div>";
					}
				} catch(err) {
				}
				containersHtml += "</div>";
			}

			if(element.type !== 'button' && element.type !== 'label') {
				containersHtml += "<div id='" + element.type + element.name + "' class='pull-right'></div>";
				socket.emit('getFrontpageItem', element);
				if(element.params.refresh>0) {
					if(element.type==='IPcam') {
						refreshPicture('IPcam_view_screenshot', element.params.refresh);
					} else {
						refreshElement(element.type+element.name, element.params.refresh);	
					}		
				}
			}
			containersHtml += "<br />";

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
		$("#myimg").attr("src", "/myimg.jpg");
		$('#'+elementName).html(document.getElementById(elementName).innerHTML);
	}, interval);
}

function refreshPicture(elementName, interval) {
	setInterval(function()
	{
		if(document.getElementById(elementName)!== null) {
			var url = document.getElementById(elementName).src;
			document.getElementById(elementName).src = url;
		}
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
	console.log('SITE: updateVariable from Frontend, variable:' + variable.name + ' value:' + variable.value);
	var htmlContent = "<h2>"+variable.value+"</h2>";
	// document.getElementById("variable_#WFROG_temperature_inside").html(htmlContent);
	$("#variable_"+variable.name).html(htmlContent);
	$(".switch_variable_"+variable.name+"_active_on_"+variable.value).addClass('ui-btn-active');
	$(".switch_variable_"+variable.name+"_deactive_on_"+variable.value).removeClass('ui-btn-active');

	// document.getElementById("variable_"+variable.name).textContent = variable.value;
});

$(document).ready(function(){
});