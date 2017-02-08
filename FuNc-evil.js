"use strict"
var v,a
var df=/\s*([\w\$]+|[^\s\w\$]+)/g
class EOF{}
function setv(pv){
	v=pv
	df.lastIndex=0
}
function getv(){
	return v
}
function seta(pa){
	a=pa
}
function geta(){
	return a
}
function nxttok(){
	var rst=df.exec(v)
	if(rst===null)
		throw new EOF()
	return rst[1]
}
var get_lookup=function(obj){
	return obj.rt.lookup
}
function nxtfun(){
	var tok,fun,len,arg,ifo
	tok=nxttok()
	ifo=get_lookup(a)(a,tok)
	fun=ifo.func
	len=ifo.len
	arg=[]
	while(len--)
		arg.push(nxtfun())
	return fun.apply(null,arg)
}
function evil(pv,pa){
	var rv
	setv(pv)
	if(pa!=null)
		seta(pa)
	try{
		while(true)
			rv=nxtfun()
	}catch(err){
		if(!(err instanceof EOF))
			throw err
	}
	return rv
}
module.exports=new class{
	get EOF(){
		return EOF
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
}
