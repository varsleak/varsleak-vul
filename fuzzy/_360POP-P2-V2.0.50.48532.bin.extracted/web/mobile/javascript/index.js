/**
 * Created by Administrator on 2015/3/16.
 */
/**
 * Created with JetBrains WebStorm.
 * User: lan
 * Date: 14-12-16
 * Time: 下午8:49
 * To change this template use File | Settings | File Templates.
 */
var    language_type;
var    L = {};
var    current_html = null;
var    ROUTE_INFO = {};//路由器信息
var    MobileJsHtml;
var    MobileHtml;
var    common_M_html;

//===============================


var mobile_host_control = {
    firstLogin: true,
    language_init: language_init,
    input_init: function () {
        $(document).find('input[type=text]').focus(function (event) {
            var me = $(this);
            setTimeout(function () {
                $(document).scrollTop(me.offset().top - 10);
                event.preventDefault();
            }, 350);
        });
    },
    router_img: function () {
        if (current_html != "index_page") return;
        var routerImgH = parseInt($("#content .status ul").css("height"), 10);
        $(".status ul").css("height", routerImgH + "px");
    },
    img_loading: function () {
        var msg = $("#msg_type");
        msg.attr("class", "wait").show().attr("class", "success").show().attr("class", "error").show().attr("class", "msg-info").show();
        var loadImg=function(src){
            var loadImaObj = new Image();
            loadImaObj.src=src;
            if(!!loadImaObj.complete){
            }
        };
        loadImg("/mobile/images/loading.gif");
    },
    reset_setting: function () {
        var _this = $("#message_layer");
        var submittingStatus=(_this.css("display")=="none")?false:true;
        var documentHeight = document.documentElement.clientHeight || _MIUI_height_compatiable(true);
        if(!!submittingStatus){
            var left = (parseInt(document.documentElement.scrollWidth) - _this.outerWidth()) / 2 + "px";
            var top = document.documentElement.scrollTop + document.body.scrollTop + (documentHeight- _this.outerHeight()) / 2 + "px";//fix chrome bug
            _this.css("left", left);
            _this.css("top", top);
        }
    },
    index_page_object: function () {
        this.runningPage = "index_page";
        this.RouterInfoHtmlTimeOutId = null;
        this.WanSpeedTimeOutId = null;
        this.interfaceStatusTimeOutId = null;
        this.getWanStatus = true;
        this.getWanStatusError = 0;
        this.timeFormat = function (second) {
            var minute = Math.floor(second / 60);
            var hour = Math.floor(second / (60 * 60));
            var day = Math.floor(second / (60 * 60 * 24));
            var timeDW = language_M[language_type].COMMON.fullTime;
            var returnObj = {
                allValue: "1" + timeDW.min,
                value: "1",
                unit: timeDW.min
            };
            if (day >= 1) {
                returnObj.allValue = day + timeDW.day;
                returnObj.value = day;
                returnObj.unit = timeDW.day;
            } else if (hour >= 1) {
                returnObj.allValue = hour + timeDW.hour;
                returnObj.value = hour;
                returnObj.unit = timeDW.hour;
            } else if (minute >= 1) {
                returnObj.allValue = minute + timeDW.min;
                returnObj.value = minute;
                returnObj.unit = timeDW.min;
            }
            return returnObj;
        };
        this.get_data_wan_speed = function (timeOutSpace) {
            var tmp = this;
            if (tmp.WanSpeedTimeOutId) {
				clearTimeout(tmp.WanSpeedTimeOutId);
                return;
            }
            (function () {
                if (current_html != "index_page") {
                    clearTimeout(tmp.WanSpeedTimeOutId);
                    tmp.WanSpeedTimeOutId = null;
                    return;
                }
                var meCallee = arguments.callee;
                $.post("/web360/getwanspeed.cgi", function (data) {
                    if (!!tmp.getWanStatus) {
                        var dataValue = dataDeal(data);
                        var downSpeedObj = formatSpeed(dataValue["data"].down_speed);
                        $("#speed_value").html(downSpeedObj.value);
                        $("#speed_unit").html(downSpeedObj.unit);
                        $(".content .wan-speed").show();
                        $("#error_wan_status").hide();
                    }
                    tmp.WanSpeedTimeOutId = setTimeout(meCallee, timeOutSpace || 5000);
                });
            })();
        };
        this.get_data_router_info = function (timeOutSpace) {
            var me = this;
            if (me.RouterInfoHtmlTimeOutId) {
				clearTimeout(me.RouterInfoHtmlTimeOutId);
                return;
            }
            (function () {
                if (current_html != "index_page") {
                    clearTimeout(me.RouterInfoHtmlTimeOutId);
                    me.RouterInfoHtmlTimeOutId = null;
                    return;
                }
                var meCallee = arguments.callee;
                $.post("/web360/getrouterinfo.cgi", function (data) {
                    var obj = dataDeal(data);
                    if (obj && obj.err_no == 0) {
                        $(".fnData").html(me.timeFormat(obj.data.uptime).value);
                        $(".fnUnit").html(me.timeFormat(obj.data.uptime).unit);
                    }
                    me.RouterInfoHtmlTimeOutId = setTimeout(meCallee, timeOutSpace || 5000);
                });
            })();
        };
        this.get_interface_status = function (timeOutSpace) {
            var me = this;
            if (me.interfaceStatusTimeOutId) {
				clearTimeout(me.interfaceStatusTimeOutId);
                return;
            }
            (function () {
                if (current_html != "index_page") {
                    clearTimeout(me.interfaceStatusTimeOutId);
                    me.interfaceStatusTimeOutId = null;
                    return;
                }
                var meCallee = arguments.callee, linkInfo = MobileJsHtml["index"]["linkInfo"],linkInfoTip="";
                $.post("/router/interface_status_show.cgi", {noneed: "noneed"}, function (data) {
                    var obj = dataDeal(data);
                    var getWanStatus = function(data){
                        for(var m in data ){
                            if(m.match(/(WAN).+/g)){
                                if(data[m].status>>>0 ===0) {
                                    return 0;
                                }
                            }
                        }
                        return data["WAN1"].status;
                    };
                    var status=getWanStatus(obj[0]);
                    if (status !== 0 && status< 4 && obj[0]["WISP"]) {
                        if (obj[0]["WISP"].status == "0") {
                            status = 0;
                        }
                        else if (obj[0]["WISP"].status == "4") {
                            status = 4;
                        }
                    }
                    if (status == 0) {
                        me.getWanStatus = true;
                        mobile_host_control.firstLogin = false;
                        linkInfoTip = linkInfo[0];
                    }else if(status==4){
                        linkInfoTip = linkInfo[2];
                    }
                    else {
                        if (!!mobile_host_control.firstLogin && me.getWanStatusError < 2) {
                            me.getWanStatusError++;
                        }else{
                            me.getWanStatus = false;
                            linkInfoTip = linkInfo[1];
                        }
                    }
                    !!linkInfoTip&&$("#linkStatusInfo").html(linkInfoTip);
                    me.interfaceStatusTimeOutId = setTimeout(meCallee, timeOutSpace || 5000);
                });
            })();
        };
        this.init = function () {
            var tmp = this;
            current_html = "index_page";
            tmp.get_data_wan_speed(2000);
            tmp.get_interface_status(2000);
            tmp.get_data_router_info(60000);
        };
    },
    nav_device_list_object: function (outTime) {
        this.runningPage = "index_page";
        this.outTime = outTime || 5000;
        this.getOsType = function (data) {
            var phoneCount = 0;
            for (var i = 0; i < data.length; i++) {
                if (data[i].os_type in {1: "Windows", 5: "Mac OS X", 6: "Linux",2: "iPhone", 3: "Android", 4: "Windows Phone"}) {
                    phoneCount++;
                }
            }
            $(".mobileCountData").html(phoneCount);
        };
        this.init_device_list = function () {
            var me = this;
            var url = "/app/devices/webs/getdeviceslist.cgi";
            json_ajax({
                url: url,
                data: {},
                successFn: function (data) {
                    me.getOsType(data);
                }
            });
        };
        this.init_device_list_info = function () {
            var me = this;
            (function () {
                if (current_html == me.runningPage) {
                    me.init_device_list();
                    me.outTimeId = setTimeout(arguments.callee, me.outTime);
                }
            })();
        };
    },
    rewrite_show_error_msg:function(){
        MessageBox.prototype.showErrMsg = function () {
            $.validity.clear();
            var me = this;
            if (me.error) {
                if (typeof me.error == "string") {
                    $("#" + me.error).addClass("err-line").assert(false, me.msg);
                }
                else {
                    for (var i = 0; i < me.error.length; i++) {
                        $("#" + me.error[i]).addClass("err-line").assert(false, me.msg);
                    }
                }
            } else if (me.msgTarget) {
                me.msgTarget.addClass("err-line").assert(false, me.msg);
            } else {
                show_message("error", me.msg);
            }
        };
        MessageBox.prototype.hideErrMsg=function(){
            $.validity.clear();
        };
    },
    init_index_page: function () {
        var tmp = this;
        var setIndexObj = new tmp.index_page_object();
        setIndexObj.init();
    },
    init_nav_device_list: function () {
        var tmp = this;
        var navListObject = new tmp.nav_device_list_object(2000);
        navListObject.init_device_list_info();
    },
    init_index_page_data: function () {
        var me = this;
        current_html = "index_page";
        me.init_nav_device_list();
        me.init_index_page();
    },
    get_wifi_info:function(){
        window.compare_obj = {};
        var obj1 = {};
        obj1.ap_id = 0;
        obj1.network_mode = 999;
        obj1.port_id = "WIFI1";
        $.post("/router/wireless_base_show.cgi", obj1, function (data) {
            var res = dataDeal(data);
            res.default_wifiName ="360WiFi-" + res.wire_mac.split("-").splice(-3,3).join("");
            $.extend(compare_obj,res);
        });
    },
    loginOut:function(time) {
        var timer = time || 1000;
        $.post("/router/login_exit.cgi", {}, function (data) {
            $.cookie('Qihoo_360_login', null, {
                path: '/',
                expires: 1
            });
            window.setTimeout(function () {
                location.href = "/login_mobile.htm";
            }, timer);
        });
    },
	goTo_pc_skip:function(){
       $("#goToPc_index").off("hold tap doubletap").on("hold tap doubletap",function(){
           var curTokenId = TOOLS.Url.getQueryString()["token_id"];
			json_ajax({
				url: "/router/web_type_switch.cgi",
				data: {
					type:0//手机版切换成电脑版
				},
				finalFn: function (data) {
					window.location.href = "/new_index.htm?token_id="+curTokenId;
				}
			});
       });
    },
    ipad_100_height_bug:function(){
        var ipadLogo = /ipad/i.test(navigator.userAgent);
        if(!ipadLogo){return}
        $("body").undelegate(":password,:text","focusin focusout").delegate(":password,:text",{
            "focusin":function(){
                $("body").height(function(n,c){return c+20});
            },"focusout":function(){
                $("body").height("100%");
            }
        });
    },
    init: function () {
        var me = this;
        $(window).resize(function(){
            me.router_img();
            me.reset_setting();
        });
        window.loginOut=function(){
          me.loginOut();
        };
        window.init_text_event= $.noop;
//        me.router_img_to_router_info();
        me.ipad_100_height_bug();
		me.goTo_pc_skip();
        me.get_wifi_info();//获取 wifi 名称用于断网操作显示
//        me.language_init({path: language_M[language_type]["HTML"]["index"]});
        me.rewrite_show_error_msg();
        me.M_Swiper.init();
		var menuInit = function(){
			var deferred = $.Deferred();
			var ret = me.menu.init();
			ret.then(function(){
				deferred.resolve();
			});	
			return deferred.promise();
		}
		menuInit().then(function(){
			me.init_index_page_data();
		});
        me.router_img();
        me.img_loading();
        me.app.init();
        me.routerInfo.init();
        me.hash.init();
        routerConfig.app();
        user_fov_info.uaInfo();
    }
};
//hash =========
(function(){

    var hash_list=function(){
        var me = mobile_host_control.hash;
        var hashList = window.location.hash.split("#");
        var curHashLocation = hashList[1];
        var loadCurrentAppPage = function(){
            if(current_html == curHashLocation){
                return;
            }
            else if(curHashLocation !="app_list"&&!me.isDirection_back){
                mobile_host_control.app.callbackFn();return;
            }
            $(".appMenu_list a[data-html-name="+curHashLocation+"]").trigger("loadMySelfPage");
        };
        var menuSwitch = function(id){
            var nav = $(".hostHeader nav");
            if(!mobile_host_control.app.isRoot){
                var returnResult = mobile_host_control.app.callbackFn();
                if(typeof returnResult == "boolean"&&!returnResult){
                    me.controlHash();return;
                }
                if(id == "routerStatus"){
                    window.location.hash="app_list";return;
                }
            }
            $("#"+id).trigger("myHostMenu");
        };
        if(!curHashLocation){
            current_html=="app_list"?$("#routerStatus").trigger("myHostMenu"):(window.location.hash="index_page",me.type=false,window.location.hash="app_list");
            return;
        }
        switch (curHashLocation){
            case "index_page":menuSwitch("routerStatus");break;
            case "app_list":menuSwitch("routerSet");break;
            default :loadCurrentAppPage();break;
        }
    };

    var add_win_hash = function(){
        /*$(window).unbind("hashchange").bind("hashchange",function(){
            var me = mobile_host_control.hash;
            if(!!me.type)
                hash_list();
            else
                me.type=true;
        });*/
        $(window).on("hashchange",function(){
            var me = mobile_host_control.hash;
            if(!!me.type)
                hash_list();
            else
                me.type=true;
        });
    };

    var resetHash=function(){
        var me = this;
        var preHash = window.location.hash;
        !!preHash&&preHash!="#index_page"&&(window.location.hash="app_list",me.type=false,window.location.hash="#index_page");
    };

    mobile_host_control.hash = {
        isDirection_back:true,//false 代表还未回到子菜单,true 代表已经回到子菜单选择页
        type:true, // true  ->改变hash值且执行callback ; false ->只改变hash值
        isSkipping:false,//true ->正在进行页面间的跳转
        controlHash:function(){
            var me =this;
            var hash="#"+current_html;
            var backFns_len=mobile_host_control.app.returnBackCallBackFns.length;
            if(backFns_len>2){// >2 是为了判断是否是子菜单（所以未用 isRoot 代替）
                var preHashV = window.location.hash;
                me.isDirection_back=false;
                !!me.isSkipping&&(hash=preHashV);
                me.isSkipping=false;
            }
            window.location.hash=hash;
        },
        init:function(){
            add_win_hash();resetHash();
        }
    };

})();
//hash  end =========

