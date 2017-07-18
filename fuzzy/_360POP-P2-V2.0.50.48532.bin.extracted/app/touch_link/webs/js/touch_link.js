var appHtml=appL.touch_link.js,current_tab_name = [
	{tab_title:appHtml.tabTitle[0],tab_id:"touch_set_tab"},
    {tab_title:appHtml.tabTitle[1],tab_id:"wireless_list_tab"}
];

var reg_app_map = {
    noneed: []
};

var switch_status_arr = [
	{statestr: appHtml.switch_status_arr[0], radiostr_css: "radio_off",textstr_css: "#ff0000"},
	{statestr: appHtml.switch_status_arr[1], radiostr_css: "radio_on",textstr_css: "#418aee"}
];

var USER_LIST_TIMER = 5;
$(document).ready(function () {
	//initTab();
	start_touch();
});

function start_touch(){
	nos.app.net('./ql_get_conf.cgi', 'noneed=noneed', function(ret){
		if(ret.err_no == "0" && ret["data"].length != 0){
			var switchVal = ret.data[0]["switch"];
			if(switchVal == 1){
				//get_touch_push_page();
				paint_tabs();
			}
			else{
				get_touch_switch_page();
			}
		}
		else{
			show_message("error",appHtml.InitError);
		}
	});
}

function get_touch_switch_page(){
	$.ajax({
        type: "get",
        url: "./touch_switch.html",
        dataType: "html",
        error: function (XMLHttpRequest, textStatus) {
            window.top.open("/", "_self");
        },
        success: function (ret) {
            if (ret.indexOf("360LoginFlag") != -1) {
                window.top.open("/", "_self");
            }
			$(".tab_area,#app_page").hide();
            var _this = $("#guide_cnt");
            _this.html(ret);
			init_app_language(appL.touch_link.touch_switch);
			nos.app.resizePage();
        }
    });
}

function get_touch_push_page(){
	$.ajax({
        type: "get",
        url: "./touch_push.html",
        dataType: "html",
        error: function (XMLHttpRequest, textStatus) {
            window.top.open("/", "_self");
        },
        success: function (ret) {
            if (ret.indexOf("360LoginFlag") != -1) {
                window.top.open("/", "_self");
            }
			$(".tab_area,#app_page").hide();
            var _this = $("#guide_cnt");
            _this.html(ret);
			init_app_language(appL.touch_link.touch_push);
			nos.app.resizePage();
        }
    });
}

function paint_tabs(){
	$(".tab_area,#app_page").show();
	$("#guide_cnt").html("").hide();
	initTab();
	nos.app.resizePage();
}

function open_touch_link(){
	show_message("save");
	nos.app.net('./ql_set_switch.cgi', "switch=1", open_touch_link_callback);
}
function open_touch_link_callback(data){
	if (data.err_no == "0"){
        show_message("success", appCommonJS.controlMessage.s_suc);
			//get_touch_push_page();
		paint_tabs();
		if(igd.global_param.is_5G)
			window.top.set_ap_timer_temp();
	}
    else{
        show_message("error", appCommonJS.controlMessage.s_fail);
	}
}


function push_auth(value){
	show_message("save");
	$("#push_hidden").val(value);
	nos.app.net('./ql_set_link.cgi', 'def=1', push_auth_submit_callback);
}

function push_auth_submit_callback(data){
	if (data.err_no == "0"){
        show_message("success", appCommonJS.controlMessage.s_suc);
		$(".tab_area,#app_page").show();
		$("#guide_cnt").html();
		initTab();
	}
    else{
        show_message("error", appCommonJS.controlMessage.s_fail);
	}
}

var get_list_timer;
function init_touch_set(){
    init_app_language(appL.touch_link.touch_set);
	nos.app.net('./ql_get_conf.cgi', 'noneed=noneed', touch_set_callback);
	nos.app.net('./ql_get_list.cgi', 'noneed=noneed', paint_user_list);
	get_user_list_loop();
	window.top.jump_wifi_page();
}

function get_user_list_loop(){
	if(get_list_timer)
		window.clearInterval(get_list_timer);
	get_list_timer = window.setInterval(function(){
		if(current_html == "touch_set")
			nos.app.net('./ql_get_list.cgi', 'noneed=noneed', paint_user_list);
		else
			window.clearInterval(get_list_timer);
	},USER_LIST_TIMER*1000);
}

