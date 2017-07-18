/********************************应用菜单********************************************************/

var g_devid_seq = "";
var g_prod_id = "";
var g_bind_id = "";
var g_app_data_list_item = {};
var g_app_data = {};
//qihoo360 dns arp_defence
var g_app_state = {
    "qh_360": 0,
    "dns": 0,
    "arp": 0,
    "ddos": 0,
    "pwd": 0,
    "wifipassstrength": 0,
    "securitypwdstrength": 0,
    "safety_wireless": 0,
    "wifienable": 1
};

function init_nav_protection(appsign) {
    g_devid_seq = "";
    g_prod_id = "";
    g_bind_id = "";
    $("#app_content").unbind("change").bind("change", function () {
        var file_name = getFileName($(this).val());
        $("#app_file_name").attr("title", file_name);
        $("#app_file_name").html(count_length(file_name, 27));
    });
    window.onbeforeunload = null;
    set_app_data(appsign, "nav_protection");
}

function bootqh_360() {
    var deferred = $.Deferred();
    if (g_app_state["qh_360"] == 0) {
        $.ajax({
            type: "get",
            url: '/app/qh_360/webs/qh360_set.cgi?enable=1',
            async: false,
            dataType: "json",
            success: function (ret) {
                if (ret[0] == 'SUCCESS') {
                    deferred.resolve({
                        res: 1
                    });

                    //alert('1');
                } else {
                    deferred.reject({
                        res: 0
                    });
                }
            }
        });
    } else {
        deferred.resolve({
            res: 1
        });
    }
    return deferred.promise();
}

function bootdns() {
    var deferred = $.Deferred();
    if (g_app_state["dns"] == 0) {
        $.ajax({
            type: "get",
            url: '/app/dns_tramper/webs/dns_set_switch.cgi?switch=1',
            async: false,
            dataType: "json",
            success: function (ret) {
                if (ret.err_no == '0') {
                    deferred.resolve({
                        res: 1
                    });

                    //alert('1');
                } else {
                    deferred.reject({
                        res: 0
                    });
                }
            }
        });
    } else {
        deferred.resolve({
            res: 1
        });
    }
    return deferred.promise();
}

function bootarp() {
    var deferred = $.Deferred();
    if (g_app_state["arp"] == 0) {
        $.ajax({
            type: "get",
            url: '/app/arp_oversee/webs/arp_defence.cgi?arp_mode=1',
            async: false,
            dataType: "json",
            success: function (ret) {
                if (ret[0] == 'SUCCESS') {
                    $.ajax({
                        type: "get",
                        url: '/app/arp_oversee/webs/ipmac_stolen_set.cgi?enable=1',
                        async: false,
                        dataType: "json",
                        success: function (ret) {
                            if (ret[0] == 'SUCCESS') {
                                deferred.resolve({
                                    res: 1
                                });
                            } else {
                                deferred.reject({
                                    res: 0
                                });
                            }
                        }
                    });
                } else {
                    deferred.reject({
                        res: 0
                    });
                }
            }
        });
    } else {
        deferred.resolve({
            res: 1
        });
    }
    return deferred.promise();
}

function onekeyboot() {
    var deferred = $.Deferred();
    $.when(bootqh_360(), bootdns(), bootarp()).then(function (val1,val2,val3) {
		if (val1 == 0) {
			$("#qh_360 .menu_text .status").html(L.enable);
			$("#qh_360").removeClass("red gray yellow");
			g_app_state["qh_360"] = 1;
		} 
		if (val2 == 1) {
			$("#dns_tramper  .menu_text .status").html(L.enable);
			$("#dns_tramper").removeClass("red gray yellow");
			g_app_state["dns"] = 1;
		} 
		if (val3 == 2) {
			$("#arp_oversee  .menu_text .status").html(L.enable);
			$("#arp_oversee").removeClass("red gray yellow");
			g_app_state["arp"] = 1;
		}
        var safeState = getALLSafeStateByArr(g_app_state);
        var safe_state = "";
        var statestr_css = "";
        switch (safeState) {
            case 1:
                safe_state = L.is_risk;
                statestr_css = "#ff0000";
                break;
            case 2:
                safe_state = L.safe;
                statestr_css = "#428bef";
                break;
        }
        $(".protection_container .safe_status .safe_status_value").html(safe_state);
        $(".protection_container .safe_status .safe_status_value").css("color", statestr_css);
        //deferred.resolve([finalSafety.safety_wireless, finalSafety.qh_360, finalSafety.dns, finalSafety.arp, finalSafety.ddos, finalSafety.pwd, finalSafety.wifipassstrength, finalSafety.securitypwdstrength,finalSafety.all]);
    });
    return deferred.promise();
}

function init_nav_addon(appsign) {
    g_devid_seq = "";
    g_prod_id = "";
    g_bind_id = "";
    $("#app_content").unbind("change").bind("change", function () {
        var file_name = getFileName($(this).val());
        $("#app_file_name").attr("title", file_name);
        $("#app_file_name").html(count_length(file_name, 27));
        $("#focus_help").focus();
    });
    window.onbeforeunload = null;
    set_app_data(appsign, "nav_addon");
    init_language("nav_addon");
    var token_id = TOOLS.Url.getQueryString()["token_id"];
    $("#add_app_form").attr("action", "/router/add_app.cgi?token_id=" + token_id);
}
function init_nav_setting(appsign) {
    paint_tab();
}


