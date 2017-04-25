"use strict"
module.exports=eval_func
function eval_func(lst,namer){
    var nxttok=(()=>{
        var cur=0
        return ()=>lst[cur++]
    })()
    class Unfinished{}
    function nxtfun(toplevel){
        var tok=nxttok()
        if(tok===null)
            throw new Unfinished()
        var func=namer(tok)
        var func_len=func.length
        var args=[]
        while(func_len--){
            args.push(nxtfun())
        }
        return func.apply(null,args)
    }
    return nxtfun()
}
