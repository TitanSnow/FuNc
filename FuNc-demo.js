"use strict"
var ev=require("./FuNc-evil.js")
var evil=ev.evil
var a={rt:require("./FuNc-rt.js")}
var rl=require("readline").createInterface({
	input:process.stdin,
	output:process.stdout
})
rl.question("> ",function cb(v){
	try{
		var r=evil(v,a)
	}catch(err){
		if(!err instanceof ev.NF)
			throw err
		rl.question(". ",cb)
		return
	}
	console.log("= "+typeof(r)+" "+r)
	rl.question("> ",cb)
})
