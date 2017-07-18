/**
 * Created by lan on 2014/5/29.
 */
//初始化
$(document).ready(function(){
    initTab();
});
var appHtml=appL.l2tp_client.js,current_tab_name = [
    {tab_title:appHtml.tabTitle[0],tab_id:"client_set"},
    {tab_title:appHtml.tabTitle[1],tab_id:"status_client"}
];
var reg_app_map = {
    com_mode: [
        {id:"servernet", type: "ip"},
        {id:"servermask", type: "mask"}
    ],
    l2tp_set: [
        {id:"server", type: "nin_ip_url"},
        {id:"user", type: "pptp_l2tp"},
        {id:"pass", type: "password_blank"}
    ],
    noneed:[]
};
function init_client_set(){
    init_app_language(appL.l2tp_client.client_set);
    set_uiname_select('uiname','WAN');
    if(g_wan_num>1){
        $('#wan_uiname').show();
    }
    nos.app.net('./l2tp_client_config_show.cgi','noneed=noneed',init_client_tab);
	nos.app.net('../../universal_app/vpn_route_get.cgi','noneed=noneed',function(data){
		if(data.l2tp_route_enable == "1")
			$("#vpn").prop("checked",true);
		else
			$("#vpn").prop("checked",false);
	});
}
function init_status_client(){
	window.top.hide_pop_layer("message_layer");
    window.top.hide_lock_div();
    init_app_language(appL.l2tp_client.status_client);
    nos.app.net('./l2tp_client_status_show.cgi','noneed=noneed',init_client_status_tab);
}
//end————----
function l2tp_client_mode_set(val){
    val=='com'?$('.com').show():($('.com').hide(),$('#servernet').val(''),$('#servermask').val(''));
	nos.app.resizePage();
}
function set_enable_net(){
    if(document.getElementById('input_nat').checked==true){
        $('#enable_nat').val(1);
    }
    else{
        $('#enable_nat').val(0);
    }
}
//复制 对象的函数
function cloneAll(fromObj,toObj){
    for(var i in fromObj){
        if(typeof fromObj[i] == "object")
        {
            toObj[i]={};
            cloneAll(fromObj[i],toObj[i]);
            continue;
        }
        else  {
            toObj[i] = fromObj[i];
        }
    }
}
var client_set_data=new Array();
function init_client_tab(data){
    client_set_data=[];
    var new_data=l2tp_client_dataChangeTo(data);
    cloneAll(data,client_set_data);
    //remove ,"工作模式","NAT"
	var tab = new window.top.Table("l2tp_client_tab",appHtml.clientTabHead,new_data);
	tab.initTable();
    nos.app.resizePage();
}
function l2tp_client_dataChangeTo(data){
    var reData=new Array();
    var pass="";
    var len = data.length;
    var lengthKeyObj="";
    if(len>0){
        lengthKeyObj=parentEmt.get_rand_key(0,data[0].pass,true);
    }
    for(var i in data){
        var tempObj=new Object();
        tempObj.id=parseInt(i,10)+1;
        tempObj.state=(parseInt(data[i]['enable'])==1)?appHtml.status[0]:appHtml.status[1];
        tempObj.sever= cutString(data[i]['server'],18);
        tempObj.user = cutString(data[i]['user'],8);
        pass=parentEmt.getDAesString(data[i].pass,lengthKeyObj.rand_key);
        tempObj.pass = cutString(pass,8);
        data[i]['pass']=pass;
//        tempObj.mode=(data[i]['mode']=='com'?'企业模式':'ISP模式');
//        tempObj.nat=(parseInt(data[i]['enable_nat'])==1?'启用':'禁止');
		tempObj.op = '<a onclick="client_modify(\''+ tempObj.id +'\')" title="'+ appCommonJS.btnTitle.edit +'" class="fun_link edit" href="javascript:void(0);">'+ appCommonJS.btnTitle.edit +'</a><a onclick="client_del(\''+ tempObj.id +'\')" title="'+ appCommonJS.btnTitle.del +'" class="fun_link del" href="javascript:void(0);">'+ appCommonJS.btnTitle.del +'</a>';
        reData.push(tempObj);
    }
    return reData;
}
//区分是域名还是ip
function judge_ip_url(str){
    var flg=0;
    for(var h=0;h<str.length;h++){
       var  cmp="0123456789.";
        var tst=str.substring(h,h+1);
        if(cmp.indexOf(tst) < 0){
            flg++;
        }
    }
    if (flg != 0){//url
        return 0;
    }
    else{//ip
        return 1;
    }
}
//表操作
function client_modify(index){
    var obj=client_set_data[index-1];
    $('#deal').val('mod');
    if(parseInt(obj.enable_nat)==1){
        $('#input_nat').attr('checked',true);
    }
    else{
        $('#input_nat').attr('checked',false);
    }
    radio_sele_set('mode_name',obj.mode,l2tp_client_mode_set);
	nos.app.setForm('client_set_frm', obj);
    $('#cancel_btn').show();$('#save_btn').html(appCommonJS.Button.edit);
}
//删除
function client_del(index){
    var obj=client_set_data[index-1];
    showInfoId=1;
    show_dialog(appCommonJS.dialog.del_single,function(){
        nos.app.net('./l2tp_client_del.cgi','id='+obj.id,set_save_callback);
    })

}
//提交
function client_set_save(){
    if(!check_app_input('l2tp_set')) return;
    if($('#radio_enterprise_mode').attr('checked')=='checked'){
        if(!check_app_input('com_mode')) return;
    }
	var ret = judge_ip_url($('#server').val())
    $('#is_ipaddr').val(ret);
	if(ret == 1){
		var ip = $("#server").val();
		$("#server").val(fix_ip(ip));
	}
    $('#deal').val()=='add'?showInfoId=0:showInfoId=2;
    nos.app.net('./l2tp_client_add.cgi','client_set_frm',set_save_callback);
}

