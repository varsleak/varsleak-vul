var appHtml=appL.smartqos.js,current_tab_name = [
    {tab_title: appHtml.tabTitle[0], tab_id: "qos_set_tab"},
    {tab_title: appHtml.tabTitle[1], tab_id: "qos_priority_tab"},
    {tab_title: appHtml.tabTitle[2], tab_id: "qos_advance_tab"}
];

$(document).ready(function () {
    initTab();
});
//验证地图
var reg_app_map = {
    g_time_segment: [
        {id: "g_start_hour", type: "hour"},
        {id: "g_start_min", type: "minute"},
        {id: "g_end_hour", type: "hour"},
        {id: "g_end_min", type: "minute"}
    ],
    lan_host: [
        {id: "lan_filter_ip", type: "ip"}
    ],
    lan_sub_host: [
        {id: "lan_filter_ip", type: "spe_ip"},
        {id: "lan_filter_mask", type: "mask"}
    ],
    lan_ip_host: [
        {id: "lan_filter_ip", type: "ip"},
        {id: "lan_filter_mask", type: "ip"}
    ],
    qos_set_form: [
        {id: "wan_setup_up_bandwidth1", type: "qos_bandwidth"},
        {id: "wan_setup_down_bandwidth1", type: "qos_bandwidth"}
    ],
	qos_advance_form:[
		{id: "udp_up_len", type: "udp_up"},
		{id: "wan_setup_up_reserved1", type: "reserved_band"},
        {id: "wan_setup_down_reserved1", type: "reserved_band"}
	],
    qos_priority_form: [
        {id: "prio", type: "prio"},
        {id: "name_id", type: "string"},
        {id: "flux_manualdest_port_a", type: "int noneed"},
        {id: "flux_manualdest_port_b", type: "int noneed"}
    ],
    wan_host: [
        {id: "wan_filter_ip", type: "ip"}
    ],
    wan_sub_host: [
        {id: "wan_filter_ip", type: "spe_ip"},
        {id: "wan_filter_mask", type: "mask"}
    ],
    wan_ip_host: [
        {id: "wan_filter_ip", type: "ip"},
        {id: "wan_filter_mask", type: "ip"}
    ],
    port_a: [
        {id: "dest_port_a", type: "port"}
    ],
    port_b: [
        {id: "dest_port_a", type: "port"},
        {id: "dest_port_b", type: "port"}
    ],
    noneed: []
}

var qos_set_obj = {};
function create_ck_obj(data){
	qos_set_obj = {};
	qos_set_obj.up_bandwidth = {};
	qos_set_obj.down_bandwidth = {};
	qos_set_obj.up_reserved = {};
	qos_set_obj.down_reserved = {};
	for(var i=1; i <= g_wan_num;i++){
		var up_bandwidth = eval('(' + "data['switch'].up_bandwidth" + i + ')');
		var down_bandwidth = eval('(' + "data['switch'].down_bandwidth" + i + ')');
		var up_reserved = eval('(' + "data['switch'].up_reserved" + i + ')');
		var down_reserved = eval('(' + "data['switch'].down_reserved" + i + ')');
		
		qos_set_obj.up_bandwidth[i] = up_bandwidth;
		qos_set_obj.down_bandwidth[i] = down_bandwidth;
		qos_set_obj.up_reserved[i] = up_reserved;
		qos_set_obj.down_reserved[i] = down_reserved;
	}
}

///////////////智能QOS///////////////////
function init_qos_set() {
    init_app_language(appL.smartqos.qos_set);
    //qos_basic_setup_show.cgi    初始化读取数据的文件
    nos.app.net('qos_basic_setup_show.cgi', 'noneed=noneed', qos_set_callback);
}
function qos_set_callback(result) {
	//智能QoS状态初始化\
	var flux_status = result["switch"]["flux_status"];
	radio_set(flux_status,"flux_enable");
	//设定端口
	create_ck_obj(result);
    set_wanlan(g_wan_num);
	set_flux_status(flux_status);
	set_speed(g_wan_num, result);
    nos.app.resizePage();
}

/*开关处理函数 */
function set_flux_status() {
	var val = $("#flux_enable_hidden").val();
	if(val == "0"){
		section_disable("qos_set_layer",true);
		//关闭的时候校验不过即恢复以前设定的值
		if(!check_band_width())
			set_wanlan(g_wan_num);
	}
	else
		section_disable("qos_set_layer",false);
}

