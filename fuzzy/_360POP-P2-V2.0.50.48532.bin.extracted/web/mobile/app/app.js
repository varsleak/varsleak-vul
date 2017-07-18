/**
 * Created by Administrator on 2015/3/28.
 */
require.config({
//	urlArgs:"bust="+(new Date()).getTime(),
    baseUrl: './app/',
    paths:{
        //        index shim path
        index:"./../javascript/index",
        plugin:"./../../javascript/jq.plugin",
        languageM:"./../javascript/language_CN_MOBILE",
        validity:"./../../javascript/jquery.validity",
        module:"./../../javascript/module",
        new_lib:"./../../javascript/new_lib",
        app_lib:"./../../app_common/app_ctrl/js/app_lib",
        appLanguage:"./../../app_common/app_ctrl/js/language_CN_app",
        languagePC:"./../../javascript/language_CN",
        verification:"./../../javascript/verification",
        //        app shim path
        nos:"./../../app_common/init",
        caret:"./../../javascript/jquery.caret",
        temp:"./../../javascript/temp",
        aes:"./../../javascript/aes",
        base64:"./../../javascript/b64",
        tool:"./../javascript/tool",
        app_compatible:"./../javascript/app_compatible",
        menu_compatible:"./../javascript/menu_compatible",
        err:"./../../javascript/err",
        pcAppCompatible:"./../../javascript/wireless_base"
    },
    map:{
        "*":{
            "css":"css"
        }
    },
    shim:{
        index:['languagePC','languageM','validity','new_lib','plugin'],
        app_lib:["appLanguage"],
        new_lib:["app_lib"],

        nos:['css!../css/app.css','tool','temp','aes','base64','err','pcAppCompatible'],
        tool:['caret','app_compatible','menu_compatible'],
        pcAppCompatible:["./../../javascript/device_manage","./../../javascript/network_setup"],
        log:['./../../javascript/log']
    }
});

(function(){
    var router = {
        index:function(){
            require(['index'],function(M_Control){
//                language_type = igd.global_param.language_type;
                L = language[language_type]["JS"];
                MobileHtml = language_M[[language_type]]["HTML"];//html language
                MobileJsHtml = language_M[language_type]["JS"];// js language
                common_M_html = language_M[language_type]["COMMON"];//common language
                //=========  router info  ====
                ROUTE_INFO.lan_ip = igd.global_param.default_ip;
                ROUTE_INFO.lan_mask = igd.global_param.default_lan_mask;
                ROUTE_INFO.g_port = igd.global_param.default_port;
                ROUTE_INFO.rebootTime = igd.global_param.reboot_time;
                ROUTE_INFO.updateTime = igd.global_param.update_time;
                //=========  end   ===========
                M_Control.init();
                $("body").mousedown(function (event) {
                    hide_msgbox();
                });
            });
        },
        app:function(){

            require(['nos'],function(){
                check_app_map = {
                    int: check_int,
                    decimal: check_decimal,
                    string: check_string,
                    char: check_char,
                    pptp_l2tp:check_pptp_l2tp,
                    ip: check_ip,
                    in_ip: check_in_ip,
                    nin_ip: check_nin_ip,
                    mac: check_mac,
                    mask:check_mask,
                    dns: check_dns,
                    hour: check_hour,
                    minute: check_min,
                    url: check_url,
                    ip_url: check_ip_url,
                    nin_ip_url: check_nin_ip_url,
                    password: check_password,
                    password_blank: check_password_blank,
                    port: check_port,
                    port0: check_port0,
                    prio: check_prio,
                    pptp_connects: check_pptp_connects,
                    l2tp_connects: check_l2tp_connects,
                    calendar: check_calendar,
                    eq5: check_eq5,
                    eq13: check_eq13,
                    eq64: check_eq64,
                    eq8_63: check_eq8_63,
                    eq8_30: check_eq8_30,
					eq8_32: check_eq8_32,
                    eq8_64: check_eq8_64,
                    eq10: check_eq10,
                    eq26: check_eq26,
                    char16: check_char16,
                    ascii_base: check_ascii_base,
                    ascii_password: check_ascii_password,
                    ascii: check_ascii,
                    update_min30: check_update_min30,
                    udp_up:check_udp_up,
                    noneed: null
                };
                $.extend(true,check_map,check_app_map);
                $.extend(true,check_app_map,check_map);
            });
        },
        init:function(){
            this.index();
        }
    };
    window.routerConfig=router;
    router.init();
})();

