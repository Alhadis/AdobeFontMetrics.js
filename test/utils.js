"use strict";

const Chai            = require("chai");
const {resolve, join} = require("path");
const {readFileSync}  = require("fs");
Chai.should();


// Prepend "It" to test-titles needing 'em
const oldIt = global.it;

global.it = Object.defineProperty(function(...args){
	if(!/^it(?:\s|[’`´'](?:ll|[ds]))/i.test(args[0]))
		args[0] = `It ${args[0]}`;
	return oldIt.call(this, ...args);
}, Symbol("UnpatchedSource"), {
	value: oldIt,
	enumerable: false,
	writable: false,
});


module.exports = {
	expect: Chai.expect.bind(Chai),
	
	when(text, ...args){
		return describe.call(this, `When ${text},`, ...args);
	},
	
	load(file, encoding = "utf8"){
		file = resolve(join(__dirname, ...file.split(/\\|\//g)));
		return readFileSync(file, encoding);
	},
};
