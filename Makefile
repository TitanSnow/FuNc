dist/bundle.js: src/FuNc-online.js FuNc-evil.js FuNc-rt.js
	cd src;browserify FuNc-online.js -o ../dist/bundle.js
clear:
	-rm dist/bundle.js
.PHONY: clear
