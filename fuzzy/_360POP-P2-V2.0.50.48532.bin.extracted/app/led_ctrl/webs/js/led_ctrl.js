;
(function () {
    var led_ctrl = {
        init: function () {
            init_app_language(appL.led_ctrl);
            this.addEventList();
            $.post("../../universal_app/led_ctrl_get.cgi", {action: "mul_get"}, function (data) {
                var res = window.top.dataDeal(data);
                timeSlot_ARR = res;
                led_ctrl.initTimeSlotList(timeSlotTableFormat(res));
            });

        },
        initTimeSlotList: function (lists) {
			var tab = new window.top.Table("led_ctrl_tab",appHtml.timeSlotTabHead,lists);
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
                nos.app.net('../../universal_app/led_ctrl_set.cgi', 'led_ctrl_frm', save_led_ctrl_callback);
            }
            return false;
        },
        addEventList: function () {
            var apTimer = $("#led_ctrl");
            apTimer.undelegate("#add_btn", "click").delegate("#add_btn", "click", led_ctrl.set);
            apTimer.undelegate("#cancel_edit_btn", "click").delegate("#cancel_edit_btn", "click", function () {
                timeSlot.setData({"start_hour": "23", "start_minute": "00", "end_hour": "07", "end_minute": "00"});
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
        timeSlot.init({"start_hour": "23", "start_minute": "00", "end_hour": "07", "end_minute": "00"});
        weekSlot.init("1 2 3 4 5 6 7");
        led_ctrl.init();
    });
    window.ledCtrl = led_ctrl;
})();

var appHtml = appL.led_ctrl.js;
var timeSlot_ARR = [];
function save_led_ctrl_callback(data) {
    if (data == "SUCCESS") {
        show_message("success", appCommonJS.controlMessage.c_suc);
        $("#cancel_edit_btn").click();
        ledCtrl.init();
    } else {
        show_message("error", igd.make_err_msg(data));
    }
}
function time_slot_modify(index) {
    var list = timeSlot_ARR[index - 1];
    var statusClass = ["radio_off","radio_on"];
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
    $.post('../../universal_app/led_ctrl_set.cgi', delInfo, function (data) {
        save_led_ctrl_callback(window.top.dataDeal(data));
    });
}
function time_slot_enable(index) {
    var delInfo = {action: "mod"};
    var list = timeSlot_ARR[index - 1];
    $.extend(true, delInfo, list);
    delInfo.timer_enable=(!(delInfo.timer_enable>>0))>>0;
    delInfo.timer_day = delInfo.timer_day.split("+").join(" ");
    show_message("save");
    $.post('../../universal_app/led_ctrl_set.cgi', delInfo, function (data) {
        save_led_ctrl_callback(window.top.dataDeal(data));
    });
}













