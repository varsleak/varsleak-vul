/********************************首页相关********************************************************/
var ROUTE_INFO = {}; //路由器信息

ROUTE_INFO.g_lan_number;
ROUTE_INFO.g_wan_number;
ROUTE_INFO.g_lan_position;
ROUTE_INFO.g_wan_position;
ROUTE_INFO.g_port;
ROUTE_INFO.is_5G;
ROUTE_INFO.is_touch_link;
ROUTE_INFO.updateTime;
ROUTE_INFO.rebootTime;
ROUTE_INFO.language_type = "CN";
ROUTE_INFO.need_wireless_pwd = true;
ROUTE_INFO.SSID_TITLE;
ROUTE_INFO.is_store_manage;

ROUTE_INFO.pre_status = ""; //用于首页状态显示
ROUTE_INFO.waiting = false; //等待设置
ROUTE_INFO.lan_ip = "";
ROUTE_INFO.lan_mask = "";
ROUTE_INFO.wan_ip = "";
ROUTE_INFO.wan_ip_type = "";
PAGE_INFO = {};//页面信息
PAGE_INFO.menu_parent = null;
PAGE_INFO.current_html = "";
PAGE_INFO.tab_page_name = "";
//PAGE_INFO.oldUrlToken = "";
$(document).ready(function () {
    window.onbeforeunload = null;
    language_type = igd.global_param.language_type;
    SSID_TITLE = language[language_type]["HTML"]["wireless_base_5"];
    L = language[language_type]["JS"];
    document.title = language[language_type]["TITLE"];
    ROUTE_INFO.g_port = igd.global_param.default_port;
    ROUTE_INFO.lan_ip = igd.global_param.default_ip;
    ROUTE_INFO.lan_mask = igd.global_param.default_lan_mask;
    ROUTE_INFO.g_lan_number = igd.global_param.lan_number;
    ROUTE_INFO.g_wan_number = igd.global_param.wan_number;
    ROUTE_INFO.g_lan_position = igd.global_param.lan_position;
    ROUTE_INFO.g_wan_position = igd.global_param.wan_position;
    ROUTE_INFO.is_5G = igd.global_param.is_5G;
    ROUTE_INFO.is_store_manage = igd.global_param.is_store_manage;
	ROUTE_INFO.is_touch_link = igd.global_param.is_touch_link;
    ROUTE_INFO.updateTime = igd.global_param.update_time;
    ROUTE_INFO.rebootTime = igd.global_param.reboot_time;
    ROUTE_INFO.need_wireless_pwd = igd.global_param.need_wireless_pwd;

    if (jQuery.browser.msie && jQuery.browser.version == "6.0") {
        document.execCommand("BackgroundImageCache", false, true);
    }
    $.ajaxSetup({
        cache: false //关闭AJAX相应的缓存
    });
    $("body").mousedown(function (event) {
        hide_msgbox();
    });
	//init_user_type();
	init_page();
});

function init_user_type() {
    $.ajax({
        type: "post",
        url: "/router/get_user_type.cgi",
        data: {noneed: "noneed"},
        dataType: "json",
        error: function (XMLHttpRequest, textStatus) {
            if ($.trim(textStatus) == "timeout") {
                loginOut();
            }
        },
        success: function (ret) {
            if ($.trim(ret) == "") {
                loginOut();
                return;
            }
            var ret = dataDeal(ret);
            init_page();
        }
    });
}

function init_page() {
    user_fov_info.uaInfo();
	//悬浮工具条
	toolTipsBar.init();
	init_menu();
    init_language("common");
	get_lan_ip();
	new_version_notice();
	get_wan_ip().then(function(){
        detectStateChange();
    },function(){
        //error
		detectStateChange();
    });
    if(!ROUTE_INFO.is_store_manage){
        $("#store_manage").remove();
		for(var i in igd.app_list.nav_addon[1].list){
			if(igd.app_list.nav_addon[1].list[i].appsign == "dlna" || igd.app_list.nav_addon[1].list[i].appsign == "samba")
				igd.app_list.nav_addon[1].list[i] = {};
		}
    }
}

var from_index = false;
function check_new_version(){
	$.post("/router/version_check.cgi",{op:"dump",from:"index"},function(data){
		var ret = dataDeal(data);
		if(ret.new_version != "" &&  ret.new_version != undefined){
			var statement = "";
			if(ret["statement"] != "" &&  ret["statement"] != undefined)
				statement = utf8to16(base64decode(ret["statement"]));
			var log_cnt = statement.split("\r\n");
			 var newVersionTxt = function(data){
					var versionTxt = data,i;
					var _$ul = $("<ul class='updateTxt'></ul>"),_$warp=$("<div class=\"updateContentWrap\"></div>"),_$line=$("<div class=\"line\"></div>");
					for(i=0;i< versionTxt.length;i++){
						$("<li/>").html(versionTxt[i]).appendTo(_$ul);
					}
					_$line.appendTo(_$warp);
					_$ul.appendTo(_$warp);
					return _$warp;
				},ulStr;
	
				ulStr = newVersionTxt(log_cnt);
				show_dialog("<div class=\"update_msg\">"+ L.check_new_version +ret.new_version+ L.update_new_version +"</div>"+ulStr[0].outerHTML, function (data) {
						$.post("/router/version_check.cgi",{op:"update"},function(data){
							load_sub_html("update",'init_update',"nav_setting");
							from_index = true;
						});
				},null,"update");
		}
		
	});
}

function new_version_notice(){
	$.post("/router/version_check.cgi",{op:"check",from:"index"},function(data){});
	$("#NoticelogContent").html("");
	$("#log_notice_confirm_btn,#notice_close").unbind("click").bind("click",function(){
		 $("#update_log_layer").hide();
         hide_lock_div();
		 check_new_version();
	});
	$.post("/router/update_notice.cgi",{noneed:"noneed"},function(data){
		//data = '{"flag":"0","now_version":"0.15.02.12","new_version":"0.15.02111.12","update_flag":"1","status":"1","statement":"1.\\u6d4b\\u8bd5\\u81ea\\u52a8\\u5347\\u7ea7C403\\r\\n2.\\u518d\\u6b21\\u6d4b\\u8bd5\\u6d4b\\u8bd5\\u9875\\u9762 \\r\\n3.\\u518d\\u6b21\\u518d\\u6b21\\u6d4b\\u5347\\u7ea7\\u4ee3\\u7801"}';
		var ret = dataDeal(data);
		if(ret.flag == "1" && ret.now_version != "" && ret.statement != ""){
			var statement = utf8to16(base64decode(ret["statement"]));
			var log_cnt = statement.split("\r\n");
			var $ul = $("<ul/>");
			$ul.attr("class","updateTxt");
			for(var i in log_cnt){
				var $li = $("<li/>");
				$li.html(log_cnt[i]);
				$ul.append($li);
			}
			$("#NoticelogContent").html($ul);
			$("#notice_version").html(ret.now_version);
			
			var _this = $("#update_log_layer");
			var left = (parseInt(document.documentElement.scrollWidth) - _this.width()) / 2 + "px";
			var top = document.documentElement.scrollTop + document.body.scrollTop + (document.documentElement.clientHeight - _this.height()) / 2 + "px";
			_this.css("left", left);
			_this.css("top", top);
			show_lock_div();
			_this.show();
		}
		else
			check_new_version();
	});
}

function loginOut() {
    $.post("/router/login_exit.cgi", {}, function (data) {
        $.cookie('Qihoo_360_login', null, {
            path: '/',
            expires: 1
        });
		show_message("login_out_wait");
        window.setTimeout(function () {
            var urlSkip= window.top.location.pathname.indexOf("mobile")>-1?"/login_mobile.htm":"/login_pc.htm";
            location.href = urlSkip;
        }, 1000);
    });
}


var close_i_wired_popwin = function (id,callBack) {
        var callFn = callBack || $.noop;
        hide_pop_layer(id,callFn);
        $("#i_wired_frm input[class*=txt]").removeClass().addClass("input-text");
        hide_msgbox();
    };
