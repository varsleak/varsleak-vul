//页面初始化函数
var appJs = appL.igd_sw.js;
$(document).ready(function(){
	current_html = "igd_sw";
	init_app_language(appL.igd_sw);
	safety_swap.init();
});

var me;
var safety_swap = {
	swap_time_out:60,//超时时间
	get_refresh_timer:null,//获取状态计时器
	countdown_timer:null,//倒计时计时器
	get_data_time:5,//获取时间计时器
	cur_time:0,//当前时间
	pre_status:"wait",//等待状态下的前状态
	cur_status:null,//等待状态下的现状态
	success_delay_timer:null,
	bind_event:function(){
		$("#start_btn,.retry_btn").unbind("click").bind("click",function(){
			nos.app.net('/app/igd_sw/webs/safety_swap_op.cgi','action=start',me.start_safety_swap_callback);
		});
	},
	start_safety_swap_callback:function(data){
		if(data.err_no == "0"){
			me.safety_swap_get();
			me.safety_swap_get_loop();
		}
		else if(data.err_no == "-1"){//no link
			me.show_no_link();
		}
	},
	safety_swap_get:function(){
		nos.app.net('/app/igd_sw/webs/safety_swap_get.cgi','action=get',me.safety_swap_get_callback);
	},
	safety_swap_get_callback:function(data){
		/*(data = '{"type":"pppoe_spe","usr":"","pwd":"","ip":"0.0.0.0","gw":"0.0.0.0","mask":"0.0.0.0","dns0":"114.114.114.114","dns1":"0.0.0.0"}';
		data = window.top.dataDeal(data);*/
		var type = data.type;
		me.pre_status = me.cur_status;
		me.cur_status = type
		if(type == "wait"){
			$("#link_down_icon").addClass("off");
			if(me.cur_status == me.pre_status){
				me.countdown();
			}
			else{
				me.show_wait();
				nos.app.resizePage();
			}
		}
		else if(type == "nolink"){
			me.show_no_link_retry();
			$("#coutdown_time").html(me.swap_time_out);
			nos.app.resizePage();
		}
		else if(type == "pppoe_spe" || type == "pppoe_len" || type == "pppoe_padi"){
			me.show_error(data);
			nos.app.resizePage();
		}
		else if(type == "pppoe" || type == "dhcp" || type == "static"){
			me.show_param(data);
			nos.app.resizePage();
		}
		
	},
	safety_swap_get_loop:function(){
		if(me.get_refresh_timer)
			window.clearInterval(me.get_refresh_timer);
		me.get_refresh_timer = window.setInterval(function(){
			if(current_html != "igd_sw"){
				window.clearInterval(me.get_refresh_timer);
			}
			else{
				me.cur_time += me.get_data_time;//每次调用的时候时间都加上定时刷新的秒数
				me.safety_swap_get();
			}
		},me.get_data_time*1000);
	},
	show_no_link:function(){
		$("#start_tip").addClass("off");
		$("#link_down_icon,#link_down_tip").fadeIn("slow",function(){
			$("#link_down_icon").css("display","");
			$(this).removeClass("off");
		});
		nos.app.resizePage();
	},
	
	show_wait:function(){
		//唯独此时不需要停计时器
		$("#link_down_icon").addClass("off");
		$(".section[class!=off]").hide().addClass("off");
		$("#wait").fadeIn("slow",function(){
			$(this).removeClass("off");
		});
		this.countdown();
	},
	show_no_link_retry:function(){
		me.status_switch();
		$("#link_down_icon").removeClass("off");
		$("#linkdown").fadeIn("slow",function(){
			$(this).removeClass("off");
		});
	},
	show_error:function(data){
		me.cur_status = null;
		$("#sp_layer").addClass("off");
		if(data && (data.type == "pppoe_spe" || data.type == "pppoe_len" || data.type == "pppoe_padi")){
			$("#error_pppoe").css("visibility","hidden");
			//显示当前用户名密码
			var ret = me.paint_list(data);
			if(data.type == "pppoe_spe"){
				if(!ret.usr_flag && !ret.pwd_flag && (ret.usr_flag != undefined && ret.pwd_flag != undefined)){
					$("#error_tip").html(appJs.pppoe_spe_error);
				}
				else{
					if(!ret.usr_flag && ret.usr_flag != undefined){
						$("#error_tip").html(appJs.pppoe_spe_usr_error);
					}
					else if(!ret.pwd_flag && ret.pwd_flag != undefined){
						$("#error_tip").html(appJs.pppoe_spe_pwd_error);
					}
				}
			}
			else if(data.type == "pppoe_len"){
				$("#error_tip").html(appJs.pppoe_len_error);
			}
			else if(data.type == "pppoe_padi"){
				$("#error_tip").html(appJs.pppoe_padi_error);
			}
			
			$("#error .retry_btn").addClass("off");
			$(".link_sp").unbind("click").bind("click",function(){
				
				/*$("#sp_layer").slideToggle("slow",function(){
					$("#sp_layer").css("visibility","visible");
				});*/
				
				$("#sp_layer").toggle();
				nos.app.resizePage();
			});
		}
		else{
			$("#error_tip").html(appJs.not_link_error);
			$("#error .retry_btn").removeClass("off");
		}
		me.status_switch();
		$("#error").fadeIn("slow",function(){
			$(this).removeClass("off");
			$("#error_pppoe ul li").css("float","left");
			var width = me.get_max_width($("#error_pppoe ul li")) + "px";
			$("#error_pppoe").css("width",width);
			$("#error_pppoe ul li").css("float","none");
			$("#error_pppoe").css({
				"width":width,
				"visibility":"visible"
			});
		});
		nos.app.resizePage();
	},
	show_success:function(type){
		me.status_switch();
		$("#correct").fadeIn("slow",function(){
			$(this).removeClass("off");
			var _tip = $("#correct_tip");
			$("#type ul").clone().appendTo(_tip);
			if(type == "static")
				_tip.after("<p class=\"recommend_tip\">"+ appJs.recommend_tip +"</p>");
			nos.app.resizePage();
		});
	},
	clear_all_param:function(){
		me.cur_time = 0;
		window.clearInterval(me.get_refresh_timer);
		window.clearInterval(me.countdown_timer);
	},
	status_switch:function(){
		//清空计时器，重新开始计时
		me.clear_all_param();
		$("#coutdown_time").html(me.swap_time_out);
		$("#link_down_icon").addClass("off");
		$(".section[class!=off]").hide().addClass("off")
	},
	paint_list:function(data){
		$("#type,#error_pppoe").html("");
		var usr = "", pwd = "";
		var type = data.type;
		var $ul = $("<ul/>");
		if(type == "dhcp"){
			var $li = $("<li/>");
			$li.html(appJs.connect_type_txt + appJs.connect_type[0]);
			$ul.append($li);
		}
		else if(type == "pppoe" || type == "pppoe_spe" || type == "pppoe_len"){
			var UserObj = parentEmt.get_rand_key(0,data.usr,true);
			usr = parentEmt.TOOLS.Crypto.textencode(parentEmt.getDAesString(data.usr,UserObj.rand_key));
			
			var PwdObj = parentEmt.get_rand_key(0,data.pwd,true);
			pwd = parentEmt.getDAesString(data.pwd,PwdObj.rand_key);
			var usr_flag = parentEmt.check_pppoe_string(parentEmt.TOOLS.Crypto.textdecode(usr));
			var pwd_flag = parentEmt.check_pppoe_string(parentEmt.TOOLS.Crypto.textdecode(pwd));
			for(var i = 0; i < 3; i++){
				var $li = $("<li/>");
				var $span_a = $("<span/>");
				$span_a.attr("class","pppoe");
				var $span_b = $("<span/>");
				if(i == 0){
					//$li.html(appJs.connect_type_txt + type.substring(0,3).toUpperCase() + type.substring(3,4).toLowerCase() + type.substring(4,5).toUpperCase());
					$span_a.html(appJs.connect_type_txt);
					$span_b.html(appJs.connect_type[1]);	
				}
				else if(i == 1){
					$span_a.html(appJs.pppoe_list[0]);
					$span_b.html(cutString(usr,90));
				}
				else if(i == 2){
					$span_a.html(appJs.pppoe_list[1]);
					$span_b.html(cutString(pwd,90));
				}
				$li.append($span_a);
				$li.append($span_b);
				$ul.append($li);
			}
		}
		else if(type == "static"){
			for(var i = 0; i < 6; i++){
				var $li = $("<li/>");
				var $span_a = $("<span/>");
				$span_a.attr("class","static");
				var $span_b = $("<span/>");
				if(i == 0){
					$span_a.html(appJs.connect_type_txt);
					$span_b.html(appJs.connect_type[2]);
				}
				else if(i == 1){
					$span_a.html(appJs.static_list[0]);
					$span_b.html(data.ip);
				}
				else if(i == 2){
					$span_a.html(appJs.static_list[1]);
					$span_b.html(data.gw);
				}
				else if(i == 3){
					$span_a.html(appJs.static_list[2]);
					$span_b.html(data.mask + appJs.recommend);
				}
				else if(i == 4 && data.dns0 != "0.0.0.0"){
					$span_a.html(appJs.static_list[3]);
					$span_b.html(data.dns0 + appJs.recommend);
				}
				else if(i == 5 && data.dns1 != "0.0.0.0"){
					$span_a.html(appJs.static_list[4]);
					$span_b.html(data.dns1 + appJs.recommend);
				}
				$li.append($span_a);
				$li.append($span_b);
				$ul.append($li);		
			}
		}
		if(type != "pppoe_spe" && type != "pppoe_len" && type != "pppoe_padi")
			$("#type").append($ul);
		else
			$("#error_pppoe").append($ul);
			
		if(usr_flag != true || pwd_flag != true){
			var obj = {};
			if(usr_flag != true)
				obj.usr_flag = false;
			if(pwd_flag != true)
				obj.pwd_flag = false;
			return obj;
		}
		return true;
	},
	show_param:function(data){
		me.clear_all_param();
		$("#coutdown_icon").addClass("off");
		me.paint_list(data);
		var type = data.type;
		me.show_setup(type);
	},
	show_setup:function(type){
		me.status_switch();
		$("#setup").fadeIn("slow",function(){
			$(this).removeClass("off");
			//获取最大宽度
			$("#type ul li").css("float","left");
			var width = me.get_max_width($("#type ul li")) + "px";
			$("#correct_tip").css("width",width);
			$("#type ul li").css("float","none").hide();
			$("#type").css({
				"width":width,
				"visibility":"visible"
			});
			//以动画的形式显示列表
			me.animate_list();
			if(me.success_delay_timer)
				window.clearTimeout(me.success_delay_timer);
			me.success_delay_timer = window.setTimeout(function(){
				me.show_success(type);
			},7000);//待优化
		});
		
	},
	get_max_width:function(dom){
		//获取实际文本宽度
		var arr = [];
		$.each(dom,function(){
			arr.push(parseInt($(this).innerWidth()+2));
		});
		arr.sort();
		return arr[arr.length - 1];
	},
	animate_list:function(){
		var list = $("#type ul li");
		list.each(function(k){
			var that=this;
			setTimeout(function(){
				$(that).fadeIn();
			},1000*k);
		});
	},
	countdown:function(){
		var time = this.swap_time_out - this.cur_time;
		//console.log("time1:" + time);
		$("#coutdown_time").html(time);
		if(time <= 0){
			window.clearInterval(me.countdown_timer);
			window.clearInterval(me.get_refresh_timer);
			$("#coutdown_time").html(time);
			me.show_error();
			return;
		}
		if(me.countdown_timer)
			window.clearInterval(me.countdown_timer);
		me.countdown_timer = setInterval(function(){
			if(current_html != "igd_sw"){
				window.clearInterval(me.get_refresh_timer);
				window.clearInterval(me.countdown_timer);
			}
			else{
				time--;
				$("#coutdown_time").html(time);
			}
			//console.log("time2:" + time);
		},1000);
	},
	init:function(){
		me = this;
		this.bind_event();
		$("#coutdown_time").html(this.swap_time_out);
		nos.app.resizePage();
	}
};
