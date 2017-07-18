//无线基本设置
var WIFI_NORMAL_SET_TIME = 9;//9+3
var WIFI_SET_CHANNEL_TIME = 5;
var WIFI_CHANNEL_CHANGE_TIME = WIFI_NORMAL_SET_TIME + WIFI_SET_CHANNEL_TIME;
var ck_ssid = {};
var compare_2_4_obj = {};
var compare_5_obj = {};

var wirelessTabData = {
	parent:"wireless_type_layer",
	child:[
		 {name:"wireless_2_4_layer",func:"init_wireless_base_2_4"},
		 {name:"wireless_5_layer",func:"init_wireless_base_5"}
	]
};

function init_wireless_base(){
	jump_wifi_page();
	if(!ROUTE_INFO.is_5G){
		$("#wireless_type_layer").addClass("section_hide");
		$(".form-border-shadow").removeClass("has-tab");
		$("#warning_count_center").removeClass("section_hide");
		$("#same_layer").addClass("section_hide");
		$("#lbl_2_4_wireless_status").html(L.wifi_status);
		init_wireless_base_2_4();
	}
	else{
		$("#wireless_type_layer").removeClass("section_hide");
		$(".form-border-shadow").addClass("has-tab");
		$("#warning_count_center").addClass("section_hide");
		//隐藏漫游功能
		//$("#same_layer").removeClass("section_hide");
		$("#same_layer").addClass("section_hide");
		$("#lbl_2_4_wireless_status").html(L.wifi_2_4_status);
		var tab = new igd.ui.Tab(wirelessTabData);
		tab.init();
	}
}



var ck_wireless_param = {};
ck_wireless_param.param_2_4_5_basic_submit = {};
ck_wireless_param.param_2_4_5_advance_submit = {};

function init_wireless_base_2_4() {
	if($("#wisp_channel_2_4_tip").length > 0){
		$("#wisp_channel_2_4_tip").remove();
	}
	if($("#wisp_channel_width_2_4_tip").length > 0){
		$("#wisp_channel_width_2_4_tip").remove();
	}
	$("#wireless_base_2_4_channel_sel").parent().append("<span id=\"wisp_channel_2_4_tip\"></span>");
	$("#wlb_2_4_channel_width_sel").parent().append("<span id=\"wisp_channel_width_2_4_tip\"></span>");
	compare_2_4_obj = {};
    init_text_event();
    ajaxAsync(false);
	init_wireless_base_show("2_4");
    init_wireless_sec_show("2_4");
	if(ROUTE_INFO.is_5G){
		init_wireless_base_show("2_4_5");
		init_wireless_base_show("5",true);
		init_wireless_sec_show("5",true);
	}
	ajaxAsync(true);
	check_ssid_pwd();
//    ========= 逻辑冲突！所以单独把click的函数独立出来。
    wireless_2_4_enable_func();
}
function wireless_2_4_enable_func(){
    $("#wireless_2_4_enable").unbind("click").bind("click",function(){
        radio_toggle(this,function(){
            var val = $("#wireless_2_4_enable_hidden").val();
            wireless_state_change(val,"2_4");
        });
    });
}

function check_ssid_pwd(){
	if(ck_wireless_param.param_2_4_5.wire_enable == "1"){
		$("#same").prop("checked",true);
		ck_wireless_param.param_2_4_5.check = true;
	}
	else{
		$("#same").prop("checked",false);
		ck_wireless_param.param_2_4_5.check = false;
	}
}

