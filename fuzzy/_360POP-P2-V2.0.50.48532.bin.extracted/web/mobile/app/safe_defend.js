/**
 * Created by Administrator on 2015/3/31.
 */

var safe_defend={
    appHtml:null, //保存js所用的语言包参数
    defend_info:null,
    switchTxt:null,//开始和关闭保护语言包
    isInitFlag:true,//判断是否为初始化
    trojanStatus:false, //标记组合安全防护开关的安全状态
    net_enable_set:function(val){
        var m = this;
        var node =$(".net-safe-tip").next("span");
        m.trojanStatus=false;
        node.removeClass("getDefend").html(m.switchTxt[val]);
        if(val==1){
            node.addClass("getDefend");
        }
        if(!!m.isInitFlag){m.trojanStatus=true;return}
        show_message("save");
        $.post("/app/qh_360/webs/qh360_set.cgi",{enable:val},function(data){
            var obj = dataDeal(data);
            if(obj=="SUCCESS"){
                if(!!(val*1)){
                    m.trojanStatus=true;
                }
                show_message("success",appCommonJS.controlMessage.s_suc);
                m.defend_info.dns_enable=val;
                m.setSafeDefendStatus();
                m.set_dns_tramper_data(val);
                return;
            }
            show_message("error",appCommonJS.controlMessage.s_fail);
        });
    },
    dns_enable_set:function(val){
        var m = this;
        var node =$(".internet-safe-tip").next("span");
        m.trojanStatus=false;
        node.removeClass("getDefend").html(m.switchTxt[val]);
        if(val==1){
            node.addClass("getDefend");
        }
        if(!!m.isInitFlag){m.trojanStatus=true;return}
        show_message("save");
        $.post("/app/dns_tramper/webs/dns_set_switch.cgi",{switch:val},function(data){
            var obj = dataDeal(data);
            if(obj.err_no==0){
                if(!!(val>>0)){
                    m.trojanStatus=true;
                }
                show_message("success",appCommonJS.controlMessage.s_suc);
                m.defend_info.dns_enable=val;
                m.setSafeDefendStatus();
                m.set_dns_tramper_data(val);
                return;
            }
            show_message("error",appCommonJS.controlMessage.s_fail);
        });
    },
    arp_enable_set:function(val){
        var m = this;
        var node =$(".home-safe-tip").next("span");
        m.trojanStatus=false;
        node.removeClass("getDefend").html(m.switchTxt[val]);
        if(val==1){
            node.addClass("getDefend");
        }
        $("#safe_arp_mode").val(val);
        $("#safe_arp_rate").val(val);
        if(!!m.isInitFlag){m.trojanStatus=true;return}
        show_message("save");
        $.post("/app/arp_oversee/webs/arp_defence.cgi",{arp_mode:val,arp_rate:val},function(data){
            var obj = dataDeal(data);
            if(obj=="SUCCESS"){
                if(!!(val>>0)){
                    m.trojanStatus=true;
                }
                show_message("success",appCommonJS.controlMessage.s_suc);
                $("#safe_arp_mode").val(obj["arp_mode"]);
                $("#safe_arp_rate").val(obj["arp_rate"]);
                m.defend_info.arp_enable=val;
                m.setSafeDefendStatus();
                return;
            }
            show_message("error",appCommonJS.controlMessage.s_fail);
        });
    },
    radioSelectConfig:function(){
        Tools.radio.config.switch.net_enable={};
        Tools.radio.config.switch.net_enable.oEvent="safe_defend.net_enable_set";
        Tools.radio.config.switch.dns_enable={};
        Tools.radio.config.switch.dns_enable.oEvent="safe_defend.dns_enable_set";
        Tools.radio.config.switch.arp_enable={};
        Tools.radio.config.switch.arp_enable.oEvent="safe_defend.arp_enable_set";
    },
    _init_data:function(){
        var me = this;
        me.defend_info={};
        $.when(me.qh_360(), me.dns_tramper(), me.arp_defend(),me.wifi_psw_defend(),me.security_psw_defend()).then(function(){
            me.setSafeDefendStatus();
			me.isInitFlag=false;
        },function(){
            console.log("failure!");
        });

    },
    setSafeDefendStatus:function(){
        var me =this;
        var html = me.appHtml["trojanStatus"];
        var psw= me.appHtml.pswStatus;
        var pswObj=$("#sec-psw-info span");
        var trojanObj = $("#netStatusTip span");
        with (me.defend_info){
            if(typeof wifiPassStrength=="undefined"||typeof securityPwdStrength=="undefined"||typeof net_enable=="undefined"||typeof dns_enable=="undefined"||typeof arp_enable=="undefined"){
                return;
            }
            if(wifiPassStrength==0||securityPwdStrength==0){pswObj.html(psw[1]);}
            else{pswObj.html(psw[0]);}
            if(net_enable&&dns_enable&&arp_enable&&wifiPassStrength>0&&securityPwdStrength>0){
                trojanObj.removeClass("trojanStatus-safe").html(html[1]);
            }
            else{trojanObj.addClass("trojanStatus-safe").html(html[0]);}
        }
    },
    qh_360:function(){
        var deferred = $.Deferred();
        var me =this;
        $.post("/app/qh_360/webs/qh360_dump.cgi", function (data) {
            var obj = dataDeal(data);
            if (!!obj) {
                deferred.resolve();
                me.defend_info.net_enable=obj["enable"]>>0;
                Tools.radio.set("net_enable",me.defend_info.net_enable);
                me.set_qh_360_data(obj);
            }
            else {
                deferred.reject();
            }
        });
        return deferred.promise();
    },
    set_qh_360_data:function(data){
        var node =$(".safe-defend-net");
        if(data["enable"]==0){
            node.find("dl").hide();
            node.find("p").show();return;
        }
        else{
            node.find("dl").show();
            node.find("p").hide();
        }
        var the =this;
        var showObj = $(".safe-defend-net .safe-defend-net-info").next("span");
        $("#safe-defend-net-title strong").html(data["protect_days"]);
        showObj.each(function(){
            var objClass = $(this).attr("class");
            var htmlStr = the.appHtml["show-net-defend-info"];
            htmlStr=htmlStr.replace("current",data["today_http_"+objClass]).replace("total",data["http_"+objClass]);
            $(this).html(htmlStr);
        });
    },
    dns_tramper:function(){
        var deferred = $.Deferred();
        var me = this;
        $.post("/app/dns_tramper/webs/dns_get_switch.cgi", function (data) {
            var obj = dataDeal(data);
            if (obj && obj.err_no == 0) {
                deferred.resolve();
                me.defend_info.dns_enable=obj.data[0]["switch"]>>0;
                Tools.radio.set("dns_enable",me.defend_info.dns_enable);
                me.set_dns_tramper_data(obj.data[0]["switch"]);
            } else {
                deferred.reject();
            }
        });
        return deferred.promise();
    },
    set_dns_tramper_data:function(val){
        var node =$(".safe-defend-internet");
        if(val==0){
            $("#safe-defend-internet-title").hide();
            $("#safe-defend-password-tip").hide();
            $("#safe-defend-internet-shut-tip").show();
            return;
        }
        else{
            $("#safe-defend-internet-title").show();
            $("#safe-defend-password-tip").show();
            $("#safe-defend-internet-shut-tip").hide();
        }
        var getProtectData=function(){
            $.post("/app/dns_tramper/webs/dns_get_runtime.cgi", function (data) {
                var obj = dataDeal(data);
                if (obj && obj.err_no == 0) {
                    $("#safe-defend-internet-title strong").html(obj.data[0]["day"]>>>0||"1");
                }
            });
        };
        var get_state_data=function(){
            $.post("/app/dns_tramper/webs/dns_get_statis.cgi", function (data) {
                var obj = dataDeal(data);
                if (obj && obj.err_no == 0) {
                    $("#safe-defend-password-tip strong").html(obj.data[0]["stat"]);
                }
            });
        };
        get_state_data();
        getProtectData();
    },
    arp_defend:function(){
        var deferred = $.Deferred();
        var me =this;
        $.post("/app/arp_oversee/webs/arp_defence_show.cgi", function (data) {
            var obj = dataDeal(data);
            if (!!obj) {
                deferred.resolve();
                $("#safe_arp_mode").val(obj["arp_mode"]);
                $("#safe_arp_rate").val(obj["arp_rate"]);
                me.defend_info.arp_enable=obj["arp_mode"]*obj["arp_rate"];
                Tools.radio.set("arp_enable",me.defend_info.arp_enable);
            } else {
                deferred.reject();
            }
        });
        return deferred.promise();
    },
    wifi_psw_defend:function(){
        var deferred = $.Deferred();
        var me =this;
        var pswTip=me.appHtml.pswStrength;
        $.post("/web360/wifipwdstrength.cgi", function (data) {
            var obj = dataDeal(data);
            if (obj && obj.err_no == 0) {
                var wifipassstrength = !obj.data[0].enable ? 2 : me.getPassstrength(obj.data[0].level);
                deferred.resolve();
                $.extend(me.defend_info,{
                    wifiEnable: obj.data[0].enable,
                    wifiPassStrength: wifipassstrength
                });
                !me.isInitFlag&&me.setSafeDefendStatus();
                $("#s-d-wifi-strength").next("span").html(pswTip[me.defend_info.wifiPassStrength]);
            } else {
                deferred.reject();
            }
        });
        return deferred.promise();
    },
    security_psw_defend:function(){
        var me=this;
        var pswTip=me.appHtml.pswStrength;
        var deferred = $.Deferred();
        $.post("/web360/security_pwd_strength.cgi", function (data) {
            var obj = dataDeal(data);
            if (obj && obj.err_no == 0) {
                deferred.resolve();
                me.defend_info.securityPwdStrength=me.getPassstrength(obj.data[0].mode);
                $("#s-d-psw-strength").next("span").html(pswTip[me.defend_info.securityPwdStrength]);
                !me.isInitFlag&&me.setSafeDefendStatus();
            } else {
                deferred.reject();
            }
        });
        return deferred.promise();
    },
    pageToggle:function(name,title){
        var me = this;
        var section = $("#appContent section").not(":first");
        var mySubSwiper=mobile_host_control.M_Swiper;
        if(name=="safeDefend-host"){
            mySubSwiper.subSlideTo(0);
        }else{
            section.hide();
            $("."+name).show();
            mySubSwiper.subSlideTo(1);
        }
        if(name == "safe-defend-password-edit"){
            $(".appTitle").html(title);
            $(".appSave").show();
            $(".safe-defend-password-edit").html("");
        }else{
            $(".appSave").hide();
            $(".appTitle").html(me.appHtml[name]);
            current_html=languageM_nav_map["safe_defend"].currentHtml;
        }
    },
    callback_event:function(name){
        var me =this;
        mobile_host_control.app.addReturnBackCallBackFns(function(){
            me.pageToggle(name);
            if(name=="safe-defend-password"){
                me.wifi_psw_defend();me.security_psw_defend();
            }
        });
    },
    addEventList:function(){
        var me =this;
        var node = $(".safeDefend-host");
        var pswEdit = $(".safe-defend-password dl");
        node.undelegate("aside,#sec-psw-info","click").delegate("aside,#sec-psw-info","click",function(eve){
            eve.preventDefault();eve.stopPropagation();
            var dataHtmlName = $(this).attr("data-source-html-name");
            if(dataHtmlName=="safe-defend-home"){
                arp_defend_obj.init();
            }
            me.pageToggle(dataHtmlName);
            me.callback_event("safeDefend-host");
        });
        pswEdit.undelegate("dd","click").delegate("dd","click",function(){
            var mapNav = languageM_nav_map;
            var htmlName = $(this).attr("data-edit-psw-html-name");
            var currentHtmlObj = mapNav[htmlName];
            var conM = mobile_host_control;
            current_html=currentHtmlObj.currentHtml;
            conM.menu.load_app_html(currentHtmlObj["currentHtml"], function () {
                var params = Array.prototype.slice.apply(arguments, [2, arguments.length]);
                if (typeof(window[currentHtmlObj["action"]]) == 'function') {
                    window[currentHtmlObj["action"]].apply(null, params);
                }
            },"safe-defend-password-edit");
            conM.hash.isSkipping=true;
            me.pageToggle("safe-defend-password-edit",currentHtmlObj.title);
            me.callback_event("safe-defend-password");
        });
    },
    init:function(){
        $(".appSave").hide();
        this.appHtml=MobileHtml[current_html]["js"];
        this.switchTxt=this.appHtml["defendStatus"];
        this.isInitFlag=true;
        this.addEventList();
        this.radioSelectConfig();
        this._init_data();
    },
    getPassstrength : function (passstrength) {
        if (passstrength < 2) {
            return 0;
        } else if (passstrength == 2) {
            return 1;
        } else {
            return 2;
        }
    }
};
define(function(){
    return safe_defend;
});
var reg_app_map = {
    filter_arp: [
        {id:"filter_arp_ip", type: "ip"},
        {id:"filter_arp_mac", type: "mac"},
        {id:"filter_arp_name", type: "string noneed"}
    ],
    noneed:[]
};
var arp_defend_obj={
    filter_arp_temp_data:null,
     init_filter_arp:function(){
         var me =this;
        nos.app.net('/app/arp_oversee/webs/arp_bind_list_show.cgi','noneed=noneed',me.init_filter_arp_tab);
    },
     filter_arp_bind_submit:function(){
         var me =this;
        if(check_app_input("filter_arp")){
            nos.app.net('/app/arp_oversee/webs/arp_bind_settings.cgi','filter_arp_bind_frm',me.filter_arp_bind_submit_callback);
        }
    },
     init_filter_arp_tab:function(data){
        var me =arp_defend_obj;
        me.filter_arp_temp_data=[];
        me.select_filter_arp(data,me.filter_arp_temp_data);
         me.create_arp_list();
    },
     select_filter_arp:function(fromObj,toObj){
        var n=0;
        for(var i in fromObj){
            if(fromObj[i]['type']=='dynamic') {
                n++;continue;
            }
            if(typeof fromObj[i] == "object")
            {
                toObj[i-n]={};
                arguments.callee(fromObj[i],toObj[i-n]);
                continue;
            }
            else  {
                toObj[i] = fromObj[i];
            }
        }
    },
     create_arp_list:function(){
         var me =this;
         var tempData =  me.filter_arp_temp_data;
         var node=$("#s-d-arp-list");
         var noList = common_M_html.noTableListDataTip;
         var htmlList="";
         node.removeClass("noTableListDataTip");
         if(!!tempData.length){
             for(var m in tempData){
                 var htmlStr="<dd><span>ip</span><span>mac</span><a href='javascript:void(0);' class='arp-del-btn'></a></dd>";
                 htmlStr = htmlStr.replace("ip",tempData[m]["ip"]).replace("mac",tempData[m]["mac"]);
                 htmlList+=htmlStr;
             }
         }
         else{node.addClass("noTableListDataTip");htmlList=noList;}
         node.html(htmlList);
     },
    filter_arp_del:function(index){
        var me=this;
        show_dialog(appCommonJS.dialog.del_single,function(){
            var url='dev='+me.filter_arp_temp_data[index]['dev']+'&ip='+me.filter_arp_temp_data[index]['ip'];
            nos.app.net('/app/arp_oversee/webs/arp_del_bind.cgi',url,me.filter_arp_bind_submit_callback);
        })
    },
     filter_arp_bind_submit_callback:function(data){
         var me =arp_defend_obj;
        me.showSuccess(data);
         $("#filter_arp_bind input[type=text]").val("");
         Tools.select.set("LAN","bind_iface");
        nos.app.net('/app/arp_oversee/webs/arp_bind_list_show.cgi','noneed=noneed',me.init_filter_arp_tab);
    },
     showSuccess:function(data){
        if (data == "SUCCESS") {
            show_message("success",appCommonJS.controlMessage.c_suc);
        } else {
            show_message("error", igd.make_err_msg(data));
        }
    },
    addArpEvent:function(){
        var me =this;
        $("#s-d-arp-list").undelegate("a","click").delegate("a","click",function(ev){
            ev.preventDefault();
            me.filter_arp_del($(this).parent().index());
        });
        $("#filter_arp_bind dt").undelegate("#s-d-arp-add","click").delegate("#s-d-arp-add","click",function(ev){
                ev.preventDefault();
                me.filter_arp_bind_submit();
        });
    },
    init:function(){
        Tools.select.set("LAN","bind_iface");
        Tools.select.select_disabled=false;
        Tools.time.createSettingSection.timeDisabled=false;
        this.addArpEvent();
        this.init_filter_arp();
    }
};

