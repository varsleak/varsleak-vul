/********************************设备管理菜单********************************************************/
//for mobile
function get_lan_ip() {
    $.post("/router/lan_show.cgi", {
        noneed: "noneed"
    }, function (data) {
        var data = dataDeal(data);
        ROUTE_INFO.lan_ip = data.lan_ip;
        ROUTE_INFO.lan_mask = data.lan_mask;
    });
}

//恢复默认
var param_list = [
    {
        id: "network_param",
        param_key: ["keep_wan_config", "keep_wifi_config"]
    },
    {
        id: "host_name_param",
        param_key: ["keep_host_config"]
    },
    {
        id: "plugin_param",
        param_key: ["keep_plugin"]
    }
];

function init_rally_default() {
    $("#restore_default_div input[type=checkbox]").eq(0).focus();
}

function RstoreDefault() {
    show_dialog(L.comfirm_default, function () {
        DoRstoreDefault();
    }, function () {
        hide_dialog();
    });
    //confirm对话框，确定跳转到DoRstoreDefault();
}

function DoRstoreDefault() {
    hide_dialog();
	var str = $("#param_save_hidden").val();
	var obj = {};
	if(str == "0")
    	obj.noneed = "noneed";
	else{
		var paramVal;
		for(var i in param_list){
			if($("#" + param_list[i].id).prop("checked"))
				paramVal = 1;
			else
				paramVal = 0;
			for(var j in param_list[i].param_key){
				obj[param_list[i].param_key[j]] = paramVal;
			}
		}
	}
	rstore_default_param(obj);
}

function rstore_default_param(obj){
	$.post("/router/RestoreDefault.cgi", obj, function (data) {
        var data = dataDeal(data);
        if (data == "SUCCESS") {
            ROUTE_INFO.lan_ip = igd.global_param.default_ip;
            ROUTE_INFO.lan_mask = igd.global_param.default_lan_mask;
            ROUTE_INFO.g_port = igd.global_param.default_port;
            $("#restore_default_div").removeClass().addClass("section_hide");
			$("#reset_div").removeClass("section_hide").addClass("section_show");
			soft_restart("reboot");
			set_w_lock_div();
			onbeforeunload_event(L.recover_param);
        } 
		else {
            show_message("error", igd.make_err_msg(data));
        }
    });
}

function param_save_change(){
	var str = $("#param_save_hidden").val();
	if(str == "0"){
		$(".param").attr({"disabled":true,"checked":false});
	}
	else{
		$(".param").attr({"disabled":false,"checked":true});
	}
}

function param_choose(){
	//全不选
	if($("input[class=param]:checked").length == 0) {
		$(".param").attr({"disabled":true,"checked":false});
		$("#param_save").removeClass("radio_on").addClass("radio_off");
		$("#param_save_hidden").val(0);
	}
}

//升级
var updateTabData = {
	parent:"update_mode_layer",
	child:[
		 {name:"manual_update_div",func:"init_manual_update"},
		 {name:"auto_update_div",func:"init_auto_update_func"}
	]
};

function init_update() {
	var tab = new igd.ui.Tab(updateTabData);
	tab.init();
	if(from_index){
		//$(window).scrollTop($("#auto_update_info_frm").offset().top);
		$("#update_mode_layer div").eq(1).click();
	}
	from_index = false;
}

function init_auto_update_func(){
	init_auto_update_switch();
	init_auto_update();
}

function init_manual_update(){
	 get_lan_ip();
    /*if (browser.versions.iPad || (browser.versions.mobile || browser.versions.symbian)) {//mobile&ipad
        $("#manual_update_div").removeClass("section_show").addClass("section_hide");
    }*/
    //else {
        $("#manual_update_div").removeClass("section_hide").addClass("section_show");
    //}
    $("#put_file").unbind("change").bind("change", function () {
        set_file_name(this);
    });
    var token_id = TOOLS.Url.getQueryString()["token_id"];
    $("#update_form").attr("action", "/router/put_file.cgi?token_id=" + token_id);
	init_update_version();
}
var updateFileIsBin = function () {
    if (!/^.+\.bin$/.test($("#put_file").val())) {
        show_message("file_type_error");
        return false;
    }
    return true;
};
function set_file_name(obj){
	var file_name = getFileName($(obj).val());
	$("#update_file_name").html(file_name);
	$("#focus_help").focus();
    updateFileIsBin();
}

function init_update_version(){
	$.post("/router/ajax_show_system_status.cgi",{noneed:"noneed"},function(data){
		var data = dataDeal(data);
		$("#current_version").html(data.version);
	});
}

var UPDATE;
function answer() {
	$("#update_form").submit(function (e) {
        e.preventDefault();
    });
    var str = $("#put_file").val();
    if (str.length == 0) {
        show_message("need_file_name");
        //load_sub_html("update", "init_update", "nav_setting");
		recove_file_msg();
    }
	if (!updateFileIsBin()) return;
    else {
        show_dialog(L.comfirm_update, function () {
            DoUpdate();
        }, function () {
            cancelUpdate();
        });
    }
}

