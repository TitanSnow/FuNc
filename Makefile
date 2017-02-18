all: console online browser
console: FuNc-demo.js
online: dist/bundle.js
browser: dist/func.js
FuNc-demo.js: buildtool/include.js src/FuNc-repl.js src/FuNc-demo.js
	node buildtool/include.js src/FuNc-demo.js > FuNc-demo.js
dist/bundle.js: src/FuNc-online.js FuNc-evil.js FuNc-rt.js buildtool/include.js src/FuNc-repl.js
	-mkdir dist
	node buildtool/include.js src/FuNc-online.js > src/FuNc-online-tmp.js
	cd src;browserify FuNc-online-tmp.js -o ../dist/bundle.js;cd ..
	rm src/FuNc-online-tmp.js
dist/func.js: src/FuNc-browser.js FuNc-evil.js FuNc-rt.js
	-mkdir dist
	cd src;browserify FuNc-browser.js -o ../dist/func.js;cd ..
clear:
	-rm dist/bundle.js
	-rm FuNc-demo.js
	-rm dist/func.js
.PHONY: clear all console online browser