/* ===================================== by lwj  故障诊断 start ================================*/
(function(){

    var checking_status = false;
    var stopTimer = false;
    var current_user_wan_type = null ;
    var port_speed_state_status = false;
    var userDefault;
    var current_wiredStatus = null;//保存当前网络状态参数
    var reset_port_speed_state = function(){
        !!port_speed_state_status&&$.post("/router/port_config_setup.cgi",{port:"WAN1",speed_state:userDefault});
    };
    var repairDns = function(step,sucFn,failFn){
       var  me = hitchDiagnosis;
        me.linkStatusInfoShow(2,step);
        $.post("/router/wan_config_show.cgi",{uiname:"WAN1"},function(dataV){
            var data = dataDeal(dataV);
            var obj = me.getWanConfigSetData(data,"dns");
            $.post("/router/wan_config_set.cgi",obj,function(data){
                var response = dataDeal(data);
                if(response == "SUCCESS"){
                    me.setTimeOutId(function(){sucFn.call(me);},null,null,3000);
                }
                else
                    failFn.call(me);
            });
        });
    };

    var check_step_currentHtml = [];

    var stop_line_status_check=null;

    var hitchDiagnosis = {
        type:null,
        step:null,
        resetData:null,//默认配置参数
        repairState:null,//默认配置参数  false -> 数据已被修改且修复失败  true ->修复成功
        dnsUpdate:null,//是否修改dns
        wanInfoData:null,
        node:null,
        timeOutId:null,
        deviceContent:null,
        initStep:["link_status_check","connect_type_check","wan_info_check","dns_info_check","web_net_check"],
        re_wan_data:function(){
            var me =this;
            var re_date = function(){
                var obj = me.getWanConfigSetData(me.resetData,null,null,true);
                $.post("/router/wan_config_set.cgi",obj);
            };
            typeof me.repairState=="boolean"&&!me.repairState&&!!me.resetData&&re_date();
        },
        resetCSS:function(type){
            //type = 0 重置整个故障诊断的css; type = 2 重置按钮 type = 1 异常的css
            var me =this;
            var node = this.node;
            switch (type){
                case 0:$(".hd-check-status").removeClass("hd-checking hd-repair hd-error hd-suc").html(L.hitchDiagnosis_txt.watting_check);me.linkStatusInfoShow(0,0);node.checkSection.show();
                case 1:node.abnormal.hide();node.abnormal.find(">li").hide();
                case 2:node.btn.find("input:button").hide();
                default :!!me.timeOutId&&(clearTimeout(me.timeOutId),stopTimer=true);node.footer.removeClass("hdfooterSuccess");$("#hd-server-info").hide();$("#internet-server-tip").removeClass("selectModelUpper selectModelDown").addClass("selectModelDown");$("#dnsUpdateSection").hide();
            }
        },
        setTimeOutId:function(type,step,abnormalStr,time){
            var me =this;
            var timer = time || 1000;
            var abnormal = abnormalStr || false;
            var callFn;
            var stopDirect = !stopTimer&&$.inArray(me.initStep[me.step],check_step_currentHtml)>-1;
            if(typeof type == "function"){
                callFn = type;
            }else{
                callFn = function(){
                    me.linkStatusInfoShow(type,step,abnormal);
                };
            }
            stopDirect&&(me.timeOutId = setTimeout(function(){
                stopDirect&&callFn();
            },timer));
        },
        getWanConfigSetData:function(data,type,value,pppoePassFlag){
            var common = data.COMMON;
            var _pppoe = data.PPPOE;
            var _static = data.STATIC;
            var _dhcp = data.DHCP;
            var connectType = 0;
            var obj={
                isp:common.isp,
                uiname:common.uiname,
                work_mode:common.work_mode,
                mac:common.mac_current
            };
            if (!common)
                connectType = 1;
            else
                connectType = get_connect_type(common.connect_type);
            if(connectType == 1){
                obj.connect_type = "PPPOE";
                obj.mtu = common.mtu;
                obj.pppoe_conf = "AUTO";
                obj.user = _pppoe.user;
                obj.pass = getAesString(!!pppoePassFlag?_pppoe.pass:getDAesString(_pppoe.pass));
                obj.dns1=_pppoe.dns[0]=="0.0.0.0"?"":_pppoe.dns[0];
                obj.dns2=_pppoe.dns[1]=="0.0.0.0"?"":_pppoe.dns[1];
                obj.server_name=_pppoe.server_name;
                obj.ac_name=_pppoe.ac_name;
            }
            else if(connectType==2){
                obj.connect_type = "DHCP";
                obj.mtu = common.mtu;
                obj.dns1=_dhcp.dns[0]=="0.0.0.0"?"":_dhcp.dns[0];
                obj.dns2=_dhcp.dns[1]=="0.0.0.0"?"":_dhcp.dns[1];
            }
            else{
                obj.connect_type = "STATIC";
                obj.mtu = common.mtu;
                obj.dns1 = handle_ip(_static.dns[0]);
                obj.dns2 =handle_ip(_static.dns[1]);
                obj.gw = handle_ip(_static.gw);
                obj.ip = handle_ip(_static.ip);
                obj.mask = handle_ip(_static.mask);
            }
            switch (type){
                case "mtu":obj.mtu=1400;break;
                case "macClone":
                    obj.mac = value || (common["mac_current"] == common["mac_clone"] ? common["mac_default"] : common["mac_clone"]);
                    break;
                case "dns":obj.dns1="123.125.81.6";obj.dns2="101.226.4.6";break;
            }
            return obj;
        },
        getInterface_status_ip_info:function(sucFn,desNo,step,fail){
            var me = this;
            $.post("/router/interface_status_show.cgi", {noneed: "noneed"}, function (dataV) {
                var data = dataDeal(dataV);
                var desStatus;
                if (data) {
                    var wiredStatusObj = getWiredStatusObjByData(data,$.noop,$.noop),_status = wiredStatusObj.status>>0;
                    current_wiredStatus = wiredStatusObj;
                    if(_status===1){/*只有当wan口未连线时，才判断wisp的断网逻辑*/
                        if(wiredStatusObj.wisp.enable){/*判断wisp是否连接成功*/
                            _status = wiredStatusObj.wisp.status>>0;statusCallBack();
                        }else{
                            $.post('/app/igd_wisp/wireless_sta_mode.cgi', "action=get", function(data){
                                var wispData = dataDeal(data);
                                wiredStatusObj.wisp.enable = !!(wispData.enable>>0);
                                wiredStatusObj.wisp.status = wispData["internet"]<0&&1;/* 1 -> 说明wisp未连接/连接失败 */
                                current_wiredStatus = wiredStatusObj;
                                _status = wiredStatusObj.wisp.status>>0;statusCallBack();
                            });
                        }
                    }
                    else{
                        statusCallBack();
                    }
                }
                function statusCallBack(){
                    desStatus = $.inArray(_status,desNo);
                    desStatus>-1?sucFn.call(me,[wiredStatusObj]):(!!fail?fail.call(me,[wiredStatusObj]):me.setTimeOutId(3,step));
                }
            });
        },
        linkStatusInfoShow:function(type,step,abnormal,connectTypeError,internetServerTip){
            // type%4 -> 0/1/2/3/ 对应 检测，异常，修复，成功 4 个状态
            // step -> 0 ~ 4 检测的步骤
            // abnormal 异常错误的类型
            //connectTypeError 上网方式异常时，当前用户的上网方式
            //internetServerTip 运营商相关的错误类型提示
            /*var isWispMode = current_wiredStatus &&current_wiredStatus.status==1&& current_wiredStatus.wisp.enable?".wispModeHit":"";*/
            var me=this;
            var node =me.node;
            var logoClass = ["check-hd-diagnose","check-hd-fault","check-hd-repair","check-hd-suc"];//img Class
            var stepClass= ["hd-checking","hd-error","hd-repair","hd-suc"];//img Class
            var stepObjNode = $(".hd-check-status").eq(step);
            var logoNode = $(".hitch-diagnosis-tip-logo");
            var titleTip  = $("#hitchDiagnosisTip");
            var conType = type%4;
            var initFns = me.initStep;
            me.type=type;
            me.step=step;
            if(!!stopTimer|| $.inArray(me.initStep[step],check_step_currentHtml)<0){me.step=0;return;}
            conType==2&&step!=0&&(me.repairState=false);
            stepObjNode.html("").removeClass("hd-checking hd-repair hd-error hd-suc").addClass(stepClass[conType]);
            if(conType==3&&step!=4){
                me[initFns[step+1]]();return;
            }
            logoNode.removeClass("check-hd-diagnose check-hd-repair check-hd-fault check-hd-suc").addClass(logoClass[conType]);
            if(type==5&&!!abnormal){
                me.resetCSS(1);
                node.checkSection.hide();
                node.abnormal.find("."+abnormal).show();
                node.abnormal.show();
                node.btn.find(".btn_re_diagnosis").show();
                titleTip.html(node.abnormalTitle[abnormal]);
                !!connectTypeError&&$(".connectTypeErrorTip").html(connectTypeError);
                var internetTips = L.server_internet.tip[internetServerTip] || "";
                $("#sever-info-fault-tip").html(internetTips);
                me.re_wan_data();
                reset_port_speed_state();
            }
            else{
                (type==1&&!!abnormal)?titleTip.html(node.checkTitle[abnormal]):titleTip.html(node.checkTitle.common[type]);
            }
            if(conType==3&&step==4){
                node.footer.addClass("hdfooterSuccess");
                node.btn.find(".btn_shutDown").show();
                me.dnsUpdate&&$("#dnsUpdateSection").show();
                me.repairState=true;
            }
        },
        link_status_check:function(){//连线诊断
            var me=this;
            var stop = false;
            var stop_my_check = function(){
                stop = true;
            };
            var abnormalLineLink = function(errorType){
                me.linkStatusInfoShow(5,0,errorType||"lineLink");
            };
            var checkStatus=function(fail,type,timer){
                !stop&&me.linkStatusInfoShow(type,0);
                me.setTimeOutId(function(){
                    me.getInterface_status_ip_info(fail,[1],0);
                },null,null,timer);
            };
            var repairLine = function(){
                !stop&&me.linkStatusInfoShow(2,0);
                var n= 0;
                var setSpeed = ["100f","100h","10f","10h"];
                var speedLen = setSpeed.length-1;
                var getUserDefaultConf = function(){
                    $.post("/router/wanport_real_show.cgi",{noneed:"noneed"},function(data){
                        var response = dataDeal(data);
                        $.each(response,function(i,n){
                            if( n.name=="WAN"){
                                userDefault=n.conf_speed_state;
                                !stop&&set_speed_state();
                                return false;
                            }
                        });
                    });
                };
                var set_speed_state = function (setData){
                    var calleeFn = arguments.callee;
                    $.post("/router/port_config_setup.cgi",{port:"WAN1",speed_state:setData||setSpeed[n]},function(data){
                        var response = dataDeal(data);
                        if(response=="SUCCESS"){
                            port_speed_state_status = true;
                            var flag = n<speedLen;
                            var _repair = function(){
                                checkStatus(flag?function(){
                                    n++;calleeFn.apply();
                                }:function(){abnormalLineLink();},flag?2:4,5000);
                            };
                            !setData&&!stop&&_repair();
                        }else{
                            abnormalLineLink();
                        }
                    });
                };
                getUserDefaultConf();
            };
            check_step_currentHtml.push("link_status_check");
            checkStatus(function(){
                if(current_wiredStatus.wisp.enable&&current_wiredStatus.wisp.status==1){
                    /*wisp 未连接，不做修复，直接提示。*/
                    abnormalLineLink("wisp-link-down");return;
                }
                me.linkStatusInfoShow(1,0);
                me.setTimeOutId(function(){repairLine();});
            },0);
            return stop_my_check;
        },
        connect_type_check:function(){//上网方式诊断
            var me = this;
            var connectTypeSet;
            var repairData = {};
            var abnormalConnectType = function(){
                me.linkStatusInfoShow(5,1,"connectTypeError",me.node.wanType[connectTypeSet]);
            };
            var getRepairData = function(data){
                repairData.connect_type="DHCP";
                repairData.isp=data.isp;
                repairData.mtu=data.mtu;
                repairData.uiname=data.uiname;
                repairData.work_mode=data.work_mode;
                repairData.mac=data.mac_current;
            };
            var check_status_isOk=function(failFn,type,timer){
                var detect_wan = function(){
                    var deferred = $.Deferred();
                    $.post("/router/get_wan_type.cgi",{uiname:"WAN1"},function(dataV){
                        //{“wan_type”: “0/1/2/3”} : WAN口类型，0:未知， 1:DHCP  2:PPPOE 3: DHCP+PPPOE
                        var wanTypeStr = ["DHCP","DHCP","PPPOE","DHCP,PPPOE"];
                        var data = dataDeal(dataV);
                        var connectType = wanTypeStr[data.wan_type];
                        deferred.resolve({connectType:connectType,connectNo:data.wan_type});
                    });
                    return deferred.promise();
                };
                var wan_config_show = function() {
                    var deferred = $.Deferred();
                    $.post("/router/wan_config_show.cgi",{uiname: "WAN1"},function (dataV) {
                        var data = dataDeal(dataV);
                        !me.resetData&&(me.resetData = data);
                        !!data.PPPOE.pass&&(me.resetData.PPPOE.pass=getDAesString(data.PPPOE.pass));
                        getRepairData(data.COMMON);
                        var common = data.COMMON;
                        var connectType = 0;
                        if (!common) connectType = "PPPOE";
                        else
                            connectType = common.connect_type.split("_").pop();
                        current_user_wan_type = connectType;
                        connectTypeSet=get_connect_type(connectType)*1-1;
                        deferred.resolve({connectType:connectType});
                    });
                    return deferred.promise();
                };
                me.linkStatusInfoShow(type,1);
                me.setTimeOutId(function(){
                    $.when(detect_wan(),wan_config_show()).then(function(wanConnectInfo,wanConfigInfo){
                        if(wanConfigInfo.connectType=="STATIC"||wanConnectInfo.connectType.indexOf(wanConfigInfo.connectType)>-1)
                            me.linkStatusInfoShow(3,1);
                        else{
                            var detectWan = wanConnectInfo.connectNo;
                            detectWan=="1"?failFn.call(me):abnormalConnectType();
                        }
                    });
                },null,null,timer);
            };
            var repairInternet = function(){
                me.linkStatusInfoShow(2,1);
                $.post("/router/wan_config_set.cgi",repairData,function(data){
                    var response = dataDeal(data);
                    if(response == "SUCCESS"){
                        check_status_isOk(abnormalConnectType,4,3000);
                    }else abnormalConnectType();
                });
            };
            check_step_currentHtml.push("connect_type_check");
            check_status_isOk(function(){
                me.linkStatusInfoShow(1,1);
                me.setTimeOutId(function(){repairInternet();});
            },0,0);
        },
        wan_info_check:function(){//WAN 口诊断
            var me =this;
            var abnormalContentType;
            var wanAbnormal=function(type,internetInfo){
                me.linkStatusInfoShow(5,2,type,null,internetInfo);
            };
            var wan_ip_Check=function(sucFn,type,failFn,timer){
                me.linkStatusInfoShow(type,2);
                me.setTimeOutId(function(){
                    me.getInterface_status_ip_info(sucFn,[0,3,4],2,failFn); //3  -> 有ip 不能上网  2 ->无 ip
                },null,null,timer);
            };
            var wan_internet_status_check=function(){
                // 1，调用wan口是否通的cgi ;2 ，不通,调用arp检测cgi,来判断是否wan口通，通就进行下一步。
                var get_wan_status = function(){
                    // 调用新的wan口是否通的cgi
                    var wanGw = current_wiredStatus.wan_gw;
                    $.post("/router/ping_check.cgi","pingIP="+wanGw,function(data){
                        var response = dataDeal(data);
                        response =="SUCCESS"?me.setTimeOutId(3,2):(current_wiredStatus.wisp.enable?wanAbnormal("wanNolink"):get_arp_status(wanGw));
                    });
                };
                var get_arp_status = function(ip){
                    //调用arp检测cgi,来判断是否wan口通
                    $.post("/router/arp_check.cgi","arpIP="+ip,function(data){
                        var response = dataDeal(data);
                        response =="SUCCESS"?me.setTimeOutId(3,2):wanAbnormal("wanNolink");
                    });
                };
                /*PPPOE 不进行网关检测
                * ！wisp 到检测wan口时，上网方式一定不为PPPOE
                * */
                current_user_wan_type=="PPPOE"?me.setTimeOutId(3,2):get_wan_status();
            };
            var getWanError = function(){
                $.post("/router/get_wan_errno.cgi",{uiname:"WAN1"},function(data){
                    var response = dataDeal(data);
                    switch (response.value){
                        case "2": wanAbnormal("pppoe-userInfo","pppoeUserInfo");break;//2 pppoe 账号密码错误
                        case "3": wanAbnormal("pppoe-server","pppoe");break;//3 PPPoE服务器没响应
                        case "4": wanAbnormal("wanIp-fault","connectTypeConfig");break;//4 DHCP服务器没响应
                        default : wanAbnormal("wanIp-fault");//其他
                    }
                });
            };
            var repairWan = function(){
                me.linkStatusInfoShow(2,2);
                var macClone_check_state = "macClone";
                var randomNum =function(begin,end){
                    var c = end - begin + 1;
                    return Math.floor(Math.random() * c + begin);
                };
                var isWifi_current_device = function(){
                    //判定当前设备是否为  有线 / 无线 设备
                    // 无线 -》1, getdeviceslist.cgi - > is_wifi =0 ( 有线 ) 2,是无线设备,查找有线设备列表,如果有有线设备,则返回 list 任意一个有线设备的mac，无有线设备列表，就返回 1 ;
                    // 有线-》 false ;
                        var data = me.deviceContent;
                        var wire = [];//有线设备列表
                        var tempData = data["data"];
                        var iP = data["user_ip"];
                        var status;
                        for(var i = 0,len = tempData.length;i < len;i++){
                            if(tempData[i].is_wifi==="0"){//有线
                                wire.push(tempData[i]);
                            }
                        }
                        var wireLen = wire.length;
                        if(wireLen>0){
                           for(var j = 0;j < wireLen;j++ ){
                               if(iP == wire[j]){
								   status = false;break;
                               }
                            }
                            if(status !== false){
                                var randNum = randomNum(0,wireLen-1);
                                status = wire[randNum].mac;
                            }
                        }else status = 1;
                        macClone(status);
                };
                var macClone = function(status){
                    var mac_status = status;
                    var reset_macClone_mtu=function(){
                        $.post("/router/wan_config_show.cgi",{uiname:"WAN1"},function(dataV){
                            var data = dataDeal(dataV);
                            var wan_mtu_mac_clone_set = function(){
                                var calleeFn = arguments.callee;
                                var obj =me.getWanConfigSetData(data,macClone_check_state,mac_status);
                                abnormalContentType=obj.connect_type;
                                $.post("/router/wan_config_set.cgi",obj,function(data){
                                    var reCheck = abnormalContentType=="PPPOE"&&macClone_check_state!= "mtu";
                                    var response = dataDeal(data);
                                    if(response == "SUCCESS"){
                                        wan_ip_Check(wan_internet_status_check,4,reCheck?function(){
                                            macClone_check_state= "mtu";
                                            calleeFn();
                                        }:getWanError,5000);
                                    }else wanAbnormal("mac-clone");
                                });
                            };
                            wan_mtu_mac_clone_set();
                        });
                    };
                    mac_status*1==1?wanAbnormal("mac-clone"):reset_macClone_mtu();
                };
                me.setTimeOutId(function(){isWifi_current_device();});
            };
            check_step_currentHtml.push("wan_info_check");
            wan_ip_Check(wan_internet_status_check,0,function(){
                if(current_wiredStatus.wisp.enable){
                    /*
                     wisp 时，没ip不进行修复 显示错误信息 ？
                     * */
                    wanAbnormal("wanIp-fault");
                    return;
                }
                me.linkStatusInfoShow(1,2,"wanIp");
                me.setTimeOutId(function(){repairWan();});
            });
        },
        dns_info_check:function(){//DNS 诊断
            var me =this;
            var dnsAbnormal = function(){
                me.linkStatusInfoShow(5,3,"dns",null,"dns");
            };
            var dnsCheck=function(failFn,type){
                me.linkStatusInfoShow(type,3);
                $.post("/router/dns_check.cgi",{noneed:"noneed"},function(data){
                    var response = dataDeal(data);
                    if(response["check_dns_res"]*1==0){
                        me.setTimeOutId(3,3);
                    }else{
                        me.setTimeOutId(function(){
                            failFn();
                        });
                    }
                });
            };
            check_step_currentHtml.push("dns_info_check");
            dnsCheck(function(){
                if(current_wiredStatus.wisp.enable){
                    /*wisp dns abnormal no repair */
                    console.log("wisp dns abnormal!");
                    dnsAbnormal();return;
                }
                me.linkStatusInfoShow(1,3,"dnsFault");
                me.setTimeOutId(function(){repairDns(3,function(){
                    dnsCheck(dnsAbnormal,4);me.dnsUpdate=true;
                },function(){
                    dnsAbnormal();
                });});
            },0);
        },
        web_net_check:function(){//WEB HTTP 诊断
            var me =this;
            var dnsAbnormal = function(){
                me.linkStatusInfoShow(5,4,"web-fault",null,"dns");
            };
            var wanCheck=function(failFn,type){
                me.linkStatusInfoShow(type,4);
                me.setTimeOutId(function(){
                    $.post("/router/detect_net.cgi",{noneed: "noneed", timeout: 10},function(data){
                        var response = dataDeal(data);
                        if(response["detect_res"] === "1"){
                            me.linkStatusInfoShow(3,4);}
                        else {
                            me.setTimeOutId(function(){
                                failFn();
                            });}
                    });
                });
            };
            check_step_currentHtml.push("web_net_check");
            wanCheck(function(){
                if(current_wiredStatus.wisp.enable){
                    /*wisp dns abnormal no repair */
                    console.log("wisp web http abnormal!");
                    dnsAbnormal();return;
                }
                me.linkStatusInfoShow(1,4,"webStatus");
                me.setTimeOutId(function(){repairDns(4,function(){
                    wanCheck(dnsAbnormal,4);me.dnsUpdate=true;
                },function(){
                    dnsAbnormal();
                });});
            },0);
        },
        init_server_internet_language:function(){
            var txt = L.server_internet;
            var node  = $("#hd-server-info");
            var create=function(txt,className){
                var htmlStr="<ul class='"+className+"'>";
                var len = txt.length;
                for(var i =0;i<len;i++){
                    htmlStr+="<li>"+txt[i]+"</li>";
                }
                htmlStr+="</ul>";
                $(htmlStr).appendTo(node);
            };
            $(".hd-check-status").removeClass().addClass("hd-check-status").html(L.hitchDiagnosis_txt.watting_check);
            node.html("");
            create(txt.left,"server-info-left");
            create(txt.right,"server-info-right");
        },
        addEventList:function(){
            var me= this;
            var node =me.node;
            var link_help=$(".link_help_show");
            var hitchDiagnosis=$(".hitch-diagnosis-check");
            var title=$("#link_help_tip");
            var pageToggle = function(HDType,resetType,btn){
                var showStatus=["hide","show"];
                var showTip = [L.link_help,L.hitch_diagnosis];
                var btnSelection = ["btn_callback","btn_re_diagnosis"];
                var relative=HDType;
                if(!!HDType) relative--;
                else relative++;
                hitchDiagnosis[showStatus[HDType]]();
                link_help[showStatus[relative]]();
                me.resetCSS(resetType);
                title.html(showTip[HDType]);
                if(!!btn) node.btn.find("."+btnSelection[HDType]).show();
            };
            var check_dns_temp_state = function(){
                var obj = !!me.resetData && me.getWanConfigSetData(me.resetData,null,null,true);
                var save_DNS_state = function(){
                    $.post("/router/set_360_tmp_dns.cgi",{"dns1":obj.dns1,dns2:obj.dns2});
                };
                !!obj && me.dnsUpdate && $("#isEnableTempDns").prop("checked") && save_DNS_state();
            };
            var close_hitch_diagnosis = function(){
                close_i_wired_popwin('link_help_pop',function(){
                    pageToggle(1,0);checking_status = false;check_step_currentHtml=[];stop_line_status_check();
                });check_dns_temp_state();me.re_wan_data();reset_port_speed_state();
            };
            node.abnormal.undelegate("#internet-server-tip","click").delegate("#internet-server-tip","click",function(){
                $("#hd-server-info").slideToggle("fast",function(){
                    $("#internet-server-tip").toggleClass("selectModelUpper selectModelDown");
                });
            });
            node.abnormal.undelegate("#link_help_introduce","click").delegate("#link_help_introduce","click",function(){
                pageToggle(0,2,true);
            });
            node.btn.undelegate(".btn_callback","click").delegate(".btn_callback","click",function(){
                pageToggle(1,2,true);
            });
            node.abnormal.undelegate(".hitch-diagnosisi-skipSet","click").delegate(".hitch-diagnosisi-skipSet","click",close_hitch_diagnosis);
            node.btn.undelegate(".btn_re_diagnosis","click").delegate(".btn_re_diagnosis","click",function(){
                me.node.checkSection.show();
                me.node.abnormal.hide();
                me.resetCSS(0);
                stopTimer=false;me.repairState=null;me.resetData=null;me.dnsUpdate=false;stop_line_status_check=me.link_status_check();
            });
            node.btn.undelegate(".btn_shutDown","click").delegate(".btn_shutDown","click",function(){
                hide_pop_layer("link_help_pop",function(){me.resetCSS(0);checking_status = false;});check_dns_temp_state();
            });
            $("#link_help_pop").undelegate("#link_help_shutDown","click").delegate("#link_help_shutDown","click",close_hitch_diagnosis);
        },
        init:function(){
            if(!!checking_status) return;
            var me = this;
            me.node={
                btn:$("#link_help_pop .btn-fld"),//button zone
                abnormal:$("#link-abnormal"),//abnormal ul obj
                checkSection:$("#hd-normal-check"),//checking ul obj
                footer:$(".hdFooter"),//hitchDiagnosis zone footer
                wanType: L.hitchDiagnosis_txt.wan_setup,//
                checkTitle:L.hitchDiagnosis_txt.checkProgressTip,
                abnormalTitle:L.hitchDiagnosis_txt.abnormal
            };
            me.dnsUpdate=false;   //  判断是否有把dns服务器设定为360的dns服务器
            stopTimer = false;
            checking_status = true;
            me.resetData=null;
            current_wiredStatus = null;
            check_step_currentHtml=[];
            me.addEventList();
            me.init_server_internet_language();
            stop_line_status_check=me.link_status_check();
        }
    };
   window.hitchDiagnosis=hitchDiagnosis;
})();
/* ===================================== by lwj  故障诊断 end ================================*/

