srouter = {};
srouter.init = {};

// ---------------------------- welcome start ---------------------------------
srouter.init.welcome = {};
srouter.init.welcome.checkTry = 2;
srouter.init.welcome.timer = null;
srouter.init.welcome.countDownTimer;
//加载new_lib的需要项
var language_type = igd.global_param.language_type;
var L = language[language_type]["JS"];
ROUTE_INFO={};


varget_lan_ip = function(){
	var ip = window.location.href.toString().split("/")[2];
	ROUTE_INFO.lan_ip = ip || igd.global_param.default_ip;
}();

srouter.init.welcome.init = function () {
    var welcome = srouter.init.welcome;
    $(".page-welcome .next").click(function (event) {
        event.preventDefault();
        welcome.showTestPage();
    });
	$(".page-welcome form").submit(function (event) {
        event.preventDefault();
        srouter.init.welcome.submit();

    });
};

srouter.init.welcome.submit = function(event){
	var welcome = srouter.init.welcome;
	welcome.showTestPage();
};

srouter.init.welcome.hideEverything = function () {
    $('.page').hide();
};

srouter.init.welcome.showSubPage = function (page) {
    srouter.init.welcome.hideEverything();
    $(".page-" + page).show();
};

srouter.init.welcome.start = function () {
    $(".page-welcome").show();
	$(".page-welcome input").eq(0).focus();
};

srouter.init.welcome.showTestPage = function () {
    var welcome = srouter.init.welcome;
    if (welcome.countDownTimer) {
        clearInterval(welcome.countDownTimer);
    }
    // 倒计时15s
    var countDown = 6;
    $('.page-get-method .count-down').text(countDown);
    welcome.countDownTimer = setInterval(function () {
		countDown--;
        //if (countDown == 12){
        // 点击按钮3s后, 才开始跳转
        //srouter.init.net.stopWait();
        //} else
        if (countDown == 0) {
            clearInterval(welcome.countDownTimer);
        }
        // PC上没有倒计时， 手机上有， 不过不会报错
        $('.page-get-method .count-down').text(countDown);
    }, 1000);
    welcome.showSubPage("get-method");
    var param = {
        action: "dump"
    };
    log("/router/igd_param_status.cgi begin");
    srouter.init.common.ajax("/router/igd_param_status.cgi", param, function (data) {
        if (data && data.no_param == 1) {
            srouter.init.net.show();
        } else {
            welcome.isInited = 1;
            alert(L.initialized);
            window.location.href = "/";
        }
        log("igd_param_status ok");
    }, function () {
        welcome.checkTry--;
        welcome.timer = setTimeout(function () {
            welcome.hideEverything();
            welcome.start();
        }, 1000);
        if (welcome.checkTry == 0) {
            clearTimeout(welcome.timer);
        }
    });

}


// ---------------------------- net start ---------------------------------
srouter.init.net = {};
srouter.init.net.checkResult = 0;
//srouter.init.net.checkWaitClickBegin = true;

srouter.init.net.elementForms = null; // 多个form。每种上网方式都是独立的form。

srouter.init.net.TYPE_UNKNOWN = "UNKNOWN";
srouter.init.net.TYPE_DHCP = "DHCP";
srouter.init.net.TYPE_PPPOE = "PPPOE";
srouter.init.net.TYPE_STATIC = "STATIC";


srouter.init.net.type = "UNKNOWN"; // 用户选定的上网类型
srouter.init.net.submitting = false;
srouter.init.net.submitResult = Number.NaN;

srouter.init.net.wanReadTimeOutTimer = null;
srouter.init.net.wanHttpDetectTimer = null;
srouter.init.net.countDownTimer = null;
srouter.init.net.connectedDownTimer = null;
srouter.init.net.connected = false;


