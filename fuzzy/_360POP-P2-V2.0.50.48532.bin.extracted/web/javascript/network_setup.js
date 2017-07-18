/********************************网络设置菜单********************************************************/
//内网设置
var lanTabData = {
	parent:"lan_set_layer",
	child:[
		 {name:"lan_setup",func:"init_lan"},
		 {name:"dhcp_addr",func:"init_dhcp_addr"}
	]
};
function init_lan_setup() {
    init_text_event();
	var tab = new igd.ui.Tab(lanTabData);
	tab.init();
}

var ck_dhcp_pool_obj = {};
function init_lan() {
    ck_dhcp_pool_obj.start = "";
    ck_dhcp_pool_obj.end = "";
	ck_dhcp_pool_obj.dhcp_enable = "";
	ck_dhcp_pool_obj.is_router_as_dns = "";
	get_wan_ip();
    $.post("/router/lan_show.cgi", {noneed: "noneed"}, function (data) {
        var data = dataDeal(data);
		var lan_ip = data.lan_ip;
		var lan_mask = data.lan_mask;
        $("#old_lan_ip").val(lan_ip);
        $("#old_lan_mask").val(lan_mask);
        $("#lan_ip_address").val(lan_ip);
        $("#lan_sub_mask").val(lan_mask);
		radio_set(data.is_router_as_dns,"dns_proxy");
		dhcp_pool_calculator.formatDhcpPool(lan_ip,lan_mask);
        radio_set(data.dhcp_enable,"dhcp_enable");
		dhcp_state_change(data.dhcp_enable);
        $("#dhcp_pool_start").val(data.dhcp_start);
        $("#dhcp_pool_end").val(data.dhcp_end);
        ck_dhcp_pool_obj.start = data.dhcp_start;
        ck_dhcp_pool_obj.end = data.dhcp_end;
		ck_dhcp_pool_obj.dhcp_enable = data.dhcp_enable;
		ck_dhcp_pool_obj.is_router_as_dns = data.is_router_as_dns;
    });
    (function () {
        $("#lan_ip_address").unbind("keyup paste").bind("keyup paste",function(){
			var _val = $(this).val();
			var obj = dhcp_pool_calculator.calculateIPCIDR($(this).val());
			if(!!obj){
				$("#dhcp_pool_start").val(obj["dhcpStart"]);
				$("#dhcp_pool_end").val(obj["dhcpEnd"]);
			}
		});
        $("#lan_sub_mask").unbind("keyup paste").bind("keyup paste",function(){
			var _val = $(this).val();
			var obj = dhcp_pool_calculator.calculateSubnet(_val);
			if(!!obj){
				$("#dhcp_pool_start").val(obj["dhcpStart"]);
				$("#dhcp_pool_end").val(obj["dhcpEnd"]);
			}
		});
    })();
}

function caculateIPNum(ip1,ip2,ip3){
	//用于缩小dhcp范围
	for(var i in ip1){
		ip1[i] =  parseInt(ip1[i]);
	}
	for(var i in ip2){
		ip2[i] =  parseInt(ip2[i]);
	}
	for(var i in ip3){
		ip3[i] =  parseInt(ip3[i]);
	}
	var arr = [];
	//排序
	arr.push(dhcp_pool_calculator.octet2dec(ip1));
	arr.push(dhcp_pool_calculator.octet2dec(ip2));
	arr.push(dhcp_pool_calculator.octet2dec(ip3));
	arr.sort();
	var a,b;
	if((arr[1] - arr[0]) > (arr[2] - arr[1])){
		a = dhcp_pool_calculator.dec2octet(arr[0]);
		b = dhcp_pool_calculator.dec2octet(arr[1]);
	}
	else if((arr[2] - arr[1]) > (arr[1] - arr[0])){
		a = dhcp_pool_calculator.dec2octet(arr[1]);
		b = dhcp_pool_calculator.dec2octet(arr[2]);
	}
	$("#dhcp_pool_start").val(a[0]+"."+a[1]+"."+a[2]+"."+a[3]);
	$("#dhcp_pool_end").val(b[0]+"."+b[1]+"."+b[2]+"."+b[3]);
}

