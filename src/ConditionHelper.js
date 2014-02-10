function checkCondition(value, condition) {
	console.log("checks condition");

	if(condition.operator==='=') {
		if(value===condition.value || value.toString() === condition.value.toString()) {
			return true;
		}
		return false;
	}

	if(condition.operator==='!=') {
		if(value!==condition.value) {
			return true;
		}
		return false;
	}

	if(condition.operator==='<') {
		if(value<condition.value) {
			return true;
		}
		return false;
	}

	if(condition.operator==='>') {
		if(value>condition.value) {
			return true;
		}
		return false;
	}

	if(condition.operator==='<=') {
		if(value<=condition.value) {
			return true;
		}
		return false;
	}

	if(condition.operator==='>=') {
		if(value>=condition.value) {
			return true;
		}
		return false;
	}
}

if(typeof exports !== 'undefined') {
	exports.checkCondition = checkCondition;
}
