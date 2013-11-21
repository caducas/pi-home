
var assert = require('chai').assert;
var sinon = require('sinon');

describe('ConditionHelper', function(){

	it("checks that method 'checkCondition' returns correctly", function() {

		//preparation
		var conditionHelper = require(__dirname + '/../src/ConditionHelper');

		//assertion
		assert(conditionHelper.checkCondition(1,{"operator":"=","value":1}), "= operator does not return correct result");
		assert(conditionHelper.checkCondition(2,{"operator":"=","value":2}), "= operator does not return correct result");
		assert(!conditionHelper.checkCondition(2,{"operator":"=","value":3}), "= operator does not return correct result");
		assert(conditionHelper.checkCondition(2,{"operator":"!=","value":1}), "!= operator does not return correct result");
		assert(conditionHelper.checkCondition(3,{"operator":"!=","value":0}), "!= operator does not return correct result");
		assert(!conditionHelper.checkCondition(2,{"operator":"!=","value":2}), "!= operator does not return correct result");
		assert(conditionHelper.checkCondition(0,{"operator":"<","value":1}), "< operator does not return correct result");
		assert(conditionHelper.checkCondition(499,{"operator":"<","value":500}), "< operator does not return correct result");
		assert(!conditionHelper.checkCondition(501,{"operator":"<","value":500}), "< operator does not return correct result");
		assert(conditionHelper.checkCondition(1,{"operator":">","value":0}), "> operator does not return correct result");
		assert(conditionHelper.checkCondition(501,{"operator":">","value":500}), "> operator does not return correct result");
		assert(!conditionHelper.checkCondition(0,{"operator":">","value":1}), "> operator does not return correct result");
		assert(conditionHelper.checkCondition(0,{"operator":"<=","value":1}), "<= operator does not return correct result");
		assert(conditionHelper.checkCondition(1,{"operator":"<=","value":1}), "<= operator does not return correct result");
		assert(conditionHelper.checkCondition(499,{"operator":"<=","value":500}), "<= operator does not return correct result");
		assert(conditionHelper.checkCondition(500,{"operator":"<=","value":500}), "<= operator does not return correct result");
		assert(!conditionHelper.checkCondition(501,{"operator":"<=","value":500}), "<= operator does not return correct result");
		assert(conditionHelper.checkCondition(2,{"operator":">=","value":1}), ">= operator does not return correct result");
		assert(conditionHelper.checkCondition(1,{"operator":">=","value":1}), ">= operator does not return correct result");
		assert(!conditionHelper.checkCondition(0,{"operator":">=","value":1}), ">= operator does not return correct result");
		assert(conditionHelper.checkCondition(501,{"operator":">=","value":500}), ">= operator does not return correct result");
		assert(conditionHelper.checkCondition(500,{"operator":">=","value":500}), ">= operator does not return correct result");
		assert(!conditionHelper.checkCondition(499,{"operator":">=","value":500}), ">= operator does not return correct result");

	});
});
