var socket = io.connect();
var activeContainer;

function create() {
	activeContainer = {
		"name" : "Container-Name",
		"description" : "",
		"width" : "12",
		"elements" : []
	};

	refresh();
	socket.emit('getElementNames');
}

function refresh() {
	document.getElementById("txtName").value = activeContainer.name;
	document.getElementById("txtDescription").value = activeContainer.description;
	document.getElementById("txtWidth").value = activeContainer.width;

	refreshElementsList();

	$("#containerConfig").show();
   	$('#new').hide();
}

function save() {
	activeContainer.name = document.getElementById("txtName").value;
	activeContainer.description = document.getElementById("txtDescription").value;
	activeContainer.width = document.getElementById("txtWidth").value;

	socket.emit('updateContainer',activeContainer);
   	$('#new').show();
}

function configure(id) {

	socket.emit('getContainer',id);
   	$('#new').hide();
}

function cancel() {
	activeContainer = null;
	$("#containerConfig").hide();
   	$('#new').show();
}

function remove() {
	socket.emit('removeContainer', activeContainer._id);
	$("#containerConfig").hide();
   	$('#new').show();
}

function refreshElementsList() {

    var elementsListHtml = '<table class="table table-striped table-hover"><thead><tr><th>Position</th><th>Element Name</th><th colspan="3"></th></tr></thead><tbody>';
    for(var i in activeContainer.elements) {
    	elementsListHtml += '<tr>';
    	elementsListHtml += '<td>'+activeContainer.elements[i].pos+'</td>';
    	elementsListHtml += '<td>'+activeContainer.elements[i].name+'</td>';
    	elementsListHtml += '<td><input type="button" class="btn btn-default button-config-list" value="Remove" onclick="removeElementFromContainer(' + i + ')" /></td>';
    	elementsListHtml += '<td>';
    	if(activeContainer.elements[i].pos>1) {
	    	// elementsListHtml += '<button type="button" class="btn btn-default button-config-list" onclick="moveContainerUp(' + i + ')">';
	    	// elementsListHtml += '<span class="glyphicon glyphicon-arrow-down"></span>';
	    	// elementsListHtml += '</button>';
	    	elementsListHtml += '<input type="button" class="btn btn-default button-config-list" value="Up" onclick="moveElementUp(' + i + ')" />';
	    }
    	elementsListHtml += '</td><td>';
    	if(activeContainer.elements[i].pos<activeContainer.elements.length) {
	    	elementsListHtml += '<input type="button" class="btn btn-default button-config-list" value="Down" onclick="moveElementDown(' + i + ')" />';
	    }
    	elementsListHtml += '</td>';
    	elementsListHtml += '</tr>';
    }
    elementsListHtml += '<tr><td></td><td><div id="divSelectElementName">'+$("#divSelectElementName").html()+'</div></td>';
    elementsListHtml += '<td colspan="3"><input type="button" class="btn btn-default button-config-list" value="Add" onclick="addElement()" /></td></tr>'
    elementsListHtml += '</tbody></table>';
	$("#elementsList").html(elementsListHtml);
}

function moveElementUp(id) {
	activeContainer.elements[id-1].pos = activeContainer.elements[id].pos;
	activeContainer.elements[id].pos = activeContainer.elements[id].pos-1;

	var elementCache = activeContainer.elements[id-1];

	activeContainer.elements[id-1] = activeContainer.elements[id];
	activeContainer.elements[id] = elementCache;
	refreshElementsList();
}

function moveElementDown(id) {
	activeContainer.elements[id+1].pos = activeContainer.elements[id].pos;
	activeContainer.elements[id].pos = activeContainer.elements[id].pos+1;

	var elementCache = activeContainer.elements[id+1];

	activeContainer.elements[id+1] = activeContainer.elements[id];
	activeContainer.elements[id] = elementCache;
	refreshElementsList();
}


function addElement() {
	for(var i in activeContainer.elements) {
		if(activeContainer.elements[i].name === document.getElementById("selectElementName").value) {
			alert("Element with this name is already in site!");
			return;
		}
	}
	activeContainer.elements.push({"name":document.getElementById("selectElementName").value,"pos":activeContainer.elements.length+1});

	refreshElementsList();
}

function removeElementFromContainer(pos) {
	activeContainer.elements.splice(pos,1);

	for(var i = pos; i<activeContainer.elements.length; i++) {
		activeContainer.elements[i].pos = activeContainer.elements[i].pos-1;
	}

	refreshElementsList();
}

socket.on('getContainersList', function(data) {
	var htmlList = '<div class="col-md-4"><div class="bs-example"><div class="panel panel-default"><div class="panel-heading">Containers</div></div>';
	$("#containersList").html("");
	for(var i in data) {
		htmlList+='<a href="#" class="list-group-item" onclick="configure(\''+data[i]._id+'\')">'+data[i].name+'</a>';
	}
	htmlList+='</div></div>';
	$("#containersList").append(htmlList);
	$("#containerConfig").hide();
});

socket.on('getContainer', function(data) {
	activeContainer = data;

	refresh();
});

socket.on('getElementNames', function(result) {
	var selectElementName= '<select class="form-control pull-right" id="selectElementName">';
	for(var i in result) {
		selectElementName += '<option>'+result[i].name+'</option>';
	}
	$("#divSelectElementName").html(selectElementName);
});

$(document).ready(function(){
	$("#save").click(function() {save();});
	$("#cancel").click(function() {cancel();});
	$("#remove").click(function() {remove();});
   	$('#new').click(function() {create();});
	$("#containerConfig").hide();
});