function lan_compare(){
	if($("#lan_ip_address").val() == $("#old_lan_ip").val() && $("#lan_sub_mask").val() == $("#old_lan_mask").val() && $("#dhcp_pool_start").val() == ck_dhcp_pool_obj.start && $("#dhcp_pool_end").val() == ck_dhcp_pool_obj.end && ck_dhcp_pool_obj.dhcp_enable == $("#dhcp_enable_hidden").val() && $("#dns_proxy_hidden").val() == ck_dhcp_pool_obj.is_router_as_dns)
		return true;
	else
		return false;
}

var lan_jump_timer;
function lan_setup_submit() {
	var ret = lan_compare();
	if(ret){
		show_message("success");
		return;
	}
    if (check_input("lan_setup_frm")) {
		var lan_ip = $("#lan_ip_address").val();

        var ip1 = $("#dhcp_pool_start").val();
        var ip2 = $("#dhcp_pool_end").val();
		
		
		var start_arr = ip1.split(".");
		var end_arr = ip2.split(".");
		for(var j = 0; j < 4; j++){
			start_arr[j] = parseInt(start_arr[j],10);
			end_arr[j] = parseInt(end_arr[j],10);
		}
		var start_ip = dhcp_pool_calculator.octet2dec(start_arr);
		var end_ip = dhcp_pool_calculator.octet2dec(end_arr);
		
		var ip_1 = dhcp_pool_calculator.octet2dec(dhcp_pool_calculator.nAddr);
		var ip_2 = dhcp_pool_calculator.octet2dec(dhcp_pool_calculator.ndhcpStart);
		var ip_3 = dhcp_pool_calculator.octet2dec(dhcp_pool_calculator.ndhcpEnd);
		if($("#dhcp_enable_hidden").val() == "1"){
			if(start_ip < ip_2 || start_ip > ip_3){
				show_differ_tip(L.dhcp_pool_err, "dhcp_pool_start");
				return false;
			}
			if(end_ip < ip_2 || end_ip > ip_3){
				show_differ_tip(L.dhcp_pool_err, "dhcp_pool_end");
				return false;
			}
			
			
			if(ip_1 == ip_2){
				show_differ_tip(L.dhcp_pool_err, "dhcp_pool_start");
				return false;
			}
			else if(ip_1 == ip_3){
				show_differ_tip(L.dhcp_pool_err, "dhcp_pool_end");
				return false;
			}
		}
		
        var lanSubMask = $("#lan_sub_mask").val();
		//IP和掩码组合校验，确定IP是不是网络地址或者广播地址
        var return_val0 = check_ip_mask(lan_ip, lanSubMask);
        if (return_val0 != true) {
            show_differ_tip(return_val0, "lan_ip_address");
            return false;
        }
		//IP和掩码组合校验，确定和上端是不是在同一个网段
		var result = check_lan_wan_ip(lan_ip,lanSubMask);
		if (result != true) {
            show_differ_tip(result, "lan_ip_address");
            return false;
        }
        var return_val = check_start_end_ip(ip1, ip2);
        if (return_val != true) {
            show_differ_tip(return_val, "dhcp_pool_start");
            return false;
        }
		
        //防止跳转时候图片加载不出来,延时处理
        show_message("save");
        var ck_flag = 0;
        var lan_jump_Fn = function () {
			if(lan_jump_timer)
				window.clearTimeout(lan_jump_timer);
            lan_jump_timer = setTimeout(function () {
				if(ck_flag == 3)
					return;
				show_message("success");
                if (ck_flag == 0) {
                    if (ROUTE_INFO.g_port != "80")
                        window.open("http://" + lan_obj.lan_ip + ":" + ROUTE_INFO.g_port + "/login.htm" , "_self");
                    else
                        window.open("http://" + lan_obj.lan_ip + "/login.htm", "_self");
                }
                else if (ck_flag == 1) {
                    init_lan_setup();
                }
            }, 12 * 1000);
        };
        var lan_obj = igd.ui.form.collect("lan_setup_frm");
        var SubMitCallBack =arguments[0];//修改成功后所要执行的函数
        $.post("/router/lan_set.cgi", lan_obj, function (data) {
            var data = dataDeal(data);
            if (data == "SUCCESS") {
				 if(typeof  SubMitCallBack == "function"){
                    SubMitCallBack();
                }
                ROUTE_INFO.lan_ip = lan_obj.lan_ip;
                ROUTE_INFO.lan_mask = lan_obj.lan_mask;
                if (lan_obj.lan_ip == $("#old_lan_ip").val()) {
                    ck_flag = 1;
                }
                else {
                    ck_flag = 0;
                }
            }
            else {
				ck_flag = 3;
                show_message("error", igd.make_err_msg(data));
				init_lan_setup();
            }
        });
        lan_jump_Fn();
    }
}


