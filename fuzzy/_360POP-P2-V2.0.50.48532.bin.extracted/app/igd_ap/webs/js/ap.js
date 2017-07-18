var appHtml=appL.igd_ap.js,current_tab_name = [
    {tab_title:appHtml.apTitle[0],tab_id:"ap_tab"},
	{tab_title:appHtml.apTitle[1],tab_id:"ap_list_tab"}
];
$(document).ready(function(){
    initTab();
});

//验证地图
var reg_app_map={
    ap_set_frm:[
        {id:"ap_ssid",type:"string"}
    ],
    ap_safe_frm:[
        {id:"ap_wpa_key",type:"password eq8_64"}
    ],
    speed_limit_frm:[
        {id:"upside",type:"ap_up_speed"},
        {id:"downside",type:"ap_down_speed"},
        {id:"access_number",type:"int"}
    ]
}
///////////////////////////////// 副ap无线设置
var ck_ap_data = {};
ck_ap_data.auth = "";
ck_ap_data.pwd = "";
ck_ap_data.answer = "";
ck_ap_data.upside = "";
ck_ap_data.downside = "";
ck_ap_data.access_number = "";
var MAX_FILE_NAME = 63 - 21;//21为路径长度 
//无线状态click设置
function ap_enable_set()
{
	var val = $("#ap_hidden").val();
    if(val=="0"){
        $("#ap_set_tab").addClass("off");
    }else{
        $("#ap_set_tab").removeClass("off");
    }
	select_chose_set("wls_mode_sel",ck_ap_data.auth,wireless_safe_mode_change);
    nos.app.resizePage();
}

function ap_auto_close_set(str){
	$("#ap_auto_close_hidden").val(str);
	if(str == "0"){
		$("#ap_auto_close").attr("checked",false);
	}
	else{
		$("#ap_auto_close").attr("checked",true);
	}
}

function set_ap_auto_close(obj){
	if($(obj).attr("checked"))
		$("#ap_auto_close_hidden").val("1");
	else
		$("#ap_auto_close_hidden").val("0");
}
//初始化副ap
function init_ap(){
	//bind_up_down_num();
	bind_limit_num();
	if(apIntervalId)
		clearInterval(apIntervalId);
    init_app_language(appL.igd_ap.ap);
    nos.app.net('wireless_ap_base.cgi', "action=get",init_ap_set_callback);
	window.top.jump_wifi_page();
}

function bind_up_down_num(){
	$("#upside,#downside").unbind("keyup focus").bind("keyup focus",function(){
		format_speed(true);
	});
}

function bind_limit_num(){
	$("#access_number").unbind("keyup focus").bind("keyup focus",function(){
		var ret = parentEmt.check_int($(this).val());
		if(ret == true){
			if($(this).val() > 10){
				$("#limit_hosts_tip").html(appHtml.tooLargeHost);
			}
			else{
				if($(this).val() == 0)
					$("#limit_hosts_tip").html(appHtml.zeroNotLimit);
				else
					$("#limit_hosts_tip").html("");
			}
		}
		else{
			$("#limit_hosts_tip").html(ret);
		}
	});
	$("#access_number").unbind("blur").bind("blur",function(){
		if($(this).val() * 1 != 0)
			$("#limit_hosts_tip").html("");
	});
}


