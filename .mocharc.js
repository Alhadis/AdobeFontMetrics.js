"use strict";

module.exports = {
	specPattern: /-spec\.js$/i,
	require: [
		"mocha-when/register",
		"chai/register-should",
	],
};
