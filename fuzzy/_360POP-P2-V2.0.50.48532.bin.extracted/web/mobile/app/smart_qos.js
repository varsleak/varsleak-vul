/**
 * Created by Administrator on 2015/3/28.
 */
//var appLanguageJs=appL.smart_qos.js;

var reg_app_map = {
    qos_set_form: [
        {id: "wan_setup_up_bandwidth1", type: "decimal"},
        {id: "wan_setup_down_bandwidth1", type: "decimal"}
    ],
    noneed: []
};
var smart_qos = {
	path:"/app/smartqos/webs/",
	g_wan_num:1,
	qos_set_obj:{},
	set_radio_callback:function(){
        Tools.radio.config.switch.flux_enable={};
        Tools.radio.config.switch.flux_enable.oEvent="smart_qos.set_flux_status";
    },
	init_qos_set:function(){
		nos.app.net(me.path + 'qos_basic_setup_show.cgi', 'noneed=noneed', me.qos_set_callback);
	},
	qos_set_callback:function(result){
		var flux_status = result["switch"]["flux_status"];
		me.create_ck_obj(result);
		me.set_speed(me.g_wan_num, result);
		radio_set(flux_status,"flux_enable");
	},
	create_ck_obj:function(data){
		me.qos_set_obj = {};
		me.qos_set_obj.up_bandwidth = {};
		me.qos_set_obj.down_bandwidth = {};
		me.qos_set_obj.up_reserved = {};
		me.qos_set_obj.down_reserved = {};
		for(var i=1; i <= g_wan_num;i++){
			var up_bandwidth = eval('(' + "data['switch'].up_bandwidth" + i + ')');
			var down_bandwidth = eval('(' + "data['switch'].down_bandwidth" + i + ')');
			var up_reserved = eval('(' + "data['switch'].up_reserved" + i + ')');
			var down_reserved = eval('(' + "data['switch'].down_reserved" + i + ')');
			
			me.qos_set_obj.up_bandwidth[i] = up_bandwidth;
			me.qos_set_obj.down_bandwidth[i] = down_bandwidth;
			me.qos_set_obj.up_reserved[i] = up_reserved;
			me.qos_set_obj.down_reserved[i] = down_reserved;
		}
	},
	set_wanlan:function(n){
		for (var i = 1; i <= n; i++) {
			var up_bandwidth = me.qos_set_obj.up_bandwidth[n];
			var down_bandwidth = me.qos_set_obj.down_bandwidth[n];
			var up_reserved = me.qos_set_obj.up_reserved[n];
			var down_reserved = me.qos_set_obj.down_reserved[n];
			
			$("#wan_setup_up_bandwidth" + i).val(up_bandwidth);
			$("#wan_setup_down_bandwidth" + i).val(down_bandwidth);
			$("#wan_setup_up_reserved" + i).val(up_reserved);
			$("#wan_setup_down_reserved" + i).val(down_reserved);
		}
	},
	set_flux_status:function(flux_status){
		//开关控制变灰，数据校验
		me.set_wanlan(me.g_wan_num);
        Tools.form._disabled(flux_status);
	},
	set_speed:function(n,data){
		for (var i = 1; i <= n; i++) {
			var _val = eval('(' + "data['switch'].speed_type" + i + ')');
			$("#speed_type_sel" + i).val(_val);
		}
	},
	qos_set_submit:function() {
    	var status = $("#flux_enable_hidden").val();
		if(status == 1){
			if (!check_app_input("qos_set_form"))
				return;
		}
		show_message("save");
		nos.app.net(me.path + 'qos_basic_set.cgi', 'qos_set_form',me.qos_set_submit_callback);
	},
	qos_set_submit_callback:function(data){
		if (data == "SUCCESS") {
			show_message("success");Tools.form.subCurrentHtml_init_formData();
		} else {
			show_message("error", igd.make_err_msg(data));
		}
		me.init_qos_set();
	},
	init:function(){
		me = this;
		me.set_radio_callback();
		me.init_qos_set();
	}
};

define(function(){
    return smart_qos;
});



