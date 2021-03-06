(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){

},{}],2:[function(require,module,exports){
// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],3:[function(require,module,exports){
// FuNc-evil.js
// FuNc evaler (core part)
// lexical analysis & code evaluation
(function father(host,key){
"use strict"

// v is the string ready to eval, a is the "global"
// "global" means the whole thing script runs in
var v,a

// df is the regex to match token
// there is three type of token in FuNc
// 1. space -- always ignore
// 2. real identifier -- \w\$
// 3. fake identifier -- not real ones
// both real and fake identifier can be a identifier
// but can't mix as one token
var df=/\s*([\w\$]+|[^\s\w\$]+)/g

// define the error class
// base class EvilError
// EOF for end of file(string)
// SyntaxError for its name
// (maybe there won't be a syntax error because there's no syntax?)
// NF for not finished "v"
// TODO add a constructor to store error message
class EvilError{
	toString(){return "[error EvilError]"}
}
class EOF extends EvilError{
	toString(){return "[error EOF]"}
}
class SyntaxError extends EvilError{
	toString(){return "[error SyntaxError]"}
}
class NF extends EvilError{
	toString(){return "[error NF]"}
}
class preventLastValue extends EvilError{
	constructor(val){super();this.returnValue=val}
	toString(){return "[error preventLastValue]"}
}

// operation to v
function setv(pv){
	v=pv
	df.lastIndex=0
}
function getv(){
	return v
}

// operation to a
function seta(pa){
	a=pa
}
function geta(){
	return a
}

// lexical analysis
function nxttok(){
	var li=df.lastIndex				// store lastIndex to check next match
	var rst=df.exec(v)
	if(rst===null)					// null just means EOF because the right regex
		throw new EOF()
	if(rst.index!=li)				// I can't find such a situation
		throw new SyntaxError()
	return rst[1]
}

// get a "global", return a lookup function
// to make this is to let users config it
var get_lookup=function(obj){
	return obj.rt.lookup
}

// store stack
var stack=[]
// evaluation
function nxtfun(){
	var tok,fun,len,arg,ifo,nv,rv,_,__
	if(!stack.length){
		tok=nxttok()				// get token
		ifo=get_lookup(a)(host[key],tok)	// get the obj info
		fun=ifo.func
		len=ifo.len
		arg=[]
		_=a._
		__=a.__
	}else{
		let rec=stack.pop()
		// recov
		tok=rec.tok
		fun=rec.fun
		len=rec.len
		arg=rec.arg
		ifo=rec.ifo
		nv=rec.nv
		rv=rec.rv
		_=rec._
		__=rec.__
		++len						// inc len, re-go-into loop
	}
	while(len--){
		try{
			a._=_						// _&__ always be left
			a.__=__
			rv=nxtfun()
		}catch(err){
			if(err instanceof EOF||err instanceof NF){	// if this step meet error, need to store stack
				pushStack()
				if(err instanceof EOF)throw new NF()	// do not new a error if NF but need to replace EOF
			}
			throw err
		}
		arg.push(rv)			// make a arg list
	}
	// call and return
	a._=_						// _&__ always be left
	a.__=__
	try{rv=fun.apply(null,arg)}catch(err){
		if(err instanceof NF)	// catch NF thrown by function
			pushStack()
		else if(err instanceof preventLastValue)
			return err.returnValue
		throw err
	}
	if(rv===void(0))
		rv=null
	a._=rv						// store the last return val
	a.__=tok					// store the last token
	return rv

	// store this env to stack
	function pushStack(){
		stack.push({
			tok,fun,len,arg,ifo,nv,rv,_,__		// ES6
		})
	}
}

// interface
function evil(pv,pa){
	var rv
	setv(pv)
	if(pa!=null)
		seta(pa)
	try{
		while(true)
			rv=nxtfun()				// eval again and again
	}catch(err){
		if(!(err instanceof EOF))	// EOF considered not a error
			throw err
	}
	return rv						// rv is the last called function's return val
}

// use get/set to control users not to break things
host[key]=new class{
	get EvilError(){
		return EvilError
	}
	get SyntaxError(){
		return SyntaxError
	}
	get EOF(){
		return EOF
	}
	get NF(){
		return NF
	}
	get preventLastValue(){
		return preventLastValue
	}
	get df(){
		return df
	}
	set df(x){
		df=x
	}
	get v(){
		return getv()
	}
	set v(x){
		setv(x)
	}
	get a(){
		return geta()
	}
	set a(x){
		seta(x)
	}
	get nxttok(){
		return nxttok
	}
	get nxtfun(){
		return nxtfun
	}
	get get_lookup(){
		return get_lookup
	}
	set get_lookup(x){
		get_lookup=x
	}
	get evil(){
		return evil
	}
	get stack(){
		return stack
	}
	clone(){
		var obj={}
		father(obj,"exports")
		return obj.exports
	}
}
})(module,"exports")

},{}],4:[function(require,module,exports){
(function (process,global){
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

}).call(this,require('_process'),typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : {})
},{"_process":2,"fs":1}],5:[function(require,module,exports){
"use strict"
var evil=require("../FuNc-evil.js").evil
var a={rt:require("../FuNc-rt.js"),window:window}
window.FuNc=function(src){
	return new Promise(function(suc,fal){
		var xhr=new XMLHttpRequest()
		xhr.open("GET",src,true)
		xhr.responseType="text"
		xhr.onload=function(){
			suc(evil(xhr.responseText,a))
		}
		xhr.onerror=function(){
			fal()
		}
		xhr.send()
	})
}

},{"../FuNc-evil.js":3,"../FuNc-rt.js":4}]},{},[5]);
