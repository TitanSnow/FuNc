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
				a._=exp.get_lookup(a)(exp,a.__).func
				throw new exp.preventLastValue(a._)
			},
			"eval":function(x){
				return Function("a","x","with(a)return eval(x)")(a,x)
			},
			"'":function(){
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
			},
			trimLeft:function(x){
				return x.trimLeft()
			},
			trimRight:function(x){
				return x.trimRight()
			},
			"==":function(x){
				return a._==x
			},
			"!=":function(x){
				return a._!=x
			},
			"===":function(x){
				return a._===x
			},
			"!==":function(x){
				return a._!==x
			},
			"+":function(x){
				return a._+x
			},
			"-":function(x){
				return a._-x
			},
			"*":function(x){
				return a._*x
			},
			"/":function(x){
				return a._/x
			},
			"//":function(x){
				return Math.floor(a._/x)
			},
			"set":function(x,y){
				return a[x]=y
			},
			"`":function(){
				return exp.nxttok()
			},
			"@[":function(){
				return inthings["["]()()
			},
			"@":function(x){
				return x()
			},
			"not":function(x){
				return !x
			},
			"and":function(x){
				return a._&&x
			},
			"or":function(x){
				return a._||x
			},
			"true":function(){
				return true
			},
			"false":function(){
				return false
			},
			"if":function(x,y,z){
				if(x)
					return y()
				else
					return z()
			},
			"?":function(x,y,z){
				if(x)
					return y
				else
					return z
			},
			"<":function(x){
				return a._<x
			},
			">":function(x){
				return a._>x
			},
			"<=":function(x){
				return a._<=x
			},
			">=":function(x){
				return a._>=x
			},
			test:function(x,y,z){
				switch(y){
					case "==":case "$eq":
						return x==z
					case "!=":case "$ne":
						return x!=z
					case "===":case "$seq":
						return x===z
					case "!==":case "$sne":
						return x!==z
					case ">":case "$gt":
						return x>z
					case ">=":case "$ge":
						return x>=z
					case "<":case "$lt":
						return x<z
					case "<=":case "$le":
						return x<=z
					case "and":case "$a":
						return x&&z
					case "or":case "$o":
						return x||z
				}
			},
			"while":function(x,y){
				while(x())y()
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