function init_wireless_base_show(type,flag) {//是不是漫游，漫游需要同步5G数据
	var dom_str = "";
	var obj1 = {};
	
    obj1.network_mode = 999;
	if(type == "2_4"){
    	obj1.port_id = "WIFI1";
		obj1.ap_id = 0;
		dom_str = "2_4";
	}
	else if(type == "5"){
		obj1.ap_id = 0;
		obj1.port_id = "WIFI2";
		dom_str = "5";
	}
	else if(type == "2_4_5"){//2.4G与5G相同
		obj1.ap_id = 3;
		obj1.port_id = "WIFI2";
	}
    $.post("/router/wireless_base_show.cgi", obj1, function (data1) {
        var data1 = dataDeal(data1);
		if(flag){
			$.extend(ck_wireless_param.param_2_4_5_basic_submit,data1);
			return;
		}
		if(type == "2_4_5"){
			//全局变量保存值
			ck_wireless_param.param_2_4_5 = {};
			ck_wireless_param.param_2_4_5.check = "";
			ck_wireless_param.param_2_4_5.wire_enable = data1.wire_enable;
			$.extend(compare_5_obj,data1);
		}
		else{
			if(type == "2_4")
				$.extend(compare_2_4_obj,data1);
			else if(type == "5")
				$.extend(compare_5_obj,data1);
			
			if (data1.AP_SSID != "") {
				$("#wire_" + dom_str + "_ssid").removeClass().addClass("input-text").val(data1.AP_SSID);
				ck_ssid.ssid = {};
				ck_ssid.ssid = data1.AP_SSID;
			}
	
			$("#wire_" + dom_str + "_mac_hidden").val(data1.wire_mac);
	
			$("#wireless_base_" + dom_str +"_channel_sel").val(data1.channel_num);
			//去掉自动信道上追加的实际信道的文字
			$("#wireless_base_" + dom_str +"_channel_sel option").eq(0).text(L.auto);
			$("#wlb_" + dom_str + "_channel_width_sel").val(data1.channel_width);
			
			if(type == "5"){
				channel_sel_change(data1.channel_width);
				channel_width_change(data1.channel_num,data1.status_channel_num);
			}
			//选中值并且加上自动
			if(data1.channel_num == "0" && data1.status_channel_num != "0"){
				$("#wireless_base_" + dom_str +"_channel_sel option:selected").text(L.auto + " (" + L.channel + " " + data1.status_channel_num + ")");
			}
			//radio_sele_set("side_band", data1.channel_band);
			wlb_side_band_change(data1.channel_band,dom_str);
			
			set_ssid_broadcast(data1.SSID_broadcast,dom_str);
			
			radio_set(data1.wire_enable,"wireless_"+ dom_str +"_enable");
			wireless_state_change(data1.wire_enable,dom_str);
		}
    });
}

var ck_wireless_key = [];
function init_wireless_sec_show(type,flag) {
	var obj2 = {};
    obj2.ap_id = 0;
    obj2.ap_mode = 0;
	if(type == "2_4"){
    	obj2.port_id = "WIFI1";
		ck_wireless_key.wpa_key_2_4 = "";
		ck_wireless_key.mode_2_4 = "";
	}
	else if(type == "5"){
		obj2.port_id = "WIFI2";
		ck_wireless_key.wpa_key_5 = "";
		ck_wireless_key.mode_5 = "";
	}
    $.post("/router/wireless_sec_show.cgi", obj2, function (data2) {
        var data2 = dataDeal(data2);
		if(type == "2_4")
			$.extend(compare_2_4_obj,data2);
		else if(type == "5")
			$.extend(compare_5_obj,data2);
		var lengthKeyObj=get_rand_key(0,data2.wep_key,true);
		data2.wep_key = getDAesString(data2.wep_key,lengthKeyObj.rand_key);
		data2.wpa_key = getDAesString(data2.wpa_key,lengthKeyObj.rand_key);
		if(flag){
			$.extend(ck_wireless_param.param_2_4_5_advance_submit,data2);
			return;
		}
		if(type == "2_4"){
			ck_wireless_key.wpa_key_2_4 = data2.wpa_key;
			ck_wireless_key.mode_2_4 = data2.ap_mode;
			compare_2_4_obj.wpa_key = data2.wpa_key;
		}
		else{
			ck_wireless_key.wpa_key_5 = data2.wpa_key;
			ck_wireless_key.mode_5 = data2.ap_mode;
			compare_5_obj.wpa_key = data2.wpa_key;
		}
		$("#wls_"+ type +"_ap_mode_sel").val(data2.ap_mode);
		
		wireless_security_ap_change(data2.ap_mode,type);
		if (data2.wpa_key != "") {
			$("#wireless_"+ type +"_key_val").removeClass().addClass("input-text").val(eval("ck_wireless_key.wpa_key_"+ type));
		}
    });
   wireless_pwd_limit(type);
}

function wireless_pwd_limit(type){
	//限速输入框输入判定
	$("#wireless_"+ type +"_key_val").unbind("keyup").bind("keyup", function () {
        var ret = get_msgbox("wireless_"+ type +"_key_val","password");
		if(!ret)
			remove_ck_pwd("wireless_"+ type +"_key_val");
		return false;
    });
	
/*    $("#wireless_"+ type +"_key_val").unbind("keyup").bind("keyup", function () {
        var value = $(this).val();
        var reg = /[\u00FF-\uFFFF]+/;
        $(this).val(value.replace(reg, ""));
		$(this).focus();
        return false;
    });*/
}

