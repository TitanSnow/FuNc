"use strict"
var ev=require("../FuNc-evil.js")
var evil=ev.evil
var a={rt:require("../FuNc-rt.js")}
var rl={
	question:(function(){
		var con=document.getElementById("console")
		con.value=""
		var inp=document.getElementById("input")
		inp.readOnly=true
		return function(tip,cb){
			inp.readOnly=false
			con.value+=tip
			inp.style.left=tip.length+"ch"
			inp.style.width="calc(100% - "+tip.length+"ch)"
			inp.addEventListener("keypress",function fc(e){
				switch(e.key){
					case "Enter":{
						e.preventDefault()
						inp.readOnly=true
						inp.removeEventListener("keypress",fc)
						con.value+=inp.value+"\n"
						var top=parseFloat(inp.style.top)
						inp.style.top=(isNaN(top)?0:top)+1.5+"em"
						inp.style.left="0"
						var val=inp.value
						inp.value=""
						cb(val)
						break
					}
					default:
						return
				}
			})
		}
	})()
}
console.log=function(x){
	x=x.toString()
	document.getElementById("console").value+=x+"\n"
	var inp=document.getElementById("input")
	var top=parseFloat(inp.style.top)
	inp.style.top=(isNaN(top)?0:top)+1.5+"em"
}
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
				case '[':
					if(!inq)++cnt
					break
				case ']':
					if(!inq&&--cnt==0);
					break
				case "'":
					if(non<=0)inq=!inq
					break
				case "\\":
					if(inq)non=2
					break
				default:
					break
			}
		return !inq&&cnt==0
	}
})
