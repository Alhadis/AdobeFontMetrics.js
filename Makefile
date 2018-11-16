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


# Wipe generated build targets
clean:
	rm -f $(NAME).js*
	rm -f *.zip *.tar *.tgz *.log

# Wipe downloaded files *and* generated artefacts
clobber: clean
	rm -rf test/corpus
	rm -rf node_modules

.PHONY: clean clobber


# Check source for style and syntax errors
lint:
	npx eslint $(NAME).mjs test/*.js

.PHONY: lint


# Run unit-tests
test: build
	npx mocha test/*-spec.js

.PHONY: test
