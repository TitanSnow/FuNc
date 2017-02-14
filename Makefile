all:
	echo 'make console OR make online'
console: FuNc-demo.js
online: dist/bundle.js
FuNc-demo.js: buildtool/include.js src/FuNc-repl.js src/FuNc-demo.js
	node buildtool/include.js src/FuNc-demo.js > FuNc-demo.js
dist/bundle.js: src/FuNc-online.js FuNc-evil.js FuNc-rt.js buildtool/include.js src/FuNc-repl.js
	-mkdir dist
	node buildtool/include.js src/FuNc-online.js > src/FuNc-online-tmp.js
	cd src;browserify FuNc-online-tmp.js -o ../dist/bundle.js;cd ..
	rm src/FuNc-online-tmp.js
clear:
	-rm dist/bundle.js
	-rm FuNc-demo.js
.PHONY: clear all console online