function set_app_data(appsign, app_group_name) { //带参数代表详细页
    $.when(get_plugins_status(),_init_install_plugin()).done(function(){
        g_app_data = {};
        var data = igd.app_list[app_group_name];
        for (var k in data) {
            for (var i in data[k].list) {
                var item = data[k].list[i];
                g_app_data[item.appsign] = item;
            }
        }
        if (!appsign) {
            var paint_fun = window["paint_" +
            "" + app_group_name + "_list"];
            if (typeof paint_fun == "function") {
                window["paint_" + app_group_name + "_list"](data);
            }
        } else {
            show_app_detail(appsign);
        }
    });
}


//nav_protection app list
var protectStateArray = [
    {statestr: L.unprotect, statestr_css: "unpro"},
    {statestr: L.protecting, statestr_css: "pro"}
];
var allSafeSate = [
    {safe_state: L.unprotect, statestr_css: "#ff0000"},
    {safe_state: L.unprotect, statestr_css: "#ff0000"},
    {safe_state: L.safe, statestr_css: "#418aee"}
];
var safeStateArray = [
    {statestr: L.low, tstatestr: L.is_risk, statestr_css: "yellow"},
    {statestr: L.medium, tstatestr: L.safe, statestr_css: ""},
    {statestr: L.high, tstatestr: L.safe, statestr_css: ""}
];
var pwdStatusArray = [
    {safe_state: L.is_risk, statestr_css: "#ff0000"},
    {safe_state: L.safe, statestr_css: "#418aee"}
];
var openStateArray = [//包括单选按样式 文本样式
    {statestr: L.closed, radiostr_css: "radio_off", textstr_css: "#ff0000"},
    {statestr: L.is_open, radiostr_css: "radio_on", textstr_css: "#418aee"}
];
function paint_nav_protection_list(app_data) {
    //加载安全状态太信息简介

    getSafeStateData().then(function (data) {
        if (current_html != "nav_protection")
            return;
        $("#app_section").removeClass("section_hide").addClass("section_show");
        $("#app_detail").removeClass("section_show").addClass("section_hide");
        $("#app_list").html("");
        //设置tab头信息
        var tab_html_str = "";
        var app_type_item = app_data[0];
        var info = igd.app_list.nav_firewall[0];
        var header = "<div id=\"app_intro\"><div id=\"app_img\"><img src=\"" + info.icon + "\"/></div><div id=\"app_intro_list\"><div class=\"app_info\"><span class=\"app_name\">" + info.appname + "</span><span class=\"app_version\">"+ L.version +":" + info.version + "</span><span class=\"app_author\">"+ L.issuer +":" + info.author + "</span></div><div id=\"app_detail_area\"><p>"+ L.app_intro +":" + info.description + "</p></div></div></div>";

        tab_html_str += "<div class='protection_container'>" + header + "<div class='safe_status'>"+ L.network_status +"<span class='safe_status_value' style=color:" + allSafeSate[data[6]]["statestr_css"] + ">" + allSafeSate[data[6]]["safe_state"] + "</span><div class='security-status' style='font-size: 12px'>" + renderStatus(data) + "</div></div>";
        var app_type_list_item = app_type_item["list"];

        //循环添加插件
        //tab_html_str += "<ul>"
        //tmp数据模版
        var datamap = {
            "appsign": "",
            "appname": "",
            "version": "",
            "dep_version": "0",
            "tips": "",
            "url": "",
            "description": "",
            "bin_start": "",
            "author": "",
            "URL": "",
            "maintainer": "",
            "email": "",
            "app_type": "",
            "icon": ""
        };
        var len = 6;
        for (var i = 0; i < app_type_list_item.length; i++) {
            g_app_data_list_item[app_type_list_item[i].appsign] = app_type_list_item[i];
            var item = g_app_data[app_type_list_item[i].appsign];
            if (item) {
                item.cursorStyle = "";
                item.psdStr = "";

                if (item.appsign != "security_pwd") {//密码安全无按钮，且表格内容不一样
                    item.statestr = openStateArray[data[i]]["statestr"];
                    item.radiostr_css = openStateArray[data[i]]["radiostr_css"];
                    item.textstr_css = openStateArray[data[i]]["textstr_css"];

                    item.protectstr = protectStateArray[data[i]]["statestr"];
                    item.protect_css = protectStateArray[data[i]]["statestr_css"];
                }
                else {
                    item.statestr = "";
                    item.radiostr_css = "";
                    item.textstr_css = "";
                    item.protectstr = "";
                    item.protect_css = "";
                }

                var tableStr = "<table class=\"safe_firewall_tab\">";
                var list_arr = item.list;
                tableStr += "<tr>";
                for (var j in list_arr) {
                    if (i == 3) {
                        if (!data[7] && !(j * 1)) {
                            tableStr += "<th> WiFi&nbsp;"+ L.is_close +"</th>";
                        }
                        else {
							if(j == 0)
                            	tableStr += "<th>" + list_arr[j] + "&nbsp;" + safeStateArray[data[3]]["statestr"] + "</th>";
							else
								tableStr += "<th>" + list_arr[j] + "&nbsp;" + safeStateArray[data[5]]["statestr"] + "</th>";
                        }

                    }
                    else
                        tableStr += "<th>" + list_arr[j] + "</th>";
                }
                tableStr += "</tr><tr>";

                var strenth = getPwdState(data[3], data[5]);
                for (var j in list_arr) {
                    if (i == 3) {
						var retStr = "";
						if(j == 0)
                        	retStr = paint_pwd_choice(data[3], j);
						else if(j == 1)
							retStr = paint_pwd_choice(data[5], j);
                        tableStr += retStr;
                    }
                    else
                        tableStr += "<td><div class=\"round {{protect_css}}\">{{protectstr}}</div></td>";
                }
                tableStr += "</tr></table>";
                var itemTemp = "";
                if (i != 3)
                    itemTemp += "<div id='{{appsign}}' class=\"item_wrap\"><div class=\"info\"><div class=\"item_status\"><h2>{{appname}}</h2><div id=\"{{appsign}}_radio\" class=\"radio_toggle {{radiostr_css}}\"></div><div class=\"{{appsign}}_status status \" style=\"color:{{textstr_css}}\">{{statestr}}</div><button class=\"view-detail view_more_btn\">"+ L.view_protect_detail +"</button></div><div class=\"description\">{{tips}}</div></div>";
                else
                    itemTemp += "<div id='{{appsign}}' class=\"item_wrap\"><div class=\"info\"><div class=\"item_status\"><h2>{{appname}}</h2><div style=\"font-size:16px; color:" + pwdStatusArray[strenth]["statestr_css"] + "\">" + pwdStatusArray[strenth]["safe_state"] + "</div></div><div class=\"description\">{{tips}}</div></div>";
                itemTemp += tableStr;
                itemTemp += "</div>";
                var itemhtml = _.template(itemTemp);
                tab_html_str += itemhtml($.extend(datamap, item));
            }
        }
        tab_html_str += "</div>";
        $("#app_list").append($(tab_html_str));

    })

    $("#app_list").undelegate(".radio_toggle", "click").delegate(".radio_toggle", "click", function () {
        radio_status_cotrol($(this).attr("id"));
    });

    $("#app_list").undelegate(".view-detail", "click").delegate(".view-detail", "click", function () {
		var id = $(this).parents().eq(2).attr("id");
		var newUrlToken = "#indexitem/nav_protection/normal/" + id;
		window.location.hash = newUrlToken;
        show_app_detail(id);
    });
    $("#app_list").undelegate(".wifi-pass-safe ,.admin-pass-safe", "click").delegate(".wifi-pass-safe ,.admin-pass-safe", "click", function () {
        var html_name = "password";
        var init_function = "init_password";
        var return_html_name = "nav_protection";
        var parent_html_name = "nav_setting";
        if ($(this).hasClass("wifi-pass-safe")) {
            html_name = "wireless_base";
            init_function = "init_wireless_base";
        }
		var newUrlToken = "#indexitem/nav_protection/normal/" + html_name;
		window.location.hash = newUrlToken;
        jump_sub_html(html_name, init_function, return_html_name, parent_html_name);
    })


}

