/**
 * Created by Administrator on 2015/3/24.
 */
var app_compatible = {};
app_compatible.show_cut_net_tip=function(obj,isLogin){
    var title=$("#cutNetSetSuccess");
    var tip=$("#tipConnectInfo");
    var successTip=$(".wifiInfoChangeSection .wifi-name");
    var wifiName = current_html=="rally_default"?compare_obj.default_wifiName:compare_obj.AP_SSID;
    if(!!obj){
        !!obj.title&&title.html(obj.title);
        (!!obj.success&&(wifiName=obj.success)) || (!!obj.ssid&&(wifiName=obj.ssid));
        (!!obj.tip&&tip.html(obj.tip))||tip.html(MobileHtml.index.html.tipConnectInfo);
    }
    successTip.html(wifiName);
    $(".wifiInfoChangeSection").show();
    mobile_host_control.app.addReturnBackCallBackFns(function(){
        !!isLogin?window.location.href="/login_mobile.htm":$(".wifiInfoChangeSection").hide();
    });
};
// ===============      wifi set 覆盖模块    ==========
(function () {
    app_compatible.wifi_set = {
        wifiCompatible_func:function () {
            window.clear_g_time_text=function(){
                var hour_s = $("#g_start_hour");
                var min_s = $("#g_start_min");
                var hour_e = $("#g_end_hour");
                var min_e = $("#g_end_min");
                hour_s.val("0");
                min_s.val("0");
                hour_e.val("23");
                min_e.val("59");
                $("#time_segment_ctr").find(":checkbox[id*='g_day']").prop("checked",false);
            };
        },
        judge_current_day:function(){//判断当前时间段是否在指定关闭的时间段
            if($("#g_time_hidden").val()=="0"){return false;}
            var currentTime = new Date();
            var currentTime_h_m=parseInt(currentTime.getHours().toString()+currentTime.getMinutes(),10);
            var currentWeekDay = currentTime.getDay()-1;
            var startTime = parseInt($("#g_start_hour").val()+$("#g_start_min").val(),10);
            var endTime = parseInt($("#g_end_hour").val()+$("#g_end_min").val(),10);
            var selectWeek= $("#time_segment_ctr").find(":checked[id=\"g_day"+currentWeekDay+"\"]").length;
            if(!!selectWeek) {
                if(currentTime_h_m>startTime&&currentTime_h_m<endTime){return true;}
            }
            return false;
            //不在定时开关时间段里面
        },
        show_link_down_tip:function(obj){//显示断网提示页面
            var me =app_compatible.wifi_set;
            var data = {tip:MobileJsHtml.wifi_set.tip,success:MobileJsHtml.wifi_set.success};
            !!obj&& $.extend(data,obj);
            Tools.form.subCurrentHtml_init_formData();
            if(($("#wireless_enable_hidden").val()=="0"&&current_html=="wifi_set")||(!!me.judge_current_day()&&current_html=="wifi_time_set")){
                app_compatible.show_cut_net_tip(data);return;
            }
            current_html=="wifi_set"&&app_compatible.show_cut_net_tip(obj);
        },
        wifi_radio_select_config:function(){//配置  radio-switch-select 回调参数
            Tools.select.config.wls_ap_mode_sel={};
            Tools.select.config.wls_ap_mode_sel.oEvent=function(mode){
                if(mode==0){
                    $("#wifiSetPSW").hide();
					$("#wireless_key_val").val("");
                }else{
                    $("#wifiSetPSW").show();
                }
                wireless_security_ap_change(mode,"2_4");
            };
            Tools.radio.config.switch.wireless_enable={};
            Tools.radio.config.switch.wireless_enable.oEvent=function(mode){
                Tools.form._disabled(mode,"#wireless_enable,#same_enable");
            };
        },
        init: function () {
            var me = this;
            me.wifi_radio_select_config();
            me.wifiCompatible_func();
        }
    }
})();
// ===============      wifi time set 覆盖模块    ==========
(function () {
    var des_cgi_getAndSet="/app/new_ap_timer/webs/ap_timer.cgi";
    var time_day_getClassFlag = "+";
    var time_day_setClassFlag = " ";
    var minSetVal = 1 ;
    app_compatible.wifi_time_set = {
        initConfigData:null,
        _getData:function(){
            var me = this;
            var obj2 = {};
			obj2.action="get";
            $.post(des_cgi_getAndSet, obj2, function (data) {
                var data2 = dataDeal(data);
                var timeUniform = Tools.time.uniform_time_style;
                data2.timer_enable=="1"&&(timeUniform(data2,"start_hour"),timeUniform(data2,"start_minute"),timeUniform(data2,"end_hour"),timeUniform(data2,"end_minute"));
                me.setTimeData(data2);
            });
        },
        languageInit: function () {
            var timeObj = $("#time_segment_ctr");
            var TimeHtml = common_M_html.time_group;
            timeObj.html("");
            var complied = _.template(timeTemp);
            timeObj.html(complied(TimeHtml));
        },
        setTimeData:function(data){
           var setData =  {
                timer_enable:0,
                timer_day:"",
                start_hour:"00",
                start_minute:"00",
                end_hour:"23",
                end_minute:"59"
            }; //---------- debug data ----------
            $.extend(true,setData,data);

            Tools.radio.set("g_time_A",setData.timer_enable);
            var inputObj= $("#time_segment_ctr ul :checkbox");
            if(!setData.timer_day == ""){
                var dayStr =setData.timer_day.split(time_day_getClassFlag);
                inputObj.prop("checked",false);
                $.each(dayStr,function(i,value){
                    inputObj.eq(value*1-1).prop("checked",true);
                });
                $("#g_start_hour").val(setData.start_hour);
                $("#g_start_min").val(setData.start_minute);
                $("#g_end_hour").val(setData.end_hour);
                $("#g_end_min").val(setData.end_minute);
            }
        },
        check_time_segment:function() {
            var me = this ;
            var data = {
                timer_enable:0,
                timer_day:"",
                start_hour:"",
                start_minute:"",
                end_hour:"",
                end_minute:"",
                action:"set"
            };
            var timer_enble=$("#g_time_hidden").val();
            var hour_s = $("#g_start_hour");
            var min_s = $("#g_start_min");
            var hour_e = $("#g_end_hour");
            var min_e = $("#g_end_min");
            if(timer_enble==="0"){
                $.extend(true,me.initConfigData,data);
                return true;
            }else{
                var inputObj= $("#time_segment_ctr ul :checkbox:checked");
                var dayTimerStr = [];
                if(!inputObj.length) {
                    show_message("check_week_at_least");
                    return false;
                }
                if(!timeSlot.check(hour_s.val(),min_s.val(),hour_e.val(),min_e.val())){
                    return false;
                }
                $.each(inputObj,function(i,obj){
                   dayTimerStr.push(obj.value);
                });
                data.timer_enable=timer_enble;
                data.timer_day = dayTimerStr.join(time_day_setClassFlag);
            }
            data.start_hour=hour_s.val();
            data.start_minute=min_s.val();
            data.end_hour=hour_e.val();
            data.end_minute=min_e.val();
            $.extend(true,me.initConfigData,data);
            return true;
        },
        submit_wifi_time_setting:function(){
            var me = this;
            if(!me.check_time_segment()) return;
            show_message("setup_ing");
            $.post(des_cgi_getAndSet, me.initConfigData, function (dataV) {
                var data = dataDeal(dataV);
                var   timer = WIFI_NORMAL_SET_TIME * 1000;
                if (data == "SUCCESS") {
                    window.setTimeout(function () {
                        app_compatible.wifi_set.show_link_down_tip();
                        show_message("success");
                    }, 2000);
                }
                else {
                    show_message("error", igd.make_err_msg(data));
                }
            });
        },
        init: function () {
            this.languageInit();
            this._getData("2_4");
            this.initConfigData={};
            !!igd.global_param.is_5G&&(minSetVal=5);
        }
    }
})();
//================= system_time =============
(function () {
    app_compatible.system_time = {
        setRadioConfig:function(){
            Tools.radio.config.switch.get_time_mode={off:"1",on:"0"};
            Tools.radio.config.switch.get_time_mode.oEvent=function(mode){
                var type =!(mode>>>0);
                var colorStyle=["#808080","#333"];
                Tools.time.createSettingSection.timeDisabled= type;
                $(".item_time_group").find(":input,span").css("color",colorStyle[mode]);
                if(type){Tools.radio.set("get_timezone_mode", "0");}
                else{Tools.radio.set("get_timezone_mode", "1");}
            };
            Tools.radio.config.switch.get_timezone_mode={};
            Tools.radio.config.switch.get_timezone_mode.oEvent=function(mode){
                var type =!!(mode>>>0);
                var colorStyle=["#333","#808080"];
                Tools.select.select_disabled=type;
                $("#timezone_sel_txt").css("color",colorStyle[mode]);
             };
        },
        init: function () {
            this.setRadioConfig();
            Tools.radio.set("get_timezone_mode", "1");
        }
    }
})();
//=======
(function () {
    app_compatible.wan_pppoe = {};
    var init_wan_setup_mobile = function (index, isMobile) {
        $("#common_uiname").val("WAN1");
        var uiname = $("#common_uiname").val();
        $.post("/router/wan_config_show.cgi", {uiname: uiname,b64:(new Date()).getTime()}, function (data) {
            var res = dataDeal(data);
            wan_setup_data = res;
            if (res && res.COMMON && res.COMMON.connect_type && res.PPPOE) {
                wan_setup_data.PPPOE.pass = getDAesString(wan_setup_data.PPPOE.pass);
            }
            //接口设置
            conf_speed_value = "";
            set_wan_link_work_mode(index, isMobile);
        });
    };
    var form_radio_sele_set = function (form_name, radio_name, hide_name_value) {
        radio_sele_set(radio_name, hide_name_value);
    };
    var expertExpandToggleFn = function (formName) {
        var form = $("form[name=" + formName + "]"),expertDt=form.find("dt.expert"), expertTitle = form.find("span.title"), expertSection = $("." + formName + "_expert");
        form.undelegate("dt.expert").delegate("dt.expert", "click", function (e) {
            e.preventDefault();
            expertTitle.stop();
            expertSection.stop();
            var expertBtnTxtList=MobileHtml[current_html].js.expertBtnTxtList;
            expertTitle.fadeOut("fast",function(){
                expertDt.toggleClass("expand");
                expertSection.slideToggle();
                $(this).html(expertDt.hasClass("expand")? expertBtnTxtList[1] :expertBtnTxtList[0]).fadeIn("fast");
            })

        })
    };
    app_compatible.wan_pppoe = {
        init: function () {
            expertExpandToggleFn("wan_pppoe_form");
            window.submit_wan_config_pppoe = function () {
                $.validity.clear();
                submit_wan_config.apply(this, [0,Tools.form.subCurrentHtml_init_formData]);
            };
            window.init_pppoe_setup = function () {
                init_wan_setup_mobile(1, true);
            };
            window.init_wan_setup_mobile = init_wan_setup_mobile;
            window.form_radio_sele_set = form_radio_sele_set;

        }
    };
    app_compatible.wan_dhcp = {
        init: function () {
            expertExpandToggleFn("wan_dhcp_form");
            window.submit_wan_config_dhcp = function () {
                $.validity.clear();
                submit_wan_config.apply(this, [1,Tools.form.subCurrentHtml_init_formData]);
            };
            window.init_dhcp_setup = function () {
                init_wan_setup_mobile(2, true);
            };
            window.init_wan_setup_mobile = init_wan_setup_mobile;
            window.form_radio_sele_set = form_radio_sele_set;
        }
    };
    app_compatible.wan_static = {
        init: function () {
            expertExpandToggleFn("wan_static_form");
            window.submit_wan_config_static = function () {
                $.validity.clear();
                submit_wan_config.apply(this, [2,Tools.form.subCurrentHtml_init_formData]);
            };
            window.init_static_setup = function () {
                init_wan_setup_mobile(3, true);
            };
            window.init_wan_setup_mobile = init_wan_setup_mobile;
            window.form_radio_sele_set = form_radio_sele_set;
        }
    }
})();
//========== auto_update =================
(function () {
    app_compatible.auto_update = {
        try_time: 40,//1s刷新一次，最多40次。也就是40s略大于一次冷却时间
        try_couter: 0,
        auto_update_timer: null,//检测开始阶段的计时器
        download_timer: null,
        me: null,
        init_auto_update: function () {
            $.post('/router/version_check.cgi', {op: "check"}, function (data) {
				//1s显示检测动画
                var loading_sence_timer = null;
                if (loading_sence_timer)
                    window.clearTimeout(loading_sence_timer);
                window.setTimeout(function () {
                    me.check_auto_update_info();
                    me.check_auto_update_loop();
                }, 1000);
            });
        },
        check_auto_update_info: function () {
            $.post('/router/version_check.cgi', {op: "dump"}, function (data) {
                data = dataDeal(data);
                me.try_couter++;
                var s = data.status;
                if (s == "12") {//无需升级
                    window.clearInterval(me.auto_update_timer);
                    $("#auto_update_wait").fadeOut("fast", function () {
                        $("#version_info_layer").css("display", "table");
                    });
                    $("#cur_version_layer").html(data.cur_version);
                    $("#status_info").html(igd.update_info[data.status].info);
                }
                else {
                    if (data.new_version != "") {//检查到新版本
                        window.clearInterval(me.auto_update_timer);
                        $("#auto_update_wait").fadeOut("fast", function () {
                            $("#log_layer").show();
                            me.paint_log_list(data);
                        });
                    }
                }
            });
        },
        check_auto_update_loop: function () {
            if (me.auto_update_timer)
                window.clearInterval(me.auto_update_timer);
            me.auto_update_timer = window.setInterval(function () {
                if (current_html == "auto_update") {
                    if (me.try_couter >= me.try_time) {//超时
                        window.clearInterval(me.auto_update_timer);
                        $("#auto_update_wait").fadeOut("fast", function () {
                            $("#version_info_layer").css("display", "table");
                        });
                        $("#status_info").html(igd.update_info["10"].info);
                    }
                    else
                        me.check_auto_update_info();
                }
                else {//离开升级页面
                    window.clearInterval(me.auto_update_timer);
                }
            }, 1000);
        },
        paint_log_list: function (data) {
            $("#log_cnt").html("");
            var statement = utf8to16(base64decode(data["statement"]));
            var log_cnt = statement.split("\r\n");
            if (log_cnt.length != 0) {
                var $ul = $("<ul/>");
                for (var i in log_cnt) {
                    var $li = $("<li/>");
                    $li.html(log_cnt[i]);
                    $ul.append($li);
                }
                $("#log_cnt").html($ul);
            }
            $("#new_version_layer").html(MobileJsHtml[current_html].newVersion + data.new_version);
        },
        bind_log_event: function () {
            $(".btn_cancel").unbind("click").bind("click",function(){
                $.post('/router/version_check.cgi', {op: "skip"}, function (data) {
                    data = dataDeal(data);
                    if (data == "SUCCESS") {
                        mobile_host_control.app.returnBackCallBackFns[2]();
                        mobile_host_control.app.returnBackCallBackFns.pop();
                    }
                });
            });
            $(".btn_confirm").unbind("click").bind("click",function(){
                $.post('/router/version_check.cgi', {op: "update"}, function (data) {
                    data = dataDeal(data);
                    if (data == "SUCCESS") {
                        me.download_file();
                        me.download_file_loop();
                    }
                });
            });
        },
        download_file: function () {
            $("#log_layer").hide();
			$("#auto_update_div").addClass("section_hide");
            $("#reset_div_wrapper").removeClass("section_hide");
            $.post('/router/version_check.cgi', {op: "dump"}, function (data) {
                data = dataDeal(data);
				
				var s = data.status;
				var step = data.step;
			if(step == "0"){
				$("#span_reset_tip").html(MobileJsHtml[current_html].download_error);
				$("#retry_btn_layer").removeClass("section_hide");
				$(".btn_retry").unbind("click").bind("click",function(){
					$.post('/router/version_check.cgi',{op:"check"},function(data){});
				});
			}
			else if(step == "2"){
				$("#span_reset_tip").html(MobileJsHtml[current_html].download_error);
				$("#retry_btn_layer").removeClass("section_hide");
				$(".btn_retry").unbind("click").bind("click",function(){
					$.post('/router/version_check.cgi',{op:"update"},function(data){});
				});
			}
			else if(step == "3"){
				$("#span_reset_tip").html(MobileJsHtml[current_html].downloadFile);
				$("#retry_btn_layer").addClass("section_hide");
				var cur_size = parseInt(data.cur_size,10);
				var total_size = parseInt(data.total_size,10);
				if(total_size == 0){//0%
					$("#time").html("0%");
				}
				else{
					var percent = ((cur_size/total_size) * 100).toFixed(1);
					$("#time").html(percent + "%");
				}
			}
			else if(step == "4"){
				$("#span_reset_tip").html(MobileJsHtml[current_html].verfy_file);
			}
			else if(step == "5"){
				$("#span_reset_tip").html(MobileJsHtml[current_html].start_update);
			}
			else if(step == "6"){
				me.reboot();
				window.clearInterval(me.download_timer);
			}
            });
        },
        download_file_loop: function () {
            if (me.download_timer)
                window.clearInterval(me.download_timer);
            me.download_timer = window.setInterval(function () {
                if (current_html == "auto_update") {
                    me.download_file();
                }
                else {
                    window.clearInterval(me.download_timer);
                }
            }, 1000);
        },
        reboot: function () {
			 if (me.download_timer)
                window.clearInterval(me.download_timer);
			$("#auto_update_div").addClass("section_hide");
			$("#retry_btn_layer").addClass("section_hide");
            $("#span_reset_tip").html(MobileJsHtml[current_html].rebootRouter);
            $("#time").html(ROUTE_INFO.updateTime);
            var old_soft_restart = soft_restart;
			window.soft_restart = function(){
				old_soft_restart.call(this,"update",true);
			}();
        },
        init: function () {
            me = this;
            me.bind_log_event();
			$(".appSave").hide();
            window.init_auto_update = me.init_auto_update;
        }
    }
})();
//========================================

