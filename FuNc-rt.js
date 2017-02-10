"use strict"
module.exports={
	lookup:function(exp,name){
		var a=exp.a
		var inthings={
			print:function(x){
				return console.log(x),null
			},
			exit:function(x){
				return process.exit(x),null
			},
			"=":function(x){
				return a[a.__]=x
			},
			"[":function(){
				var cnt=1
				var v=exp.v
				var df=exp.df
				var i
				var cont=true
				for(i=df.lastIndex;cont&&i<v.length;++i)
					switch(v[i]){
						case '[':
							++cnt
							break
						case ']':
							if(--cnt==0) cont=false
							break
						default:
							break
					}
				if(cont)throw new exp.NF()
				var fst=df.lastIndex
				df.lastIndex=i
				var estr=v.substring(fst,i-1)
				return (function(native_code){
					return function(){ return native_code() }
				})(function(){
					var v=exp.v
					var li=exp.df.lastIndex
					var rv=exp.evil(estr,exp.a)
					exp.v=v
					exp.df.lastIndex=li
					return rv
				})
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