// host swiper object set

(function(){

    var  create=function (idClass){
        return new Swiper(idClass,{
            onlyExternal : true,
            onSlideChangeStart:function(swiper){
//                show_lock_div("0");
//                $("html").css({"transform":"scale(0.97,0.97)","transition":"all 0.2s linear"});
            },
            onSlideChangeEnd:function(swiper){
//                hide_lock_div();
//                $("html").css("transform","scale(1,1)");
            }
        });
    };

    mobile_host_control.M_Swiper={
        time:1000,
        subSlideTo:function(index,myself){
            var obj= myself || mySubSwiper;
//            obj.slideTo(index, me.time, true);
            $(obj).children(".swiper-wrapper").css({"left":"-"+100*index+"%"});
        },
        set:function(){
//            window.myHostSwiper =  create('.swiper-container');
            window.myHostSwiper =  $('.swiper-container');

        },
        subSlide:function(){
//            window.mySubSwiper =  create('.sub-container');
            window.mySubSwiper =  $('.sub-container');
        },
        subContainer_sub:function(){
//            window.mySubContainer_subSwiper= create(".subContainer-sub");
            window.mySubContainer_subSwiper= $(".subContainer-sub");
        },
        init:function(){
            this.set();
        }
    };
})();

// host swiper object set end

