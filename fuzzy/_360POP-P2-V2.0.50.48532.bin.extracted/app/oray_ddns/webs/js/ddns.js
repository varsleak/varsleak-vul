/**
 * Created by lan on 13-12-6.
 */
var appHtml=appL.oray_ddns.js,
    reg_app_map = {
        ddnsform: [
            {id: "user_id", type: "char"},
            {id: "user_password", type: "string"}
        ],
        noneed: []
    };
$(document).ready(function () {
    init_app_language(appL.oray_ddns);
    ddns_init();
});

var ck_ddns_data = {};
//改变隐藏表单的值---动态域名服务(DDNS)状态
function change_ddns_enable() {
	$('#user_id').val(ck_ddns_data.user);
	$('#user_password').val(ck_ddns_data.pwd);
    var flag = $('#ddns_radio_status_hidden').val();
    if (flag == 0) {
        $('#user_id').attr("disabled", true);
        $('#user_password').attr("disabled", true);
    }
    else {
        $('#user_id').attr("disabled", false);
        $('#user_password').attr("disabled", false);
    }
}

/*submitSetData 提交函数  */
function submitSetData(){
	if($('#ddns_radio_status_hidden').val()==1){
		if(!check_app_input("ddnsform"))
			return;
	}
	show_message("save");
	nos.app.net('./igd_ddns.cgi','ddnsform',ddns_submit_callback);
}

function ddns_init(){
	$("#oray_link").attr("href","http://www.oray.com");
    nos.app.net('./igd_ddns.cgi','noneed=noneed&action=get',set_ddns);
}

function ddns_submit_callback(data){
	if(data == "SUCCESS")
		show_message("success", appCommonJS.controlMessage.c_suc);
	else
		show_message("error", igd.make_err_msg(data));
	ddns_init();
}
 /*
 set_ddns函数初始化表单的值
  dnsData   表单的值Json
  */
var ddns_timer;
function set_ddns(data){
/*    var radioObj=['ddns_status_1','ddns_status_0'];
	if(data.WAN0.enable0==0){
		$("#" + radioObj[1]).attr("checked",true);
		$("#" + radioObj[0]).attr("checked",false);
	}
	else {
		$("#" + radioObj[0]).attr("checked",true);
		$("#" + radioObj[1]).attr("checked",false);
	}*/
	ck_ddns_data.user = data.WAN0.user_id0;
	ck_ddns_data.pwd = window.top.getDAesString(data.WAN0.password0);
	radio_set(data.WAN0.enable0,"ddns_radio_status");
	change_ddns_enable();
	
    show_status(data);
	
	if(ddns_timer)
		clearInterval(ddns_timer);
	ddns_timer = window.setInterval(function(){
		show_status_loop();
	},2000);
	
}

function show_status_loop(){
	 nos.app.net('./igd_ddns.cgi','noneed=noneed&action=get',show_status_callback);
}

function show_status_callback(ret){
	show_status(ret);	
}

function show_status(ret){
	if(ret.WAN0.status_info0 == ""){
		$("#ddns_status").html("");
    }
	else{
		var ddns_map_index = ret.WAN0.status_info0.split(',');
		var domainStr = "";
		if(ret.WAN0.domain0 != "")
        	domainStr = appHtml.urlName + ret.WAN0.domain0;
        $('#ddns_status').html(appHtml.ddns_map[ddns_map_index[0]] + domainStr);
	}
    nos.app.resizePage();
}