function touch_set_callback(ret){
	if (ret.err_no == "0"){
		var mac = ret["data"][0]["ssid"].split("-")[1];
		$("#link_name").html(appHtml.ssid_name + "-" + mac);
		var switch_status = ret["data"][0]["switch"];
		$("#switch_ctr").attr("class","radio_form " + switch_status_arr[switch_status]["radiostr_css"]);
		$("#switch_status").html(switch_status_arr[switch_status]["statestr"]).css("color",switch_status_arr[switch_status]["textstr_css"]);
		
		var push_status = ret["data"][0]["def_link"];
		$("#push_mode_text").html(appHtml.push_status_arr[push_status]["statestr"]);
		$("#push_mode_link").html(appHtml.push_status_arr[push_status]["linkstr"]);
		if(push_status == 1){//无需认证
			$("#push_mode_link").attr("name","0");
		}
		else{
			$("#push_mode_link").attr("name","1");
		}
		if(switch_status == 0){
			$("#wifi_tip").addClass("off");
			$("#push_mode_layer").removeClass("on").addClass("off");
			$("#link_wrapper").removeClass("on").addClass("off");
		}
		else{
			$("#push_mode_layer").removeClass("off").addClass("on");
			$("#link_wrapper").removeClass("off").addClass("on");
			if(push_status == 1)
				$("#table_layer").removeClass("on").addClass("off");
			else
				$("#table_layer").removeClass("off").addClass("on");
		}
	}
    else{
        show_message("error", appCommonJS.controlMessage.s_fail);
	}
}

function paint_user_list(ret){
	if(ret == undefined)
		return;
	if(ret.err_no == "0" && ret["data"].length != 0){
		var list = ret.data;
		var len = list.length;
		var new_data = [];
		for(var i = 0; i < len; i++){
			if(list[i].mode == 0 || list[i].mode == 4){
				var tmp = {};
				tmp.hostname = cutString(list[i].hostname || appHtml.unknownDevice,20);
				tmp.mac = list[i].mac.toUpperCase();
				tmp.type = appHtml.mode_type[list[i].mode];
				if(list[i].mode == 0){
					tmp.operate = '<a class="fun_link del" title="'+ appHtml.rejectLink +'" href="javascript:void(0);" onclick="mode_type_modify(\''+ tmp.mac  +'\',0);">'+ appHtml.rejectLink +'</a>';
					tmp.operate += '<a class="fun_link edit" title="'+ appHtml.confirmLink +'" href="javascript:void(0);" onclick="mode_type_modify(\''+ tmp.mac  +'\',1);">'+ appHtml.confirmLink +'</a>';
				}
				else if(list[i].mode == 4){
					tmp.operate = '<a class="fun_link disabled" title="'+ appHtml.rejectedLink +'" href="javascript:void(0);" >'+ appHtml.rejectedLink +'</a>';
					tmp.operate += '<a class="fun_link edit" title="'+ appHtml.confirmLink +'" href="javascript:void(0);" onclick="mode_type_modify(\''+ tmp.mac  +'\',1);">'+appHtml.confirmLink +'</a>';
				}
				new_data.push(tmp);
			}
		}
		if(new_data.length != 0){
			var tab = new window.top.Table("auth_list_tab",appHtml.user_list,new_data,1,10);
			window.setTimeout(function(){
				tab.initTable();
			},200);
		}
		else{
			no_user_tab_dom();
			nos.app.resizePage();
		}
	}
	else{
		no_user_tab_dom();
		nos.app.resizePage();
	}
}

function no_user_tab_dom(){
	$("#auth_list_tab").html("");
	var $tbody = $("<tbody/>");
	var $tr = $("<tr/>");
	var $td = $("<td/>");
	$td.attr("style","text-align:center");
	$td.html(appHtml.noUserHope);
	$tr.append($td);
	$tbody.append($tr);
	$("#auth_list_tab").append($tbody);
}

function mode_type_modify(mac,type){
	var str = "mac=" + mac + "&mode=" + type;
	show_message("save");
	nos.app.net('./ql_add_user.cgi', str, mode_type_modify_callback);
}

function mode_type_del(mac){
	var str = "mac=" + mac + "&mode=0";
	show_message("save");
	nos.app.net('./ql_add_user.cgi', str, mode_type_del_callback);
}


