/**
 * Created by Administrator on 2015/3/31.
 */
var power_progress={
    addSelectEvent:function(){
        $("#powerProgress").undelegate("dd","click").delegate("dd","click",function(){
            $("#powerProgress").children().removeClass("powerProgressSelected").eq($(this).index()).addClass("powerProgressSelected");
        });
    },
    init:function(){
        this.addSelectEvent();
        getRadioPower();
    }
};
define(function(){
    return power_progress;
});
    var evalExp = function(s, opts) {
        return new Function("opts", "return (" + s + ");")(opts);
    };
    var getRadioPower = function () {
        $.get('/web360/getradiopower.cgi', function (data) {
            var obj;
            try {
                obj = evalExp(data);
            } catch (e) {
                obj.err_no = 1;
                obj.des = appHtml.des;
            }
            if(obj&&obj.err_no == 0){
                var sign = obj.data[0]['power'];
                renderHtml(sign);
            }else{
                show_message("error", igd.make_err_msg(obj.data[0]));
            }
        });
    };
    var setRadioPower = function () {
        show_message("save");
        var power=$(".powerProgressSelected").attr("data-power");
        $.get('/web360/updateradiopower.cgi', {'power': power}, function (data) {
            var response = eval("("+data+")");
            if(!!response&&response["err_no"]==0){
                show_message("success",appCommonJS.controlMessage.s_suc);
            }
        })
    };
    var renderHtml = function (sign) {
        var setW=$("#powerProgress dd");
        setW.removeClass("powerProgressSelected");
        switch (sign*1) {
            case 100:
                setW.eq(2).addClass("powerProgressSelected");break;
            case 50:
                setW.eq(1).addClass("powerProgressSelected");break;
            case 2:
                setW.eq(0).addClass("powerProgressSelected");break;
        }
    };