function paint_pwd_choice(strenth, index) {
    var arr = ["wifi-pass-safe", "admin-pass-safe"];
    var pwdStatusStr = "";
    var str = "";
    if (strenth == 2) {
        pwdStatusStr = L.no_need_modify;
    }
    else {
        pwdStatusStr = "<a href=\"javascript:void(0);\" class=\"" + arr[index] + "\" style=\"text-decoration:underline;\">"+ L.modify_pwd +">></a>";
    }
    str += "<td>" + pwdStatusStr + "</td>";
    return str;
}

function radio_status_cotrol(id) {
    var fun = "set_" + id.split("_radio")[0] + "_status";
    var obj = $("#" + id);
    var _class = obj.attr("class");
    var status = 0;
    if (_class.indexOf(openStateArray[1]["radiostr_css"]) != -1) {//开启状态
        status = 0;
    }
    if (_class.indexOf(openStateArray[0]["radiostr_css"]) != -1) {//关闭状态
        status = 1;
    }
    eval(fun + "(id,status);");
    show_message("save");
}

function change_single_app_status(id, status) {
    var appsign = id.split("_radio")[0];
    //table
    var tds = $("#" + appsign).find("table td");
    $.each(tds, function (i, td) {
        var $div = $(td).find("div").eq(0);
        $div.html(protectStateArray[status]["statestr"]);
        $div.removeClass().addClass("round " + protectStateArray[status]["statestr_css"]);
    });
    //radio & text
    var status_text = $("." + appsign + "_status");
    if (status == 0) {
        $("#" + id).removeClass(openStateArray[1]["radiostr_css"]).addClass(openStateArray[0]["radiostr_css"]);
        status_text.html(openStateArray[0]["statestr"]).css("color", openStateArray[0]["textstr_css"]);
    }
    else {
        $("#" + id).removeClass(openStateArray[0]["radiostr_css"]).addClass(openStateArray[1]["radiostr_css"]);
        status_text.html(openStateArray[1]["statestr"]).css("color", openStateArray[1]["textstr_css"]);
    }
}

function set_qh_360_status(id, status) {
    $.post("/app/qh_360/webs/qh360_set.cgi", {enable: status}, function (data) {
        data = dataDeal(data);
        if (data[0] == 'SUCCESS') {
            show_message("success");
            change_single_app_status(id, status);
            g_app_state["qh_360"] = status;
            changeSafeState();
        }
        else {
            show_message("error", igd.make_err_msg(data));
        }
    });
}

