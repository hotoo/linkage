version = $(shell cat package.json | grep version | awk -F'"' '{print $$4}')

install:
	@spm install

publish: publish-doc
	@spm publish
	@git tag $(version)
	@git push origin $(version)

build-doc:
	@spm doc build

publish-doc:
	@spm doc publish

watch:
	@spm doc watch

clean:
	@rm -fr _site
