
function hasEvent() {
	return false;
}

function execute(opts) {
}

function listenEvent(eventId, opts) {
}

function getFrontpageItem(item, callback) {
	var frontpageItemContent = "<img style='-webkit-user-select: none' width='"+item.params.width+"' height='"+item.params.height+"' src='http://"+item.params.ip+"/snapshot.cgi?user="+item.params.username+"&amp;pwd="+item.params.password+"' />"
	callback(frontpageItemContent);
}

function getEmptyConfigParams() {
	var params = {
		ip : "172.0.0.1",
		username : "",
		password : "",
		width : 320,
		height : 240,
		refresh : 0
	}
	return params;
}


// If we're running under Node, 
if(typeof exports !== 'undefined') {
	exports.getFrontpageItem = getFrontpageItem;
	exports.hasEvent = hasEvent;
	exports.getEmptyConfigParams = getEmptyConfigParams;
}