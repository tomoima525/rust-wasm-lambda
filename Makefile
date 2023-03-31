# Makefile for building a wasm module and copying it to the correct location for use in a lambda function

# Define the module name as a variable, with a default value of "myModule"
moduleName ?= myModule

rustDir := fn/$(moduleName)

# Define the output directory 
outputDir := layers/$(moduleName)

# Define the build command
buildCmd := wasm-pack build -d ../../$(outputDir) --target nodejs


.PHONY: build_wasm
build_wasm:
	cd $(rustDir) && $(buildCmd)
	mkdir -p $(outputDir)/nodejs/node_modules/$(moduleName)
	rsync -av $(outputDir) --exclude='nodejs' $(outputDir)/nodejs/node_modules/
	rm $(outputDir)/.gitignore
