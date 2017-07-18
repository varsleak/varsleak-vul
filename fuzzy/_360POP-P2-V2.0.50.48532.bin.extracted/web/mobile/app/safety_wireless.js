/**
 * Created by lan on 2015/4/8.
 */
var appHtml=appL.safety_wireless.js;
var safety_wireless={
    subCurrentHtml:null,
    pageToggle:function(name){
        var me = this;
        var title = $(".appTitle");
        var save = $(".appSave");
        var section = $("#appContent section").not(":first");
        title.html(appHtml[name]);
        me.subCurrentHtml=name;
        if(name=="safetyWirelessSet"){
            languageM_nav_map[current_html].formData="second_protect_set_frm";
            Tools.form.subCurrentHtml_init_formData();
        }
        else
            languageM_nav_map[current_html].formData="";
        if(name=="safetyWirelessHost"){
            save.hide();
            mobile_host_control.M_Swiper.subSlideTo(0);
            return;
        }else{
            section.hide();$("."+name).show();
            if(name=="safetyWirelessSet"|| name=="safetyWirelessWhite"){ save.show();}
            else {save.hide()}
            mobile_host_control.M_Swiper.subSlideTo(1);
        }
        eval(name.replace(/-/,"_")+".init"+"()");
    },
    callback_event:function(name){
        var me =this;
        var app=mobile_host_control.app;
        app.addReturnBackCallBackFns(function(){
            if(me.subCurrentHtml=="safetyWirelessSet"){
                if(!Tools.form.action_get_DATA(1)){app.addReturnBackCallBackFns(arguments.callee);return false;}
            }
            me.pageToggle(name);
        });
    },
    addEventList:function(){
        var me = this;
        var node = $(".safetyWirelessHost");
        node.undelegate("dd","click").delegate("dd","click",function(){
            var safetyWirelessStatus=safetyWirelessSet.safetyWirelessStatus;
            var htmlName = $(this).attr("data-html-name");
            if(htmlName!="safetyWirelessSet"&&safetyWirelessStatus=='0'){
                show_message("msg_info",appHtml.safety_status_tip_txt);
                htmlName="safetyWirelessSet";
            }
            me.pageToggle(htmlName);
            me.callback_event("safetyWirelessHost");
        });
    },
    init:function(){
        $.extend(appHtml,MobileHtml[current_html]["js"]);
        $(".appSave").hide();
        this.addEventList();
        safetyWirelessSet.radioSelectConfig();
        safetyWirelessSet.init();

    }
};
define(function(){
   return safety_wireless;
});
//set form
(function(){
    var ck_answer = [];//保存问题的答案
    var resData;//保存get参数
	var is_wireless_user;
	var is_white_user;
	var timer;
    var safetyWirelessSet={
         questionObj:null,
         safetyWirelessStatus:null,//保存开启状态值
         initSafetyWirelessPage:function() {
			var d = new Date();
            var  me =this;
            nos.app.net('/app/safety_wireless/webs/safe_question_dump.cgi', 'action=0&dump_flag=1&__time' + d.getTime(), function(data) {
                var list = [];
                ck_answer = [];
                me.questionObj={};
                list.push({txt:data.question0,value:"0"});
                list.push({txt:data.question1,value:"1"});
                list.push({txt:data.question2,value:"2"});
				list.push({txt:appHtml.customQuestion,value:"3"});
                me.questionObj.list = list;
                me.questionObj.selected = data.id;
                resData = data;
				var lengthKeyObj0 = parentEmt.get_rand_key(0,data.answer0,true);
				var answer0 = getDAesString(data.answer0,lengthKeyObj0.rand_key);
                ck_answer.push(answer0);
                resData.answer0 = answer0;
				var answer1 = getDAesString(data.answer1,lengthKeyObj0.rand_key);
                ck_answer.push(answer1);
                resData.answer1 = answer1;
				var answer2 = getDAesString(data.answer2,lengthKeyObj0.rand_key);
                ck_answer.push(answer2);
                resData.answer2 = answer2;
				var answer3 = getDAesString(data.answer3,lengthKeyObj0.rand_key);
                ck_answer.push(answer3);
                resData.answer3 = answer3;
				is_wireless_user = data.is_wireless_user;
				is_white_user = data.is_white_user;
				
                me.init_select_option("ques_id_option",me.questionObj);
            });
        },
        //初始化下拉菜单
        init_select_option:function(id,obj){
            var objDom = $("#"+id);
            var list = obj.list;
            var key = obj.selected;
            var me = safetyWirelessSet;
            var createOption = function (obj) {
                var _li = $("<li>");
                _li.attr({"data-value": obj.value}).html(obj.txt);
                _li.appendTo(objDom);
            };
            objDom.html("");
            for(var mem in list){
                createOption(list[mem]);
            }
            me.init_safety_wireless();
        },
        init_safety_wireless:function() {
            var me =this;
            var subMenuColorStyle=["#808080","#333"];
            me.safetyWirelessStatus=resData['enable'];
            Tools.select.set(me.questionObj.selected,"ques_id");
            Tools.radio.set("safety_wireless_status",resData['enable']);
            Tools.radio.set("enable_router",resData['enable_deny_router']);
            Tools.radio.set("enable_computer",resData['enable_deny_computer']);
            Tools.form.subCurrentHtml_init_formData();
            $(".safetyWirelessHost dd:not(:first)").css("color",subMenuColorStyle[resData["enable"]]);
        },
        //下拉菜单函数
        question_change:function(val) {
            var me =this;
            if (val == 3) {
                $('#idf_question').show();
                $('#question3').val(resData['question' + val]);
            } else {
                $('#question3').val('');
                $('#idf_question').hide();
            }
            $('#wirel_answer').val( resData['answer' + val]);
        },
        radioSelectConfig:function(){
            Tools.select.config.ques_id={};
            Tools.select.config.ques_id.oEvent="safetyWirelessSet.question_change";
            Tools.radio.config.switch.safety_wireless_status={};
            Tools.radio.config.switch.safety_wireless_status.oEvent="safetyWirelessSet.set_question_type";
        },
        //sys_idf 单选按钮
        set_question_type:function(typeVal) {
            if(typeVal == 0) {
                var cur_answer = $('#wirel_answer').val();
                var id = $("#ques_id").val();
                if(cur_answer != ck_answer[id])
                    $('#wirel_answer').val(ck_answer[id]);
                Tools.radio.set("enable_computer",0);
            }
            Tools.radio.set("enable_router",typeVal);
            Tools.form._disabled(typeVal);
        },
        //提交函数
        qh_pwd_enable:function() {
            var me =this;
            var enable_val = parseInt($('#safety_wireless_status_hidden').val());
            if (enable_val == 1) {
                if (!check_answer('wirel_answer')) return;
                if (parseInt($('#ques_id').val()) == 3) {
                    if (!check_app_input('question')) return;
                }
            }
			if(is_wireless_user == "1" && enable_val == 1 && is_white_user == "0"){
				show_dialog(appCommonJS.dialog.use_wifi,function(){
					show_message("save");
					nos.app.net('/app/safety_wireless/webs/safe_question.cgi', 'second_protect_set_frm', function(data){
					me.submit_callback(data);
					if(timer)
						window.clearTimeout(timer);
					time = window.setTimeout(function(){
						window.top.location.href = "http://www.360.cn/";
					},3000);
				});
				});
			}
			else{
            	show_message("save");
            	nos.app.net('/app/safety_wireless/webs/safe_question.cgi', 'second_protect_set_frm', me.submit_callback);
			}
        },
        submit_callback:function(data) {
            var me =safetyWirelessSet;
            me.set_callback(data);
            me.initSafetyWirelessPage();
        },
        //设置成功的回调函数
        set_callback:function(data) {
            if (data == "SUCCESS") {
                show_message('success', appCommonJS.controlMessage.c_suc);Tools.form.subCurrentHtml_init_formData();
            } else {
                show_message('error', igd.make_err_msg(data));
            }
        },
        addSeniorEvent:function(){
            var me = this;
            var node=$("#safeWirelessSeniorBtn");
            var senior = $("#safetyWirelessSeniorSet");
            var seniorContent=$(".senior_set");
            senior.unbind("click").bind("click",function(){
                seniorContent.fadeToggle();
                $(this).toggleClass("expand");
            });
        },
        init:function(){
                this.initSafetyWirelessPage();
                this.addSeniorEvent();
                languageM_nav_map[current_html].save="safetyWirelessSet.qh_pwd_enable";
            }
        };
    window.safetyWirelessSet=safetyWirelessSet;
})();

