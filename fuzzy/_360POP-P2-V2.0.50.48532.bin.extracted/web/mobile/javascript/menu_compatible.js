/**
 * Created by Administrator on 2015/3/24.
 */
var menu_compatible = {};
// ===============     menu  ==========
(function () {
    menu_compatible.wan_setup = {
        init: function () {
            var init_wan_setup=function () {
                $(".routerSet-sec nav").css({ "padding-left": "0"});
                $.post("/router/wan_config_show.cgi", {uiname: "WAN1"}, function (data) {
                    var data = dataDeal(data);
                    $(".routerSet-sec.host.app a").each(function () {
                        $(this).removeClass("on");
                    });
                    var _this = $(this);
                    _this.addClass("on");
                    if (!data.COMMON) {
                        return;
                    }
                    var common = data.COMMON;
                    var connecttype = get_connect_type(common.connect_type);
                    $(".routerSet-sec.host.app a").eq(connecttype-1).addClass("on");

                });
            };
            init_wan_setup();
        }
    };
	menu_compatible.update = {
        init: function () {
            var init_auto_update=function () {
                $(".routerSet-sec nav").css({ "padding-left": "0"});
            };
			init_auto_update();
        }
    };
})();
//==========================
menu_compatible.init = function () {
    if (this[current_html] && typeof this[current_html].init == "function") {
        this[current_html].init();
    }
};

//==========================