var delay_timer;
function DoUpdate() {
    hide_dialog();
    show_message("file_uploading");
	get_lan_ip();
    if (UPDATE)
        window.clearInterval(UPDATE);
	if(delay_timer)
		clearTimeout(delay_timer);
	delay_timer = window.setTimeout(function(){
		UPDATE = window.setInterval(update_iframe_check, 3000);
	},5000);
    $("#update_form").unbind("submit").bind("submit");
    $("#update_form").submit();
    window.setTimeout(function () {
        onbeforeunload_event(L.uploading);
    }, 500);
}

function cancelUpdate() {
    $(".focus_help").focus();
    hide_dialog();
}

var update_check_timer = null;
function update_iframe_check() {
	$.post("/router/get_update_result.cgi",{noneed:"noneed"},function(data){
		var flag = dataDeal(data);
		try{
			if(flag != "INIT"){
                var resultType = "";
                if (flag != 'SUCCESS') {
                    resultType = false;
					if(flag == undefined){//超时为undefined
						return;
					}
					else{
						show_message("file_error");
					}
					if(update_check_timer)
						clearTimeout(update_check_timer);
					update_check_timer = window.setTimeout(function(){
						update_check_result(resultType);
					},2000);
                }
                else{
					update_check_result(resultType);
				}
			}
		}
		catch (err) {
			show_message("exception");
			update_iframe_check_msg();
			if(update_check_timer)
				clearTimeout(update_check_timer);
			update_check_timer = window.setTimeout(function(){
				update_check_result(resultType);
			},2000);
		}
	});
}

function update_check_result(resultType){
	window.clearInterval(UPDATE);
	hide_pop_layer("message_layer");
	hide_lock_div();
	set_w_lock_div();
	$("#manual_update_div").removeClass("section_show").addClass("section_hide");
	$("#auto_update_div").removeClass("secton_show").addClass("section_hide");
	$("#reset_div").removeClass("section_hide").addClass("section_show");
	if (auto_update_timer)
		window.clearInterval(auto_update_timer);
	soft_restart("update", resultType);
}

function update_iframe_check_msg() {
    window.clearInterval(UPDATE);
    window.clearInterval(REBOOT);
    window.onbeforeunload = null;
    //load_sub_html("update", "init_update", "nav_setting");
	recove_file_msg();
}

function recove_file_msg(){
	$("#update_file_name").html("");
	var file_ctrl = $("#put_file");
	var clone_node = file_ctrl.clone();
	file_ctrl.after(clone_node.val("")); 
	file_ctrl.remove(); 
	clone_node.unbind("change").bind("change",function(){
		set_file_name(this);
	});
}

var REBOOT;
function soft_restart(type, isMobile) {
    // isMobile  with mobile is type ; the get_update_result.cgi result is false in PC     by lwj
    if (type == "update") {
        if (isMobile === false)
            Time = ROUTE_INFO.rebootTime;
        else
            Time = ROUTE_INFO.updateTime;
    }
    else if (type == "reboot")
        Time = ROUTE_INFO.rebootTime;
    var span = $("#time");
    var time = parseInt(Time, 10);
    span.html(time);
    if (REBOOT)
        window.clearInterval(REBOOT);
    REBOOT = window.setInterval(function () {
        time--;
        span.html(time);
        if (time == 0) {
            window.onbeforeunload = null;
            if (!!isMobile) {
                app_compatible.show_cut_net_tip(null, true);
            }
            else
                RebootDelay();
            window.clearInterval(REBOOT);
        }
    }, 1000)
}

function RebootDelay() {
    var path = "http://" + ROUTE_INFO.lan_ip;
    if (ROUTE_INFO.g_port != "80") {
        window.open(path + ":" + ROUTE_INFO.g_port, "_self");
    }
    else {
        window.open(path, "_self");
    }
}