// host menu  modules
mobile_host_control.menu = {
    type: null,
    callback: null,//menu 回调函数
    load_finish_flag: false,
    refreshFlag:null,
	node:{
            menu: $(".hostMenu a"),
            content: $(".content_section .host"),
            nav:$(".hostMenu")
	},
	menuChange:function (ev) {
		ev.preventDefault();
		var typeValue,me = mobile_host_control.menu;
		typeValue = parseInt($(this).attr("name").match(/(\d)/)[0], 10);
		if (typeValue == me.type&&(current_html=="app_list"||current_html=="index_page")) {
			return;
		}
		me.type = typeValue;
		if (me.type == 0) {
			current_html = "index_page";
		}
		else {
			current_html = "app_list";
		}
		me.node.menu.removeClass("active").eq(typeValue).addClass("active");
		me.node.content.stop(true, true);
		mobile_host_control.M_Swiper.subSlideTo(me.type,myHostSwiper);
		me.callback[me.type].call(me);
	},
	navEvent:function(){
		var selectObj = "#routerStatus,#routerSet",me = this;
		this.node.nav.undelegate(selectObj,"hold tap doubletap").delegate(selectObj,"hold tap doubletap",function(){
			var dataHtmlName = ["index_page","app_list"];
			var indexV = $(this).index();
			window.location.hash=dataHtmlName[indexV];
		});
		$(selectObj).unbind("myHostMenu").bind('myHostMenu',me.menuChange);
	},
    router_status_init: function () {
        mobile_host_control.init_index_page_data();
    },
    load_app_html: function (html_name, init_function,containerId) {
        hide_msgbox();
        var me = this;
        var isOpEnableApp = !!languageM_nav_map[html_name]&&!!languageM_nav_map[html_name].isEnable;
        me.load_finish_flag = false;
        set_w_lock_div();
        $("#"+containerId).addClass("appLoading");
//        show_message("save","加载中...");
        current_html = html_name;
        var params = Array.prototype.slice.apply(arguments, [3, arguments.length]);
        $.ajax({
            type: "get",
            url: (isOpEnableApp?"/app/"+html_name+"/webs/mobile/":"/mobile/") + html_name + ".htm?vn=" + new Date().getTime(),
            dataType: "html",
            error: function (XMLHttpRequest, textStatus) {
                return;
            },
            success: function (ret) {
                if (ret.indexOf("360LoginFlag") != -1) {
                    loginOut();
                }
                else {
                    var _this = $("#"+containerId);
                    _this.html(ret);
                    containerId=="appContent"?mobile_host_control.M_Swiper.subSlide():mobile_host_control.M_Swiper.subContainer_sub();
                    mobile_host_control.language_init({html_name: html_name});
                    remove_w_lock_div();
//                    hide_lock_div();$("#message_layer").hide();
                    _this.removeClass("appLoading");
                    Tools.init();
                    if (init_function != null && init_function != "") {
                        try {
                            if (typeof(init_function) == 'function') {
                                init_function.apply(null, params);
                            }
                            me.load_finish_flag = true;
                        }
                        catch (e) {
                        }
                    }
                    hide_msgbox();
                }
            }
        });
    },
    setTouchFn:function (data,key) {
        var appControl = mobile_host_control.app,map = languageM_nav_map;
        var me = mobile_host_control;
        return function (ev) {
            ev.preventDefault();
            var appTitle = $(".appTitle");
            var nav = $(".hostHeader nav");
            var app = $(".content_section .app");
            var save = $(".appSave");
            var navFn = function(){
                nav.eq(0).fadeOut("fast", function () {
                    nav.eq(1).fadeIn("fast");
                });
            };
            var sendDDCountInfo=function(){
                if(!!data["ddCountNo"]){
                    user_fov_info.appInfo(data["ddCountNo"]);
                }
            };
            sendDDCountInfo();
            appTitle.html(data["title"]);
            current_html =data["currentHtml"];
            if (data["children"]) {
                appControl.addReturnBackCallBackFns((function (data) {
                    return function () {
                        $(".routerSet-sec nav").css({ "padding-left": "5%"});
                        me.menu.menu_list_hide();
                        me.menu.createAppMenu(data);current_html = "app_list";
                        me.menu.menu_list_show();
                    }
                })(map));
                navFn();
                save.hide();
                me.menu.menu_list_hide();
                me.menu.createAppMenu(data["children"]);
                me.menu.menu_list_show();
                $("#moreMenuTipSection").css("height","0");
                menu_compatible.init();
            }
            else {
                appControl.addReturnBackCallBackFns(function () {
                    if(!Tools.form.action_get_DATA(1)){me.app.addReturnBackCallBackFns(arguments.callee);return false;}
                    $("#appContent").html("");
                    mobile_host_control.M_Swiper.subSlideTo(1,myHostSwiper);
                    var navObj = appControl.getNavParentObj(map, key, null);
                    $(".appTitle").html(navObj.title);
                    if (navObj["children"]) {
                        save.hide();current_html =navObj["currentHtml"];
                    } else {
                        save.show("fast");current_html = "app_list";
                    }
                    menu_compatible.init();
                });
                navFn();
                save.show("fast");
                mobile_host_control.M_Swiper.subSlideTo(2,myHostSwiper);
                me.menu.load_app_html(data["currentHtml"], function () {
                    var params = Array.prototype.slice.apply(arguments, [2, arguments.length]);
                    if (typeof(window[data["action"]]) == 'function') {
                        window[data["action"]].apply(null, params);
                    }
                },"appContent");
            }
        }
    },
    createAppMenu: function (datas) {
        var me = this;
        var parentDom = $(".routerSet-sec nav.appMenu_list");
        parentDom.html("");
        for (var member in datas) {
            var data = datas[member];
            var a ="<a href=\"javascript:void(0);\" data-html-name=\""+data.currentHtml+"\"><p><span>"+data.title+"</span><img class='arrow' src=\"./images/arrow.png\" /></p></a>";
            var i ="<img src={{appLogo}} />";
            a=$(a);
            if(data["cls"]){
                a.addClass(data["cls"]);
            }
            if(data["src"]) {
                i=i.replace("{{appLogo}}",data["src"]);i=$(i);i.prependTo(a);
            }
            a.unbind("click loadMySelfPage").bind({
                click:function(){
                    window.location.hash=$(this).attr("data-html-name");
                },
                loadMySelfPage:me.setTouchFn(data,member)
            });
            a.appendTo(parentDom);
        }
    },
    _init_getCurrentMenuList:function(){
        var me = this;
		var dfd = $.Deferred();
        var appList  = function(){
            var deferred = $.Deferred();
			var obj = {};
			obj.app_os="4";
			obj.plugin_type="4";
			obj.from="web";
            $.post("/router/get_installed_plugins.cgi",obj,function(data){
                var res = dataDeal(data);
                var hasApp = function(desSign){
                    var len = res.data["plugins"].length;
                    for(var i=0;i<len;i++){
                        if(res.data["plugins"][i]["appsign"]===desSign){
                            return true;
                        }
                    }
                };
                for(var mem in op_nav_map){
                    var addApp ={};
                    addApp[mem] = op_nav_map[mem];
                    hasApp(mem) && (op_nav_map[mem].isEnable=true) && $.extend(true,languageM_nav_map,addApp);
                }
                deferred.resolve();
            });
            return deferred.promise();
        };
        appList().then(function(){
            var m= mobile_host_control;
            var map = languageM_nav_map;
            if (!!m.firstLogin||!!m.menu.refreshFlag) {
                var ret = me.init_disk_status();
				var data = ret.disk_sleep_menu();
				data.promise.then(function(){
					me.createAppMenu(map);
					mobile_host_control.menu.navEvent();
					if(data.len != 0)
						ret.disk_sleep_text();
				});
				dfd.resolve();
            }
        });
		return dfd.promise();
    },
    require_APP:function(){
        require([!!languageM_nav_map[current_html].isEnable?"/app/"+current_html+"/webs/mobile/js/"+current_html+".js":current_html],function(app){
             app.init();
        });
    },
    menu_list_show:function(){
        var aNav = $(".routerSet-sec nav a");
        aNav.css("left","0");
    },
    menu_list_hide:function(){
        var aNav = $(".routerSet-sec nav a");
        aNav.find(":nth-child(odd)").css("left","100%");
        aNav.find(":nth-child(even)").css("left","-110%");
    },
	init_disk_status:function(){
		var disk_status = {
			init_menu:function(){
				var dfd = $.Deferred(),len = 1;
				$.post("/router/system_application_config.cgi", {action: "get_storeinfo"}, function (ret) {
					ret = dataDeal(ret);
					if(ret.length == 0){
						delete languageM_nav_map["disk_sleep"];
						len = 0;
					}	
					dfd.resolve();
				});
				return {
					promise:dfd.promise(),
					len:len
				}
			},
			init_text:function(){
				$.post('/router/system_application_config.cgi', 'action=get_sleep_info', function (data) {
					data = dataDeal(data);
					if(data.sleep_status == undefined){
						return;
					}
					else if(data.sleep_status == "1"){
						$("a[data-html-name='disk_sleep'] p img").eq(0).before("<span class=\"disk_status\">"+ language_M[language_type]["HTML"].disk_sleep.js.run +"</span>");
					}
					else{
						$("a[data-html-name='disk_sleep'] p img").eq(0).before("<span class=\"disk_status\">"+ language_M[language_type]["HTML"].disk_sleep.js.sleep +"</span>");
					}
				});
			}
		};
		return {
			disk_sleep_menu:disk_status.init_menu,
			disk_sleep_text:disk_status.init_text
		};
	},
    init: function () {
        this.callback = [
            this.router_status_init,
            this.menu_list_show
        ];
		var ret = this._init_getCurrentMenuList();//初始化菜单列表
        window.require_App=this.require_APP;
		return ret;
    }
};
// host menu  modules end

