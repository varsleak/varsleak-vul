var appLanguageJs=appL.dns_tramper.js;qh_360_pro_info = new Object();
qh_360_pro_info = {
    0: {
        info: appLanguageJs.shutInfo,
        detail: appLanguageJs.dns_shutDetail
    },
    1: {
        info: appLanguageJs.openInfo,
        detail: appLanguageJs.dns_openDetail
    }
};
function qh_url_enable() {
    var enable_flag = $("#qh_url_hidden").val();
    var doSubmitFn=function(){
        var parm = "switch=" + $("#qh_url_hidden").val();
        nos.app.net("dns_set_switch.cgi", parm, function (data) {
            if (data.err_no == "0") {
                show_message("success", appCommonJS.controlMessage.s_suc);
            } else {
                show_message("error", appCommonJS.controlMessage.s_fail);
            }
            init_360();
        })
    }
    if (enable_flag == "0") {
        show_dialog(appLanguageJs.shutWallTip,doSubmitFn)
    }else{
        doSubmitFn();
    }

}

function init_360() {
    nos.app.net("dns_get_switch.cgi", "", function (data) {
        var enable = data.data[0]['switch'];
        $(".qh_360_txt_layer").html(qh_360_pro_info[enable].detail);

        if (enable == "1") {

            nos.app.net("dns_get_runtime.cgi", "",
                function (data) {
                    //{"err_no":"0","err_des":"null","data":[{"day":"0","hour":"0","min":"0"}]}
                    var day = data.data[0].day;
                    if ('0' == day) {
                        day = "1";
                    }
                    $("#qh_url_hidden").val(0);
                    $("#qh_360_url_btn").attr("class", "gray");
                    $("#qh_360_url_btn").html(appCommonJS.Button.shut);
                    $(".qh_360_set_layer p").eq(0).attr("class", "seton");
                    var str1 = qh_360_pro_info[enable].info;
                    //var str2 = data.protect_days;
                    //if(str2 != "0"){
                    $(".qh_360_set_layer p").eq(0).html(str1 + "<span>"+appLanguageJs.preventSec1+"&nbsp;<b style='color:#3093DA'>" + day + "</b>&nbsp;"+appCommonJS.time.day+"</span>");
                    //} else{
                    //$(".qh_360_set_layer p").eq(0).html(str1);
                    //}
                    $("#web_count_title").show();
                    $("#web_count_list").show();
                    nos.app.net("dns_get_statis.cgi", "",
                        function (data) {
                            var stat = data.data[0].stat;
                            $("#protect_no").html(stat);
                            nos.app.resizePage();
                        }
                    );

                }
            );
        } else if (enable == "0") {
            $("#qh_url_hidden").val(1);
            $("#qh_360_url_btn").attr("class", "btn");
            $("#qh_360_url_btn").html(appLanguageJs.openPrevent);
            $(".qh_360_set_layer p").eq(0).attr("class", "setoff");
            $(".qh_360_set_layer p").eq(0).html(qh_360_pro_info[enable].info);
            $("#web_count_title").hide();
            $("#web_count_list").hide();
        }
        nos.app.resizePage();
    });
}
init_360();