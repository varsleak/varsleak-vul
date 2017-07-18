;
(function () {
    init_app_language(appL.power_progress);
    var evalExp = function (s, opts) {
        return new Function("opts", "return (" + s + ");")(opts);
    };

    var powerTimeSlot = {
        list: function (currentTop) {
            $.post("/app/radio_power/radio_power.cgi", {action: "get"}, function (data) {
                var res;
                res = evalExp(data);
                timeSlot_ARR = res.time;
                var sign = getSign(res['now_power']);
                renderHtml(sign);
                var listsArr = (function (res) {
                    var _htmlStr = appL.power_progress.html;
                    var listLen = res.length;
                    var listArr_tab = [];
                    var modeStr = {low: _htmlStr.lowModeTxt, middle: _htmlStr.text_middle, high: _htmlStr.text_high};
                    for (var i = 0; i < listLen; i++) {
                        var list = {};
                        list.index = i + 1;
                        list.time = timeSlotFormat(res[i]['start_hour']) + ":" + timeSlotFormat(res[i]['start_minute']) + "~" + timeSlotFormat(res[i]['end_hour']) + ":" + timeSlotFormat(res[i]['end_minute']);
                        list.week = init_weekStr(res[i].timer_day);
                        list.mode = modeStr[getSign(res[i].power)];
						list.op = '<a onclick="power_modify('+ list.index +')" title="'+ appCommonJS.btnTitle.edit +'" class="fun_link edit" href="javascript:void(0);">'+ appCommonJS.btnTitle.edit +'</a><a onclick="power_del('+ list.index +')" title="'+ appCommonJS.btnTitle.del +'" class="fun_link del" href="javascript:void(0);">'+ appCommonJS.btnTitle.del +'</a><a onclick="power_enable('+ list.index +')" title="'+ appHtml.status_btn[res[i].timer_enable] +'" class="fun_link status" href="javascript:void(0);">'+ appHtml.status_btn[res[i].timer_enable] +'</a>';
                        listArr_tab.push(list);
                    }
                    return listArr_tab;
                })(res.time);
				var tab = new window.top.Table("power_progress_tab",appHtml.timeSlotTabHead,listsArr);
				tab.initTable();
                nos.app.resizePage();
                currentTop && $("body,html", window.parent.document).scrollTop(currentTop);
            });
        },
        add: function () {
            if (timeSlot.check() && weekSlot.check()) {
                if ($("#action").val() === "add" && timeSlot_ARR.length >= 6) {
                    show_message("msg_info", appHtml.setNumLimit);
                    return false;
                }
                show_message("save");
                nos.app.net('/app/radio_power/radio_power.cgi', 'power_progress_frm', save_power_progress_callback);
            }
            return false;
        }, init: function (currentTop) {
            powerTimeSlot.list(currentTop);
            $(".mode-info-show").show();
            $(".mode-set-show").hide();
        }

    };

    var setRadioPower = function (sign,power, currentTop) {
        var setConfig = function(){
			show_message("save");
            $.get('/web360/updateradiopower.cgi', {'power': power}, function () {
                window.top.hide_pop_layer("message_layer");
				window.top.hide_pop_layer("lock_div");
				renderHtml(sign);
				powerTimeSlot.list(currentTop);
            });
        };
        var hasStart = false;
        if(timeSlot_ARR.length>0){
            for(var k =0;k<timeSlot_ARR.length;k++){
                if(timeSlot_ARR[k].timer_enable==1){
                    hasStart = true;break;
                }
            }
        }
        if(hasStart){
            show_dialog(appHtml.setTip,function(){
                setConfig();
            });
        }else{
            setConfig();
        }
    };

    var getSign = function (num) {
        var sign = 'high';
        if (num <= 20) {
            sign = 'low';
        } else if (num > 20 && num <= 50) {
            sign = 'middle';
        }
        return sign;
    };

    var renderHtml = function (sign) {
        var setW = null;
        $('.sign-area a').removeClass('selected');
        switch (sign) {
            case 'high':
                $('.text-high').addClass('selected');
                setW = "630px";
                break;
            case 'middle':
                $('.text-middle').addClass('selected');
                setW = "320px";
                break;
            case 'low':
                $('.text-low').addClass('selected');
                setW = "45px";
                break;
        }
        $(".scrollbar_add").stop(true,false).animate({
            width: setW
        }, 500);
        $('.opt-mode .wifi-status').removeClass("low middle high").addClass(sign);
        $('.opt-mode').show();
    };

    function addAppEventList() {
        var frmBtnArea = $('#power_progress_frm');
        $('#power-change-area').undelegate('a', 'click').delegate('a', 'click', function (e) {
            e.preventDefault();
            var currentTop = $("body", window.parent.document).scrollTop() || $("html", window.parent.document).scrollTop();
            var self = $(this),
                power = self.attr('data-power'),
                sign = self.attr('data-sign');
            setRadioPower(sign,power, currentTop);
        });
        $('#power-progress-list').undelegate('#lbl_add_btn', 'click').delegate('#lbl_add_btn', 'click', function (e) {
            if(timeSlot_ARR.length>=6){
                show_message("msg_info",appHtml.limitNumTip);return;
            }
            timeSlot.setData();
            weekSlot.setData("1 2 3 4 5 6 7");
            $("#action").val("add");
            $("#opt_data_flag").val("");
            $("#add_btn").html(appHtml.addBtn[1]);
            $(".app-box").toggle();
            nos.app.resizePage();
        });
        frmBtnArea.undelegate('#add_btn', 'click').delegate('#add_btn', 'click', function (e) {
            e.preventDefault();
            powerTimeSlot.add();
        });
        frmBtnArea.undelegate('#cancel_edit_btn', 'click').delegate('#cancel_edit_btn', 'click', function (e) {
            e.preventDefault();
            $(".app-box").toggle();
            nos.app.resizePage();
        });
    }

    $(document).ready(function () {
        timeSlot.init();
        weekSlot.init("1 2 3 4 5 6 7");
        addAppEventList();
        powerTimeSlot.init();
        $("body").mousedown(function () {
            hide_msgbox();
        });
    });
    window.powerInit = powerTimeSlot.init;
})();

