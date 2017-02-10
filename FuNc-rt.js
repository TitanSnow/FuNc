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
				var inq=false
				var non=0
				for(i=df.lastIndex;cont&&i<v.length;++i,--non)
					switch(v[i]){
						case '[':
							if(!inq)++cnt
							break
						case ']':
							if(!inq&&--cnt==0) cont=false
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
			},
			str:function(x){
				return x.toString()
			},
			"float":function(x,y){
				return Number(x+"."+y)
			},
			number:function(x){
				return Number(x)
			},
			"int":function(x){
				if(typeof(x)=="number")
					return Math.floor(x)
				return parseInt(x)
			},
			isNaN:function(x){
				return isNaN(x)
			},
			"typeof":function(x){
				return typeof x
			},
			"null":function(){
				return null
			},
			"~":function(){
				a.__=exp.nxttok()
				a._=(function(native_code){
					return function(){ return native_code() }
				})((function(val){
					return function(){ return val }
				})(exp.get_lookup(a)(exp,a.__).func))
				throw new exp.preventLastValue(a.__)
			},
			"eval":function(x){
				return Function("a","x","with(a)return eval(x)")(a,x)
			},
			"'":function(){
				debugger
				var v=exp.v
				var df=exp.df
				var i
				var cont=true
				var non=0
				for(i=df.lastIndex;cont&&i<v.length;++i,--non)
					switch(v[i]){
						case "\\":
							non=2
							break
						case "'":
							if(non<=0)
								cont=false
							break
						default:
							break
					}
				if(cont) throw new exp.NF()
				var li=df.lastIndex
				df.lastIndex=i
				return eval("'"+v.substring(li,i-1).replace(/\r\n|\r|\n/g,"\\n")+"'")
			},
			len:function(x){
				return x.length
			},
			trim:function(x){
				return x.trim()
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
					return ret(function(){ return name })
				else
					return ret(function(){ return n })
			}else
				return ret(inthings[name])
		}else return ret(function(){ return rst })
	}
}
