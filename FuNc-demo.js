"use strict"
var ev=require("./FuNc-evil.js")
var evil=ev.evil
var a={rt:require("./FuNc-rt.js")}
if(process.argv.length<=2){
	var rl=require("readline").createInterface({
		input:process.stdin,
		output:process.stdout
	})
	rl.question("> ",function cb(v){
		try{
			var r=evil(v,a)
		}catch(err){
			if(!(err instanceof ev.NF))
				throw err
			rl.question(". ",cb)
			return
		}
		console.log("= "+typeof(r)+" "+r)
		rl.question("> ",cb)
	})
}else{
	var filename=process.argv[2]
	var v=require("fs").readFileSync(filename,{encoding:"UTF-8"})
	evil(v,a)
}
