function test() {
	return 2;
}

// If we're running under Node, 
if(typeof exports !== 'undefined') {
	exports.test = test;
}