function wireless_state_change(str,type) {
    $("#wire_"+ type +"_ssid").removeClass().addClass("input-text");
    $("#wire_"+ type +"_ssid").val(ck_ssid.ssid);
    $("#wls_"+ type +"_ap_mode_sel").val(eval("ck_wireless_key.mode_" + type));
	wireless_security_ap_change(eval("ck_wireless_key.mode_" + type),type);
	$("#wireless_"+ type +"_key_val").val(eval("ck_wireless_key.wpa_key_" + type));
	
    $("#wireless_"+ type +"_enable_hidden").val(str);
    if (str == "1") {
        section_disable("wireless_base_"+ type +"_layer", false);
		init_channel_choose("enable",type);
    }
    else {
		$("#wifi_" + type + "_tip").addClass("section_hide");
        section_disable("wireless_base_"+ type +"_layer", true);
		init_channel_choose("disable",type);
    }
	
	//添加wisp判断
	$.post("/app/igd_wisp/wireless_sta_mode.cgi",{action:"get"},function(data){
		data = dataDeal(data);
		if(data.enable == "1" && data.status == "1" && str == "1"){
			if((type == "2_4" && data.channel < 15) || (type == "5" && data.channel > 15)){
				$("#wireless_base_"+ type +"_channel_sel").attr("disabled",true);
				$("#wlb_"+ type +"_channel_width_sel").attr("disabled",true);
				$("#wire_"+ type +"_channel_choose").css({
					"color":"#999",
					"cursor":"default"
				}).unbind("click");
				$("#wisp_channel_"+ type +"_tip").html(L.wisp_channel_tip);
				$("#wisp_channel_width_"+ type +"_tip").html(L.wisp_channel_width_tip);
			}
		}
	});
	
}

function wlb_side_band_change(str,type) {
    $("#wire_" + type + "_side_band_hidden").val(str);
}

function ssid_broadcast_change(type){
	var val = $("#ck_"+ type +"_ssid_broadcast").prop("checked");
	if(val)
		$("#wire_"+ type +"_ssid_broadcast_hidden").val(0);
	else
		$("#wire_"+ type +"_ssid_broadcast_hidden").val(1);
}

function set_ssid_broadcast(str,type){
	 $("#wire_"+ type +"_ssid_broadcast_hidden").val(str);
	if(str == "0")
		$("#ck_"+ type +"_ssid_broadcast").prop("checked",true);
	else
		$("#ck_"+ type +"_ssid_broadcast").prop("checked",false);
}

function wireless_security_ap_change(val,type) {
    reg_map["wireless_base_"+ type +"_frm"][6] = {};
    hide_msgbox();
    $("#wireless_"+ type +"_key_val").removeClass().addClass("input-text");
    $("#wireless_"+ type +"_key_val").val(eval("ck_wireless_key.wpa_key" + type));
    if (val == "0") {
        $("#wireless_"+ type +"_key_layer").removeClass().addClass("item_line section_hide");
    }
    else if (val == "3" || val == "4") {
        $("#wireless_" + type + "_key_layer").removeClass().addClass("item_line section_show");
        reg_map["wireless_base_"+ type +"_frm"][6].id = "wireless_"+ type +"_key_val";
        reg_map["wireless_base_"+ type +"_frm"][6].type = "password eq8_64";
    }
}


function wireless_base_2_4_5_set(type){//flag == noneed 无需init
	if(type == "broadcast"){
		if($("#same").prop("checked") == ck_wireless_param.param_2_4_5.check){
			var obj = {};
			obj.SSID_broadcast = $("#wire_2_4_ssid_broadcast_hidden").val();
			obj.ap_id = 3;
			obj.port_id = "WIFI2";
			$.post("/router/wireless_broadcast_set.cgi", obj, function (data) {
				data = dataDeal(data);
				if (data == "SUCCESS") {
					show_message("success");
				}
				else{
					show_message("error", igd.make_err_msg(data));
				}
				init_wireless_base_2_4();
			});
		}
		else
			wireless_base_2_4_5_set_func(type);
	}
	else{
		if(type == "noneed"){
			wireless_base_2_4_5_set_func(type);
		}
		else if(type == "nochange"){
			if($("#same").prop("checked") == ck_wireless_param.param_2_4_5.check){
				show_message("success");
			}
			else{
				wireless_base_2_4_5_set_func(type);
			}
		}
	}
}

