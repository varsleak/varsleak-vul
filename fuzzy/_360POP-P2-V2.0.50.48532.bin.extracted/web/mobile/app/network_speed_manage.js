define(function () {
    /**
     * Created by Administrator on 2015/3/28.
     */
    var appLanguageJs = {};
    var defineObj = {
        saveBtn: $(".appSave"),
        deviceListInfo: {
            initDevicelistActioned: false,
            outTime: 5000,
            canReader: true,
            editing: false,
            runningPage: "network_speed_manage",
            listType: "device",
            touchLinkEnable: true,
            igdApEnable: true,
            deviceList: [],
            routeInfoSourse: {
                deviceCount: 0,
                deviceBlackCount: 0,
                upSpeed: 0,
                downSpeed: 0
            },
            routeInfo: $.extend(true, {}, this.routeInfoSourse),
            formInfo: {
                isShowForm: false,
                currentDeviceObj: {},
                currentDeviceMac: ""
            }
        },
        setCurrentDeviceObjProperty: function (key, value) {
            defineObj.deviceListInfo.formInfo.currentDeviceObj[key] = value;
        },
        getCurrentDeviceObjFn: function () {
            var me = this;
            for (var device in me.deviceListInfo.deviceList) {
                var dataItem = me.deviceListInfo.deviceList[device];
                if (me.deviceListInfo.formInfo.currentDeviceMac == dataItem.mac) {
                    me.deviceListInfo.formInfo.currentDeviceObj = dataItem;
                    return dataItem;
                }
            }
        },
        getLimitSpeedShow: function (limitedSpeed, limit_up_speed, limit_down_speed) {
            var ret = {
                limit_up_speed_show: "未限速",
                limit_down_speed_show: "未限速"
            }
            if (limitedSpeed) {
                ret.limit_up_speed_show = limit_up_speed;
                ret.limit_down_speed_show = limit_down_speed;
            }
            return ret
        },
        getDevicesListFn: function (data) {
            var me = this, deviceslistStr = "", dataDevicesList = data.deviceslist, compiled = me.compiledDevicesList;
            me.deviceListInfo.routeInfo.deviceCount = dataDevicesList.length;
            for (var i = 0; i < dataDevicesList.length; i++) {
                var dataDevicesListItem = dataDevicesList[i];
                $.extend(dataDevicesListItem, me.getDataComment(dataDevicesListItem));
                var onlineDate = getDateBySec(dataDevicesListItem.second);
                var onlineTimeStr =appLanguageJs.onlineTip + (onlineDate.days > 0 ? (onlineDate.days + L.day) : " " + onlineDate.hours > 0 ? (onlineDate.hours + L.hour) : " " + onlineDate.minute > 0 ? (onlineDate.minute + L.minute) : " ");
                //求所有速度和
                me.deviceListInfo.routeInfo.upSpeed += parseInt(dataDevicesListItem.up_speed);
                me.deviceListInfo.routeInfo.downSpeed += parseInt(dataDevicesListItem.down_speed);
                dataDevicesListItem.onlineTime = onlineTimeStr;
                dataDevicesListItem.limitedSpeed = dataDevicesListItem.limitedSpeed;
                dataDevicesListItem.full_name = removeHTMLTag(dataDevicesListItem.name);
                dataDevicesListItem.name = removeHTMLTag(GetDeviceNameStr(dataDevicesListItem.name, 16));
                dataDevicesListItem.os_type = getType(dataDevicesListItem.os_type);
                dataDevicesListItem.up_speed = formatSpeed(dataDevicesListItem.up_speed).allValue;
                dataDevicesListItem.down_speed = formatSpeed(dataDevicesListItem.down_speed).allValue;
                dataDevicesListItem.limit_up_speed = parseInt(dataDevicesListItem.limit_up_speed);
                dataDevicesListItem.limit_down_speed = parseInt(dataDevicesListItem.limit_down_speed);
                $.extend(dataDevicesListItem, me.getLimitSpeedShow(dataDevicesListItem.limitedSpeed, dataDevicesListItem.limit_up_speed, dataDevicesListItem.limit_down_speed));
                dataDevicesListItem.mac = (dataDevicesListItem.mac || "").toUpperCase(); //大写MAC地址
                dataDevicesListItem.is_black = 0;
                if (me.deviceListInfo.formInfo.currentDeviceMac == dataDevicesListItem.mac) {
                    me.deviceListInfo.formInfo.currentDeviceObj = dataDevicesListItem;
                }
                me.deviceListInfo.deviceList.push(dataDevicesListItem);
                deviceslistStr += compiled(dataDevicesListItem);
            }
            return deviceslistStr;
        },
        getBlackListFn: function (data) {
            var me = this, blacklistStr = "", dataBlackList = data.blacklist, compiled = me.compiledBlackList;
            me.deviceListInfo.routeInfo.deviceBlackCount = dataBlackList.length;
            for (var i = 0; i < dataBlackList.length; i++) {
                var dataBlackListItem = dataBlackList[i];
                $.extend(dataBlackListItem, me.getDataComment(dataBlackListItem));
                var blackDate = new Date(dataBlackListItem.blacklist_time * 1000);
                var blackDateStr = blackDate.format("yyyy" + L.year + "MM" + L.month + "dd" + L.s_day);//new lib
                dataBlackListItem.blackTime = blackDateStr;
                dataBlackListItem.mac = (dataBlackListItem.mac || "").toUpperCase();
                dataBlackListItem.full_name = removeHTMLTag(dataBlackListItem.name);
                dataBlackListItem.name = removeHTMLTag(GetDeviceNameStr(dataBlackListItem.name));
                dataBlackListItem.is_black = 1;
                if (me.deviceListInfo.formInfo.currentDeviceMac == dataBlackListItem.mac) {
                    me.deviceListInfo.formInfo.currentDeviceObj = dataBlackListItem;
                }
                me.deviceListInfo.deviceList.push(dataBlackListItem);
                blacklistStr += compiled(dataBlackListItem);
            }
            return blacklistStr;
        },
        getDataComment: function (dataItem) {
            if (dataItem.limit_up_speed * 1 > 0 || dataItem.limit_down_speed * 1 > 0) {
                dataItem.limitedSpeed = "limited-speed";
            }
            if (dataItem.device_label == "unknown")
                dataItem.device_label = "";
            else if (dataItem.device_label && dataItem.device_label.indexOf(L.camera) != -1)
                dataItem.os_type = "10";
            else if (dataItem.device_label && dataItem.device_label.indexOf(L.router) != -1)
                dataItem.os_type = "11";
            else if(dataItem.name.indexOf("360R1")>-1)
                dataItem.os_type = "12";
            dataItem.name = dataItem["s_name"] ||dataItem.alias || dataItem.device_label || dataItem.name || L.unnamed_device;
            return dataItem;
        },
        getDeviceTitleInfo: function () {
            var me = this, compiled = me.compiledDeviceTitleInfo, data = me.deviceListInfo.routeInfoSourse;
            data.devicesCount = me.deviceListInfo.routeInfo.deviceCount + me.deviceListInfo.routeInfo.deviceBlackCount;
            data.devicesCount = appLanguageJs.device_count_title1 + data.devicesCount + appLanguageJs.device_count_title2;
            data.allDownSpeed = me.deviceListInfo.routeInfo.downSpeed;
            data.allDownSpeed = appLanguageJs.device_down_speed_title2 + formatSpeed(data.allDownSpeed).allValue;
            return compiled(data);
        },
        renderDeviceListFn: function (data) {//设备列表render
            var me = this, limitedSpeed = "", deviceTitleInfoStr = "", deviceslistStr = "", blacklistStr = "", currentDeviceObj = me.deviceListInfo.formInfo.currentDeviceObj;
            if (!me.deviceListInfo.canReader) {
                return;
            }
            me.deviceListInfo.routeInfo.deviceCount = 0;
            me.deviceListInfo.routeInfo.deviceBlackCount = 0;
            me.deviceListInfo.routeInfo.upSpeed = 0;
            me.deviceListInfo.routeInfo.downSpeed = 0;
            me.deviceListInfo.deviceList.length = 0;
            deviceslistStr = me.getDevicesListFn(data) || me.compiledNoData({});
            blacklistStr = me.getBlackListFn(data) || me.compiledNoData({"no_data_title": appLanguageJs["no_data_title"]});
            deviceTitleInfoStr = me.getDeviceTitleInfo();
            set_value("network-speed-manage-control", "up_speed", currentDeviceObj["up_speed"]);
            set_value("network-speed-manage-control", "down_speed", currentDeviceObj["down_speed"]);
            $(".network-speed-manage .device-title-info").empty().append($(deviceTitleInfoStr));
            $(".network-speed-manage .devices-list").empty().append($(deviceslistStr));
            $(".network-speed-manage .black-list").empty().append($(blacklistStr));

        },
        initDeviceList: function () {

            var me = this, timeoutFn = arguments.callee;
            me.compiledDevicesList = me.compiledDevicesList || _.template($("#network-speed-manage-device").html());
            me.compiledBlackList = me.compiledBlackList || _.template($("#network-speed-manage-black").html());
            me.compiledDeviceTitleInfo = me.compiledDeviceTitleInfo || _.template($("#devices-title-info").html());
            me.compiledNoData = me.compiledNoData || _.template($("#no-data").html());
            if (me.deviceListInfo.outTimeId) {
                clearTimeout(me.deviceListInfo.outTimeId);
            }
            var getDeviceslist = function () {
                var deferred = $.Deferred();
                json_ajax({
                    url: "/app/devices/webs/getdeviceslist.cgi",
                    data: {},
                    successFn: function (data) {
                        $.extend(devicesListData, {deviceslist: data});deferred.resolve();
                    },
                    finalFn: function (data) {
                        if (data.err_no != "0") {
                            $.extend(devicesListData, {deviceslist: []});deferred.reject();
                        }
                    }
                });

                return deferred.promise();
            };
            var getBlacklist = function () {
                var deferred = $.Deferred();
                json_ajax({
                    url: "/app/devices/webs/getblacklist.cgi",
                    data: {},
                    successFn: function (data) {
                        $.extend(devicesListData,{blacklist: data});deferred.resolve();
                    },
                    finalFn: function (data) {
                        if (data.err_no != "0") {
                            $.extend(devicesListData,{blacklist: []});deferred.reject();
                        }
                    }
                });
                return deferred.promise();
            };
            var devicesListData = {};

            $.when(getDeviceslist(),getBlacklist()).then(function(){
                if(typeof devicesListData.deviceslist == "undefined"||typeof devicesListData.blacklist == "undefined"){
                    return;
                }
                me.renderDeviceListFn(devicesListData);
                if (current_html == me.deviceListInfo.runningPage) {
                    me.deviceListInfo.canReader = true;
                    me.deviceListInfo.outTimeId = setTimeout(function () {
                        timeoutFn.call(me);
                    }, me.deviceListInfo.outTime);
                } else {
                    me.deviceListInfo.canReader = false;
                    clearTimeout(me.deviceListInfo.outTimeId);
                }
            },function(){
                console.log("failure!");
            });

        }, pageToggleFn: function (openControl) {
            var titleNode=$(".appTitle");
            titleNode.html(appLanguageJs.titleTxt[openControl]);
            mobile_host_control.M_Swiper.subSlideTo(openControl);
        },
        blackToggleFn: function (black, mac, callBackSuccess) {
            //拉黑
            var isSuccess = false;
            var url = black ? "/app/devices/webs/setblacklist.cgi" : "/app/devices/webs/cancelblacklist.cgi", msg = black ? appLanguageJs.toBlackSuccess : appLanguageJs.toCancelBlackSuccess;
            json_ajax({
                url: url,
                async: false,
                data: {
                    mac: mac
                },
                finalFn: function (data) {
                    if (data.err_no == '-1') {
                        show_message('msg_info', appLanguageJs.not_cur_device_to_black);
                    }
                },
                successFn: function (data) {
                    show_message('success', msg);
                    callBackSuccess();
                    isSuccess = true;

                }
            });
            return isSuccess;
        },
        showDeviceContentFn: function (type) {
            $("#network-speed-manage-control").find(".device")[type ? "show" : "hide"]();
            radio_set(!type, "is_black");
            if (type) {
                defineObj.saveBtn.show();
            } else {
                defineObj.saveBtn.hide();
            }
        },
        editNameFn: function () {
            var form = $("form#network-speed-manage-control"), newNameEmt = form.find(":input[name=full_name]"), currentDeviceObj = defineObj.deviceListInfo.formInfo.currentDeviceObj, oldName = currentDeviceObj.full_name, mac = currentDeviceObj.mac;
            var new_name_obj = {};
            new_name_obj.maxLength = 31;
            new_name_obj.value = $.trim(newNameEmt.val());
            var ret = CheckLength(new_name_obj);
            if (ret != true) {
                show_message("msg_info", L.exceed_max);
            }
            var newName = new_name_obj.value;
            if (newName == oldName) {
                show_message("msg_info", appLanguageJs.noEditInfo);
                return;
            }
            if (newName.length == 0) {
                newNameEmt.addClass("err-line").assert(false, appLanguageJs.name_require);
                return;
            }
            var newNameChcStr = check_string(newName);
            if (typeof newNameChcStr == "string") {
                newNameEmt.addClass("err-line");
                return;
            } else {
                newNameEmt.removeClass("err-line");
            }
            show_message("save");
            json_ajax({
                url: "/app/devices/webs/setdevicealias.cgi",
                data: {
                    mac: mac,
                    name: newName
                },
                successFn: function (data) {
                    newNameEmt.val(newName);
                    defineObj.deviceListInfo.formInfo.currentDeviceObj.full_name = removeHTMLTag(newName);
                    defineObj.deviceListInfo.formInfo.currentDeviceObj.name = removeHTMLTag(GetDeviceNameStr(newName, 16));
                    setTimeout(function(){show_message("success", appLanguageJs.edit_success);},1500);
                }
            });
        },
        network_speed_manage_setFn: function () {
            defineObj.editNameFn();
        },
        initDeviceListActionFn: function () {
            var parentObj = this, form = $("#network-speed-manage-control");
            var limitSpeedShowNode = $(".limit_speed_show:input[type=text]");
            var limitSpeedToggle = function (limitSpeed, uploadSpeedValue, downloadSpeedValue) {
                var _uploadSpeed = form.find(":input[name=limit_up_speed]"), _downloadSpeed = form.find(":input[name=limit_down_speed]"), _uploadSpeedShow = form.find(":input[name=limit_up_speed_show]"), _downloadSpeedShow = form.find(":input[name=limit_down_speed_show]");
                parentObj.deviceListInfo.formInfo.currentDeviceObj.limit_up_speed = uploadSpeedValue;
                parentObj.deviceListInfo.formInfo.currentDeviceObj.limit_down_speed = downloadSpeedValue;
                parentObj.deviceListInfo.formInfo.currentDeviceObj.limitedSpeed = limitSpeed;
                $.extend(parentObj.deviceListInfo.formInfo.currentDeviceObj, parentObj.getLimitSpeedShow(limitSpeed, uploadSpeedValue, downloadSpeedValue));
                _uploadSpeedShow.val(parentObj.deviceListInfo.formInfo.currentDeviceObj.limit_up_speed_show);
                _downloadSpeedShow.val(parentObj.deviceListInfo.formInfo.currentDeviceObj.limit_down_speed_show);
                limitSpeedShowNode.show();
                limitSpeedShowNode.siblings("[type=text]:input").hide();
                $.extend();
                if (limitSpeed) {
                    form.find(":input.btn_speed_limit").hide();
                    form.find(":input.btn_limit").hide();
                    form.find(":input.btn_cancel_limit").show();
                    form.find("span.speed_limit_unit").show();
                    show_message("success", appLanguageJs.limit_speed_success);
                } else {
                    form.find(":input.btn_speed_limit").show();
                    form.find(":input.btn_limit").hide();
                    form.find(":input.btn_cancel_limit").hide();
                    form.find("span.speed_limit_unit").hide();
                    _uploadSpeed.val(uploadSpeedValue);
                    _downloadSpeed.val(downloadSpeedValue);
                    show_message("success", appLanguageJs.limit_cancel_speed_success);
                }
            };
            //点击其他区域切出限速面板
            var closePane = function (e) {
                var targetEmt = $(e.target);
                var findEmt = $("#network-speed-manage-control .limit-num-box").find(targetEmt);
                if (targetEmt.hasClass("limit-num-box") || findEmt.length){
//                    form.unbind("click", closePane);
                    return false;
                }
                form.find(".limit_speed_show:input").show();
                form.find(":input[name=limit_up_speed]").hide().val("0");
                form.find(":input[name=limit_down_speed]").hide().val("0");
//                form.find(":input.btn_speed_limit").show();
                form.find(":input.btn_limit").hide();
                if($("#limit_up_speed_show").val()>=0){
                    form.find("span.speed_limit_unit").show();
                    form.find(":input.btn_cancel_limit").show();
                    form.find(":input.btn_speed_limit").hide();
                }
                else{
                    form.find("span.speed_limit_unit").hide();
                    form.find(":input.btn_cancel_limit").hide();
                    form.find(":input.btn_speed_limit").show();
                }

                form.unbind("click", closePane);
                return false;
            };
            var speed_limit_input_show=function () {
                //if (parentObj.deviceListInfo.formInfo.currentDeviceObj.limitedSpeed) {
                //    return;
                //}
                limitSpeedShowNode.hide("fast");
                limitSpeedShowNode.siblings("[type=text]:input").show();
                $(this).siblings("[type=text]:input").focus();
                form.find(":input.btn_limit").show();
                form.find("span.speed_limit_unit").show();
                form.find(":input.btn_speed_limit").hide();
                form.find(":input.btn_cancel_limit").hide();
                form.unbind("click", closePane).bind("click", closePane);
            };
            //启用限速
            form.undelegate(".limit_speed_show:input[type=text],.btn_speed_limit", "click").delegate(".limit_speed_show:input[type=text],.btn_speed_limit", "click",speed_limit_input_show);
            //限速确认
            form.undelegate(".btn_limit", "click").delegate(".btn_limit", "click", function () {
                var me = this, _uploadSpeed = form.find(":input[name=limit_up_speed]"), _downloadSpeed = form.find(":input[name=limit_down_speed]");
                var verifyTag = true;
                var uploadSpeedValue = _uploadSpeed.val();
                var downloadSpeedValue = _downloadSpeed.val();
                if (uploadSpeedValue.length < 1) {
                    _uploadSpeed.addClass("err-line").assert(false, appLanguageJs.limit_up_speed_require);
                    verifyTag = false;
                }
                if (downloadSpeedValue.length < 1) {
                    _downloadSpeed.addClass("err-line").assert(false, appLanguageJs.limit_down_speed_require);
                    verifyTag = false;
                }

                if (!verifyTag) {
                    return verifyTag;
                }
                json_ajax({
                    url: "/app/devices/webs/setspeedlimit.cgi",
                    data: {
                        mac: parentObj.deviceListInfo.formInfo.currentDeviceMac,
                        upload: uploadSpeedValue * 1,
                        download: downloadSpeedValue * 1
                    },
                    successFn: function (data) {
                        if (uploadSpeedValue * 1 == 0 && downloadSpeedValue * 1 == 0) {
                            show_message("msg_info", appLanguageJs.limit_speed_error0);
                        } else {
                            limitSpeedToggle(true, uploadSpeedValue, downloadSpeedValue);

                        }
                    }
                });
            });
            //取消限速
            form.undelegate(".btn_cancel_limit", "click").delegate(".btn_cancel_limit", "click", function () {
                var me = this;
                json_ajax({
                    url: "/app/devices/webs/setspeedlimit.cgi",
                    data: {
                        mac: parentObj.deviceListInfo.formInfo.currentDeviceMac,
                        upload: 0,
                        download: 0
                    },
                    successFn: function (data) {
                        limitSpeedToggle(false, 0, 0);

                    }
                });
            });
            //切入编辑框
            $(".network-speed-manage.list .devices-list,.network-speed-manage.list .black-list").undelegate(".device-item", "click").delegate(".device-item", "click", function () {
                //type false:禁用设备 true:设备
                var me = $(this), type = me.parent().hasClass("devices-list"),isRepeater=me.hasClass("repeater");
                $("#device-ip-sec").removeClass().addClass(isRepeater?"enableIp":"readonly");
                parentObj.showDeviceContentFn(type);
                parentObj.deviceListInfo.formInfo.isShowForm = true;
                parentObj.deviceListInfo.formInfo.currentDeviceMac = me.attr("data-mac");
                parentObj.getCurrentDeviceObjFn();
                var currentDeviceObj = parentObj.deviceListInfo.formInfo.currentDeviceObj;
                parentObj.pageToggleFn(1);
                for (var dataItem in currentDeviceObj) {
                    set_value("network-speed-manage-control", dataItem, currentDeviceObj[dataItem]);
                }
                isRepeater&&$("#device-ip").attr("href","http://"+currentDeviceObj["ip"]).html(currentDeviceObj["ip"]);
                if (currentDeviceObj["limit_up_speed"] > 0 || currentDeviceObj["limit_down_speed"] > 0) {
                    form.find(":input.btn_speed_limit").hide();
                    form.find(":input.btn_limit").hide();
                    form.find(":input.btn_cancel_limit").show();
                    form.find("span.speed_limit_unit").show();
                }
                Tools.radio.config.switch.is_black.onbeforchange = "";//赋值前清除触发事件
                radio_set(currentDeviceObj["is_black"], "is_black");
                Tools.radio.config.switch.is_black.onbeforchange = "networkSpeedManage_blackToggleFn";//修改 Tool.radio.config.is_black 设置时的触发事件

                mobile_host_control.app.addReturnBackCallBackFns(function () {
                    parentObj.pageToggleFn(0);
                    form.find(":input:not(.btn_limit,.btn_cancel_limit)").val("");
                    form.find(":input.btn_limit").hide();
                    form.find(":input.btn_speed_limit").show();
                    form.find(":input.btn_cancel_limit").hide();
                    form.find(".limit_speed_show:input").show();
                    form.find("span.speed_limit_unit").hide();
                    form.find(":input[name=limit_up_speed]").hide().val("0");
                    form.find(":input[name=limit_down_speed]").hide().val("0");
                    defineObj.saveBtn.hide("fast");

                });
            });
        },
        init: function () {
            var me = this;
            defineObj.saveBtn.hide("fast");
            $.extend(true, appLanguageJs, MobileHtml[current_html]["js"]);
            window.networkSpeedManage_blackToggleFn = function (oldValue, newValue) {
                show_message("save");
                return me.blackToggleFn(newValue, me.deviceListInfo.formInfo.currentDeviceMac, function () {
                    //touch.trigger($(".appCallback"),"hold");
                    if(!newValue){
                        setTimeout(function(){
                            (mobile_host_control.app.returnBackCallBackFn())();
                        },1000);
                        return;
                    }
                    me.showDeviceContentFn(!newValue);
                });
            };
            me.deviceListInfo.canReader = true;
            me.initDeviceList();
            me.initDeviceListActionFn();
            window.network_speed_manage_set = me.network_speed_manage_setFn;

        }
    };
    return defineObj
});





