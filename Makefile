.PHONY : clean
clean:
	rm -rf _publish_dir/
	rm -rf dist/js/
	rm -rf node_modules/

.PHONY : install
install:
	yarn

.PHONY : build
build:
	yarn build

.PHONY : deploy
deploy : clean install build
	$(eval current_git_url := $(shell git ls-remote --get-url origin))
	mkdir -p _publish_dir
	git -C _publish_dir/ init
	git -C _publish_dir/ config remote.origin.url >&- || git -C _publish_dir/ remote add origin ${current_git_url}
	git -C _publish_dir/ fetch
	git -C _publish_dir/ checkout deploy || git -C _publish_dir/ checkout --orphan deploy
	# Delete everything (except dotfiles, e.g. .git), so we don't end up w/ cruft hanging around
	rm -rf _publish_dir/*
	cp -Rn dist/ _publish_dir/
	git -C _publish_dir/ add .
	git -C _publish_dir/ commit -m "Publish - $(shell date "+%Y-%m-%d %H:%M:%S")"
	git -C _publish_dir/ push
	rm -rf _publish_dir/