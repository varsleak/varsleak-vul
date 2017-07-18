/**
 * Created by lan on 2015/6/5.
 */
var wireless_base={
    slideContainerType:true,//true -> appContent的滑动容器 false -> appContent的子滑动容器
    type:null,
    node:{
        wire_enable:"wireless_enable",
        AP_SSID:"wire_ssid",
        channel_width:"wlb_channel_width_sel",
        channel_num:"wireless_base_channel_sel",
        ap_mode:"wls_ap_mode_sel",
        wpa_key:"wireless_key_val",
        SSID_broadcast:"wire_ssid_broadcast",
        channel_width_option:$("#channel_width_option"),
        channel_num_option:$("#channel_num_option")
    },
    wireless_2_4_config:{},//2.4G 初始化参数
    wireless_5_config:{},//5G 初始化参数
    wireless_same:null,//wifi漫游状态值
    wireless_same_submit_data:{},//wifi漫游设置所需数据
    wirelessForm_compareData_init:null,//
    init_form_data:function(){//初始化 Form 表单数据
        var me = this;
        var type = me.type;
        var node = me.node;
        var configData;
        var setChannelWidthNumSelect = function(){
            var same = $("#same_section");
            //type=="2_4"&&!!igd.global_param.is_5G?same.show():same.hide();
            mobile_host_control.language_init({path:language_M[language_type]["SELECT"]["channel_width_"+type+"_option"],idClass:"channel_width_option",type:"select"});
            mobile_host_control.language_init({path:language_M[language_type]["SELECT"]["channel_num_"+type+"_option"],idClass:"channel_num_option",type:"select"});
        };
        configData = me["wireless_"+type+"_config"];
        setChannelWidthNumSelect();
        Tools.radio.set(node.wire_enable,configData.wire_enable);
        $("#"+node.AP_SSID).val(configData.AP_SSID);
        $("#"+node.wpa_key).val(configData.wpa_key);
        Tools.select.set(configData.channel_width,node.channel_width);
        Tools.select.set(configData.channel_num,node.channel_num);
        Tools.select.set(configData.ap_mode,node.ap_mode);
		me.wisp_relate(type,node,configData.wire_enable);
        Tools.radio.set(node.SSID_broadcast,configData.SSID_broadcast);
        !!igd.global_param.is_5G && Tools.radio.set("same_enable",me.wireless_same);
    },
    wireless_type_appcompatible:function(){//5G有无的 CSS 变形
        var me = this;
        me.init_form_data();
        me.slideContainerType?mobile_host_control.M_Swiper.subSlideTo(1):mobile_host_control.M_Swiper.subSlideTo(1,mySubContainer_subSwiper);
        $(".appSave").show();
        var titleTxt = $(".appTitle");
        var resetTxt = titleTxt.html();
        titleTxt.html(me.type.replace("_",".")+"G "+resetTxt);
        languageM_nav_map[current_html].formData="wireless_base_frm";
        Tools.form.subCurrentHtml_init_formData();
        me.wirelessForm_compareData_init = Tools.form.action_get_DATA("get",{type:"not",dom:"#same_enable_hidden,#wire_ssid_broadcast_hidden"});
        mobile_host_control.app.addReturnBackCallBackFns(function(){
            var callFn =arguments.callee;
            if(Tools.form.action_get_DATA(1)){
                titleTxt.html(resetTxt);
                me.slideContainerType?mobile_host_control.M_Swiper.subSlideTo(0):mobile_host_control.M_Swiper.subSlideTo(0,mySubContainer_subSwiper);
                languageM_nav_map[current_html].formData="";
                $(".appSave").hide();
            }
            else{
                mobile_host_control.app.addReturnBackCallBackFns(callFn);return false;
            }
        });
    },
    init_wireless_base:function(type,callbackFn){
        var me = this;
        var obj = {network_mode:999};
        var callFn = callbackFn || $.noop;
        if(type!="same"){
            obj.ap_id = 0;
            type == "2_4"?obj.port_id = "WIFI1":obj.port_id = "WIFI2";
        }
        else{
            obj.ap_id=3;obj.port_id="WIFI2";
        }
        $.post("/router/wireless_base_show.cgi", obj, function (data) {
            var responseConfig = dataDeal(data);
            if(type!="same"){
                $.extend(me["wireless_"+type+"_config"],responseConfig);
                type=="5"&& $.extend(me.wireless_same_submit_data.bas_ap_set,responseConfig);
                $("#wireless_status_type_"+type).html(common_M_html.status_switch_txt[responseConfig["wire_enable"]]);
                me.init_wireless_sec(type,callFn);
            }
            else{
                me.wireless_same=responseConfig["wire_enable"];
                Tools.radio.set("same_enable",responseConfig["wire_enable"]);
            }
        });
    },
    init_wireless_sec:function(type,callbackFn){
        var me = this;
        var obj = {};
        obj.ap_id = 0;
        obj.ap_mode = 0;
        type == "2_4"?obj.port_id = "WIFI1":obj.port_id = "WIFI2";
        $.post("/router/wireless_sec_show.cgi", obj, function (data) {
            var responseConfig = dataDeal(data);
            $.extend(me["wireless_"+type+"_config"],responseConfig);
            type=="5"&& $.extend(me.wireless_same_submit_data.sec_set,responseConfig);
            var lengthKeyObj=get_rand_key(0,responseConfig.wep_key,true);
            responseConfig.wep_key = getDAesString(responseConfig.wep_key,lengthKeyObj.rand_key);
            responseConfig.wpa_key = getDAesString(responseConfig.wpa_key,lengthKeyObj.rand_key);
            me["wireless_"+type+"_config"].wpa_key = responseConfig.wpa_key;
            !!callbackFn&&typeof callbackFn == "function"&&(callbackFn.call(me));
        });
        wireless_pwd_limit(type);
    },
    check_input_data:function(){
        reg_map.wireless_base=[
            {id: "wire_ssid", type: "string"},
            {id:"wireless_key_val",type:$("#wls_ap_mode_sel").val()=="0"?"noneed":"password eq8_64"}
        ];
        if(!check_input("wireless_base")){
            return false;
        }else return true;
    },
    wireless_save_callNetShow:function(wifiDataTip,isShowNet){//success  callback
        hide_pop_layer("message_layer");
        hide_lock_div();
        show_message("success");
        !!isShowNet && app_compatible.wifi_set.show_link_down_tip(wifiDataTip);
    },
    wireless_base_set:function(){
        var me = this;
        var node = me.node;
        if(!me.check_input_data()){return;}
        var obj = {
            channel_band:me["wireless_"+me.type+"_config"].channel_band,
            wire_mac:me["wireless_"+me.type+"_config"].wire_mac,
            network_mode:0,
            ap_id:0,
            region:"3",//back ="1"
            need_reboot:0,
            waln_partition:0
        };
        var getSameSetData = function(){
			var mode_sel = $("#wls_ap_mode_sel").val();
			var wpa_keytime;
			if(mode_sel == "3" || mode_sel == "4"){
				wpa_keytime = 3600;
			}
			else{
				wpa_keytime = 0;
			}
            $.extend(true,me.wireless_same_submit_data,{
                bas_ap_set:{
                    wire_enable:obj.wire_enable>>0&&$("#same_enable_hidden").val()>>0,ap_id:3,port_id:"WIFI2",AP_SSID:obj.AP_SSID
                },
                sec_set:{
                    ap_id:3,port_id:"WIFI2",SSID_broadcast:obj.SSID_broadcast,wpa_key:getAesString($("#wireless_key_val").val()),wpa_keytime:wpa_keytime,ap_mode:mode_sel
                }
            });
        };
        obj.wire_enable = $("#wireless_enable_hidden").val();
        obj.AP_SSID = $("#"+node.AP_SSID).val();
        obj.channel_width = $("#"+node.channel_width).val();
        obj.channel_num = $("#"+node.channel_num).val();
        obj.SSID_broadcast = $("#wire_ssid_broadcast_hidden").val();
        me.type == "2_4"?(obj.port_id = "WIFI1",obj.radio_criterion = "10"):(obj.port_id = "WIFI2",obj.radio_criterion = "25");
        show_message("setup_ing");
        if(me.wirelessForm_compareData_init!==Tools.form.action_get_DATA("get",{type:"not",dom:"#same_enable_hidden,#wire_ssid_broadcast_hidden"})){
            $.post("/router/wire_bas_ap_set.cgi", obj, function (data) {
                var response = dataDeal(data);
                if (response == "SUCCESS"){
                    !!igd.global_param.is_5G&&me.type=="2_4"&&getSameSetData();
                    $("#wireless_status_type_"+me.type).html(common_M_html.status_switch_txt[obj["wire_enable"]]);$.extend(me["wireless_"+me.type+"_config"],obj);
                    me.wireless_sec_set(obj.channel_num,{ssid:obj.AP_SSID});
                }
                else
                    show_message("error", igd.make_err_msg(response));
            });
        }else{
            me.wireless_ssid_broadcast_compatible(obj.SSID_broadcast);  //ssid_broadcast  judge
            if(!!igd.global_param.is_5G&&me.type=="2_4"&&me.wireless_same!=$("#same_enable_hidden").val()){
                getSameSetData();
                me.wireless_5G_same_submit(false);
            }else{
                show_message("success");
            }
        }
    },
    wireless_sec_set:function(channel_num,wifiDataTip){
        var me = this;
        var node = me.node;
        var obj = {};
        var mode_sel = $("#wls_ap_mode_sel").val();
        obj.ap_id = 0;
        me.type == "2_4"?obj.port_id = "WIFI1":obj.port_id = "WIFI2";
        obj.ap_mode = mode_sel;
        if (mode_sel == "3" || mode_sel == "4") {
            obj.wpa_key = getAesString($("#"+node.wpa_key).val());
            obj.wpa_keytime = 3600;
            obj.wpa_mode = 0;
            obj.wpa_tkaes_flag = 0;
        }
        $.post("/router/wireless_sec_set.cgi", obj, function (data) {
            var res = dataDeal(data);
            if (res == "SUCCESS") {
                var timer,wpaKey_val;
                me.wirelessForm_compareData_init = Tools.form.action_get_DATA("get",{type:"not",dom:"#same_enable_hidden,#wire_ssid_broadcast_hidden"});
                $.extend(me["wireless_"+me.type+"_config"],obj);
                me["wireless_"+me.type+"_config"].wpa_key = wpaKey_val =$("#"+node.wpa_key).val();
                if(channel_num == "0")
                    timer = WIFI_CHANNEL_CHANGE_TIME * 1000;
                else
                    timer = WIFI_NORMAL_SET_TIME * 1000;
                if(me.type=="2_4"&& !!igd.global_param.is_5G){
                    me.wireless_same_submit_data.sec_set.ap_mode=mode_sel;
                    me.wireless_same_submit_data.sec_set.wpa_key=getAesString(wpaKey_val);
                    me.wireless_5G_same_submit(true,timer);
                }else{
                    window.setTimeout(function () {
                        me.wireless_save_callNetShow(wifiDataTip,true);
                    }, timer);
                }
            }
            else {
                show_message("error", igd.make_err_msg(res));
            }
        });
    },
    wireless_ssid_broadcast_compatible:function(curBroadcast){//ssid_broadcast  judge
        var me =this;
        var defaultBroadcast = me["wireless_"+me.type+"_config"].SSID_broadcast;
        defaultBroadcast != curBroadcast && (function(){
            var wifiSame = false;
            var obj = {
                ap_id:0,
                SSID_broadcast:curBroadcast
            };
            me.type == "2_4"?obj.port_id = "WIFI1":obj.port_id = "WIFI2";
            var broadcast_set = function(){
                var callFn = arguments.callee;
                $.post("/router/wireless_broadcast_set.cgi", obj, function (data2) {
                    var res = dataDeal(data2);
                    if (res == "SUCCESS") {
                        me["wireless_"+me.type+"_config"].SSID_broadcast=curBroadcast;
                        if(me.type == "5"||!igd.global_param.is_5G || !!wifiSame){
                            show_message("success");
                        }
                        else{
                            obj.ap_id = 3;obj.port_id = "WIFI2";
                            wifiSame=true;callFn();
                        }
                    }
                    else{
                        show_message("error", igd.make_err_msg(res));
                    }
                });
            };
            broadcast_set();
        })();
    },
    wireless_5G_same_submit:function(hasOthersChange,timer){
        var me = this;
        $.post("/router/wire_bas_ap_set.cgi", me.wireless_same_submit_data.bas_ap_set, function (data1) {
            var res = dataDeal(data1);
            if (res == "SUCCESS") {
                me.wireless_same=me.wireless_same_submit_data.bas_ap_set.wire_enable;
                $.post("/router/wireless_sec_set.cgi", me.wireless_same_submit_data.sec_set,function (data2) {
                    var secRes = dataDeal(data2);
                    if (secRes == "SUCCESS") {
                        me.wirelessForm_compareData_init = Tools.form.action_get_DATA("get",{type:"not",dom:"#same_enable_hidden,#wire_ssid_broadcast_hidden"});
                        window.setTimeout(function(){
                            current_html =="wifi_set" && me.wireless_save_callNetShow({ssid:me.wireless_2_4_config.AP_SSID},hasOthersChange);
                        },timer || 1000);
                    }
                    else{
                        show_message("error", igd.make_err_msg(secRes));
                    }
                });
            }
            else{
                show_message("error", igd.make_err_msg(res));
            }
        });
    },
    addEventList:function(){
        var me = this;
        var node = $(".wirelessSet-menu dl");
        node.undelegate("dd","click").delegate("dd","click",function(){
            me.type = $(this).attr("data-source-html-name");
            me.wireless_type_appcompatible();
        });
        Tools.select.config.wlb_channel_width_sel={};
        Tools.select.config.wlb_channel_width_sel.oEvent=function(value){
            $("li[data-value=165]")[value=="2"||value=="6" ? "show" :"hide"]();
        };
    },
    judge_wireless_type:function(){
        var me =this;
        var wirelessContent = $(".wirelessSwiperWrapper");
        var setPage = $(".wirelessSet");
        if(!!igd.global_param.is_5G){
            me.wireless_same_submit_data={};
            me.wireless_same_submit_data.bas_ap_set={};
            me.wireless_same_submit_data.sec_set={};
            $(".appSave").hide();
            wirelessContent.find("section").show();
            ( me.slideContainerType = $(".wirelessSwiperWrapper").parent(".subContainer-sub").length === 0 )?mobile_host_control.M_Swiper.subSlide():mobile_host_control.M_Swiper.subContainer_sub();
            me.init_wireless_base("2_4");
            me.init_wireless_base("5");
            me.init_wireless_base("same");
        }else{
            setPage.show();
            me.type="2_4";
            me.init_wireless_base("2_4",function(){
                me.init_form_data();
            });
        }
    },
	wisp_relate:function(type,node,enable){
		$.post("/app/igd_wisp/wireless_sta_mode.cgi",{action:"get"},function(data){
			data = dataDeal(data);
			if(data.enable == "1" && data.status == "1" && enable == "1"){
				Tools.select.init();
				if((type == "2_4" && data.channel < 15) || (type == "5" && data.channel > 15)){
					Tools.select.disabled(node.channel_width,"0",MobileHtml[current_html].js.disable_bandwidth);
					Tools.select.disabled(node.channel_num,"0",MobileHtml[current_html].js.disable_channel);
				}
			}
		});
	},
    init:function(){
        this.judge_wireless_type();
        this.addEventList();
    }
};
define(function(){
    return wireless_base;
});