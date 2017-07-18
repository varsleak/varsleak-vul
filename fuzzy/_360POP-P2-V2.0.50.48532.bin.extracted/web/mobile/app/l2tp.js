/**
 * Created by lan on 2015/4/3.
 */
var appHtml;
var L2TP = {
    pageToggle:function(name,type){
        var me = this;
        var title = $(".appTitle");
        var save = $(".appSave");
        var section =$("#appContent section").not(":first");
        if(name=="l2tp-set"){
            title.html(appHtml[name][type]);save.show();
        }else{
            title.html(appHtml[name]);save.hide();
        }
        if(name=="l2tp-host") {
            mobile_host_control.M_Swiper.subSlideTo(0);
            return;
        }
        section.hide();$("."+name).show();
        eval(name.replace(/-/,"_")+".init"+"()");
        mobile_host_control.M_Swiper.subSlideTo(1);
    },
    callback_event:function(name){
        var me =this;
        mobile_host_control.app.addReturnBackCallBackFns(function(){
            me.pageToggle(name);
        });
    },
    addEventList:function(){
        var me = this;
        var node = $(".l2tp-hos");
        $(".l2tp-host").undelegate("dd","hold tap doubletap").delegate("dd","hold tap doubletap",function(){
            var htmlName = $(this).attr("data-srouce-html-name");
            if(htmlName=="l2tp-set"){
                me.pageToggle(htmlName,0);
            }
            else{
                me.pageToggle(htmlName);
            }
            me.callback_event("l2tp-host");
        });
    },
    init:function(){
        appHtml=MobileHtml[current_html]["js"];
        $(".appSave").hide();
        this.addEventList();
        l2tp_set.setRadioSwitchConfig();
        l2tp_list.addEventList();
        l2tp_status.addStatusListEvent();
    }
};
define(function(){
    return L2TP;
});
var reg_app_map = {
    com_mode: [
        {id:"servernet", type: "ip"},
        {id:"servermask", type: "mask"}
    ],
    l2tp_set: [
        {id:"server", type: "nin_ip_url"},
        {id:"user", type: "pptp_l2tp"},
        {id:"pass", type: "password_blank"}
    ],
    noneed:[]
};
// l2tp-set ===============
(function(){
    var l2tp_set={
        showInfoId:null,
         client_set_save:function(){
             var me=this;
            if(!check_app_input('l2tp_set')) return;
            if($('#radio_enterprise_mode').attr('checked')=='checked'){
                if(!check_app_input('com_mode')) return;
            }
             show_message("save");
            nos.app.net('/app/l2tp_client/webs/l2tp_client_add.cgi','client_set_frm',me.set_save_callback);
        },
         set_save_callback:function(data){
            var me = l2tp_set;
            if(data=="SUCCESS"){
                show_message("success",appCommonJS.c_suc);
                mobile_host_control.app.returnBackCallBackFns.pop();
                L2TP.pageToggle("l2tp-list");
                L2TP.callback_event("l2tp-host");
            }
            else{
                show_message("error",igd.make_err_msg(data));
            }
        },
        setRadioSwitchConfig:function(){
            Tools.radio.config.switch.status={};
            Tools.radio.config.switch.status={onTxt: "启用",offTxt: "禁止"};
        },
        init:function(){
            l2tp_list.resetFormData({enable:"1",pass:"",user:"",server:"",id:"",deal:""},"add");
            languageM_nav_map[current_html].save="l2tp_set.client_set_save";
            Tools.radio.set("status","1");
        }
    };
    window.l2tp_set=l2tp_set;
})();
//=========== l2tp - list  ==============
(function(){
    var l2tp_list={
        clientListData:null,
        lengthKeyObj:"",
        getList:function(){
            var me  = this;
            nos.app.net('/app/l2tp_client/webs/l2tp_client_config_show.cgi','noneed=noneed',me.saveData);
        },
        delList:function(index){
            var me =this;
            show_dialog(appCommonJS.dialog.del_single,function(){
                show_message("save");
                nos.app.net('/app/l2tp_client/webs/l2tp_client_del.cgi','id='+me.clientListData[index].id,me.delList_callback);
            })
        },
        delList_callback:function(data){
            var me = l2tp_list;
            if(data=="SUCCESS"){
                show_message("success",appCommonJS.d_suc);
            }
            else{
                show_message("error",igd.make_err_msg(data));
            }
            me.getList();
        },
        saveData:function(data){
            var me = l2tp_list;
            me.clientListData={};
            me.clientListData=data;
            me.create_l2tp_list(data);
            if(data.length>0){
               me.lengthKeyObj=get_rand_key(0,data[0].pass,true);
            }
        },
        create_l2tp_list:function(data){
            var htmlList="";
            var node=$("#l2tp-list");
            var noList = common_M_html.noTableListDataTip;
            node.removeClass("noTableListDataTip");
            if(!data.length){node.addClass("noTableListDataTip").html(noList);return;}
            for(var member in data){
                var htmlStr="<dd class='select_dd'><span>user</span><span>server</span><a href='javascript:void(0);' class='arp-del-btn'></a></dd>";
                htmlStr=htmlStr.replace("user",data[member]["user"]).replace("server",data[member]["server"]);
                htmlList+=htmlStr;
            }
            node.html(htmlList);
        },
        resetFormData:function(obj,type){
            var me = this;
            with (obj){
                Tools.radio.set("status",enable);
                $("#pass").val(getDAesString(pass,me.lengthKeyObj.rand_key));
                $("#user").val(user);
                $("#server").val(server);
                $('#id').val(id);
                $('#deal').val(type);
            }
        },
        addEventList:function(){
            var node=$("#l2tp-list");
            var me =this;
            node.undelegate("dd","click").delegate("dd","click",function(){
                var id=$(this).index();
                L2TP.pageToggle("l2tp-set",1);
                me.resetFormData(me.clientListData[id],'mod');
                L2TP.callback_event("l2tp-list");
            });
            node.undelegate(".arp-del-btn","click").delegate(".arp-del-btn","click",function(){
                me.delList($(".arp-del-btn").index($(this)));
            });
        },
        init:function(){
            languageM_nav_map[current_html].save="l2tp_set.client_set_save";
            this.getList();
        }
    };
    window.l2tp_list=l2tp_list;
})();


