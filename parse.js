"use strict"
module.exports=parse
function parse(str){
    var df=/\s*([\w\$]+|[^\s\w\$]+)/g
    var rst
    var lst=[]
    while((rst=df.exec(str))!==null){
        lst.push(rst[1])
    }
    return lst
}
