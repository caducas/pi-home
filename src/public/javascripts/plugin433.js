function setplugin433Params(params) {

	document.getElementById("setting_plugin433_grpId").value = params.grpId;
	document.getElementById("setting_plugin433_deviceId").value = params.deviceId;
	document.getElementById("setting_plugin433_value").value = params.value;
}


function setParams() {
	activeTaskConfig.params = {
		"grpId" : 1,
		"deviceId" : 1,
		"value" : 1
	}
}