// white list
(function(){
    var safety_white_data;
    var safetyWirelessWhite={
        init_safety_white:function() {
           var me = this;
           nos.app.net('/app/safety_wireless/webs/prevent_ceng_net_show.cgi', 'action=get_white',me.changeListData);
        },
        changeListData:function(data){
            var listInfo={};
            var me =safetyWirelessWhite;
            var isAuth;
            var authBtnClass=["safeWCancelAuth","safeWAuth"];
            listInfo=data;
            safety_white_data={};
//            safety_white_data=data;
            $.extend(true,safety_white_data,data);
            for(var i = 0 ;i< data.length;i++){
                isAuth=parseInt(data[i]["type"],10)==2?1:0;
                listInfo[i].host_name=appHtml.hostName+(data[i].s_name||data[i].host_name);
                listInfo[i].mac="MAC:"+data[i].mac;
                listInfo[i].type=appHtml.authType[data[i].type];
                listInfo[i].authCon=appHtml.authBtn[isAuth];
                listInfo[i].authBtnClass=authBtnClass[isAuth];
                listInfo[i].addToBlack=appHtml.addToBlack;
            }
            me.createWhiteList(listInfo);
        },
        createWhiteList:function(data){
            var htmlStr="";
            var node = $("#safetyWirelessWhiteList");
            var listHtml = $("#safetyWirelessWhiteTemplate").html();
            var complied=_.template(listHtml);
            var noList = common_M_html.noTableListDataTip;
            node.removeClass("noTableListDataTip");
            if(!data.length){node.addClass("noTableListDataTip").html(noList);return;}
            for(var i=0;i<data.length;i++){
                htmlStr+=complied(data[i]);
            }
            node.html(htmlStr);
        },
        sendSetCgi:function(data,callback){
            var me = this;
            show_message("save");
            nos.app.net('/app/safety_wireless/webs/prevent_ceng_net.cgi',data,callback);
        },
        auth_cancel_add_event:function(type,index){
            var me=this;
            var dealStr=["auth","auth_cancel","add_black"];
            var obj =safety_white_data[index];
            obj.deal=dealStr[type];
            var url = objectChangeToUrl(obj);
            me.sendSetCgi(url,me.con_callback);
        },
        con_callback:function(data) {
            var me = safetyWirelessWhite;
            safetyWirelessSet.set_callback(data);
            me.init_safety_white();
        },
        safeWhiteSubmit:function(){
            var me =this;
            var data=['deal=auth_cancel_all','deal=auth_all'];
            var sendUrl=data[$("#authAllStatus_hidden").val()];
            me.sendSetCgi(sendUrl,me.con_callback);
        },
        addEventList:function(){
           var me = this;
           var safeWhiteListNode = $("#safetyWirelessWhiteList");
           safeWhiteListNode.undelegate(".safeWCancelAuth,.safeWAuth,.addToBlack","click").delegate(".safeWCancelAuth,.safeWAuth,.addToBlack","click",function(){
               var type;
               var index=$(this).parents("dd").index();
               if($(this).hasClass("addToBlack")) { type = 2}
               else{type= $(this).hasClass("safeWCancelAuth")?1:0;}
               me.auth_cancel_add_event(type,index);
           });
        },
        init:function(){
            this.addEventList();
            this.init_safety_white();
            Tools.radio.set("authAllStatus","0");
            languageM_nav_map[current_html].save="safetyWirelessWhite.safeWhiteSubmit";
        }
    };
    window.safetyWirelessWhite=safetyWirelessWhite;
})();
// black list
(function(){
    var safety_black_data=null;
    var safetyWirelessBlack={
        init_safety_black:function(){
            var me = this;
            nos.app.net('/app/safety_wireless/webs/prevent_ceng_net_show.cgi', 'action=get_black', me.changeListData);
        },
        changeListData:function(data){
            var me =safetyWirelessBlack;
            safety_black_data=[];
            safety_black_data=data;
            me.createWhiteList(data);
        },
        createWhiteList:function(data){
            var htmlStr="";
            var node = $("#safetyWirelessBlackList");
            var listHtml = $("#safetyWirelessBlackTemplate").html();
            var complied=_.template(listHtml);
            var noList = common_M_html.noTableListDataTip;
            node.removeClass("noTableListDataTip");
            if(!!data.length){
                for(var i=0;i<data.length;i++){
                    data[i].addToWhite=appHtml.addToWhite;
                    htmlStr+=complied(data[i]);
                }
                node.html(htmlStr);
                $("#safetyBlackDel").fadeIn();
            }
            else{
                $("#safetyBlackDel").fadeOut();node.addClass("noTableListDataTip").html(noList);
            }
        },
        safety_con_cgi:function(index,type){
            var me = this;
            var obj = safety_black_data[index];
            var dealStr = ["del_black","add_to_white"];
            obj.deal = dealStr[type];
            var url =objectChangeToUrl(obj);
            if(type=="0"){
                me.safety_black_del(url);
            }
            else{
                me.safety_black_atbl(url);
            }
        },
         safety_black_del:function(url) {
            var me=this;
            show_dialog(appCommonJS.dialog.del_single,function(){
                safetyWirelessWhite.sendSetCgi(url,me.safetyBlackCallback);
            })
         },
        safety_black_atbl:function(url) {
            var me=this;
            safetyWirelessWhite.sendSetCgi(url,me.safetyBlackCallback);
        },
        black_del_all:function () {
            var me =this;
            show_dialog(appCommonJS.dialog.del_all,function(){
                safetyWirelessWhite.sendSetCgi('deal=del_black_all',me.safetyBlackCallback);
            });
        },
        safetyBlackCallback:function(data){
            var me = safetyWirelessBlack;
           safetyWirelessSet.set_callback(data);
            me.init_safety_black();
        },
        addEventList:function(){
            var me =this;
            var node=$("#safetyWirelessBlackList");
            var delAllBtn = $("#safetyBlackDel");
            node.undelegate(".delBlackList,.addToWhite","click").delegate(".delBlackList,.addToWhite","click",function(){
                var type=$(this).hasClass("delBlackList")?0:1;
                var index=$(this).parents("dd").index();
                me.safety_con_cgi(index,type);
            });
            delAllBtn.unbind("click").bind("click",function(){
                me.black_del_all();
            });
        },
        init:function(){
            this.init_safety_black();
            this.addEventList();
        }
    };
    window.safetyWirelessBlack=safetyWirelessBlack;
})();