/* ===================================== by houbingyang  首页加载逻辑 start ================================*/
(function () {
    var me=this;
    /* by zhaoyang start */
    var info = {
        title: '360安全路由P1',
        ssid: '',
        version: '10.1',
        stauts: "正常",
        errorclass: 'check-ok',
        uptime: '0',
        uptime_unit: '分钟',
        up_speed: '0',
        up_speed_unit: 'KB/s',
        down_speed: '0',
        down_speed_unit: 'KB/s',
        device_count: '0',
        wan_ip: ''
    };
    var timer = {}; //计时器
    //添加检查错误单击时间
    function wan_btn_click() {
        $(".router-info-box .button-fail-help").unbind("click").bind("click", function () {
            show_pop_layer("link_help_pop");
            hitchDiagnosis.init();
        });
        $(".router-info-box .button-akey-speed").unbind("click").bind("click", function () {
            var a_key_speed_txt = L.akey_speed_warning_txt;
            var tipDom = $("#akey_speed_count_tip");
            var speed_progress = $(".akey_speed_progress");
            var speeded_section = $(".akey_speed_result");
            var speeding_section =$(".akey_speed_check");
            var stopSpeed_SWITH=null;

            var show_success_result = function(){
                speed_progress.css("width","360px");
                speeding_section.fadeOut("normal", function () {
                    speeded_section.fadeIn();
                    tipDom.html(a_key_speed_txt[0]);
                });
            };
            var akey_speed_progress = {
                _akey_speed_done:false,
                _akey_speed_start:false,//是否开启成功
                speed_get_type:null,
                step_bar_Id:null,
                step_not_Id:null,
                speed_start: function () {
                    var me=this;
                    me.reset_show_status();me.page_html_show();
                    $.post("/web360/speed_start.cgi",{type:1},function (data) {
                        var obj = dataDeal(data);
                        if (obj && parseInt(obj.err_no,10)== 0) {
                            akey_speed_progress.get_speed_data();
                            $("#has_no_akey_speed").show();
                            $("#has_akey_speed").hide();
                            me._akey_speed_start=true;
                        }
                        else if(obj && parseInt(obj.err_no,10) == -1){
                            $("#has_no_akey_speed").hide();
                            $("#has_akey_speed").show();
                            me._akey_speed_start=false;
                        }
                        else{
                            $("#akey_speed_result_tip").hide();
                            $("#akey_speed_result_fail_tip").show();
                            $(".akey_speed_check").hide();
                            speeded_section.show();
                            me._akey_speed_start=false;
                        }
                    });
                },
                get_speed_data:function(){
                    var me=this,errorCount=0;
                    me.speed_get_type=setTimeout(function(){
                        var selfRefresh=arguments.callee;
                        $.post("/web360/speed_get.cgi", function (data) {
                            var obj = dataDeal(data);
                            var speed_not_status=function(){
                                    me._akey_speed_done=false;
                                    $("#akey_success_result").hide();
                                    $("#akey_speed_result_fail_tip").show();
                                };
                            var get_speed_type = function(data){
                                var speedType = ["speed-snail","speed-bike","speed-moto","speed-car","speed-airplane","speed-arrow"];
                                var typeNo;
                                (data<=1&&(typeNo=0))||(data>1&&data<=4&&(typeNo=1))||(data>4&&data<=10&&(typeNo=2))||(data>10&&data<=20&&(typeNo=3))||(data>20&&data<50&&(typeNo=4))||(data>=50&&(typeNo=5));
                                return speedType[typeNo];
                            };
                            var get_speed_txt = function(data){
                                var max_speed=formatSpeed(data),channelV,channelStr,max_Munit;
                                if(max_speed.unit=="KB/s"){
                                    max_Munit = (max_speed.value/1024).toFixed(1);
                                }
                                else{
                                    max_Munit = max_speed.value;
                                }
                                channelV=Math.floor(parseInt(max_Munit*8));
                                if(channelV==0){
                                    channelStr="1M";
                                }
                                else{
                                    channelStr=(channelV+1)+"M";
                                }
                                var typeClass  = get_speed_type(channelStr.substr(0,channelStr.length-1));
                                return {
                                    max:max_speed,
                                    net:channelStr,
                                    classTxt:typeClass
                                }
                            };
                            if (obj && parseInt(obj.err_no,10)==0) {
                                if(parseInt(obj.data[0].status,10) == 2){
                                    me._akey_speed_done=true;
                                    $("#akey_success_result").show();
                                    $("#akey_speed_result_fail_tip").hide();
                                    var down_txt;
                                    var up_txt;
                                    var maxSpeed = $("span.maxSpeedResult");
                                    var maxNet = $("span.maxNetResult");
                                    var spelUnit = $("label.akey_result_spel");
                                    var downSpeedLogo = $("#down-speed-logo");
                                    var upSpeedLogo = $("#up-speed-logo");
                                    down_txt=get_speed_txt(obj.data[0]["max"]);
                                    up_txt=get_speed_txt(obj.data[0]["up_band"]);
                                    if(down_txt.max.value>>>0===0){
                                        speed_not_status();
                                    }else{
                                        parseInt(down_txt.net)>=50&&(down_txt.net=L.akey_result_spel_line);
                                        parseInt(up_txt.net)>=50&&(up_txt.net=L.akey_result_spel_line);
                                        maxSpeed.eq(0).html(down_txt.max.allValue);
                                        maxSpeed.eq(1).html(up_txt.max.allValue);
                                        maxNet.eq(0).html(down_txt.net);
                                        maxNet.eq(1).html(up_txt.net);
                                        downSpeedLogo.removeClass().addClass(down_txt.classTxt);
                                        upSpeedLogo.removeClass().addClass(up_txt.classTxt);
                                    }
                                }
                                else{
                                    errorCount++;
                                    if(errorCount<10){
                                        speed_not_status();
                                        me.step_not_Id = setTimeout(selfRefresh,1000);
                                        return false;
                                    }
                                    else{
                                        speed_not_status();
                                    }
                                }
                            }
                            else{
                                speed_not_status();
                            }
                            speed_progress.stop(true,true);
                        });
                    },50000);
                },
                page_html_show: function () {
                    var me = this,countNum=60;
                    speed_progress.animate({
                        width:"360px"
                    },60000,function(){
                        show_success_result();
                    });
                    me.step_bar_Id=window.setInterval(function(){
                        countNum--;
                        (countNum>=53&&(tipDom.html(a_key_speed_txt[0])))||(countNum>=30&&countNum<53&&(tipDom.html(a_key_speed_txt[1])))||(tipDom.html(a_key_speed_txt[2]));
                        if (countNum<30) {
                            window.clearInterval(me.step_bar_Id);
                        }
                    },1000);
                },
                reset_show_status:function(){
                    var tmp = this;
                    speeding_section.show();
                    speeded_section.hide();
                    speed_progress.css("width", "0px");
                    show_pop_layer("akey_speed_pop");
                    tipDom.html(a_key_speed_txt[0]);
                    tmp._akey_speed_start=false;
                    tmp._akey_speed_done=false;
                },
                add_eventList: function () {
                    var tmp = this;
                    $("#refresh_akey_check").unbind("click").bind("click", function () {
                        tmp.speed_start();tipDom.html(a_key_speed_txt[0]);
                    });
                    $("#akey_check_done").unbind("click").bind("click", function () {
                        close_i_wired_popwin('akey_speed_pop');
                    });
                    $("#akey_speed_shut_a").unbind("click").bind("click", function () {
						$(".akey_speed_progress").stop(true,false);
                        window.clearTimeout(tmp.step_not_Id);
                        window.clearTimeout(tmp.speed_get_type);
                        window.clearInterval(tmp.step_bar_Id);
                        tmp.step_not_Id = null;
                        tmp.speed_get_type = null;
                        tmp.step_bar_Id = null;
                        if(!!tmp._akey_speed_start&&!tmp._akey_speed_done){
                            $.post("/web360/speed_stop.cgi");
                        }
                        close_i_wired_popwin('akey_speed_pop');
                    });
                },
                init: function () {
                    user_fov_info.appInfo("3015");
                    this.speed_start();
                    this.add_eventList();
                    tipDom.html(a_key_speed_txt[0]);
                }
            };
            akey_speed_progress.init();
			$(".router-info-box .button-akey-speed").blur();
        });
    }

    var timeFormat = function (second) {
        var minute = Math.floor(second / 60);
        var hour = Math.floor(second / (60 * 60));
        var day = Math.floor(second / (60 * 60 * 24));
        var returnObj = {
            allValue: L.one_minute,
            value: "1",
            unit: L.minute
        }

        if (day >= 1) {
            returnObj.allValue = day + L.day;
            returnObj.value = day;
            returnObj.unit = L.day;
        } else if (hour >= 1) {
            returnObj.allValue = hour + L.hour;
            returnObj.value = hour;
            returnObj.unit = L.hour;
        } else if (minute >= 1) {
            returnObj.allValue = minute + L.minute;
            returnObj.value = minute;
            returnObj.unit = L.minute;
        }
        return returnObj;
    }
    var getRouterInfo = function () {
        var deferred = $.Deferred();
        $.post("/web360/getrouterinfo.cgi", function (data) {
            var obj = dataDeal(data);
            if (obj && obj.err_no == 0) {
                deferred.resolve(obj.data);
            } else {
                deferred.reject(obj.err_des);
            }
        })
        return deferred.promise();
    }
    var setRouterInfoHtml = function (timeOutSpace) {
        if (timer.RouterInfoHtmlTimeOutId) {
            return;
        }
        (function () {
			$(".right-container .main-menu-box .nav_device_list .device-count").html(info.device_count);
            if (timer.RouterInfoHtmlTimeOutId && current_html != "index_page") {
                clearTimeout(timer.RouterInfoHtmlTimeOutId);
                timer.RouterInfoHtmlTimeOutId = "";
                return;
            }
            var meCallee = arguments.callee;
            $.post("/web360/getrouterinfo.cgi", function (data) {
                var obj = dataDeal(data);
                if (obj && obj.err_no == 0) {
                    $(".left-container .work-time-box").html(L.work_correct + "<span class='work-time'>" + timeFormat(obj.data.uptime).value + "</span>" + timeFormat(obj.data.uptime).unit);
                }
                timer.RouterInfoHtmlTimeOutId = setTimeout(meCallee, timeOutSpace || 5000);
            });
        })();
    }
    var getDeviceCount = function () {
        var deferred = $.Deferred();
        json_ajax({
            url: "/app/devices/webs/getdeviceslist.cgi",
            data: {},
            isFullDataStyle:true,
            successFn: function (data) {
                hitchDiagnosis.deviceContent=data;
                deferred.resolve({
                    device_count: data.data.length
                });
            },
            finalFn: function (data) {
                if (data.err_no != "0") {
                    deferred.reject({
                        device_count: 0
                    });
                }
            }
        });
        return deferred.promise();
    }
    var setDeviceCountl = function (timeOutSpace) {
        if (timer.DeviceCountlTimeOutId) {
            return;
        }
        (function () {
            if (timer.DeviceCountlTimeOutId && current_html != "index_page") {
                clearTimeout(timer.DeviceCountlTimeOutId);
                timer.DeviceCountlTimeOutId = "";
                return;
            }
            var meCallee = arguments.callee;
            json_ajax({
                url: "/app/devices/webs/getdeviceslist.cgi",
                data: {},
                successFn: function (data) {
                    $(".right-container .main-menu-box .nav_device_list .device-count").html(data.length);
                },
                finalFn: function (data) {
                    timer.DeviceCountlTimeOutId = setTimeout(meCallee, timeOutSpace || 5000);
                }
            });
        })();
    }
    var getWanSpeed = function () {
        var deferred = $.Deferred();
        $.post("/web360/getwanspeed.cgi", function (data) {
            var obj = dataDeal(data);
            if (obj && obj.err_no == 0) {
                deferred.resolve(obj.data);
            } else {
                deferred.reject(obj.err_des);
            }
        })
        return deferred.promise();
    }
    var setWanSpeed = function (timeOutSpace) {
        if (timer.WanSpeedTimeOutId) {
            return;
        }
        (function () {
            if (timer.WanSpeedTimeOutId && current_html != "index_page") {
                clearTimeout(timer.WanSpeedTimeOutId);
                timer.WanSpeedTimeOutId = "";
                return;
            }
            var meCallee = arguments.callee;
            json_ajax({
                url: "/web360/getwanspeed.cgi",
                data: {},
                successFn: function (data) {
                    var downSpeedObj = formatSpeed(data.down_speed);
                    $(".left-container .wan-speed-box .wan-speed .wan-speed-value").html(downSpeedObj.value);
                    $(".left-container .wan-speed-box .wan-speed .wan-speed-unit").html(downSpeedObj.unit);
                },
                finalFn: function (data) {
                    timer.WanSpeedTimeOutId = setTimeout(meCallee, timeOutSpace || 5000);
                }
            });
        })();
    }
    var getWiredStatusObjByData=function(data,addButtonEvent,noIpFn) {
        //目前暂时只支持单wan口
        var wiredStatusObj={};
        wiredStatusObj.status= data[0].WAN1.status;
        wiredStatusObj.errorclass= "check-ok";
        wiredStatusObj.cur_status= wiredStatusObj.status;
        wiredStatusObj.wisp={enable:false};
        wiredStatusObj.wan_gw=(data[0].WISP&&data[0].WISP.gw)|| data[0].WAN1.gw;

        if (wiredStatusObj.status != "0" && wiredStatusObj.status <<0 < 4 && data[0].WISP) {
            wiredStatusObj.wisp.enable= true;
            wiredStatusObj.wisp.status = data[0].WISP.status;
            if (data[0].WISP.status == "0") {
                wiredStatusObj.status = "0";
                wiredStatusObj.cur_status = wiredStatusObj.status;
                ROUTE_INFO.pre_status = wiredStatusObj.status;
            }
            else if (data[0].WISP.status == "4") {
                wiredStatusObj.cur_status = "4";
            }
        }
        //wisp口的判断
        if (wiredStatusObj.status == "1") { //没接线;
            //如果不锁屏则让用户可点击
            addButtonEvent();
            ROUTE_INFO.pre_status = wiredStatusObj.cur_status;
			if(wiredStatusObj.cur_status == "4")
				 wiredStatusObj.errorclass = "internet-detecting";
			else
            	wiredStatusObj.errorclass = "internet-error";
        } else if (wiredStatusObj.cur_status != 4) {
            if (wiredStatusObj.status == "0") { //有IP，可以上网
                if (ROUTE_INFO.pre_status != 0) { //之前的状态不为0
                    ROUTE_INFO.pre_status = 0;
                } else {
                    ROUTE_INFO.pre_status = wiredStatusObj.cur_status;
                }
            } else if (wiredStatusObj.status == "2" || wiredStatusObj.status == "3") { //接线, 没有IP
                noIpFn.call(wiredStatusObj);
                addButtonEvent();
				if(wiredStatusObj.cur_status == 4)
					 wiredStatusObj.errorclass = "internet-detecting";
				else
                	wiredStatusObj.errorclass = "internet-error";
            } else if(wiredStatusObj.status == "4"){
                wiredStatusObj.errorclass = "internet-detecting";
			}
			else if (wiredStatusObj.status == "-1") {
                addButtonEvent();
                wiredStatusObj.errorclass = "internet-error";
            }
        }
		else if(wiredStatusObj.cur_status == 4){
			wiredStatusObj.errorclass = "internet-detecting";
		}
        return wiredStatusObj;
    };
    //设置路由器状态
    var getWiredStatus = function () {
        var deferred = $.Deferred();
        $.post("/router/interface_status_show.cgi", {
                noneed: "noneed"
            }, function (data) {
                var data = dataDeal(data);
                if (data) {
                    //目前暂时只支持单wan口
                 var wiredStatusObj= getWiredStatusObjByData(data,wan_btn_click,function(){
                     ROUTE_INFO.pre_status = this.cur_status;
                 })
                    deferred.resolve({
                        stauts: wan_tip_str[wiredStatusObj["cur_status"]].info,
                        errorclass: wiredStatusObj["errorclass"]
                    });
                } else {
                    deferred.reject({
                        err_des: 'error'
                    });
                }
            }
        )
        ;
        return deferred.promise();
    }
    timer.WiredStatusHtmlWaitTime = 0;
    var setWiredStatusHtml = function (timeOutSpace) {
        if (timer.WiredStatusHtmlTimeOutId) {
            return;
        }
        (function () {
            if (timer.WiredStatusHtmlTimeOutId && current_html != "index_page") {
                timer.WiredStatusHtmlTimeOutId = "";
                clearTimeout(timer.WiredStatusHtmlTimeOutId);
                return;
            }
            var meCallee = arguments.callee;
            $.post("/router/interface_status_show.cgi", {
                noneed: "noneed"
            }, function (data) {
                var data = dataDeal(data);
                if (data) {
                    var wiredStatusObj = getWiredStatusObjByData(data, $.noop, function () {
                        if (ROUTE_INFO.pre_status == "1" || ROUTE_INFO.waiting) {
                            if (timer.WiredStatusHtmlWaitTime <= 8 * 1000) {
                                this.errorclass = "";
                                timer.WiredStatusHtmlWaitTime += timeOutSpace;
                                this.cur_status = "4";
                            } else {
                                timer.WiredStatusHtmlWaitTime = 0;
                                ROUTE_INFO.waiting = false;
                                ROUTE_INFO.pre_status = this.cur_status;
                            }
                        } else {
                            ROUTE_INFO.pre_status = this.cur_status;
                        }
                    });
                    hitchDiagnosis.wanInfoData=wiredStatusObj;
                    $(".router-info-box").removeClass("check-ok connect-error internet-error internet-detecting").addClass(wiredStatusObj["errorclass"]);
                    $(".router-info-box .networking-status").html(wan_tip_str[wiredStatusObj["cur_status"]].info);
                }
                timer.WiredStatusHtmlTimeOutId = setTimeout(meCallee, timeOutSpace || 5000);
            });

        })();

    }
    var renderIndexInfo = function (data) {
        var indexLeftTemplate = $("#index-left-template").html(),
            indexRightTemplate = $("#index-right-template").html(),
            leftContainer = $(".left-container"),
            rightTopContainer = $(".right-top-container"),
            indexLeftTemplateCompiled = _.template(indexLeftTemplate),
            indexRightTemplateCompiled = _.template(indexRightTemplate);
		var render_timer;
        $.when(getRouterInfo(), getDeviceCount(), getWanSpeed(), getWiredStatus()).then(function (val1,val2,val3,val4) {
            $.extend(info, val1,val2,val3,val4);
            info.version = info.version.replace("360POP-P1-V", "");
            var uptimeObj = timeFormat(info.uptime);
            info.uptime = uptimeObj.value;
            info.uptime_unit = uptimeObj.unit;
            var upSpeedObj = formatSpeed(info.up_speed);
            info.up_speed = upSpeedObj.value;
            info.up_speed_unit = upSpeedObj.unit;
            var downSpeedObj = formatSpeed(info.down_speed);
            info.down_speed = downSpeedObj.value;
            info.down_speed_unit = downSpeedObj.unit;
            leftContainer.html(indexLeftTemplateCompiled(info));
            rightTopContainer.html(indexRightTemplateCompiled(info));
            wan_btn_click();
            setRouterInfoHtml(60 * 1000);
            if(render_timer)
				clearTimeout(render_timer);
			render_timer = setTimeout(function(){
				setWiredStatusHtml(2000);
				setDeviceCountl(2 * 1000);
				setWanSpeed(2 * 1000);
			},2000);
        })

    };
    /* by zhaoyang end   modification by houbingyang 12/5*/

    var add_index_eventList = function () {
        $(".right-container .main-menu-box ").undelegate(".menu-item", "click").delegate(".menu-item", "click", function () {
            var html_name = $(this).attr("data-html-name");
            var appIdNo = $(this).attr("data-us-fov-count");
            var newUrlToken = "#indexitem" + "/";
            //需要绘制TAB选项卡的在此添加
            newUrlToken += html_name+"/"+($(this).hasClass("app")?"app":"normal");
            window.location.hash = newUrlToken;
            user_fov_info.appInfo(appIdNo);
        });
    };
    var init_index_page = function () {
        //加载向导
        renderIndexInfo();
        add_index_eventList();
    };
    window.init_index_page = init_index_page;
    window.getWiredStatusObjByData=getWiredStatusObjByData;
    window.timeFormat=timeFormat;
})();
/* ===================================== by houbingyang  首页加载逻辑 end ================================*/

