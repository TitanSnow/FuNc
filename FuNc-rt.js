// FuNc-rt.js
// FuNc runtime
// runtime implement name-lookup and
// things must implement in native
// or most called things
//
// runtime can be replaced to make
// a dialect
//
// here code pile up like a trash mountain

"use strict"
module.exports={
	// lookup: input evil struct & name, return function as its name
	lookup:function(exp,name){
		var a=exp.a
		// inthings are runtime functions
		// usually use "x,y,z" as args
		var inthings={
			// print things. wrapper console.log
			print:function(x){
				return console.log(x),null		// return null is not necessary
			},
			// exit in Nodejs. wrapper process.exit
			// remove this if sure run in browser
			exit:function(x){
				return process.exit(x),null		// return null is not necessary
			},
			// assignment
			"=":function(y){
				var x=a.__						// left name
				var pfunc=a.rt.thisFunc			// start finding name from bottom to top
				while(pfunc!=null){				// if is null, means get top
					if(pfunc.FuNcLocals.hasOwnProperty(x)){
						return pfunc.FuNcLocals[x]=y		// find and assign
					}
					pfunc=pfunc.FuNcFather		// go up
				}
				return a[x]=y					// fallback to ground
			},
			// make a function
			// IMPORTANT & MESSY
			"[":function(){
				// store all things about
				var cnt=1
				var v=exp.v
				var df=exp.df
				// find ]
				var i
				var cont=true	// flag to continue loop
				var inq=false	// flag is in quote
				var non=0		// '\' flag
				for(i=df.lastIndex;cont&&i<v.length;++i,--non)	// go through string, dec '\' flag per time
					switch(v[i]){
						case '[':
							if(!inq)++cnt					// if not in quote, inc level
							break
						case ']':
							if(!inq&&--cnt==0) cont=false	// if not in quote, dec level. to 0, set off cont flag
							break
						case "'":
							if(non<=0)inq=!inq				// meet "'", flip inq flag
							break
						case "\\":
							if(inq&&non<=0)non=2			// meet '\', turn on 
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
					a.rt.thisFunc=function(){return func.apply(this,arguments)}
					if(func.FuNcArgs!==void(0))
						a.rt.thisFunc.FuNcLocals=func.FuNcArgs
					else
						a.rt.thisFunc.FuNcLocals={}
					func.FuNcArgs={}
					a.rt.thisFunc.FuNcFather=func.FuNcFather
					var rv=exp.evil(estr,a)
					exp.v=v
					exp.df.lastIndex=li
					a.rt.thisFunc=father
					return rv
				})
				func.toString=function(){
					return "["+estr+"]"
				}
				func.FuNcFather=a.rt.thisFunc
				func.FuNcArgs={}
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
							if(non<=0)non=2
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
				return x.FuNcLen?x.FuNcLen():x.length
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
			"(":function(){
				var cnt=1
				var v=exp.v
				var df=exp.df
				var i
				var cont=true
				var inq=false
				var non=0
				for(i=df.lastIndex;cont&&i<v.length;++i,--non)
					switch(v[i]){
						case '(':
							if(!inq)++cnt
							break
						case ')':
							if(!inq&&--cnt==0) cont=false
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
				if(cont)throw new exp.NF()
				var li=df.lastIndex
				exp.v=v.slice(0,i-1)+']'+v.slice(i)
				exp.df.lastIndex=li
				return inthings["@["]()
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
			"locals":function(x){
				var len=x.length
				var i
				for(i=0;i<len;++i)
					a.rt.thisFunc.FuNcLocals[x[i]]=x[i]
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
						body.FuNcArgs[args[i]]=arguments[i]
					return body()
				}
				func.FuNcLen=function(){
					return args.length
				}
				func.toString=function(){
					var len=args.length
					var rst="func ( "
					var i
					for(i=0;i<len;++i)
						if(typeof(args[i])=="string")
							rst+="'"+args[i]+(i!=len-1?"', ":(len==1?"'; ":"' "))
						else
							rst+=args[i]+(i!=len-1?" , ":(len==1?" ; ":" "))
					return rst+(len!=0?") ":";; ) ")+body
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
				if(typeof(a._[key])=="function"&&a._[key]!==void(0)){
					var _=a._
					var rv=_[key].bind(_)
					var f=_[key]
					rv.FuNcLen=function(){
						return f.FuNcLen?f.FuNcLen():f.length
					}
					return rv
				}
				return a._[key]
			},
			".`":function(){
				return inthings["."](exp.nxttok())
			},
			".=":function(key,value){
				return a._[key]=value
			},
			".+=":function(key,value){
				return a._[key]+=value
			},
			".-=":function(key,value){
				return a._[key]-=value
			},
			".*=":function(key,value){
				return a._[key]*=value
			},
			"./=":function(key,value){
				return a._[key]/=value
			},
			".//=":function(key,value){
				return a._[key]=Math.floor(a._[key]/value)
			},
			"require":function(x){
				return require(x)
			},
			empty:function(){
				return {}
			},
			"ground":function(){
				return a
			},
			"floor":function(){
				var obj=a.rt.thisFunc.FuNcLocals
				obj.upstair=a.rt.thisFunc.FuNcFather.FuNcLocals
				return obj
			},
			"new":function(cls){
				return new cls()
			},
			"news":function(cls,args){
				var i
				var len=args.length+1
				var sar=[]
				for(i=0;i<len;++i)
					sar.push("a"+i)
				var rag=Array.from(args)
				rag.unshift(cls)
				return eval("("+sar+")=>{return new a0("+sar.slice(1)+")}").apply(null,rag)
			},
			"apply":function(fun,args){
				return fun.apply(null,args)
			},
			"import":function(mn,cb){
				var premods={
					"cnw":"( local `root ~root = [ if (global == `global) [ window ] [ global ] ] ~setTimeout = func( `cb, `tm ) [ apply(root.`setTimeout)( ~cb,tm) ] ~setInterval = func( `cb, `tm ) [ apply(root.`setInterval)( ~cb,tm) ] ~clearTimeout = func( `id; ) [ apply(root.`clearTimeout)(id;) ] ~clearInterval = func( `id; ) [ apply(root.`clearInterval)(id;) ] )"
				}
				if(premods.hasOwnProperty(mn)){
					var sa={rt:module.exports,global:global,window:window}
					exp.clone().evil(premods[mn],sa)
					a[mn]=sa
					setTimeout(cb,0)
					return
				}
				var url
				if(/\.func$/.test(mn))
					url=mn
				else
					url=mn+".func"
				mn=/\/?([^\/]+?)(?:\.func)?$/.exec(url)[1]
				if(!process.browser){
					require("fs").readFile(url,function(err,data){
						if(err) throw err
						var sa={rt:module.exports,global:global}
						exp.clone().evil(data.toString(),sa)
						a[mn]=sa
						cb()
					})
				}else{
					var xhr=new XMLHttpRequest()
					xhr.open("GET",url,true)
					xhr.responseType="text"
					xhr.onload=function(){
						var sa={rt:module.exports,window:window}
						exp.clone().evil(xhr.responseText,sa)
						a[mn]=sa
						cb()
					}
					xhr.onerror=function(e){
						throw e
					}
					xhr.send()
				}
			},
			"imports":function(mns,cb){
				var pms=[]
				var i
				var len=mns.length
				for(i=0;i<len;++i)
					(function(mn){
						pms.push(new Promise(function(suc,fal){
							inthings["import"](mn,suc)
						}))
					})(mns[i])
				Promise.all(pms).then(cb)
			},
			"forin":function(obj,cb){
				var key
				for(key in obj)
					cb(key)
			},
			"forinown":function(obj,cb){
				var key
				for(key in obj)
					if(obj.hasOwnProperty(key))
						cb(key)
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