function set_dns_tramper_status(id, status) {
    var obj = {};
    obj["switch"] = status;
    $.post("/app/dns_tramper/webs/dns_set_switch.cgi", obj, function (data) {
        data = dataDeal(data);
        if (data.err_no == "0") {
            show_message("success");
            change_single_app_status(id, status);
            g_app_state["dns"] = status;
            changeSafeState();
        } else {
            show_message("error", igd.make_err_msg(data));
        }
    });
}
function set_arp_oversee_status(id, status) {
    $.post("/app/arp_oversee/webs/arp_defence.cgi", {arp_mode: status, arp_rate: status}, function (data) {
        data = dataDeal(data);
        if (data[0] == 'SUCCESS') {
            show_message("success");
            change_single_app_status(id, status);
            g_app_state["arp"] = status;
            changeSafeState();
        }
        else {
            show_message("error", igd.make_err_msg(data));
        }
    });
}
function renderStatus(data) {
    //type==1 时为强度 0为开关
    //deferred.resolve([finalSafety.qh_360, finalSafety.dns, finalSafety.arp, finalSafety.wifipassstrength, finalSafety.pwd, finalSafety.securitypwdstrength, finalSafety.all, finalSafety.wifienable]);

//  deferred.resolve([finalSafety.qh_360, finalSafety.dns, finalSafety.arp, finalSafety.wifipassstrength, finalSafety.securitypwdstrength, finalSafety.all]);
    var getCssByLeave = function (leave, type) {
        return !!!leave ? "close" : (leave == 1 ^ !type ? "partial-open" : "open")
    };
    var allSafeSate = ["low", "middle", "high"];
    var nameMap = [L.name_map0, L.name_map1, L.name_map2, L.name_map3, L.name_map4,L.name_map5]
    var parent = $(".prectection-status-block");
    parent.find(".security-level").removeClass("close open partial-open").addClass(allSafeSate[data[8]]);
    var str1 = "";
    var str2 = "";
	if(data.length < 8){
		nameMap = [L.name_map0, L.name_map1, L.name_map2, L.name_map3,L.name_map5];
	}
    for (var i = 0; i < nameMap.length; i++) {
        //parent.find("." + nameMap[i]).removeClass("close open partial-open").addClass(getCssByLeave(data[i], 0));
        if (!data[i] && i < 3) {
            str1 += nameMap[i];
        } else if (!data[i] && i > 2) {
			str2 += nameMap[i];
        }
    }
    if (str1) {
        str1 = str1.substr(0, str1.length - 1);
        str1 = "<p>" + L.yours + str1 + L.fire_wall_not_open + "</p>";
    }
    if (str2) {
        str2 = str2.substr(0, str2.length - 1);
        str2 = "<p>" + L.yours + str2 + L.easy_guess + "</p>";
    }
    if (str1 == "" && str2 == "") {
        str1 = "<p>" + L.great_and_safe + "</p>";
    }
    return str1 + str2;

    //密码强度
}
function changeSafeState() {
    var ret = getALLSafeStateByArr(g_app_state);
    $(".safe_status_value").css("color", allSafeSate[ret]["statestr_css"]).html(allSafeSate[ret]["safe_state"]);
   $(".safe_status .security-status").html(renderStatus([g_app_state.qh_360,g_app_state.dns,g_app_state.arp,g_app_state.wifipassstrength,g_app_state.securitypwdstrength]));
}

function getPwdState(wifipwd, adminpwd) {
    if ((wifipwd == 2 && adminpwd == 2) || (wifipwd == 1 && adminpwd == 2) || (wifipwd == 2 && adminpwd == 1) || (wifipwd == 1 && adminpwd == 1))
        return 1;
    else
        return 0;
}

//nav_addon app_list
function paint_nav_addon_list(app_data) {
    $("#app_section").removeClass("section_hide").addClass("section_show");
    $("#app_detail").removeClass("section_show").addClass("section_hide");
    var tab_html_str = "",type_name = ["fast_tools","advance_tools","third_tools"],
        tab_container= $(".tab_container"),
        tab_title_wrapper= "<div id='tab_wrapper'>";
    for (var k = 0; k < app_data.length; k++) {
        //设置tab头信息
        var app_type_item = app_data[k];
        tab_title_wrapper += "<div class='tab_title'><h3>" + app_type_item["type"] + "</h3></div>";
        if (app_type_item.type) {
            tab_html_str += "<div class='tab_item_container section_hide'>";
        }
        var app_type_list_item = app_type_item["list"];
        var len = app_type_list_item.length;
        if (len > 0) {
            tab_html_str += "<ul>"
        }
        for (var i = 0; i < len; i++) {
            if(app_type_list_item[i].appsign == undefined||app_type_list_item[i].appsign == ""||!app_type_list_item[i].appsign)
                continue;
            var item = g_app_data[app_type_list_item[i].appsign];
            var isEnd = (i + 1) % 3 == 0 ? "class=\"thirdend\"" : "";
            if (item) {
				var start_status_str = "";
				if(item.start_status){
					start_status_str = "data-status=\""+ item.start_status +"\"";
				}
				var style_str = "background-image: url(\"/app/"+ item.appsign +"/"+ item.appsign +".png\")";
				var float_style_str = "background-image: url(\"/app/"+ item.appsign +"/"+ item.appsign +"_w.png\")";
                tab_html_str += "<li " + isEnd + "><div class='ext-item' id='" + item.appsign + "'"+ start_status_str +" style='"+ style_str + "'>" +
                "<div class='menu_text'>" + item.appname + "</div>" +
                "<div class='float_info' style='"+ float_style_str +"'><div class='detail'>" + " </div></div></div></li>";
            }
        }
        if (len > 0) {
            tab_html_str += "</ul>"
        }
        tab_html_str += "</div>"
    }
    tab_title_wrapper+="</div>";
	tab_container.append($(tab_title_wrapper));
	var append = function(){
		tab_container.append($(tab_html_str));
		$("#app_list").append(tab_container);
		$("#tab_wrapper").undelegate(".tab_title", "click").delegate(".tab_title", "click", function () {
			var type = type_name[$(this).index()];
			var newUrlToken = "#menu/nav_addon/";
			newUrlToken += type;
			window.location.hash = newUrlToken;
		});
		$("#app_list").undelegate(".ext-item", "click").delegate(".ext-item", "click", function () {
			var status = $(this).attr("data-status") , id = $(this).attr("id");
			if(status && status != "0"){
				if(status == "1"){//插件过期
					show_dialog(L.plugin_uninstall,function(){
						set_app_status(id,"uninstall",true);
					},null,"plugins_uninstall");
				}
				else if(status == "2"){//固件版本不支持
					show_dialog(L.plugin_undate,function(){
						window.location.hash = "#extitem/update/nav_setting";
					},null,"plugins_update");
				}
				else if(status == "3"){//挂载失败，需要重启
					show_dialog(L.plugin_restart,function(){
						window.location.hash = "#extitem/misc_reboot/nav_setting";
					},null,"plugins_restart");
				}
			}
			else{
				var newUrlToken = "#addonitem" + "/";
				//需要绘制TAB选项卡的在此添加
				newUrlToken += id;
				window.location.hash = newUrlToken;
			}
		});
	};
	//屏蔽掉第三方插件相关cgi
	//检查是否有磁盘
	//$.post("/router/system_application_config.cgi", {action: "get_storeinfo"}, function (ret) {
		//ret = dataDeal(ret);
		//if(ret.length == 0){
			//if(window.location.hash.indexOf("third_tools")>-1)
				//paint_plugin_tip_div("no-disk");
			//append();
		//}
		//else{
			if(window.location.hash.indexOf("third_tools")>-1 && !$.cookie("noShowPluginTip") && plugin_enable == "0"){
				paint_plugin_tip_div("close-plugin");
			}
			append();
			if(plugin_enable !== "0"){
				paint_add_btn();
			}
		//}
	//});
}

