/**
 * Created by Administrator on 2015/3/29.
 */
var ap={
    initArray:["init_ap","init_ap_list"],
    appCurrentHtml:null,
    _reponse_DATA:null,
    nav:function(){
        var me =this;
        $(".ap-nav dl").undelegate("dd","click").delegate("dd","click",function(){
            var htmlName = $(this).attr("data-html-name");
            var actionId = $(this).index();
            if(htmlName!="ap-set"&&me._reponse_DATA.enable=="0"){
                show_message("msg_info",appHtml.msg_info_status);htmlName="ap-set";actionId=0;
            }
            me[me.initArray[actionId]]();
            me.pageToggle(htmlName);
            me.addBackEvent("ap-nav");
        });
    },
    addBackEvent:function(name){
        var me =this;
        var app=mobile_host_control.app;
        app.addReturnBackCallBackFns(function(){
            if(me.appCurrentHtml=="ap-set"){
                if(!Tools.form.action_get_DATA(1)){app.addReturnBackCallBackFns(arguments.callee);return false;}
            }
            me.pageToggle(name);
        });
    },
    pageToggle:function(name){
        var me = this;
        var section = $("#appContent section").not(":first");
        me.appCurrentHtml=name;
        if(name=="ap-nav"){
            mobile_host_control.M_Swiper.subSlideTo(0);
        }
        else{
            section.hide();$("."+name).show();
            mobile_host_control.M_Swiper.subSlideTo(1);
        }
        if(name=="ap-set"){
            $(".appSave").show();languageM_nav_map[current_html].formData="ap_frm";
            Tools.form.subCurrentHtml_init_formData();
        }
        else{
            $(".appSave").hide();languageM_nav_map[current_html].formData="";
        }
        $(".appTitle").html(appHtml[name]);

    },
    init_ap:function(){
        var me =this;
        nos.app.net('/app/igd_ap/webs/wireless_ap_base.cgi', "action=get",me.init_ap_set_callback);
    },
    //副ap无线设置初始化成功执行函数
     init_ap_set_callback:function(result){
        var me = ap;
         me._reponse_DATA=result;
        nos.app.setForm("ap_frm",result);
        radio_set(result.enable,"ap");
        radio_set(result.host_isolation,"host_isolation");
        radio_set(result.broadcast_ssid,"broadcast_ssid");
        radio_set(result.auto_close_enable,"ap_auto_close");
        radio_set(result.limit_enable,"speed_limit");
        speed_limit_set();
        $("#upside").val(result.limit_up_speed);
        $("#downside").val(result.limit_down_speed);
        $("#access_number").val(result.limit_hosts_num);
        Tools.select.set(result.auth_mode,"ap_ap_mode_sel");
        $("#ap_frm").show();
        me._setAPList_style();
    },
    _setAPList_style:function(){
        var colorStyle=["#808080","#333"];
        var value_s = $("#ap_hidden").val();
        $(".ap-nav dl dd:not(:first)").css("color",colorStyle[value_s]);
    },
    //副ap无线连接列表
    apIntervalId:null,
    listInfo:null,
    init_ap_list:function(){
        var me=this;
        init_ap_list_callback();
        if(me.apIntervalId)
            clearInterval(me.apIntervalId);
        me.apIntervalId = window.setInterval('init_ap_list_callback()', 2000);
    },
    create_ap_list:function(data){
        var me =ap;
        var listHtml="";
        var apList=$("#ap-list");
        me.listInfo=data;
        if(!!data&&!!data.length){
            for(var i in data){
                listHtml+="<dd class=\"select_dd\"><label>"+appHtml.apName+(i*1+1)+"</label><label>"+data[i].mac.toUpperCase()+"</label></dd>";
            }
            apList.removeClass("noTableListDataTip").html(listHtml);
        }else{
            apList.addClass("noTableListDataTip").html(appHtml.noApListTip);
        }
        me.addApListEvent();
    },
    addApListEvent:function(){
        var me =this;
        var paint_tab_info=function(data){
            var tempobj={};
            //tempobj.id = parseInt(i,10) + 1;               //序列号id
            tempobj.mac= data.mac.toUpperCase();                      //mac
            tempobj.mode = get_bgn(data.mode);          //模式
            tempobj.tx_rate= data.tx_rate+ "M";          //发送速率
            tempobj.rx_rate = data.rx_rate + "M";          //接收速率
            tempobj.elapsed = format_time(data.elapsed);            //连接时间
            return tempobj;
        };
        var setListInfo = function(index){
            var dataV = paint_tab_info(me.listInfo[index]);
            var spanObj = $("#ap-list-info");
            for(var mem in dataV){
                spanObj.find("."+mem).html(dataV[mem]);
            }
        };
      $("#ap-list").undelegate("dd","click").delegate("dd","click",function(){
          setListInfo($(this).index());
          $("#ap-list").hide();
          $("#ap-list-info").show();
          mobile_host_control.app.addReturnBackCallBackFns(function(){
              $("#ap-list").show();
              $("#ap-list-info").hide();
          });
      });
    },
    radioSelectConfig:function(){
        Tools.select.config.ap_ap_mode_sel={};
        Tools.select.config.ap_ap_mode_sel.oEvent="wireless_safe_mode_change";
        Tools.radio.config.switch.ap={};
        Tools.radio.config.switch.ap.oEvent="ap_enable_set";
        Tools.radio.config.switch.speed_limit={};
        Tools.radio.config.switch.speed_limit.oEvent="speed_limit_set";
    },
    init:function(){
        var me = this;
        appHtml=appL.igd_ap.js;
        current_tab_name = [
            {tab_title:appHtml.apTitle[0],tab_id:"ap_tab"},
            {tab_title:appHtml.apTitle[1],tab_id:"ap_list_tab"}
        ];
        $.extend(true,appHtml,MobileHtml[current_html]["js"]);
        $(".appSave").hide();
        me.radioSelectConfig();
        me.nav();
        me.init_ap();
    }
};
define(function(){
    return ap;
});