srouter.init.net.init = function () {
    var net = srouter.init.net;

    net.elementForms = $(".page-set-network  form");

    $(".page-set-network form").submit(function (event) {
        event.preventDefault();
        srouter.init.net.submit();

    });

    $(".page-cable-error .next").click(function (event) {
        event.preventDefault();
        srouter.init.net.show();
    });

    $(".page-network-error .next").click(function (event) {
        event.preventDefault();
        net.submitting = false;
        net.showSubPage("set-network");
    });

    $(".page-forget-password .next").click(function (event) {
        event.preventDefault();
        //srouter.init.net.show();
		$(this).parent(".page-forget-password").hide();
		net.showSubPage("set-network");
    });

    $(".forget-password").click(function (event) {
        event.preventDefault();
        net.showSubPage("forget-password");
    });


    $(".skip").click(function (event) {
        event.preventDefault();
        srouter.init.wifi.show();
    });

    $(".page-connected .next").click(function (event) {
        event.preventDefault();
        clearInterval(net.connectedDownTimer);
        srouter.init.wifi.show();
    });

};

srouter.init.net.show = function () {
    var net = srouter.init.net;
    net.submitting = false;

    // 从错误界面回来， 出现倒计时不正确
    if (net.checkResult == net.TYPE_PPPOE) { // 预检已经有了结果，就无需再检测。
        net.showSubPage("pppoe", false);
    } else if (net.checkResult == net.TYPE_DHCP) { // 预检已经有了结果，就无需再检测。
        net.showSubPage("dhcp", false);
    } else {
        net.checkStart();
    }

    srouter.init.wifi.preload();
};

srouter.init.net.checkStart = function () {
    var net = srouter.init.net;
    log("/router/get_wan_type.cgi request");
    srouter.init.common.ajax("/router/get_wan_type.cgi", {uiname: "WAN1"}, function (data) {
        log("/router/get_wan_type.cgi result" + data);
        //{“wan_type”: “0/1/2/3”} : WAN口类型，0:未知， 1:DHCP  2:PPPOE 3: DHCP+PPPOE 
        if (data && data.wan_type) {
            if (data.wan_type == 0) {
                net.checkResult = net.TYPE_UNKNOWN;
            } else if (data.wan_type == 1) {
                net.checkResult = net.TYPE_DHCP;
            } else if (data.wan_type == 2) {
                net.checkResult = net.TYPE_PPPOE;
            } else if (data.wan_type == 3) {
                // 默认PPPOE
                net.checkResult = net.TYPE_PPPOE;
            }
        } else {
            net.checkResult = net.TYPE_UNKNOWN;
        }
        net.checkDone();
    }, function () {
        net.checkResult = net.TYPE_UNKNOWN;
        net.checkDone();
    });
};

// srouter.init.net.stopWait = function() {
//     // 检测方式是提前开始的，可能用户还没点击欢迎页面的开始
//     // 这时候不能进行跳转页面
//     var net = srouter.init.net;
//     net.checkWaitClickBegin = false;
// };

srouter.init.net.checkWaitTimer = null;

srouter.init.net.checkDone = function () {
    var net = srouter.init.net;

    // if (net.checkWaitClickBegin) {
    //     net.checkWaitTimer = setTimeout(net.checkDone, 1000);
    //     return;
    // } else {
    if (net.checkWaitTimer) {
        clearTimeout(net.checkWaitTimer);
    }
    // }

    if (net.checkResult == net.TYPE_PPPOE) {
        net.showSubPage("pppoe", true);
    } else if (net.checkResult == net.TYPE_DHCP) {
        net.showSubPage("dhcp", true);
    } else if (net.checkResult == net.TYPE_STATIC) {
        net.showSubPage("ip", true);
    } else {
        net.showSubPage("pppoe", true);
        net.checkResult = net.TYPE_PPPOE;
    }
    net.type = net.checkResult;
};


srouter.init.net.hideEverything = function () {
    $('.page').hide();
};

srouter.init.net.showSubPage = function (page) {
    var net = srouter.init.net;
    srouter.init.net.hideEverything();
    log("go page: " + page);

    if (page == "ip") {
        setNetWorkMethod("ip");
        $('.page-set-network').show();
        net.type = net.TYPE_STATIC;
    } else if (page == "pppoe") {
        setNetWorkMethod("pppoe");
        $('.page-set-network').show();
        net.type = net.TYPE_PPPOE;
    } else if (page == "dhcp") {
        setNetWorkMethod("dhcp");
        $('.page-set-network').show();
        net.type = net.TYPE_DHCP;
    }
	else if (page == "static") {
        setNetWorkMethod("ip");
        $('.page-set-network').show();
        net.type = net.TYPE_STATIC;
    }

    if (page == "test-network") {
        $(".page-test-network .count-down").text(15);
    }

    $(".page-" + page).show();
};


