/**
 * Created by Administrator on 2015/4/1.
 */
;(function(){

    var log = {
        appHtml:null,
        classification_log:function(data,type){
            var me = this;
            var classification_arr=[];
            for(var m in data){
                if(data[m]["event"]==type){
                    classification_arr.push(data[m]);
                }
            }
            me.createListInfo(classification_arr);
        },
        pageToggle:function(name){
            if(name=="log-host-sel") {
                mobile_host_control.M_Swiper.subSlideTo(0);
                return;
            }
            mobile_host_control.M_Swiper.subSlideTo(1);
        },
        createListInfo:function(data){
            var me =this;
            var node = $("#log-list");
            var htmlList="";
            var noList = common_M_html.noTableListDataTip;
            node.removeClass("noTableListDataTip");
            if(!data.length){node.addClass("noTableListDataTip").html(noList);return;}
            for(var member in data){
                var htmlStr="<dd><span>time</span><span>msg</span></dd>";
                htmlStr=htmlStr.replace("time",data[member].time).replace("msg",get_log_msg(data[member]));
                htmlList+=htmlStr;
            }
            node.html(htmlList);
        },
        getLogData:function(val){
            var me =this;
            $.post("/router/log_get.cgi", {mid:0}, function (data) {
                var dataV = dataDeal(data);
                me.classification_log(dataV,val);
            });
        },
        addEventList:function(){
            var me =this;
            var node=$(".log-host-sel");
            node.undelegate("dd","click").delegate("dd","click",function(){
                var dataV=$(this).attr("data-source-data-value");
                me.getLogData(dataV);
                me.pageToggle("log-list");
                mobile_host_control.app.addReturnBackCallBackFns(function(){
                    me.pageToggle("log-host-sel");
                });
            });
        },
        init:function(){
            $(".appSave").hide();
            this.addEventList();
        }
    };
    window.log=log;
    define(function(){
        return log;
    });
})();
