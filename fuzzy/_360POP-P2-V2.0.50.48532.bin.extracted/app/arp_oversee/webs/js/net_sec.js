/**
 * Created by lan on 14-3-18.
 */
var appLanguageJs=appL.arp_oversee.js,current_tab_name = [
    {tab_title:appLanguageJs.tabTitle[0],tab_id:"filter_arp"},
    {tab_title:appLanguageJs.tabTitle[1],tab_id:"arp_inspect"}
];
var arp_inspect_temp_data=new Array();
var reg_app_map = {
    filter_arp_defense: [
        {id:"arp_rate", type: "arp_rate"}
    ],
    time: [
        {id:"arp_discover_time", type: "int"}
    ],
    filter_arp: [
        {id:"filter_arp_ip", type: "ip"},
        {id:"filter_arp_mac", type: "mac"},
        {id:"filter_arp_name", type: "string noneed"}
    ],
    noneed:[]
};
//复制 对象的函数
function cloneAll(fromObj,toObj){
    for(var i in fromObj){
        if (typeof fromObj[i] == "object") {
            toObj[i]={};
            cloneAll(fromObj[i],toObj[i]);
            continue;
        }
        else  {
            toObj[i] = fromObj[i];
        }
    }
}
//对象转化成url
function objectChangeToUrl(obj){
    var url=0;
    for(var member in obj){
        url+='&'+member+'='+obj[member];
    }
    return url=url.substr(2);
}
//页面初始化函数
$(document).ready(function(){
    initTab();
});
//
function init_filter_arp(){
	nos.app.resizePage();
    init_app_language(appL.arp_oversee.filter_arp);
    set_uiname_select("bind_iface","LAN+WAN");
    nos.app.net('./arp_bind_list_show.cgi','noneed=noneed',init_filter_arp_tab);
}

function init_arp_inspect(){
    init_app_language(appL.arp_oversee.arp_inspect);
	nos.app.net('./arp_defence_show.cgi','noneed=noneed',init_arp_defence_show);
	nos.app.net('./ipmac_stolen_get.cgi','noneed=noneed',init_ip_mac_stolen);
    nos.app.net('./arp_bind_list_show.cgi','noneed=noneed',init_arp_inspect_tab);
}