//对象转化成url
function objectChangeToUrl(obj) {
    var url = 0;
    for (var member in obj) {
        url += '&' + member + '=' + obj[member];
    }
    return url = url.substr(2);
}
var reg_app_map = {
    question: [{
        id: "question3",
        type: "string"
    }],
    noneed: []
};

//检查数据
function check_answer(key) {
    var _input = document.getElementById(key);
    if (_input) {
        var point_xy = getPosition(_input);
        point_xy.x += _input.clientWidth + 10;
        if (_input.nodeName.toLowerCase() == "select")
            point_xy.y -= 20;
        else
            point_xy.y -= _input.clientHeight;

        var reg_val = _input.value;
        var res = check_answer_str(reg_val);
        if (res == true) res = CheckLength(_input);
        if (res != true) {
            var msgbox = new MessageBox(res, point_xy);
            msgbox.Show();
            return false;

        }
    }
    return true;
}
function check_answer_str(str) {
    var question_type = $('#ques_id').val(),errorStr = appHtml.answerStr;
    var regTest, tip = '';
    if (question_type == 0) {
        regTest = /^[0-9]{6}$/;
        var resultVal = regTest.test(str);
        if (!resultVal) {
            tip = errorStr[0];
            return tip;
        }
    } else if (question_type == 1) {
        regTest = /^[0-9]{6}$/;
        var resultVal = regTest.test(str);
        if (!resultVal) {
            tip = errorStr[1];
            return tip;
        }
    } else if (question_type == 2) {
        regTest = /^[0-9]{5,15}$/;
        var resultVal = regTest.test(str);
        if (!resultVal) {
            tip = errorStr[2];
            return tip;
        }
    } else {
        return tip = parentEmt.check_string(str);
    }
    return true;
}