//show update log
function update_scroll(){
	var scroll_elem = $("#update_log_cnt");
	var o_height = scroll_elem.height() + "px";
	scroll_elem.slimScroll({
		width: 'auto', //可滚动区域宽度
		height: o_height, //可滚动区域高度
		size: '11px', //组件宽度
		color:'#c7c7c7',
		opacity: 1, //滚动条透明度
		alwaysVisible: true ,//是否 始终显示组件
		disableFadeOut: false, //是否 鼠标经过可滚动区域时显示组件，离开时隐藏组件
		railVisible: true, //是否 显示轨道
		railColor: '#ebebeb', //轨道颜色
		railOpacity: 1, //轨道透明度
		borderRadius: '7px' //滚动条圆角
	});
}
function show_update_log(){
	update_scroll();
//    json_ajax({
//        url: "/web360/checkupdate.cgi",
//        data: {},
//        successFn: function (data) {
            var newVersionTxt = function(data){
                var versionTxt = data =[
                    "在IE中input.name不能正常赋值",
                    "由于Name属性在不同浏览器赋值不同，所以在操作时应该注意。",
                    "Js动态生成Input标签",
                    "蕃薯耀 2013年12月7日 15:28:02 星期六",
                    "如果使用CSS定义input样式 可以用 className 指定样式名，如用JS创建，放开下面的注",
                    "在IE中input.name不能正常赋值",
                    "由于Name属性在不同浏览器赋值不同，所以在操作时应该注意。",
                    "Js动态生成Input标签",
                    "蕃薯耀 2013年12月7日 15:28:02 星期六",
                    "如果使用CSS定义input样式 可以用 className 指定样式名，如用JS创建，放开下面的注",
                    "在IE中input.name不能正常赋值",
                    "由于Name属性在不同浏览器赋值不同，所以在操作时应该注意。",
                    "Js动态生成Input标签",
                    "蕃薯耀 2013年12月7日 15:28:02 星期六",
                    "如果使用CSS定义input样式 可以用 className 指定样式名，如用JS创建，放开下面的注"
                ],i;
                var _$ul = $("<ul class='updateTxt'></ul>");
                for(i=0;i< versionTxt.length;i++){
                    $("<li/>").html(versionTxt[i]).appendTo(_$ul);
                }
                $("#logTxtContent").html("");
                _$ul.appendTo($("#logTxtContent"));
                },
                show_log_txt = function(){
                    var _this = $("#logContent"),
                        left = (parseInt(document.documentElement.scrollWidth) - _this.width()) / 2 + "px",
                        top = document.documentElement.scrollTop + document.body.scrollTop + (document.documentElement.clientHeight - _this.height()) / 2 + "px";//fix chrome bug
                    _this.css("left", left);
                    _this.css("top", top);
                    show_lock_div();
                    _this.show();
                    $("#logTxtContent").focus();
                },
                htmlAddEvent= function(){
                    $("#log_confirm_btn,#logTxtTitleShut").unbind("click").bind("click",function(){
                        $("#logContent").hide();
                        hide_lock_div();
                    });
                };
            newVersionTxt(1);
            show_log_txt();
            htmlAddEvent();

//        }
//    });
}

//自动升级

function init_auto_update(){
	init_version_check();
	auto_update_loop();
}

function auto_update_checkbox_change(emt) {
	show_message("save");
	var obj = {};
	if($(emt).prop("checked"))
		obj["switch"] = "on";
	else
		obj["switch"] = "off";
   $.post('/router/auto_up_set.cgi',obj,function(data){
		var data = dataDeal(data);
		if(data == "SUCCESS")
			show_message("success");				
		else
			show_message("error",igd.make_err_msg(data));
		init_auto_update_switch();
	});	
}

var auto_update_timer;
var slide_flag = false;
function init_auto_update_switch(){
	$.post("/router/auto_up_show.cgi",{noneed:"noneed"},function(data){
			var data = dataDeal(data);
			if(data["switch"] == "on")
				$("#auto_update_checkbox").prop("checked", true);
			else
				$("#auto_update_checkbox").prop("checked", false);
			//$("#auto_update_checkbox").prop("checked", data["switch"]*1);
	});
}

function auto_update_loop(){
	if(auto_update_timer)
		window.clearInterval(auto_update_timer);
	auto_update_timer = window.setInterval(function(){
		if(current_html == "update"){
			init_version_check();
		}
		else{
			window.clearInterval(auto_update_timer);
		}
	},1000);
}

var auto_update_click_timer;
var auto_update_timer_count = 60;
function update_check(){
    auto_update_timer_count = 60;
	if(auto_update_click_timer)
		window.clearInterval(auto_update_click_timer);
	auto_update_click_timer = window.setInterval(function(){
		$("#check_btn").attr("disabled",true).addClass("btn_disabled");
		$("#check_btn").val(L.checking + "(" + (auto_update_timer_count--) + ")");
		if(auto_update_timer_count == 0){
			$("#check_btn").attr("disabled",false).removeClass("btn_disabled");
			$("#check_btn").val(L.version_check);
			window.clearInterval(auto_update_click_timer);
		}
	},1000);
	$.post('/router/version_check.cgi',{op:"check",from:"page"},function(data){
		auto_update_loop();
	});	
}

function start_update(){
	$("#update_btn").attr("disabled",true).addClass("btn_disabled");
	$.post('/router/version_check.cgi',{op:"update"},function(data){});
}

function cancel_update(){
	$("#cancel_btn").attr("disabled",true).addClass("btn_disabled");
	$.post('/router/version_check.cgi',{op:"abort"},function(data){});
}

var AUTO_UPDATE_BTN = ["check_btn","update_btn","cancel_btn"];

function reset_auto_update_btn(){
	for(var i in AUTO_UPDATE_BTN){
		$("#" + AUTO_UPDATE_BTN[i]).removeClass("section_inline").addClass("section_hide");
	}
}