var wifi_2_4_5_timer;
function wireless_base_2_4_5_set_func(type){
    ck_wireless_param.param_2_4_5_basic_submit.wire_enable=(($("#wireless_2_4_enable_hidden").val()>>0)&&$("#same").prop("checked"))>>0;
	ck_wireless_param.param_2_4_5_basic_submit.ap_id = ck_wireless_param.param_2_4_5_advance_submit.ap_id = "3";
	ck_wireless_param.param_2_4_5_basic_submit.port_id = ck_wireless_param.param_2_4_5_advance_submit.port_id = "WIFI2";
	ck_wireless_param.param_2_4_5_basic_submit.AP_SSID = $("#wire_2_4_ssid").val();
	ck_wireless_param.param_2_4_5_advance_submit.ap_mode = $("#wls_2_4_ap_mode_sel").val();
	if($("#wls_2_4_ap_mode_sel").val() == "3" || $("#wls_2_4_ap_mode_sel").val() == "4"){
		ck_wireless_param.param_2_4_5_advance_submit.wpa_keytime = 3600;
	}
	else{
		ck_wireless_param.param_2_4_5_advance_submit.wpa_keytime = 0;
	}
	ck_wireless_param.param_2_4_5_advance_submit.wpa_key = getAesString($("#wireless_2_4_key_val").val());
	ck_wireless_param.param_2_4_5_basic_submit.SSID_broadcast = !$("#ck_2_4_ssid_broadcast").prop("checked")>>>0;
	
	show_message("setup_ing");
	$.post("/router/wire_bas_ap_set.cgi", ck_wireless_param.param_2_4_5_basic_submit, function (data) {
		var data = dataDeal(data);
		if (data == "SUCCESS") {
			$.post("/router/wireless_sec_set.cgi", ck_wireless_param.param_2_4_5_advance_submit, function (data2) {
				var data2 = dataDeal(data2);
				if (data2 == "SUCCESS") {
					if(type != "noneed"){
						if(wifi_2_4_5_timer)
							window.clearTimeout(wifi_2_4_5_timer);
						wifi_2_4_5_timer = window.setTimeout(function(){
							show_message("success");
						},1000);
						init_wireless_base_2_4();
					}
				}
				else{
					show_message("error", igd.make_err_msg(data2));
					init_wireless_base_2_4();
				}
			});
		}
		else{
			show_message("error", igd.make_err_msg(data2));
			init_wireless_base_2_4();
		}
	});
}

