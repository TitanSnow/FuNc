"use strict"
var evil=require("./FuNc-evil.js").evil
var a={rt:require("./FuNc-rt.js")}
var rl=require("readline").createInterface({
	input:process.stdin,
	output:process.stdout
})
rl.question("> ",function cb(v){
	var r=evil(v,a)
	console.log("= "+typeof(r)+" "+r)
	rl.question("> ",cb)
})
