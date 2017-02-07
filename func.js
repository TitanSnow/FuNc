function func(v,a){
	"use strict"
	v=String.prototype.slice.call(v)
	function nxttok(){
		var df=/^\s*([A-Za-z_\$][A-Za-z0-9_\$]*)/g
		var ndf=/^\s*(\S+)/g
		var rst
		rst=df.exec(v)
		if(rst!==null){
			v=v.slice(df.lastIndex)
			df.lastIndex=0
			return rst[1]
		}else{
			df.lastIndex=0
			rst=ndf.exec(v)
			if(rst!==null){
				v=v.slice(ndf.lastIndex)
				ndf.lastIndex=0
				return rst[1]
			}else{
				ndf.lastIndex=0
				return null
			}
		}
	}
	var suc=false
	function nxtfun(){
		var tok,fun,len,arg
		if((tok=nxttok())===null){suc=true;return null}
		fun=a[tok]
		if(fun==null)
			throw new Error(tok+" undefined")
		if(fun.funclen!=null)
			len=fun.funclen()
		else
			len=fun.length
		arg=[]
		while(len--){
			arg.push(nxtfun())
		}
		return fun.apply(null,arg)
	}
	var rv,rrv
	while((rv=nxtfun())!==null||!suc) rrv=rv
	return rrv
}