function wireless_base_set(type,wirelessSetCallback) {
   if (check_input("wireless_base_"+ type +"_frm")) {
		var obj = {};
		obj.wire_enable = $("#wireless_"+ type +"_enable_hidden").val();
		obj.AP_SSID = $("#wire_"+ type +"_ssid").val();
		obj.channel_band = $("#wire_"+ type +"_side_band_hidden").val();
		obj.channel_width = $("#wlb_" + type + "_channel_width_sel").val();
		obj.channel_num = $("#wireless_base_"+ type +"_channel_sel").val();
		obj.wire_mac = $("#wire_"+ type +"_mac_hidden").val();
		obj.network_mode = 0;
		if(type == "2_4")
			obj.radio_criterion = "10";
		else if(type == "5")
			obj.radio_criterion = "25";
		obj.SSID_broadcast = $("#wire_"+ type +"_ssid_broadcast_hidden").val();
		obj.ap_id = "0";
		if(type == "2_4")
			obj.port_id = "WIFI1";
		else if(type == "5")
			obj.port_id = "WIFI2";
		obj.region = "3";//back ="1"
		obj.need_reboot = 0;
		obj.waln_partition = 0;
		

		var obj2 = {};
		var mode_sel = $("#wls_"+ type +"_ap_mode_sel").val();
		
		obj2.ap_id = 0;
		if(type == "2_4")
			obj2.port_id = "WIFI1";
		else if(type == "5")
			obj2.port_id = "WIFI2";
		
		obj2.ap_mode = mode_sel;
		var key_val = "";
		if (mode_sel == "3" || mode_sel == "4") {
			key_val = $("#wireless_"+ type +"_key_val").val();
			obj2.wpa_key = getAesString(key_val);
			obj2.wpa_keytime = 3600;
			obj2.wpa_mode = 0;
			obj2.wpa_tkaes_flag = 0;
		}

		//对比一下是不是只改了信道
		var obj3 = {};
		$.extend(obj3, obj);
		$.extend(obj3,obj2);
		//tmp add
		obj3.wpa_key = $("#wireless_"+ type +"_key_val").val();
		var change = false;
		if(type == "2_4")
			change = wireless_compare(obj3,compare_2_4_obj);
		else if(type == "5")
			change = wireless_compare(obj3,compare_5_obj);
		if(change){
			//发送原来的cgi
			show_message("save");
			$.post("/router/wire_bas_ap_set.cgi", obj, function (data) {
				var data = dataDeal(data);
				if (data == "SUCCESS") {
					$.post("/router/wireless_sec_set.cgi", obj2, function (data2) {
						var data2 = dataDeal(data2);
						if (data2 == "SUCCESS") {
							if(type == "2_4"){
								wireless_base_2_4_5_set("noneed");
							}
							if(ROUTE_INFO.is_5G && $("#wireless_" + type + "_enable_hidden").val() == "1"){
								set_ap_timer_temp();
							}
							//自动 如果是再加3s
							var timer;
							show_message("setup_ing");
							if(obj.channel_num == "0"){
								timer = WIFI_CHANNEL_CHANGE_TIME * 1000;
							}
							else{
								timer = WIFI_NORMAL_SET_TIME * 1000;
							}
							window.setTimeout(function () {
								var wifiInfo=[obj.AP_SSID,obj3.wpa_key];
								if(!!wirelessSetCallback&&typeof wirelessSetCallback == "function"){
									wirelessSetCallback.apply(null,wifiInfo);
									show_message("success");
									return;
								}
								show_message("success");
								eval("init_wireless_base_"+ type +"();");
							}, timer);
						}
						else {
							show_message("error", igd.make_err_msg(data2));
							eval("init_wireless_base_"+ type +"();");
						}
					});
				}
				else {
					show_message("error", igd.make_err_msg(data));
					eval("init_wireless_base_"+ type +"();");
				}
			});
		}
		else{
			//对比broadcast,如发生改变则发送新cgi
			var tmp = "";
			if(type == "2_4")
				tmp = compare_2_4_obj["SSID_broadcast"];
			else
				tmp = compare_5_obj["SSID_broadcast"]
			if(obj3["SSID_broadcast"] == tmp){
				if(type == "2_4"){
					wireless_base_2_4_5_set("nochange");
				}
				else if(type == "5")
					show_message("success");
			}
			else{
				show_message("save");
				var obj = {};
				obj.ap_id = 0;
				if(type == "5"){
					obj.port_id = "WIFI2";
				}
				else{
					obj.port_id = "WIFI1";
				}
				obj.SSID_broadcast = obj3["SSID_broadcast"];
				$.post("/router/wireless_broadcast_set.cgi", obj, function (data2) {
                    	var data2 = dataDeal(data2);
                    	if (data2 == "SUCCESS") {
							if(type == "5"){
								show_message("success");
								init_wireless_base_5();
							}
							else{
								wireless_base_2_4_5_set("broadcast");
							}
						}
						else{
							show_message("error", igd.make_err_msg(data2));
						}
				});
			}
			
			
		}
	}
}

function wireless_compare(des_obj,src_obj){
	var result_flag = false;
	//由于接口不规范，没办法写通用函数了。只有硬比较了
	var compare_arr = ["AP_SSID","channel_band","channel_num","channel_width","network_mode","radio_criterion","waln_partition","wire_enable","wire_mac","ap_mode"];
	var compare_wpa = ["wpa_key","wpa_keytime","wpa_mode","wpa_tkaes_flag"];
	
	for(var i in compare_arr){
		var _val = compare_arr[i];
		if(des_obj[_val] != src_obj[_val]){
			result_flag = true;
			return result_flag;
		}
	}
	
	if(src_obj["ap_mode"] == "3" || src_obj["ap_mode"] == "4"){
		for(var i in compare_wpa){
			var _val = compare_wpa[i];
			if(des_obj[_val] != src_obj[_val]){
				result_flag = true;
				return result_flag;
			}
		}
	}
	
	return result_flag;
}

//5G频道带宽改变
function channel_width_change(str,real){
	var sel_val = language[language_type].SELECT.wlb_5_channel_width_sel;
	var selected_val = $("#wlb_5_channel_width_sel").val();
	$("#wlb_5_channel_width_sel").empty();
	if(str == "165" || (real == "165" && str == "0")){
		for(var i = 0; i < 2; i++)
			$("#wlb_5_channel_width_sel").append("<option value=\""+ sel_val[i].value +"\">"+ sel_val[i].txt +"</option>");
	}
	else{
		for(var i in sel_val){
			$("#wlb_5_channel_width_sel").append("<option value=\""+ sel_val[i].value +"\">"+ sel_val[i].txt +"</option>");
		}
	}
	var des_dom = $("#wlb_5_channel_width_sel option[value="+ selected_val +"]");
	if(des_dom.length == 0){
		$("#wlb_5_channel_width_sel option").eq(0).attr("selected",true);
	}
	else{
		des_dom.attr("selected",true);
	}
}

