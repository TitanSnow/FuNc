"use strict"
var ev=require("../FuNc-evil.js")
var evil=ev.evil
var a={rt:require("../FuNc-rt.js"),"window":window}
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
	var con=document.getElementById("console")
	var span=document.createElement("span")
	if(type=="string"){
		var reg=/^= (undefined|object|boolean|number|string|symbol|function) /g
		var rst=reg.exec(x)
		if(rst!==null){
			type=rst[1]
			con.innerHTML+=text2HTML("= "+type+" ")
			x=x.slice(reg.lastIndex)
		}
	}
	x=x+""
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
//#include src/FuNc-repl.js
