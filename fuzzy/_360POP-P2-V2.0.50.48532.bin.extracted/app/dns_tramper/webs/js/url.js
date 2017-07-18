/**
 * Created by lan on 14-1-14.
 */
$(document).ready(function(){
    $("body").mousedown(function(event){
        hide_msgbox();
    });
});
var reg_app_map = {
    url_form:[
        {id:"url",type:"url"}
    ]
};
function submitUrlInfo(){
    if(check_app_input("url_form")){
        var urlData="state="+ $('#status').val()+"&url="+$("#url").val();
        nos.app.net('./auth_info_set.cgi',urlData,showSuccessInfo);
    }
}
function submit_url_cancel(){
    document.getElementById('status_1').checked=true;
    change_status_value(1);
    $("#url").val("");
}
function change_status_value(value){
   $('#status').val(value);
}
function showSuccessInfo(data){
    if(data == "SUCCESS")
	{
		alert("设置成功！");
		init();
	}
        
    else
        alert(igd.make_err_msg(data));
}
function showInternetInfo(data){
    if(data["state"]==0){
        document.getElementById('status_0').checked=true;
        change_status_value(0);
    }
    else{
        document.getElementById('status_1').checked=true;
        change_status_value(1);
    }
    $("#url").val(data["url"]);
}
function  split_length(){
    document.getElementById("url").style.width="10em";
}
function  add_length(){
    var len_text=$("#url").val().length;
    if(len_text>=10){
        document.getElementById("url").style.width=Math.ceil(len_text/1.6)+"em";
    }
}
function change(){
    var len_text=$("#url").val().length;
    if(Math.ceil(len_text/1.6)>=parseInt(document.getElementById("url").style.width)){
        document.getElementById("url").style.width=Math.ceil(len_text/1.6)+"em";
    }
}
function init(){
    nos.app.net('./auth_info_get.cgi',"noneed=noneed",showInternetInfo);
}
init();
var initIdValue=window.setInterval("init()",60*1000);