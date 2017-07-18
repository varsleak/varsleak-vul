/**
 * Created by lan on 2015/4/8.
 */
var appLanguageJs=appL.led_ctrl.js;
var led_ctrl={
    radioSelectConfig:function(){
        Tools.radio.config.switch.light_enable={};
        Tools.radio.config.switch.light_enable.oEvent="led_ctrl_change";
    },
    init:function(){
        this.radioSelectConfig();
        init_led_ctrl();
    }
};
define(function(){
    return led_ctrl;
});
var ck_data = {};
function init_led_ctrl(){
    nos.app.net('/app/universal_app/led_ctrl_get.cgi','noneed=noneed',init_led_ctrl_callback);
}
function init_led_ctrl_callback(result){
    Tools.radio.set("light_enable",result.enable);
    var uniformTime = Tools.time.uniform_time_style;
    $("#timer_enable_hidden").val(1);
    $("#timer_day_hidden").val("7 1 2 3 4 5 6");
    ck_data.start_hour = uniformTime(result,"start_hour");
    ck_data.start_minute = uniformTime(result,"start_minute");
    ck_data.end_hour = uniformTime(result,"end_hour");
    ck_data.end_minute = uniformTime(result,"end_minute");
    set_led_ctrl_data();
}

function led_ctrl_change(str){
    if(str == '0'){
        set_led_ctrl_data();
    }
    Tools.form._disabled(str);
}

function set_led_ctrl_data(){
    $("#start_hour").val(ck_data.start_hour);
    $("#start_min").val(ck_data.start_minute);
    $("#end_hour").val(ck_data.end_hour);
    $("#end_min").val(ck_data.end_minute);
}

function save_led_ctrl(){
	var inputs = $("input.start,input.end");
	var start = $(inputs[0]).val() + $(inputs[1]).val(),end = $(inputs[2]).val() + $(inputs[3]).val();
	var start_h = $(inputs[0]).val()>>>0,end_h = $(inputs[2]).val()>>>0,start_m = $(inputs[1]).val()>>>0,end_m = $(inputs[3]).val()>>>0;
	if (start == end) {
		show_message("msg_info", appLanguageJs.startAndEnd);
		return;
	}
	if((end_h===start_h && end_m-start_m>=0&&end_m-start_m<5)||(end_h === (start_h+1)&&(60+end_m-start_m)<5)){
		show_message("msg_info",appCommonJS.timeSlotErrorTip.atLeastFiveMinute);return false;
	 }
     show_message("save");
     nos.app.net('/app/universal_app/led_ctrl_set.cgi','led_ctrl_frm',save_led_ctrl_callback);
}

function save_led_ctrl_callback(data){
    if (data == "SUCCESS") {
        show_message("success", appCommonJS.controlMessage.c_suc);Tools.form.subCurrentHtml_init_formData();
    } else {
        show_message("error", igd.make_err_msg(data));
    }
    init_led_ctrl();
}