function auto_update_download(data){
	$("#pro_section").removeClass("section_hide").addClass("section_show");
	var _this = $("#pro_layer");
	var cur_size = parseInt(data.cur_size,10);
	var total_size = parseInt(data.total_size,10);
	if(total_size == 0){//0%
		_this.removeClass("section_show").addClass("section_hide");
		$("#pro_percent").html("0%");
		$("#pro_bar").css("width","0%");
	}
	else{
		var percent = ((cur_size/total_size) * 100).toFixed(2);
		if(percent >= 50){
			$("#pro_percent").css("color","#fff");	
		}
		else{
			$("#pro_percent").css("color","#8D8D8D");
		}
		var sPercent = ""
		if(percent >= 100){
			sPercent = "100%";
		}
		else
			sPercent = percent + "%";
		
		$("#pro_percent").html(sPercent);
		$("#pro_bar").css("width",sPercent);
	}
}

function auto_update_excute(){
	onbeforeunload_event(L.uploading);
	$("#manual_update_div").removeClass("section_show").addClass("section_hide");
	$("#auto_update_div").removeClass("section_show").addClass("section_hide");
	$("#reset_div").removeClass("section_hide").addClass("section_show");
	set_w_lock_div();
	window.clearInterval(auto_update_timer);
	soft_restart("update");
}

function show_auto_update_info(data){
	$("#cur_version").html(data.cur_version);
	if(data.new_version != ""){
		$("#new_version_layer").removeClass("section_hide").addClass("section_show");
		$("#new_version").html(data.new_version);
		$("#auto_update_wait").removeClass("section_show").addClass("section_hide");//for mobile
	}
	else{
		$("#new_version_layer").removeClass("section_show").addClass("section_hide");
		$("#new_version").html("");
		$("#auto_update_wait").removeClass("section_hide").addClass("section_show");//for mobile
	}
	var s = parseInt(data.status);
	if(igd.update_info[s].info != undefined)
		$("#update_status").html(igd.update_info[s].info);
}

var auto_update_pre_status = 0,auto_update_cur_status = 0;
var test_timer = null;



function init_version_check() {
    $.post('/router/version_check.cgi', {op: "dump"}, function (data) {
        var data = dataDeal(data);
        show_auto_update_info(data);
        reset_auto_update_btn();
        //此操作步骤用于控制逻辑显示,驱使用户进行操作(比如说按钮)
        var step = parseInt(data.step);

        auto_update_pre_status = auto_update_cur_status;
        auto_update_cur_status = step;
        var status = parseInt(data.status);
        if (auto_update_pre_status != auto_update_cur_status) {
            //$("#update_btn").attr("disabled",false).removeClass("btn_disabled");
            $("#cancel_btn").attr("disabled", false).removeClass("btn_disabled");
        }
        if (step == 0) {//初始化
            $("#update_btn").removeClass("section_inline").addClass("section_hide");
            $("#check_btn").attr("disabled", false).removeClass("section_hide btn_disabled").addClass("section_inline");
            $("#pro_section").removeClass("section_show").addClass("section_hide");
        }
        else if (step == 1) {//检测阶段
            $("#update_btn").removeClass("section_inline").addClass("section_hide");
            $("#check_btn").removeClass("section_hide").addClass("section_inline");
            $("#pro_section").removeClass("section_show").addClass("section_hide");
        }
        else if (step == 2) {//用户确认是否下载固件
            $("#update_btn").attr("disabled", false).removeClass("section_hide btn_disabled").addClass("section_inline");
            $("#check_btn").removeClass("section_inline").addClass("section_hide");
            $("#pro_section").removeClass("section_show").addClass("section_hide");
        }
        else if (step == 3) {//下载过程
            $("#update_btn").removeClass("section_inline").addClass("section_hide");
            $("#cancel_btn").removeClass("section_hide").addClass("section_inline");
            if (31 == status) {
                $("#pro_section").removeClass("section_show").addClass("section_hide");
            } else {
                auto_update_download(data);
            }
        }
        else if (step == 4) {//下载完成，开始校验
            $("#pro_section").removeClass("section_show").addClass("section_hide");
            reset_auto_update_btn();
        }
        else if (step == 5) {//发送升级指令
            $("#pro_section").removeClass("section_show").addClass("section_hide");
            reset_auto_update_btn();
        }
        else if (step == 6) {//开始升级
            auto_update_excute();
        }
    });

}

//用户管理
function init_password() {
    init_text_event();
	//var pwd_ctrl = new passwordToggle("igd_webs_password1");
	//pwd_ctrl.init();
    $("#igd_webs_user").val(igd.global_param.default_user);
    $("#password_layer").removeClass("section_hide").addClass("section_show");
    $("#multi_user_layer").removeClass("section_show").addClass("section_hide");
}
//cgi value
//action id pwd1 pwd2 type user
function user_password_set() {
    if (check_input("user_pwd_frm")) {
        var opwd = $("#igd_webs_old_password").val();
        var pwd1 = $("#igd_webs_password1").val();
        var pwd2 = $("#igd_webs_password2").val();
        var return_val = check_pwd_differ(pwd1, pwd2);
        if (return_val != true) {
            show_differ_tip(return_val, "igd_webs_password2");
            return false;
        }
        return_val = check_pwd_differ(pwd1, opwd);
        if (return_val == true) {
            show_differ_tip(L.pwd_same, "igd_webs_password1");
            return false;
        }
        show_message("save");
        var obj = igd.ui.form.collect("user_pwd_frm");
        $.post("/router/new_user_pass_set.cgi", obj, function (data) {
            var data = dataDeal(data);
            if (data == "SUCCESS") {
                show_message("success");
                loginOut();
            }
            else {
                show_message("error", igd.make_err_msg(data));
            }
            init_password();// 多用户判断
        });
    }
}

