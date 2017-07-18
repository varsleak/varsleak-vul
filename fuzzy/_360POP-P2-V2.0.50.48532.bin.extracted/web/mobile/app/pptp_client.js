/**
 * Created by Administrator on 2015/3/28.
 */
//var appLanguageJs=appL.oray_ddns.js;
var reg_app_map = {
	pptp_client_setup_frm:[
		{id:"pptp_client_server_addr",type:"nin_ip_url"},
		{id: "pptp_client_server_port", type: "port"},
		{id: "pptp_client_user", type: "pptp_l2tp"},
		{id: "pptp_client_pass", type: "password_blank"}
	],
	noneed:[]
}
var pptp_client = {
	path:"/app/pptp_client/webs/",
	module_name:["init_pptp_client_set","init_pptp_client_list","init_pptp_client_status"],
	pptp_client_setup_data:null,
	pptp_client_status_timer:null,
	lengthKeyObj:"",
	PPTP_CLIENT_STATUS_TIME:2000,
	init_nav:function(){
        $("#pptp_client_nav dl").undelegate("dd","hold tap doubletap").delegate("dd","hold tap doubletap",function(){
            var htmlName = $(this).attr("data-html-name");
            var get_init_fun = me.module_name[$(this).index()];
			eval("me." + get_init_fun + "();");
            me.show_page(htmlName);
            me.bind_back_event("pptp_client_nav");
        });
    },
	show_page:function(name){
		mobile_host_control.M_Swiper.subSlideTo(1);
		me.fill_default_data();
        if(name!="pptp_client_nav"){$("#appContent section").not(":first").hide();$("#"+ name).show();}
		if(name == "pptp_client_set"){
			$(".appTitle").html(MobileJsHtml[current_html].pptp_client_set_title);
			$(".appSave").show();
		}
		else if(name == "pptp_client_list"){
			$(".appTitle").html(MobileJsHtml[current_html].pptp_client_list_title);
			$(".appSave").hide();
		}
		else if(name == "pptp_client_status"){
			$(".appTitle").html(MobileJsHtml[current_html].pptp_client_status_title);
			$(".appSave").hide();
		}
		else if(name == "pptp_client_nav"){
			$(".appTitle").html(MobileJsHtml[current_html].pptp_client_title);
			$(".appSave").hide();
			mobile_host_control.M_Swiper.subSlideTo(0);
		}
    },
	bind_back_event:function(name){
        mobile_host_control.app.addReturnBackCallBackFns(function(){
            me.show_page(name);
        });
    },
	fill_default_data:function(){
		radio_set("1","pptp_client_enable");
		$("#pptp_client_server_addr").val("");
		$("#pptp_client_server_port").val("1723");
		$("#pptp_client_user").val("");
		$("#pptp_client_pass").val("");
		$('#deal').val('add');
		$('#old_id').val("");
		$('#pptp_client_mode_hidden').val("isp");
		$('#pptp_client_servernet').val("");
		$('#pptp_client_servermask').val("");
		$('#pptp_client_interface').val("WAN1");
		$('#mppe_128_hidden').val("1");
		$('#nat_hidden').val("1");
	},
	init_pptp_client_set:function(){
		radio_set("1","pptp_client_enable");
		me.clear_status_timer();
	},
	pptp_client_setup_submit:function(){
		if(!check_app_input("pptp_client_setup_frm"))
			return;
		nos.app.net(me.path + 'pptp_client_add.cgi','pptp_client_setup_frm',me.pptp_client_setup_callback);
	},
	pptp_client_setup_callback:function(data){
		if(data == "SUCCESS"){
			 show_message("success");
			//清空数据，跳转至列表
			me.fill_default_data();
			me.show_page("pptp_client_list");
			me.init_pptp_client_list();
			me.bind_back_event("pptp_client_set");
		}
		else
			 show_message("error",igd.make_err_msg(data));
	},
	pptp_client_fill_data:function(param){
		$(".appSave").show();
		$(".appTitle").html(MobileJsHtml[current_html].pptp_client_title);
		$("#pptp_client_set").show();
		$("#pptp_client_list").hide();
		$('#deal').val('mod');
		$('#old_id').val(param.id);
		radio_set(param.enable,"pptp_client_enable");
		
		$('#pptp_client_server_addr').val(param.server);
		$("#pptp_client_server_port").val(param.port);
		$('#pptp_client_user').val(param.user);
		$('#pptp_client_pass').val(getDAesString(param.pass,me.lengthKeyObj.rand_key));
		$('#pptp_client_mode_hidden').val(param.mode);
		$('#pptp_client_servernet').val(param.servernet);
		$('#pptp_client_servermask').val(param.servermask);
		$('#pptp_client_interface').val(param.uiname);
		$('#mppe_128_hidden').val(param.encrypt);
		$('#nat_hidden').val(param.enable_nat);
	},
	init_pptp_client_list:function(){
		me.clear_status_timer();
		nos.app.net(me.path + 'pptp_client_config_show.cgi', 'noneed=noneed', me.paint_pptp_client_setup_list);
	},
	paint_pptp_client_setup_list:function(data){
		if(data.length>0){
			me.lengthKeyObj = get_rand_key(0,data[0].pass,true);
		}
		me.pptp_client_setup_data = data;
		$("#pptp_client_set").hide();
		$("#setup_list").html("").removeClass("section_hide");
		if(data.length == 0){
			//var $dd = $("<dd/>");
			//$dd.html(MobileJsHtml[current_html].listNull);
			//$("#setup_list").append($dd);
			$("#setup_list").html(MobileJsHtml[current_html].listNull);
			$("#setup_list").addClass("noTableListDataTip");
			return;
		}
		for(var i in data){
			var ret = me.format_setup_data(data[i]);
			var $dd = $("<dd/>");
			$dd.attr("class","select_dd");
			var $div_user = $("<div/>");
			var $div_server = $("<div/>");
			$div_user.html(ret.user);
			$div_server.html(ret.server);
			var $a = $("<a/>");
			$a.attr("class","del_btn");
			(function(p){
				$dd.unbind("hold tap doubletap").bind("hold tap doubletap",function(){
					me.pptp_client_fill_data(data[p]);
					me.bind_back_event("pptp_client_list");
				});
				$a.unbind("hold tap doubletap").bind("hold tap doubletap",function(e){
					e.stopPropagation();
					show_dialog(appCommonJS.dialog.del_single,function(){
						nos.app.net(me.path + 'pptp_client_del.cgi','id='+data[p].id,me.pptp_client_setup_list_callback);
					});
				});	  
			})(i);
			$dd.append($div_user);
			$dd.append($div_server);
			$dd.append($a);
			$("#setup_list").append($dd);
			$("#setup_list").removeClass("noTableListDataTip");
		}
	},
	pptp_client_setup_list_callback:function(data){
		if(data == "SUCCESS")
			 show_message("success");
		else
			 show_message("error",igd.make_err_msg(data));
		me.init_pptp_client_list();
	},
	format_setup_data:function(data){
		var tmp = {};
		tmp.id = data.id;
		tmp.enable = data.enable;
		tmp.user = data.user;
		tmp.server = data.server;
		return tmp;
	},
	
	clear_status_timer:function(){
		if(me.pptp_client_status_timer)
			window.clearInterval(me.pptp_client_status_timer);
	},
	status_list_loop:function(){
		if(me.pptp_client_status_timer)
			window.clearInterval(me.pptp_client_status_timer);
		me.pptp_client_status_timer = window.setInterval(function(){
			if(current_html == "pptp_client")
				nos.app.net(me.path + 'pptp_client_status_show.cgi', 'noneed=noneed', me.init_pptp_client_status_callback);
			else
				window.clearInterval(me.pptp_client_status_timer);
		},me.PPTP_CLIENT_STATUS_TIME);
	},
	init_pptp_client_status:function(){
		$("#status_list,#status_list_detail").addClass("section_hide");
		nos.app.net(me.path + 'pptp_client_status_show.cgi', 'noneed=noneed', me.init_pptp_client_status_callback);
		me.clear_status_timer();
		//me.status_list_loop();
	},
	init_pptp_client_status_callback:function(data){
		var list = $("#status_list");
		list.removeClass("section_hide").html("");
		$("#status_list_detail").addClass("section_hide");
		if(data.length != 0){
			for(var i in data){
				var ret = me.format_list_data(data[i]);
				var $dd = $("<dd/>");
				$dd.attr("class","select_dd");
				var $user_div = $("<div/>");
				
				var $user_span = $("<span/>");
				$user_span.attr("class","name");
				$user_span.html(ret.user);
				var $status_span = $("<span/>");
				$status_span.html(ret.link_status_str);
				$user_div.append($user_span);
				$user_div.append($status_span);
				if(ret.link_status == "0"){
					$status_span.attr("class","linkbtn linkdown");
				}
				else if(ret.link_status == "1"){
					$status_span.attr("class","linkbtn linkup");
				}
				
				var $ip_div = $("<div/>");
				var $local_span = $("<span/>");
				$local_span.html(MobileJsHtml[current_html].local_ip + ret.local_ip);
				var $remote_span = $("<span/>");
				$remote_span.html(MobileJsHtml[current_html].remote_ip + ret.remote_ip);
				$ip_div.append($local_span);
				$ip_div.append($remote_span);
				
				$dd.append($user_div);
				$dd.append($ip_div);
				//注意此处要写成闭包
				(function(p){
					$dd.unbind("hold tap doubletap").bind("hold tap doubletap",function(){
						me.paint_status_list(data[p]);
					});
				})(i);
				list.removeClass("noTableListDataTip");
				list.append($dd);
			}
		}
		else{
			//var $dd = $("<dd/>");
			//$dd.html(MobileJsHtml[current_html].listNull);
			//list.append($dd);
			list.html(MobileJsHtml[current_html].listNull);
			list.addClass("noTableListDataTip");
			return;
		}
	},
	paint_status_list:function(data){
		$(".appTitle").html(MobileJsHtml[current_html].pptp_client_status_detail_title);
		$("#status_list").addClass("section_hide");
		$("#status_list_detail").removeClass("section_hide").html("");
		var index = 0;
		var ret = me.format_list_data(data);
		
		for(var j in ret){
			if(j == "id")
				continue;
			else{
				var $dd = $("<dd/>");
				var $label_text = $("<label/>");
				var $span_cnt = $("<span/>");
				if(j == "link_status"){
					$label_text.html(MobileJsHtml[current_html]["status_name"][index] + ret["link_status_str"]);
					$span_cnt.html(ret["link_status_btn"]);
					$span_cnt.attr("class","link");
				}
				else if(j == "link_status_str" || j == "link_status_btn")
					continue;
				else{
					$label_text.html(MobileJsHtml[current_html]["status_name"][index]);
					$span_cnt.html(ret[j]);
				}
				$dd.append($label_text);
				$dd.append($span_cnt);
			}
			$("#status_list_detail").append($dd);
			index++;
		}
	},
	format_list_data:function(data){
		var tmp = {};
		tmp.id = data.id;
		tmp.user = data.user;
		var link_status = data.link_status;
		tmp.link_status = link_status;
		tmp.link_status_str = MobileJsHtml[current_html]["link_status"][link_status];
		if(link_status == "0")
			tmp.link_status_btn = '<a href="javascript:void(0);" onclick="pptp_client.pptp_client_status_set(1,\''+tmp.id+'\')">'+ MobileJsHtml[current_html].connect +'</a>';
		else
			tmp.link_status_btn = '<a href="javascript:void(0);" onclick="pptp_client.pptp_client_status_set(0,\''+tmp.id+'\')">'+ MobileJsHtml[current_html].disconnect +'</a>';
		tmp.local_ip = data.local_ip;
		tmp.remote_ip = data.remote_ip;
		return tmp;
	},
	pptp_client_status_set:function(state,id){
		if(state == 1){	
			nos.app.net(me.path + 'pptp_client_link.cgi', 'id='+id,me.pptp_client_setup_callback);
		}
		else{
			show_dialog(appHtml.shutLink,function(){
				nos.app.net(me.path + 'pptp_client_down.cgi', 'id='+id,me.pptp_client_setup_callback);
			});
		}
	},
//    lwj add
    setRadioSwitchConfig:function(){
        Tools.radio.config.switch.pptp_client_enable={};
        Tools.radio.config.switch.pptp_client_enable={onTxt: "启用",offTxt: "禁止"};
    },
	init:function(){
		me = this;
        me.setRadioSwitchConfig();
		me.init_nav();
		$(".appSave").hide();
	}
};

define(function(){
    return pptp_client;
});