function dhcp_state_change(str) {
    reg_map["lan_setup_frm"][2] = {};
    reg_map["lan_setup_frm"][3] = {};
    if (str == "1") {
        section_disable("dhcp_layer", false);
        reg_map["lan_setup_frm"][2].id = "dhcp_pool_start";
        reg_map["lan_setup_frm"][2].type = "lan_ip";
        reg_map["lan_setup_frm"][3].id = "dhcp_pool_end";
        reg_map["lan_setup_frm"][3].type = "lan_ip";
    }
    else {
        $("#dhcp_pool_start").val(ck_dhcp_pool_obj.start);
        $("#dhcp_pool_end").val(ck_dhcp_pool_obj.end);
        hide_msgbox();
        $("#dhcp_pool_start,#dhcp_pool_end").removeClass().addClass("input-text input-biger");
        section_disable("dhcp_layer", true);
    }
}

//外网设置
var wan_setup_data = {};
var forms = [
    "wan_pppoe_form",
    "wan_dhcp_form",
    "wan_static_form",
    "wan_xingkong_form",
    "wan_wangtong_form",
    "wan_guangd_form",
    "wan_henan_dhcp_form",
    "wan_henan_pppoe_form",
    "wan_hlj_static_form",
    "wan_pptp_sip_form",
    "wan_pptp_dhcp_form",
    "wan_l2tp_sip_form",
    "wan_l2tp_dhcp_form"
];

var conf_speed_value;
var wanTabData = {
	parent:"wan_mode_layer",
	child:[]
};
function init_wan_setup(index) {
    var tab = new igd.ui.Tab(wanTabData,"set_wan_link_work_mode");
	tab.init();
    $("#common_uiname").val("WAN1");
    var uiname = $("#common_uiname").val();
	var d = new Date();
    $.post("/router/wan_config_show.cgi", {uiname: uiname,b64:d.getTime()}, function (data) {
        var data = dataDeal(data);
        wan_setup_data = data;
        if (data && data.COMMON && data.COMMON.connect_type && data.PPPOE) {
            wan_setup_data.PPPOE.pass = getDAesString(wan_setup_data.PPPOE.pass);
        }
        //接口设置
        conf_speed_value = "";
        set_wan_link_work_mode(index);
    });
}
function init_interface_mode() {

    $.post("/router/wanport_real_show.cgi", {noneed: "noneed"}, function (ret) {
        var ret = dataDeal(ret);
        conf_speed_value = ret[0].conf_speed_state;
        select_chose_set("wan1_select", conf_speed_value);
    });
}