//时间设置
var ck_system_time_obj = {};
function init_system_time() {
    init_text_event();
    ck_system_time_obj.year = "";
    ck_system_time_obj.month = "";
    ck_system_time_obj.day = "";
    ck_system_time_obj.hour = "";
    ck_system_time_obj.minute = "";
    ck_system_time_obj.second = "";
    sys_time_show();//定时刷新时间
    //设置类型
    $.post("/router/sys_time_show.cgi", {noneed: "noneed"}, function (data) {
        var data = dataDeal(data);
        $("#current_time").html(data.time);
        $("#timezone_sel").val(data.ntp);
        var date_time = data.time.split(' ');
        var _date = date_time[0].split('-');
        var _time = date_time[1].split(':');
        if (date_time.length != 0) {
            ck_system_time_obj.year = _date[0];
            ck_system_time_obj.month = _date[1];
            ck_system_time_obj.day = _date[2];
            ck_system_time_obj.hour = _time[0];
            ck_system_time_obj.minute = _time[1];
            ck_system_time_obj.second = _time[2];
            fiil_system_time(ck_system_time_obj);
        }
        radio_sele_set('get_time_mode', data.work_mode);
        change_get_time_mode(data.work_mode);
    });
}

function fiil_system_time(obj) {
    $("#system_year").val(obj.year);
    $("#system_month").val(obj.month);
    $("#system_day").val(obj.day);
    $("#system_hour").val(obj.hour);
    $("#system_minute").val(obj.minute);
    $("#system_second").val(obj.second);
}

var sys_time_timer;
function sys_time_show() {
    if (sys_time_timer)
        window.clearInterval(sys_time_timer);
    sys_time_timer = window.setInterval(function () {
        if (current_html != "system_time") {
            window.clearInterval(sys_time_timer);
        }
        else {
            $.post("/router/sys_time_show.cgi", {noneed: "noneed"}, function (data) {
                var data = dataDeal(data);
                $("#current_time").html(data.time);
            });
        }
    }, 1000);
}

function change_get_time_mode(str) {
    $("#get_time_mode_hidden").val(str);
    if (str == "1") {
        $("#manual_set_div").removeClass("section_hide").addClass("section_show");
        $("#ntp_div").removeClass("section_show").addClass("section_hide");
    }
    else {
        $("#manual_set_div").removeClass("section_show").addClass("section_hide");
        $("#ntp_div").removeClass("section_hide").addClass("section_show");
        hide_msgbox();
        fiil_system_time(ck_system_time_obj);
        $("#system_year,#system_month,#system_day,#system_hour,#system_minute,#system_second").removeClass().addClass("input-text input-small");
    }
}

//cgi value
//NTP work_mode year month day hour minute second
function system_time_submit() {
    if ($("#get_time_mode_hidden").val() == "1") {
        if (!check_input("system_time_frm"))
            return;
		//时间范围限定在2008-2037
    	var year = $("#system_year").val()*1;
		if(year < 2008 || year > 2037){
			show_message("error",L.year_range);
			return;
		}
	}
	
    show_message("save");
    var obj = igd.ui.form.collect("system_time_frm");
    $.post("/router/sys_time_set.cgi", obj, function (data) {
        var data = dataDeal(data);
        if (data == "SUCCESS")
            show_message("success");
        else
            show_message("error", igd.make_err_msg(data));
        init_system_time();
    });
}

var rebootTabData = {
	parent:"reboot_mode_layer",
	child:[
		 {name:"reboot_now_div",func:""},
		 {name:"reboot_timed_div",func:"set_reboot_time"}
	]
};

//重新启动
var ck_reboot_data = {};
function init_misc_reboot() {
	var tab = new igd.ui.Tab(rebootTabData);
	tab.init();
    init_text_event();
    get_lan_ip();
}


function set_reboot_time(){
	$.post("/router/reboot_timer_show.cgi", {noneed: "noneed"}, function (data) {
        var data = dataDeal(data);
		ck_reboot_data = data;
		radio_set(data.enable,"reboot_enable");
        reboot_state_change(data.enable)
        $("#reboot_mode").val(data.type);
        reboot_mode_set(data.type);
        if (data.type == "1") {
            filter_reboot_day(data.timer_day, "week_day");
        }
        if (data.type == "2") {
            filter_reboot_day(data.timer_day, "time_day");
        }
		$("#timer_day").val(data.timer_day);
        fill_reboot_time(data);
    });
}

function fill_reboot_time(obj) {
    $("#hour").val(obj.hour);
    $("#minute").val(obj.minute);
}

function clear_reboot_day(type) {
    for (var i = 0; i <= 6; i++) {
        $("#" + type + i).attr("checked", false);
    }
}

