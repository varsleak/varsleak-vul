var appHtml=appL.pptp_client.js,current_tab_name = [
	{tab_title:appHtml.tabTitle[0],tab_id:"pptp_client_setup_tab"},
	{tab_title:appHtml.tabTitle[1],tab_id:"pptp_client_status_tab"}
];

var reg_app_map = {
	pptp_client_setup_frm:[
		{id:"pptp_client_server_addr",type:"nin_ip_url"},
		{id: "pptp_client_server_port", type: "port"},
		{id: "pptp_client_user", type: "pptp_l2tp"},
		{id: "pptp_client_pass", type: "password_blank"},
		{id: "pptp_client_servernet", type: "ip"},
		{id: "pptp_client_servermask", type: "mask"}
	],
	noneed:[]
}
$(document).ready(function(){
	g_wan_num = igd.global_param.wan_number;
	initTab();
});


var pptp_client_setup_data = {};
function init_pptp_client_setup(){
    init_app_language(appL.pptp_client.pptp_client_setup);
	createComMode("pptp_client");
	if(g_wan_num == 1)
		$("#interface_layer").addClass("off");
	else
		$("#interface_layer").removeClass("off");
	nos.app.net('pptp_client_config_show.cgi', 'noneed=noneed', paint_pptp_client_setup_list);
	nos.app.net('../../universal_app/vpn_route_get.cgi','noneed=noneed',function(data){
		if(data.pptp_route_enable == "1")
			$("#vpn").prop("checked",true);
		else
			$("#vpn").prop("checked",false);
	});
	nos.app.resizePage();
}

function paint_pptp_client_setup_list(data){
	
	var len = data.length,statusStr= appHtml.pptpClinetFlag;
	var new_data = new Array();
	var pass="";
	var index = 1;
	var lengthKeyObj="";
	if(len>0){
		lengthKeyObj=parentEmt.get_rand_key(0,data[0].pass,true);
	}
	for(var i=0; i<len ; i++){
		var tmp = {};
		
		var state =(parseInt(data[i]['enable'])==1)?statusStr[0]:statusStr[1];
		
		tmp.id = index;
		tmp.enable = state;
		tmp.server = cutString(data[i].server,18);
		tmp.port = data[i].port;
		tmp.user = cutString(data[i].user,8);
        pass=parentEmt.getDAesString(data[i].pass,lengthKeyObj.rand_key);
        data[i].pass = pass;
		tmp.pass = cutString(pass,8);
		tmp.encrypt = data[i].encrypt == '1' ?statusStr[0]:statusStr[1];
		tmp.op = '<a onclick="pptp_client_setup_modify(\''+ index +'\')" title="'+ appCommonJS.btnTitle.edit +'" class="fun_link edit" href="javascript:void(0);">'+ appCommonJS.btnTitle.edit +'</a><a onclick="pptp_client_setup_delete(\''+ index +'\')" title="'+ appCommonJS.btnTitle.del +'" class="fun_link del" href="javascript:void(0);">'+ appCommonJS.btnTitle.del +'</a>';
		
		new_data.push(tmp);
		
		pptp_client_setup_data[index] = {};
		pptp_client_setup_data[index] = data[i];
		
		
		index++;
	}
	
	var tab = new window.top.Table("pptp_client_setup_list",appHtml.pptpClientSetupList,new_data);
	tab.initTable();
	nos.app.resizePage();
}

function pptp_client_set_change_state(index,value){
	var str = appHtml.changeInfo,info;
	info = str[parseInt(value,10)];
    show_dialog('info',function(){
        pptp_client_setup_modify(index);
        $("#pptp_client_enable_sel").val(value);
        pptp_client_setup_submit();
    })

}

