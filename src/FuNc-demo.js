"use strict"
var ev=require("./FuNc-evil.js")
var evil=ev.evil
var a={rt:require("./FuNc-rt.js"),global:global}
if(process.argv.length<=2){
	var rl=require("readline").createInterface({
		input:process.stdin,
		output:process.stdout
	})
}
//#include src/FuNc-repl.js