/*===================================== by houbingyang  start 谁在上网 =====================================*/
(function () {
    //设备列表显示函数 by houbingyang  start
    function Device_list_info(outTime) {
        this.initDevicelistActioned = false;
        this.outTime = outTime || 5000;
        this.canReader = true;
        this.editing = false;
        this.runningPage = "nav_device_list";
        this.listType = "device";
        this.touchLinkEnable = true;
        this.igdApEnable = true;
        this.routeInfoSourse = {
            info0: {
                deviceCount: 0
            },
            info1: {
                deviceCount: 0
            },
            info2: {
                deviceCount: 0
            },
            info3: {
                deviceCount: 0
            },
            black: {
                deviceCount: 0
            },
            upSpeed: 0,
            downSpeed: 0
        };
        this.routeInfo = $.extend(true, {}, this.routeInfoSourse)
    }
    Device_list_info.prototype.add_device_list = function (dataItem,type,guest,ip) {
        var limitedSpeed = "";
		var is_5G = "",is_repeater = "",is_me = "";
        var me = this;
		if(dataItem.ip == ip)
			is_me = "is-me";
        if (dataItem.limit_up_speed * 1 > 0 || dataItem.limit_down_speed * 1 > 0) {
            limitedSpeed = "limited-speed";
        }
		if (dataItem.is_5g * 1 > 0) {
            is_5G = "is-5G";
        }
		if (dataItem.is_rep * 1 > 0) {
            is_repeater = "is-repeater";
        }
		if(dataItem.device_label == "unknown")
			dataItem.device_label = "";
		else if(dataItem.device_label.indexOf(L.camera) != -1)
			dataItem.os_type = "10";
		else if(dataItem.device_label.indexOf(L.router) != -1)
			dataItem.os_type = "11";
        else if(dataItem.name.indexOf("360R1")>-1 || guest == 3){
            dataItem.os_type = "12";
		}
        if(guest!=3){
            dataItem.rssi= "";
        }else{
            dataItem.rssi = parseInt(dataItem.rssi,10)==0?L.excellent:parseInt(dataItem.rssi,10)==1?L.good:L.bad;
		}
        var name = TOOLS.Crypto.htmlencode(dataItem["s_name"] || dataItem.alias || dataItem.device_label || dataItem.name || L.unnamed_device);
        var tmp_device = "",compiled = _.template(me.device_list_temp);
        if (type == "device") {
            var onlineDate = getDateBySec(dataItem.second);
            var onlineTimeStr = onlineDate.days > 0 ? (onlineDate.days + L.day) : "" + onlineDate.hours > 0 ? (onlineDate.hours + L.hour) : "" + onlineDate.minute > 0 ? (onlineDate.minute + L.minute) : "";
            //求所有速度和
            me.routeInfo.upSpeed += parseInt(dataItem.up_speed);
            me.routeInfo.downSpeed += parseInt(dataItem.down_speed);

            dataItem.onlineTimeStr = onlineTimeStr;
            dataItem.limitedSpeed = limitedSpeed;
			dataItem.is_me = is_me;
			dataItem.is_5G = is_5G;
			dataItem.is_repeater = is_repeater;
            dataItem.full_name = removeHTMLTag(name);
            dataItem.name = removeHTMLTag(GetDeviceNameStr(name, 16));
            dataItem.os_type = me.getOsType(dataItem.os_type);
            dataItem.up_speed = formatSpeed(dataItem.up_speed).allValue;
            dataItem.down_speed = formatSpeed(dataItem.down_speed).allValue;
            dataItem.limit_up_speed = parseInt(dataItem.limit_up_speed);
            dataItem.limit_down_speed = parseInt(dataItem.limit_down_speed);
            dataItem.mac = dataItem.mac.toUpperCase(); //大写MAC地址

            return compiled(dataItem);

        } else {
            var blackDate = new Date(dataItem.blacklist_time * 1000);
            var blackDateStr = blackDate.format("yyyy"+ L.year +"MM"+ L.month +"dd"+ L.s_day);
            tmp_device = "<div class='device-item'><div class='device-info'><div class='device-name-section' title='" + removeHTMLTag(name) + "' >" + removeHTMLTag(GetDeviceNameStr(name)) + "<span></span><br> <span class='gray'>"+ L.to_black_time +"：" + blackDateStr + "</span>" +
            "</div><div class='device-ip-section'><br/>MAC:<span class='device-mac'>" + (dataItem.mac).toUpperCase() + "</span><br> <span class='device-ip'></span></div>" +
            "<div class='device-ctrl-section'><button class='cancel-black-list-button moderate '>"+ L.remove_from_black +"</button></div></div></div>";
        }
        return tmp_device;
    }
    Device_list_info.prototype.get_route_info_by_device = function (dataItems, type) {
        var me = this;
        //还原
        this.routeInfo = $.extend(true, {}, this.routeInfoSourse);
        if (type == "device") {
            for (var i = 0; i < dataItems.length; i++) {
                if(dataItems[i]["type"]&&dataItems[i]["type"]==4){
                    dataItems[i]["is_guest"]=3;
                }
                switch (dataItems[i]["is_guest"] * 1) {
                    case 0:
                        me.routeInfo.info0.deviceCount++;
                        break;
                    case 1:
                        me.routeInfo.info1.deviceCount++;
                        break;
                    case 2:
                        me.routeInfo.info2.deviceCount++;
                        break;
                    case 3:
                        me.routeInfo.info3.deviceCount++;
                        break;
                }
                me.routeInfo.upSpeed += parseInt(dataItems[i].up_speed);
                me.routeInfo.downSpeed += parseInt(dataItems[i].down_speed);
            }
			
			if($("#host_list").hasClass("white"))
            	$("#nav_device_list_repeater")[me.routeInfo.info3.deviceCount>0 ? "show" : "hide"]();
            $("#nav_device_list .device-count").html(me.routeInfo.info0.deviceCount);
            $("#nav_device_list_igd_ap .device-count").html(me.routeInfo.info1.deviceCount);
            $("#nav_device_list_touch_link .device-count").html(me.routeInfo.info2.deviceCount);
            $("#repeater_list_count .device-count").html(me.routeInfo.info3.deviceCount);
            $(".router-info .wan-speed .upload").html(L.upstream_network_speed + '：' + formatSpeed(me.routeInfo.upSpeed).allValue);
            $(".router-info .wan-speed .download").html(formatSpeed(me.routeInfo.downSpeed).allValue);
        } else {
            $("#nav_device_list_black .device-count").html(dataItems.length);
        }

    }
    Device_list_info.prototype.init_device_list = function () {
        var me = this;
        var type = me.listType;
        var nodeName = ".device-list-wrapper";
        var url = "";
        if (type == "device") {
            nodeName = ".device-list-wrapper";
            url = "/app/devices/webs/getdeviceslist.cgi";
			me.outTime = 2*1000;
        } else {
            nodeName = ".black-list-wrapper";
            url = "/app/devices/webs/getblacklist.cgi";
			me.outTime = 10*1000;
        }
        $.ajax({
			type:"post",
            url: url,
            data: {},
            success: function (data) {
				var ret = dataDeal(data);
				var data = ret.data;
                var user_ip = ret.user_ip;
				if (!me.canReader || me.editing) {
                    if (type == "device") {
                        me.get_route_info_by_device(data, type);
                    }
                    return;
                }
                if (type == "device") {
                    var strHtml0 = "", strHtml1 = "", strHtml2 = "",strHtml3="";
                    //is_guest: 0      正常设备
                    //is_guest: 1       访客网络设备
                    //is_guest: 2       摩擦上网设备
                    //type: 4       扩展器设备
                    for (var i = 0; i < data.length; i++) {
						var guestNo = data[i]["is_guest"] * 1;
                        if(data[i]["type"] && data[i]["type"]==4){
                            guestNo = 3;
                        }
                        switch (guestNo) {
                            case 0:
                                strHtml0 += me.add_device_list(data[i], type,guestNo,user_ip);
                                break;
                            case 1:
                                strHtml1 += me.add_device_list(data[i], type,guestNo,user_ip);
                                break;
                            case 2:
                                strHtml2 += me.add_device_list(data[i], type,guestNo);
                                break;
							case 3:
                                strHtml3 += me.add_device_list(data[i], type,guestNo,user_ip);
                                break;
                        }
                    }
                    $("#nav_device_list " + nodeName).html($(strHtml0));
                    $("#nav_device_list_igd_ap " + nodeName).html($(strHtml1));
                    $("#nav_device_list_touch_link " + nodeName).html($(strHtml2));
					$("#nav_device_list_repeater " + nodeName).html($(strHtml3));

                } else {
                    var strHtml = "";
                    for (var j = 0; j < data.length; j++) {
                        strHtml += me.add_device_list(data[j], type);
                    }
                    $("#nav_device_list_black " + nodeName).html($(strHtml));

                }
                me.get_route_info_by_device(data, type);
            }
        });
    };
    Device_list_info.prototype.init_device_list_action = function () {
        var parentEmt = this;
        if (this.initDevicelistActioned) {
            return false;
        } else {
            this.initDevicelistActioned = true;
        }
        function get_device_items() {
            var _me = this._me = $(this),
                _deviceItem = this._deviceItem = _me.parents(".device-item"),
                _mac = this._mac = _deviceItem.find(".device-mac"),
                _macVal = this._macVal = $.trim(_mac.html()).replace("MAC:", ""),
            _uploadSpeed = this._uploadSpeed = _deviceItem.find(".limit-speed-upload"),
                _downloadSpeed = this._downloadSpeed = _deviceItem.find(".limit-speed-download");
        }

        $(".nav_device_list_container .info .item_status .slide-icon").die().live("click", function () {
            var me = $(this);
            me.toggleClass("down");
            var _device_list_block = me.parents(".info").siblings(".device-list-block");
            _device_list_block.slideToggle("normal");

        });
        $(".device-list-wrapper .device-item .device-name").die().live("click", function () {
            var me = this;
            get_device_items.call(me);
            if (me._deviceItem.hasClass("edit-name-mode")) {
                return;
            }
            me._deviceItem.addClass("edit-name-mode");
            var _edit_name = this._deviceItem.find(".edit-name");
            parentEmt.editing = true;
            _edit_name.focus().caret(0);
            _edit_name.unbind("keydown").bind("keydown", function (e) {
                if (e.keyCode == 13) {
                    submitEditName.call(this);
                }
            });
            var submitEditName = function () {
                var newNameEmt = $(this);
                var _device_name = newNameEmt.siblings(".device-name");
				var new_name_obj = {};
				new_name_obj.maxLength = 32;
				new_name_obj.value = $.trim(newNameEmt.val());
                var ret = CheckLength(new_name_obj);
                if (ret != true) {
					show_message("error",L.exceed_max);
                }
				var newName = new_name_obj.value;
                var oldName = _device_name.attr("title");
                if (newName == oldName) {
                    me._deviceItem.removeClass("edit-name-mode");
                    parentEmt.editing = false;
                    return;
                }
                if (newName.length == 0) {
                    me._deviceItem.removeClass("edit-name-mode");
                    newNameEmt.val(oldName);
                    parentEmt.editing = false;
                    return;
                }
                var newNameChcStr = check_string(newName);
                if (typeof newNameChcStr == "string") {
                    newNameEmt.css("border-color", "red");
					show_message("error",newNameChcStr);
                    return;
                } else {
                    newNameEmt.css("border-color", "");
                }
                json_ajax({
                    url: "/app/devices/webs/setdevicealias.cgi",
                    data: {
                        mac: me._macVal,
                        name: newName
                    },
                    successFn: function (data) {
                        me._deviceItem.removeClass("edit-name-mode");
                        newNameEmt.val(newName);
                        _device_name.html(GetDeviceNameStr(newName, 16));
                        _device_name.attr("title", newName);
                        parentEmt.editing = false;
                    }
                });
            };

            _edit_name.unbind("blur").bind("blur", submitEditName);
        });
        //切换黑名单
        $(".nav_device_list_top .device_black_change .tab-item").die().live("click", function () {
            var me = $(this);
            me.siblings(".tab-item").removeClass("on").end().addClass("on");
            var showItmes="#nav_device_list";
			if(parentEmt.routeInfo.info3.deviceCount > 0){
				showItmes+=",#nav_device_list_repeater";
			}
            if(parentEmt.touchLinkEnable){
                showItmes+=",#nav_device_list_touch_link";
            }
            if(parentEmt.igdApEnable)
            {
                showItmes+=",#nav_device_list_igd_ap";
            }
			$(".nav_device_list_container").stop(true,true);
            if (me.hasClass("white")) {
                parentEmt.listType = "device";
                $("#nav_device_list_black").fadeOut("normal", "linear", function () {
                    $(showItmes).fadeIn("normal", "linear");
                });
            } else {
                parentEmt.listType = "black";
                $(showItmes).fadeOut("normal", "linear", function () {
                    $("#nav_device_list_black").fadeIn("normal", "linear");
                });
            }
            parentEmt.init_device_list();
            parentEmt.editing = false;
        });
        //限速输入框输入判定
        $(".device-list-wrapper .device-item .limit-speed-panel").find("input").live("keyup", function () {
            $(".device-item input").css("border-color", "");
            !($(this).val() * 1 > 0 || $(this).val() * 1 == 0) ? $(this).val("") : $(this).val(parseInt($(this).val() * 1));
            if ($(this).val().length > 5) {
                $(this).val($(this).val().substring(0, 5));
            }
        });
        //限速
        $(".limit-speed-button").die().live("click", function () {
            var me = this;
            $(".device-item ").not(me._deviceItem).removeClass("set-speed-mode");
            get_device_items.call(me);
            //点击其他区域关闭限速面板
            var closePane = function (e) {
                var canClick = true;
                var targetEmt = $(e.target);
                var findEmt = $(".device-list-wrapper .device-item .device-ctrl-section,.limit-speed-panel").find(targetEmt)
                if (targetEmt.hasClass("limit-speed-panel") || findEmt.length)
                    return false;
                me._deviceItem.removeClass("set-speed-mode");
                $(".device-item input").css("border-color", "");
                $(document).unbind("click", arguments.callee);
                parentEmt.editing = false;
                return false;
            }
            if (!me._deviceItem.hasClass("set-speed-mode")) {
                me._deviceItem.addClass("set-speed-mode");
                parentEmt.editing = true;
                $(document).unbind("click", closePane).bind("click", closePane);
            } else {
                me._deviceItem.removeClass("set-speed-mode");
                parentEmt.editing = false;
                $(document).unbind("click", closePane);
            }
        });
        //取消限速
        $(".speed-ctrl-section .cancel-button").die().live("click", function () {
            var me = this;
            get_device_items.call(me);
            parentEmt.editing = true;
            json_ajax({
                url: "/app/devices/webs/setspeedlimit.cgi",
                data: {
                    mac: me._macVal,
                    upload: 0,
                    download: 0
                },
                successFn: function (data) {
                    me._deviceItem.removeClass("limited-speed");
                    me._deviceItem.removeClass("set-speed-mode");
                    me._downloadSpeed.val("0");
                    me._uploadSpeed.val("0");
                    parentEmt.editing = false;
                }
            });
        });
        //确认限速
        $(".speed-ctrl-section .submit-button").die().live("click", function () {
            var me = this;
            get_device_items.call(me);
            var verifyTag = true;
            var uploadSpeedValue = me._uploadSpeed.val();
            var downloadSpeedValue = me._downloadSpeed.val();
            if (downloadSpeedValue.length < 1) {
                me._downloadSpeed.css("border-color", "red");
                verifyTag = false;
            }
            if (uploadSpeedValue.length < 1) {
                me._uploadSpeed.css("border-color", "red");
                verifyTag = false;
            }
            if (!verifyTag) {
                return verifyTag;
            }
            parentEmt.editing = true;
            json_ajax({
                url: "/app/devices/webs/setspeedlimit.cgi",
                data: {
                    mac: me._macVal,
                    upload: uploadSpeedValue * 1,
                    download: downloadSpeedValue * 1
                },
                successFn: function (data) {
                    if (uploadSpeedValue * 1 == 0 && downloadSpeedValue * 1 == 0) {
                        me._deviceItem.removeClass("limited-speed");
                    } else {
                        me._deviceItem.addClass("limited-speed");
                    }
                    me._deviceItem.removeClass("set-speed-mode");
                    parentEmt.editing = false;

                }
            });
        });
        //拉黑
        $(".set-black-list-button").die().live("click", function () {
			show_message("save");
            var me = this;
            get_device_items.call(me);
            parentEmt.editing = true;
            json_ajax({
                url: "/app/devices/webs/setblacklist.cgi",
                data: {
                    mac: me._macVal
                },
                finalFn: function (data) {
					if(data.err_no != "0")
                    	show_message('error', igd.make_err_msg(data));
					else
						show_message('success');
                    return true;
                },
                successFn: function (data) {
                    me._deviceItem.remove();
                    parentEmt.editing = false;
                }
            });
        });
        //解除拉黑
        $(".cancel-black-list-button").die().live("click", function () {
            show_message("save");
			var me = this;
            get_device_items.call(me);
            parentEmt.editing = true;
            json_ajax({
                url: "/app/devices/webs/cancelblacklist.cgi",
                data: {
                    mac: me._macVal
                },
                successFn: function (data) {
                    me._deviceItem.remove();
                    parentEmt.editing = false;
					show_message('success');
					parentEmt.init_device_list();
                }
            });
        });
		//参数同步
		$("#param").die().live("click", function () {
            show_message("save");
			var me = this;
            get_device_items.call(me);
            parentEmt.editing = true;
			var enable = $("#param").prop("checked")>>>0;
            json_ajax({
                url: "/app/igd_network/webs/net_set_conf.cgi",
                data: {
                    enable: enable
                },
				finalFn: function (data) {
					if(data.err_no != "0"){
                    	show_message('error', igd.make_err_msg(data));
						if(enable)
							$("#param").prop("checked",false);
						else
							$("#param").prop("checked",true);
					}
					else
						show_message('success');
                    return true;
                },
                successFn: function (data) {
					show_message('success');
                }
            });
        });
    };
    Device_list_info.prototype.init_device_list_info = function () {
        var me = this;
        //初始化
        me.device_list_temp = $('#device-list-temp').html();
        me.editing = false;
        me.listType="device";
        if (me.outTimeId) {
            clearTimeout(me.outTimeId);
        }
        if (current_html == me.runningPage) {
            $("#nav_device_list_touch_link ")[me.touchLinkEnable ? "show" : "hide"]();
            $("#nav_device_list_igd_ap")[me.igdApEnable ? "show" : "hide"]();
            $("#nav_device_list_repeater")[me.routeInfo.info3.deviceCount>0 ? "show" : "hide"]();
        }
        var init = function () {
            if (current_html == me.runningPage) {
                me.canReader = true;
                me.init_device_list();
                me.outTimeId = setTimeout(arguments.callee, me.outTime);
            } else {
                me.canReader = false;


            }
        }
        init();
        me.init_device_list_action();
    }
	Device_list_info.prototype.init_param = function () {
		json_ajax({
			url: "/app/igd_network/webs/net_get_conf.cgi",
			data: {},
			successFn: function (data) {
				$("#param").prop("checked",!!(data.enable*1));
			}
		});
    }
//0: NONE 1: Windows 2: iPhone 3: Android 4: Windows Phone 5:  6: Linux  7: 其他
    Device_list_info.prototype.getOsType = function (typeN) {
		return getType(typeN);
    }
    //设备列表显示函数 by houbingyang  end

    //获取摩擦访客网络和访客网络的开启状态
    var getTouchLinkEnable = function () {
        var deferred = $.Deferred();
        json_ajax({
            url: "/app/touch_link/webs/ql_get_conf.cgi",
            data: {},
            successFn: function (data) {
                deferred.resolve({
                    touchLinkEnable: !!(data[0]["switch"] * 1)
                });
            },
            finalFn: function (data) {
                if (data.err_no != "0") {
                    deferred.reject({
                        touchLinkEnable: "error"
                    });
                }
            }
        });
        return deferred.promise();
    }
    var getIgdApEnable = function () {
        var deferred = $.Deferred();
        $.post("/app/igd_ap/webs/wireless_ap_base.cgi", {
            action: "get"
        }, function (data) {
            var obj = dataDeal(data);
            if (obj) {
                deferred.resolve({
                    igdApEnable: !!(obj.enable * 1)
                });
            } else {
                deferred.reject({
                    igdApEnable: "error"
                });
            }
        })
        return deferred.promise();
    }

    //实例化对象
    var device_list_info = new Device_list_info(2 * 1000);
    var init_nav_device_list = function () {
        $.when(getTouchLinkEnable(), getIgdApEnable()).then(function (ret1,ret2) {
            device_list_info.touchLinkEnable = ret1.touchLinkEnable;
			device_list_info.igdApEnable = ret2.igdApEnable;
            device_list_info.init_device_list_info();
			device_list_info.init_param();
        })
    }
    window.init_nav_device_list = init_nav_device_list;

})();
/*===================================== by houbingyang  end 谁在上网 =====================================*/