function section_disable(section_id, flag) {
    $("#" + section_id + " input").attr("disabled", flag);
    $("#" + section_id + " textarea").attr("disabled", flag);
    $("#" + section_id + " select").attr("disabled", flag);
}

function check_band_width(){
	var flag = true;
	for(var i = 1; i <= g_wan_num; i++){
		var up_bandwidth = $("#wan_setup_up_bandwidth" + i).val();
		var down_bandwidth = $("#wan_setup_down_bandwidth" + i).val();
		var up_reserved = $("#wan_setup_up_reserved" + i).val();
		var down_reserved = $("#wan_setup_down_reserved" + i).val();
		//if(parentEmt.check_decimal(up_bandwidth).toString() != 'true' || parentEmt.check_decimal(down_bandwidth).toString() != 'true' || parentEmt.check_decimal(up_reserved).toString() != 'true' || parentEmt.check_decimal(down_reserved).toString() != 'true'){
		if(check_qos_bandwidth(up_bandwidth).toString() != 'true' || check_qos_bandwidth(down_bandwidth).toString() != 'true'){
			flag = false;
			break;
		}
	}
	return flag;
}
/**
 * 给端口赋值
 * @param n  端口个数
 * @param data  后台传回的数据
 */
function set_wanlan(n) {
    for (var i = 1; i <= n; i++) {
		var up_bandwidth = qos_set_obj.up_bandwidth[n];
		var down_bandwidth = qos_set_obj.down_bandwidth[n];
		var up_reserved = qos_set_obj.up_reserved[n];
		var down_reserved = qos_set_obj.down_reserved[n];
		
        $("#wan_setup_up_bandwidth" + i).val(up_bandwidth);
        $("#wan_setup_down_bandwidth" + i).val(down_bandwidth);
        $("#wan_setup_up_reserved" + i).val(up_reserved);
        $("#wan_setup_down_reserved" + i).val(down_reserved);
        $("#qos_wan" + i).show();
        if (n != 1) {   //wan 口
            $("#WAN" + i).show();
            $("#WAN_R" + i).show();
        }
    }

}

function set_speed(n, data){
	 for (var i = 1; i <= n; i++) {
		var _val = eval('(' + "data['switch'].speed_type" + i + ')');
        //window.setTimeout(function(){
			$("#speed_type_sel" + i).val(_val);
		//},0);
		if(_val != "band_custom"){
			$("#qos_bandwidth_layer" + i).addClass("off");
		}
		else{
			$("#qos_bandwidth_layer" + i).removeClass("off");
		}
    }
}
//选择带宽
var qos_val = new Array();
qos_val = [
    ["1M_adsl", 0.5, 1, 25, 20],
    ["2M_adsl", 0.5, 2, 25, 20],
    ["3M_adsl", 0.5, 3, 25, 20],
    ["4M_adsl", 0.5, 4, 25, 15],
    ["6M_adsl", 0.5, 6, 25, 15],
    ["8M_adsl", 0.5, 8, 25, 10],
    ["10M_adsl", 0.5, 10, 25, 10],
    ["12M_adsl", 0.5, 12, 25, 10],
    ["15M_adsl", 0.5, 15, 25, 10],
    ["20M_adsl", 0.5, 20, 25, 8],
    ["2M_g", 2, 2, 10, 10],
    ["3M_g", 3, 3, 10, 10],
    ["4M_g", 4, 4, 10, 10],
    ["5M_g", 5, 5, 10, 10],
    ["6M_g", 6, 6, 10, 10],
    ["7M_g", 7, 7, 10, 10],
    ["8M_g", 8, 8, 10, 8],
    ["9M_g", 9, 9, 10, 8],
    ["10M_g", 10, 10, 10, 8],
    ["20M_g", 20, 20, 5, 6],
    ["30M_g", 30, 30, 5, 5],
    ["40M_g", 40, 40, 5, 4],
    ["50M_g", 50, 50, 5, 4],
    ["60M_g", 60, 60, 5, 3],
    ["70M_g", 70, 70, 5, 2],
    ["80M_g", 80, 80, 2, 2],
    ["90M_g", 90, 90, 2, 2],
    ["100M_g", 100, 100, 2, 2],
	["band_custom", 0, 0, 0, 0]
];
function qos_speed_set_change(str, v) {
    if (!str)
        str = "";
	if(v == "band_custom"){
		$("#qos_bandwidth_layer" + str).removeClass("off");
		$("#wan_setup_up_bandwidth" + str).val("");
		$("#wan_setup_down_bandwidth" + str).val("");
		$("#wan_setup_up_reserved" + str).val("");
		$("#wan_setup_down_reserved" + str).val("");
	}
	else{
		$("#qos_bandwidth_layer" + str).addClass("off");
		var s = parseInt(v, 10);
		if (s == 0) {//请选择你的带宽
			$("#wan_setup_up_bandwidth" + str).val("100");
			$("#wan_setup_down_bandwidth" + str).val("100");
			$("#wan_setup_up_reserved" + str).val("2");
			$("#wan_setup_down_reserved" + str).val("2");
			return;
		}
		else
			for (var i = 0; i < 29; i++) {
				if (v == qos_val[i][0]) {
					$("#wan_setup_up_bandwidth" + str).val(qos_val[i][1]);
					$("#wan_setup_down_bandwidth" + str).val(qos_val[i][2]);
					$("#wan_setup_up_reserved" + str).val(qos_val[i][3]);
					$("#wan_setup_down_reserved" + str).val(qos_val[i][4]);
					return;
				}
			}
	}
}

