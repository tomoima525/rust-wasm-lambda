# Makefile for building a wasm module and copying it to the correct location for use in a lambda function

# Define the module name as a variable, with a default value of "myModule"
moduleName ?= myModule
# change moduleName to use underscores instead of dashes
wasmjsName := $(shell echo $(moduleName) | sed 's/-/_/g')

rustDir := fn/$(moduleName)

# Define the output directory 
outputDir := layers/$(moduleName)

# Define the build command
buildCmd := wasm-pack build -d ../../$(outputDir) --target nodejs

# Workaround for using fetch in nodejs
# See https://rustwasm.github.io/wasm-pack/book/prerequisites/considerations.html#nodejs
FETCH_GLOBALS = "const fetch = require('node-fetch');\
global.fetch = fetch;\
global.Headers = fetch.Headers;\
global.Request = fetch.Request;\
global.Response = fetch.Response;"

insert_fetch_globals:
	@echo $(FETCH_GLOBALS) > $(outputDir)/fetch_globals.js
	cat $(outputDir)/$(wasmjsName).js >> $(outputDir)/fetch_globals.js
	mv $(outputDir)/fetch_globals.js $(outputDir)/$(wasmjsName).js
	cd $(outputDir) && touch yarn.lock && yarn add node-fetch@2

.PHONY: build_wasm
build_wasm:
	cd $(rustDir) && $(buildCmd)
	make insert_fetch_globals
	mkdir -p $(outputDir)/nodejs/node_modules/$(moduleName)
	rsync -av $(outputDir) --exclude='nodejs' $(outputDir)/nodejs/node_modules/
	rm $(outputDir)/.gitignore