function channel_sel_change(str){
	var sel_val = language[language_type].SELECT.wireless_base_5_channel_sel;
	var selected_val = $("#wireless_base_5_channel_sel").val();
	$("#wireless_base_5_channel_sel").empty();
	for(var i in sel_val){
		$("#wireless_base_5_channel_sel").append("<option value=\""+ sel_val[i].value +"\">"+ sel_val[i].txt +"</option>");
	}
	if(str != "2" && str != "6"){
		$("#wireless_base_5_channel_sel option[value=165]").remove();
	}
	var des_dom = $("#wireless_base_5_channel_sel option[value="+ selected_val +"]");
	if(des_dom.length == 0){
		$("#wireless_base_5_channel_sel option").eq(0).attr("selected",true);
	}
	else{
		des_dom.attr("selected",true);
	}
}


//信道选择
function init_channel_choose(status,type){
	var me = $("#wire_" + type + "_channel_choose");
	if(status == "enable"){
		me.css({
			"color":"#428BEF",
			"cursor":"pointer"
		}).unbind("click").bind("click",function(){
			get_better_channel(type);
		});
	}
	else{
		me.css({
			"color":"#999",
			"cursor":"default"
		}).unbind("click");
	}
}

//信道选择
var best_channel_timer;
function get_better_channel(type){
	show_message("channel_choosing");
	var channel_width = $("#wlb_"+ type +"_channel_width_sel").val();
	var port_id = "";
	if(type == "2_4")
		port_id = "WIFI1";
	else
		port_id = "WIFI2";
	$.post("/router/wireless_get_best_channel.cgi", {port_id:port_id,channel_width:channel_width}, function (data) {
		var data = dataDeal(data);
		if(best_channel_timer)
			window.clearTimeout(best_channel_timer);
		best_channel_timer = window.setTimeout(function(){
			if(data.best_bandwidth != 0){
				$("#wlb_"+ type +"_channel_width_sel").val(data.best_bandwidth);
			}
			//如果是165频道则移除40 / 80M
			channel_sel_change(data.best_bandwidth);
			channel_width_change(data.best_channel);
			var c_m;
			if(type == "2_4"){
				c_m = compare_2_4_obj["channel_num"];
			}
			else
				c_m = compare_5_obj["channel_num"];
			if(c_m == "0"){//如果用户设置的是自动则不回显
				$("#wireless_base_" + type +"_channel_sel").val(0);
				$("#wireless_base_" + type +"_channel_sel option:selected").text(L.auto + " (" + L.channel + " " + data.best_channel + ")");
				show_message("success");
				return;
			}
			
			var cur_val = $("#wireless_base_"+ type +"_channel_sel").val();
			if(cur_val != data.best_channel){
				hide_pop_layer("message_layer");
				hide_pop_layer("lock_div");
				$("#wireless_base_"+ type +"_channel_sel").val(data.best_channel);
			}
			else
				show_message("channel_best");
		},WIFI_SET_CHANNEL_TIME*1000);
	});
}

function init_wireless_base_5(){
	if($("#wisp_channel_5_tip").length > 0){
		$("#wisp_channel_5_tip").remove();
	}
	if($("#wisp_channel_width_5_tip").length > 0){
		$("#wisp_channel_width_5_tip").remove();
	}
	$("#wlb_5_channel_width_sel").parent().append("<span id=\"wisp_channel_width_5_tip\"></span>");
	$("#wireless_base_5_channel_sel").parent().append("<span id=\"wisp_channel_5_tip\"></span>");
	compare_5_obj = {};
    init_text_event();
    init_wireless_base_show("5");
    init_wireless_sec_show("5");
	$("#wireless_5_enable").unbind("click").bind("click",function(){
		radio_toggle(this,function(){
			var val = $("#wireless_5_enable_hidden").val();
			wireless_state_change(val,"5");
		});
	});
}

var p_plus_timer;
function init_developer(result){
	init_wireless_advance_show();
	init_boa_deny_ip();
	upnp_switch_show();
	init_p_plus(result);
	get_plugins_status();
}


