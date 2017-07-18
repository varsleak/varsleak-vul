/**
 * Created by Administrator on 2015/3/28.
 */
var appLanguageJs=appL.touch_link.js;

var touch_link = {
	path:"/app/touch_link/webs/",
	module_name:["init_touch_link_set","init_touch_link_list"],
	auth_list_timer:null,
	get_list_timer:null,//摩擦列表计时器
	detail_list_timer:null,//详情计时器
	USER_LIST_TIMER:5,
	start_touch_link:function(){
		nos.app.net(me.path + 'ql_get_conf.cgi', 'noneed=noneed', function(ret){
			if(ret.err_no == "0" && ret["data"].length != 0){
				var switchVal = ret.data[0]["switch"];
				if(switchVal == 1){
					$("#touch_link_guide").hide();
					$(".touch-link-swiper-wrapper").show();
					$("#touch_link_nav").show();
				}
				else{
					$("#touch_link_guide").show();
					$(".touch-link-swiper-wrapper").hide();
				}
			}
			else{
				show_message("error",appLanguageJs.InitError);
			}
		});
	},
	show_page:function(name){
        if(name != "touch_link_nav"){$("#appContent section:gt(1)").hide();$("#"+ name).show();}
		mobile_host_control.M_Swiper.subSlideTo(1);
		if(name == "touch_link_nav"){
			mobile_host_control.M_Swiper.subSlideTo(0);
			me.touch_flag = true;
			me.push_flag = true;
			$(".appTitle").html(MobileJsHtml[current_html].touch_link_title);
			if(me.auth_list_timer){
				window.clearInterval(me.auth_list_timer);
			}
			if(me.get_list_timer){
				window.clearInterval(me.get_list_timer);
			}
			if(me.detail_list_timer){
				window.clearInterval(me.detail_list_timer);
			}
		}
		else if(name == "touch_link_list")
			$(".appTitle").html(MobileJsHtml[current_html].touch_link_list_title);
		else
			$(".appTitle").html(MobileJsHtml[current_html].touch_link_title);
    },
	
	bind_ctrl_event:function(){
		 $("#touch_link_nav dl").undelegate("dd","hold tap doubletap").delegate("dd","hold tap doubletap",function(){
            var htmlName = $(this).attr("data-html-name");
            var get_init_fun = me.module_name[$(this).index()-1];
			eval("me." + get_init_fun + "();");
            me.show_page(htmlName);
            me.bind_back_event("touch_link_nav");
        });
		$("#start_touch_link_btn").unbind("hold tap doubletap").bind("hold tap doubletap",function(){
			show_message("save");
			nos.app.net(me.path + 'ql_set_switch.cgi', "switch=1",function(data){
				me.tip_message_callback(data,function(){
					$("#touch_link_guide").fadeOut("normal",function(){
						$(".touch-link-swiper-wrapper").show();
						$("#touch_link_nav").show();
					});
				});
			});
		});
		
		Tools.select.config.touch_link_def_option_sel={};
		Tools.select.config.touch_link_def_option_sel.oEvent="touch_link.push_mode_submit";
		Tools.radio.config.switch.touch_link_switch={};
		Tools.radio.config.switch.touch_link_switch.oEvent="touch_link.touch_switch_submit";
		
	},
	touch_flag:null,
	touch_switch_submit:function(){
		if(!me.touch_flag){
			show_message("save");
			var str = "switch=" + $("#touch_link_switch_hidden").val();
			nos.app.net(me.path + 'ql_set_switch.cgi', str, function(data){
				me.tip_message_callback(data,function(){
					var val = $("#touch_link_switch_hidden").val();
					var push_val = $("#touch_link_def_option_sel").val();
					if (data.err_no == "0"){
						me.touch_link_set_param(val,push_val);
					}
					else{
						if(val == "0")
							radio_set("1","touch_link_switch");
						else
							radio_set("0","touch_link_switch");
					}
				});
			});
		}
	},
	push_flag:null,
	push_mode_submit:function(){
		if(!me.push_flag){
			show_message("save");
			var str = "def=" + $("#touch_link_def_option_sel").val();
			nos.app.net(me.path + 'ql_set_link.cgi', str, function(data){
				me.tip_message_callback(data,function(){
					var val = $("#touch_link_switch_hidden").val();
					var push_val = $("#touch_link_def_option_sel").val();
					if (data.err_no == "0"){
						me.touch_link_set_param(val,push_val);
					}
					else{
						if(val == "0")
							$("#touch_link_def_option_sel").val("1");
						else
							$("#touch_link_def_option_sel").val("0");
					}
				});
			});
		}
	},
	
	
	bind_back_event:function(name){
        mobile_host_control.app.addReturnBackCallBackFns(function(){
            me.show_page(name);
        });
    },
	
	
	tip_message_callback:function(data,fun){
		if (data.err_no == "0"){
        	show_message("success");
			if(typeof fun == "function")
				fun.call(this);
		}
    	else{
        	show_message("error");
		}
	},
	
	init_touch_link_set:function(){
		if(me.get_list_timer)
			window.clearInterval(me.get_list_timer);
		
		nos.app.net(me.path + 'ql_get_conf.cgi', 'noneed=noneed', me.touch_link_set_callback);
		nos.app.net(me.path + 'ql_get_list.cgi', 'noneed=noneed', me.paint_auth_list);
		me.get_auth_list_loop();
		
	},
	
	touch_link_set_mac:function(mac){
		var mac = mac.split("-")[1];
		$("#link_name").html(appLanguageJs.ssid_name + "-" + mac);
		
		
	},
	
	touch_link_set_switch:function(switch_status){
		radio_set(switch_status,"touch_link_switch");
	},
	
	touch_link_set_push:function(push_status){
		Tools.select.set(push_status,"touch_link_def_option_sel");
		$("#push_mode_text").html(appLanguageJs.push_status_arr[push_status]["statestr"]);
	},
	
	touch_link_set_param:function(switch_status,push_status){
		$("#push_mode_text").html(appLanguageJs.push_status_arr[push_status]["statestr"]);
        var node=$("#touch_link_frm dl").find("dd:not(:first),dt");
		if(switch_status == 0){
            node.hide();
		}
		else{
            node.show();
			if(push_status == 1)
				$("#table_layer").addClass("section_hide");
			else
				$("#table_layer").removeClass("section_hide");
		}
	},
	
	touch_link_set_callback:function(ret){
		if (ret.err_no == "0"){
			me.touch_link_set_mac(ret["data"][0]["ssid"]);
			
			var switch_status = ret["data"][0]["switch"];
			var push_status = ret["data"][0]["def_link"];
			
			me.touch_link_set_switch(switch_status);
			me.touch_link_set_push(push_status);
			me.touch_link_set_param(switch_status,push_status);

			me.touch_flag = false;
			window.setTimeout(function(){
				me.push_flag = false;
			},600);
			
			
		}
		else{
			show_message("error", appCommonJS.controlMessage.s_fail);
		}
	},
	
	paint_auth_list:function(ret){
		$("#auth_layer").html("");
		$("#auth_layer").append("<dt>" + MobileJsHtml[current_html].auth_list_title + "</dt>");
		if(ret == undefined)
			return;
		if(ret["data"].length != 0){
			
			var len = ret["data"].length;
			for(var i = 0; i < len; i++){
				var list = me.format_list_data(ret.data[i]);
				if(list.mode == 0 || list.mode == 4){
					var tmp = {};
					tmp.hostname = list.hostname;
					tmp.mac = list.mac;
					if(list.mode == 0){
						tmp.operate = '<a class="btn blue" title="'+ appLanguageJs.rejectLink +'" href="javascript:void(0);" onclick="touch_link.mode_type_modify(\''+ tmp.mac  +'\',0);">'+ appLanguageJs.rejectLink +'</a>';
						tmp.operate += '<a class="btn blue" title="'+ appLanguageJs.confirmLink +'" href="javascript:void(0);" onclick="touch_link.mode_type_modify(\''+ tmp.mac  +'\',1);">'+ appLanguageJs.confirmLink +'</a>';
					}
					else if(list.mode == 4){
						tmp.operate = '<a class="btn gray" title="'+ appLanguageJs.rejectedLink +'" href="javascript:void(0);" >'+ appLanguageJs.rejectedLink +'</a>';
						tmp.operate += '<a class="btn blue" title="'+ appLanguageJs.confirmLink +'" href="javascript:void(0);" onclick="touch_link.mode_type_modify(\''+ tmp.mac  +'\',1);">'+appLanguageJs.confirmLink +'</a>';
					}
					me.user_tab_dom(tmp);
				}
			}
		}
		else{
			me.no_user_tab_dom();
		}
	},
	
	
	mode_type_modify:function(mac,type){
		var str = "mac=" + mac + "&mode=" + type;
		show_message("save");
		nos.app.net(me.path + 'ql_add_user.cgi', str, me.mode_type_modify_callback);
	},

	mode_type_modify_callback:function(data){
		if (data.err_no == "0"){
        	show_message("success", appCommonJS.controlMessage.e_suc);
			nos.app.net(me.path + 'ql_get_list.cgi', 'noneed=noneed', me.paint_auth_list);
		}
    	else{
        	show_message("error", appCommonJS.controlMessage.e_fail);
		}
	},
	
	get_auth_list_loop:function(){
		if(me.auth_list_timer)
			window.clearInterval(me.auth_list_timer);
		me.auth_list_timer = window.setInterval(function(){
			if(current_html == "touch_link")
				nos.app.net(me.path + 'ql_get_list.cgi', 'noneed=noneed', me.paint_auth_list);
			else
				window.clearInterval(me.auth_list_timer);
		},me.USER_LIST_TIMER*1000);
	},
	
	user_tab_dom:function(data){
		for(var i in data){
			var $dd = $("<dd/>");
			
			var $div = $("<div/>");
			$div.html(MobileJsHtml[current_html].mac_addr);
			$div.attr("class","mac_t");
			$dd.append($div);
			
			var $mac_div = $("<div/>");
			$mac_div.html(data.mac);
			$mac_div.attr("class","mac");
			$dd.append($mac_div);
			
			var $span = $("<span>");
			$span.html(data.operate);
			$dd.append($span);
		}
		$("#auth_layer").append($dd);
	},
	
	no_user_tab_dom:function(){
		$dd = $("<dd>"+ MobileJsHtml[current_html].auth_list_null +"</dd>")
		$("#auth_layer").append($dd);
	},
	
	init_touch_link_list:function(){
		nos.app.net(me.path + 'ql_get_list.cgi', 'noneed=noneed', me.paint_user_list);
		me.get_user_list_loop();
	},
	
	get_user_list_loop:function(){
		if(me.detail_list_timer)
			window.clearInterval(me.detail_list_timer);
		if(me.get_list_timer)
			window.clearInterval(me.get_list_timer);
		me.get_list_timer = window.setInterval(function(){
			if(current_html == "touch_link")
				nos.app.net(me.path + 'ql_get_list.cgi', 'noneed=noneed', me.paint_user_list);
			else
				window.clearInterval(me.get_list_timer);
		},2*1000);
	},
	
	paint_user_list:function(data){
		var data = data.data;
		var list = $("#touch_link_status_list");
		list.html("").removeClass("section_hide");
		$("#touch_link_status_list_detail").addClass("section_hide").html("");
		if(data.length != 0){
			for(var i in data){
				var tmp = me.format_list_data(data[i]);
				var $dd = $("<dd/>");
				$dd.attr("class","select_dd " + getType(tmp.os_type));
				
				var $div_name = $("<div/>");
				$div_name.attr("class","name");
				$div_name.html(tmp.name);
				$dd.append($div_name);
				
				var $div_down = $("<div/>");
				$div_down.attr("class","downspeed");
				$div_down.html(tmp.down_speed);
				
				var $div_up = $("<div/>");
				$div_up.attr("class","upspeed");
				$div_up.html(tmp.up_speed);
				
				var $div_speed_wrapper = $("<div/>");
				$div_speed_wrapper.attr("class","speed_wrapper");
				$div_speed_wrapper.append($div_down);
				$div_speed_wrapper.append($div_up);
				$dd.append($div_speed_wrapper);
				
				//注意此处要写成闭包
				(function(p){
					$dd.unbind("hold tap doubletap").bind("hold tap doubletap",function(){
						me.paint_detail_list(tmp);
						me.paint_detail_list_loop(data[i]);
					});
				})(i);
				list.removeClass("noTableListDataTip");
				list.append($dd);
			}
		}
		else{
			list.html(MobileJsHtml[current_html].listNull);
			list.addClass("noTableListDataTip");
		}
	},
	
	paint_detail_list:function(data){
		if(me.get_list_timer)
			window.clearInterval(me.get_list_timer);
		$(".appTitle").html(MobileJsHtml[current_html].touch_link_detail_title);
		$("#touch_link_status_list").addClass("section_hide");
		$("#touch_link_status_list_detail").removeClass("section_hide").html("");
		var index = 0;
		for(var i in data){
			if(i == "os_type" || i == "mode")
				continue;
			var $dd = $("<dd/>");
			var $label = $("<label/>");
			$label.html(MobileJsHtml[current_html].user_list_tab[index]);
			$dd.append($label);
			
			var $span = $("<span/>");
			$span.css("float","right");
			$span.html(data[i]);
			$dd.append($span);
			$("#touch_link_status_list_detail").append($dd);
			index++;
		}
	},
	paint_detail_list_loop:function(data){
		if(me.detail_list_timer)
			window.clearInterval(me.detail_list_timer);
		me.detail_list_timer = window.setInterval(function(){
			if(current_html == "touch_link"){
				nos.app.net(me.path + 'ql_get_list.cgi', 'noneed=noneed', function(ret){
					var ret_val = ret.data;
					for(var i in ret_val){
						if(ret_val[i].mac == data.mac){
							var tmp = me.format_list_data(ret_val[i]);
							me.paint_detail_list(tmp);
							break;
						}
					}
				});
			}
			else
				window.clearInterval(me.detail_list_timer);
		},2*1000);
	},
	
	format_list_data:function(data){
		var tmp = {};
		tmp.mode = data.mode;
		tmp.name = data.hostname || data.unknownDevice;
		tmp.mac = data.mac;
		tmp.os_type = data.os_type;
		tmp.up_speed = window.top.formatSpeed(data.up_speed).allValue;
		tmp.down_speed = window.top.formatSpeed(data.down_speed).allValue;
		var time = window.top.getDateBySec(data.second);
		tmp.second = time.days > 0 ? (time.days + appCommonJS.time.day) : "" + time.hours > 0 ? (time.hours + appCommonJS.time.hour) : "" + time.minute > 0 ? (time.minute + appCommonJS.time.min) : "";
		return tmp;
	},
	
	init:function(){
		me = this;
		me.touch_flag = true;
		me.push_flag = true;
		me.bind_ctrl_event();
		//$("#appContent section").hide();
		me.start_touch_link();
		$(".appSave").hide();
	}
};

define(function(){
    return touch_link;
});