//初始化参数
function init_arp_inspect_tab(data){
    arp_inspect_temp_data=[];
    cloneAll(data,arp_inspect_temp_data);
    for(var i=0;i<arp_inspect_temp_data.length;i++){
        arp_inspect_temp_data[i]['id']=parseInt(i+1);
    }
    choose_arp_inspect($('#arp_choose').val());
//    init_arp_inspect_tab_info(arp_inspect_temp_data);
}
function init_arp_inspect_tab_info(data){
    var new_data=arp_inspect_dataChangeTo(data);
	
	var tab = new window.top.Table("arp_inspect_tab",appLanguageJs.arp_inspect_tab_head,new_data);
	tab.initTable();

    nos.app.resizePage();
}
//表的数据转化
function arp_inspect_dataChangeTo(data){
    var reData=new Array(),status=appLanguageJs.status,bindStatus=appLanguageJs.bindStatus;
    for(var i in data){
        var tempObj=new Object();
        tempObj.id=data[i]['id'];
        tempObj.ip=data[i]['ip'];
        tempObj.mac=data[i]['mac'];
        tempObj.type=(data[i]['type']=='dynamic')?status[0]:status[1];
        var wanStr=data[i]['dev'].substr(0,3);
        if(wanStr=='WAN'){
            if(g_wan_num>1){
                tempObj.dev=data[i]['dev'];
            }
            else{
                tempObj.dev="WAN";
            }
        }
        else{
            tempObj.dev=data[i]['dev'];
        }
        tempObj.hostname=data[i]["note"] || appLanguageJs.unknown;
		if(data[i]['type']=='dynamic'){
            tempObj.control="<a class=\"fun_link bind\" title=\""+bindStatus[0]+"\" onclick=\"arp_inspect_bind("+i+")\" href=\"javascript:void(0);\">"+bindStatus[0]+"</a>";
        }
        else{
            tempObj.control="<a class=\"fun_link del\" title=\""+bindStatus[1]+"\" onclick=\"arp_inspect_unbind("+i+")\" href=\"javascript:void(0);\">"+bindStatus[1]+"</a>";
        }
        reData.push(tempObj);
    }
    return reData;
}
//表的操作函数
function arp_inspect_bind(index){
    var obj=arp_inspect_temp_data[index];
    obj.deal="add";
    var url=objectChangeToUrl(obj);
    nos.app.net('./arp_bind_settings.cgi',url,filter_arp_action_callback);
}
function arp_inspect_unbind(index){
    var url='dev='+arp_inspect_temp_data[index]['dev']+'&ip='+arp_inspect_temp_data[index]['ip'];
    nos.app.net('./arp_del_bind.cgi',url,filter_arp_action_callback);
}
//form提交函数
function filter_arp_bind_submit(){  
    if(check_app_input("filter_arp")){
		show_message("save");
        nos.app.net('./arp_bind_settings.cgi','filter_arp_bind_frm',filter_arp_bind_submit_callback);
    }     
}
//arp 的表单操作
//绑定全部
function filter_arp_bind_all(){
    nos.app.net('./arp_bind_del_all.cgi','type=bind&dev=ALL',filter_arp_action_callback);
}
//解除全部
function filter_arp_clean(){
    nos.app.net('./arp_bind_del_all.cgi','type=del&dev=ALL',filter_arp_action_callback);
}
//过滤函数
function choose_arp_inspect(val){
    switch (val){
        case 'ALL':init_arp_inspect_tab_info(arp_inspect_temp_data);break;
        case 'LAN':init_arp_inspect_tab_info(select_arp_data(val));break;
        case 'WAN':init_arp_inspect_tab_info(select_arp_data(val));break;
    }
}
//arp 选择数据
function select_arp_data(val){
    var reData=new Array();
    for(var i in arp_inspect_temp_data){
        if(arp_inspect_temp_data[i]['dev'].substr(0,3)==val){
            reData.push(arp_inspect_temp_data[i]);
        }
    }
    return reData;
}
//filter_arp 页面数据的操作
var filter_arp_temp_data=new Array();
function init_filter_arp_tab(data){
    filter_arp_temp_data=[];
    select_filter_arp(data,filter_arp_temp_data);
    var new_data=filter_arp_dataChangeTo(filter_arp_temp_data);
    
	var tab = new window.top.Table("filter_arp_tab",appLanguageJs.filterArpTab,new_data);
	tab.initTable();
    nos.app.resizePage();
}
function select_filter_arp(fromObj,toObj){
    var n=0;
    for(var i in fromObj){
        if(fromObj[i]['type']=='dynamic') {
            n++;continue;
        }
        if(typeof fromObj[i] == "object")
        {
            toObj[i-n]={};
            select_filter_arp(fromObj[i],toObj[i-n]);
            continue;
        }
        else  {
            toObj[i] = fromObj[i];
        }
    }
}
function judge_mode(val){
    var resultMode,mode = appLanguageJs.setMode;
    resultMode=mode[val];
    return resultMode;
}
function filter_arp_dataChangeTo(data){
    var reData=new Array();
    for(var i in data){
        var tempObj=new Object();
        tempObj.id=parseInt(i)+1;
        tempObj.ip=data[i]['ip'];
        tempObj.mac=data[i]['mac'];
        tempObj.bind_mode=judge_mode(data[i]['bind_mode']);
		var wanStr=data[i]['dev'].substr(0,3);
        if(wanStr=='WAN'){
            if(g_wan_num>1){
                tempObj.dev=data[i]['dev'];
            }
            else{
                tempObj.dev="WAN";
            }
        }
        else{
            tempObj.dev=data[i]['dev'];
        }
        tempObj.hostname=data[i]["note"]?cutString(data[i]["note"],15):appLanguageJs.unknown;
		tempObj.op = '<a onclick="filter_arp_modify(\''+ tempObj.id +'\')" title="'+ appCommonJS.btnTitle.edit +'" class="fun_link edit" href="javascript:void(0);">'+ appCommonJS.btnTitle.edit +'</a><a onclick="filter_arp_del(\''+ tempObj.id +'\')" title="'+ appCommonJS.btnTitle.del +'" class="fun_link del" href="javascript:void(0);">'+ appCommonJS.btnTitle.del +'</a>';
        reData.push(tempObj);
    }
    return reData;
}
function init_arp_defence_show(data){
    if(parseInt(data['arp_mode'])==1){
        $('#arp_rate_check').attr("checked",true);
    }
    else{
        $('#arp_rate_check').attr("checked",false);
    }
    arp_rate_status();
    $('#arp_rate').val(data['arp_rate']);
}
function init_ip_mac_stolen(data){
    (data['enable']==1)?$('#arp_prevent_check').attr("checked",true):$('#arp_prevent_check').attr("checked",false);
}
//arp 攻击防御保存生效函数
function filter_arp_defense_save(){
    var arp_mode=$('#arp_rate_check').prop("checked");
    if(arp_mode){
		if(!check_app_input("filter_arp_defense"))
			return;
    }
    var url='arp_mode='+(arp_mode==true?1:0)+'&arp_rate='+$('#arp_rate').val();
    show_message("save");
	nos.app.net('./arp_defence.cgi',url,filter_arp_defense_save_1);
}
function  filter_arp_defense_save_1(data){
    var url='enable='+(document.getElementById('arp_prevent_check').checked==true?1:0);
    if (data == "SUCCESS") {
        nos.app.net('./ipmac_stolen_set.cgi', url, filter_arp_defense_callback);
    } else
    {
        show_message("error", igd.make_err_msg(data));
    }
}
function filter_arp_defense_callback(data){
    if(data == "SUCCESS") {
        nos.app.net('./arp_defence_show.cgi','noneed=noneed',init_arp_defence_show);
        nos.app.net('./ipmac_stolen_get.cgi','noneed=noneed',init_ip_mac_stolen);
    }
    showSuccess(data);
}
// IP/MAC绑定 的操作函数
//IP/MAC  删除全部函数
function filter_arp_del_all(index){
    show_dialog(appCommonJS.dialog.del_all,function(){
        nos.app.net('./arp_bind_del_all.cgi',"type=del&dev=ALL",filter_arp_bind_submit_callback);
    })

}
//IP/MAC 删除一条记录
function filter_arp_del(index){
    show_dialog(appCommonJS.dialog.del_single,function(){
        var url='dev='+filter_arp_temp_data[index-1]['dev']+'&ip='+filter_arp_temp_data[index-1]['ip'];
        nos.app.net('./arp_del_bind.cgi',url,filter_arp_bind_submit_callback);
    })

}
//IP/MAC 修改函数
function filter_arp_modify(index){
    var obj=filter_arp_temp_data[index-1];
    $('#filter_arp_ip').val(obj.ip);
    $('#filter_arp_mac').val(obj.mac);
    $('#filter_arp_name').val(obj["note"]);
    select_chose_set('fiter_arp_mode_sel',obj.bind_mode);
    select_chose_set('bind_iface',obj['dev']);
    $('#filter_arp_deal').val('modify');
    $('#filter_arp_old_ip').val(obj.ip);
    $('#filter_arp_old_dev').val(obj.dev);
    $('#filter_arp_save').html(appCommonJS.Button.edit);
    $('#filter_arp_modify_cancel').show();
}
//IP/MAC  取消修改的函数
function filter_arp_modify_cancle(){
    $('#filter_arp_ip').val('');
    $('#filter_arp_mac').val('');
    $('#filter_arp_name').val('');
    select_chose_set('fiter_arp_mode_sel','hand');
    $('#hand_bind').show();$('#auto_bind').hide();
    set_uiname_select("bind_iface","LAN+WAN");
    $('#filter_arp_deal').val('add');
    $('#filter_arp_old_ip').val('');
    $('#filter_arp_old_dev').val('');
    $('#filter_arp_save').html(appCommonJS.Button.add);
    $('#filter_arp_modify_cancel').hide();
}
//回调函数
function filter_arp_bind_submit_callback(data){
    filter_arp_modify_cancle();
    showSuccess(data);
    nos.app.net('./arp_bind_list_show.cgi','noneed=noneed',init_filter_arp_tab);
}
//ARP监控 解除/绑定 全部的回调函数
function filter_arp_action_callback(data){
    showSuccess(data);
    init_arp_inspect();
}
//成功回调
function showSuccess(data){
    if (data == "SUCCESS") {
        show_message("success",appCommonJS.controlMessage.c_suc);
    } else {
        show_message("error", igd.make_err_msg(data));
    }
}
//app 防御攻击单选按钮事件
function arp_rate_status(){
    if($('#arp_rate_check').prop("checked")){
        $('#arp_rate_dd').removeClass("off");
    }
    else $('#arp_rate_dd').addClass("off");
}