function pptp_client_mode_sel(str){
	reg_app_map["pptp_client_setup_frm"][4] = {};
	reg_app_map["pptp_client_setup_frm"][5] = {};
	
	$("#pptp_client_servernet").val("");
	$("#pptp_client_servermask").val("");
	$('#pptp_client_mode_hidden').val(str);
	if(str == 'isp'){
		createIspMode("pptp_client");
		$('#enterprise_mode_layer').removeClass("on").addClass("off");
	}
	else{
		createComMode("pptp_client");
		$('#enterprise_mode_layer').removeClass("off").addClass("on");
		reg_app_map["pptp_client_setup_frm"][4].id = "pptp_client_servernet";
		reg_app_map["pptp_client_setup_frm"][4].type = "ip";
		reg_app_map["pptp_client_setup_frm"][5].id = "pptp_client_servermask";
		reg_app_map["pptp_client_setup_frm"][5].type = "mask";
	}
}

function set_mppe_128(){
	var obj = $("#mppe_128").get(0);
	if(obj.checked)
		$("#mppe_128_hidden").val("1");
	else
		$("#mppe_128_hidden").val("0");
}

function set_nat(){
	var obj = $("#nat").get(0);
	if(obj.checked)
		$("#nat_hidden").val("1");
	else
		$("#nat_hidden").val("0");
}


function createComMode(str){
	//set_uiname_select(str+"_interface","ALL");
	set_uiname_select(str+"_interface","WAN");
}
function createIspMode(str){
	set_uiname_select(str+"_interface","WAN");
}

function pptp_client_setup_modify(index){
	var param = pptp_client_setup_data[index];
	
	$("#save").html(appCommonJS.Button.edit);
	$('#cancel').show();
	$('#deal').val('mod');
	$('#old_id').val(param.id);
	
	select_chose_set("pptp_client_enable_sel",param.enable);
	$('#pptp_client_server_addr').val(param.server);
	$("#pptp_client_server_port").val(param.port);
	$('#pptp_client_user').val(param.user);
	$('#pptp_client_pass').val(parentEmt.getDAesString(param.pass));
	radio_sele_set('pptp_mode',param.mode);
	$('#pptp_client_mode_hidden').val(param.mode);        //工作模式     isp 为ISP模式  com为企业模式
	pptp_client_mode_sel(param.mode)
	$('#pptp_client_servernet').val(param.servernet);
	$('#pptp_client_servermask').val(param.servermask);
	$('#pptp_client_interface').val(param.uiname);
	var encrypt_val = param.encrypt == '1' ? true : false;
	$('#mppe_128').attr('checked',encrypt_val);
	$('#mppe_128_hidden').val(param.encrypt);
	var nat_val = param.enable_nat == '1' ? true : false;
	$('#nat').attr('checked',nat_val);
	$('#nat_hidden').val(param.enable_nat);
}

//区分是域名还是ip
function judge_ip_url(str){
    var flg=0;
    for(var h=0;h<str.length;h++){
       var  cmp="0123456789.";
        var tst=str.substring(h,h+1);
        if(cmp.indexOf(tst) < 0){
            flg++;
        }
    }
    if (flg != 0){//url
        return 0;
    }
    else{//ip
        return 1;
    }
}


function pptp_client_setup_submit(){
    //隐藏服务器网段默认去除 服务器掩码默认去除
    reg_app_map["pptp_client_setup_frm"][4] = {};
    reg_app_map["pptp_client_setup_frm"][5] = {};
	if(!check_app_input("pptp_client_setup_frm"))
			return;
	var ret = judge_ip_url($('#pptp_client_server_addr').val());
	$('#is_ipaddr').val(ret);
	if(ret == 1){
		var ip = $("#pptp_client_server_addr").val();
		$("#pptp_client_server_addr").val(fix_ip(ip));
	}
	nos.app.net('pptp_client_add.cgi','pptp_client_setup_frm',pptp_client_setup_callback);
}

function fix_ip(ip){
	var ip_arr = ip.split(".");
	for(var i in ip_arr){
		ip_arr[i] = parseInt(ip_arr[i]);
	}
	return ip_arr[0] + "." + ip_arr[1] + "." + ip_arr[2] + "." + ip_arr[3]
}

