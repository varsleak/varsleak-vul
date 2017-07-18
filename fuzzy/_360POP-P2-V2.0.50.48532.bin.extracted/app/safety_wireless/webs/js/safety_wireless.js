/**
 * Created by lan on 14-3-11.
 */
var appHtml=appL.safety_wireless.js,current_tab_name = [{
    tab_title: appHtml.tabTitle[0],
    tab_id: "safety_wireless"
}];
var questionObj = {},
    safety_black_data = [],
    safety_white_data = [],
    resData;
//页面初始化函数
$(document).ready(function() {
    //初始化 的函数
    init_app_language(appL.safety_wireless.index);
    initSafetyWirelessPage();
    bindEvent();
});
var reg_app_map = {
    question: [{
        id: "question3",
        type: "string"
    }],
    noneed: []
};
function bindEvent () {
    $('#app_page').undelegate('#ques_id',"change").delegate('#ques_id', 'change', function () {
        question_change($(this).val());
    })
}

var ck_answer = [];
var is_wireless_user;
var is_white_user;
function initSafetyWirelessPage() {
	var d = new Date();
    nos.app.net('./safe_question_dump.cgi', 'action=0&dump_flag=1&__time=' + d.getTime(), function(data) {
        var index = 0,
            list = [];
		ck_answer = [];
        /* 接口不规范，只能硬编了 */
        list.push(data.question0);
        list.push(data.question1);
        list.push(data.question2);
        list.push(appHtml.customQuestion);
        questionObj.list = list;
        questionObj.selected = data.id;
		
		resData = data;

		var lengthKeyObj0 = parentEmt.get_rand_key(0,data.answer0,true);
		var answer0 = parentEmt.getDAesString(data.answer0,lengthKeyObj0.rand_key);
		ck_answer.push(answer0);
		resData.answer0 = answer0;
		
		
		var answer1 = parentEmt.getDAesString(data.answer1,lengthKeyObj0.rand_key);
		ck_answer.push(answer1);
		resData.answer1 = answer1;
		
		
		var answer2 = parentEmt.getDAesString(data.answer2,lengthKeyObj0.rand_key);
		ck_answer.push(answer2);
		resData.answer2 = answer2;
		
        var answer3 = parentEmt.getDAesString(data.answer3, lengthKeyObj0.rand_key);
        ck_answer.push(answer3);
        resData.answer3 = answer3;
		
		is_wireless_user = data.is_wireless_user;
		is_white_user = data.is_white_user;

        

        if (data.enable == 1) {
            current_tab_name = [{
                tab_title: appHtml.tabTitle[0],
                tab_id: "safety_wireless"
            }, {
                tab_title: appHtml.tabTitle[1],
                tab_id: "safety_white"
            }, {
                tab_title: appHtml.tabTitle[2],
                tab_id: "safety_black"
            }];
            index = 1;
        }
		else{
			current_tab_name = [{
				tab_title: appHtml.tabTitle[0],
				tab_id: "safety_wireless"
			}];
			index = 0;
        }
		initTab(index);
    });
}
//初始化下拉菜单
function init_safety_wireless(data) {
    init_app_language(appL.safety_wireless.safety_wireless);
    var questionSelect = $("#ques_id"),
        optionHtml = '';

    var optionTemp = '<option value="{{index}}">{{question}}</option>';

    // var selectData = '</select style="width: 165px;border:1px solid #ccc ;padding: 5px 0px;" id="ques_id" name="id" onchange="question_change(this.value)">';

    var list = questionObj.list;
    for (var i = 0, j = list.length; i < j; i++) {
        optionHtml += optionTemp.replace('{{index}}', i).replace('{{question}}', list[i]);
    }
    questionSelect.html(optionHtml);
    select_chose_set('ques_id', questionObj.selected, question_change);
    //radio_sele_set('question_type', parseInt(resData['enable']), set_question_type);
	radio_set(resData['enable'],"safety_wireless_status");
	set_question_type(resData['enable']);
    if (resData['enable_deny_router'] == 1) {
        $('#enable_router').attr('checked', true);
        $('#enable_deny_router_val').val(1);
    } else {
        $('#enable_router').attr('checked', false);
        $('#enable_deny_router_val').val(0);
    }
    if (resData['enable_deny_computer'] == 1) {
        $('#enable_computer').attr('checked', true);
        $('#enable_deny_computer_val').val(1);
    } else {
        $('#enable_computer').attr('checked', false);
        $('#enable_deny_computer_val').val(0);
    }
    nos.app.resizePage();
}