function filter_reboot_day(str, type) {
    clear_reboot_day(type);
    var day_array = str.split(" ");
    for (var i in day_array) {
        if ("" != day_array) {
            $("#" + type + (day_array[i] - 1)).attr("checked", "true");
        }
    }
}
function check_reboot_mode(str) {
	$("#timer_day").val("");
    var day_str = '';
    var flag = 0;
    var nu = 0;
    for (var h = 0; ; h++) {
        var obj = document.getElementById(str + h);
        if (obj == null)
            break;
        if (obj.checked == true) {
            day_str = day_str + obj.value + ' ';
            nu++;
        }
    }
    if (day_str == '' || day_str == null) {
        day_str = '';
        flag = 0;
    }
    else {
        flag = 1;
    }
    $("#timer_day").val(day_str);
    return flag;
}

function reboot_state_change(str) {
    $("#reboot_enable_hidden").val(str);
    if (str == "1") {
        section_disable("reboot_timed_layer", false);
		$("#reboot_timed_layer").removeClass("section_hide").addClass("section_show");
    }
    else {
        reboot_mode_set(ck_reboot_data.type);
		 if (ck_reboot_data.type == "1") {
            filter_reboot_day(ck_reboot_data.timer_day, "week_day");
        }
        if (ck_reboot_data.type == "2") {
            filter_reboot_day(ck_reboot_data.timer_day, "time_day");
        }
        $("#reboot_mode").val(ck_reboot_data.type);
		fill_reboot_time(ck_reboot_data);
        section_disable("reboot_timed_layer", true);
		$("#reboot_timed_layer").removeClass("section_show").addClass("section_hide");
    }
}

function soft_reboot() { //重新启动函数
    show_dialog(L.comfirm_reboot, function () {
        DosoftReboot();
    }, function () {
        hide_dialog();
    });
}

function DosoftReboot() {
    hide_dialog();
//    $.post("/router/reboot.cgi", {noneed: "noneed"}, function (res) {
//        var data = dataDeal(res);
//        if (data == "SUCCESS") {
//            $("#reboot_now_div,#reboot_timed_div").removeClass().addClass("section_hide");
//			$("#reset_div").removeClass("section_hide").addClass("section_show");
//			soft_restart("reboot");
//			set_w_lock_div();
//			onbeforeunload_event(L.rebooting);
//        } else {
//            show_message("error", igd.make_err_msg(data));
//        }
//    });
    $.post("/router/reboot.cgi", {noneed: "noneed"});//by lwj 无线在某些设备中会马上断网，接收不到返回信息
    var countNum = function () {
        $("#reboot_now_div,#reboot_timed_div").removeClass().addClass("section_hide");
        $("#reset_div").removeClass("section_hide").addClass("section_show");
        soft_restart("reboot");
        set_w_lock_div();
        onbeforeunload_event(L.rebooting);
    };
    countNum();
}

function reboot_mode_set(val) {
    $("#hour,#minute").removeClass().addClass("input-text input-small");
    $("#hour,#minute").val("0");
    clear_reboot_day("week_day");
    clear_reboot_day("time_day");
    hide_msgbox();
    if (val == "0") {
        $("#reboot_time").removeClass("section_show").addClass("section_hide");
        $("#reboot_week").removeClass("section_show").addClass("section_hide");
    }
    else if (val == "1") {
        $("#reboot_time").removeClass("section_show").addClass("section_hide");
        $("#reboot_week").removeClass("section_hide").addClass("section_show");
    }
    else if (val == "2") {
        $("#reboot_time").removeClass("section_hide").addClass("section_show");
        $("#reboot_week").removeClass("section_show").addClass("section_hide");
    }
}