function paint_add_btn(){
    var len=igd.app_list.nav_addon[2].list.length,add_app_str="";
    var isEnd = (len + 1) % 3 == 0 ? "class=\"thirdend\"" : "";
    add_app_str += "<li " + isEnd + "><div class='add_app' id='add_app'>" +
    "<div class='menu_text'>" + L.add_app + "</div>" +
    "<div class='float_info'><div class='detail'>" + " </div></div></div></li >";
    $(".tab_container").find(".tab_item_container").eq(2).find("ul").append($(add_app_str));
    if(len==0){
        var ul=$("<ul>");
        ul.append($(add_app_str));
        $(".tab_container").find(".tab_item_container").eq(2).append(ul);
    }
    $("#add_app").off("click").on("click",function() {
        $("#app_file_name").html("");
		show_pop_layer("add_app_layer")
    });
}

function paint_plugin_tip_div(type){
    var tab_container= $(".tab_container"),
        plugin_tip_div=$("<div class='plugin_tip_div'></div>"),
        plugin_enable_tip=$("<span class='plugin_enable_tip'></span>"),
        plugin_btn_layer="";
	
	if(type == "no-disk"){
		plugin_btn_layer = '  <div id="plugin_btn_layer">'+
            '<input type="button" id="plugin_refresh_btn" class="btn btn_refresh">'+
            '</div>';
		plugin_enable_tip.html(L.plugin_not_find_disk);
	}
	else if(type == "close-plugin"){
		plugin_btn_layer = '  <div id="plugin_btn_layer">'+
            '<input type="button" id="plugin_set_btn" class="btn btn_immediately_set">'+
            '<input type="button" id="plugin_not_show_btn" class="btn gray margin-l btn_not_show_again">'+
            '</div>';
		plugin_enable_tip.html(L.plugin_enable_tip);
	}
    plugin_tip_div.append(plugin_enable_tip,plugin_btn_layer);
    tab_container.append(plugin_tip_div);
	
    $("#plugin_refresh_btn").off("click").on("click", function () {
		window.location.reload();
    });
	$("#plugin_set_btn").off("click").on("click", function () {
        window.location.hash="#extitem/developer/nav_setting";
    });
    $("#plugin_not_show_btn").off("click").on("click", function () {
        plugin_tip_div.slideUp();
        $.cookie( "noShowPluginTip" ,"true",{ path: '/', expires: 7 });
    });
}