//app menu modules
mobile_host_control.app = {
    node: {
        callback: $(".appCallback"),
        save: $(".appSave"),
        app: $(".content_section .app"),
        nav: $(".hostHeader nav")
    },
    isRoot: true,
    forWardAndRefreshCallBackFns:null,
    returnBackCallBackFns: [function () {
        $("#appContent").html("");
        mobile_host_control.M_Swiper.subSlideTo(1,myHostSwiper);
    }],
    addReturnBackCallBackFns: function (fn) {
        var returnBackCallBackFns=mobile_host_control.app.returnBackCallBackFns;
        if (typeof fn == "function") {
            returnBackCallBackFns.push(fn);
            if (returnBackCallBackFns.length > 1) {
                this.isRoot = false;
            }
            mobile_host_control.hash.controlHash();
        }
    },
    returnBackCallBackFn: function () {
        var me = this;
        var fns = mobile_host_control.app.returnBackCallBackFns || function(){$("#appContent").html("");mobile_host_control.M_Swiper.subSlideTo(1,myHostSwiper);};
        fns.length==3&&(mobile_host_control.hash.isDirection_back=true);
        fns.length == 2&&(me.isRoot = true);
        if (fns.length > 1)
            return fns.pop();
        return fns[0]
    },
    getNavObj: function (data, key) {
        for (var i in data) {
            if (i == key) {
                return data[i];
            }
            if (data[i].children) {
                var obj = arguments.callee(data[i].children, key, data[i]);
                if (obj) {
                    return obj;
                }
            }
        }
        return null
    },
    getNavParentObj: function (data, key, parentObj) {
        for (var i in data) {
            if (i == key) {
                return parentObj || data[i];
            }
            if (data[i].children) {
                var ParentObj = arguments.callee(data[i].children, key, data[i]);
                if (ParentObj) {
                    return ParentObj;
                }
            }
        }
        return null
    },
    live_app_judge: function () {
        switch (current_html) {
            case "system_time":
                sys_time_timer = true;
                break;
            default:
                break;
        }
    },
    callbackFn:function(){
        var me =mobile_host_control.app;
        var node = me.node;
        var rfn = me.returnBackCallBackFn();
        var rfnType = rfn();
        if(typeof rfnType=="boolean"&&!rfnType){return false;}
        hide_lock_div();hide_dialog();
        $("#timeTools").removeClass("timeTools_show");
        if (me.isRoot) {
            node.nav.eq(1).fadeOut("fast", function () {
                node.nav.eq(0).fadeIn("fast");
            });
            me.live_app_judge();
        }else{
            return false;
        }
    },
    eventInterface: function () {
        var me = this, node = me.node;
        var map = languageM_nav_map;
//        touch.on(node.callback, 'hold tap doubletap', function (event) {
//                event.preventDefault();
//                window.history.back();
//            }
//        );
        var saveSetting = function (ev){
            ev.preventDefault();
            eval(me.getNavObj(map,current_html).save + "()");
            me.saveCallBackFn();
        };
        $(".appMenu").undelegate(".appCallback","click").delegate(".appCallback","click",function(ev){
            ev.preventDefault();
            window.history.back();
        });
        node.save.unbind("saveSetting click").bind({
            "click":saveSetting,
            saveSetting:saveSetting
        });
    }
    ,
    init: function () {
        this.eventInterface();
    }
    ,
    saveCallBackFn: function () {

    }

};
//app menu modules end

