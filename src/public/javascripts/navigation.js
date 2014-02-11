var socket = io.connect();

function loadSite(siteId) {
	console.log("NAVIGATION:should now send request to load site with id:"+siteId);
	socket.emit('loadSite', siteId);
}

function restartClients() {
	socket.emit('restartClients');
}

socket.on('getSites', function(data) {
	var htmlList = '<ul class="nav navbar-nav">';
	$("#sitesNavigation").html("");
	for(var i in data) {
		htmlList+='<li><a href="site?id='+data[i]._id+'">'+data[i].name+'</a></li>';
	}
	htmlList+='</ul>';
	$("#sitesNavigation").append(htmlList);
});

$(document).ready(function(){
	console.log('NAVIGATION:siteReady');
});