/*===================================== by houbingyang  start 用手机管理路由器 =====================================*/
(function () {
	var animate_list = {
		box4Timer:null,
		start_time:1350,
		step:150,
		end_pos:111,
		pos_step:52,
		elementInit :{
			".tl": {
				top: -50,
				opacity:0
			},
			".txt01": {
				top: 430
			},
			".txt02": {
				top: 512
			},
			".txt03": {
				top: 594
			}
		},
		init:function(){
			 for (var i in this.elementInit) {//初始化对象
				var $i = $(".app_wrapper").find(i);
				for (var j in this.elementInit[i]) {
						$i.css(j, this.elementInit[i][j]);
				}
			} 
		},
		animate:function(){
			var me = this;
			if(me.box4Timer)
				clearTimeout(me.box4Timer);
			$(".tl").stop().animate({top: 48, opacity: 1}, me.start_time);
			var index = 0;
			for(var i in me.elementInit){
				if(index != 0){
					(function(i){
						var pos = me.end_pos + me.pos_step * index;
						index++;
						me.box4Timer = setTimeout(function(){
							$(i).stop().animate({top: pos, opacity: 1}, me.start_time - me.step * index);
						},me.step);	
					})(i);
				}
				else
					index++;
			}
		}
	};
    var init_nav_mobile_app = function () {
		animate_list.init();
		animate_list.animate();
    }
    window.init_nav_mobile_app = init_nav_mobile_app;
})();
/*===================================== by houbingyang  end 用手机管理路由器 =====================================*/
function set_btn_pos(){
	var wrap = $("#container_wrap");
	var re_btn = $(".return_a");
	var offset = getPosition(wrap.get(0));
	var re_pos = getPosition(re_btn.get(0));
	var borderline = re_pos.x + 45 + 100;
	var w_width = $(window).width();
	if(borderline < w_width){
		$("#conner").css({
			"left":$(window).width() - 100 + "px",
			"top":offset.y - 20 + "px"
		}).fadeIn();
	}
	else{
		$("#conner").fadeOut();
	}
}

