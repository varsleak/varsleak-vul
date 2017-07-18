/**
 * Created by lan on 14-3-18.
 */
var appLanguageJs= appL.anti_ddos.js;current_tab_name = [
    {tab_title:appLanguageJs.tabTitle[0],tab_id:"set_state"},
    {tab_title:appLanguageJs.tabTitle[1],tab_id:"hand_mode"}
];
//页面初始化函数
$(document).ready(function(){
    initTab();
});
//
function init_set_state(){
    init_app_language(appL.anti_ddos.set_state);
    nos.app.resizePage();
    nos.app.net('./attack_config_show.cgi','noneed=noneed',init_set_state_info);
}
function init_hand_mode(){
    init_app_language(appL.anti_ddos.hand_mode);
    nos.app.resizePage();
    $("#hand_mode_set .item:even").addClass("even-bg");
    $("#hand_mode_set .item:odd").addClass("odd-bg");
    nos.app.net('./attack_config_show.cgi','noneed=noneed',init_hand_mode_info);
}
//初始化参数
function init_set_state_info(data){
    /*for(var member in data){
		radio_set(data[member],member + "_radio");
    }*/
	for(var member in data){
		$("#" + data[member] + "_radio_hidden").val(data[member]);
		$("#" + member + "_radio").html(appLanguageJs.status[data[member]]);
	}
}

function init_hand_mode_info(data){
    var filterVal=data['filter'].split(',');
    for(var i=0;i<filterVal.length;i++){
        $("#hand_mode_set .item").eq(i).find("span").hide().eq(!(filterVal[i]*1)).show();
        set_universal_val(parseInt(i+3),filterVal[i]);
    }
}
//设置隐藏值
function set_attack_status(name,value){
    $('#'+name+'_val').val(value);
}
function set_universal_val(no,value){
    $('#universal_rad'+no).val(value);
}
//form提交函数
var wanping_status = 0;
function save_set_info(value){
	wanping_status = 0;
	var url = "";
	if(value == 1){
		url = "attack_hard=1&attack_driver=1&attack_system=1&attack_application=1";
		wanping_status = 1;
	}
	if(value == 0 || value == 2){
		url = "attack_hard=0&attack_driver=0&attack_system=0&attack_application=0";
		if(value == 2)
			wanping_status = 1;
		if(value == 0)
			wanping_status = 0;
	}
    nos.app.net('./attack_auto_status_set.cgi',url,save_set_info_1);
}
function save_set_info_1(data){
    if (data != "SUCCESS") {
        showSuccess(data);
        return;
    }
	var url_1="wanping_status=" + wanping_status;
	nos.app.net('./attack_status_set.cgi',url_1,save_set_info_callback);
}
function hand_mode_set_info_save(value){
    var filterValue='';
    for(var i=3;i<16;i++){
        filterValue+=','+value;
    }
    filterValue = filterValue.substr(1);
    nos.app.net('./universal_filter_submit.cgi','filter='+filterValue,hand_mode_set_info_save_callback);
}
//状态配置的回调函数
function save_set_info_callback(data){
    showSuccess(data);
    init_set_state();
}
//手动模式的回调函数
function hand_mode_set_info_save_callback(data){
    showSuccess(data);
    init_hand_mode();
}
//成功回调
function showSuccess(data){
    if (data == "SUCCESS") {
        show_message("success", appCommonJS.controlMessage.c_suc);
    } else {
        show_message("error", igd.make_err_msg(data));
    }
}