function set_wan_link_work_mode(index, isMobile) {
    var name = [
        "wan_pppoe",
        "wan_dhcp",
        "wan_static",
        "wan_xingkong",
        "wan_wangtong",
        "wan_guangd",
        "wan_henan_dhcp",
        "wan_henan_pppoe",
        "wan_hlj_static",
        "wan_pptp_sip",
        "wan_pptp_dhcp",
        "wan_l2tp_sip",
        "wan_l2tp_dhcp"
    ];
    var connect_types = [
        "PPPOE",
        "DHCP",
        "STATIC",
        "XINGKONG",
        "WANGTONG_PPPOE",
        "GUANGDIAN_STATIC",
        "HN_DHCP",
        "HN_PPPOE",
        "HLJ_STATIC",
        "PPTP_STATIC",
        "PPTP_DHCP",
        "L2TP_STATIC",
        "L2TP_DHCP"
    ];
    var len = name.length;
    if (!wan_setup_data.COMMON) {
        return;
    }
    var common = wan_setup_data.COMMON;
    var connecttype = 0;
    connecttype = get_connect_type(common.connect_type);
    if (index) {
        connecttype = parseInt(index, 10);
    }
    var html_name = name[connecttype - 1];
    var loadCallBackFn = function (ret) {
        $("#wan_setup_pass0").unbind("blur").bind("blur", function () {
            var _val = $(this).val();
            if (_val == "") {
                $(this).val(igd.global_param.pwd_string.substring(0, wan_setup_data.PPPOE.pass.length));
            }
        });
        init_text_event();
        init_language(html_name);
        if (connecttype)
            $("#wan_mode_layer div").eq(connecttype - 1).addClass("on");
        //$("#wan_mode").val(connecttype);
        $("#common_connect_type").val(connect_types[connecttype - 1]);
        wan_init_data(wan_setup_data);
        init_interface_mode();
    };
    if (isMobile) {
        loadCallBackFn();
        return;
    }
    $("#wan_setup_load").load("./" + html_name + ".htm", loadCallBackFn);
}

function get_connect_type(type) {
    var connecttype = 0;
    switch (type) {
        case "PPPOE":
            connecttype = 1;
            break;
        case "DHCP":
            connecttype = 2;
            break;
        case "STATIC":
            connecttype = 3;
            break;
        case  "XINGKONG":
            connecttype = 4;
            break;
        case  "WANGTONG_PPPOE":
            connecttype = 5;
            break;
        case  "GUANGDIAN_STATIC":
            connecttype = 6;
            break;
        case  "HN_DHCP":
            connecttype = 7;
            break;
        case  "HN_PPPOE":
            connecttype = 8;
            break;
        case  "HLJ_STATIC":
            connecttype = 9;
            break;
        case  "PPTP_STATIC":
            connecttype = 10;
            break;
        case  "PPTP_DHCP":
            connecttype = 11;
            break;
        case  "L2TP_STATIC":
            connecttype = 12;
            break;
        case  "L2TP_DHCP":
            connecttype = 13;
            break;
        default:
            connecttype = 2;
    }
    return connecttype;
}

