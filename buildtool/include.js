var fs=require("fs")
var fn=process.argv[2]
var str=fs.readFileSync(fn,{encoding:"utf8"})
str=str.replace(/\r\n|\r|\n/g,"\n")
var arr=str.split("\n")
var ln
var reg=/^\/\/#include (.*)$/
var pms=[]
arr.forEach(function(ln,i){
	var rst=reg.exec(ln)
	if(rst===null) return
	pms.push(new Promise(function(suc,fal){
		fs.readFile(rst[1],{encoding:"utf8"},function(err,str){
			if(err)
				fal(err)
			arr[i]=";"+str.replace(/\r\n|\r|\n/g,"\n")+";"
			suc()
		})
	}))
})
Promise.all(pms).then(function(){
	process.stdout.write(arr.join("\n"),"utf8")
})