var appHtml,current_tab_name;
//验证地图
var reg_app_map={
    ap_set_frm:[
        //添加表情需要注释掉以下一行
        {id:"ap_ssid",type:"string"}
    ],
    ap_safe_frm:[
        {id:"ap_wpa_key",type:"password eq8_64"}
    ]
}
///////////////////////////////// 副ap无线设置
//无线状态click设置
function ap_enable_set()
{
    var val = $("#ap_hidden").val();
    if(val=="0"){
        $(".ap-set dl dd").not(":first").hide();
    }else{
        $(".ap-set dl dd").not("#set_psd,.speed_limit").show();wireless_safe_mode_change($("#ap_ap_mode_sel").val());
    }
}

function ap_auto_close_set(str){
    $("#ap_auto_close_hidden").val(str);
    if(str == "0"){
        $("#ap_auto_close").attr("checked",false);
    }
    else{
        $("#ap_auto_close").attr("checked",true);
    }
}

function set_ap_auto_close(obj){
    if($(obj).attr("checked"))
        $("#ap_auto_close_hidden").val("1");
    else
        $("#ap_auto_close_hidden").val("0");
}


function clear_editor(){
    var editor = $(".emoji-wysiwyg-editor");
    if(editor.length > 0)
        editor.remove();
    var btn = $(".emoji-button");
    if(btn.length > 0)
        btn.remove();
}

function init_editor(){
    var $wysiwyg = $('.emojis-wysiwyg').emojiarea({wysiwyg: true});
    var $ssid_value = $('#ap_ssid');
    $wysiwyg.unbind("change").bind('change', function() {
        $ssid_value.val($(this).val());
    });
    $wysiwyg.trigger('change');
    $(".emoji-wysiwyg-editor").css("width","165px");
}


