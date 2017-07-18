function CreateScript(src){
    document.writeln("<script src=\"" + src + "\"></script>")
}
var b = new Base64();
function show(result){  
    content = b.decode(result)
    document.write(content)
}  

var str1,str2,str3,str4,str5; 
function getQueryString(){/*name*/
/*    var reg = new RegExp("(^|&)" + name + "=([^&]*)(&|$)", "i")
    var du = unescape( window.location.search.substr(1) )
    var r = du.match(reg)
    if (r != null) return unescape(r[2]); return null*/
/*	var du = unescape( window.location.search.substr(1) );
	var r = du.substring(2,du.length);
	return unescape(r);*/
	
	var temp=decodeURIComponent(location.toString());
	var temp_arr = temp.split("?");
	var param_str = "";
	for(var i = 1; i < temp_arr.length; i++){
		param_str += temp_arr[i]+"?";
	}
	param_str = param_str.substring(0,param_str.length-1);
	var param_arr = param_str.split("&");
	for(var j = 0; j < param_arr.length; j++){
		if(param_arr[j].split("=")[0] == "t"){
			str1 = param_arr[j].split("=")[1];
		}
		if(param_arr[j].split("=")[0] == "url"){
			str2 = param_arr[j].split("=")[1];
		}
		if(param_arr[j].split("=")[0] == "ip"){
			str3 = param_arr[j].split("=")[1];
		}
		if(param_arr[j].split("=")[0] == "gw"){
			str4 = param_arr[j].split("=")[1];
		}
		if(param_arr[j].split("=")[0] == "sign"){
			str5 = param_arr[j].split("=")[1];
		}
	}
	$.post("/app/devices/webs/push_black_url.cgi",{t:str1,url:str2},function(data){});
}

getQueryString();

/*var strs = getQueryString("t").split("&");
var str1,str2,str3,str4; 
str1 = strs[0];
str2 = strs[1].substring(4);
str3 = strs[2].substring(3);
str4 = strs[3].substring(3);
str5 = strs[4].substring(5);*/

CreateScript("http://info.wd.360.cn/warn/qr.php?s="+escape(str2)+"&i="+escape(str3)+"&g="+escape(str4)+"&c=show&m="+escape(str5)+"&p=360")