//副ap无线设置初始化成功执行函数
function init_ap_set_callback(result){
	$("#ap_ssid").val(result.ssid);
	if(result.enable == "0")
		$("#wifi_tip").addClass("off");
	radio_set(result.enable,"ap");
	radio_set(result.host_isolation,"waln_partition");
	if(result.broadcast_ssid == "0")
		$("#ck_broadcast_ssid").prop("checked",true);
	else
		$("#ck_broadcast_ssid").prop("checked",false);
	$("#broadcast_ssid_hidden").val(result.broadcast_ssid);

	ap_auto_close_set(result.auto_close_enable);
	radio_set(result.limit_enable,"speed_limit");
    speed_limit_set();
	$("#upside").val(result.limit_up_speed);
	$("#downside").val(result.limit_down_speed);
	$("#access_number").val(result.limit_hosts_num);
	if(result.limit_hosts_num == "0"){
		$("#limit_hosts_tip").html(appHtml.zeroNotLimit);
	}
	else{
		$("#limit_hosts_tip").html("");
	}

    ck_ap_data.auth = result.auth_mode;
	if(result.answer != undefined){
		var lengthKeyObj0 = parentEmt.get_rand_key(0,result.answer,true);
		ck_ap_data.answer = parentEmt.getDAesString(result.answer,lengthKeyObj0.rand_key);
	}
	if(result.wpa_key != undefined){
		var lengthKeyObj0 = parentEmt.get_rand_key(0,result.wpa_key,true);
		ck_ap_data.pwd = parentEmt.getDAesString(result.wpa_key,lengthKeyObj0.rand_key);
	}
	ck_ap_data.upside = result.limit_up_speed;
	ck_ap_data.downside = result.limit_down_speed;
	ck_ap_data.access_number = result.limit_hosts_num;
	select_chose_set("wls_mode_sel",result.auth_mode,wireless_safe_mode_change);
	ap_enable_set();
}


function ap_broadcast_change(){
	if($("#ck_broadcast_ssid").prop("checked"))
		$("#broadcast_ssid_hidden").val("0");
	else
		$("#broadcast_ssid_hidden").val("1");
}

function wire_bas_ap_set(){
	var ap_hidden = $("#ap_hidden").val();
    var ap_model = $("#wls_mode_sel").val();
    var speed_hidden = $("#speed_limit_hidden").val();
    if(ap_hidden=="1"){
         if(!check_app_input("ap_set_frm")){
                return;
         }
        if(ap_model != "2" && ap_model != "3"){
            if(!check_app_input("ap_safe_frm")){
                return;
            }
        }
		if(speed_hidden != "0"){
			if(!check_app_input("speed_limit_frm")){
                return;
            }
		}
    }
    $("#save_btn").html(appCommonJS.Button.saving);
    show_message("save");
	//format_speed();
    nos.app.net('wireless_ap_base.cgi', 'ap_frm', function(result){
        if(result=="SUCCESS"){
            if(igd.global_param.is_5G && $("#ap_hidden").val() == "1")
				window.top.set_ap_timer_temp();
				show_message("success",appCommonJS.controlMessage.s_suc);
        }else{
            show_message("error",igd.make_err_msg(result));
        }
        init_ap();
    })
}

function format_speed(flag){
	if(flag == undefined){
		$("#upside").val(decimal(parseFloat($("#upside").val()),1));
		$("#downside").val(decimal(parseFloat($("#downside").val()),1));
	}
	if(parseFloat($("#upside").val()) >= 100)
		$("#upside").val(100.0);
	if(parseFloat($("#downside").val()) >= 100)
		$("#downside").val(100.0);
}

function decimal(num,v) {  
    var vv = Math.pow(10,v);  
    return Math.round(num*vv)/vv;  
}  

//副ap无线连接列表
var apIntervalId;
function init_ap_list(){
    init_app_language(appL.igd_ap.ap_list);
	init_ap_list_callback();
    if(apIntervalId)
        clearInterval(apIntervalId);
    apIntervalId = window.setInterval('init_ap_list_callback()', 2000);
}
function init_ap_list_callback(){
    nos.app.net("wireless_connect_list_show.cgi",'action=get', paint_tab_list)
}