//副ap无线设置提交函数
function check_ssid_length(str) {
    var i, sum=0, count;

    var text = $(".emoji-wysiwyg-editor").text();
    var count = text.length;
    for (i = 0; i < count; i++) {
        if ((text.charCodeAt(i) >= 0) && (text.charCodeAt(i) <= 255)) {
            sum = sum + 1;
        }
        else
            sum = sum + 3;

        if (sum > 32) {
            return false;
        }
    }

    var img = $(".emoji-wysiwyg-editor img");
    for(var j = 0; j < img.length; j++){
        sum += parseInt(img[j].name,10);
    }
    //计算表情的length
    if(sum > 32)
        return false;
    else
        return true;
}
function check_ssid(){
    var val = $("#ap_ssid").val(),errorStr=appHtml.ssidStr;
    var str = "";
    if(val == ""){
        str = errorStr[0];
        return str;
    }
    else if(!check_ssid_length(val)){
        str = errorStr[1];
        return str;
    }
    else{
        str = parentEmt.check_string(val);
        return str;
    }
    return true;
}

function wire_bas_ap_set(){
    var ap_hidden = $("#ap_hidden").val();
    var ap_model = $("#ap_ap_mode_sel").val();
    if(ap_hidden=="1"){
        if(!check_app_input("ap_set_frm")){
            return;
        }
        if(ap_model == '0'){
            if(!check_app_input("ap_safe_frm")){
                return;
            }
        }
    }
    $("#save_btn").html(appCommonJS.Button.saving);
    show_message("save");
    nos.app.net('/app/igd_ap/webs/wireless_ap_base.cgi', 'ap_frm', function(result){
        if(result=="SUCCESS"){
            show_message("success",appCommonJS.controlMessage.s_suc);
            ap.init_ap();
        }else{
            show_message("error",igd.make_err_msg(result));
        }
    })
}

//============== ap list =============
function init_ap_list_callback(){
    if(ap.appCurrentHtml!="ap-list")  clearInterval(ap.apIntervalId);
    nos.app.net("/app/igd_ap/webs/wireless_connect_list_show.cgi",'action=get', ap.create_ap_list);
}


//安全模式onchange
function wireless_safe_mode_change(val)
{
    if(val == "0") {
        $("#set_psd").show();
    }else{
        $("#set_psd").hide();
    }

}

///////////////others
function format_time(time)
{
    time = parseInt(time,10);
    var hour = Math.floor(time / 3600);
    var tmp = time % 3600;
    var minute = Math.floor(tmp / 60);
    var sec = tmp % 60;
    if(hour < 9)
        hour = '0' + hour;
    if(minute < 9)
        minute = '0' + minute;
    if(sec < 9)
        sec = '0' + sec;
    return hour + ":" + minute + ":" + sec;
}
function get_bgn(v)
{
    var str = '';
    switch(v){
        case '0' : str = ' ';break;
        case '1' : str = ' (a)';break;
        case '2' : str = ' (b)';break;
        case '3' : str = ' (a+b)';break;
        case '4' : str = ' (g)';break;
        case '5' : str = ' (a+g)';break;
        case '6' : str = ' (b+g)';break;
        case '7' : str = ' (a+b+g)';break;
        case '8' : str = ' (n)';break;
        case '9' : str = ' (a+n)';break;
        case '10' : str = ' (b+n)';break;
        case '11' : str = ' (a+b+n)';break;
        case '12' : str = ' (g+n)';break;
        case '13' : str = ' (a+g+n)';break;
        case '14' : str = ' (b+g+n)';break;
        case '15' : str = ' (a+b+g+n)';break;
		case '16' : str = ' (ac)';break;
    }
    return str;
}

//访客网络限速开关

function speed_limit_set(){
    var val = $("#speed_limit_hidden").val();
//    if(val=="0")
//        $(".speed_limit").hide();
//    else
//        $(".speed_limit").show();
}