function init_wireless_advance_show(){
	$.post("/router/wireless_ap_adv_op.cgi", {action: "0"}, function (data) {
		var data = dataDeal(data);
		$("#wireless_base_band_sel").val(data.radio_criterion);
		$("#wireless_fragment").val(data.fragThreshold);
		$("#wireless_RTSThreshold").val(data.rtsThreshold);
		$("#wireless_preamble_sel").val(data.preamble);
		radio_set(data.protection,"wireless_protection");
		radio_set(data.ampdu,"wireless_ampdu");
		radio_set(data.tx_2_path,"wireless_tx_2_path");
	});
}

var wifi_restart_timer = null,develop_delay_timer = null;
function wireless_advance_set(param){
	if (check_input("wireless_advance_frm")) {
		show_message("save");
		var obj = igd.ui.form.collect("wireless_advance_frm");
		$.post("/router/wireless_ap_adv_op.cgi", obj, function (data) {
            var data = dataDeal(data);
			$.when(upnp_set(),p_plus_set(),set_plugins_status()).then(function(val1,val2,val3){
				 if (data == "SUCCESS" && val1.upnp_ret && val2.p_plus_ret && val3.plugin_set) {
					 if(param)
						boa_deny_ip_set_callback(param);
					if(val2.p_plus_ret == 2)
						show_message("success");
					else{
						show_message("setup_ing");
						if(wifi_restart_timer)
							window.clearTimeout(wifi_restart_timer);
						wifi_restart_timer = window.setTimeout(function(){
							show_message("success");
						},wifi_restart_time * 1000);
					}
				}
				else if(data != "SUCCESS"){
					show_message("error", igd.make_err_msg(data));
				}
				if(develop_delay_timer)
					clearTimeout(develop_delay_timer);
				develop_delay_timer = window.setTimeout(function(){
					init_developer(val2.p_plus_ret);
				},800);
			});
        });
	}
}
function init_boa_deny_ip(){
	$("#ip_not_same_segment_tip").html("");
	$("#deny_ip").unbind("focus").bind("focus",function(){
		if($(this).val() != $("#deny_ip_old").val()){
			$("#ip_not_same_segment_tip").html("");
		}
	});
	$.post("/app/universal_app/boa_deny_get.cgi", {noneed: "noneed"}, function (data) {
		//data = '{"enable":"1","ip":"192.168.0.5","user_ip":"192.168.0.22"}';
		var data = dataDeal(data);
		$("#deny_ip,#deny_ip_old").val(data.ip);
		radio_set(data.enable,"boa_deny_switch");
		$("#deny_switch_old").val(data.enable);
		$("#user_ip").val(data.user_ip);
		var lan_ip = data.lan_ip;
		var lan_mask = data.lan_mask;
		dhcp_pool_calculator.formatDhcpPool(lan_ip,lan_mask);
		deny_switch_set();
	});
}

function developer_set(){
	boa_deny_ip_set();
}

function boa_deny_ip_set(){
	var obj = {};
	obj.enable = $("#boa_deny_switch_hidden").val();
	obj.ip = $("#deny_ip").val();
	if(obj.ip == $("#deny_ip_old").val() && obj.enable == $("#deny_switch_old").val()){//未发生数据改变
		wireless_advance_set();
	}
	else{
		if(obj.enable == "0"){//关闭情况下
			obj.ip = "";
			wireless_advance_set(obj);
		}
		else{//开启
			if (check_input("boa_deny_ip_frm")) {
				show_dialog("<div class=\"boa_deny_ip\"><div class=\"boa_deny_ip_icon\"></div><div class=\"boa_deny_ip_txt\">" + L.deny_ip_tips + "</div></div>",function(){
					wireless_advance_set();
				},function(){
					hide_dialog();
					//判断用户设置的IP是否落在地址池范围内
					var ip_arr = obj.ip.split(".");
					for(var j = 0; j < 4; j++){
						ip_arr[j] = parseInt(ip_arr[j],10);
					}
					if(!(dhcp_pool_calculator.octet2dec(ip_arr) >= dhcp_pool_calculator.octet2dec(dhcp_pool_calculator.ndhcpStart) && dhcp_pool_calculator.octet2dec(ip_arr) <= dhcp_pool_calculator.octet2dec(dhcp_pool_calculator.ndhcpEnd))){
                        var no_Same_tip = $("#ip_not_same_segment_tip");
                        var errorMsg;
                        !!no_Same_tip.length?no_Same_tip.html(L.deny_ip_in_same):(errorMsg = new MessageBox(L.deny_ip_in_same.replace(/\(|\)/g,""),null,"deny_ip"),
                        errorMsg.showErrMsg());
					}
					else{//是同一范围
						if(obj.ip != $("#user_ip").val()){//用户设置的IP和当前路由器的IP是否相同
							show_dialog(L.deny_not_same_ip ,function(){
								wireless_advance_set(obj);
							});
						}
						else{
							wireless_advance_set(obj);
						}	
					}	
				},"boa_deny_ip");
			}
		}
	}
}

