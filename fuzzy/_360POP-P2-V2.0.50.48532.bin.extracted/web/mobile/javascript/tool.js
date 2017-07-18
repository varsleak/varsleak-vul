/**
 * Created by Administrator on 2015/3/19.
 */

var Tools = {};
Tools.funcCallBack=function(data,key){
    if(typeof data =="string"){
        eval(data+"("+key+")");
    }
    else if(typeof data =="function"){
        data.call(null,key);
    }
};
Tools.radio = {
    config: {
        switch: {
            default: {on:1,off:0,onTxt: "开启中",offTxt: "关闭中"},
            dhcp_enable:{oEvent:"dhcp_state_change"},
            work_mode_radio: {on:"NAT",off:"ROUTE"},
            is_black:{onTxt: "禁止中",offTxt: "上网中"}
        },
        radio: {}
    },
    getType: function (key, id) {
        var me = this;
        var node;
        var obj={};
        for(var mem in me.config){
            node =me.config[mem][id];
            if(!!node){
                obj={type:mem};
                for(var m in node){
                    if(node[m]==key){
                        obj.status = (m==="on")?true:false;
                        return obj;
                    }
                }
                obj.status =!!(key>>0);
                return obj;
            }
        }
        obj.type=null;
        obj.status =!!(key>>0);
        return obj;
    },
    set: function (id, key) {
        var me = Tools.radio;
        var name = id;
        var radioInfo;
        var domCon = $("#" + id);
        var domHidden = $("#" + id + "_hidden");
        var switchRadioInfo = {
            on: 1,
            off: 0,
            onTxt: me.config.switch.default.onTxt,
            offTxt: me.config.switch.default.offTxt,
            oEvent: null
        };
        var switchTxtDom = domHidden.siblings(".switch-txt");
        var select_switch = function () {
            if (domCon.hasClass("selectArrow")) {
                domHidden = domCon.find("input[type=hidden]");
                switchTxtDom = domCon.find(".switch-txt");
                name = domCon.attr("name");
            }
        };
        var switchRadioInfo_check =function(){
            radioInfo =me.getType(key,name);
            if(!radioInfo) return;
            if(!!radioInfo.type)  $.extend(true,switchRadioInfo,me.config[radioInfo.type][name]);
        };
        var setSwitchRadio = function(){
            domHidden.val(key);
            if(!radioInfo) return;
            !!switchTxtDom.length&&(!radioInfo.status?switchTxtDom.html(switchRadioInfo.offTxt):switchTxtDom.html(switchRadioInfo.onTxt));
            if(!radioInfo.status){
                domCon.removeClass("radio_on").addClass("radio_off");
            }
            else {
                domCon.removeClass("radio_off").addClass("radio_on");
                if (domCon.hasClass("selectArrow")) {
                    Tools.select.select(domCon.next(".option-box"));
                }
            }
            !domCon.hasClass("selectArrow") && domCon.prop("checked", radioInfo.status);
            var str = domHidden.val();
            !!switchRadioInfo.oEvent && Tools.funcCallBack(switchRadioInfo.oEvent,str);
        };
        select_switch();
        switchRadioInfo_check();
        setSwitchRadio();
    },
    change: function (obj) {
        var me = Tools.radio;
        var name = $(obj).attr("id");
        var switchRadioInfo = {
            on: 1,
            off: 0,
            onTxt: me.config.switch.default.onTxt,
            offTxt: me.config.switch.default.offTxt,
            oEvent: null
        };
        var currentObj, dom,domHidden, switchTxt;
        var type = $(obj).hasClass("radio") ? "radio" : "switch";

        var switchSelect = function () {
            if ($(obj).hasClass("selectArrow")) {
                name = $(obj).attr("name");
            }
        };
        var switchRadioInfo_check=function(){
            dom=$("#" + name);
            domHidden=$("#" + name +"_hidden");
            currentObj=me.config[type][name];
            if(type=="switch"){
                if(!!currentObj){
                    $.extend(true,switchRadioInfo,currentObj);
                }
                switchTxt = $(obj).prev(".switch-txt");
                if (!$(obj).is("input[type=checkbox]")) {
                    switchTxt = $(obj).find(".switch-txt");
                }
            }
            if(type=="radio"&&!!currentObj){
                $.extend(true,switchRadioInfo,currentObj);
            }
        };
        var setRadioSwitchStatus = function () {
            var isOn=$(obj).hasClass("radio_on"),oldValue=switchRadioInfo[!isOn?"off":"on"],newValue=switchRadioInfo[isOn?"off":"on"],newStr=switchRadioInfo[isOn?"offTxt":"onTxt"];
            if (switchRadioInfo.onbeforchange&&(typeof window[switchRadioInfo.onbeforchange]=="function"||typeof switchRadioInfo.onbeforchange=="function")) {
                var bcRV=(window[switchRadioInfo.onbeforchange]||switchRadioInfo.onbeforchange)(oldValue,newValue);
                if(typeof bcRV=="boolean"&&!bcRV)
                {
                    dom.prop("checked",isOn);
                    return;
                }
            }
            domHidden.val(newValue);
            if (type == "switch") {
                switchTxt.html(newStr);
            }
            $(obj).toggleClass("radio_on radio_off");
            if (!!switchRadioInfo.oEvent)
              Tools.funcCallBack(switchRadioInfo.oEvent,newValue);
        };
        switchSelect();
        switchRadioInfo_check();
        setRadioSwitchStatus();
    },
    init: function () {
        var me = this;
        $(".app-form").undelegate(".radio,.switch", "click").delegate(".radio,.switch", "click", function (e) {
            if($(this).hasClass("selectArrow")){Tools.form.action_get_DATA(0);}
            me.change($(this));
            e.stopPropagation();
        });
    }
};
//=============== radio end =======================
/*
 params:id_sel ---> value
 params:id_sel_option ---> option
 params:id_sel_txt ---> txt
 */
