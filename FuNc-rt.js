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
			"=":function(y){
				var x=a.__
				var pfunc=a.rt.thisFunc
				while(pfunc!=null){
					if(pfunc.FuNcLocals.hasOwnProperty(x)){
						return pfunc.FuNcLocals[x]=y
					}
					pfunc=pfunc.FuNcFather
				}
				return a[x]=y
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
				var func=(function(native_code){
					return function(){ return native_code() }
				})(function(){
					var v=exp.v
					var li=exp.df.lastIndex
					var father=a.rt.thisFunc
					a.rt.thisFunc=func
					var rv=exp.evil(estr,a)
					exp.v=v
					exp.df.lastIndex=li
					a.rt.thisFunc=father
					return rv
				})
				func.toString=function(){
					return "["+estr+"]"
				}
				func.FuNcLocals={}
				func.FuNcFather=a.rt.thisFunc
				return func
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
				var pfunc=a.rt.thisFunc
				while(pfunc!=null){
					if(pfunc.FuNcLocals.hasOwnProperty(x)){
						return pfunc.FuNcLocals[x]=y
					}
					pfunc=pfunc.FuNcFather
				}
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
			},
			",":function(x){
				var arr=a._
				if(typeof(arr.push)=="function"){
					arr.push(x)
					return arr
				}else{
					return [arr,x]
				}
			},
			";":function(){
				return [a._]
			},
			";;":function(){
				return []
			},
			"local":function(x){
				a.rt.thisFunc.FuNcLocals[x]=x
			},
			"del":function(x){
				var pfunc=a.rt.thisFunc
				while(pfunc!=null){
					if(pfunc.FuNcLocals.hasOwnProperty(x)){
						delete pfunc.FuNcLocals[x]
						return
					}
					pfunc=pfunc.FuNcFather
				}
				delete a[x]
			},
			"func":function(args,body){
				var func=function(){
					var len=args.length
					var i
					for(i=0;i<len;++i)
						body.FuNcLocals[args[i]]=arguments[i]
					return body()
				}
				func.FuNcLen=function(){
					return args.length
				}
				func.toString=function(){
					var len=args.length
					var rst="func @[ "
					var i
					for(i=0;i<len;++i)
						if(typeof(args[i])=="string")
							rst+="'"+args[i]+(i!=len-1?"', ":(len==1?"'; ":"' "))
						else
							rst+=args[i]+(i!=len-1?" , ":(len==1?" ; ":" "))
					return rst+(len!=0?"] ":";; ] ")+body
				}
				return func
			},
			"range":function(args){
				if(args.length===void(0))
					args=[args]
				args=Array.from(args)
				if(args.length==0)
					return []
				if(args.length==1)
					args.unshift(0)
				if(args.length==2)
					args.push(1)
				var rst=[]
				var i
				for(i=args[0];i<args[1];i+=args[2])
					rst.push(i)
				return rst
			},
			"for":function(rg,func){
				var i
				var len=rg.length
				for(i=0;i<len;++i)
					func(rg[i])
			},
			".":function(key){
				if(typeof(a._[key])=="function"&&a._[key]!==void(0)) return a._[key].bind(a._)
				return a._[key]
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

		var pfunc=a.rt.thisFunc
		var rst
		while(pfunc!=null){
			rst=pfunc.FuNcLocals[name]
			if(typeof(rst)=="function")
				return ret(rst)
			if(typeof(rst)!="undefined")
				return ret(function(){ return rst })
			pfunc=pfunc.FuNcFather
		}
		rst=a[name]
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
