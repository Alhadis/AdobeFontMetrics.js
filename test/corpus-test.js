"use strict";

const fs               = require("fs");
const AdobeFontMetrics = require("..");
const {join, resolve}  = require("path");
const assert           = require("assert");
const dirPath          = resolve(join(__dirname, "corpus"));
const rootDir          = resolve(join(__dirname, ".."));

fs.existsSync(dirPath) && describe("Parsing AFM corpus", () => {
	for(let entry of fs.readdirSync(dirPath)){
		entry = join(dirPath, entry);
		
		if(!fs.lstatSync(entry).isFile())
			continue;
		
		it(`parses .${entry.replace(rootDir, "")}`, () => {
			const afm    = new AdobeFontMetrics();
			const stream = fs.createReadStream(entry, {encoding: "utf8"});
			stream.on("data", chunk => afm.readChunk(chunk));
			stream.on("end", () => {
				assert(true, afm.parserState.done, "Parser should have completed!");
				// TODO: Round-trip once stringification is implemented
			});
		});
	}
});
