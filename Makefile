NAME = adobe-font-metrics
UMD_NAME = AdobeFontMetrics

all: lint build test

build: $(NAME).js

# Generate a compressed UMD module from ESM source
$(NAME).js: $(NAME).mjs
	npx rollup \
		--format umd \
		--sourcemap $@.map \
		--name $(UMD_NAME) \
		--input $? \
		--file $@
	node -e '\
		const fs = require("fs"); \
		const map = JSON.parse(fs.readFileSync("$@.map", "utf8")); \
		delete map.sourcesContent; \
		fs.writeFileSync("$@.map", JSON.stringify(map));'
	npx terser \
		--keep-classnames \
		--mangle \
		--compress \
		--source-map "content=$@.map,url=$(@F).map" \
		--output $@ $@


# Wipe downloaded files and generated build targets
clean:
	rm -f $(NAME).js* *.tgz
	rm -rf corpus node_modules
.PHONY: clean


# Check source for style and syntax errors
lint:
	npx eslint $(NAME).mjs
.PHONY: lint


# Run unit-tests
test: build
	npx mocha test/*-spec.js
.PHONY: test


# [OPTIONAL: Not required] Run parser against collections of real-world AFM examples
corpus:
	mkdir $@

	# First bunch harvested from GitHub search results
	git clone --branch afm --depth 1 --quiet https://github.com/Alhadis/Linguist-Silo.git $@.tmp
	mv $@.tmp/downloads/* $@
	rm -rf $@.tmp
	rm -f $@/php_*
	rm -f $@/Times-Bold.70.afm
	mv $@/D050000L.afm $@/D050000L-2.afm
	
	export URW="node_modules/urw-core35-fonts"; \
	(npm --no-save --no-package-lock i urw-core35-fonts 2>&1) >/dev/null \
	&& mv $$URW/metrics/* $@ \
	&& rm -rf $$URW \
	&& rmdir node_modules 2>&1 >/dev/null || true
