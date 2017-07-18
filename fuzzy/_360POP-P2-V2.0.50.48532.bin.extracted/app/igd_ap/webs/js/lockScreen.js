/////////////////////////////////////////遮罩层
function paint_select_iframe(){
    if(jQuery.browser.msie&&jQuery.browser.version=="6.0"){
        remove_select_iframe();
        var _frm = $("<iframe/>");
        _frm.attr("id","msg_select_iframe");
        _frm.attr("class","select_iframe");
        _frm.css("height",$(document).height());
        _frm.css("width",$(document).width());
        $(document.body).append(_frm);
    }
}
function remove_select_iframe(){
    if(jQuery.browser.msie&&jQuery.browser.version=="6.0"){
        if($("#msg_select_iframe").length>0){
            $("#msg_select_iframe").remove();
        }
    }
}
function show_lock_div(){
    $("#app_lock_div").show();
    set_app_lock_div();
    paint_select_iframe();
}
function hide_lock_div(){
    $("#app_lock_div").hide();
    set_app_lock_div();
    remove_select_iframe();
}
function set_app_lock_div(){
    $("#app_lock_div").css("height",$(document).height());
    $("#app_lock_div").css("width",$(document).width());
}
//////////////////////////////////////////遮罩层结束
//////////////////////////////////////////弹出层 -- 内容
function print_message_panel(title,message){
    var _this = $("#app_message_layer");
    var left =(parseInt(document.documentElement.scrollWidth)-_this.width())/2+"px";
    var top=document.documentElement.scrollTop+(document.documentElement.clientHeight-100)/2+"px";
    _this.css("left",left);
    _this.css("top",top);
    $("#app_msg_type").attr("class",title);
    $("#app_msg").html(message);
    _this.stop(false,true).fadeIn();
}
function show_message(title,message){        //调用方法
    show_lock_div();
    print_message_panel(title,message);
    if(title!="wait"){
        $("#app_message_layer").stop(false,true).fadeOut(3000,function(){
            hide_lock_div();
        });
    }
}
//////////////////////////////////////////弹出层结束*/