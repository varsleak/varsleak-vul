/**
 * Created by Administrator on 2015/4/1.
 */
var portMap = {
    pageToggle:function(name,type){
        var me = this;
        var title = $(".appTitle");
        var save = $(".appSave");
        var section = $("#appContent section").not(":first");
        if(name=="portMap-set"){
            title.html(me.appHtml[name][type]);save.show();
            Tools.select.set("tcp","proto");
        }else{
            title.html(me.appHtml[name]);save.hide();
            if(name=="dmz-set"){save.show();}
        }
        if(name=="portHost") {
            mobile_host_control.M_Swiper.subSlideTo(0);
            return;
        }
        section.hide();$("."+name).show();
        mobile_host_control.M_Swiper.subSlideTo(1);
        eval(name.replace(/-/,"_")+".init"+"()");
    },
    callback_event:function(name){
        var me =this;
        mobile_host_control.app.addReturnBackCallBackFns(function(){
            me.pageToggle(name);
        });
    },
    addEventList:function(){
        var me =this;
        var node = $(".portHost");
        node.undelegate("dd","click").delegate("dd","click",function(){
            var dataHtmlName = $(this).attr("data-source-html-name");
            var type = null;
            if(dataHtmlName=="portMap-set"){
                type=0;
            }
            me.pageToggle(dataHtmlName,type);
            me.callback_event("portHost");
        });
        $("#portMap-list-tab").undelegate("dd","click").delegate("dd","click",function(){
            me.pageToggle("portMap-set",1);
            me.callback_event("portMap-list");
            portMap_list.virtual_change($(this).index());
        });
    },
    init:function(){
        $(".appSave").hide();
        this.appHtml=MobileHtml[current_html]["js"];
        this.addEventList();
    }
};
define(function(){
    return portMap;
});

var appHtml=appL.portmap.js;
var reg_app_map = {
    port_a: [
        {id: "dest_port_a", type: "port"}
    ],
    port_b: [
        {id: "dest_port_a", type: "port"},
        {id: "dest_port_a", type: "port"}
    ],
    virtual_service_frm: [
        {id: "virtual_name", type: "string"},
        {id: "virtual_in_ip", type: "in_ip"},
        {id: "src_port_a", type: "port"},
        {id: "src_port_b", type: "port noneed"}
    ],
    dmz_set: [
        {id: "dmz_ip_address", type: "in_ip"}
    ],
    noneed: []
};

//-----------------虚拟服务virtual 列表-------------
(function(){

    var portMap_list={
        virtual_service_setup_data:null,
        init_virtual:function() {
            var me = this;
            nos.app.net('/app/portmap/webs/virtual_service_list_show.cgi', 'noneed=noneed', me.init_virtual_callback);
         },
        init_virtual_callback:function(data) {
             var me = portMap_list;
            me.virtual_service_setup_data={};
            me.virtual_service_setup_data = data;
            me.create_virtual_list(data);
        },
        addEventListInfo:function(){
            var me = this;
            var node =$("#portMap-list-tab");
            node.undelegate(".arp-del-btn","click").delegate(".arp-del-btn","click",function(e){
                me.virtual_delete($(".arp-del-btn").index($(this)));
                e.stopPropagation();
            });
        },
        reset_data : function(type,obj){
            with (obj){
                $("#action").val(type);
                $("#virtual_name").val(name);
                $("#virtual_in_ip").val(in_ip);
                $("#dest_port_a").val(out_start_port);
                $("#dest_port_b").val(out_end_port);
                $("#src_port_a").val(in_start_port);
                $("#src_port_b").val(in_end_port);
                $("#uiname-port-set").val(uiname);
                Tools.select.set(protocol,"proto");
            }
        },
         virtual_change:function(index) {
             var me = this;
             var obj = me.virtual_service_setup_data[index];
             var create_old_data=function(){
                 var tempStr = "";
                 with (obj) {
                     tempStr += '<input type="hidden" name="old_name" value="' + name + '"/>';
                     tempStr += '<input type="hidden" name="old_in_ip" value="' + in_ip + '"/>';
                     tempStr += '<input type="hidden" name="old_in_start_port" value="' + in_start_port + '"/>';
                     tempStr += '<input type="hidden" name="old_in_end_port" value="' + in_end_port + '"/>';

                     tempStr += '<input type="hidden" name="old_out_start_port" value="' + out_start_port + '"/>';
                     tempStr += '<input type="hidden" name="old_out_end_port" value="' + out_end_port + '"/>';

                     tempStr += '<input type="hidden" name="old_protocol" value="' + protocol + '"/>';
                     tempStr += '<input type="hidden" name="old_uiname" value="' + uiname + '"/>';
                     $("#modify_hidevalue_box").html(tempStr);
                 }
             };
             me.reset_data(1,obj);
             create_old_data();
        },
         virtual_delete:function(id) {
            show_dialog(appCommonJS.dialog.del_single, function () {
                var me = portMap_list;
                var obj =me.virtual_service_setup_data[id];
                var out_start_port_ = obj.out_start_port;
                var out_end_port_ = obj.out_end_port;
                var in_start_port_ = obj.in_start_port;
                var in_end_port_ = obj.in_end_port;
                var in_ip = obj.in_ip;
                var protocol =encodeURIComponent(obj.protocol);
                var name = obj.name;
                var str = "mode=2" + "&name=" + name + "&in_ip=" + in_ip + "&protocol=" +
                    protocol + "&out_start_port=" + out_start_port_ + "&out_end_port=" +
                    out_end_port_ + "&in_start_port=" + in_start_port_ + "&in_end_port=" +
                    in_end_port_ + "&uiname=ALL";
                nos.app.net('/app/portmap/webs/virtual_service_add_del.cgi', str, me.virtual_delete_callback);
            });
        },
         virtual_delete_callback:function(data) {
             var me = portMap_list;
            if (data == "SUCCESS") {
                show_message("success",appCommonJS.controlMessage.d_suc);
            }
            else {
                show_message("error", igd.make_err_msg(data));
            }
             me.init_virtual();
        },
        create_virtual_list:function(data){
            var me = portMap;
            var node =$("#portMap-list-tab");
            var htmlList = "";
            var noList = common_M_html.noTableListDataTip;
            node.removeClass("noTableListDataTip");
            if(!data.length){node.addClass("noTableListDataTip").html(noList);return;}
            for(var member in data){
                var htmlStr="<dd class='select_dd'><span>name</span><span>ip</span><a href='javascript:void(0);' class='arp-del-btn'></a></dd>";
                htmlStr=htmlStr.replace("name",data[member]["name"]).replace("ip",data[member]["in_ip"]);
                htmlList+=htmlStr;
            }
            node.html(htmlList);
        },
        edit_submit:function(){

        },
        init:function(){
            this.init_virtual();
            this.addEventListInfo();
        }
    };
    window.portMap_list=portMap_list;
})();