Tools.select = {
    config:{},
    select_disabled:null,//禁用下拉菜单
    closeFormSelect:function(){
        var me =this;
        var node = $("#appContent");

        var appContentStatus = function(){
            var currentSelectObj = $(".selected").find(".option-box");
            var selectArrow,isSwitchSelect;
            Tools.form.action_get_DATA(0);
            if(!currentSelectObj.length){return;}
            selectArrow = currentSelectObj.siblings(".selectArrow");
            isSwitchSelect=selectArrow.hasClass("switch");
            var srcT = $(event.target);
            var targetElem = isSwitchSelect?selectArrow.find(srcT).add(currentSelectObj.find(srcT)):selectArrow.find(srcT);
            if(srcT.hasClass("selectArrow")||targetElem.length){
                return;
            }
            me.select(currentSelectObj);
        };
        node.unbind("click",appContentStatus).bind("click",appContentStatus);
    },
    select: function (obj) {
        var me =this;
        var _option = $(obj);
        var _parentContent = _option.parents("section:first,.appContent_sectionModel:first");
        var setTop;
        _option.parent().toggleClass("selected");
        _option.parent().next("dd").toggleClass("selected_down");
        _option.stop(true,true).slideToggle("normal", function () {
            setTop=_parentContent.scrollTop()+_option.offset().top-100;
            _parentContent.scrollTop(setTop);
            me.isSelecting=false;
        });
    },
    select_value_init: function () {
        var setSelectValueID;
        var me = Tools.select, selectZone;
        (function () {
            var currentFun = arguments.callee;
			selectZone = $(".app-form:visible .selectArrow");
			!!setSelectValueID&&clearTimeout(setSelectValueID);
            selectZone.each(function () {
                var selectObj = $(this).children("input[type=hidden]");
                var selectValue = selectObj.val();
                if (selectValue == "" || !selectValue) {
                    setSelectValueID = setTimeout(currentFun, 500);return;
                }
                var selectId = selectObj.attr("id");
                me.set(selectValue, selectId);
            });
        })();
    },
    setValue: function (obj) {
        var me = this;
        var _ul = $(obj).parent();
        var selectArrow = _ul.prev(".selectArrow");
        var selTxt = $(obj).html();
        var contentTxt = /<span>.*?<\/span>/g.exec(selTxt);
        var selVal = $(obj).attr("data-value");
        var selectObj =selectArrow.find("input[type=hidden]");
        _ul.find("li").removeClass("selectedLi");
        $(obj).addClass("selectedLi");
        selectObj.val(selVal);
        if (!!contentTxt) {
            selTxt = contentTxt[0].replace(/span|\(|\)|\/|<|>/gi, "");
        }
        selectArrow.find("span").html(selTxt);
        me.isSelecting=true;
        me.select(_ul);
        if(!!me.config[selectObj.attr("id")]&&!!me.config[selectObj.attr("id")].oEvent)
            Tools.funcCallBack(me.config[selectObj.attr("id")].oEvent,selVal);
    },
    set: function (key, id) {
        var selectedObj = $("#" + id);var me =this;
        var _option_id = selectedObj.parent().next(".option-box");
        var labelTxt = selectedObj.parent().find(".select-txt");
        var optionStr = _option_id.find("li").removeClass("selectedLi");
        var strTxt;
        selectedObj.val(key);
        optionStr.each(function(){
            if ($(this).attr("data-value") == key) {
                strTxt = $(this).html();
                $(this).addClass("selectedLi");
                if (strTxt.indexOf("<span>") > -1) {
                    strTxt = strTxt.replace(/(<span>|\(|\))/gi, "").split("</span>")[0];
                }
                labelTxt.html(strTxt);
                if(!!me.config[id]&&!!me.config[id].oEvent)
                    Tools.funcCallBack(me.config[id].oEvent,key);
                return;
            }
        });
    },
	disabled:function(node,type,msg){
		var disabledColorStyle=["#808080","#333"];
		$("#" + node).parent().addClass("selectDisabled");
		$("#" + node).parent().find(".select-txt").css("color",disabledColorStyle[type]);
		$("#" + node).parent().off('click').on("click",function(){
			show_message("error",msg);
		});
	},
    isSelecting:false,
    init: function () {
        var me = this;
        var selectArrow = $(".app-form .selectArrow");
        var optionBox = $(".app-form .option-box li");
        me.select_disabled=false;
        $(".app-form").undelegate(".selectArrow", 'click').delegate(".selectArrow", 'click', function (e) {
			Tools.form.action_get_DATA(0);
            if(!!me.select_disabled||$(this).hasClass("selectDisabled")) return;
            var theIS = $(this);
            var resetObj = $(".selected ul.option-box");
            var currentObj = theIS.siblings(".option-box");
            if(!!me.isSelecting) return;
            me.isSelecting=true;
            if (!!resetObj.length&&resetObj.get(0) != currentObj.get(0)) {
                me.select(resetObj);
            }
            me.select(currentObj);
            e.stopPropagation();
        });
        $(".app-form .option-box ").undelegate("li", "click").delegate("li", "click", function (e) {
            me.setValue($(this));
            e.stopPropagation();
        });
        me.closeFormSelect();
    }
};
//=============== select end =======================