//qos设置提交数据
function qos_set_submit() {
    var status = $("#flux_enable_hidden").val();
	if (check_app_input("qos_set_form")) {
		show_message("save");
		nos.app.net('qos_basic_set.cgi', 'qos_set_form', function (data) {
			if (data == "SUCCESS") {
				show_message("success");
			} else {
				show_message("error", igd.make_err_msg(data));
			}
			init_qos_set();
		});
	}
}

/////////////////智能QOS结束//////////////

/////////////////////应用优先级////////////////////

//------- 用户组全局变量   g_user_group
//-------时间组全局变量    g_time_group
//------应有优先级规则列表 初始化出来使用到的全局变量
// 已经处理过一次 下标从1开始 对应后台发送的0开始的所有数据
var qos_priority_list_data = {};
function init_qos_priority() {
    init_app_language(appL.smartqos.qos_priority);
    //源主机
    paint_lan_ip_dom();
    //目的主机
    paint_wan_ip_dom();
    init_wan_mode_sele();
    //协议与端口
    paint_proto_port_dom();
    init_user_sele_protocol("qos_filter");
    //时间段
    paint_time_segment_dom();
    nos.app.net('qos_filter_show.cgi', 'noneed=noneed', paint_qos_priority_tab);
}

//表格初始化成功函数
function paint_qos_priority_tab(data) {
    var data_new = new Array();
    var index = 1;
    var linkStr= appHtml.linkStr;

    for (var i in data) {
        var tempobj = {};
        //序列号id
        tempobj.id = parseInt(i, 10) + 1;

        tempobj.priority = data[i].priority;

        tempobj.name = data[i].name;

		tempobj.operate = "";
		if(data[i].enable == 'true'){
			tempobj.operate = '<a class="fun_link unlink" title="'+linkStr[0]+'" href="javascript:void(0);" onclick="flux_manual_change_state('+ tempobj.id  +',\'false\');">'+linkStr[0]+'</a>';
			
		}
		else{
			tempobj.operate = '<a class="fun_link link" title="'+linkStr[1]+'" href="javascript:void(0);" onclick="flux_manual_change_state('+ tempobj.id  +',\'true\');">'+linkStr[1]+'</a>';
		}
		tempobj.operate += '<a onclick="qos_priority_update('+ index +')" title="'+appCommonJS.btnTitle.edit+'" class="fun_link edit" href="javascript:void(0);">'+appCommonJS.btnTitle.edit+'</a>';
		tempobj.operate += '<a onclick="qos_priority_del('+ index +')" title="'+appCommonJS.btnTitle.del+'" class="fun_link del" href="javascript:void(0);">'+appCommonJS.btnTitle.del+'</a>';

        data_new.push(tempobj);
        qos_priority_list_data[index] = data[i];
        index++;
    }
	
	var tab = new window.top.Table("qos_priority_list",appHtml.qosPriorityHead,data_new);
	tab.initTable();
    nos.app.resizePage();
}
/**
 * 得到选中的用户组数据
 * @returns {string}
 */

/**
 * 应用优先级添加的方法
 */