/**
 * 虚拟服务设置增加方法
 * @returns {boolean}
 */
(function(){
    var portMap_set={
        resetFormData:function(){
            $("#modify_hidevalue_box").html("");
            portMap_list.reset_data(0,{
                name:"",
                in_ip:"",
                out_start_port:"",
                out_end_port:"",
                in_start_port:"",
                in_end_port:"",
                uiname:"ALL",
                protocol:"tcp"
            });
        },
        check_in_out_count:function() {
            var dest_port_a = $("#dest_port_a").val();
            var dest_port_b = $("#dest_port_b").val();
            var src_port_a = $("#src_port_a").val();
            var src_port_b = $("#src_port_b").val();
            if ((dest_port_b * 1 - dest_port_a * 1) != (src_port_b * 1 - src_port_a * 1)) {
                show_message("error", appHtml.controlMessage);
                return false;
            }
            return true;
        },
         virtual_service_submit:function() {
            var me =this;
            if (check_app_input("virtual_service_frm")) {
                if (!check_proto_sele()) {
                    return;
                }
                if (!me.check_in_out_count()) {
                    return;
                }
                var porta = $("#src_port_a").val();
                var portb = $("#src_port_b").val();
                if ($("#src_port_b").val() != "") {
                    var return_val = check_start_end_port(porta, portb);
                    if (return_val != true) {
                        var ctr_obj = document.getElementById("src_port_a");
                        var point_xy = getPosition(ctr_obj);
                        point_xy.x += ctr_obj.clientWidth + 5;
                        point_xy.y -= ctr_obj.clientHeight;
                        var msgbox = new MessageBox(return_val, point_xy);
                        msgbox.Show();
                        return false;
                    }
                }
                nos.app.net('/app/portmap/webs/virtual_service_add_del.cgi', 'virtual_service_frm', me.virtual_service_submit_callback);
            }
        },
        virtual_service_submit_callback:function(data) {
            if (data == "SUCCESS"){
                show_message("success", appCommonJS.controlMessage.s_suc);
                portMap.pageToggle("portMap-list");
            }
            else
                show_message("error", igd.make_err_msg(data));
        },
        init:function(){
            this.resetFormData();
            languageM_nav_map[current_html].save="portMap_set.virtual_service_submit";
        }
    };
    window.portMap_set=portMap_set;
})();


//-----------------dmz------------------
(function(){

    var dmz_set={
        init_dmz:function() {
            var me = this;
             me.html_load_dmz(1);
        },
        dmz_change:function(val) {
            Tools.form._disabled(val);
        },
        virtual_dmz_add:function() {
            var me =this;
            var dmz_status = $("#dmz_status_hidden").val();
            if (dmz_status == "1") {
                if (!check_app_input("dmz_set")) {
                    return;
                }
            }
            nos.app.net('/app/portmap/webs/dmz.cgi', 'dmz_form', function (data) {
                if (data == "SUCCESS")
                    show_message("success", appCommonJS.controlMessage.s_suc);
                else
                    show_message("error", igd.make_err_msg(data));
                me.init_dmz();
            });
        },
         html_load_dmz:function(index) {
            var uiname = "WAN" + index;
            $("#uiname").val(uiname);
            var parm = "uiname=" + $("#uiname").val();
            nos.app.net('/app/portmap/webs/dmz_show.cgi', parm, function (data) {
                if (data) {
                    radio_set(data.dmz_status,"dmz_status");
                    $("#dmz_ip_address").val(data.host_ip);
                }
            });

         },
        init:function(){
            languageM_nav_map[current_html].save="dmz_set.virtual_dmz_add";
            Tools.radio.config.switch.dmz_status={};
            Tools.radio.config.switch.dmz_status.oEvent="dmz_set.dmz_change";
            this.init_dmz();
        }
    };
    window.dmz_set=dmz_set;

})();









