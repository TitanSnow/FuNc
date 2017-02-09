"use strict"
module.exports={
	lookup:function(a,name){
		var inthings={
			print:function(x){
				return console.log(x),null
			},
			exit:function(x){
				return process.exit(x),null
			},
			"=":function(x){
				return a[a.__]=x
			}
		}

		function ret(f){
			if(typeof(f.FuNcLen)=="function")
				return {
					func:f,
					len:f.FuNcLen()
				}
			else return {
				func:f,
				len:f.length
			}
		}

		var rst=a[name]
		if(typeof(rst)=="function")
			return ret(rst)
		else if(typeof(rst)=="undefined"){
			if(!inthings.hasOwnProperty(name)){
				let n
				if(isNaN(n=Number(name)))
					return ret(function(){
						return name
					})
				else
					return ret(function(){
						return n
					})
			}else
				return ret(inthings[name])
		}else return ret(function(){
			return rst
		})
	}
}