function init_safety_white() {
    init_app_language(appL.safety_wireless.safety_white);
    nos.app.net('./prevent_ceng_net_show.cgi', 'action=get_white', init_safety_white_tab);
}

function init_safety_black() {
    init_app_language(appL.safety_wireless.safety_black);
    nos.app.net('./prevent_ceng_net_show.cgi', 'action=get_black', init_safety_black_tab);
}
//复制 对象的函数
function cloneAll(fromObj, toObj) {
    for (var i in fromObj) {
        if (typeof fromObj[i] == "object") {
            toObj[i] = {};
            cloneAll(fromObj[i], toObj[i]);
            continue;
        } else {
            toObj[i] = fromObj[i];
        }
    }
}
//对象转化成url
function objectChangeToUrl(obj) {
    var url = 0;
    for (var member in obj) {
        url += '&' + member + '=' + obj[member];
    }
    return url = url.substr(2);
}
//sys_idf 单选按钮
function set_question_type() {
	var typeVal = $('#safety_wireless_status_hidden').val();
    if (typeVal == 1) {
        $('#ques_id').attr('disabled', false);
        $('input[type=text]').attr('disabled', false);
        $('input[type=checkbox]').attr('disabled', false);
        $('#enable_router').prop("checked",true);
        $('#enable_deny_router_val').val(1);
    } else {
        $('#ques_id').attr('disabled', true);
        $('input[type=text]').attr('disabled', true);
        $('input[type=checkbox]').attr('disabled', true);
		var cur_answer = $('#wirel_answer').val();
		var id = $("#ques_id").val();
		if(cur_answer != ck_answer[id])
			$('#wirel_answer').val(ck_answer[id]);
        $('#enable_router').prop("checked",false);
        $('#enable_deny_router_val').val(0);
        $('#enable_computer').prop("checked",false);
    }
    nos.app.resizePage();
}
//提交函数
function qh_pwd_enable() {
	var timer;
    var enable_val = parseInt($('#safety_wireless_status_hidden').val());
    if (enable_val == 1) {
        if (!check_answer('wirel_answer')) return;
        if (parseInt($('#ques_id').val()) == 3) {
            if (!check_app_input('question')) return;
        }
    }
	//当前为无线用户，并且开启防蹭网
	if(is_wireless_user == "1" && enable_val == 1 && is_white_user == "0"){
		show_dialog(appCommonJS.dialog.use_wifi,function(){
			show_message("save");
    		nos.app.net('./safe_question.cgi', 'second_protect_set_frm', function(data){
				set_callback(data);
				if(timer)
					window.clearTimeout(timer);
				timer = window.setTimeout(function(){
					window.top.location.href = "http://www.360.cn/";
				},3000);
			});
		});
	}
	else{
		show_message("save");
    	nos.app.net('./safe_question.cgi', 'second_protect_set_frm', submit_callback);
	}
}

