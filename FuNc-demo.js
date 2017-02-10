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
	var fs=require("fs")
	var filename=process.argv[2]
	var raw_v=fs.readFileSync(filename)
	var v=raw_v.toString("binary")
	var coding_rex=/^.*(?:\r\n|\r|\n)?.*coding[ \t]*[:=][ \t]*(\S+)/
	var rst=coding_rex.exec(v)
	var coding
	if(rst!==null) coding=rst[1]
	else{
		v=raw_v.toString("ucs2")
		rst=coding_rex.exec(v)
		if(rst!==null) coding=rst[1]
	}
	if(typeof(coding)=="undefined")
		coding="utf8"
	v=raw_v.toString(coding)
	evil(v,a)
}
