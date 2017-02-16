"use strict"
var evil=require("../FuNc-evil.js").evil
var a={rt:require("../FuNc-rt.js")}
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
