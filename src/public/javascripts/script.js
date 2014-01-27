var socket = io.connect();

function showTest() {
	socket.emit('printTest');
   alert("Pressed");
}

function activatePhysicalButton() {
	socket.emit('activatePhysicalButton');
}

$(document).ready(function(){
});