function wan_init_data(data) {
    if (!data || !data.COMMON || !data.COMMON.connect_type)
        return;
    var common = data.COMMON;
    var pppoe = data.PPPOE;
    var dhcp = data.DHCP;
    var _static = data.STATIC;
    var xingkong = data.XINGKONG;
    var wangtong = data.WANGTONG_PPPOE;
    var guangdian = data.GUANGDIAN_STATIC;
    var hn_dhcp = data.HN_DHCP;
    var hn_pppoe = data.HN_PPPOE;
    var hlj_static = data.HLJ_STATIC;

    var connecttype = 1;
    connecttype = get_connect_type(common.connect_type);

    $("#common_clone_mac").val(common.mac_clone);
    $("#common_default_mac").val(common.mac_default);
    for (var i = 0; i < forms.length; i++) {
        set_value(forms[i], "mac", common.mac_current);
        set_value(forms[i], "up_bandwidth", common.up_bandwidth);
        set_value(forms[i], "down_bandwidth", common.down_bandwidth);
        if (i != 4) {
            set_isp_value(common.isp, i);
            form_radio_sele_set(forms[i], "isp_radio", common.isp);
        }
        set_work_mode_value(i, common.work_mode);
        form_radio_sele_set(forms[i], "work_mode_radio", common.work_mode);
        form_radio_sele_set(forms[i], "line_detect", common.line_detect);
    }

    //mtu
    set_value(forms[connecttype - 1], "mtu", common.mtu);

    //pppoe
    set_value(forms[0], "user", utf8to16(base64decode(pppoe.user)));
    if (pppoe.pass.length != 0) {
        var pass_str = igd.global_param.pwd_string.substring(0, pppoe.pass.length);
        set_value(forms[0], "pass", pass_str);
    }
    else
        set_value(forms[0], "pass", pppoe.pass);
    //server_name&ac_name
    set_value(forms[0], "server_name", pppoe.server_name);
    set_value(forms[0], "ac_name", pppoe.ac_name);

    set_value(forms[0], "dns1", handle_ip(pppoe.dns[0]));
    set_value(forms[0], "dns2", handle_ip(pppoe.dns[1]));

    if (pppoe.out_time > 0) {
        set_value(forms[0], "out_time", pppoe.out_time);
        set_value(forms[0], "out_time_dr", pppoe.out_time);
    }
    form_radio_sele_set(forms[0], "pppoe_conf_radio", check_pppoe_conf(pppoe.pppoe_conf));
    set_pppoe_connect_mode(0, check_pppoe_conf(pppoe.pppoe_conf));
    //dhcp
    set_value(forms[1], "dns1", handle_ip(dhcp.dns[0]));
    set_value(forms[1], "dns2", handle_ip(dhcp.dns[1]));

    set_value(forms[1], "dns1_dr", handle_ip(dhcp.dns[0]));
    set_value(forms[1], "dns2_dr", handle_ip(dhcp.dns[1]));
    //静态
    set_value(forms[2], "ip", handle_ip(_static.ip));
    set_value(forms[2], "mask", handle_ip(_static.mask));
    set_value(forms[2], "gw", handle_ip(_static.gw));
    set_value(forms[2], "dns1", handle_ip(_static.dns[0]));
    set_value(forms[2], "dns2", handle_ip(_static.dns[1]));

    //断网时间
    set_wan_cut_down_time(common);
}


function submit_wan_config_check(index) {//提交前检查
    var keys = [
        "wan_pppoe_form",
        "wan_dhcp_form",
        "wan_static_form"
    ];
    var real_key = keys[index];

    if (!check_input(real_key)) {
        return false;
    }
    if (real_key == "wan_static_form") {
        var tmp_ip = "", tmp_mask = "", tmp_gw = "";
        tmp_ip = $("#wan_setup_ip2").val();
        tmp_mask = $("#wan_setup_mask2").val();
        tmp_gw = $("#wan_setup_gw2").val();
        var return_val = check_ip_mask(tmp_ip, tmp_mask);
        if (return_val != true) {
            show_differ_tip(return_val, "wan_setup_ip2");
            return false;
        }
        var return_val1 = check_getway_mask(tmp_gw, tmp_mask);
        if (return_val1 != true) {
            show_differ_tip(return_val1, "wan_setup_gw2");
            return false;
        }
        var return_val2 = check_wan_lan_ip(tmp_ip, tmp_gw, tmp_mask);
        if (return_val2 != true) {
            show_differ_tip(return_val2, "wan_setup_ip2");
            return false;
        }
    }

    /*if("288" == version||"safe" == version){//检查断网时间
     if(!cheK_ip_day("cut_time_hidden","wan_day","wan_day")){
     return;
     }*/
    return true;
}

function submit_wan_config(index,callback) {
    var ret = submit_wan_config_check(index);
    if (ret) {
        show_message("save");
        var obj = igd.ui.form.collect(forms[index]);

        obj.uiname = $("#common_uiname").val();
        obj.connect_type = $("#common_connect_type").val();
        //校验密码
        var old_pwd = wan_setup_data.PPPOE.pass;
        var pass_str = igd.global_param.pwd_string.substring(0, old_pwd.length);
        var new_pwd = $("#wan_setup_pass0").val();
        if (new_pwd == pass_str) {//说明用户根本没点密码字段
            obj.pass = getAesString(old_pwd);
        }
        else {
            obj.pass = getAesString(new_pwd);
        }
        /*if("WANGTONG_PPPOE" == obj.connect_type){
         obj.isp = "CNCGROUP";
         var d = new Date();
         obj.wangt_date = d.getYear()+"/"+d.getMonth()+"/"+d.getDate()+"/"+d.getHours()+"/"+d.getMinutes()+"/"+d.getSeconds();
         }*/
		var d = new Date();
		obj.b64 = d.getTime();
        var user = $("#wan_setup_user0").val();
		if(user != undefined)
			obj.user = base64encode(utf16to8(user));
        $.post("/router/wan_config_set.cgi", obj, function (data) {
            var data = dataDeal(data);
            if (data == "SUCCESS") {
                if(!!callback){
                    callback();
                }
                if ($("#wan1_select").val() == conf_speed_value) {
                    show_message("success");
                    init_wan_setup();
                }
                else {
                    set_interface_mode();
                }
            }
            else {
                show_message("error", igd.make_err_msg(data));
                init_wan_setup();
            }
        });
    }
}