function pptp_client_setup_callback(data){
	if(data == "SUCCESS"){
		 show_message("success",appCommonJS.controlMessage.s_suc);
	}
	else{
		 show_message("error",igd.make_err_msg(data));
	}
	load_app_page(current_html,"init_"+current_html);
}


function pptp_client_setup_delete(index){
    show_dialog(appCommonJS.dialog.del_single,function(){
        var str = "";
        str += "id=" + pptp_client_setup_data[index].id;
        nos.app.net('pptp_client_del.cgi',str,pptp_client_setup_delete_callback);
    })}

function pptp_client_setup_delete_callback(data){
	if(data == "SUCCESS")
		 show_message("success",appCommonJS.controlMessage.d_suc);
	else
		 show_message("error",igd.make_err_msg(data));
	load_app_page(current_html,"init_"+current_html);
}


function pptp_client_clean_all(){
    show_dialog(appCommonJS.dialog.del_all,function(){
        nos.app.net('pptp_client_clean.cgi','nonneed=noneed',clear_pptp_client_setup_callback);
    })

}

function clear_pptp_client_setup_callback(data){
	if(data == "SUCCESS")
		 show_message("success",appCommonJS.controlMessage.d_suc);
	else
		 show_message("error",igd.make_err_msg(data));
	load_app_page(current_html,"init_"+current_html);
}

//pptp client status
function init_pptp_client_status(){
	window.top.hide_pop_layer("message_layer");
    window.top.hide_lock_div();
    init_app_language(appL.pptp_client.pptp_client_status);
	nos.app.net('pptp_client_status_show.cgi', 'noneed=noneed', init_pptp_client_status_list);
}

function init_pptp_client_status_list(data){
	var len = data.length,linkStr =appHtml.linStr;
	var new_data = new Array();
	var index = 1;
	for(var i=0; i<len ; i++){
		var tmp = {};			
		tmp.id = index;
		tmp.user = data[i].user;
		tmp.link_status = data[i].link_status == '1' ? linkStr[0]:linkStr[1];
		tmp.local_ip = data[i].local_ip;
		tmp.remote_ip = data[i].remote_ip;
		if(data[i].link_status == '0')
			tmp.operate = '<a class="fun_link link" title="'+linkStr[0]+'" href="javascript:void(0);" onclick="pptp_client_status_set(this,0,\''+data[i].id+'\')">'+linkStr[0]+'</a>';
		else
			tmp.operate = '<a class="fun_link unlink" title="'+linkStr[1]+'" href="javascript:void(0);" onclick="pptp_client_status_set(this,1,\''+data[i].id+'\')">'+linkStr[1]+'</a>';
		new_data.push(tmp);				
		index++;
	}
	var tab = new window.top.Table("pptp_client_status_list",appHtml.pptpClientStatusList,new_data);
	tab.initTable();
	nos.app.resizePage();
}

function pptp_client_status_set(element,state,id){
	if(!state)
		show_message("save");
	window.setTimeout(function(){
		if(state == 0){	
			nos.app.net('pptp_client_link.cgi', 'id='+id, init_pptp_client_status);
	
		}
		else{
			show_dialog(appHtml.shutLink,function(){
				nos.app.net('pptp_client_down.cgi', 'id='+id, init_pptp_client_status);
			})
	
		}
	},500);
}

function refresh_pptp_client_status(){
	show_message("refreshing");
	window.setTimeout(function(){
		init_pptp_client_status();
	},500);
}

function set_vpn(){
	var str = "";
	if($("#vpn").prop("checked"))
		str = "1";
	else
		str = "0";
	show_message("save");
	nos.app.net('../../universal_app/vpn_route_set.cgi','pptp_route_enable=' + str,function(data){
		if(data == "SUCCESS"){
			show_message("success");
		}
		else{
			show_message("error",igd.make_err_msg(data));
			if(str == "1")
				$("#vpn").prop("checked",false);
			else
				$("#vpn").prop("checked",true);
		}																		
	});
}