//=============manual_update==============
(function () {
    app_compatible.manual_update = {
        init: function () {
			var old_soft_restart = soft_restart;
			window.soft_restart = function(){
				old_soft_restart.call(this,"update",true);
			};
        }
    };
})();
//========================================
//===============misc reboot===============
(function () {
    app_compatible.misc_reboot = {
        init_btn_event: function () {
            $(".red_btn").unbind("click").bind("click",function(){
                soft_reboot();
            });
        },
        init: function () {
            $(".appSave").hide();
            this.init_btn_event();
			
			var old_soft_restart = soft_restart;
            window.soft_restart = function(){
                old_soft_restart.call(this,"reboot",true);
            };
        }
    };
})();
//========================================

//===============rally default============
(function () {
    app_compatible.rally_default = {
        init_btn_event: function () {
            $(".red_btn").unbind("click").bind("click",function(){
                RstoreDefault();
            });
        },
        init: function () {
            $(".appSave").hide();
            this.init_btn_event();
			
			var old_soft_restart = soft_restart;
            window.soft_restart = function(){
                old_soft_restart.call(this,"reboot",true,function(){

                });
            };
        }
    };
})();
//========================================

//==============router info===============
(function () {
    app_compatible.router_info = {
        init: function () {
            $(".appSave").hide();
        }
    };
})();
//================ lan setup ========================
(function(){
    app_compatible.lan_setup={
        init:function(){
            var oldSubmit = lan_setup_submit;
            window.lan_setup_submit=function(){
                oldSubmit(function(){
                    app_compatible.show_cut_net_tip();
                });
            };
        }
    }
})();