srouter.init.net.showConnnecting = function () {
    var net = srouter.init.net;

    if (net.countDownTimer) {
        clearInterval(net.countDownTimer);
    }
    net.showSubPage("test-network");

    // 倒计时15s
    var countDown = 15;
	$('.page-test-network .count-down').text(countDown);
    net.countDownTimer = setInterval(function () {
        countDown--;
		if (countDown == 0) {
            clearInterval(net.countDownTimer);
        }
        $('.page-test-network .count-down').text(countDown);
    }, 1000);
};

srouter.init.net.submit = function () {
    var net = srouter.init.net;
    if (net.submitting) {
        return;
    }

    // 检查参数
    if (!net.checkForm()) {
        return;
    }

    net.submitting = true;

    // 发出拨号命令
    var cmdPrefix = "";
    var params = {
        dns_type: 0,
        isp_radio: "AUTO",
        time: 1,
        dns1: "",
        dns2: "",
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
        sunday: 7
    };

//    页面点击事件统计新增
    var ddCountInfo = {
        DHCP:"3101",
        PPPOE:"3100",
        STATIC:"3102"
    };

    var setting = getNetworkSetting();
    net.type = setting.method;
    if (net.type == "dhcp") {
        params.connect_type = "DHCP";
    } else if (net.type == "pppoe") {
        var username = setting.data['pppoe-username'];
        var password = setting.data['pppoe-password'];
        params.user = base64encode(utf16to8(username));
        params.pass = getAesString(password);
        params.connect_type = "PPPOE";
        params.pppoe_conf_radio = "MANU",
            //从接口获取mtu为1500
            params.mtu = 1480;
        params.out_time = 15;
        params.out_time_dr = 15;
        params.pppoe_conf = "AUTO";
		var d = new Date();
		params.b64 = d.getTime();

    } else if (net.type == "ip") {
        //ip=192.168.5.5&mask=255.255.255.0&gw=192.168.5.1&mac=5C-F9-DD-76-7D-49&mtu=1500&dns1=23.23.23.23&dns2=12.12.12.12
        var ip = setting.data['ip-ip'];
        var mask = setting.data['ip-mask'];
        var dns1 = setting.data['ip-dns1'];
        var dns2 = setting.data['ip-dns2'];
        var gateway = setting.data['ip-gateway'];
        params.ip = ip;
        params.mask = mask;
        params.gw = gateway;
        params.dns1 = dns1;
        params.dns2 = dns2;
        params.connect_type = "STATIC";
    }


    srouter.init.common.ajax("/router/wan_config_show.cgi", {uiname: "WAN1"}, function (data) {
        user_fov_info.appInfo(ddCountInfo[params.connect_type]);
        if (data && data.COMMON) {
            var param2 = $.extend({}, data.COMMON, params);
            param2.mac = param2.mac_default;
            param2.work_mode_radio = param2.work_mode;

            log("/router/wan_config_show.cgi result SUCCESS " + data);
            srouter.init.common.ajax("/router/wan_config_set.cgi", param2, function (data2) {
                if (data2 == "SUCCESS") {
                    log("/router/wan_config_set.cgi result SUCCESS " + data2);
                    net.submitRead();
                } else {
                    log("/router/wan_config_set.cgi result not SUCCESS " + data2);
                    net.submitDone();  // start命令非正常返回，就不用read了。 直接处理结果。
                }
            }, function () {
                log("/router/wan_config_set.cgi request failed");
            });

            log("/router/wan_config_show.cgi result SUCCESS " + data);
        } else {

            log("/router/wan_config_show.cgi  result not SUCCESS " + data);
        }
    }, function () {
        log("/router/wan_config_show.cgi request failed");
    });

    net.showConnnecting();
};