function set_interface_mode() {
    var interface_obj = {};
    interface_obj.port = "WAN1";
    interface_obj.speed_state = $("#wan1_select").val();
    $.post("/router/port_config_setup.cgi", interface_obj, function (ret) {
        var ret = dataDeal(ret);
        if (ret == "SUCCESS") {
            show_message("success");
            init_wan_setup();
        }
        else {
            show_message("error", igd.make_err_msg(data));
            init_wan_setup();
        }
    });
}

function wan_advance_check(index) {//高级部分检查
    var keys = [
        "wan_pppoe_form_advance",
        "wan_dhcp_form_advance",
        "wan_static_form_advance"
    ];
    var real_key = keys[index];

    if (!check_input(real_key)) {
        return false;
    }
    return true;
}

function wan_advance_toggle(index) {
    if (wan_advance_check(index)) {
        section_toggle();
    }
}

function lan_advance_toggle() {
   section_toggle();
}

function resume_mac(form_index) {
    hide_msgbox();
    $("#" + forms[form_index] + " input[name='mac']").removeClass().addClass("input-text input-biger");
    $("#" + forms[form_index] + " input[name='mac']").val($("#common_default_mac").val());
}
function set_mac_clone(form_index) {
    hide_msgbox();
    $("#" + forms[form_index] + " input[name='mac']").removeClass().addClass("input-text input-biger");
    $("#" + forms[form_index] + " input[name='mac']").val($("#common_clone_mac").val());
}

function set_work_mode_value(index, value) {
    $("#work_mode" + index).val(value);
}
function set_isp_value(value, index) {
    $("#isp" + index).val(value);
}
function set_detect_value(value) {
    $('#line_detect').val(value);
}
function cut_timer_change(value) {
    $("#cut_time_hidden").val(value);
    if (value == "0") {
        $("#cut_time_set_body").hide();
    }
    else {
        $("#cut_time_set_body").show();
    }
}

function set_value(form_id, field_name, data) {
    $("#" + form_id + " input[name='" + field_name + "']").val(data);
}

function form_radio_sele_set(form_name, radio_name, hide_name_value) {
    var collection = $("#" + form_name + " input[name='" + radio_name + "']");
    for (i = 0; i < collection.length; i++) {
        collection[i].checked = (collection[i].value == hide_name_value) ? true : false;
    }
}

function check_pppoe_conf(conf) {
    if (conf != "AUTO" && conf != "IDLE" && conf != "MANU") {
        conf = "AUTO";
    }
    return conf;
}

function set_wan_cut_down_time(obj) {
    if (obj.timer_enable == "0") {
        $("#cut_time_set_body").removeClass("section_show").addClass("section_hide");
    }
    else {
        $("#cut_time_set_body").removeClass("section_hide").addClass("section_show");
        var day_data = obj.timer_day.split(" ");
        for (var i = 0; i < day_data.length; i++) {
            if ("" == day_data[i])
                continue;
            $("#wan_day" + (day_data[i] - 1)).attr("checked", true);
        }
        $("#wan_start_hour").val(obj.start_hour);
        $("#wan_start_min").val(obj.start_minute);
        $("#wan_end_hour").val(obj.end_hour);
        $("#wan_end_min").val(obj.end_minute);
    }
    $("#cut_time_hidden").val(obj.timer_enable);
    radio_sele_set("time", obj.timer_enable);
}

