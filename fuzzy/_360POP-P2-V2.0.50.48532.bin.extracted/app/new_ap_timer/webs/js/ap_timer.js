;
(function () {
    var ap_timer = {
        init: function () {
            init_app_language(appL.ap_timer);
            this.addEventList();
            $.post("./ap_timer.cgi", {action: "mul_get"}, function (data) {
                var res = window.top.dataDeal(data);
                timeSlot_ARR = res;
                ap_timer.initTimeSlotList(timeSlotTableFormat(res));
            });
        },
        initTimeSlotList: function (list) {
			var tab = new window.top.Table("ap_timer_tab",appHtml.timeSlotTabHead,list);
			tab.initTable();
            nos.app.resizePage();
        },
        set: function () {
            if (timeSlot.check() && weekSlot.check() && rule_check(false, timeSlot_ARR)) {
				if ($("#action").val() === "add" && timeSlot_ARR.length >= 6) {
                    show_message("msg_info", appHtml.setNumLimit);
                    return false;
                }
                show_message("save");
                nos.app.net('./ap_timer.cgi', 'wifi_ctrl_frm', save_wifi_ctrl_callback);
            }
            return false;
        },
        addEventList: function () {
            var apTimer = $("#wifi_ctrl");
            apTimer.undelegate("#add_btn", "click").delegate("#add_btn", "click", ap_timer.set);
            apTimer.undelegate("#cancel_edit_btn", "click").delegate("#cancel_edit_btn", "click", function () {
                timeSlot.setData(false);
                weekSlot.setData("1 2 3 4 5 6 7");
                $("#action").val("add");
                $("#opt_data_flag").val("");
                $(this).hide();
                $("#add_btn").html(appHtml.save_btn[1]);
                return false;
            });
        }
    };

    $(document).ready(function () {
        timeSlot.init();
        weekSlot.init("1 2 3 4 5 6 7");
        ap_timer.init();
    });
    window.apTimer = ap_timer;
})();
var appHtml = appL.ap_timer.js;
var timeSlot_ARR = [];
function save_wifi_ctrl_callback(data) {
    if (data == "SUCCESS") {
        show_message("success", appCommonJS.controlMessage.c_suc);
        $("#cancel_edit_btn").click();
        apTimer.init();
    } else {
        show_message("error", igd.make_err_msg(data));
    }
}
function time_slot_modify(index) {
    var list = timeSlot_ARR[index - 1];
    var statusClass = ["radio_off", "radio_on"];
    timeSlot.setData(list);
    weekSlot.setData(list.timer_day);
    $("#action").val("mod");
    $("#opt_data_flag").val(list['idx']);
    $("#add_btn").html(appHtml.save_btn[0]);
    $("#cancel_edit_btn").show();
}
function time_slot_del(index) {
    var delInfo = {action: "del"};
    var list = timeSlot_ARR[index - 1];
    $.extend(true, delInfo, list);
    show_message("save");
    $.post("./ap_timer.cgi", delInfo, function (data) {
        save_wifi_ctrl_callback(window.top.dataDeal(data));
    });
}
function time_slot_enable(index) {
    var delInfo = {action: "mod"};
    var list = timeSlot_ARR[index - 1];
    $.extend(true, delInfo, list);
    delInfo.timer_enable=(!(delInfo.timer_enable>>0))>>0;
    delInfo.timer_day = delInfo.timer_day.split("+").join(" ");
    show_message("save");
    $.post('./ap_timer.cgi', delInfo, function (data) {
        save_wifi_ctrl_callback(window.top.dataDeal(data));
    });
}












