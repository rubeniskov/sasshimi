PROJECT_NAME := $(shell node_modules/.bin/miniquery -p 'name' ./package.json)

BABEL_FLAGS = \
src \
--out-dir lib \
--copy-files

build:
	@echo "Building project ${PROJECT_NAME}" \
	&& mkdir -p ./lib/ \
	&& ./node_modules/.bin/babel $(BABEL_FLAGS)

watch:
	@echo "Watching project ${PROJECT_NAME}" \
	&& mkdir -p ./lib/ \
	&& ./node_modules/.bin/babel --watch $(BABEL_FLAGS)

unit:
	@echo "Testing project ${PROJECT_NAME}" \
	&& ./node_modules/.bin/istanbul cover \
		 ./node_modules/.bin/mocha -- --watch test/specs.js \
  && node_modules/.bin/codecov
