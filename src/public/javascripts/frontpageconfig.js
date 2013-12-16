var socket = io.connect();
var activeFrontpageConfig;

function configureFrontendItem(id) {

	socket.emit('getFrontpageItemConfig',id);
}

function createNewFrontpageItem() {
	activeFrontpageConfig = {
		"name" : "",
		"type" : "label",
		"description" : "",
		"params" : {
			"value" : ""
		}
	};

	refreshFrontpageItemConfig();
}

function refreshFrontpageItemConfig() {
	document.getElementById("txtName").value = activeFrontpageConfig.name;
	document.getElementById("txtDescription").value = activeFrontpageConfig.description;
	document.getElementById("selectType").value = activeFrontpageConfig.type;
	showFrontpageItemParams();

	$("#frontpageItemConfig").show();
}

function showFrontpageItemParams() {
	$("#frontpageItemParams").html("");
	var paramsConfigHtml = "";
	for(var i in activeFrontpageConfig.params) {
		paramsConfigHtml += "<div class='form-group'><label class='col-lg-2 control-label' for='setting_"+i+"'>"+i+"</label>";
		paramsConfigHtml += "<div class='col-lg-10'><input type='text' id='setting_"+i+"' value='"+activeFrontpageConfig.params[i]+"' class='form-control' />";
		paramsConfigHtml += "</div></div>";
	}
	$("#frontpageItemParams").html(paramsConfigHtml);
}

function typeChanged() {
	activeFrontpageConfig.type = document.getElementById("selectType").value;

	if(activeFrontpageConfig.type==='button') {
		var params = {
			text : ""
		};
		activeFrontpageConfig.params = params;
	}
	if(activeFrontpageConfig.type==='label') {
		var params = {
			value : ""
		}
		activeFrontpageConfig.params = params;
	}

	showFrontpageItemParams();
}

function cancelFrontpageItemConfig() {
	activeFrontpageConfig = null;
	$("#frontpageItemConfig").hide();
}

function saveFrontpageItemConfig() {
	activeFrontpageConfig.name = document.getElementById("txtName").value;
	activeFrontpageConfig.description = document.getElementById("txtDescription").value;

	for(var i in activeFrontpageConfig.params) {
		activeFrontpageConfig.params[i] = document.getElementById("setting_"+i).value;
	}

	socket.emit('updateFrontpageItemConfig',activeFrontpageConfig);

}

socket.on('getFrontpageItemList', function(data) {
	var htmlList = '<div class="col-md-4"><div class="bs-example"><div class="panel panel-default"><div class="panel-heading">Frontpage-items</div></div>';
	$("#frontpageItemList").html("");
	for(var i in data) {
		htmlList+='<a href="#" class="list-group-item" onclick="configureFrontendItem(\''+data[i]._id+'\')">'+data[i].name+'</a>';
	}
	htmlList+='</div></div>';
	$("#frontpageItemList").append(htmlList);
	$("#frontpageItemConfig").hide();	
});

socket.on('getFrontpageItemConfigResult', function(data) {
	activeFrontpageConfig = data;

	refreshFrontpageItemConfig();
})


$(document).ready(function(){
   $("#saveFrontpageItemConfig").click(function() {saveFrontpageItemConfig();});
   $("#cancelFrontpageItemConfig").click(function() {cancelFrontpageItemConfig();});
   	$('#newFrontpageItem').click(function() {createNewFrontpageItem();});
	$("#frontpageItemConfig").hide();
});