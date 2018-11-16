JSON = fixtures/bgb.json

all: $(JSON)


# Download a large corpus of in-the-wild AFM samples
corpus:
	git clone --quiet --branch=afm --depth=1 https://github.com/Alhadis/Silos.git $@

test-corpus: corpus
	npx mocha corpus-test.js


# Dump a JSON serialisation of a complete AFM file
$(JSON): fixtures/bgb.afm
	node -e '\
		"use strict"; \
		let fs = require("fs"), \
		output = new (require(".."))(fs.readFileSync("$?", "utf8")); \
		process.stdout.write(JSON.stringify(output)); \
	' > $@


# Clobber generated JSON files
clean:
	rm -f $(JSON)

.PHONY: clean
