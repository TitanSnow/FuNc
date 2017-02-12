(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
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

},{}],2:[function(require,module,exports){
// FuNc-evil.js
// FuNc evaler (core part)
// lexical analysis & code evaluation
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
		ifo=get_lookup(a)(module.exports,tok)	// get the obj info
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
module.exports=new class{
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
}

},{}],3:[function(require,module,exports){
(function (process){
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
			"==":function(x){
				return a._==x
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

}).call(this,require('_process'))
},{"_process":1}],4:[function(require,module,exports){
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
			inp.addEventListener("keypress",function fc(e){
				switch(e.key){
					case "Enter":{
						e.preventDefault()
						inp.readOnly=true
						inp.removeEventListener("keypress",fc)
						con.innerHTML+=text2HTML(inp.value+"\n")
						var top=parseFloat(inp.style.top)
						inp.style.top=(isNaN(top)?0:top)+1.5+"em"
						inp.style.left="0"
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

},{"../FuNc-evil.js":2,"../FuNc-rt.js":3}]},{},[4]);