function show_app_detail(appsign) {
    $("#app_section").removeClass("section_show").addClass("section_hide");
    $("#app_detail").removeClass("section_hide").addClass("section_show");
    $(".app_name,.app_version,.app_author,#app_img,#app_ctrl").html("");
    var tmp_data = g_app_data;
    for(var i in tmp_data) {
        if(appsign == tmp_data[i].appsign) {
            //添加菜单。
            if(!PAGE_INFO.menu_parent.hasOwnProperty("child")){
                PAGE_INFO.menu_parent.add_child(tmp_data[appsign].appname);
                PAGE_INFO.current_html = current_html;
            }

            $("#container_wrap .nav").remove();
            $("#container_wrap").prepend(get_nav_return_a_fn());
            if ($("#app_img").length) {
                var $detail_img = $("<img/>"),_logoPath ="/app/" +  tmp_data[i].appsign + "/" + tmp_data[i].appsign  + "_b.png" ;
                $detail_img.attr("src",_logoPath);
                $("#app_img").append($detail_img);
            }
            $(".app_name").html( tmp_data[i].appname);
            $(".app_version").html(L.version + "：" +  tmp_data[i].version);
            $(".app_author").html(L.issuer + "：" +  tmp_data[i].author);
            //$(".app_url").html("官方网站：<a href=\"http://" + app_item.URL + "\" class=\"app_link\" target=\"_blank\">" + app_item.URL + "</a>");
            //paint app btn
            paint_app_set_title(tmp_data[i]);

            //添加应用页显示
            if(tmp_data[i]["plugin_type"] == "4"){//为上传app
                if(tmp_data[i].statu == "1" || tmp_data[i].statu == "0"){
                    var status_a = $("<a/>");
                    status_a.attr("href","javascript:void(0)");
                    if(tmp_data[i].statu == "1"){
                        status_a.attr("name","stop");
                        status_a.attr("class","unfocus");
                        status_a.html(L.close_app);
                    }
                    else if(tmp_data[i].statu == "0"){
                        status_a.attr("name","start");
                        status_a.attr("class","focus");
                        status_a.html(L.open_app);
                    }
                    status_a.unbind("click").bind("click",function(){
                        set_app_status(appsign,status_a.attr("name"));

                    });
                    $("#app_ctrl").append(status_a);
                    $("#app_img").css("margin-top","12px");
                    $(".app_url").remove();
                }
                //}

               if(tmp_data[i].statu == "1"){//禁止恢复默认按钮
                    var default_a = $("<a/>");
                    default_a.attr("href","javascript:void(0)");
                    default_a.attr("name","default_config");
                    default_a.attr("class","unfocus");
                    default_a.html(L.recover_setting);
                    default_a.unbind("click").bind("click",function(){
                        set_app_status(appsign,default_a.attr("name"));

                    });
                    $("#app_ctrl").append(default_a);
                }

                //if(tmp_data[i].uninstall == "yes"){//卸载
                var uninstall_a = $("<a/>");
                uninstall_a.attr("href","javascript:void(0)");
                uninstall_a.attr("name","uninstall");
                uninstall_a.attr("class","unfocus");
                uninstall_a.html(L.uninstall);
                uninstall_a.unbind("click").bind("click",function(){
                    set_app_status(appsign,uninstall_a.attr("name"));

                });
                $("#app_ctrl").append(uninstall_a);
            }
            break;
        }
    }

}

function paint_app_set_title(data) {
    var exist_flag = true,enable = data["statu"]*1;
	if(enable == 1 || isNaN(enable)){
		//check page exist
		var url = "../app/" + data.appsign + "/webs/index.html";
		$.ajax({
			url: url,
			data: {
				noneed: "noneed"
			},
			type: 'get',
			async: false,
			error: function (XMLHttpRequest, textStatus) {
				//alert('status:' + XMLHttpRequest.status + ', status text: ' + XMLHttpRequest.statusText);
				exist_flag = false;
			},
			success: function (data) {
				exist_flag = true;
			}
		});
	}
    if (exist_flag && !data["plugin_type"] != 4 && (enable == 1 || isNaN(enable))) { //有配置页面且非添加应用且开启状态
		load_app_html(data.appsign);
    }
    if(data.statu == "1"){
        if(exist_flag){//可以配置且有配置页
            paint_app_intro_div(data,"right");
            paint_app_set_div(data);
            paint_app_sep_div();
            $("#app_set_tab").show();
        }else{
            paint_app_intro_div(data,"left");
            $("#app_set_tab,#sep").length>0&&$("#app_set_tab,#sep").hide();
        }
    }else if(data.statu == "0"){
        paint_app_intro_div(data,"left");
        $("#app_set_tab,#sep").length>0&&$("#app_set_tab,#sep").hide();
    }
    paint_app_brief_area(data);
}

//应用配置
function paint_app_set_div(data){
    $("#app_set_tab").length>0&&$("#app_set_tab").remove();
    var $set_div = $("<div/>");
    $set_div.attr("id","app_set_tab");
    $set_div.css("float","left");
    $set_div.html(L.apply_setting);
    $("#app_set_title").append($set_div);

    $set_div.unbind("click").bind("click",function(){
        load_app_html(data.appsign);
        $set_div.css("float","left");
        $("#app_intro_tab").css("float","right");
    });
    $set_div.click();
}
//应用介绍
function paint_app_intro_div(data,type){
    $("#app_intro_tab").length>0&&$("#app_intro_tab").remove();
    var $intro_div = $("<div/>");
    $intro_div.attr("id","app_intro_tab");
    $intro_div.css("float",type);
    $intro_div.html(L.app_intro);
    $("#app_set_title").append($intro_div).css("border-bottom","2px solid rgb(236, 234, 234)");

    $intro_div.unbind("click").bind("click",function(){
        paint_app_detail_area(data);
        $intro_div.css("float","left");
        $("#app_set_tab").css("float","right");
    });
    $intro_div.click();
}


//隔离显示
function paint_app_sep_div(){
    $("#sep").length>0&&$("#sep").remove();
    var $sep_div = $("<div/>");
    $sep_div.attr("id","sep");
    $sep_div.css("float","right");
    $("#app_set_title").append($sep_div);
}

function paint_app_brief_area(data) {
    $("#app_brief_area").html("");
    if(data["plugin_type"] != "4"){
        var intro_p = $("<p>"+ L.app_intro +":&nbsp;&nbsp;" + data.description + "</p>");
        $("#app_brief_area").append(intro_p);
    }
}

//app介绍详情页
function paint_app_detail_area(data){
    $("#config_page").hide();
    var $app_detail_area=    $("#app_detail_area");
    $app_detail_area.html("");
    $app_detail_area.css("padding","14px 47px");
    var intro_h3 = $("<h3>"+ L.app_intro +"</h3>");
    var intro_p = $("<div>"+data.description+"</div>");
    $app_detail_area.append(intro_h3);
    $app_detail_area.append(intro_p);
}

