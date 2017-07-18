/**
 * Created by Administrator on 2015/3/28.
 */

var anti_ddos = {
	module_name:["init_basic_anti_ddos","init_advance_anti_ddos"],
	path:"/app/anti_ddos/webs/",
	wanping_status:0,
	init_nav:function(){
        $(".anti_ddos_nav dl").undelegate("dd","hold tap doubletap").delegate("dd","hold tap doubletap",function(){
            var htmlName = $(this).attr("data-html-name");
            var get_init_fun = me.module_name[$(this).index() - 1];
			eval("me." + get_init_fun + "();");
            me.show_page(htmlName);
            me.bind_back_event();
        });
    },
	show_page:function(name){
		$("#appContent section").not(":first").hide();
		$("#"+ name).show();
		mobile_host_control.M_Swiper.subSlideTo(1);
    },
	bind_back_event:function(){
        mobile_host_control.app.addReturnBackCallBackFns(function(){
           mobile_host_control.M_Swiper.subSlideTo(0);
        });
    },
	bind_btn_event:function(){		
		touch.on(".btn_normal_setting", 'hold tap doubletap', function(){
			me.save_anti_ddos_basic_step1(2)
		});
		touch.on(".btn_enable_all", 'hold tap doubletap', function(){
			me.save_anti_ddos_basic_step1(1)
		});
		touch.on(".btn_disable_all", 'hold tap doubletap', function(){
			me.save_anti_ddos_basic_step1(0)
		});
		touch.on(".btn_enable", 'hold tap doubletap', function(){
			me.save_anti_ddos_advance(1);
		});
		touch.on(".btn_disable", 'hold tap doubletap', function(){
			me.save_anti_ddos_advance(0);
		});
	},
	init_basic_anti_ddos:function(){
		nos.app.net(me.path + 'attack_config_show.cgi','noneed=noneed',me.init_basic_anti_ddos_callback);
	},
	init_basic_anti_ddos_callback:function(data){
		/*for(var member in data){
			radio_set(data[member],member);
    	}*/
		for(var member in data){
			$("#" + data[member] + "_radio_hidden").val(data[member]);
			$("#" + member + "_radio").html(MobileJsHtml[current_html]["status"][data[member]]);
		}
	},
	init_advance_anti_ddos:function(){
		nos.app.net(me.path + 'attack_config_show.cgi','noneed=noneed',me.init_advance_anti_ddos_callback);
	},
	init_advance_anti_ddos_callback:function(data){
		var filterVal=data['filter'].split(',');
		for(var i = 0;i < filterVal.length; i++){
			$(".ddos_item").eq(i).html(MobileJsHtml[current_html]["status"][filterVal[i]]);
		}
	},
	save_anti_ddos_basic_step1:function(value){
		var url = "";
		if(value == 1){
			url = "attack_hard=1&attack_driver=1&attack_system=1&attack_application=1";
			me.wanping_status = 1;
		}
		if(value == 0 || value == 2){
			url = "attack_hard=0&attack_driver=0&attack_system=0&attack_application=0";
			if(value == 2)
				me.wanping_status = 1;
			if(value == 0)
				me.wanping_status = 0;
		}
		show_message("save");
		nos.app.net(me.path + 'attack_auto_status_set.cgi',url,me.save_anti_ddos_basic_step2);
	},
	save_anti_ddos_basic_step2:function(data){
		if (data != "SUCCESS") {
        	me.get_result(data);
        	return;
    	}
		var url2="wanping_status=" + me.wanping_status;
		nos.app.net(me.path + 'attack_status_set.cgi',url2,me.save_anti_ddos_basic_callback);
	},
	save_anti_ddos_basic_callback:function(data){
		me.get_result(data);
		me.init_basic_anti_ddos();
	},
	save_anti_ddos_advance:function(value){
		var filterValue='';
		for(var i=3;i<16;i++){
			filterValue+=',' + value;
		}
		filterValue = filterValue.substr(1);
		show_message("save");
		nos.app.net(me.path + 'universal_filter_submit.cgi','filter=' + filterValue,me.save_anti_ddos_advance_callback);
	},
	save_anti_ddos_advance_callback:function(data){
		me.get_result(data);
    	me.init_advance_anti_ddos();
	},
	get_result:function(data){
    	if (data == "SUCCESS") {
        	show_message("success", appCommonJS.controlMessage.c_suc);
    	}
		else {
        	show_message("error", igd.make_err_msg(data));
    	}
	},
	init:function(){
		me = this;
		$(".appSave").hide();
		me.init_nav();
		me.bind_btn_event();
	}
};

define(function(){
    return anti_ddos;
});