//===================== 覆盖 PC 端的 radio 函数 =====
(function () {
    window.radio_sele_set = Tools.radio.set;
    window.radio_set = function (key, id) {
        Tools.radio.set.call(this, id, key);
    };
    window.radio_toggle = function (obj, event) {
        Tools.radio.change.call(this, obj, event);
    };
})();

//================ 密码强度提示 =====================
Tools.pwStrength = {
    config: {},
    create: function (id, pwd) {
        remove_ck_pwd(id);
        var lb_pw_strength = common_M_html.pwStrengthTxT;
        if (pwd == "") return;
        $("#" + id).after("<div id=\"" + id + "_pwd_ck\" class=\"strength\"><div class=\"pwd_status\"><span>" + lb_pw_strength +
        "</span><span id=\"" + id + "_strength_L\" class=\"strength_L\"></span><span id=\"" + id + "_strength_M\" class=\"strength_M\"></span>" +
        "<span id=\"" + id + "_strength_H\" class=\"strength_H\"></span></div></div>");
        pwStrength(id, pwd, {M_color: "#FF6600"});
    },
    init: function () {
        //===================== 覆盖 PC 端的 密码强度函数 函数 =====
        window.ck_pwd = this.create;
    }
};

//================== 时间函数 ====================
Tools.time = {
    initValue: function () {
        timeTemp = [
            '<dd class="item">',
            '<label class="form-label" for="g_time0">{{timeTxt}}</label>',
            '<a id="g_time_A" name="g_time" class="selectArrow switch" href="javascript:void(0);"><span class="switch-txt"></span><input type="hidden" name="timer_enable" id="g_time_hidden" value="0" /><img  src="./images/selectArrow.png" /></a>',
            '<ul class="option-box"><li class="subMenu"><label>{{weekTitle}}</label></li>',
            '<li><input type="checkbox" value="1" id="g_day0"/>',
            '<label for="g_day0" >{{day0}}</label></li>',
            '<li><input type="checkbox" value="2" id="g_day1"/>',
            '<label for="g_day1" >{{day1}}</label></li>',
            '<li><input type="checkbox" value="3" id="g_day2"/>',
            '<label for="g_day2" >{{day2}}</label></li>',
            '<li><input type="checkbox" value="4" id="g_day3"/>',
            '<label for="g_day3" >{{day3}}</label></li>',
            '<li><input type="checkbox" value="5" id="g_day4"/>',
            '<label for="g_day4" >{{day4}}</label></li>',
            '<li><input type="checkbox" value="6" id="g_day5"/>',
            '<label for="g_day5" >{{day5}}</label></li>',
            '<li><input type="checkbox" value="7" id="g_day6"/>',
            '<label for="g_day6" >{{day6}}</label></li>',
            '<input type="hidden" name="timer_day" id="g_day" value=""/>',
            '<li class="subMenu"><label>{{timeTitle}}</label></li>',
            '<li class="item_time_group">',
            '<label class="form-label" for="">{{startTxt}}</label>',
            '<a class="hour_min"  href="javascript:void(0);"><input readonly="true" type="text"  maxlength="2"  value="00" name="start_hour" id="g_start_hour" class="input-text input-small" />',
            '<span class="time-label">{{s_hour}}</span>',
            '<input readonly="true" type="text"  maxlength="2" name="start_minute" id="g_start_min" value="00" class="input-text input-small"/>',
            '<span class="time-label">{{s_min}}</span></a>',
            '</li>',
            '<li class="item_time_group">',
            '<label class="form-label" for="">{{endTxt}}</label>',
            '<a class="hour_min" href="javascript:void(0);"><input readonly="true" type="text"  maxlength="2" value="23" name="end_hour" id="g_end_hour" class="input-text input-small"/>',
            '<span class="time-label">{{end_hour}}</span>',
            '<input readonly="true" type="text"  maxlength="2" value="59" name="end_minute" id="g_end_min" class="input-text input-small"/>',
            '<span class="time-label">{{end_min}}</span></a>',
            '</li>',
            '</ul></dd>'
        ].join('');
    },
    createSettingSection:{
        timeDisabled:null,
        timeToolTxt :null,//timeTools  language
        showSettingObj:null,//timeTools input arryObj
        timeToolsHtml:null,//timeTools insert html
        timeToolsContainerObj:null,//timeTools contentBox obj
        timeToolsCurrentHtml:null,//timeTools with currentHtml
        timeToolsCurrentType:null,//timeTools type
        setTingInfo:{
            type:"year_month_day",
            year:{init:"2015", max:"2015",min:"2008",slides:"30"},
            month:{init:"3",max:"12",min:"1",slides:"12"},
            day:{init:"26",max:"31",min:"1",slides:"31"},
            hour:{init:"0",max:"23",min:"0",slides:"24"},
            min:{init:"0",max:"59",min:"0",slides:"60"},
            sec:{init:"0", max:"59",min:"0",slides:"60"}
        },//timeTools set data
        getCurrentDate: function(){
            var currentDate = new Date();
            var me=this;
            var newDate = {
                year:{init:currentDate.getFullYear()},
                month:{init:currentDate.getMonth()+1},
                day:{init:currentDate.getDate()},
                hour:{init:currentDate.getHours()},
                min:{init:currentDate.getMinutes()},
                sec:{init:currentDate.getSeconds()}
            };
            $.extend(true,me.setTingInfo,newDate);
        },
        create_slide_li : function (type){
            var me=this;
            var timeToolsTypeHtml="";
            var i= 0,maxNum=me.setTingInfo[type].max>>0,minNum=me.setTingInfo[type].min>>0,compareTxt="00";
            timeToolsTypeHtml+="<div id=\""+type+"\" class=\"swiper-container "+type+"\"><ul class=\"swiper-wrapper\">";
            if(type=="year"){
                compareTxt="0000";maxNum=2037;
            }
            else if(type=="day"){
                maxNum=me.getMonth_day(me.setTingInfo.year.init,me.setTingInfo.month.init);me.setTingInfo.day.slides=maxNum;
            }
            var _init_i=minNum>>0;
            var _max_i=maxNum>>0;
            for(i=_init_i;i<=_max_i;i++){
                var spliceID=compareTxt.length-i.toString().length;
                var insertStr = compareTxt.substr(0,spliceID)+i.toString();
                timeToolsTypeHtml+="<li class=\"swiper-slide\">"+insertStr+"</li>";
            }
            timeToolsTypeHtml+="</ul></div><span class=\"sec-unit\">"+me.timeToolTxt[type]+"</span>";
            return timeToolsTypeHtml;
        },
        init_type_slide:function(data){
            var me=this;
            var typeStr = data.type.split("_");
            for(var mem in typeStr){
                me.timeToolsHtml.push(me.create_slide_li(typeStr[mem]));
            }
            me.timeToolsHtml=me.timeToolsHtml.join("");
            me.timeToolsContainerObj.removeClass("timeTools_loading").html(me.timeToolsHtml);
        },
        _init_setTingInfo:function(data){
            var me=this;
            me.getCurrentDate();
            $.extend(true,me.setTingInfo,data);
        },
        _init_time_tools_container:function(){
            var me = this;
            var _body=$("body");
            var _timeTools ='<div id="timeTools" class="'+me.setTingInfo.type+'"><div class="control-box"><button class="cancelBtn">'+me.timeToolTxt.cancelBtn+'</button><button class="confirmBtn">'+me.timeToolTxt.confirmBtn+'</button></div><div class="content-box"></div></div>';
            _body.find("#timeTools").remove();
            $(_timeTools).appendTo(_body);
            setTimeout(function(){
                $("#timeTools").addClass("timeTools_show");
            },10);
            me.timeToolsContainerObj=$("#timeTools").find(".content-box").addClass("timeTools_loading").html(common_M_html.loadingTip);

//            var node =$("#timeTools");
//            node.removeAttr("class").addClass("timeTools_show "+me.setTingInfo.type);
//            me.timeToolsContainerObj=node.find(".content-box").addClass("timeTools_loading").html(common_M_html.loadingTip);
        },
        timeTools_addEventList : function (){
            var me = this;
            var node =  $("#timeTools");
            node.undelegate(".cancelBtn","click").delegate(".cancelBtn","click",function(){
                $("#timeTools").removeClass("timeTools_show");
                remove_lock_div();
            });
            node.undelegate(".confirmBtn","click").delegate(".confirmBtn","click",function(){
                var dataObj = node.find(".swiper-slide-active");
//                var setInfo=[];
//                var unit=node.find(".swiper-container");
                for(var m=0;m<dataObj.length;m++){
//                    me.showSettingObj.eq(m).val(dataObj.eq(m).html().replace(/^[0]/,""));
                    me.showSettingObj.eq(m).val(dataObj.eq(m).html());
                }
                node.find(".cancelBtn").click();
            });

        },
        getMonth_day:function(yearV,monthV){
            var year = parseInt(yearV,10);
            var month = parseInt(monthV,10);
            var day_arr_30=[4,6,9,11];
            var day_arr_30_index= $.inArray(month,day_arr_30);
            if(month==2){
                if((year%4==0&&year%100!=0)||(year%400==0)){
                    return 29;
                }
                return 28;
            }
            else{
                if(day_arr_30_index!=-1) return 30;
                return 31;
            }
        },
        createTimeToolsObj:function(data){
            var me = this;
//            var _body=$("body");
            me.timeToolTxt=common_M_html.timeTools;
            me.timeToolsHtml = [];
            me._init_setTingInfo(data);
            me._init_time_tools_container();
            me.init_type_slide(data);
            me.timeTools_addEventList();
        },
        timeBtn_addEventList:function(){
            var me = this;
            var appObj = $("#appContent");
            var subTimeTools=".hour_min,.hour_min_sec,.year_month_day";
            var basicConfig={
                paginationClickable: true,
                direction: 'vertical',
                loop:true,
                loopedSlides :null,
                loopAdditionalSlides :1,
                centeredSlides : true
            };
            var timeGroup={};
            var onInit_TimeTools={year:false,month:false};
            var judge_month_Day=function(type){
                var year = $(".year .swiper-slide-active").html()>>0;
                var month = $(".month .swiper-slide-active").html()>>0;
                var day = $(".day .swiper-slide-active").html()>>0;
                var currentDay = $(".day ul li").not(".swiper-slide-duplicate").length;
                var changeMonthDay = function(){
                    var getCurrent_src=function(src){
                        var day_arr_30=[4,6,9,11];
                        var day_arr_30_index= $.inArray(src,day_arr_30);
                        if(src==2){
                            if((year%4==0&&year%100!=0)||(year%400==0)){
                                return 29;
                            }
                            return 28;
                        }
                        else{
                            if(day_arr_30_index!=-1) return 30;
                            return 31;
                        }
                    };
                    var srcDay = getCurrent_src(month);
                    var type = currentDay-srcDay;
                    if(type==0) {return;}
                    else{control_day_show(srcDay);}
                };
                var control_day_show=function(src){
                    timeGroup.day.removeAllSlides();
                    me.setTingInfo.day.max=src;
                    var slideHtml = (function(type){
                        var timeToolsTypeHtml="";
                        var i,maxNum=me.setTingInfo[type].max>>0,minNum=me.setTingInfo[type].min>>0,compareTxt="00";
                        var _init_i=minNum>>0;
                        var _max_i=maxNum>>0;
                        for(i=_init_i;i<=_max_i;i++){
                            var spliceID=compareTxt.length-i.toString().length;
                            var insertStr = compareTxt.substr(0,spliceID)+i.toString();
                            timeToolsTypeHtml+="<li class=\"swiper-slide\">"+insertStr+"</li>";
                        }
                        return timeToolsTypeHtml;
                    })("day");
                    timeGroup.day.loopedSlides=src;
                    timeGroup.day.activeIndex=(day-src>0?src:day)-1;
                    timeGroup.day.appendSlide(slideHtml);
                };
                if(type=="year"&&month!=2) {return;}
                changeMonthDay();
            };
            var createSlideConfig = function(type){
                var config={};
                $.extend(config,basicConfig);
                var _init_data = me.setTingInfo;
                switch (type){
                    case "year":
                        config.loopedSlides=30;
                        config.initialSlide=parseInt(_init_data[type].init,10)-2008;
                        config.onInit=function(){
                            onInit_TimeTools.year=true;
                        };
                        config.onSlideChangeEnd=function(swiper){
                            if(!onInit_TimeTools.year) return;
                            if(swiper.isBeginning){swiper.slideTo(0,500,false);}
                            judge_month_Day(type);
                        };
                        break;
                    case "month":
                        config.loopedSlides=parseInt(_init_data[type].slides,10);
                        config.initialSlide=parseInt(_init_data[type].init,10)-1;
                        config.onInit=function(){
                            onInit_TimeTools.month=true;
                        };
                        config.onSlideChangeEnd=function(swiper){
                            if(swiper.isBeginning){swiper.slideTo(0,500,false);}
                            if(!onInit_TimeTools.month) return;
                            judge_month_Day(type);
                        };
                        break;
                    case "day":
                        config.loopedSlides=parseInt(_init_data[type].slides,10);
                        config.initialSlide=parseInt(_init_data[type].init,10)-1;break;
                    default :config.loopedSlides=parseInt(_init_data[type].slides,10);config.initialSlide=parseInt(_init_data[type].init,10);
                }
                return config;
            };
            var createObj = function(obj){
                var initTime = $(obj).find("input[type=text]");
                me.showSettingObj=initTime;
                var type=$(obj).attr("class");
                var data={type:type};
                var type_list=type.split("_");
                var createTimeToolsObj = function(){
                    for(var i=0;i<type_list.length;i++){
                        var classification =type_list[i];
                        if(!!initTime.eq(i).val()){
                            data[classification]={};
                            data[classification].init=initTime.eq(i).val();
                        }
                    }
                    return data;
                };
                var createSliderObj = function(){
                    for(var i=0;i<type_list.length;i++){
                        var classification =type_list[i];
                        timeGroup[classification]= new Swiper('.'+classification,createSlideConfig(classification));
                    }
                };
                me.createTimeToolsObj(createTimeToolsObj());
                createSliderObj();
            };
            appObj.undelegate(subTimeTools,"click").delegate(subTimeTools,"click",function(){
                if(!!me.timeDisabled) return;
                show_lock_div();
//                if(me.timeToolsCurrentHtml==current_html&&me.timeToolsCurrentType==$(this).attr("class")){
//                    show_lock_div();
//                    $("#timeTools").addClass("timeTools_show");
//                    return;
//                }
                me.timeToolsCurrentHtml=current_html;
                me.timeToolsCurrentType=$(this).attr("class");
                createObj($(this));
            });
        },
         _init:function(){
            this.timeDisabled=false;
            this.timeBtn_addEventList();
        }
    },
    languageInit: function (data) {
        var timeObj = $("#time_segment_ctr");
        var TimeHtml = common_M_html.time_group;
        timeObj.html("");
        var complied = _.template(timeTemp);
        timeObj.html(complied(TimeHtml));
    },
    uniform_time_style:function(value,type){
        value[type]="00".substr(value[type].length)+value[type];
        return value[type];
    },
    init: function () {
        this.initValue();
        this.createSettingSection._init();
    }
};
//================== 数字框 ====================