//router  info
(function(){

    var get_lan_ip=function () {
        $.post("/router/lan_show.cgi", {
            noneed: "noneed"
        }, function (res) {
            var data = dataDeal(res);
            ROUTE_INFO.lan_ip = data.lan_ip;
            ROUTE_INFO.lan_mask = data.lan_mask;
        });
    };

    var get_wan_ip= function () {
        $.post("/router/interface_status_show.cgi", {
            noneed: "noneed"
        }, function (res) {
            var data = dataDeal(res);
            if (data) {
                if (data[0].WAN1.ip)
                    ROUTE_INFO.wan_ip = data[0].WAN1.ip;
            }
        });
        $.post("/router/wan_config_show.cgi", {
            uiname: "WAN1"
        },function (res) {
            var data = dataDeal(res);
            if (!data || !data.COMMON || !data.COMMON.connect_type || data.COMMON.connect_type != "STATIC")
                return;
            if (data[data.COMMON.connect_type].ip)
                ROUTE_INFO.wan_ip = data[data.COMMON.connect_type].ip;
        });
    };

    mobile_host_control.routerInfo = {
        init: function () {
            get_lan_ip();get_wan_ip();
        }
    };
	window.get_wan_ip = get_wan_ip;
})();

//router info end

//wifi_set modules
(function () {
    var wan_pppoe_init = function () {

    };
    mobile_host_control.menu.wan_pppoe_init = wan_pppoe_init;
})();

//wifi_set modules end

//兼容少部分 100 % height
(function(){
    var _MIUI_compatible={};

    _MIUI_compatible.default_h=document.documentElement.clientHeight;

    _MIUI_compatible.default_w =document.documentElement.clientWidth;

    _MIUI_compatible.initFlag = false;

    var _MIUI_height_auto =  function(type){

        !_MIUI_compatible.initFlag&&(_MIUI_compatible.initFlag=true,_MIUI_compatible.actValue=document.documentElement.clientWidth-_MIUI_compatible.default_h,_MIUI_compatible.default_w-=_MIUI_compatible.actValue);

        var _height = (_MIUI_compatible.default_h+_MIUI_compatible.actValue == document.documentElement.clientWidth)? _MIUI_compatible.default_w:_MIUI_compatible.default_h;

        !!type&&$("html,body,#hostPageSwiperContainer,#hostPageSwiperWrapper,section").css("height",_height+"px");

        return _height;
    };
    window._MIUI_height_compatiable=_MIUI_height_auto;
})();

(function(){
//
    $("section,form,div").scroll(function(ev){
        ev.stopPropagation();
        ev.preventDefault();
    });
})();

define(function(){
   return mobile_host_control;
});

