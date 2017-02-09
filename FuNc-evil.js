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
			rv=nxtfun()
		}catch(err){
			if(err instanceof EOF||err instanceof NF){	// if this step meet error, need to store stack
				pushStack()
				throw new NF()
			}
			throw err
		}
		arg.push(rv)			// make a arg list
	}
	// call and return
	a._=_
	a.__=__
	rv=fun.apply(null,arg)
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