/*
*  l2tp - status */

;(function(){
    var l2tp_status={
        l2tpStatusListData:null,
        getStatusList:function(){
            var me = this;
            nos.app.net('/app/l2tp_client/webs/l2tp_client_status_show.cgi','noneed=noneed',me.saveStatusData);
        },
        saveStatusData:function(data){
            var me = l2tp_status;
            me.l2tpStatusListData={};
            me.l2tpStatusListData=data;
            me.create_status_list(data);
        },
        setStatusFormData:function(obj){
            with (obj){
                Tools.radio.set("link_status",link_status);
                $("#l2tp-status-user").html(user);
                $("#l2tp-status-localIp").html(local_ip);
                $("#l2tp-status-remoteIp").html(remote_ip);
                $("#l2tpStatusLinkId").val(id);
            }
        },
        statusPageToggle:function(){
            var statusListDd=$(".l2tp-status").find("dl");
            statusListDd.toggle();
            $(".appSave").toggle();
        },
        changeLinkStatus:function(index){
            var me=this;
            var linkStatus=$("#link_status_hidden").val();
            var id=$("#l2tpStatusLinkId").val();
            show_message("save");
            if(linkStatus==0){
                nos.app.net('/app/l2tp_client/webs/l2tp_client_down.cgi','id='+id,me.changeLinkStatusCallback);
            }
            else{
                nos.app.net('/app/l2tp_client/webs/l2tp_client_link.cgi','id='+id,me.changeLinkStatusCallback);
            }
        },
        changeLinkStatusCallback:function(data){
            var me = l2tp_status;
            if(data=="SUCCESS"){
                show_message("success",appCommonJS.d_suc);
            }
            else{
                show_message("error",igd.make_err_msg(data));
            }
            me.getStatusList();me.statusPageToggle();
        },
        create_status_list:function(data){
            var htmlList="";
            var node=$("#l2tp-status-list");
            var noList = common_M_html.noTableListDataTip;
            node.removeClass("noTableListDataTip");
            if(!data.length){node.addClass("noTableListDataTip").html(noList);return;}
            for(var member in data){
                var tempObj={};
                var linkClass ="l2tp-status-link-"+data[member].link_status;
                var htmlStr="<dd class='select_dd'><p><span>{{user}}</span><span class='"+linkClass+"'>{{link_status}}</span></p><p><span>{{local_ip}}</span><span>{{remote_ip}}</span></p></dd>";
                tempObj.user=data[member].user;
                tempObj.link_status=appHtml.linkStatus[data[member].link_status];
                tempObj.local_ip=appHtml.ipStr[0]+data[member].local_ip;
                tempObj.remote_ip=appHtml.ipStr[1]+data[member].remote_ip;
                htmlList+= _.template(htmlStr)(tempObj);
            }
            node.html(htmlList);
        },
        addStatusListEvent:function(){
           var me =this;
           var node=$("#l2tp-status-list");
            node.undelegate("dd","click").delegate("dd","click",function(){
                me.setStatusFormData(me.l2tpStatusListData[$(this).index()]);
                me.statusPageToggle();
               mobile_host_control.app.addReturnBackCallBackFns(function(){
                   me.statusPageToggle();
               });
            });
        },
        init:function(){
            languageM_nav_map[current_html].save="l2tp_status.changeLinkStatus";
            this.getStatusList();
        }
    };
    window.l2tp_status=l2tp_status;
})();