srouter.init.net.submitRead = function () {
    var net = srouter.init.net;

    srouter.init.common.ajax("/router/interface_status_show.cgi", {}, function (data) {
        //[{"WAN1":{"status":"0","ip":"10.127.0.2"}},{"LAN":{"status":"0","ip":"192.168.36.1"}}]
        //status:  0: 正常  1: 未接线  2: 接线但未获取到IP  3: 有IP，DNS通断检测中/失败
        if (data) {
            for (var i = 0; i < data.length; i++) {
                if (data[i].WAN1 && data[i].WAN1.status && data[i].WAN1.status == 1) {
                    net.showSubPage("cable-error");
                    return;
                }
            }
            net.submitDoRead().then(function(){
                net.submitResult = 0;net.submitDone();
            },function(){
                net.showSubPage("network-error");
            });
        } else {
            log("/router/wan_config_show.cgi result not SUCCESS" + data);
        }
    });

};

srouter.init.net.submitDoRead = function () {
    var net = srouter.init.net;
    net.connected = false;
    if (net.wanReadTimeOutTimer) {
        clearTimeout(net.wanReadTimeOutTimer);
    }

    // timeout 15s
    var detectNet = $.Deferred();
    var timeOut = 0 ;
    net.wanReadTimeOutTimer = setTimeout(function(){
        var calleeFN = arguments.callee;
        timeOut++;
        srouter.init.common.ajax("/router/detect_net.cgi", {noneed: "noneed", timeout: 10}, function (data) {
            if (data["detect_res"]>>0>0) {
                detectNet.resolve();
            }else if(data["detect_res"] ==="0" || timeOut>=15){
                detectNet.reject();
            }else{
                net.wanReadTimeOutTimer = setTimeout(calleeFN,1000);
            }
        });
    },1000);
    return detectNet.promise();
};

