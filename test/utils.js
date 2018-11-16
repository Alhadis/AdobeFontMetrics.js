"use strict";

const Chai            = require("chai");
const {resolve, join} = require("path");
const {readFileSync}  = require("fs");
Chai.should();

module.exports = {
	expect: Chai.expect.bind(Chai),
	
	when(text, ...args){
		return describe.call(this, "When " + text, ...args);
	},
	
	load(file){
		file = resolve(join(__dirname, ...file.split(/\\|\//g)));
		return readFileSync(file, "utf8");
	},
};