var timeSlot_ARR = [];
var appHtml = appL.power_progress.js;

function power_modify(index) {
    var list = timeSlot_ARR[index - 1];
    timeSlot.setData(list);
    weekSlot.setData(list.timer_day);
    $("input[name=power][value=" + list.power + "]").prop("checked", true);
    $("#action").val("mod");
    $("#opt_data_flag").val(list.idx);
    $("#add_btn").html(appHtml.addBtn[0]);
    $(".app-box").toggle();
    nos.app.resizePage();
}
function power_del(index) {
    show_message("save");
    var currentTop = $("body", window.parent.document).scrollTop() || $("html", window.parent.document).scrollTop();
    var list = timeSlot_ARR[index - 1];
    $.post('/app/radio_power/radio_power.cgi', {action: "del", idx: list.idx}, function (data) {
        save_power_progress_callback(window.top.dataDeal(data),currentTop);
    });
}
function power_enable(index) {
    show_message("save");
    var currentTop = $("body", window.parent.document).scrollTop() || $("html", window.parent.document).scrollTop();
    var delInfo = {action: "mod"};
    var list = timeSlot_ARR[index - 1];
    $.extend(true, delInfo, list);
    delInfo.timer_enable = (!(delInfo.timer_enable >> 0)) >> 0;
    $.post('/app/radio_power/radio_power.cgi', delInfo, function (data) {
        save_power_progress_callback(window.top.dataDeal(data),currentTop);
    });
}

function save_power_progress_callback(data,currentTop ,successFn) {
    if (data == "SUCCESS") {
        show_message("success", appCommonJS.controlMessage.c_suc);
        powerInit(currentTop);
        typeof successFn === "function" && successFn();
    } else {
        show_message("error", igd.make_err_msg(data));
    }
}