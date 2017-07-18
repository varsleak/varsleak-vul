/**
 * Created by Administrator on 2015/3/28.
 */
var appLanguageJs=appL.oray_ddns.js;
var reg_app_map = {
	ddnsform: [
		{id: "user_id", type: "char"},
		{id: "user_password", type: "string"}
	],
	noneed: []
};
var oray_ddns = {
	ddns_timer:null,
	path:"/app/oray_ddns/webs/",
	ck_ddns_data:{},
	set_radio_callback:function(){
        Tools.radio.config.switch.ddns_radio_status={};
        Tools.radio.config.switch.ddns_radio_status.oEvent="oray_ddns.change_ddns_enable";
    },
	set_ddns_data:function(){
		nos.app.net(me.path + "igd_ddns.cgi",'noneed=noneed&action=get',me.set_ddns_data_callback);
	},
	set_ddns_data_callback:function(data){
		var me = oray_ddns;
		me.ck_ddns_data.user = data.WAN0.user_id0;
		me.ck_ddns_data.pwd = window.top.getDAesString(data.WAN0.password0);
		radio_set(data.WAN0.enable0,"ddns_radio_status");
		me.show_status(data);
		
		if(me.ddns_timer)
			window.clearInterval(me.ddns_timer);
		me.ddns_timer = window.setInterval(function(){
			if(current_html == "oray_ddns")
				me.show_status_loop();
			else
				window.clearInterval(me.ddns_timer);
		},2000);
	},
	show_status:function(ret){
		if(ret.WAN0.status_info0 == ""){
			$("#ddns_status").html("");
		}
		else{
			var ddns_map_index = ret.WAN0.status_info0.split(',');
			var domainStr = "";
			if(ret.WAN0.domain0 != "")
				domainStr = appLanguageJs.urlName + ret.WAN0.domain0;
			$('#ddns_status').html(appLanguageJs.ddns_map[ddns_map_index[0]] + domainStr);
		}
	},
	show_status_loop:function(){
		var me = this;
		nos.app.net(me.path + 'igd_ddns.cgi','noneed=noneed&action=get',me.show_status_callback);
	},
	show_status_callback:function(ret){
		var me = oray_ddns;
		me.show_status(ret);	
	},
	save_oray_ddns:function(){
		var me = this;
		if($('#ddns_radio_status_hidden').val()==1){
			if(!check_app_input("ddnsform"))
				return;
		}
		show_message("save");
		nos.app.net(me.path + 'igd_ddns.cgi','ddnsform',me.save_oray_ddns_callback);
	},
	change_ddns_enable:function(mode) {
		$('#user_id').val(me.ck_ddns_data.user);
		$('#user_password').val(me.ck_ddns_data.pwd);
        Tools.form._disabled(mode);
	},
	save_oray_ddns_callback:function(data){
		var me =  oray_ddns;
		if(data == "SUCCESS"){
            show_message("success", appCommonJS.controlMessage.c_suc);Tools.form.subCurrentHtml_init_formData();
        }
		else
			show_message("error", igd.make_err_msg(data));
		me.set_ddns_data();
	},
	init:function(){
		me = this;
		me.set_radio_callback();
		me.set_ddns_data();
	}
};

define(function(){
    return oray_ddns;
});