function set_app_status(appsign,act,type){
    //action包括:uninstall(卸载)，start（启动），stop(停止)，default_config(恢复默认参数)
    var obj = {},d = new Date();
	var cgi_name = "";
	if(act == "start"){
		cgi_name = "plugin_start.cgi";
	}
	else if(act == "stop"){
		cgi_name = "plugin_stop.cgi";
	}
	else if(act == "uninstall"){
		cgi_name = "plugin_del.cgi";
	}
	else if(act == "default_config"){
		cgi_name = "plugin_default.cgi";
	}
    obj.name = appsign;
    show_message("save");
    $.post("/router/"+ cgi_name,obj,function(data){
		var data = dataDeal(data);
        if(typeof(data) == "boolean" && data == false){
            show_message("exception");
            return;
        }
        if(data.err_no == "0"){
            //卸载需要查询状态，其余不需要
			if(act == "start" || act == "stop" || act == "default_config"){
				if(data.data.result == "0"){
					show_message("success");
					set_app_data(obj.name,"nav_addon");
				}
				else{
					var str = "";
					if(act == "start")
						str = L.enable;
					else if(act == "stop")
						str = L.closed;
					else if(act == "default_config")
						str = L.default_config;
					show_message("error",str + L.failure);
				}
			}
			else if(act == "uninstall"){
				get_app_status(obj,type);
			}
        }
        else{
           show_message("error",igd.make_err_msg(data));
        }
    });
}

var app_status = {
	timer:null,
	count:0,
	timeout:20
};

function get_app_status(obj,type){
	var callee = arguments.callee;
	if(app_status.timer || app_status.count >= app_status){
		window.clearTimeout(app_status.timer);
		if(app_status.count >= app_status){
			app_status.count = 0;
			show_message("exception");
		}
	}
	app_status.count++;
	$.post("/router/plugin_delrate.cgi",obj,function(data){
		var data = dataDeal(data);
		app_status.timer = window.setTimeout(function(){
			callee(obj,type);
		},1000);
		if(data.err_no != "0"){
			window.clearTimeout(app_status.timer);
			show_message("error",igd.make_err_msg(data));
		}
		else{
			if(data.data.result != "0"){
				window.clearTimeout(app_status.timer);
				show_message("error",L.storage_manage.uninstall + L.failure);
			}
			if(data.data.rate == "100"){
				window.clearTimeout(app_status.timer);
				set_lock_size();
				show_message("uninstall_success");
				if(type){
					paint_nav_addon_page();
				}
				else
					window.location.hash="#menu/nav_addon/third_tools";
			}
		}
	});
}


/* by hby */
(function () {
    var mefn = arguments.callee;
    var app_list_safety = {
        safety_wireless: 0, //防蹭网
        qh_360: 0, //恶意网址拦截
        dns: 0,
        arp_mode: 0,
        arp_rate: 0,
        wifienable: true,
        wifipassstrength: 0, //wifi密码强度检查
        securitypwdstrength: 0, //管理员密码强度检测
        "wanping_status": "0",
        "attack_hard": "0",
        "attack_driver": "0",
        "attack_system": "0",
        "attack_application": "0",
        "filter": "0,0,0,0,0,0,0,0,0,0,0,0,0,0,0"
    };
    var getQh360 = function () {
        var deferred = $.Deferred();
        $.post("/app/qh_360/webs/qh360_dump.cgi", {
            noneed: "noneed"
        }, function (data) {
            var obj = dataDeal(data);
            if (obj) {
                deferred.resolve({
                    qh_360: obj.enable
                });
            } else {
                deferred.reject({
                    qherror: "error"
                });
            }
        })
        return deferred.promise();
    }
    var getDns = function () {
        var deferred = $.Deferred();
        $.post("/app/dns_tramper/webs/dns_get_switch.cgi", function (data) {
            var obj = dataDeal(data);
            if (obj && obj.err_no == 0) {
                deferred.resolve({
                    dns: obj.data[0]['switch']
                });
            } else {
                deferred.reject(obj.err_des);
            }
        })
        return deferred.promise();
    }
    var getArpOversee = function () {
        var deferred = $.Deferred();
        $.post("/app/arp_oversee/webs/arp_defence_show.cgi", function (data) {
            var obj = dataDeal(data);
            if (obj) {
                deferred.resolve(obj);
            } else {
                deferred.reject({
                    arperror: "error"
                });
            }
        })
        return deferred.promise();
    }
    var getWifipassstrength = function () {
        var deferred = $.Deferred();
        $.post("/web360/wifipwdstrength.cgi", function (data) {
            var obj = dataDeal(data);
            if (obj && obj.err_no == 0) {
                var wifipassstrength = !obj.data[0].enable ? 2 : getPassstrength(obj.data[0].level);
                deferred.resolve({
                    "wifienable": obj.data[0].enable,
                    "wifipassstrength": wifipassstrength
                });
            } else {
                deferred.reject(obj.err_des);
            }
        })
        return deferred.promise();
    }
    var getSecurityPwdStrength = function () {
        var deferred = $.Deferred();
        $.post("/web360/security_pwd_strength.cgi", function (data) {
            var obj = dataDeal(data);
            if (obj && obj.err_no == 0) {
                deferred.resolve({
                    securitypwdstrength: getPassstrength(obj.data[0].mode)
                });
            } else {
                deferred.reject(obj.err_des);
            }
        })
        return deferred.promise();
    }
    var getSafeStateData = function () {
        var deferred = $.Deferred();
        $.when(getQh360(), getDns(), getArpOversee(), getWifipassstrength(), getSecurityPwdStrength()).then(function (val1,val2,val3,val4,val5) {
           $.extend(app_list_safety, val1,val2,val3,val4,val5);
            var DDOSMap = {
                "wanping_status": "",
                "attack_hard": "",
                "attack_driver": "",
                "attack_system": "",
                "attack_application": "",
                "filter": ""
            };
            var finalSafety = {
                //safety_wireless: app_list_safety["safety_wireless"] * 1,
                qh_360: app_list_safety["qh_360"] * 1,
                dns: app_list_safety["dns"] * 1,
                arp: app_list_safety["arp_mode"] * 1,
                //ddos: getSafeState(DDOSMap, app_list_safety),
                pwd: getPSDSafeState(app_list_safety),
                wifipassstrength: app_list_safety["wifipassstrength"] * 1,
                securitypwdstrength: app_list_safety["securitypwdstrength"] * 1,
                all: "",
                wifienable: app_list_safety["wifienable"]

            };
            finalSafety.all = getALLSafeState(finalSafety);
            deferred.resolve([finalSafety.qh_360, finalSafety.dns, finalSafety.arp, finalSafety.wifipassstrength, finalSafety.pwd, finalSafety.securitypwdstrength, finalSafety.all, finalSafety.wifienable]);
        });
        return deferred.promise();
    }
    var getPassstrength = function (passstrength) {
        if (passstrength < 2) {
            return 0;
        } else if (passstrength == 2) {
            return 1;
        } else {
            return 2;
        }
    }
    var getSafeState = function (map, data) {
        var allSize = 0;
        var openSize = 0;
        for (var k in map) {
            if (k == "filter") {
                var switchArray = data[k].split(",");
                for (var i = 0; i < switchArray.length; i++) {
                    if (switchArray[i] == "1") {
                        openSize++;
                    }
                }
                allSize += switchArray.length;
            } else {
                if (data[k] == "1") {
                    openSize++;
                }
                allSize++;
            }
        }
        if (openSize == allSize) {
            return 1;
        } else if (openSize != 0) {
            return 2;
        } else {
            return 0;
        }
    }
    var getPSDSafeState = function (data) {
        var wifips = data["wifipassstrength"];
        var sps = data["securitypwdstrength"];
        return wifips * 1 < sps * 1 ? wifips * 1 : sps * 1;
    }
    var getALLSafeState = function (data) {
        $.extend(window.g_app_state, data);
        return getALLSafeStateByArr(g_app_state);
    }
    window.getALLSafeStateByArr = function (data) {
        if (data["qh_360"] && data["dns"] && data["arp"] && data["wifipassstrength"] > 0 && data["securitypwdstrength"] > 0) {
            return 2;
        }
        return 1;
    }
    window.getSafeStateData = getSafeStateData;
})();
/***************************
 add app弹框相关函数
 */
