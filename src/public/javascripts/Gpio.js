function setGpioParams(params) {

	document.getElementById("txtParams_direction").value = params.direction;
	document.getElementById("txtParams_pin").value = params.pin;
	document.getElementById("txtParams_value").value = params.value;
}