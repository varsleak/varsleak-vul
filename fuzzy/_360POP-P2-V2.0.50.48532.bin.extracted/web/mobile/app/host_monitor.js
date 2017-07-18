/**
 * Created by Administrator on 2015/3/30.
 */
var host_monitor={
    wanInfo:{
        all_out_in_byte:"0/0",
        all_out_in_byte_speed:"0/0",
        all_conn_num:"0",
        all_host_num:"0"
    },
    lanInfo:null,
    getWanInfoTimeId:null,
    getLanInfoTimeId:null,
    host_E_id:null,
    getWanInfo:function(){
        var me = this;
        me.getWanInfoTimeId=setInterval(function(){
            if(current_html!="host_monitor"){
                clearInterval(me.getWanInfoTimeId);
            }
            nos.app.net('/app/host_monitor/webs/interface_conn_speed_show.cgi', 'noneed=noneed&action=get&uiname=WAN1', host_monitor.setHostInfo);
        },1000)
    },
    getLanInfo:function(){
        var me = this;
        me.getLanInfoTimeId=setInterval(function(){
            if(current_html!="host_monitor"){
                clearInterval(me.getLanInfoTimeId);
            }
            nos.app.net('/app/host_monitor/webs/filter_hosts_dump.cgi', 'noneed=noneed&action=get', host_monitor.setHostInfo_com);
        },1000);
    },
    setHostInfo:function(data){
        var me =host_monitor;
        if (!data) {return;}
        $.extend(true,me.wanInfo,{
            all_out_in_byte:math_unit_converter(data.all_out_byte)+"/"+math_unit_converter(data.all_in_byte)
        });
        me.setHostData(["all_out_in_byte"]);
    },
    setHostInfo_com:function(data){
        var allConNum = 0;
        var allQosIn = 0;
        var allQosOut = 0;
        var me=host_monitor;
        me.lanInfo=data;
        if(!data){return;}
        for (var i in data) {
            allConNum += parseInt(data[i]["conn_count"],10);
            allQosIn +=(data[i].down_speed_qos>>>0);
            allQosOut +=(data[i].up_speed_qos>>>0);
        }
        $.extend(true,me.wanInfo,{
            all_conn_num:allConNum,
            all_host_num:data.length,
            all_out_in_byte_speed:math_unit_converter(allQosOut)+"/"+math_unit_converter(allQosIn)
        });
        me.setHostData(["all_conn_num","all_host_num","all_out_in_byte_speed"]);
        me.setListData();
        me.host_E_data_info();
    },
    setHostData:function(data){
        var me =this;
        var node = $("#host-info-data");
        for(var n=0;n<data.length;n++){
            node.find("."+data[n]).html(me.wanInfo[data[n]]);
        }
    },
    setListData:function(){
        var htmlStr = "";
        var me = this;
        for(var n in me.lanInfo ){
            var showName = me.lanInfo[n]['s_name'] || me.lanInfo[n]['alias'] || me.lanInfo[n]['device_label'] || me.lanInfo[n]['name'] || appCommonJS.other.unknownDevice;
            me.lanInfo[n]["host_name"]=showName;
            htmlStr+="<dd class=\"select_dd\"><label>"+showName+"</label><span>"+me.lanInfo[n]["mac"]+"</span></dd>";
        }
        $("#host-list").html("").html(htmlStr);
    },
    host_E_data_info:function(){
        var me =this;
        var resetData;
        var changeDataMode = function(data){
            return {
                host_name:data["host_name"],
                ip:data["ip"],
                mac:data["mac"],
                conn_count:data["conn_count"],
                up_speed_qos:data['up_speed_qos']== 0 ? '0' : math_unit_converter(data['up_speed_qos']),
                down_speed_qos:data['down_speed_qos']== 0 ? '0' : math_unit_converter(data['down_speed_qos']),
                up_byte:data['up_byte']== 0 ? '0' : math_unit_converter(data['up_byte']),
                down_byte:data['down_byte']== 0 ? '0' : math_unit_converter(data['down_byte']),
                up_time:changeTime(data["up_time"])
            }
        };
        if(!me.host_E_id&&me.host_E_id!=0) return;
        resetData=changeDataMode(me.lanInfo[me.host_E_id]);
        var node = $("#host-e-list-info");
        for(var str in resetData){
            node.find("."+str).html(resetData[str]);
        }
    },
    addHostListEvent:function(){
        var me = this;
        $("#host-list").undelegate("dd","click").delegate("dd","click",function(){
            me.host_E_id=$(this).index();
            me.host_E_data_info();
            me.pageToggle("host-e-info");
            mobile_host_control.app.addReturnBackCallBackFns(function(){
                me.pageToggle("host-info");
                me.host_E_id=null;
            });
        });
    },
    pageToggle:function(name){
        $(".appTitle").html(MobileHtml[current_html]["js"][name]);
        if(name=="host-info") {
            mobile_host_control.M_Swiper.subSlideTo(0);
            return;
        }
        mobile_host_control.M_Swiper.subSlideTo(1);
    },
    init:function(){
        $(".appSave").hide();
        this.getWanInfo();
        this.getLanInfo();
        this.addHostListEvent();
    }
};
define(function(){
    return host_monitor;
});
//时间转化
function changeTime(data) {
    var result,day = appCommonJS.time.day,hour = appCommonJS.time.hour,min=appCommonJS.time.min,sec=appCommonJS.time.sec;
    if (parseInt(data.day) > 0) {
        result = data.day + day + data.hour + hour + data.min + min + data.sec + sec;
    } else {
        if (parseInt(data.hour) > 0) {
            result = data.hour + hour + data.min + min + data.sec + sec;
        } else {
            if (parseInt(data.min) > 0) {
                result = data.min + min + data.sec + sec;
            } else {
                if (parseInt(data.sec) > 0) {
                    result = data.sec + sec;
                }
            }
        }
    }
    return result;
}