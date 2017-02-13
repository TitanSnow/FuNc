"use strict"
var ev=require("../FuNc-evil.js")
var evil=ev.evil
var a={rt:require("../FuNc-rt.js")}
function text2HTML(str){
	var pre=document.createElement("pre")
	pre.textContent=str
	return pre.innerHTML
}
var rl={
	question:(function(){
		var con=document.getElementById("console")
		con.textContent=""
		var inp=document.getElementById("input")
		inp.readOnly=true
		var cmdhis=[""]
		var pcmdhis=cmdhis.length-1
		return function(tip,cb){
			inp.readOnly=false
			con.innerHTML+=text2HTML(tip)
			inp.style.left=tip.length+"ch"
			inp.style.width="calc(100% - "+tip.length+"ch)"
			inp.addEventListener("keydown",function fc(e){
				if(e.key===void(0))
					e.key=e.code
				switch(e.key){
					case "Enter":{
						e.preventDefault()
						inp.readOnly=true
						inp.removeEventListener("keydown",fc)
						con.innerHTML+=text2HTML(inp.value+"\n")
						var top=parseFloat(inp.style.top)
						inp.style.top=(isNaN(top)?0:top)+1.5+"em"
						inp.style.left="0"
						inp.style.width="100%"
						var val=inp.value
						inp.value=""
						cmdhis.splice(-1,0,val)
						pcmdhis=cmdhis.length-1
						cb(val)
						break
					}
					case "ArrowUp":{
						e.preventDefault()
						if(pcmdhis==cmdhis.length-1)cmdhis[cmdhis.length-1]=inp.value
						inp.value=cmdhis[pcmdhis=Math.max(pcmdhis-1,0)]
						break
					}
					case "ArrowDown":{
						e.preventDefault()
						inp.value=cmdhis[pcmdhis=Math.min(pcmdhis+1,cmdhis.length-1)]
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
	var type=typeof(x)
	if(type=="string"){
		var rst=/^= (undefined|object|boolean|number|string|symbol|function) /.exec(x)
		if(rst!==null)
			type=rst[1]
	}
	x=x+""
	var con=document.getElementById("console")
	var span=document.createElement("span")
	span.className=type
	span.textContent=x
	con.innerHTML+=span.outerHTML
	con.innerHTML+="\n"
	var inp=document.getElementById("input")
	var top=parseFloat(inp.style.top)
	inp.style.top=(isNaN(top)?0:top)+1.5*(count(x,/\r\n|\r|\n/g)+1)+"em"
	function count(str,reg){
		var cnt=0
		for(;reg.exec(str)!==null;++cnt);
		return cnt
	}
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
