if(process.argv.length<=2){
	rl.question("> ",function cb(v){
		if(calc_openleft(v)){
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
		}else{
			rl.question(". ",function cbsub(pv){
				cb(v+"\n"+pv)
			})
		}
		function calc_openleft(v){
			var vi
			var cnt=0
			var inq=false
			var non=0
			var i
			for(i=0;i<v.length;++i,--non)
				switch(v[i]){
					case '[':case '(':
						if(!inq)++cnt
						break
					case ']':case ')':
						if(!inq&&--cnt==0);
						break
					case "'":
						if(non<=0)inq=!inq
						break
					case "\\":
						if(inq&&non<=0)non=2
						break
					default:
						break
				}
			return !inq&&cnt==0
		}
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