//cgi value
//enable type time_day hour mimute 
function set_miscreboot() {
    if (!check_input("timed_reboot_form"))
        return;
    var enable = $("#reboot_enable_hidden").val();
    if (enable == "1") {
        if ($("#reboot_mode").val() == "1") {
            if (check_reboot_mode("week_day") == 0) {
                show_message("check_time_at_least");
                return;
            }
        }
        if ($("#reboot_mode").val() == "2") {
            if (check_reboot_mode("time_day") == 0) {
                show_message("check_time_at_least");
                return;
            }
        }
    }
    show_message("save");
    var obj = igd.ui.form.collect("timed_reboot_form");
    $.post("/router/reboot_timer_set.cgi", obj, function (data) {
        data = dataDeal(data);
        if (data == "SUCCESS")
            show_message("success");
        else
            show_message("error", igd.make_err_msg(data));
        set_reboot_time();
    });
}
//我的路由器信息
var init_router_info = function () {
    var cur_type;
    var wan_ip_timer = null;
    var wan_ip_flag = false;
    var wan_data_flag = false;
    var wan_link_timer = null;
    var wan_data_timer = null;
    var noLine_internet = L.not_link;
    var get_lan_info = function () {
        $.post("/router/lan_show.cgi", {noneed: "nonneed"}, function (res) {
            var data = dataDeal(res);
            $("#routerInfo_lanIp").html(data.lan_ip);
            $("#routerInfo_mask").html(data.lan_mask);
            $("#routerInfo_dhcp_status").html(parseInt(data["dhcp_enable"], 10) == 1 ? L.enable : L.closed);
            $("#routerInfo_dhcp_range").html(data.dhcp_start + "~" + data.dhcp_end);
            //for mobile
            $("#routerInfo_dhcp_start").html(data.dhcp_start);
            $("#routerInfo_dhcp_end").html(data.dhcp_end);
        });
    };
    var get_router_info = function () {
        var getRouterInfo = $.Deferred();
        get_wan_ip().then(function () {
            if ( !ROUTE_INFO.wan_ip || ROUTE_INFO.wan_ip == "0.0.0.0") {
                $("#routerInfo_wanIp").html(noLine_internet);
                wan_ip_flag = false;
            }
            else {
                $("#routerInfo_wanIp").html(ROUTE_INFO.wan_ip);
                wan_ip_flag = true;
            }
            getRouterInfo.resolve();
        });
        return getRouterInfo.promise();
    };
    var get_wan_info = function () {
        var getWanInfoDeferred = $.Deferred();
        $("#common_uiname").val("WAN1");
        var uiname = $("#common_uiname").val();
        var _wan_info = function () {
            $.post("/router/wan_config_show.cgi", {uiname: uiname}, function (data) {
                var data = dataDeal(data);
                var wan_data = data["COMMON"],mac = "";
                if (ROUTE_INFO.wan_ip == "") {
                    $("#routerInfo_dns_a").html(noLine_internet);
                    $("#routerInfo_dns_b").html(noLine_internet);
                    wan_data_flag = false;
                }
                else {
                    if (ROUTE_INFO.wan_ip_type == "WAN") {
						mac = wan_data["mac_current"];
						cur_type = data["COMMON"].connect_type.toUpperCase();
                        //当前状态的dns为0.0.0.0或当前状态没有dns时
                        if (!data[wan_data.connect_type].dns[0] || data[wan_data.connect_type].dns[0] == "0.0.0.0") {
                            //auto_dns为0.0.0.0或没有auto_dns时
                            if (!wan_data["auto_dns"][0] || wan_data["auto_dns"][0] == "0.0.0.0") {
                                $("#routerInfo_dns_a").html(noLine_internet);
                                $("#routerInfo_dns_b").html(noLine_internet);
                            }
                            else {
                                $("#routerInfo_dns_a").html(wan_data["auto_dns"][0]);
                                $("#routerInfo_dns_b").html(wan_data["auto_dns"][1]);
                                wan_data_flag = true;
                            }
                        }
                        else {
                            $("#routerInfo_dns_a").html(data[wan_data.connect_type].dns[0]);
                            $("#routerInfo_dns_b").html(data[wan_data.connect_type].dns[1]);
                            wan_data_flag = true;
                        }
                    }
                    else if (ROUTE_INFO.wan_ip_type == "WISP") {
						mac = data["WISP"].mac;
						cur_type = "WISP";
                        if (!!data["WISP"].dns) {
                            if (data["WISP"].dns[0] == "0.0.0.0" || !data["WISP"].dns[0]) {
                                $("#routerInfo_dns_a").html(noLine_internet);
                                $("#routerInfo_dns_b").html(noLine_internet);
                                wan_data_flag = false;
                            }
                            else {
                                $("#routerInfo_dns_a").html(data["WISP"].dns[0]);
                                $("#routerInfo_dns_b").html(data["WISP"].dns[1]);
                                wan_data_flag = true;
                            }
                        }
                        else {
                            $("#routerInfo_dns_a").html(noLine_internet);
                            $("#routerInfo_dns_b").html(noLine_internet);
                            wan_data_flag = false;
                        }
                    }
                }
                $("#routerInfo_wanMac").html(mac);
                getWanInfoDeferred.resolve();
            });
        };
        _wan_info();
        return getWanInfoDeferred.promise();
    };
	//显示当前拨号方式
	var show_wan_type = function(){
		var str = "";
		if(cur_type == "DHCP"){
			str = L.hitchDiagnosis_txt.wan_setup[1];
		}
		else if(cur_type == "PPPOE"){
			str = L.hitchDiagnosis_txt.wan_setup[0];
		}
		else if(cur_type == "WISP"){
			str = L.wds;
		}
		else{
			str = L.hitchDiagnosis_txt.wan_setup[2];
		}
		$("#online_info").html(L.online_info + "&nbsp;（" + str + "）");
	};
    //断网重连
    var show_link_btn = function () {
        if (wan_ip_flag && wan_data_flag && cur_type == "PPPOE") {
            $("#cutoff_link").html(L.relink).unbind("click").bind("click", function () {
                wan_cutdown();
            });
            $("#link_layer").removeClass("section_hide");
        }
    };
    var wan_cutdown = function () {
        $.post("/router/wan_status_set.cgi", {wanid: "WAN1", statu: "0"}, function (data) {
            var data = dataDeal(data);
            if (data == "SUCCESS") {
                show_cutdown_status();
                if (wan_link_timer)
                    window.clearTimeout(wan_link_timer);
                wan_link_timer = window.setTimeout(function () {
                    wan_link();
                }, 500);//500毫秒后手动重连
            }
            else {
                show_message("error", igd.make_err_msg(data));
            }
        });
    };
    var wan_link = function () {
        $.post("/router/wan_status_set.cgi", {wanid: "WAN1", statu: "1"}, function (data) {
            var data = dataDeal(data);
            if (data == "SUCCESS") {
                //link发送成功过后。循环调取dns&ip
                get_router_info_wan_ip();
            }
            else
                show_message("error", igd.make_err_msg(data));
        });
    };
    //显示重连动画按钮
    var show_cutdown_status = function () {
        $("#cutoff_link").unbind("click");
        $("#cutoff_link").html(L.link_str);
        $("#routerInfo_wanIp,#routerInfo_dns_a,#routerInfo_dns_b").html(L.not_link);
    };
    var get_wan_data = function () {
        var calleeFn = arguments.callee;
        if (wan_data_timer || current_html != "router_info")
            window.clearInterval(wan_data_timer);
        wan_data_timer = window.setTimeout(calleeFn, 1000);
        $.post("/router/wan_config_show.cgi", {uiname: "WAN1"}, function (data) {
            var data = dataDeal(data);
            var wan_data = data["COMMON"];
            if (!data[wan_data.connect_type].dns[0] || data[wan_data.connect_type].dns[0] == "0.0.0.0") {
                if (wan_data["auto_dns"][0] || wan_data["auto_dns"][0] != "0.0.0.0") {
                    $("#routerInfo_dns_a").html(wan_data["auto_dns"][0]);
                    $("#routerInfo_dns_b").html(wan_data["auto_dns"][1]);
                    clear_router_info_timer();
                }
            }
            else {
                $("#routerInfo_dns_a").html(data[wan_data.connect_type].dns[0]);
                $("#routerInfo_dns_b").html(data[wan_data.connect_type].dns[1]);
                clear_router_info_timer();
            }
        });
    };
    var clear_router_info_timer = function () {
        if (wan_data_timer)
            window.clearTimeout(wan_data_timer);
        //停掉动画
        $("#cutoff_link").bind("click", function () {
            wan_cutdown();
        });
        $("#cutoff_link").html(L.relink);
    };
    var get_router_info_wan_ip = function () {
        var calleeFn = arguments.callee;
        if (wan_ip_timer || current_html != "router_info")
            window.clearInterval(wan_ip_timer);
        wan_ip_timer = window.setTimeout(calleeFn, 1000);
        get_wan_ip();
        var status = false;
        if (ROUTE_INFO.wan_ip != "" && ROUTE_INFO.wan_ip != "0.0.0.0") {
            $("#routerInfo_wanIp").html(ROUTE_INFO.wan_ip);
            status = true;
            //获取到IP，停掉相应的计时器，紧接着开启wan口其他信息计时器，获取信息
            if (wan_ip_timer)
                window.clearTimeout(wan_ip_timer);
            get_wan_data();
        }
    };
    $.when( get_lan_info(),get_router_info(),get_wan_info()).then(function(){
        show_wan_type();
		show_link_btn();
    });

    window.wan_cutdown = wan_cutdown;
};
(function(){
    var getWanIpTimer = null;
    var wan_ip = function() {
        var wanIpDeferred = $.Deferred();
        (function(){
            var callMe = arguments.callee;
            $.post("/router/interface_status_show.cgi", {noneed: "noneed"},function(data){
                var res = dataDeal(data);
                var status;
                var getWanStatus = function(data){
                    for(var m in data ){
                        if(m.match(/(WAN).+/g)){
                            if(data[m].status>>>0 ===0) {
                                return {status:0,ip:data[m].ip,mask:data[m].mask};
                            }
                        }
                    }
                    return {status:data["WAN1"].status>>0,ip:data["WAN1"].ip,mask:data["WAN1"].mask};
                };
                var wanInfo = getWanStatus(res[0]);

                if(wanInfo.status!==0 && (wanInfo.status>>0)< 4 && res[0]["WISP"]){
                    if(res[0]["WISP"].status != "4"){
                        ROUTE_INFO.wan_ip=res[0]["WISP"].ip;
						ROUTE_INFO.wan_mask=res[0]["WISP"].mask;
                        ROUTE_INFO.wan_ip_type="WISP";
                    }
                    status=res[0]["WISP"].status>>0;
                }else{
                    status=wanInfo.status;
                    ROUTE_INFO.wan_ip=wanInfo.ip;
					ROUTE_INFO.wan_mask=wanInfo.mask;
                    ROUTE_INFO.wan_ip_type="WAN";
                }
                if(status === 4){
                    getWanIpTimer = setTimeout(callMe,2000);
                }else{
                    clearTimeout(getWanIpTimer);
                    wanIpDeferred.resolve();
                }
            });
        })();
        return wanIpDeferred.promise();
    };
    window.get_wan_ip = wan_ip;
})();
