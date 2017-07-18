var appHtml=appL.qh_360.js,qh_360_pro_info=new Object();
qh_360_pro_info={
    0:{
        info:appHtml.shutInfo,
        detail:appHtml.shutDetail
    },
    1:{
        info:appHtml.openInfo,
        detail:appHtml.openDetail
    }
};
function qh_url_enable(){
    var enable_flag=$("#qh_url_hidden").val();
    var doSubmitFn=function(){
        var parm="enable="+$("#qh_url_hidden").val();
        nos.app.net("qh360_set.cgi",parm,function(data){
            if(data == "SUCCESS"){
                show_message("success",appHtml.controlMessage.s_suc);
            }else{
                show_message("error",igd.make_err_msg(data));
            }
            init_360();
        })
    }
    if(enable_flag == "0"){
        show_dialog(appHtml.shutWallTip,doSubmitFn)
    }else{
        doSubmitFn();
    }
}
function init_360(){
    nos.app.net("qh360_dump.cgi","noneed=noneed",function(data){
        $(".qh_360_txt_layer").html(qh_360_pro_info[data.enable].detail);
        if(data.enable == "1"){
            $("#qh_url_hidden").val(0);
            $("#qh_360_url_btn").attr("class","gray");
            $("#qh_360_url_btn").html(appCommonJS.Button.shut);
            $(".qh_360_set_layer p").eq(0).attr("class","seton");
            var str1 = qh_360_pro_info[data.enable].info;
            var str2 = data.protect_days;
            if(str2 != "0"){
                $(".qh_360_set_layer p").eq(0).html(str1 + "<span>"+appHtml.preventSec1+"&nbsp;<b style='color:#3093DA'>" + str2 + "</b>&nbsp;"+appCommonJS.time.day+"</span>");
            } else{
                $(".qh_360_set_layer p").eq(0).html(str1);
            }
            init_web_cunt_list(data);
            $("#web_count_title").show();
            $("#web_count_list").show();
        }else if(data.enable == "0"){
            $("#qh_url_hidden").val(1);
            $("#qh_360_url_btn").attr("class","btn");
            $("#qh_360_url_btn").html(appHtml.preventOnTip);
            $(".qh_360_set_layer p").eq(0).attr("class","setoff");
            $(".qh_360_set_layer p").eq(0).html(qh_360_pro_info[data.enable].info);
            $("#web_count_title").hide();
            $("#web_count_list").hide();
        }
        nos.app.resizePage();
    });
}

function init_web_cunt_list(data){
    var lineBar = appHtml.line;
    $("#web_count").find("tr").eq(0).find("td").eq(1).html(data.today_http_normal+lineBar);
    $("#web_count").find("tr").eq(0).find("td").eq(2).html(data.http_normal+lineBar);

    $("#web_count").find("tr").eq(1).find("td").eq(1).html(data.today_http_trojan+lineBar);
    $("#web_count").find("tr").eq(1).find("td").eq(2).html(data.http_trojan+lineBar);

    $("#web_count").find("tr").eq(2).find("td").eq(1).html(data.today_http_chang_set+lineBar);
    $("#web_count").find("tr").eq(2).find("td").eq(2).html(data.http_chang_set+lineBar);

    $("#web_count").find("tr").eq(3).find("td").eq(1).html(data.today_http_trick+lineBar);
    $("#web_count").find("tr").eq(3).find("td").eq(2).html(data.http_trick+lineBar);

    $("#web_count").find("tr").eq(4).find("td").eq(1).html(data.today_http_malvare+lineBar);
    $("#web_count").find("tr").eq(4).find("td").eq(2).html(data.http_malvare+lineBar);

    $("#web_count").find("tr").eq(5).find("td").eq(1).html(data.today_http_trojan_down+lineBar);
    $("#web_count").find("tr").eq(5).find("td").eq(2).html(data.http_trojan_down+lineBar);
}
init_360();