function set_pppoe_connect_mode(form_index, value) {
    var form = forms[form_index];
    hide_msgbox();
    $("#" + form + " input[name='out_time']").removeClass().addClass("input-text");
    $("#" + form + " input[name='out_time']").val($("#" + form + " input[name='out_time_dr']").val());

    if (value == "IDLE") {
        $("#" + form + " input[name='out_time']").attr("disabled", false);
    }
    else {
        $("#" + form + " input[name='out_time']").attr("disabled", true);
    }
    $("#pppoe_conf" + form_index).val(value);
}

//保留地址
var dhcp_addr_setup_data = {};
function init_dhcp_addr(){
	$.post("./router/dhcp_staticip_show.cgi",{noneed:"noneed"},function(data){
		data = dataDeal(data);
		var new_data = [];
		var index = 1;
		var len = data.length;
		for(var i = 0; i < len; i++){
			var tmp = {};
			tmp.id = index;
			tmp.mac = data[i].mac;
			tmp.ip = data[i].ip;
			tmp.op = '<a onclick="dhcp_addr_modify('+ index +')" title="'+ L.edit +'" class="fun_link edit" href="javascript:void(0);">'+ L.edit +'</a>';
			tmp.op += '<a onclick="dhcp_addr_delete('+ index +')" title="'+ L.s_delete +'" class="fun_link del" href="javascript:void(0);">'+ L.s_delete +'</a>'; 
			new_data.push(tmp);
			dhcp_addr_setup_data[index] = data[i];
			index++;
		}
		var tab = new Table("dhcpAddrTab",[L.index,L.mac_addr,L.ip_addr,L.op],new_data,{
			info:L.no_device								  
		});
		tab.initTable();
	});
}

function clear_dhcp_addr_input(){
	$("#dhcp_addr_mac,#dhcp_addr_ip").val("");
	$("#dhcp_addr_old_ip,#dhcp_addr_old_mac").val("");
	$("#dhcp_addr_old_ip").attr("name","");
	$("#dhcp_addr_old_mac").attr("name","");
	$(".btn_confirm").val(L.do_confirm);
	$("#deal").val("add");
	$("#dhcp_addr_clear_btn").hide();
}

function dhcp_addr_modify(id){
	var obj = dhcp_addr_setup_data[parseInt(id,10)];
	$("#dhcp_addr_name").val(obj.name);
	$("#dhcp_addr_mac").val(obj.mac);
	$("#dhcp_addr_ip").val(obj.ip);
	$("#deal").val("modify");
	$("#dhcp_addr_old_ip").val(obj.ip);
	$("#dhcp_addr_old_mac").val(obj.mac);
	//modify btn
	$(".btn_confirm").val(L.modify);
	$(".btn_cancel").show();
}

function dhcp_addr_delete(id){
	clear_dhcp_addr_input();
	var obj = dhcp_addr_setup_data[parseInt(id,10)];
	show_dialog(L.delete_list,function(){
		show_message("deleteing");
		$.post("./router/dhcp_del_staticip.cgi",obj,function(data){
			data = dataDeal(data);
			if(data == "SUCCESS"){
				show_message("del_success");
			}
			else
				show_message("error",igd.make_err_msg(data));
			init_dhcp_addr(); 
		});							   
	});
}


function dhcp_addr_submit(){
	var deal = $("#deal").val();
	if(deal == "modify"){
		$("#dhcp_addr_old_ip").attr("name","old_ip");
		$("#dhcp_addr_old_mac").attr("name","old_mac");
	}
	if(check_input("dhcp_addr_frm")){
		show_message("save");
		var obj = igd.ui.form.collect("dhcp_addr_frm");
		$.post("./router/dhcp_add_staticip.cgi",obj,function(data){
			data = dataDeal(data);
			if(data == "SUCCESS"){
	 			show_message("success");
			}
			else
	 			show_message("error",igd.make_err_msg(data));
			clear_dhcp_addr_input();
			init_dhcp_addr();
		});
	}
}