function mode_type_modify_callback(data){
	if (data.err_no == "0"){
        show_message("success", appCommonJS.controlMessage.e_suc);
		nos.app.net('./ql_get_list.cgi', 'noneed=noneed', paint_user_list);
	}
    else{
        show_message("error", appCommonJS.controlMessage.e_fail);
	}
}


function mode_type_del_callback(data){
	if (data.err_no == "0"){
        show_message("success", appCommonJS.controlMessage.s_suc);
		nos.app.net('./ql_get_list.cgi', 'noneed=noneed', paint_user_list);
	}
    else{
        show_message("error", appCommonJS.controlMessage.s_fail);
	}
}

var _status = "";
function touch_switch_submit() {
	var _css = $("#switch_ctr").attr("class");
	var str = "switch=";
	if(_css.indexOf(switch_status_arr[0]["radiostr_css"]) != -1){
		str += "1";
		_status = 1;
	}
	else{
		str += "0";
		_status = 0;
	}
	show_message("save");
	nos.app.net('./ql_set_switch.cgi', str, touch_switch_submit_callback);
}

function touch_switch_submit_callback(data){
	if (data.err_no == "0"){
        show_message("success", appCommonJS.controlMessage.s_suc);
		current_tab_name = [];
		current_tab_name[0] = {};
		current_tab_name[0].tab_title = appHtml.tabTitle[0];
		current_tab_name[0].tab_id = "touch_set_tab";
		if(_status == 1){
			current_tab_name[1] = {};
			current_tab_name[1].tab_title =appHtml.tabTitle[1];
			current_tab_name[1].tab_id = "wireless_list_tab";
		}
		initTab();
		if(igd.global_param.is_5G && _status == "1")
			window.top.set_ap_timer_temp();
	}
    else{
        show_message("error", appCommonJS.controlMessage.s_fail);
	}
}

function push_mode_submit(){
	show_message("save");
	var str = "def=" + $("#push_mode_link").attr("name");
	nos.app.net('./ql_set_link.cgi', str, push_mode_callback);
}

function push_mode_callback(data){
	show_message("save");
	if (data.err_no == "0"){
        show_message("success", appCommonJS.controlMessage.s_suc);
		init_touch_set();
	}
    else{
        show_message("error", appCommonJS.controlMessage.s_fail);
	}
}

var wireless_list_timer;
var mode_type = ["正在验证","通过验证未连接","连接","断开","拉入黑名单"];
function init_wireless_list(){
    init_app_language(appL.touch_link.wireless_list);
	nos.app.net('./ql_get_list.cgi', 'noneed=noneed', wireless_list_callback);
	wireless_list_loop();
}

function wireless_list_loop(){
	if(wireless_list_timer)
		clearInterval(wireless_list_timer);
	wireless_list_timer = window.setInterval(function(){
		if(current_html == "wireless_list")
			nos.app.net('./ql_get_list.cgi', 'noneed=noneed', wireless_list_callback);
		else
			clearInterval(wireless_list_timer);
	},1000);
}

function wireless_list_callback(ret){
	if(ret == undefined)
		return;
	if(ret.err_no == "0"){
		var list = ret.data;
		var len = list.length;
		var index = 1;
		var new_data = [];
		for(var i = 0; i < len; i++){
			var str = list[i].is_5g * 1 ? "<span>5G</span>":"";
			if(list[i].mode == 2){
				var tmp = {};
				tmp.id = index;
				tmp.name = cutString(list[i].hostname || appHtml.unknownDevice,20) + str;
				tmp.mac = list[i].mac.toUpperCase();
				tmp.up_speed = window.top.formatSpeed(list[i].up_speed).allValue;
				tmp.down_speed = window.top.formatSpeed(list[i].down_speed).allValue;
				var time = window.top.getDateBySec(list[i].second);
				tmp.second = time.days > 0 ? (time.days + appCommonJS.time.day) : "" + time.hours > 0 ? (time.hours + appCommonJS.time.hour) : "" + time.minute > 0 ? (time.minute + appCommonJS.time.min) : "";
				new_data.push(tmp);				
				index++;
			}
		}
		
		var tab = new window.top.Table("wireless_list_table",appHtml.wireless_list,new_data);
		tab.initTable();
		nos.app.resizePage();
	}
	else{
		show_message("error",appHtml.getUserListFailure);
	}
}