//wifi定时开关部分
//开启此无线模块 当前时间正好落在wifi关闭时间内
function set_ap_timer_temp(){
	get_ntp_time();
	if(ntp_time.week != undefined){
		get_wifi_time();
		if(wifi_time.week != undefined)
			compare_ntp_wifi_time(ntp_time,wifi_time);
	}
}

var ntp_time = {};
function get_ntp_time(){
	$.ajax({
		type: "get",
		url: '/router/sys_time_show.cgi?nonee=noneed',
		async: false,
		dataType: "json",
		success: function (data) {
			ntp_time = {};
			if(data.work_mode == "0" && data.time.split('-')[0] != "1970"){
				ntp_time = {};
				var y = parseInt(data.time.split("-")[0],10);
				var m = parseInt(data.time.split("-")[1],10);
				var d = parseInt(data.time.split("-")[2].split(" ")[0]);
				ntp_time.week = CaculateWeekDay(y,m,d);
				
				ntp_time.time = TimeCompareCoveter(parseInt(data.time.split("-")[2].split(" ")[1].split(":")[0]),parseInt(data.time.split("-")[2].split(" ")[1].split(":")[1]));
			}
		}
	});
}


var wifi_time = {};
var jump_day = false;
function get_wifi_time(){
	$.ajax({
		type: "get",
		url: '/app/new_ap_timer/ap_timer.cgi?action=get',
		async: false,
		dataType: "json",
		success: function (data) {
			if(data.timer_enable == "1"){
				wifi_time = {};
				var arr = data.timer_day.split("+");
				for(var i in arr)
					arr[i] = parseInt(arr[i]);
				wifi_time.week = arr;
				wifi_time.start_time = TimeCompareCoveter(data.start_hour,data.start_minute);;
				wifi_time.end_time = TimeCompareCoveter(data.end_hour,data.end_minute);
				
				var new_arr = [];
				jump_day = false;
				if(wifi_time.end_time - wifi_time.start_time < 0){//跨天
					jump_day = true;
					wifi_time.last_time = TimeCompareCoveter(23,59);
					wifi_time.cur_time = TimeCompareCoveter(0,0);
					for(var i in wifi_time.week){
						var w = parseInt(wifi_time.week[i]);
						var tmp = w + 1;
						new_arr.push(tmp);
						new_arr.push(w);
					}
					wifi_time.week = new_arr;
				}
			}
		}
	});
}