function boa_deny_ip_set_callback(obj){
	show_message("save");		
	$.post("/app/universal_app/boa_deny_set.cgi", obj, function (data) {
		var data = dataDeal(data);
		if (data != "SUCCESS") {
			show_message("error", igd.make_err_msg(data));
		}
	});
}

function deny_switch_set(){
	var str = $("#boa_deny_switch_hidden").val();
	if(str == "0"){
		$("#deny_ip_layer").addClass("section_hide");
	}
	else{
		$("#deny_ip_layer").removeClass("section_hide");
	}
}

//返回upnp设置
function upnp_switch_show(){
	$.post("/router/upnp_switch_show.cgi",{},function(data){
		var data=dataDeal(data);
		radio_set(data.enable_upnp,"enable_upnp");
	});
}
//设置upnp
function upnp_set(){
	var dfd = $.Deferred();
	var obj={},ret = 1;
	obj.enable=$("#enable_upnp_hidden").val();
	obj.time=$("#time_upnp").val();
	$.post("/router/misc_upnp_set.cgi",{"enable_upnp":obj.enable,"time_upnp":obj.time},function(data){
		var data=dataDeal(data);
		if (data != "SUCCESS") {
			show_message("error", igd.make_err_msg(data));
			ret = 0;
		}
		dfd.resolve({
			upnp_ret : ret
		});
	});
	return dfd.promise();
}

//P++信号增强
var old_p_plus = 0;
var p_plus_time = 5;
var wifi_restart_time = 20;
function init_p_plus(result){
	if(result == undefined)
		p_plus_show();
	if(result && result != 2){
		if(p_plus_timer)
			window.clearTimeout(p_plus_timer);
		p_plus_timer = window.setTimeout(function(){
			p_plus_show();
		},p_plus_time*1000);
	}
}

function p_plus_show(){
	$.post("/router/p_plus_signal.cgi",{action:"get"},function(data){
		var data=dataDeal(data);
		old_p_plus = data.data[0].enable;
		radio_set(old_p_plus,"p_plus");
	});
}

function p_plus_set(){
	var dfd = $.Deferred(),ret = 1,enable = $("#p_plus_hidden").val();
	if(enable != old_p_plus){
		$.post("/router/p_plus_signal.cgi",{action:"set",enable:enable},function(data){
			data = '{"err_no":"0", "err_des":"success"}';
			var data=dataDeal(data);
			if (data.err_no != 0) {
				show_message("error", igd.make_err_msg(data));
				ret = 0;
			}
			dfd.resolve({
				p_plus_ret: ret
			});
		});
	}
	else{
		dfd.resolve({
			p_plus_ret: 2
		});
	}
	return dfd.promise();
}

//第三方插件开关
var plugin_enable=0;
function get_plugins_status(){
	$.post("/router/plugin_statu_get.cgi", function (data) {
		var data=dataDeal(data);
		plugin_enable=data.enable;
		radio_set(data.enable,"plugins_enable");
	})
}
function set_plugins_status(){
	var dfd = $.Deferred(),ret = 1,obj={};
	obj.enable=$("#plugins_enable_hidden").val();
	if(plugin_enable != obj.enable){
		$.post("/router/plugin_statu_set.cgi",obj,function(data){
			var data=dataDeal(data);
			if (data != "SUCCESS") {
				ret = 0;
				show_message("error", igd.make_err_msg(data));
			}
			dfd.resolve({
				plugin_set:ret
			});
		});
	}
	else
		dfd.resolve({
			plugin_set:ret
		});
	return dfd.promise();
}
function set_plugins_dialog(obj){
	var $plugin_enble=$("#plugins_enable_hidden").val();
	if(plugin_enable==0&&$plugin_enble==0){
		show_dialog(L.plugins_enable_tip, function () {
			radio_toggle(obj);
			hide_dialog();
		}, hide_dialog,"plugins_enable_tip")
	}else{
		radio_toggle(obj);
	}
}