function qos_priority_add() {
    if (!check_app_input("qos_priority_form")) {
        return;
    }
    /////////////////////////////
    if (!check_user_lan_ip_combine()) { //源主机用户组联合校验
        return;
    }

    if (!check_dns_wan_ip_combine()) {  //目的主机dns组联合校验
        return;
    }
    ////////////////////////////
    if (!check_proto_sele()) {        //协议及端口校验
        return;
    }
    ////////////////////////////
    if (!check_g_time()) {      //时间校验
        return;
    }
    //////////////////////
    get_user_lan_ip_conbine();

    get_time_group();
    ////////////////////

    //qos_filter_add.cgi   应用优先级添加数据的后台文件 qos_priority_form
    //传一个标记 deal = add  表示增加
	show_message("save");
	window.setTimeout(function(){
		nos.app.net('qos_filter_add.cgi', "qos_priority_form", function (data) {
			if (data == "SUCCESS") {
				show_message("success", appCommonJS.controlMessage.s_suc);
			} else {
				show_message("error", igd.make_err_msg(data));
				if ($("#action_hidden").val() == "add") {
					$("#save_button").html(appCommonJS.Button.add)
				} else {
					$("#save_button").html(appCommonJS.Button.edit)
				}
			}
			load_app_page(current_html, "init_" + current_html);
		});
	},1000);
}

/**
 * 应用优先级开启、关闭状态
 * @param rowid
 * @param val
 * @returns {boolean}
 */
function flux_manual_change_state(rowid, val) {
    var str = "",linkStr = appHtml.linkStr;
    if (val == "true") {
        str = linkStr[1];
    } else {
        str = linkStr[0];
    }
    var infoStr = appHtml.dialogStr;
    var info = infoStr[0] + str + infoStr[1];
    show_dialog(info, function () {
        qos_priority_update(rowid);
        select_chose_set("enable_id", val);
		qos_priority_add();
    })
}

function qos_priority_update(val) {
    $("#action_hidden").val("modify");
    $("#save_button").html(appCommonJS.Button.edit);
    $("#cancel").show();
    var obj = qos_priority_list_data[val];
    //原有数据id
    $("#old_id").val(obj.id);
    select_chose_set("enable_id", obj.enable);
    $("#prio")[0].value = obj.priority;
    $("#name_id")[0].value = obj.name;
    //数据转发队列
    select_chose_set("class_id", obj.pri_list);

    //源主机 内网主机--------------
    modify_lan_mode_change(obj); //lan_host_flag
    //-----------------------------

    //目的主机---------------------
    modify_wan_mode_change(obj);  //wan_host_flag
    //-----------------------------
    //协议与端口
    change_proto_user_sele(obj);
    //时间
    show_g_time(obj);
    //时间组
    modify_time_group(obj);
}

/**
 * 删除单条数据
 */
function qos_priority_del(i) {
    //i  表示每行的序号
    var str = "deal=del&id=" + qos_priority_list_data[i].id;
    show_dialog(appCommonJS.dialog.del_single, function(){
        //删除时候传一个标记 deal = del
        //将需要删除的数据信息及标记发到后台去
        //cgi_qos_rule_del.cgi 数据的  删除
        nos.app.net('cgi_qos_rule_del.cgi', str, function (data) {
            if (data == "SUCCESS") {
                show_message("success", appCommonJS.controlMessage.d_suc);
            }
            else {
                show_message("error", igd.make_err_msg(data));
            }
            load_app_page(current_html, "init_" + current_html);
        });
    })
}

/**
 * 删除全部函数
 */
function qos_policy_clean() {
    var str = "no=non";
    show_dialog(appCommonJS.dialog.del_all,function(){
            //删除时候传一个标记 no=non
            //将需要删除的数据信息及标记发到后台去
            //cgi_qos_rule_del.cgi 数据的  删除
            nos.app.net('qos_filter_clean.cgi', str, function (data) {
                if (data == "SUCCESS")
                    show_message("success", appCommonJS.controlMessage.d_suc);
                else
                    show_message("error", igd.make_err_msg(data));
                load_app_page(current_html, "init_" + current_html);
            });
        }
    )
}

/**
 * 应用优先级设置取消修改函数 全部重置复原
 */
function cancel_update() {
    load_app_page("qos_priority", "init_qos_priority");
}
////////////////应用优先级结束//////////////

//高级设置选项卡

function init_qos_advance(){
    init_app_language(appL.smartqos.qos_advance);
	nos.app.resizePage();
	nos.app.net('qos_basic_setup_show.cgi', 'noneed=noneed', qos_advance_callback);
}

