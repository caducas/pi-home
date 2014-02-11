var socket = io.connect();
var activeSite;

function createSite() {
	activeSite = {
		"name" : "Site-Name",
		"description" : "",
		"containers" : []
	};

	refreshSite();
}

function refreshSite() {
	document.getElementById("txtName").value = activeSite.name;
	document.getElementById("txtDescription").value = activeSite.description;
	refreshContainersList();
	socket.emit('getContainerNames');

	$("#siteConfig").show();
	$("#newSite").hide();
}

function saveSite() {
	activeSite.name = document.getElementById("txtName").value;
	activeSite.description = document.getElementById("txtDescription").value;

	socket.emit('updateSite',activeSite);
	$("#newSite").show();
}

function configureSite(id) {

	socket.emit('getSite',id);
}

function cancelSite() {
	activeSite = null;
	$("#siteConfig").hide();
	$("#newSite").show();
}

function removeSite() {
	socket.emit('removeSite', activeSite._id);
	$("#siteConfig").hide();
	$("#newSite").show();
}

function refreshContainersList() {

	var containersListHtml = '<table class="table table-striped table-hover"><thead><tr><th>Position</th><th>Container Name</th><th colspan="3"></th></tr></thead><tbody>';
	for(var i in activeSite.containers) {
		containersListHtml += '<tr>';
		containersListHtml += '<td>'+activeSite.containers[i].pos+'</td>';
		containersListHtml += '<td>'+activeSite.containers[i].name+'</td>';
		containersListHtml += '<td>';
		if(activeSite.containers[i].pos>1) {
			containersListHtml += '<button type="button" class="btn btn-default button-config-list" onclick="moveContainerUp(' + i + ')"><span class="glyphicon glyphicon-arrow-up"></span></button>';
		}
		containersListHtml += '</td><td>';
		if(activeSite.containers[i].pos<activeSite.containers.length) {
			containersListHtml += '<button type="button" class="btn btn-default button-config-list" onclick="moveContainerDown(' + i + ')"><span class="glyphicon glyphicon-arrow-down"></span></button>';
		}
		containersListHtml += '</td>';
		containersListHtml += '<td><button type="button" class="btn btn-default button-config-list" onclick="removeContainerFromSite(' + i + ')"><span class="glyphicon glyphicon-trash"></span></button>';
		containersListHtml += '</tr>';
	}
    containersListHtml += '<tr><td></td><td><div id="divSelectContainerName">'+$("#divSelectContainerName").html()+'</div></td>';
    containersListHtml += '<td colspan="3"><button type="button" class="btn btn-default button-config-list" onclick="addContainer()"><span class="glyphicon glyphicon-plus"></span></button></td></tr>';
    containersListHtml += '</tbody></table>';
	$("#containersList").html(containersListHtml);
}

function removeContainerFromSite(pos) {
	activeSite.containers.splice(pos,1);

	for(var i = pos; i<activeSite.containers.length; i++) {
		activeSite.containers[i].pos = activeSite.containers[i].pos-1;
	}

	refreshContainersList();
}

function addContainer() {
	for(var i in activeSite.containers) {
		if(activeSite.containers[i].name === document.getElementById("selectContainerName").value) {
			alert("Container with this name is already in site!");
			return;
		}
	}
	activeSite.containers.push({"name":document.getElementById("selectContainerName").value,"pos":activeSite.containers.length+1});

	refreshContainersList();
}

function moveContainerUp(id) {
	activeSite.containers[id-1].pos = activeSite.containers[id].pos;
	activeSite.containers[id].pos = activeSite.containers[id].pos-1;

	var containerCache = activeSite.containers[id-1];

	activeSite.containers[id-1] = activeSite.containers[id];
	activeSite.containers[id] = containerCache;
	refreshContainersList();
}

function moveContainerDown(id) {
	activeSite.containers[id+1].pos = activeSite.containers[id].pos;
	activeSite.containers[id].pos = activeSite.containers[id].pos+1;

	var containerCache = activeSite.containers[id+1];

	activeSite.containers[id+1] = activeSite.containers[id];
	activeSite.containers[id] = containerCache;
	refreshContainersList();
}

socket.on('getSitesList', function(data) {
	var htmlList = '<div class="col-md-4"><div class="bs-example"><div class="panel panel-default"><div class="panel-heading">Sites</div></div>';
	$("#sitesList").html("");
	for(var i in data) {
		htmlList+='<a href="#" class="list-group-item" onclick="configureSite(\''+data[i]._id+'\')">'+data[i].name+'</a>';
	}
	htmlList+='</div></div>';
	$("#sitesList").append(htmlList);
	$("#siteConfig").hide();
});

socket.on('getContainerNames', function(result) {
	var selectContainerName= '<select class="form-control pull-right" id="selectContainerName">';
	for(var i in result) {
		selectContainerName += '<option>'+result[i].name+'</option>';
	}
	$("#divSelectContainerName").html(selectContainerName);

});

socket.on('getSite', function(data) {
	activeSite = data;

	refreshSite();
});

$(document).ready(function(){
	$("#saveSite").click(function() {saveSite();});
	$("#cancelSite").click(function() {cancelSite();});
	$("#removeSite").click(function() {removeSite();});
	$('#newSite').click(function() {createSite();});
	$("#siteConfig").hide();
});