var updateFileIsOpk = function () {
    if (!/^.+\.opk$/i.test($("#app_content").val())) {
        show_message("add_app_type_error");
		$("#app_file_name").html("");
        return false;
    }
    return true;
};

var ADD_APP;
function add_app_submit(){
	$("#add_app_form").submit(function(e){
        e.preventDefault();
    });
	var str=$("#app_content").val();
    if(str.length == 0){
        show_message("need_app_name");
        return false;
    }
    if (!updateFileIsOpk()) return;
    else{
        show_dialog(L.confirm_upload_app, function () {
            DoUploadApp();
        }, function () {
            cancelUploadApp();
        });
    }
}


//首次查询延时2ss
var app_delay_timer = null;
function DoUploadApp(){
    result_count = 0;
	hide_dialog();
    set_w_lock_div();
    show_message("file_uploading");
	hide_pop_layer("add_app_layer");
	if(ADD_APP)
        window.clearInterval(ADD_APP);
	if(app_delay_timer)
		window.clearTimeout(app_delay_timer);
	app_delay_timer = window.setTimeout(function(){
		ADD_APP = window.setInterval(add_app_iframe_check,1000);
	},2000);
    $("#add_app_form").unbind("submit").bind("submit");
    $("#add_app_form").submit();
    window.setTimeout(function(){
        onbeforeunload_event(L.app_uploading);
    },1);
}


function cancelUploadApp(){
    hide_dialog();
    $(".focus_help").focus();
}

function add_app_iframe_check(){
    $.post("/router/get_app_install_result.cgi", {noneed: "noneed"}, function (data) {
		var flag = dataDeal(data);
        try{
            if (flag != "INIT" && flag.schedule == undefined) {
                var type;
                if(flag != 'SUCCESS'){
                    type = 0;
                    show_message("error",igd.make_err_msg(flag));
                }
                else{
                    type = 1;
                }
                add_app_iframe_check_msg(type);
            }
        }
        catch(err){
            show_message("exception");
            add_app_iframe_check_msg();
        }
    });

}
var result_count = 0;
function add_app_iframe_check_msg(type){
    result_count++;
    $("#app_content").val("");
    window.clearInterval(ADD_APP);
    remove_w_lock_div();
    if(type == 1){
        hide_pop_layer("message_layer");
        hide_lock_div();
        if(result_count == 1){
            paint_nav_addon_page();
        }
    }
    window.onbeforeunload = null;
}


function close_app_add(){
    hide_pop_layer('add_app_layer');
    window.onbeforeunload = null;
    $("#app_content").val("");
    $("#app_file_name").html("");
    $("#app_file_name").attr("title","");
}

function paint_nav_addon_page(){
	ajaxAsync(false);
	load_html("nav_addon","init_nav_addon");
	ajaxAsync(true);
	$(".tab_container").find(".tab_item_container").eq(2).removeClass("section_hide").addClass("section_show");
	$(".tab_title").removeClass("cur").eq(2).addClass("cur");
}

/**************************************/