Tools.numbox = {
    config:{},
    check: function (key, id) {
        var selectedObj = $("#" + id);var me =this;
        var _option_id = selectedObj.parent().next(".option-box");
        var labelTxt = selectedObj.parent().find(".select-txt");
        var optionStr = _option_id.find("li").removeClass("selectedLi");
        var strTxt;
        optionStr.each(function(){
            if ($(this).attr("data-value") == key) {
                strTxt = $(this).html();
                $(this).addClass("selectedLi");
                if (strTxt.indexOf("<span>") > -1) {
                    strTxt = strTxt.replace(/(<span>|\(|\))/gi, "").split("</span>")[0];
                }
                labelTxt.html(strTxt);
                if(!!me.config[id]&&!!me.config[id].oEvent)
                    Tools.funcCallBack(me.config[id].oEvent,key);
                //                    eval(me.config[id].oEvent+"("+key+")");
                return;
            }
        });
    },
    init: function () {
        $(".app-form").undelegate(".num-box", "keyup").delegate(".num-box", "keyup", function () {
            var maxLength=$(this).attr("maxlength");
            !($(this).val() * 1 > 0 || $(this).val() * 1 == 0) ? $(this).val("") : $(this).val(parseInt($(this).val() * 1));
            if ($(this).val().length > maxLength) {
                $(this).val($(this).val().substring(0, maxLength));
            }
        });
    }
};
//================== 数字框 end ====================
//======================================
//(function () {
//    window.paint_time_segment = Tools.time.change;
//})();
// ============   页面 form  =====================
Tools.form={
   initFormData:null,
   endFormData:null,
   isConfirmLeave:null,//强制离开
   saveFirstData:null,
   ajaxModel:function(){
       var me =this;
       $("#appContent").ajaxSuccess(function(evt, request,settings){request.responseText=="[\"SUCCESS\"]"&&(me.initFormData=null,me.saveFirstData=true);});
   },
   subCurrentHtml_init_formData:function(filterReason){
        var me =Tools.form;
        me.isConfirmLeave=false;
        me.saveFirstData=true;
        me.action_get_DATA(0,filterReason);
    },
   action_get_DATA:function(type,filterReason,dialogFlag){
       var currentObj = mobile_host_control.app.getNavObj(languageM_nav_map,current_html);
       var me =this;
       var flagDialog = typeof dialogFlag == "undefined"?true:!!dialogFlag ;
       if(!!currentObj.formData){
           if(type==0){if(!!me.saveFirstData)me.saveFirstData=false;else return false;}
           return Tools.form._form_data(currentObj.formData,type,filterReason) || (function(){
               if(type==1){
                   if(!!me.isConfirmLeave||!me.initFormData) return true;
                   else return  me._judge_change_status(flagDialog);
               }
           })();
       }
       return true;
   },
   _disabled:function(type,controlFlag){
       var disabledStatus=!(type>>0);
       var node=$("#appContent form:visible");
       var disabledColorStyle=["#808080","#333"];
       var controlNode = controlFlag||":first";
       Tools.select.select_disabled=disabledStatus;
       Tools.time.createSettingSection.timeDisabled=disabledStatus;
       node.find(":text,.select-txt").css("color",disabledColorStyle[type]);
       node.find(":text,:password,:checkbox:not("+controlNode+")").prop("disabled",disabledStatus);
   },
    _form_data:function(id,type,filterReason){
        var me = this;
        var node=$("#"+id);
        var FormInfoData="";
        var formDataObj=node.find(":text,:password,input[type=hidden]:not('#g_day'),:checkbox:checked:not(.radio,.switch)");//g_day 时间组参数接口不规范
        if(!!filterReason){
            formDataObj = formDataObj[filterReason.type](filterReason.dom); // type : not / filter  dom: 选择器字段
        }
        for(var i = 0;i<formDataObj.length;i++){
            FormInfoData+=formDataObj.eq(i).val();
        }
        if(type==0) me.initFormData=FormInfoData;
        else if(type==1)  me.endFormData=FormInfoData;
        else return FormInfoData;
    },
    _judge_change_status:function(flag){
        var me = this;
        if(me.initFormData!=me.endFormData){
            if(!!flag){
                var dialogTxtObj = common_M_html.waringTip;
                dialog_text.saveDataTip=dialogTxtObj.txtHtml;
                show_dialog(dialogTxtObj.saveDataTip,function(){
                    $(".appSave").trigger("saveSetting");
                },function(){
                    var node=$(".timeTools_show");
                    if(!!node.length) node.removeClass("timeTools_show");
                    me.isConfirmLeave=true;
                    window.history.back();
                },"saveDataTip");
            }
            return false;
        }
        return true;
    },
    init:function(){
        this.initFormData=null;
        this.endFormData=null;
        this.isConfirmLeave=null;
        this.saveFirstData=true;
        this.ajaxModel();
        Tools.select.select_disabled=false;
        Tools.time.createSettingSection.timeDisabled=false;
    }
};

// ============== input ==========================
Tools._INPUT ={
  isFirstFocus:true,
  lastFocusObj:null,
  focus_mark:function(){
      var node = $("#appContent");
      var me = this;
      var setSelectionPos = function(ev){
          var _this=$(this);
          var name =_this.attr("name");
          var type =_this.attr("type");
          ev.preventDefault();
          if(name==me.lastFocusObj&&!me.isFirstFocus&&type!="password"){
              return;
          }
          _this.caret(_this.val().length);
          me.lastFocusObj=name;me.isFirstFocus=false;
      };
      var resetISFirstFocus = function(){
            me.isFirstFocus=true;
      };
      node.undelegate(":text,:password","click",setSelectionPos).delegate(":text,:password","click",setSelectionPos);
      node.undelegate(":text,:password","blur",resetISFirstFocus).delegate(":text,:password","blur",resetISFirstFocus);
  },
  init:function(){
      this.focus_mark();
  }
};
//=========== TOOLS init 函数 ================
Tools.init = function () {
    this.radio.init();
    this.select.init();
    this.time.init();
    this.select.select_value_init();
    this.numbox.init();
    this.form.init();
    this._INPUT.init();
    this.pwStrength.init();
    app_compatible.init();
};