function submit_callback(data) {
    set_callback(data);
    initSafetyWirelessPage();
}
//设置成功的回调函数
function set_callback(data) {
    if (data == "SUCCESS") {
       show_message('success', appCommonJS.controlMessage.c_suc);
    } else {
        show_message('error', igd.make_err_msg(data));
    }
}
// 数据转换
function dataChangeTo_white(data) {
    var reData = new Array(),authMode =appHtml.authType;
	var btnStr = appHtml.whiteListBtn;
	var index = 1;
    for (var i in data) {
        var tempObj = new Object();
        tempObj.id = data[i].id;
        tempObj.name = cutString(data[i].s_name || data[i].host_name || appCommonJS.other.unknownDevice,20);
        tempObj.mac = data[i].mac;
        //tempObj.type = (parseInt(data[i].type) == 0) ? authMode[0] : ((parseInt(data[i].type) == 1) ? authMode[1] : authMode[2]);
		
		tempObj.type = authMode[data[i].type];
		if(data[i].type == "0"){//密码认证
			tempObj.op = '<a onclick="safety_white_link(\''+ index +'\')" title="'+ btnStr[0] +'" class="fun_link link" href="javascript:void(0);">'+ btnStr[0] +'</a><a onclick="safety_white_back(\''+ index +'\')" title="'+ btnStr[1] +'" class="fun_link back" href="javascript:void(0);">'+ btnStr[1] +'</a><a onclick="safety_white_atbl(\''+ index +'\')" title="'+ btnStr[2] +'" class="fun_link atbl" href="javascript:void(0);">' + btnStr[2] + '</a>';
		}
		else if(data[i].type == "1"){//手动认证
			tempObj.op = '<a title="'+ btnStr[0] +'" class="fun_link disabled" href="javascript:void(0);">'+ btnStr[0] +'</a><a onclick="safety_white_back(\''+ index +'\')" title="'+ btnStr[1] +'" class="fun_link back" href="javascript:void(0);">'+ btnStr[1] +'</a><a onclick="safety_white_atbl(\''+ index +'\')" title="'+ btnStr[2] +'" class="fun_link atbl" href="javascript:void(0);">'+ btnStr[2] +'</a>';
		}
		else if(data[i].type == "2"){//未认证
			tempObj.op = '<a onclick="safety_white_link(\''+ index +'\')" title="'+ btnStr[0] +'" class="fun_link link" href="javascript:void(0);">'+ btnStr[0] +'</a><a title="'+ btnStr[1] +'" class="fun_link disabled" href="javascript:void(0);">'+ btnStr[1] +'</a><a onclick="safety_white_atbl(\''+ index +'\')" title="'+ btnStr[2] +'" class="fun_link atbl" href="javascript:void(0);">'+ btnStr[2] +'</a>';
		}
        reData.push(tempObj);
		index++;
    }
    return reData;
}

function dataChangeTo_black(data) {
    var reData = new Array();
    for (var i in data) {
        var tempObj = new Object();
        tempObj.id = data[i].id;
        tempObj.mac = data[i].mac;
		tempObj.op = '<a onclick="safety_black_del('+ (i*1 + 1) +')" title="'+ appCommonJS.btnTitle.del +'" class="fun_link del" href="javascript:void(0);">'+ appCommonJS.btnTitle.del +'</a><a onclick="safety_black_atbl('+ (i*1 + 1) +')" title="'+ appHtml.blackListBtn +'" class="fun_link ok" href="javascript:void(0);">'+ appHtml.blackListBtn +'</a>';
        reData.push(tempObj);
    }
    return reData;
}
//初始化表格
function init_safety_white_tab(data) {
    safety_white_data = [];
    cloneAll(data, safety_white_data);
    for (var i = 0; i < safety_white_data.length; i++) {
        safety_white_data[i]['id'] = parseInt(i + 1);
    }
    var new_data = dataChangeTo_white(safety_white_data);
    
	var tab = new window.top.Table("safety_white_tab",appHtml.white_list,new_data);
	tab.initTable();
    nos.app.resizePage();
}