function qos_advance_callback(data){
	//网页、游戏转发队列
	$("#web_first").val(data["switch"]["web_first"]);
	//网页视频转发队列
	$("#movie_first").val(data["switch"]["movie_first"]);
	//
	$("#udp_up_len").val(data["switch"]["udp_up_len"]);
	
	radio_set(data["switch"]["private_skip"],"private_skip");
	set_reserved(g_wan_num, data);
	
	//数据转发队列设置
	queue_set(data);
}

function set_reserved(n, data){
	 for (var i = 1; i <= n; i++) {
		 var up_reserved = eval('(' + "data['switch'].up_reserved" + i + ')');
		 var down_reserved = eval('(' + "data['switch'].down_reserved" + i + ')');
		 $("#wan_setup_up_reserved" + i).val(up_reserved);
		 $("#wan_setup_down_reserved" + i).val(down_reserved);
    }
}

//数据转发队列设置
function queue_set(tempdata) {
    for (var k = 0; k < 8; k++) {
        $("#class_text_feal" + parseInt(k + 1))[0].value = eval("(" + "tempdata['queue" + k + "'].fact" + ")");
        $("#class_text_max" + parseInt(k + 1))[0].value = eval("(" + "tempdata['queue" + k + "'].max" + ")");
    }
}
//保证带宽 验证
var chk_obj = {};
chk_obj.chk_ret = true;
chk_obj.id = "";
function qos_feal_left_math() {
	hide_msgbox();
	chk_obj.chk_ret = true;
	chk_obj.id = "";
    var h = 1;
    var sum = 0;
    for (h = 1; h <= 8; h++) {
        var bit_fval = $("#class_text_feal" + h)[0].value;
        if (bit_fval == "" || bit_fval == null)bit_fval = 0;
        bit_fval = parseInt(bit_fval, 10);
        if (isNaN(bit_fval) || bit_fval < 0) {
            bit_fval = 0;
            $("#class_text_feal" + h)[0].value = '';
        }
        sum = sum + bit_fval;
        if (sum >= 100) {
            $("#class_text_feal" + h)[0].value = (bit_fval + 100) - sum;
            sum = 100;
        }
		//保证带宽需小于最大带宽
		var r_val = parseInt($("#class_text_max" + h)[0].value,10);
		if(bit_fval > r_val){
			show_msg_tip("class_text_feal" + h,appHtml.r_lte_m);
			chk_obj.chk_ret = false;
			chk_obj.id = "class_text_feal" + h;
		}
    }
}
//最大带宽验证
function qos_max_left_math(i) {
	hide_msgbox();
	chk_obj.chk_ret = true;
	chk_obj.id = "";
    var bit_fval = $("#class_text_max" + i)[0].value;
    if (bit_fval == "" || bit_fval == null)bit_fval = 0;
    bit_fval = parseInt(bit_fval, 10);
    if (isNaN(bit_fval) || bit_fval < 0) {
		bit_fval = 0;
        $("#class_text_max" + i)[0].value = '';
    }
    if (bit_fval > 100) {
		bit_fval = 100;
        $("#class_text_max" + i)[0].value = 100;
    }
	//保证带宽需小于最大带宽
	var r_val = parseInt($("#class_text_feal" + i)[0].value,10);
	if(bit_fval < r_val){
		show_msg_tip("class_text_max" + i,appHtml.m_gte_r);
		chk_obj.chk_ret = false;
		chk_obj.id = "class_text_max" + i;
	}
}

function qos_advance_submit(){
	if(!chk_obj.chk_ret){
		if(chk_obj.id.indexOf("max") != -1){
			show_msg_tip(chk_obj.id,appHtml.m_gte_r);
		}
		else{
			show_msg_tip(chk_obj.id,appHtml.r_lte_m);
		}
		return;
	}
	 if (check_app_input("qos_advance_form")) {
		show_message("save");
        nos.app.net('qos_advance_set.cgi', 'qos_advance_form', function (data) {
            if (data == "SUCCESS") {
                show_message("success");
            } else {
                show_message("error", igd.make_err_msg(data));
            }
			load_app_page(current_html, "init_" + current_html);
        });
    }
}

function show_msg_tip(id,return_val){
	var ctr_obj = document.getElementById(id);
	var point_xy = getPosition(ctr_obj);
	point_xy.x += ctr_obj.clientWidth - 60;
	point_xy.y -= ctr_obj.clientHeight;
	var msgbox = new MessageBox(return_val, point_xy);
	msgbox.Show();	
}