function Gpio(gpio, direction, edge, options) {
}
exports.Gpio = Gpio;

Gpio.prototype.writeSync = function(value) {
};

Gpio.prototype.watch = function(callback) {
    callback(null,1);
};

Gpio.prototype.unwatch = function(callback) {
};

Gpio.prototype.unexport = function(callback) {
};