function fix_ip(ip){
	var ip_arr = ip.split(".");
	for(var i in ip_arr){
		ip_arr[i] = parseInt(ip_arr[i]);
	}
	return ip_arr[0] + "." + ip_arr[1] + "." + ip_arr[2] + "." + ip_arr[3]
}

var showInfoId;
function set_save_callback(data){
    if(data=="SUCCESS"){
        if(showInfoId>=0){
             show_message("success",appHtml.clientTabBtn[showInfoId]+appHtml.success);
			 load_app_page(current_html,"init_"+current_html);
        }
		else{
			init_status_client();
		}
    }
    else{
         show_message("error",igd.make_err_msg(data));
    }
}
function client_cancel_mod(){
    load_app_page(current_html,"init_"+current_html);
}
function client_clean(){

    show_dialog(appCommonJS.dialog.del_all,function(){
        showInfoId=1;
        nos.app.net('./l2tp_client_clean.cgi','noneed=noneed',set_save_callback);
    })
}
//L2TP 状态
var client_status_data=new Array();
function init_client_status_tab(data){
    client_status_data=[];
    cloneAll(data,client_status_data);
    var new_data=l2tp_client_status_dataChangeTo(data);
	var tab = new window.top.Table("l2tp_status_tab",appHtml.clientStatusTabHead,new_data);
	tab.initTable();
    nos.app.resizePage();
}
function l2tp_client_status_dataChangeTo(data){
    var reData=new Array(),linkStatus =appHtml.linkStr;
    for(var i in data){
        var tempObj=new Object();
        tempObj.id=parseInt(i,10)+1;
        tempObj.user=data[i]['user'];
        tempObj.con=(parseInt(data[i]['link_status'])==0?linkStatus[1]:linkStatus[0]);
        tempObj.local=data[i]['local_ip'];
        tempObj.remote=data[i]['remote_ip'];
		if(data[i].link_status == '0')
			tempObj.operate = '<a class="fun_link link" title="'+linkStatus[0]+'" href="javascript:void(0);" onclick="client_connection('+ tempObj.id  +');">'+linkStatus[0]+'</a>';
		else
			tempObj.operate = '<a class="fun_link unlink" title="'+linkStatus[1]+'" href="javascript:void(0);" onclick="client_connection('+ tempObj.id +');">'+linkStatus[1]+'</a>';
        reData.push(tempObj);
    }
    return reData;
}
function refresh_status_tab(){
	show_message("refreshing");
	window.setTimeout(function(){
		init_status_client();
	},500);  
}
function client_connection(index){
	var obj=client_status_data[index-1];
	if(!parseInt(obj.link_status))
		show_message("save");
	showInfoId=-1;
	if(parseInt(obj.link_status)==1){
		show_dialog(appHtml.dialog,function(){
			nos.app.net('./l2tp_client_down.cgi','id='+obj.id,set_save_callback);
		})
	}
	else{
		window.setTimeout(function(){
			nos.app.net('./l2tp_client_link.cgi','id='+obj.id,set_save_callback);
		},500);
	}
}

function set_vpn(){
	var str = "";
	if($("#vpn").prop("checked"))
		str = "1";
	else
		str = "0";
	show_message("save");
	nos.app.net('../../universal_app/vpn_route_set.cgi','l2tp_route_enable=' + str,function(data){
		if(data[0] == "SUCCESS"){
			show_message("success");
		}
		else{
			show_message("error",igd.make_err_msg(data));
			if(str == "1")
				$("#vpn").prop("checked",false);
			else
				$("#vpn").prop("checked",true);
		}																		
	});
}