// 读取submitResult的值。决定显示哪个页面。
srouter.init.net.submitDone = function () {
    var net = srouter.init.net;

    if (net.wanHttpDetectTimer) {
        clearInterval(net.wanHttpDetectTimer);
    }
    if (net.wanReadTimeOutTimer) {
        clearTimeout(net.wanReadTimeOutTimer);
    }
    if (net.connected) {
        return;
    }
    net.submitting = false;
    if (net.submitResult == 0) {
        net.showSubPage("connected");
        net.connected = true;
        // 倒计时5s
        var countDown = 5;
		$(".page-connected .count-down").text(countDown);
        net.connectedDownTimer = setInterval(function () {
            countDown--;
			if (countDown == 0) {
                clearInterval(net.connectedDownTimer);
                srouter.init.wifi.show();
            }
            $(".page-connected .count-down").text(countDown);
        }, 1000);
    } else {
       // net.showSubPage("forget-password");
	   net.showSubPage("static");
    }
};
// 检查表单参数是否合法
srouter.init.net.checkForm = function () {
    var net = srouter.init.net;
    var common = srouter.init.common;
    var setting = getNetworkSetting();
    if (setting.method == "pppoe") {
        var username = setting.data['pppoe-username'];
        var password = setting.data['pppoe-password'];

        if (!username || $.trim(username) == "") {
            showError("pppoe-username", L.pppoe_not_null);
            return false;
        }
		if (/[\\'"<>]+/g.test(username)) {
            showError("pppoe-username", L.pppoe_not_correct);
            return false;
        }
		if (username.length > 127) {
            showError("pppoe-username", L.pppoe_len_not_correct);
            return false;
        }
		/*if (/[\\'"<>\u00FF-\uFFFF\s]+/g.test(username)) {
            showError("pppoe-username", L.not_chinese);
            return false;
        }*/
        if (!password || $.trim(password) == "") {
            showError("pppoe-password", L.pppoe_pwd_not_null);
            return false;
        }
		if (/[\\'"<>\u00FF-\uFFFF\s]+/g.test(password)) {
            showError("pppoe-password", L.pppoe_pwd_not_correct);
            return false;
        }
		if (password.length > 127) {
            showError("pppoe-password", L.pppoe_pwd_len_not_correct);
            return false;
        }
    } else if (setting.method == "ip") {
        var ip = setting.data['ip-ip'];
        var mask = setting.data['ip-mask'];
        var dns1 = setting.data['ip-dns1'];
        var dns2 = setting.data['ip-dns2'];
        var gateway = setting.data['ip-gateway'];

        if (!ip || $.trim(ip) == "") {
            showError("ip-ip", L.ip_not_blank);
            return false;
        }
		if (common.validateIp(ip) != true) {
            showError("ip-ip", L.ip_incorrect);
            return false;
        }
        if (!mask || $.trim(mask) == "") {
            showError("ip-mask", L.mask_not_blank);
            return false;
        }
		if (common.validateMask(mask) != true) {
            showError("ip-mask", L.mask_incorrect);
            return false;
        }
        if (common.checkIpMask(ip, mask) != true) {
            showError("ip-mask", L.mask_incorrect);
            return false;
        }
        if (!gateway || $.trim(gateway) == "") {
            showError("ip-gateway", L.getway_not_blank);
            return false;
        }
		if (common.checkGetWayMask(gateway, mask) != true) {
            showError("ip-gateway", L.getway_incorrect);
            return false;
        }
        if (common.validateIp(gateway) != true) {
            showError("ip-gateway", L.getway_incorrect);
            return false;
        }
		var msg = common.checkIpGateMask(ip, gateway, mask);
		if (msg != true) {
            showError("ip-ip", msg);
            return false;
        }
        if (!dns1 || $.trim(dns1) == "") {
            showError("ip-dns1", L.dns_not_blank);
            return false;
        }
        if (dns1 == "" || common.validateIp(dns1) != true) {
            showError("ip-dns1", L.dns_incorrect);
            return false;
        }
        if (dns2 != "" && common.validateIp(dns2) != true) {
            showError("ip-dns2", L.dns_incorrect);
            return false;
        }
    }
    return true;
};

//---------------------------- net end --------------------------------------


//---------------------------- wifi start -----------------------------------
srouter.init.wifi = {};
srouter.init.wifi.formElement = null;
srouter.init.wifi.nameElement = null;
srouter.init.wifi.passElement = null;

srouter.init.wifi.submitting = false;
srouter.init.wifi.countDownTimer = null;
srouter.init.wifi.countDown = 10;


srouter.init.wifi.init = function () {
    var wifi = srouter.init.wifi;
    wifi.formElement = $(".page-set-wifi form");
    wifi.nameElement = $(".page-set-wifi .input-wifi-ssid");
    wifi.passElement = $(".page-set-wifi .input-wifi-password");
    wifi.adminPassElement = $(".page-set-wifi .input-admin-password");
    wifi.samePassElement = $(".page-set-wifi .checkbox-same-password");
    wifi.formElement.submit(function (event) {
        event.preventDefault();
		wifi.passElement.parent().find("span.error-tip").css("display","");
		wifi.adminPassElement.parent().find("span.error-tip").css("display","");
        wifi.submit();
    });
    wifi.passElement.keyup(function (event) {
        //不能阻止 event.preventDefault();
		if(event.keyCode == 13){
			$(this).parent().find("span.strength").css("display","none");
			$(this).parent().find("span.error-tip").css("display","");
		}
		else{
        	wifi.showPassStrange($(this));
			$(this).parent().removeClass("error").find("span.error-tip").hide();
		}
    });
    wifi.adminPassElement.keyup(function (event) {
        //不能阻止 event.preventDefault();
	   if(event.keyCode == 13){
			$(this).parent().find("span.strength").hide();
			$(this).parent().find("span.error-tip").css("display","");
		}
		else{
			wifi.showPassStrange($(this));
			$(this).parent().removeClass("error").find("span.error-tip").hide();
			
		}
    });
    wifi.samePassElement.unbind("change").bind("change", function () {
        var val = $(this).val();
        wifi.adminPassElement[$(this).prop("checked") ? "hide" : "show"]();
        var $adminPassParent = wifi.adminPassElement.parent();
        if ($(this).prop("checked")) {
            wifi.passElement.attr("placeholder", L.wifi_admin_pass);
            wifi.formElement.find(".tip").show();
            $adminPassParent.hide();
        } else {
            wifi.passElement.attr("placeholder", L.wifi_pass);
            wifi.formElement.find(".tip").hide();
            $adminPassParent.show();
        }

    });
};

srouter.init.wifi.preload = function () {
    var wifi = srouter.init.wifi;
    var params = {
        ap_id: 0,
        op: "dump",
        port_id: "WIFI1"
    };
    srouter.init.common.ajax("/router/wireless_base_sec_ap_op.cgi", params, function (data) {
        if (data) {
            //AP_SSID: "360wifi-dddd"ap_mode: "4"network_mode: "0"wep_key: ""wire_enable: "1"wpa_key: "b97bc0679d56d10c5b49219853ef568d"
            wifi.ssid = data.AP_SSID;
            wifi.nameElement.val(wifi.ssid).focus();
            wifi.passElement.val("");
            log("/router/wireless_base_show.cgi result SUCCESS" + data);
        } else {
            log("/router/wireless_base_show.cgi result not SUCCESS" + data);
        }
    });
};


srouter.init.wifi.show = function () {
    var wifi = srouter.init.wifi;
    wifi.showSubPage("set-wifi");
    user_fov_info.appInfo("3103");
};

srouter.init.wifi.hideEverything = function () {
    $('.page').hide();
    // $('.page-set-wifi').hide();
    // $('.page-reboot').hide();
    // $('.page-end').hide();
};


//fade: true代表渐进渐出
srouter.init.wifi.showSubPage = function (page) {
    var wifi = srouter.init.wifi;
    log("show page " + page);
    wifi.hideEverything();
    $(".page-" + page).show();
};


srouter.init.wifi.showPassStrange = function (emt) {
    var wifi = srouter.init.wifi;
	var _val = emt.val();
	var _type = emt.attr("device_type");
	if(_val == ""){
		if(_type == "pc"){
			emt.siblings('.strength').hide();
		}
		if(_type == "mobile"){
			$('.strength-box .strength').hide();
		}
	}
	else{
		if(_type == "pc"){
			emt.siblings('.strength').show();
		}
		if(_type == "mobile"){
			$('.strength-box .strength').show();
		}
	}
    var level = checkStrong(_val);
    var strange;
    if (level == 0) {
        strange = "weak";
    } else if (level == 1) {
        strange = "weak";
    } else if (level == 2) {
        strange = "normal";
    } else {
        strange = "strong";
    }
    setWifiPasswordStrength(strange, emt);
}

srouter.init.wifi.submit = function () {
    var wifi = srouter.init.wifi;
    if (!wifi.checkForm()) {
        return;
    }
    // 正在提交
    if (wifi.submitting) {
        return;
    }
    wifi.submitting = true;

    var rand_key_obj = get_rand_key(0);
    var old_pwd = getAesString("admin", rand_key_obj);
    var pass = "";
    if (wifi.samePassElement.prop("checked")) {
        pass = getAesString(wifi.passElement.val(), rand_key_obj);
    } else {
        pass = getAesString(wifi.adminPassElement.val(), rand_key_obj);
    }
    var params = {
        old_password: old_pwd,
        pwd1: pass,
        pwd2: pass
    };
    srouter.init.common.ajax("/router/new_user_pass_set.cgi", params, function (data) {
        if (data == "SUCCESS") {
            srouter.init.wifi.dosubmit();
        }
        // 流程结束
        srouter.init.wifi.submitting = false;
    }, function () {
        // 出现网络错误
        srouter.init.wifi.submitting = false;
    });

    wifi.showSubPage("reboot");
    wifi.startCountDown();
};


srouter.init.wifi.dosubmit = function () {
    var wifi = srouter.init.wifi;
    var ssid = wifi.nameElement.val();
    var password = getAesString(wifi.passElement.val());

    var param = {
        action: "mod"
    };

    var secparams = {
        ap_id: 0,
        op: "add",
        port_id: "WIFI1",
        AP_SSID: ssid,
        wire_enable: 1,
        ap_mode: 4,
        wpa_key: password,
        wpa_keytime: 3600,
        wpa_mode: 0,
        wpa_tkaes_flag: 0
    };

    srouter.init.common.ajax("/router/igd_param_status.cgi", param, function (data) {
        log("/router/igd_param_status.cgi result SUCCESS" + data);
        if (data == "SUCCESS") {
            srouter.init.common.ajax("/router/wireless_base_sec_ap_op.cgi", secparams, function (data2) {
                if (data2 == "SUCCESS") {
                    log("/router/wireless_base_sec_ap_op.cgi result SUCCESS" + data2);
                    srouter.init.wifi.submitDone();
                } else {
                    log("/router/wireless_base_sec_ap_op.cgi result not SUCCESS" + data2);
                }
            }, function () {
                // Retry
                log("/router/igd_param_status.cgi request failed");
            });
        }
    }, function () {
        log("/router/igd_param_status.cgi request failed");
    });
};


srouter.init.wifi.submitDone = function () {
    var wifi = srouter.init.wifi;
    wifi.submitting = false;
};

srouter.init.wifi.startCountDown = function () {
    var wifi = srouter.init.wifi;
	$(".page-reboot .count-down").text(wifi.countDown);
    wifi.countDownTimer = setInterval(function () {
        var wifi = srouter.init.wifi;
        wifi.countDown--;
		if (wifi.countDown == 0) {
            clearInterval(wifi.countDownTimer);
            $(".page-end .wifi-name-2-4").text("2.4G WiFi:" + wifi.nameElement.val());
			$(".page-end .wifi-name-5").text("5G WiFi:" + wifi.nameElement.val() + "-5G");
            $(".page-app-end .wifi-name").text(wifi.nameElement.val());

            if (isJumpMagView() == true) {
                //pc页面直接跳入end页面
                wifi.showSubPage("end");
                wifi.checkWifiConnect();
            } else {
                if (location.search.replace(" ", "").indexOf("action=app") != -1) {
                    wifi.showSubPage("app-end");
                } else {
                    wifi.showSubPage("end");
                }
                wifi.checkWifiConnect();
            }
            return;
        }
        $(".page-reboot .count-down").text(wifi.countDown);
    }, 1000);
};

srouter.init.wifi.checkWifiConnect = function () {

    var skipUrl = window.location.pathname.indexOf("mobile")>-1?"/login_mobile.htm":"/login_pc.htm";
//    window.location.href=skipUrl;

    setTimeout(function () {
        //jquery有跳转逻辑
        srouter.init.common.ajax(skipUrl, {}, function (data) {

        }, function (data) {
            var wifi = srouter.init.wifi;
            setTimeout(wifi.checkWifiConnect, 1000);
        });
    }, 3000);
};

srouter.init.wifi.checkForm = function () {
    var wifi = srouter.init.wifi;
    var name = wifi.nameElement.val();
    if (!name || $.trim(name) == "") {
        showError("wifi-ssid", L.wifi_name_not_null);
        return false;
    }
    if (name.length > 29) {
        showError("wifi-ssid", L.wifi_name_lt_29);
        return false;
    }
	var name_obj = {};
	name_obj.value = name;
	name_obj.maxLength = 29;
	var ret_val = CheckLength(name_obj).toString();
	if(ret_val != "true"){
		showError("wifi-ssid", ret_val);
		wifi.nameElement.val(name_obj.value);
	}
	if (/[\\'"<>]+/g.test(name)) {
        showError("wifi-ssid", L.ssid_pwd_incorrect);
        return false;
    }
    var pass = wifi.passElement.val();
    //|| !/^[\!-\~]*$/.test(pass)
	if(pass == "" && wifi.samePassElement.prop("checked")){
		show_dialog(L.wifi_null_tip, function () {
			wifi.samePassElement.click();
			wifi.adminPassElement.focus();
		},null,"init_wifi");	
		return;
	}
	if(pass != ""){
		if (/[\u00FF-\uFFFF]+/.test(pass)) {
			showError("wifi-password", L.pwd_not_chinese);
			return false;
		}
		if (/[\\'"<>]+/g.test(pass)) {
			showError("wifi-password", L.ssid_pwd_incorrect);
			return false;
		}
		if (pass.length < 8 || pass.length > 64) {
			showError("wifi-password", L.pwd_8_64);
			return false;
		}
	}
    if (!wifi.samePassElement.prop("checked")) {
        var adminPass = wifi.adminPassElement.val();
        //|| !/^[\!-\~]*$/.test(adminPass)
        if (/[\u00FF-\uFFFF]+/.test(adminPass)) {
            showError("admin-password", L.pwd_not_chinese);
            return false;
        }
        if (/[\\'"<>]+/g.test(adminPass)) {
            showError("admin-password", L.ssid_pwd_incorrect);
            return false;
        }
        if (adminPass.length < 8 || adminPass.length > 64) {
            showError("admin-password", L.pwd_8_64);
            return false;
        }
    }
    return true;
};

//---------------------------- wifi end -------------------------------------


//---------------------------- common start ---------------------------------
srouter.init.common = {};

srouter.init.common.validateIp = function (ip) {	
	if (/^((22[0-3])|(2[0-1]\d)|(1\d\d)|([1-9]\d)|[1-9])(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3}$/g.test(ip) && !(/^127.*$/g.test(ip))) {
		return true;
    }
    return false;
};

srouter.init.common.validateMask = function (ip) {
	if (/^((128|192|224|240|248|252|254)\.0\.0\.0)|(255\.(((0|128|192|224|240|248|252|254)\.0\.0)|(255\.(((0|128|192|224|240|248|252|254)\.0)|255\.(0|128|192|224|240|248|252|254)))))$/g.test(ip)) {
        return true;
    }
    return false;
};

srouter.init.common.checkIpMask = check_ip_mask;
srouter.init.common.checkGetWayMask=check_getway_mask;
srouter.init.common.checkIpGateMask = check_wan_lan_ip;

srouter.init.common.ajax = function (url, params, onSuccess, onError) {
    var timeout = 20 * 1000; // 20 s
    if ("/router/igd_param_status.cgi" == url) {
        timeout = 15; // 15s
    }
    var type = 'POST';
    var dataType = 'json';
    if ("/login_pc.htm" == url || "/login_mobile.htm" == url) {
        dataType = 'html';
        type = 'GET';
    }
    $.ajax({
        url: url,
        type: type,
        data: params,
        cache: false,
        timeout: timeout,
        dataType: dataType,
        success: function (data, status, xhr) {
            if (onSuccess) {
                onSuccess(data);
            }
        },
        error: function () {
            if (onError) {
                onError();
            }
        }
    });
};

function log(msg) {
    if (window["console"]) {
        console.log(msg);
    }
}

function init_quick_setup_language(name){
	var map = language[language_type]["HTML"][name];
	var placeholder_flag = false; 
	if('placeholder' in document.createElement('input'))//支持placeholder
		placeholder_flag = true;
	for (var i in map) {
		//很多类冲突，所以改用id
		if($("#" + i).is("table")){
			$("#" + i + " td").each(function(j){
				$(this).html(map[i][j]);
			});
		}
		else
			$("#" + i).html(map[i]);
		
		//data-type
		if($("#" + i).is("button") && $("#" + i).attr("data-type") != ""){
			$("#" + i).attr("data-info",map[i + "_data_type"])
		}
		
		//placeholder
		if(i.indexOf("placeholder") != -1){
			var name = i.replace("_placeholder","");
			if(placeholder_flag)
				$("input[name=" + name + "]").attr("placeholder",map[i]);
			else
				$("input[name=" + name + "]").next("span").eq(0).html(map[i]);
		}

	}
}

// document.ready
$(document).ready(function () {
	var page_from = $("#page_type").val();
	init_quick_setup_language(page_from+"_index");
    srouter.init.welcome.init();
    srouter.init.net.init();
    srouter.init.wifi.init();
    srouter.init.welcome.start();
});