function compare_ntp_wifi_time(ntp_obj,wifi_obj){
	var flag = false;
	for(var i in wifi_obj.week){
		if(wifi_obj.week[i] == ntp_obj.week){
			flag = true;
			break;
		}
	}
	//判断星期
	//如果星期不落在时间段内，那么必然这段时间wifi不是关闭的
	//星期落在这个时间段内，那么需要判断开启或者结束时间
	if(flag){
		//未跨天
		if(!jump_day){
			if (ntp_obj.time - wifi_obj.start_time > 0 && ntp_obj.time - wifi_obj.end_time < 0) {//落在范围内
			 	show_tip();
			}
		}
		//跨天
		else{
			if ((ntp_obj.time - wifi_obj.start_time > 0 && ntp_obj.time - wifi_obj.last_time < 0) || (ntp_obj.time - wifi_obj.cur_time > 0 && ntp_obj.time - wifi_obj.end_time < 0)) {//落在范围内	
			 	show_tip();
			}
		}
	}
}

function show_tip(){
	//if(typeof(nos) != "undefined"){
	if($("#config_page").length != 0){
		$("#config_page").get(0).contentWindow.nos.app.resizePage();
		$("#config_page").get(0).contentWindow.$("#wifi_tip").removeClass("off");
	}
	else{
		$(".wifi_tip").removeClass("section_hide");
	}
}


function jump_wifi_page(){
	var elem = "";
	if($("#config_page").length != 0){
		elem = $("#config_page").get(0).contentWindow.$("#wifi_tip");
	}
	else{
		elem = $(".wifi_tip");
	}
	elem.off("click").on("click","a",function(){
		window.location.hash="#addonitem/new_ap_timer";
	});
}

