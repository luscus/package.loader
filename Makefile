BIN = ./node_modules/.bin

define release
	@echo `node -pe "require('./package.json').version"`
	@echo "$(1)"
	@grunt
	@bump $(1)
endef

patch:
	@$(call release,patch)

minor:
	@$(call release,minor)

major:
	@$(call release,major)


test:
	@grunt test

.PHONY: test