function init_safety_black_tab(data) {
    safety_black_data = [];
    cloneAll(data, safety_black_data);
    for (var i = 0; i < safety_black_data.length; i++) {
        safety_black_data[i]['id'] = parseInt(i + 1);
    }
    var new_data = dataChangeTo_black(safety_black_data);
	
	var tab = new window.top.Table("safety_black_tab",appHtml.black_list,new_data);
	tab.initTable();
	
	
    nos.app.resizePage();
}
//删除操作
function safety_white_link(index) {
    var obj = safety_white_data[index - 1];
    obj.deal = 'auth';
    var url = objectChangeToUrl(obj);
    nos.app.net('./prevent_ceng_net.cgi', url, auth_callback);
}

function safety_white_back(index) {
    var obj = safety_white_data[index - 1];
    obj.deal = 'auth_cancel';
    var url = objectChangeToUrl(obj);
    nos.app.net('./prevent_ceng_net.cgi', url, auth_callback);
}
//认证和取消认证的回调函数
function auth_callback(data) {
    set_callback(data);
    init_safety_white();
}

function safety_white_atbl(index) {
    var obj = safety_white_data[index - 1];
    obj.deal = 'add_black';
    var url = objectChangeToUrl(obj);
    nos.app.net('./prevent_ceng_net.cgi', url, add_callback);
}
//添加的回调函数
function add_callback(data) {
    if (data == "SUCCESS") {
        show_message('success',appCommonJS.controlMessage.a_suc);
        init_safety_white();
    } else
        show_message('error',igd.make_err_msg(data));
}
//黑名单操作
function safety_black_atbl(index) {
    var obj = safety_black_data[index - 1];
    obj.deal = 'add_to_white';
    var url = objectChangeToUrl(obj);
    nos.app.net('./prevent_ceng_net.cgi', url, safety_black_atbl_callback);
}

function safety_black_atbl_callback(data) {
    set_callback(data);
    initSafetyWirelessPage();
}
//黑名单删除
function safety_black_del(index) {
    var obj = safety_black_data[index - 1];
    obj.deal = 'del_black';
    var url = objectChangeToUrl(obj);
    show_dialog(appCommonJS.dialog.del_single,function(){
        nos.app.net('./prevent_ceng_net.cgi', url, del_black_callback);
    });

}
//黑名单删除回调函数函数
function del_black_callback(data) {
    del_callback(data);
    init_safety_black();
}

function del_callback(data) {
    if (data == "SUCCESS")
        show_message('success',appCommonJS.controlMessage.d_suc);
    else
        show_message('error',igd.make_err_msg(data));
}
//下拉菜单函数
function question_change(val) {
    if (val == 3) {
        $('#idf_question').show();
        $('#question3').val(resData['question' + val]);
    } else {
        $('#question3').val('');
        $('#idf_question').hide();
    }
    nos.app.resizePage();
    $('#wirel_answer').val( resData['answer' + val]);
}
//全部认证函数
function bind_wlist_all() {
    nos.app.net('./prevent_ceng_net.cgi', 'deal=auth_all', auth_callback);
}
//全部解除函数
function clear_wlist_all() {
    nos.app.net('./prevent_ceng_net.cgi', 'deal=auth_cancel_all', del_white_callback);
}
//全部删除的函数
function black_del_all() {
    show_dialog(appCommonJS.dialog.del_all,function(){
        nos.app.net('./prevent_ceng_net.cgi', 'deal=del_black_all', del_black_callback);
    });
}

function del_white_callback(data) {
    del_callback(data);
    init_safety_white();
}
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
//高级设置
function show_senior_set() {
    $('.senior_set').toggle();
    nos.app.resizePage();
}

function set_enable_deny_router() {
    if ($('#enable_router').attr('checked')) $('#enable_deny_router_val').val(1);
    else $('#enable_deny_router_val').val(0);
}

function set_enable_deny_computer() {
    if ($('#enable_computer').attr('checked')) $('#enable_deny_computer_val').val(1);
    else $('#enable_deny_computer_val').val(0);
}
