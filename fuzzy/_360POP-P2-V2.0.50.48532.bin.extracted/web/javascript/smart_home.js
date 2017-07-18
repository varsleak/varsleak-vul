//智能家居
(function(){
    var path = "/app/airlink_app/webs/";
    var L_SMART = L.smart_device;
    var link_status=[L_SMART.offline,L_SMART.online];
    var protocol ={
        "Qihoo_360":"Airlink",
        "Haier":"Haier",
        "Broadlink_DNA":"Broadlink_DNA"
    }
    var device_type = {
        "light":L_SMART.light,
        "socket":L_SMART.socket,
        "controller":L_SMART.controller,
        "wifi_extender":L_SMART.wifi_extender,
        "camera":L_SMART.camera,
        "curtain":L_SMART.curtain,
        "tvset":L_SMART.tvset,
        "player":L_SMART.player,
        "remote":L_SMART.remote,
        "airbox":L_SMART.airbox,

        "audio":L_SMART.audio,
        "home_cabinet_aircon":L_SMART.home_cabinet_aircon,
        "home_split_aircon":L_SMART.home_split_aircon,
        "commercial_aircon":L_SMART.commercial_aircon,
        "air_purifier": L_SMART.air_purifier,
        "air_purify_cube": L_SMART.air_purify_cube,
        "desktop_purifier":L_SMART.desktop_purifier,
        "air_cube": L_SMART.air_cube,
        "air_manager": L_SMART.air_manager,
        "aldehyde_detector": L_SMART.aldehyde_detector,

        "tourniquet":L_SMART.tourniquet,
        "fatty_meter":L_SMART.fatty_meter,
        "blood_glucose_meter":L_SMART.blood_glucose_meter,
        "thermometer":L_SMART.thermometer,
        "bracelet": L_SMART.bracelet,
        "oximeter": L_SMART.oximeter,
        "sleep_meter":L_SMART.sleep_meter,
        "elec_heater": L_SMART.elec_heater,
        "gas_heater": L_SMART.gas_heater,
        "pulsator_washer": L_SMART.pulsator_washer,

        "drum_washer":L_SMART.drum_washer,
        "fridge":L_SMART.fridge
    };
    var device_type_arr = (function(typeObj){
        var arr = [];
        for(var key in typeObj){
            arr.push(key);
        }
        return arr;
    })(device_type);
    
    var smart_devices = {
        time_begin_scan:10,
        time_temp_scan:10,
        timeout_con_dev:60,
        loop_timer_scanning:0,
		wait_timer:0,
        scan_data_temp:{},
        connect_data_temp:{},
        connect_data:{},
        all_device_len:0,
        one_device_type_connect:0,
        loop_time_mecall:3000,
        loop_timer_mecall:0,
        mecall_index:0,
        loop_time_get_status:1000,
        loop_timer_get_status:0
    }
         
    var smart_home = {
        init:function(){
            this.init_action();
           // this.init_find_smart_devices();
            this.init_my_smart_devices();
        },
        init_action:function(){//绑定事件
            this.action_smart_devices_change();
            this.action_connect();
            this.action_scanning();
            this.action_scanning_again();
            this.action_akey_connect();
            this.action_refresh();
        },
        action_smart_devices_change:function(){//切换智能设备
            var _this = this;
            $(".smart_home .smart_devices_change .tab-item").off("click").on("click", function () {
                var me = $(this),
                    index = me.index(),
                    containers = $(".smart_devices_container");

                if(me.hasClass("disabled")){
                    return;
                }
                if(index==0){
                    _this.init_find_smart_devices();
                }else if(index ==1){
                    _this.init_my_smart_devices();
                }
                me.siblings(".tab-item").removeClass("on").end().addClass("on");
                containers.stop(true,true).not(containers.get(index)).fadeOut("normal", "linear", function () {
                    containers.eq(index).fadeIn("normal", "linear");
                });

            });
        },
        init_find_smart_devices:function(){//初始化发现新智能设备
            var layer  = $("#find_smart_devices_layer");
            layer.find(".tab").hide().eq(0).show();
            $("#zoom").removeClass("searching");
            layer.find(".scanning-tip").hide();
            layer.find(".scanning-time").html("0");
            layer.find(".scanning").show();
            current_html = "find_smart_devices";
        },
        init_my_smart_devices:function(){//初始化已有智能设备列表
            if(smart_devices.loop_timer_scanning){
                clearInterval(smart_devices.loop_timer_scanning);
            }
            if(smart_devices.loop_timer_get_status){
                clearInterval(smart_devices.loop_timer_get_status);
            }
            this.paint_my_smart_list();
            current_html = "my_smart_devices";
        },
        action_connect:function(){//连接
            var wrap_layer = $("#find_smart_devices_layer"),
                that = this;

            wrap_layer.find(".btn_connect").off("click").on("click", function () {
                var vendor = $("#vendor_sel option:selected").val();
                var init_Qihoo_360 = function(){
                    wrap_layer.find(".tab").hide().eq(1).show();
                }
                var init_other = function(){
                    that.akey_connect_ajax();
                }
                if(vendor==="Qihoo_360"){//Qihoo_360
                    init_Qihoo_360();
                }else{//other
                    init_other();
                }
            })

        },
        action_scanning:function(){//扫描智能设备
            var wrap_layer = $("#find_smart_devices_layer"),
                that = this;
            wrap_layer.find(".scanning").off("click").on("click", function () {
                var _this = this;
                var $scanning_tip = wrap_layer.find(".scanning-tip"),
                    $timetip = $scanning_tip.find(".scanning-time"),
                    $zoom = $("#zoom");
                $(".smart_home .smart_devices_change .tab-item").removeClass("disabled").addClass("disabled");  //禁止点击选项卡
                var scanning_device = function(){
                    $zoom.removeClass("searching").addClass("searching");
                    $(_this).hide();
                    check_scanning_time();
                    scanning_device_data("Qihoo_360");
                }
                var check_scanning_time = function(){
                    $scanning_tip.show();
                    $timetip.html(smart_devices.time_begin_scan);
                    if(smart_devices.loop_timer_scanning){
                        clearInterval(smart_devices.loop_timer_scanning);
                    }
                    smart_devices.loop_timer_scanning = setInterval(function(){
                        smart_devices.time_begin_scan -=1;
                        $timetip.html(smart_devices.time_begin_scan);
                        if(smart_devices.time_begin_scan < 0 ||current_html != "find_smart_devices"){
                            clearInterval(smart_devices.loop_timer_scanning);
                            smart_devices.time_begin_scan = smart_devices.time_temp_scan;
                        }
                    },1000)
                }
                function scanning_device_data(vendor){
                    var $scanning_tip = wrap_layer.find(".scanning-tip"),
                        $timetip = $scanning_tip.find(".scanning-time"),
                        $zoom = $("#zoom");
                    $.post(path+'al_scan_dev.cgi',"vendor="+vendor,function(data){
                        var data = dataDeal(data);
                        data = that.scanning_not_connected_device(data);//剔除已连上的数据
                        scanning_device_over(data);
                        that.get_temp_data(data,"scan_data_temp");
                        $(".smart_home .smart_devices_change .tab-item").removeClass("disabled");  //允许点击选项卡
                    })
                    var scanning_device_over = function(data){
                        $zoom.removeClass("searching");
                        $scanning_tip.hide();
                        wrap_layer.find(".scanning").show();
                        if(smart_devices.loop_timer_scanning){
                            clearInterval(smart_devices.loop_timer_scanning);
                            smart_devices.time_begin_scan = smart_devices.time_temp_scan;
                        }
                        var $tab = wrap_layer.find(".tab");
                        if(data.length ==0){
                            $tab.hide().eq(2).show();
                        }else{
                            $tab.hide().eq(3).show();
                            that.paint_smart_device_list(data);
                        }
                    }
                }

                scanning_device();
            });
        },
        action_scanning_again:function(){//重新扫描
            var wrap_layer = $("#find_smart_devices_layer");
            wrap_layer.find(".scan-again").off("click").on("click",function(){
                wrap_layer.find(".tab").hide().eq(1).show();
                wrap_layer.find(".scanning").click();
            })
        },
        action_akey_connect:function(){//一键连接
            var wrap_layer = $("#find_smart_devices_layer"),
                that = this;
            wrap_layer.find(".a-key-connect").off("click").on("click",function(){
                that.akey_connect_ajax();

            })
        },
        action_refresh:function(){ //已有智能设备------刷新
            var wrap_layer_my =  $("#my_smart_devices_layer"),
                that = this;
            wrap_layer_my.find(".refresh").off("click").on("click",function(){
                show_message("wait");
				if(smart_devices.wait_timer)
					clearTimeout(smart_devices.wait_timer);
				smart_devices.wait_timer = window.setTimeout(function(){
					that.init_my_smart_devices();
				},1000);
            })
        },
        akey_connect_ajax:function(){
            var that = this;
            var vendor = $("#vendor_sel option:selected").val();
            function get_device_num (){//得到所有的设备个数
                return smart_devices.all_device_len;
            }
            function get_device_type_single_num(device_type){//得到每一类设备中的个数
                var data = smart_devices.connect_data_temp;
                if(data[device_type]["data"]){
                    return data[device_type]["data"].length;
                }
            }
            function get_device_state_num(device_type,flag){//得到每个类型中连接成功与失败的设备个数
                var dataList = smart_devices.connect_data_temp[device_type]["data"],
                    success_arr = [],
                    error_arr = [],
                    num = 0;
                if(dataList.length>0){
                    for(var i = 0;i < dataList.length;i++){
                        if(dataList[i]["state"]=="1"){
                            success_arr.push(dataList[i]);
                        }else{
                            error_arr.push(dataList[i]);
                        }
                    }
                }
                if(flag=="SUCCESS"){
                    num = success_arr.length;
                }else{
                    num = error_arr.length;
                }
                return num;
            }
            function isOneTypeAllConnected(device_type){//全部连上
                var data =  smart_devices.connect_data_temp[device_type]["data"];
                return  get_device_state_num(device_type,"SUCCESS") === data.length ? true : false;
            }
            function isOneTypeNotConnected(device_type){//一个都没有连上
                var data =  smart_devices.connect_data_temp[device_type]["data"];
                return  get_device_state_num(device_type,"ERROR") === data.length ? true : false;
            }
            function get_device_type_num(){//得到设备类型个数
                var data = smart_devices.scan_data_temp,
                    device_len = 0;
                for(var key in data){
                    if(data[key]["data"].length>0){
                        device_len++;
                    }
                }
                return device_len;
            }
            function get_device_name(type){
                return device_type[type] ||"";
            }
            function smart_device_link_post(){
                //开始连接
                var not_begin = function(){
                    show_pop_layer("smart_home_pop");
                    $("#smart_home_type").removeClass().addClass("wait");
                    var htmlStr =L_SMART.txt1+L_SMART.txt3+get_device_type_num()+L_SMART.txt4+","+get_device_num()+L_SMART.txt5+L_SMART.txt6+"<br/>"+L_SMART.txt9;
                    $("#smart_home_msg").html(htmlStr);
                }
                var parmObj = {} ;
                if(vendor==="Qihoo_360"){
                     parmObj = {
                        con_type:"scan",
                        /*user:"",*/
                        timeout:smart_devices.timeout_con_dev
                    }
                }else{
                     parmObj = {
                        con_type:"protocol",
                        con_protocol:protocol[vendor],
                        timeout:smart_devices.timeout_con_dev
                    }
                }
                function check_time_countdown(flag){
                    var vendorStr = L_SMART[vendor];
                    var get_htmlStr_other = function(){
                        return vendorStr+L_SMART.txt6+L_SMART.txt2+L_SMART.txt10+","+L_SMART.txt9;
                    }
                    var htmlStr = get_htmlStr_other();
                    $("#smart_home_msg").html(htmlStr);
                }
                if(vendor!=="Qihoo_360"){
                    show_pop_layer("smart_home_pop");
                    $("#smart_home_type").removeClass().addClass("wait");
                    check_time_countdown("other");
                }
                $.post(path + 'al_con_dev.cgi',parmObj,function(data){
                    var data = dataDeal(data);
                    if(vendor==="Qihoo_360"){
                        not_begin();
                    }
                    smart_device_link_start(data);
                });

            }
            function smart_device_link_start(data){
                if(data == "SUCCESS"){
                    get_con_dev_status_loop()
                }
                else{
                    show_message("error",igd.make_err_msg(data));
                }
            }
            function get_con_dev_status_loop(){
                if(smart_devices.loop_timer_get_status){clearInterval(smart_devices.loop_timer_get_status)};
                smart_devices.loop_timer_get_status = setInterval(function(){
                    if(current_html != "find_smart_devices"){
                        clearInterval(smart_devices.loop_timer_get_status);
                    }
                    get_con_dev_status();

                },smart_devices.loop_time_get_status);
            }
            function get_con_dev_status(){

                $.post(path + 'al_get_con_dev_status.cgi','protocol='+protocol[vendor],function(data){
                    var data = dataDeal(data);
                    if(vendor==="Qihoo_360"){
                        smart_device_link_loop_Qihoo_360(data);
                    }else{
                        smart_device_link_loop_other(data);
                    }
                });
            }
            function smart_device_link_loop_Qihoo_360(data){
                data = data[0];
                that.get_temp_data(data["list"],"connect_data_temp");

                if(data.progress== "0"){//未开始

                }else if(data.progress== "1"){//正在连入
                    connecting(data);
                }else if(data.progress== "2"){//通知结束
                    smart_devices.one_device_type_connect = 0; //重置
                    smart_devices.mecall_index = 0;
                    connected_stated_show(data);
                }

                function connecting(data){
                    show_pop_layer("smart_home_pop");
                    var device_type = data["doing_type"],
                        left_time = data["left_time"]

                    var check_time_countdown = function(device_type,left_time){
                        var vendorStr = L_SMART[vendor];
                        var get_htmlStr = function(time){
                            return L_SMART.txt2+L_SMART.txt3+get_device_type_single_num(device_type)+L_SMART.txt5+vendorStr+get_device_name(device_type)+","+L_SMART.txt9+"<br/>"+L_SMART.txt12+L_SMART.txt13+"<span class='blue'>"+time+"</span>"+L_SMART.second;
                        }
                        var htmlStr =  get_htmlStr(left_time);
                        $("#smart_home_msg").html(htmlStr);
                    }

                    $("#smart_home_type").removeClass().addClass(device_type);
                    check_time_countdown(device_type,left_time);
                }

                function connected_stated_show(data){
                    var meCall = arguments.callee;
                    clearInterval(smart_devices.loop_timer_get_status);
                    show_pop_layer("smart_home_pop");

                    var vendorStr = L_SMART[vendor],
                        index =smart_devices.connect_data[smart_devices.mecall_index]["index"],
                        device_type = device_type_arr[index],
                        htmlStr = "";
                    var device_link_over = function(data){
                        if(smart_devices.loop_timer_get_status){clearInterval(smart_devices.loop_timer_get_status);}
                        setTimeout(function(){
                            hide_pop_layer("smart_home_pop");
                            data = that.scanning_not_connected_device(data["list"]); //剔除已连上的数据
                            that.get_temp_data(data,"scan_data_temp");
                            that.paint_smart_device_list(data);
                        },3000);

                        if(smart_devices.one_device_type_connect === get_device_type_num()){
                            setTimeout(function(){
                                $(".smart_home .smart_devices_change .tab-item").eq(1).click();
                            },4000)
                        }
                    }
                    if(isOneTypeAllConnected(device_type)){//全部连上
                        smart_devices.one_device_type_connect+=1;  //某一类设备全部连上 就加1
                        $("#smart_home_type").removeClass().addClass(device_type+"_success");
                        htmlStr = L_SMART.txt7+L_SMART.txt3+get_device_type_single_num(device_type)+L_SMART.txt5+get_device_name(device_type);

                    }else if(isOneTypeNotConnected(device_type)){//一个都没有连上
                        $("#smart_home_type").removeClass().addClass(device_type+"_error");
                        htmlStr=L_SMART.txt3+get_device_name(device_type)+"<br />"+L_SMART.txt8+get_device_state_num(device_type,"ERROR")+L_SMART.txt5;

                    }else{//其他
                        $("#smart_home_type").removeClass().addClass(device_type+"_error");
                        htmlStr = L_SMART.txt7+L_SMART.txt3+get_device_name(device_type)+get_device_state_num(device_type,"SUCCESS")+L_SMART.txt5+"<br />"+L_SMART.txt8+get_device_state_num(device_type,"ERROR")+L_SMART.txt5;
                    }

                    $("#smart_home_msg").html(htmlStr);

                    smart_devices.mecall_index+=1;

                    if(smart_devices.mecall_index == get_device_type_num()){
                        clearTimeout(smart_devices.loop_timer_mecall);
                        smart_devices.mecall_index = 0;
                        device_link_over(data);
                        return;
                    }
                    smart_devices.loop_timer_mecall = setTimeout(function(){
                        meCall(data);
                    },smart_devices.loop_time_mecall);
                }
            }

            function smart_device_link_loop_other(data){
                data = data[0];

                if(data.progress== "0"){//未开始

                }else if(data.progress== "1"){//正在连入
                    connecting(data);
                }else if(data.progress== "2"){//通知结束
                    if(data.list.length>0){
                        that.get_temp_data(data["list"],"scan_data_temp");
                        that.get_temp_data(data["list"],"connect_data_temp");
                    }
                    smart_devices.one_device_type_connect = 0; //重置
                    smart_devices.mecall_index = 0;
                    setTimeout(function(){
                        connected_stated_show(data);
                    },200)

                }

                function connecting(data){
                    show_pop_layer("smart_home_pop");
                    var left_time = data["left_time"];

                    var check_time_countdown = function(left_time){
                        var vendorStr = L_SMART[vendor];
                        var get_htmlStr_other = function(time){
                            return vendorStr+L_SMART.txt6+L_SMART.txt2+L_SMART.txt10+","+L_SMART.txt9+"<br/>"+L_SMART.txt13+"<span class='blue'>"+time+"</span>"+L_SMART.second;
                        }
                        var htmlStr = get_htmlStr_other(left_time);
                        $("#smart_home_msg").html(htmlStr);
                    }

                    $("#smart_home_type").removeClass().addClass("wait");
                    check_time_countdown(left_time);
                }

                function connected_stated_show(data){
                    var meCall = arguments.callee;
                    clearInterval(smart_devices.loop_timer_get_status);
                    show_pop_layer("smart_home_pop");
                    var vendorStr = L_SMART[vendor],
                        htmlStr = "";

                    var clear_btn_retry = function(){
                        if($("#smart_home_btn_wrap").length>0){
                            $("#smart_home_btn_wrap").remove();
                        }
                        };

                    var add_btn_retry = function(){
                        var warp = $("#smart_home_pop"),
                            htmlStr = ["<div id='smart_home_btn_wrap'>",
                                "<input type='button' class='btn btn_retry' value='确定'>",
                                "</div>"].join("");
                        warp.append($(htmlStr));
                        warp.on("click",".btn_retry",function(){
                            hide_pop_layer("smart_home_pop");
                            clear_btn_retry()
                        })
                    };

                    var device_link_over = function(data){
                        if(smart_devices.loop_timer_get_status){clearInterval(smart_devices.loop_timer_get_status);}
                        setTimeout(function(){
                            hide_pop_layer("smart_home_pop");
                            data = that.scanning_not_connected_device(data["list"]); //剔除已连上的数据
                            that.get_temp_data(data,"scan_data_temp");
                            // that.paint_smart_device_list(data);
                        },3000);

                        if(smart_devices.one_device_type_connect === get_device_type_num()){
                            setTimeout(function(){
                                $(".smart_home .smart_devices_change .tab-item").eq(1).click();
                            },4000)
                        }
                    }

                    if(data["list"].length >0){//都连上
                        var index =smart_devices.connect_data[smart_devices.mecall_index]["index"];
                        var device_type = device_type_arr[index];
                        if(isOneTypeAllConnected(device_type)){
                            smart_devices.one_device_type_connect+=1;  //某一类设备全部连上 就加1
                            $("#smart_home_type").removeClass().addClass("success");
                            htmlStr = L_SMART.txt7+L_SMART.txt3+get_device_type_single_num(device_type)+L_SMART.txt5+vendorStr+get_device_name(device_type);
                        }

                    }else{//一个都没有连上
                        $("#smart_home_type").removeClass().addClass("error");
                        htmlStr=L_SMART.txt11;
                    }
                    $("#smart_home_msg").html(htmlStr);
                    if(data["list"].length===0){
                        clear_btn_retry();
                        add_btn_retry();
                        clearTimeout(smart_devices.loop_timer_mecall);
                        return;
                    }
                    smart_devices.mecall_index+=1;

                    if(smart_devices.mecall_index == get_device_type_num()){
                        clearTimeout(smart_devices.loop_timer_mecall);
                        smart_devices.mecall_index = 0;
                        device_link_over(data);
                        return;
                    }
                    smart_devices.loop_timer_mecall = setTimeout(function(){
                        meCall(data);
                    },smart_devices.loop_time_mecall);
                }
            }
            smart_device_link_post();
        },
        scanning_not_connected_device:function(data){//剔除连接成功状态的数据
            var tempData = [],
                len = data.length;
            for(var i = 0;i < len;i++){
                if(data[i]["state"] != "1"){
                    tempData.push(data[i]);
                }
            }
            return tempData;
        },
        get_temp_data:function(data,key){//将连接得到的数据处理一次放入一个临时的全局中间变量里面
            smart_devices[key] = {};
            smart_devices.all_device_len = data.length;

            for(var i = 0,len = device_type_arr.length;i < len;i++){
                smart_devices[key][device_type_arr[i]] = {
                    index:i,
                    data:[]
                };
                for(var j = 0;j<data.length;j++){
                    if(data[j].type === device_type_arr[i]){
                        smart_devices[key][device_type_arr[i]]["data"].push(data[j]);
                    }
                }
            }
            if(key == "connect_data_temp"){
                var data_temp = smart_devices.connect_data_temp,
                    device_len = 0;
                smart_devices.connect_data = {};
                for(var k in data_temp){
                    if(data_temp[k]["data"].length>0){
                        smart_devices.connect_data[device_len] = data_temp[k];
                        device_len++;
                    }
                }
            }

        },
        paint_smart_device_list:function(data){
            var wrap_layer = $("#find_smart_devices_layer");
            wrap_layer.find(".count").html(data.length);
            var len = data.length;
            var new_data =[];
            for(var i=0; i<len ; i++){
                var tmp = {};
                tmp.ssid = data[i].ssid || L_SMART.unknown_ssid;
                tmp.vendor = data[i].vendor||L_SMART.unknown_vendor;
                tmp.type = device_type[data[i].type];
                tmp.mac = data[i].mac;
                new_data.push(tmp);
            }
            var tab = new Table("smart_device_list",[L_SMART.ssid,L_SMART.vendor,L_SMART.type,L_SMART.mac],new_data);
            tab.initTable();
        },
        paint_my_smart_list:function(){
            $.post(path + 'al_get_con_dev_list.cgi','show_type=1',function(data){
                var data = dataDeal(data);
				hide_pop_layer("message_layer");
				hide_pop_layer("lock_div");
				if (data && data.data) {
					my_smart_device_list_callback(data.data);
				}
            });
            var my_smart_device_list_callback = function(ret){
                var list = ret;
                var len = list.length;
                var index = 0;
                var wrap_layer_my =  $("#my_smart_devices_layer");
                if(len == 0){
                    wrap_layer_my.find(".tab-1").show();
                    wrap_layer_my.find(".tab-2").hide();
                }
                else{
                    wrap_layer_my.find(".tab-1").hide();
                    wrap_layer_my.find(".tab-2").show();
                    var new_data = [];
                    for(var i = 0; i < len; i++){
                        var tmp = {};
                        tmp.ssid = list[i].ssid || "-";
                        tmp.vendor = list[i].vendor || "-";
                        tmp.type = device_type[list[i].type] ||"-";
                        tmp.model = list[i].model || "-";
                        tmp.mac = list[i].mac || "-";
                        var status = "";
                        if(list[i].link_status == "1"){
                            status = "<span class=\"blue\">"+ link_status[list[i].link_status] +"</span>";
                            index++;
                        }
                        else{
                            status = link_status[list[i].link_status];

                        }
                        tmp.link_status = status;
                        new_data.push(tmp);
                    }
                    set_device_num(index);

                    var tab = new Table("my_smart_device_list",[L_SMART.ssid,L_SMART.vendor,L_SMART.type,L_SMART.model,L_SMART.mac,L_SMART.status],new_data);
                    tab.initTable();
                }
            }
            var set_device_num = function(num){
                $("#my_device_txt2").html("( "+L_SMART.current+num+L_SMART.txt5+L_SMART.device+L_SMART.online+" )");
            }
        }
    }

    var init_smart_home_old = function () {
        $("body").css("background","#fdfdfd");
        $("#conner").hide();
        $("#smart_home_layer").fadeIn(1500,function(){
            $(this).removeClass("section_hide").addClass("section_show");
        });
    }

    var init_smart_home = function () {
        smart_home.init();
        //init_smart_home_old();
    }
    window.init_smart_home = init_smart_home;
})();