//================ file share  ==================
(function(){
    app_compatible.samba_dlna={
        _set:function(){
            var _type = current_html;
            var set_is_enable = $("input[name='is_enable']:hidden").val();
            show_message("save");
            $.post("/app/"+_type+"/webs/"+_type+".cgi",{action:"set",is_enable:set_is_enable},function(data){
                var response = dataDeal(data);
                if (response == "SUCCESS") {
                    show_message("success", appCommonJS.controlMessage.c_suc);
                }
                else {
                    show_message("error", igd.make_err_msg(data));
                }
            });
        }
    };
    window.samba_dlna_init = function(){
        var _type = current_html;
        $.post("/app/"+_type+"/webs/"+_type+".cgi","action=get",function(data){
            var res = dataDeal(data);
            Tools.radio.set(_type+"_status",res.is_enable);
        });
    };
})();


//================ disk sleep  ==================
(function(){
    app_compatible.disk_sleep={
        _set:function(){
            show_message("save");
            $.post("/router/system_application_config.cgi",{action:"set_sleep_time",sleep_time:$("#disk_sleep_time_sel").val()},function(data){
                var response = dataDeal(data);
                if (response.result == "0") {
                    show_message("success", appCommonJS.controlMessage.c_suc);
                }
                else {
                    show_message("error");
                }
            });
        }
    };
    window.disk_sleep_init = function(){
       mobile_host_control.language_init({path:language_M[language_type]["SELECT"]["disk_sleep_time_sel"],idClass:"disk_sleep_time_option",type:"select"});
	   $.post('/router/system_application_config.cgi', 'action=get_sleep_info', function (data) {
			data = dataDeal(data);
			Tools.select.set(data.sleep_time,"disk_sleep_time_sel");
		});
    };
})();


//============== developer_mode  ==============

(function(){
   app_compatible.developer_mode = {
      init : function(){
          Tools.radio.config.switch.boa_deny_switch= {};
          Tools.radio.config.switch.boa_deny_switch.oEvent= deny_switch_set;
      }
   } ;
})();
//==========================
app_compatible.init = function () {
    if (this[current_html] && typeof this[current_html].init == "function") {
        this[current_html].init();
    }
};

//==========================