var paint_tab_list_data = {}
function paint_tab_list(data){
    var data_new=new Array();
    var index = 1;
	for(var i in data){
		var str_5g = data[i].is_5g * 1 ? "<span>5G</span>":"";
		var str_rep = data[i].is_rep * 1 ? "<span>"+ parentEmt.L.is_repeater +"</span>":"";
		var tmp = {};
		tmp.id = index;
		tmp.name = cutString(data[i].s_name || data[i].host_name || appHtml.unknownDevice,20) + str_5g + str_rep;
		tmp.mac = data[i].mac;
		tmp.mode = get_bgn(data[i].mode);          //模式
		tmp.up_speed = window.top.formatSpeed(data[i].up_speed).allValue;
		tmp.down_speed = window.top.formatSpeed(data[i].down_speed).allValue;
		var time = window.top.getDateBySec(data[i].elapsed);
		tmp.second = time.days > 0 ? (time.days + appCommonJS.time.day) : "" + time.hours > 0 ? (time.hours + appCommonJS.time.hour) : "" + time.minute > 0 ? (time.minute + appCommonJS.time.min) : "";
		data_new.push(tmp);				
		index++;
	}

	var tab = new window.top.Table("ap_wireless_list",appHtml.apListHead,data_new);
	tab.initTable();
    nos.app.resizePage();
}

//安全模式onchange
function wireless_safe_mode_change(val)
{
	reg_app_map["ap_set_frm"][1] = {};
	if($("#ap_hidden").val() == "0"){
		$("#upload_file_layer").addClass("off");
		$("#re_pos_layer,.opt").css("top","0px");
	}
	else{
		if(val == "0") {
			$("#ap_wpa_key").val(ck_ap_data.pwd);
			$("#upload_file_layer").addClass("off");
			$("#set_psd").removeClass("off");
			$("#re_pos_layer,.opt").css("top","0px");
			$("#app_page").css("marginBottom","0px");
			$("#ap_wpa_key").attr("name","wpa_key");
			reg_app_map["ap_set_frm"][1].id = "ap_wpa_key";
			reg_app_map["ap_set_frm"][1].type = "password eq8_64";
		}
		else if(val == "1"){//网页认证
			$("#ap_wpa_key").val(ck_ap_data.answer);
			$("#upload_file_layer").removeClass("off");
			$("#set_psd").removeClass("off");
			if(has_name){
				$("#re_pos_layer").css("top","90px");
				$(".opt").css("top","70px");
				$("#app_page").css("marginBottom","40px");
			}
			else{//无图片名称
				$("#re_pos_layer,.opt").css("top","52px");
				$("#app_page").css("marginBottom","0px");
			}
			$("#ap_wpa_key").attr("name","answer");
			reg_app_map["ap_set_frm"][1].id = "ap_wpa_key";
			reg_app_map["ap_set_frm"][1].type = "string";
		}
		else{//无密码认证
			$("#upload_file_layer").addClass("off");
			$("#set_psd").addClass("off");
			$("#re_pos_layer,.opt").css("top","0px");
			$("#app_page").css("marginBottom","0px");
			$("#ap_wpa_key").attr("name","wpa_key");
		}
	}
    nos.app.resizePage();
}


function get_bgn(v)
{
    var str = '';
    switch(v){
        case '0' : str = ' ';break;
        case '1' : str = ' (a)';break;
        case '2' : str = ' (b)';break;
        case '3' : str = ' (a+b)';break;
        case '4' : str = ' (g)';break;
        case '5' : str = ' (a+g)';break;
        case '6' : str = ' (b+g)';break;
        case '7' : str = ' (a+b+g)';break;
        case '8' : str = ' (n)';break;
        case '9' : str = ' (a+n)';break;
        case '10' : str = ' (b+n)';break;
        case '11' : str = ' (a+b+n)';break;
        case '12' : str = ' (g+n)';break;
        case '13' : str = ' (a+g+n)';break;
        case '14' : str = ' (b+g+n)';break;
        case '15' : str = ' (a+b+g+n)';break;
		case '16' : str = ' (ac)';break;
    }
    return str;
}

//访客网络限速开关

function speed_limit_set(){
    var val = $("#speed_limit_hidden").val();
    if(val=="0"){
        $("#speed_limit_tab").addClass("off");
		$("#upside").val(ck_ap_data.upside);
		$("#downside").val(ck_ap_data.downside);
		$("#access_number").val(ck_ap_data.access_number);
    }else{
        $("#speed_limit_tab").removeClass("off");
    }
    nos.app.resizePage();
}

function advance_toggle(){
	$("#advance_layer").toggle();
	nos.app.resizePage();
}