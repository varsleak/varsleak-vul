/**
 * Created by Administrator on 2015/3/28.
 */
var appLanguageJs=appL.baby_mode.js;

var baby_mode={
    manageData:[],
    setBabyModeData:null,
    getWaitingList:function() {
        var the = this;
        nos.app.net("/app/devices/webs/getdeviceslist.cgi", "noneed=noneed", the.renderBabyModeWaitingList);
    },
    getBabyModeList:function(){
        var the = baby_mode;
        nos.app.net("/app/devices/webs/getchildlist.cgi", "noneed=noneed",the.renderBabyModeList);
    },
    //改变设置儿童模式页面
    changeBabyModeSet:function(type){
        var me = this;
        var babyEdit=$(".baby_mode_edit_set");
        var saveBtn = $(".appMenu .appSave");
        var saveTxt=MobileHtml["index"]["html"]["appSave"];
        if(type==1){
            babyEdit.show();
            saveBtn.html("").addClass("baby-mode-del");
            $("#baby_mode_edit").unbind('click').bind("click",function(){
                    me.initSettingBabyMode();
                });

            languageM_nav_map.baby_mode.save="baby_mode.cancelBabyMode";
            return;
        }
        babyEdit.hide();saveBtn.html(saveTxt).removeClass("baby-mode-del");
        languageM_nav_map.baby_mode.save="baby_mode.initSettingBabyMode";
    },
    //儿童模式列表
    renderBabyModeList:function(data) {
        var babyModeList = "";var meThe = baby_mode;
        meThe.manageData=[];
        $(".baby-mode-host dl dd").not(":first").remove();
        if (data && data.data&&!!data.data.length) {
            var temp = data.data,manageData;
            for (var i = 0, length = temp.length; i < length; i++) {
                var name = temp[i]["s_name"] ||temp[i].alias || temp[i].device_label || temp[i].name || appCommonJS.other.unknownDevice;
                var full_name = removeHTMLTag(name);
                name = removeHTMLTag(GetDeviceNameStr(name));
                var showAcrossText = "";
                if ((temp[i].start_time.substr(0, 2) * 60 + parseInt(temp[i].start_time.substr(2, 2))) > (temp[i].end_time.substr(0, 2) * 60 + parseInt(temp[i].end_time.substr(2, 2)))) {
                    showAcrossText = "&nbsp"+appLanguageJs.showAcrossText;
                }
                babyModeList += '<dd id="baby-mode-' + i + '" class="device-item select_dd ' + (temp[i].sex * 1 == 1 ? "boy" : "girl") + '">' +
                '<span class="device-name" title=\'' + full_name + '\'>' +name +'</span>' +
                '<span class="info">' + temp[i].start_time.substr(0, 2) + ":" + temp[i].start_time.substr(2, 2) + "-" + showAcrossText + temp[i].end_time.substr(0, 2) + ":" + temp[i].end_time.substr(2, 2) +  appLanguageJs.forbidOnline+'</span>' +
                '<a class="settting-btn">'+appLanguageJs.manage+'</a></dd>';
                manageData={
                    mac:temp[i].mac,
                    name:name,
                    fullName:full_name,
                    sex:temp[i].sex,
                    startTime:temp[i].start_time,
                    endTime:temp[i].end_time
                };
                meThe.manageData.push(manageData);
            }
            $(".baby-mode-host dd:first-child").removeClass();
            $(babyModeList).appendTo($(".baby-mode-host dl"));
        }else{
            $(".baby-mode-host dd:first-child").addClass("noBabyModeList");
        }
        $(".baby-mode-host dd:first-child").show();
        meThe.addManageBtnEventList();
    },
    addManageBtnEventList:function(){
        var me = this;
        var resetData = {
            sex:1,
            startTime:"0000",
            endTime:"0000",
            mac:""
        };
        var setData = function(data){
            me.sex_radio_set(data.sex*1);var timeGroup=$(".item_time_group");
            var startTime = timeGroup.eq(0).find("input[type=text]");
            var endTime = timeGroup.eq(1).find("input[type=text]");
            startTime.eq(0).val(data.startTime.substr(0,2));
            startTime.eq(1).val(data.startTime.substr(2));
            endTime.eq(0).val(data.endTime.substr(0,2));
            endTime.eq(1).val(data.endTime.substr(2));
            $(".submit-mac").val(data.mac);
        };
        $(".addManageBtn").unbind("click").bind("click",function(ev){
            ev.preventDefault();
            me.getWaitingList();
            me.togglePanel(1,"baby-mode-list");
            me.callbackSet({prevHtml:"baby-mode-host",index:0});
        });
        $(".baby-mode-host").undelegate(".device-item","click").delegate(".device-item","click",function(){
            var num=parseInt($(this).attr("id").match(/(-)(\d)/)[2],10);
            setData(me.manageData[num]);
            me.changeBabyModeSet(1);
            me.togglePanel(1,"baby-mode-control",1);
            me.babyModeCurrentSubHtml="edit";
            me.callbackSet({prevHtml:"baby-mode-host",index:0});
        });
        $(".baby-mode-list").undelegate(".device-item","click").delegate(".device-item","click",function(){
            var num=$(this).index();
            me.changeBabyModeSet(0);
            setData($.extend(true,resetData,me.setBabyModeData[num]));
            me.togglePanel(2,"baby-mode-control",0);
            me.babyModeCurrentSubHtml="add";
            me.callbackSet({prevHtml:"baby-mode-list",index:1});
        });
        $(".baby-sex-box").undelegate("a","click").delegate("a","click",function(){
            var num=$(this).index();
            if(!!num){me.sex_radio_set(0);}
            else{me.sex_radio_set(1);}
        });
    },
    sex_radio_set:function(val){
        var babySex = $("#baby-sex");
        babySex.val(val);
        $(".baby-sex-box .radioMode").addClass("baby-sex-selected").eq(val).removeClass("baby-sex-selected");
    },
    cancelBabyMode:function() {
        var me = baby_mode;
        show_message("deleteing");
        nos.app.net("/app/devices/webs/delchildlist.cgi", "mac=" + $(".submit-mac").val(), function () {
            me.getBabyModeList();
            me.togglePanel(0,"baby-mode-host");
            mobile_host_control.app.returnBackCallBackFn();
            show_message("del_success");
        });
    },
    babyModeCurrentSubHtml:null,
    initSettingBabyMode:function(type){
        var me=this,
            inputs = $("input.start,input.end"),
            start = $(inputs[0]).val() + $(inputs[1]).val(),
            end = $(inputs[2]).val() + $(inputs[3]).val(),
            sex = $("input[name=sex]").val(),
            mac = $(".submit-mac").val(),
			start_h = $(inputs[0]).val()>>>0,
			end_h = $(inputs[2]).val()>>>0,
			start_m = $(inputs[1]).val()>>>0,
			end_m = $(inputs[3]).val()>>>0,
            url = "sex=" + sex + "&mac=" + mac + "&start_time=" + start + "&end_time=" + end + "&period=todo";
        if($(inputs[0]).val() == "" || $(inputs[1]).val() == ""){
            if($(inputs[0]).val() == ""){
                show_message("msg_info", appLanguageJs.startTimeNull);
                return;
            }
            if($(inputs[0]).val() != "" && $(inputs[1]).val() == ""){
                $(inputs[1]).val("00");
            }
        }
        if($(inputs[2]).val() == "" || $(inputs[3]).val() == ""){
            if($(inputs[2]).val() == ""){
                show_message("msg_info",  appLanguageJs.endTimeNull);
                return;
            }
            if($(inputs[2]).val() != "" && $(inputs[3]).val() == ""){
                $(inputs[3]).val("00");
            }
        }
        if (start == end) {
            show_message("msg_info", appLanguageJs.startAndEnd);
            return;
        }
		if((end_h===start_h && end_m-start_m>=0&&end_m-start_m<5)||(end_h === (start_h+1)&&(60+end_m-start_m)<5)){
			show_message("msg_info",appCommonJS.timeSlotErrorTip.atLeastFiveMinute);return false;
		 }
        nos.app.net("/app/devices/webs/setchildlist.cgi", url, function () {
            me.getBabyModeList();
            me.togglePanel(0,"baby-mode-host");
            mobile_host_control.hash.isDirection_back=true;
            me.babyModeCurrentSubHtml=="add"&&mobile_host_control.app.returnBackCallBackFns.pop();
            mobile_host_control.app.returnBackCallBackFns.pop();
        });
    },
    // 页面切换
    togglePanel:function (indexTo,mark,con) {
        var saveBtn = $(".appMenu .appSave");
        var saveTxt=MobileHtml["index"]["html"]["appSave"];
        var section = $("#appContent section").not(":first");
        var mySwiper = mobile_host_control.M_Swiper;
        (function _init_css(){
            if(mark=="baby-mode-control"){
                $(".appSave").show();
                $(".appTitle").html(appLanguageJs[mark][con]);
            }
            else{
                $(".appSave").hide();
                saveBtn.html(saveTxt).removeClass("baby-mode-del");
                $(".appTitle").html(appLanguageJs[mark]);
            }
        })();
        (function _init_slide(){
            section.stop(true,true);
            if(!!con && con==1){
                section.hide();
                $("."+mark).show();
            }
            else{
                if(indexTo==0){
                    section.fadeIn(mySwiper.time);
                }
            }
            mySwiper.subSlideTo(indexTo);
        })();
    },
    //注入待设置模式列表儿童
    renderBabyModeWaitingList:function (data) {
        var babyModeWaitingList = "";
        var me =baby_mode;
        var noList = common_M_html.noTableListDataTip;
        var dlListCon = $(".baby-mode-list dl");
        me.setBabyModeData=[];
        if (data && data.data) {
            var temp = data.data;
            var tempLength = temp.length;
            for (var i = 0; i < tempLength; i++) {
                if (temp[i].is_child == "1") {
                    continue;
                }
                if(temp[i].device_label == "unknown")
                    temp[i].device_label = "";
                else if(temp[i].device_label.indexOf(appLanguageJs.camera) != -1)
                    temp[i].os_type = "10";
                else if(temp[i].device_label.indexOf(appLanguageJs.router) != -1)
                    temp[i].os_type = "11";
                else if(temp[i].name.indexOf("360R1")>-1)
                    temp[i].os_type = "12";
                var name = temp[i]["s_name"] ||temp[i].alias || temp[i].device_label || temp[i].name || appCommonJS.other.unknownDevice;
                var full_name = removeHTMLTag(name);
                name = removeHTMLTag(GetDeviceNameStr(name));
                babyModeWaitingList += '<dd class="device-item select_dd ' + getType(temp[i].os_type) + '">' +
                '<span class="device-name" title=\'' + full_name + '\'>' + name + '</span>' +
                '<a>'+appLanguageJs.setBabyMode+'</a>' +
                '</dd>';
                me.setBabyModeData.push({mac:temp[i].mac,name:name,fullName:full_name});
            }
        }
        if (babyModeWaitingList == "") {
            dlListCon.addClass("noTableListDataTip").html(noList);
            show_message("msg_info", appLanguageJs.noBabyModeFamilyTxt);
            return;
        }
        dlListCon.removeClass("noTableListDataTip").html(babyModeWaitingList);
    },
    callbackSet:function(controlObj){
        var htmlName=controlObj.prevHtml;
        var indexTO = controlObj.index;
        var me =this;
        mobile_host_control.app.addReturnBackCallBackFns(function(){
            me.togglePanel(indexTO,htmlName);
        });
    },
    init:function(){
        var me =this;
        $.extend(true,appLanguageJs,MobileHtml[current_html]["js"]);
        $(".appSave").hide();
        me.getBabyModeList();
    }
};

define(function(){
    return baby_mode;
});





