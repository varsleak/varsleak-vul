//页面初始化函数
$(document).ready(function(){
	current_html = "auto_wan_lan";
	init_auto_wan_lan();
});

var NUM = 5;
var appJs = appL.auto_wan_lan.js
function init_auto_wan_lan(){
	count = 1;
	init_app_language(appL.auto_wan_lan);
	nos.app.net('./auto_wan_lan.cgi','action=get',init_auto_wan_lan_callback);
}

var animate_timer;
function init_auto_wan_lan_callback(data){
	radio_set(data.enable,"auto_wan_lan_status");
	set_panel(data);
	if(timer){//此时一轮跑马灯动画为完结
		window.setTimeout(function(){
			set_auto_wan_lan_loop(data);
		},speed*(NUM-1));
	}
	else
		set_auto_wan_lan_loop(data);
}

var auto_wan_lan_timer;
var count = 1;
function set_auto_wan_lan_loop(data){
	if(auto_wan_lan_timer)
		window.clearInterval(auto_wan_lan_timer);
	auto_wan_lan_timer = window.setInterval(function(){
		if(current_html != "auto_wan_lan" || data.enable == "0")
			window.clearInterval(auto_wan_lan_timer);
		else
			nos.app.net('./auto_wan_lan.cgi','action=get',set_auto_wan_lan_data);
	},1000);
}


function set_auto_wan_lan_data(data){
	if(current_html != "auto_wan_lan" || data.enable == "0"){
		window.clearInterval(auto_wan_lan_timer);
	}
	set_panel(data);
}

var timeout_timer;
function set_panel(data){
	count++;
	if(count > 5){
		show_message("error",appJs.error);
		count = 1;
		$("#wan_wrapper .icon").find("div").removeClass("cur");
		$("#wan_wrapper .icon").find("span").html("");
		$("#detect_tip").addClass("off");
		if(timer)
			window.clearTimeout(timer);
		if(animate_timer)
			window.clearTimeout(animate_timer);
		if(auto_wan_lan_timer)
			window.clearInterval(auto_wan_lan_timer);
		if(timeout_timer)
			window.clearTimeout(timeout_timer);
		timeout_timer = window.setTimeout(function(){
			init_auto_wan_lan();
		},5100);
		return;
	}
	var port = parseInt(data.port);
	if(port == 5){
		$("#detect_tip").removeClass("off");
		//跑马灯动画
		animate_light(data);
		$("#tips").html(appJs.tips[0]);
	}
	else{
		count = 1;
		$("#detect_tip").addClass("off");
		$("#wan_wrapper .icon").find("div").removeClass("cur").eq(NUM-port-1).addClass('cur');
		$("#wan_wrapper .icon").find("span").html("").eq(NUM-port-1).html('WAN');
		if(data.enable == "0"){
			$("#tips").html(appJs.tips[2]);
		}
		else{
			$("#tips").html(appJs.tips[1]);
		}
	}
}

function save_auto_wan_lan(){
	show_message("save");
	nos.app.net('./auto_wan_lan.cgi','auto_wan_lan_frm',save_auto_wan_lan_callback);
}

var speed = 400;
var timer;//跑马灯动画计时器
function animate_light(data){
	//停止外层循环动画
	if(auto_wan_lan_timer){
		window.clearInterval(auto_wan_lan_timer);
	}
	$("#wan_wrapper .icon").find("span").html("");
	var elem = $("#wan_wrapper .icon").find("div");
	elem.each(function(k,v){
		timer = window.setTimeout(function(){
			elem.removeClass("cur");
			$(v).addClass("cur");
		},speed*k);
	});
	if(animate_timer)
		window.clearTimeout(animate_timer);
	animate_timer = window.setTimeout(function(){
		if(timer)
			window.clearTimeout(timer);
		nos.app.net('./auto_wan_lan.cgi','action=get',set_auto_wan_lan_data);
	},speed*(NUM-1));
}

function save_auto_wan_lan_callback(data){
	window.clearInterval(auto_wan_lan_timer);
	if (data == "SUCCESS") {
        show_message("success", appCommonJS.controlMessage.c_suc);
    }
	else {
        show_message("error", igd.make_err_msg(data));
    }
	init_auto_wan_lan();
}