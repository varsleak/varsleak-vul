/**
 * Created by lan on 13-12-12.
 */


var maxHostListDataStrip, maxHostListIpDataStrip, hostListTimeOutId, hostListIpTimeOutId;
var host_list_controlType, host_list_ip_controlType, pageType = 1;
//pageType=0 是host_list 的页面     pageType=1  是host_list_ip 的页面
//host_list_controlType 是host_list 的刷新状态    host_list_ip_controlType  是host_list_ip  的刷新状态
var host_list_temp_info = new Array(),
    host_list_ip_temp_info = new Array(),
    host_all_temp_info = new Array();
var tempIp;
var pre_scrollTop, current_host_info_id,appHtml=appL.host_monitor.js;
function get_element_id(id) {
    return document.getElementById(id)
}
$(document).ready(function() {
    init_app_language(appL.host_monitor);
});

// 成功的回调函数
function callBackSuccess(data) {
    lan_net_view_refresh();
}

//host_list_ip 中删除某条数据的函数
function ip_info_modify(index) {
    show_dialog(appCommonJS.dialog.del_single,function(){
        nos.app.net("./filter_conn_del.cgi", "action=0&id=" + host_list_ip_temp_info[index].id, callBackSuccess);
    })
}

// 查看 的函数
function show_ip_info(ip) {
    get_element_id('host_list_dl').className = 'hide';
    get_element_id('host_list_ip_dl').className = 'app-box on';
    get_element_id('host_list_ip_info_dl').className = 'app-box on';
    get_element_id('del').style.display = 'inline';
    get_element_id('return_but').style.display = 'inline';
    get_element_id('search').className = 'hide';
    $('#stop_refresh').show();
    $('#refresh').hide();
    tempIp = ip;
    pageType = 0;
    host_list_ip_controlType = 1;
    host_list_controlType = 0;
    window.clearTimeout(hostListTimeOutId);
    //    clearTableData('host_con_info');
    lan_netviewInfo_ip_init();

    return false;
}
//返回 的函数
function retrun_host_info() {
    get_element_id('host_list_dl').className = 'app-box on';
    get_element_id('host_list_ip_dl').className = 'hide';
    get_element_id('host_list_ip_info_dl').className = 'hide';
    get_element_id('del').style.display = 'none';
    get_element_id('return_but').style.display = 'none';
    get_element_id('search').className = 'autoclear show';
    $('#stop_refresh').show();
    $('#refresh').hide();
    pageType = 1;
    host_list_ip_controlType = 0;
    host_list_controlType = 1;
    window.clearTimeout(hostListIpTimeOutId);
    //    clearTableData('host_list_ip_info');
    //    clearTableData('host_list_ip_title_info');
    init();
    parent.document.getElementById("config_page").height =$("body").height();
    return false;
}
//删除全部
function host_ip_info_clean() {
    show_dialog("是否确定全部删除?",function(){
        pre_scrollTop = set_scroll();
        clearTableData('host_list_ip_info');
        nos.app.net('./filter_conn_del.cgi', 'action=1&ip=' + tempIp, callBackSuccess);
    })
}
//清空表格数据
function clearTableData(id) {
    var rowLength = get_element_id(id).rows.length;
    for (var i = 0; i < rowLength; i++) {
        get_element_id(id).deleteRow(0);
    }
}
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

// table 的分页处理
function skipFirstPage() {
    if (pageType == 1) {
        if (get_element_id('host_list_page_select').value == 1) {
             show_message("error",appHtml.isFirstPage);
        } else {
            get_element_id('host_list_page_select').value = 1;
            pre_scrollTop = set_scroll();
            clearTableData('host_con_info');
            selectPage= get_element_id('host_list_page_select').value;
            insertHostListTableData();
        }
    } else {
        if (get_element_id('host_list_ip_page_select').value == 1) {
             show_message("error",appHtml.isFirstPage);
        } else {
            get_element_id('host_list_ip_page_select').value = 1;
            pre_scrollTop = set_scroll();
            clearTableData('host_list_ip_info');
            selectPage= get_element_id('host_list_ip_page_select').value;
            insertHostListIpTableData();
        }
    }
}

function skipFrontPage() {
    if (pageType == 1) {
        if (get_element_id('host_list_page_select').value == 1) {
             show_message("error",appHtml.isFirstPage);
        } else {
            get_element_id('host_list_page_select').value -= 1;
            pre_scrollTop = set_scroll();
            clearTableData('host_con_info');
            selectPage= get_element_id('host_list_page_select').value;
            insertHostListTableData();
        }
    } else {
        if (get_element_id('host_list_ip_page_select').value == 1) {
             show_message("error",appHtml.isFirstPage);
        } else {
            get_element_id('host_list_ip_page_select').value -= 1;
            pre_scrollTop = set_scroll();
            clearTableData('host_list_ip_info');
            selectPage= get_element_id('host_list_ip_page_select').value;
            insertHostListIpTableData();
        }
    }
}

function skipNextPage() {
    if (pageType == 1) {
        var lastNumHost = get_element_id('host_list_page_select').options.length - 1;
        if (get_element_id('host_list_page_select').value == get_element_id('host_list_page_select').options[lastNumHost].value) {
             show_message("error",appHtml.isLastPage);
        } else {
            get_element_id('host_list_page_select').value = parseInt(get_element_id('host_list_page_select').value) + 1;
            pre_scrollTop = set_scroll();
            clearTableData('host_con_info');
            selectPage= get_element_id('host_list_page_select').value;
            insertHostListTableData();
        }
    } else {
        var lastNum = get_element_id('host_list_ip_page_select').options.length - 1;
        if (get_element_id('host_list_ip_page_select').value == get_element_id('host_list_ip_page_select').options[lastNum].value) {
             show_message("error",appHtml.isLastPage);
        } else {
            get_element_id('host_list_ip_page_select').value = parseInt(get_element_id('host_list_ip_page_select').value) + 1;
            pre_scrollTop = set_scroll();
            clearTableData('host_list_ip_info');
            selectPage= get_element_id('host_list_ip_page_select').value;
            insertHostListIpTableData();
        }
    }
}

function skipLastPage() {
    if (pageType == 1) {
        var lastNumHost = get_element_id('host_list_page_select').options.length - 1;
        if (get_element_id('host_list_page_select').value == get_element_id('host_list_page_select').options[lastNumHost].value) {
             show_message("error",appHtml.isLastPage);
        } else {
            get_element_id('host_list_page_select').value = get_element_id('host_list_page_select').options[lastNumHost].value;
            pre_scrollTop = set_scroll();
            clearTableData('host_con_info');
            selectPage= get_element_id('host_list_page_select').value;
            insertHostListTableData();
        }
    } else {
        var lastNum = get_element_id('host_list_ip_page_select').options.length - 1;
        if (get_element_id('host_list_ip_page_select').value == get_element_id('host_list_ip_page_select').options[lastNum].value) {
             show_message("error",appHtml.isLastPage);
        } else {
            get_element_id('host_list_ip_page_select').value = get_element_id('host_list_ip_page_select').options[lastNum].value;
            pre_scrollTop = set_scroll();
            clearTableData('host_list_ip_info');
            selectPage= get_element_id('host_list_ip_page_select').value;
            insertHostListIpTableData();
        }
    }
}

//显示全部
function show_all_lan_netviewinfo() {
    init();
}

//刷新 的函数
function lan_net_view_refresh() {
    if (pageType == 1) {
        window.clearTimeout(hostListTimeOutId);
        init();
        host_list_controlType = 1;
    } else {
        window.clearTimeout(hostListIpTimeOutId);
        lan_netviewInfo_ip_init();
        host_list_ip_controlType = 1;
    }
    get_element_id('refresh').style.display = 'none';
    get_element_id('stop_refresh').style.display = 'inline';
    return false;
}
//停止刷新 的函数
function lan_net_view_stop_refresh() {
    if (pageType == 1) {
        host_list_controlType = 0;
        window.clearTimeout(hostListTimeOutId);
    } else {
        host_list_ip_controlType = 0;
        window.clearTimeout(hostListIpTimeOutId);
    }
    get_element_id('stop_refresh').style.display = 'none';
    get_element_id('refresh').style.display = 'inline';
    return false;
}
//设置每页显示数据的最大值
function setMaxSize() {
    if (pageType == 1) {
        if (!check_max_num('host_list_setSize')) {
            return
        }

        if (host_list_controlType == 1) {
            window.clearTimeout(hostListTimeOutId);
            init();
        } else {
            var dataLength2 = host_list_temp_info.length;
            pre_scrollTop = set_scroll();
            clearTableData('host_con_info');
            initHostListTableInfo(dataLength2);
        }
    } else {
        if (!check_max_num('host_list_ip_setSize')) {
            return
        }
        if (host_list_ip_controlType == 1) {
            window.clearTimeout(hostListIpTimeOutId);
            lan_netviewInfo_ip_init();
        } else {
            var dataLength_ip2 = host_list_ip_temp_info.length;
            pre_scrollTop = set_scroll();
            clearTableData('host_list_ip_info');
            initHostListTableIpInfo(dataLength_ip2);
        }
    }
}
// 下拉菜单改变的函数
var selectPage;
function selectChange() {
    if (pageType == 1) {
        pre_scrollTop = set_scroll();
        clearTableData('host_con_info');
        insertHostListTableData();
        selectPage=get_element_id("host_list_page_select").value;
    } else {
        pre_scrollTop = set_scroll();
        clearTableData('host_list_ip_info');
        insertHostListIpTableData();
        selectPage=get_element_id("host_list_ip_page_select").value;
    }
    return false;
}

function only_int(id) {
    var setObj = get_element_id(id);
    var setObjValue = setObj.value;
    var intTest = /\D/g;
    setObj.value = setObjValue.replace(intTest, '');
    if (setObj.value == 0) {
        setObj.value = '';
    }
    if (setObj.value > 20) {
        setObj.value = '20';
    }
}
//设置页数选择的下拉菜单
function setHostListPage(maxnum, contentId) {
    var startNum = 1;
    var selectObj = document.createElement('select');
    if (pageType == 1) {
        if (get_element_id('host_list_page_select')) {
//            startNum = get_element_id('host_list_page_select').value;
            get_element_id(contentId).removeChild(get_element_id('host_list_page_select'));
        }
        selectObj.id = "host_list_page_select";
        selectObj.className = "selectStyle";
        selectObj.onchange = selectChange;
        selectObj.onkeyup = only_int;
    } else {
        if (get_element_id('host_list_ip_page_select')) {
//            startNum = 1get_element_id('host_list_ip_page_select').value;
            get_element_id(contentId).removeChild(get_element_id('host_list_ip_page_select'));
        }
        selectObj.id = "host_list_ip_page_select";
        selectObj.className = "selectStyle";
        selectObj.onchange = selectChange;
        selectObj.onkeyup = only_int;
    }

    for (var i = 1; i <= maxnum; i++) {
        var optionObj = document.createElement('option');
        var optionTxt = document.createTextNode(i + '/' + maxnum);
        optionObj.value = i;
        optionObj.appendChild(optionTxt);
        selectObj.appendChild(optionObj);
    }
    //if (selectObj.options[selectObj.options.length - 1]&&startNum > selectObj.options[selectObj.options.length - 1].value) {
    //    selectObj.value = selectObj.options[selectObj.options.length - 1].value;
    //} else {
    //    selectObj.value = startNum;
    //}
    if(selectPage>selectObj.options.length)
        selectPage=startNum;
    selectObj.value=!!selectPage?selectPage:startNum;
    get_element_id(contentId).appendChild(selectObj);
}
//对  table条数的最大值  赋值
function initTableMax(data) {
    if (data.lan_netviewinfo) {
        maxHostListDataStrip = data.lan_netviewinfo.max_num;
        nos.app.net('./filter_hosts_dump.cgi', 'noneed=noneed&action=get', initHostListTable);
    } else {
        maxHostListIpDataStrip = data.lan_netviewinfo_ip.max_num;
        nos.app.net('./filter_conns_dump.cgi', 'ip=' + tempIp + '&action=get', initHostListIpTable);
    }
}
//初始化表格的 当前 还剩 的数据
function initTableStripNum(strip, pageType) {
    if (pageType == 1) {
        get_element_id('host_list_currentData').innerHTML = appHtml.deviceNum + strip ;
//        get_element_id('host_list_remainData').innerHTML = '还剩:' + (maxHostListDataStrip - strip) + '条';
    } else {
        get_element_id('host_list_ip_currentData').innerHTML =  appHtml.lineNum  + strip ;
//        get_element_id('host_list_ip_remainData').innerHTML = '还剩:' + (maxHostListIpDataStrip - strip) + '条';
    }
}
//initHostListIpTitleTable 的数据初始化
function initIpTitleTable(obj, data, member) {
    var td = document.createElement("td");
    if (member == 'up_speed_qos') {
        td.innerHTML = (data['up_speed_qos'] == 0 ? '0' : math_unit_converter(data['up_speed_qos']));
    } else if (member == 'ip') {
        td.innerHTML = data['ip'] + '<br/>' + data['mac'];
    } else if (member == 'down_speed_qos') {
        td.innerHTML = (data['down_speed_qos'] == 0 ? '0' : math_unit_converter(data['down_speed_qos']));
    } else if (member == 'up_byte') {
        td.innerHTML = (data['up_byte'] == 0 ? '0' : math_unit_converter(data['up_byte']));
    } else if (member == 'down_byte') {
        td.innerHTML = (data['down_byte'] == 0 ? '0' : math_unit_converter(data['down_byte']));
    } else if (member == 'up_time') {
        td.innerHTML = changeTime(data[member]);
    } 
	else if (member == 'host_name') {
		var name = data['s_name'] || data['alias'] || data['device_label'] || data['name'] || appCommonJS.other.unknownDevice;
        td.innerHTML = (decodeURIComponent(name) == '' ? '---' : decodeURIComponent(name));
    } 
	else {
        td.innerHTML = data[member];
    }

    obj.appendChild(td);
}


function initHostListIpTitleTable(data, datanum) {
    initAllPartInfo(datanum);
    for (var i in data) {
        if (data[i].ip == tempIp) {
            var myNode = get_element_id('host_list_ip_title_info').insertRow(0);
            for (var index = 0; index < 8; index++) {
                switch (index) {
                    case 0:
                        initIpTitleTable(myNode, data[i], 'host_name');
                        break;
                    case 1:
                        initIpTitleTable(myNode, data[i], 'ip');
                        break;
                    case 2:
                        initIpTitleTable(myNode, data[i], 'conn_count');
                        break;
                    case 3:
                        initIpTitleTable(myNode, data[i], 'up_speed_qos');
                        break;
                    case 4:
                        initIpTitleTable(myNode, data[i], 'down_speed_qos');
                        break;
                    case 5:
                        initIpTitleTable(myNode, data[i], 'up_byte');
                        break;
                    case 6:
                        initIpTitleTable(myNode, data[i], 'down_byte');
                        break;
                    case 7:
                        initIpTitleTable(myNode, data[i], 'up_time');
                        break;
                }
            }
            break;
        }
    }
    nos.app.resizePage();
    set_scroll_Top(pre_scrollTop);
    nos.app.net('./interface_conn_speed_show.cgi', 'noneed=noneed&action=get&uiname=WAN1', initChart);
}
//end

// host_list  table 数据更新的函数
function initTable(obj, n, member, m) {
    var td = document.createElement("td");
    if (member == 'conn_count') {
        td.innerHTML = host_list_temp_info[n][member];
    } else if (member == 'ip') {
        td.innerHTML = host_list_temp_info[n]['ip'] + '<br/>' + host_list_temp_info[n]['mac'];
    } else if (member == 'up_time') {
        td.innerHTML = changeTime(host_list_temp_info[n][member]);
    } else if (member == 'host_name') {
        var showName = host_list_temp_info[n]['s_name'] || host_list_temp_info[n]['alias'] || host_list_temp_info[n]['device_label'] || host_list_temp_info[n]['name'] || appCommonJS.other.unknownDevice;
        td.innerHTML = '<label class="inline" >' + showName + '</label>'+'<br><a href="javascript:void(0);" style="text-decoration: underline;cursor: pointer" onclick="show_ip_info(\'' + host_list_temp_info[n]['ip'] + '\')" style="text-decoration:underline">'+appHtml.lookFor+'</a></td>';
    } else if (m == 3) {
        td.innerHTML = (parseInt(host_list_temp_info[n]['up_speed_qos']) == 0 ? '0' : math_unit_converter(parseInt(host_list_temp_info[n]['up_speed_qos'])));
    } else if (m == 4) {
        td.innerHTML = (parseInt(host_list_temp_info[n]['down_speed_qos']) == 0 ? '0' : math_unit_converter(parseInt(host_list_temp_info[n]['down_speed_qos'])));
    } else if (m == 5) {
        td.innerHTML = (parseInt(host_list_temp_info[n]['up_byte']) == 0 ? '0' : math_unit_converter(parseInt(host_list_temp_info[n]['up_byte'])));
    } else if (m == 6) {
        td.innerHTML = (parseInt(host_list_temp_info[n]['down_byte']) == 0 ? '0' : math_unit_converter(parseInt(host_list_temp_info[n]['down_byte'])));
    } else {
        td.innerHTML = host_list_temp_info[n][member];
    }
    obj.appendChild(td);
}
//初始化 host_list table  以及部分实时监控表格的数据
function initAllPartInfo(ipNum) {
    get_element_id('host_sum').innerHTML = ipNum;
    var allConNum = 0;
    for (var i in host_list_temp_info) {
        allConNum += parseInt(host_list_temp_info[i].conn_count);
    }
    get_element_id('con_sum').innerHTML = allConNum;
}

function initHostListTableInfo(ipNum) {
    var pageMaxDataNum = get_element_id('host_list_setSize').value;
    var pageNum = Math.ceil(ipNum / pageMaxDataNum); //页码数
    setHostListPage(pageNum, 'selectContent');
    initAllPartInfo(ipNum);
    //    以上为实时监控表格的数据
    insertHostListTableData();
}

function insertHostListTableData() {
    var pageMaxNum = get_element_id('host_list_setSize').value;
    var currentPageNum = get_element_id('host_list_page_select').value; //select 的value值 即页码数
    var startNum = (currentPageNum - 1) * pageMaxNum + 1 - 1;
    var endNum = parseInt(startNum) + parseInt(pageMaxNum) - 1;
    var rowNum = 0; //记录数据放在表格中第几条

    var all_up_speed_qos=0;
    var all_down_speed_qos=0;
    for (var member in host_list_temp_info) {
        all_up_speed_qos +=parseInt(host_list_temp_info[member]['up_speed_qos']);
        all_down_speed_qos +=parseInt(host_list_temp_info[member]['down_speed_qos']);
        if (parseInt(member) >= startNum && startNum <= endNum) {
            var j = startNum % pageMaxNum;
            var myNode = get_element_id('host_con_info').insertRow(j);
            for (var index = 0; index < 8; index++) {
                switch (index) {
                    case 0:
                        initTable(myNode, member, 'host_name', rowNum);
                        break;
                    case 1:
                        initTable(myNode, member, 'ip');
                        break;
                    case 2:
                        initTable(myNode, member, 'conn_count');
                        break;
                    case 3:
                        initTable(myNode, member, 'up_speed_qos', 3);
                        break;
                    case 4:
                        initTable(myNode, member, 'down_speed_qos', 4);
                        break;
                    case 5:
                        initTable(myNode, member, 'up_byte', 5);
                        break;
                    case 6:
                        initTable(myNode, member, 'down_byte', 6);
                        break;
                    case 7:
                        initTable(myNode, member, 'up_time');
                        break;
                }
            }
            startNum++;
            rowNum++
        }
    }
    get_element_id('wan_up_down_speed').innerHTML = math_unit_converter(all_up_speed_qos) + '&nbsp;/&nbsp;' + math_unit_converter(all_down_speed_qos);
    nos.app.resizePage();
    set_scroll_Top(pre_scrollTop);
    nos.app.net('./interface_conn_speed_show.cgi', 'noneed=noneed&action=get&uiname=WAN1', initChart);
}
//HostListTableIp table操作
function initIpTable(obj, n, member) {
    var td = document.createElement("td");
    if (member == 10) {
        td.innerHTML = '<input class="set_btn" type="image" onclick="ip_info_modify(\'' + n + '\');" title="'+appCommonJS.btnTitle.del+'" src="./images/del.gif">';
    } else if (member == 'up_bytes') {
        td.innerHTML = (parseInt(host_list_ip_temp_info[n]['up_bytes']) == 0 ? '0' : math_unit_converter(host_list_ip_temp_info[n]['up_bytes']));
    } else if (member == 'down_bytes') {
        td.innerHTML = (parseInt(host_list_ip_temp_info[n]['down_bytes']) == 0 ? '0' : math_unit_converter(host_list_ip_temp_info[n]['down_bytes']));
    } else if (member == 'up_speed') {
        td.innerHTML = (parseInt(host_list_ip_temp_info[n]['up_speed']) == 0 ? '0' : math_unit_converter(host_list_ip_temp_info[n]['up_speed']));
    } else if (member == 'down_speed') {
        td.innerHTML = (parseInt(host_list_ip_temp_info[n]['down_speed']) == 0 ? '0' : math_unit_converter(host_list_ip_temp_info[n]['down_speed']));
    } else if (member == 'out_interface') {
        var wanStr = host_list_ip_temp_info[n]['out_interface'].substr(0, 3);
        if (wanStr == 'WAN') {
            if (g_wan_num > 1) {
                td.innerHTML = host_list_ip_temp_info[n]['out_interface'];
            } else {
                td.innerHTML = "WAN";
            }
        } else {
            td.innerHTML = host_list_ip_temp_info[n]['out_interface'];
        }
    } else {
        td.innerHTML = host_list_ip_temp_info[n][member];
    }

    obj.appendChild(td);
}
//HostListTableIp 数据更新
function initHostListTableIpInfo(dataNum) {
    var pageMaxNum = get_element_id('host_list_ip_setSize').value; //每页的最大数；
    var pageNum = Math.ceil(dataNum / pageMaxNum);
    setHostListPage(pageNum, 'host_list_ip_selectContent');
    insertHostListIpTableData();

}

function insertHostListIpTableData() {
    var pageMaxNum = get_element_id('host_list_ip_setSize').value;
    var currentPageNum = get_element_id('host_list_ip_page_select').value; //select 的value值 即页码数
    var startNum = (currentPageNum - 1) * pageMaxNum + 1 - 1;
    var endNum = parseInt(startNum) + parseInt(pageMaxNum) - 1;
    for (var member in host_list_ip_temp_info) {
        if (parseInt(member) >= startNum && startNum <= endNum) {
            var j = startNum % pageMaxNum;
            var myNode = get_element_id('host_list_ip_info').insertRow(j);
            for (var index = 0; index < 10; index++) {
                switch (index) {
                    case 0:
                        initIpTable(myNode, member, 'proto');
                        break;
                    case 1:
                        initIpTable(myNode, member, 'des_ip');
                        break;
                    case 2:
                        initIpTable(myNode, member, 'src_port');
                        break;
                    case 3:
                        initIpTable(myNode, member, 'dest_port');
                        break;
                    case 4:
                        initIpTable(myNode, member, 'up_bytes');
                        break;
                    case 5:
                        initIpTable(myNode, member, 'down_bytes');
                        break;
                    case 6:
                        initIpTable(myNode, member, 'up_speed');
                        break;
                    case 7:
                        initIpTable(myNode, member, 'down_speed');
                        break;
                    case 8:
                        initIpTable(myNode, member, 'out_interface');
                        break;
                    case 9:
                        initIpTable(myNode, member, 10);
                        break;
                }
            }
            startNum++;
        }
    }
    nos.app.resizePage();
    set_scroll_Top(pre_scrollTop);
    nos.app.net('./filter_hosts_dump.cgi', 'noneed=noneed&action=get', initHostListTable);
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

var host_list_sort_type, host_conn_sort_type; //排序参数
//初始化 lan_netviewinfo    table数据
function initHostListTable(data) {
    host_list_temp_info = [];
    cloneAll(data, host_list_temp_info);
    if (typeof host_list_sort_type != "undefined") {
        host_info_sort_fun();
    }
    var dataStrip = data.length; //得到多少条表格数据
    if (pageType == 1) {
        pre_scrollTop = set_scroll();
        clearTableData('host_con_info');
        initTableStripNum(dataStrip, pageType); //初始化表格的 当前 还剩 的数据
        initHostListTableInfo(dataStrip);
    } else {
        pre_scrollTop = set_scroll();
        clearTableData('host_list_ip_title_info');
        initHostListIpTitleTable(data, dataStrip);
    }
}
//初始化 lan_netviewinfo_ip    table数据
function initHostListIpTable(data) {
    host_list_ip_temp_info = [];
    cloneAll(data, host_list_ip_temp_info);
    if (host_conn_sort_type != "undefined") {
        host_conn_sort_fun();
    }
    var dataStrip = data.length; //得到多少条表格数据
    pre_scrollTop = set_scroll();
    clearTableData('host_list_ip_info');
    initTableStripNum(dataStrip, pageType);
    initHostListTableIpInfo(dataStrip);
}

function initChart(data) {
    if (data == null || data == []) {
        get_element_id('wan_up_down_speed').innerHTML = "0 / 0";
        get_element_id('up_down_byte').innerHTML = "0 / 0";
    }
    var all_in_byte = ((parseInt(data.all_in_byte) == 0) ? 0 : math_unit_converter(data.all_in_byte));
    var all_out_byte = ((parseInt(data.all_in_byte) == 0) ? 0 : math_unit_converter(data.all_out_byte));
    var all_in_byte_speed = ((parseInt(data.all_in_byte) == 0) ? 0 : math_unit_converter(data.all_in_byte_speed));
    var all_out_byte_speed = ((parseInt(data.all_in_byte) == 0) ? 0 : math_unit_converter(data.all_out_byte_speed));
    //get_element_id('wan_up_down_speed').innerHTML = all_out_byte_speed + '&nbsp;/&nbsp;' + all_in_byte_speed;
    get_element_id('up_down_byte').innerHTML = all_out_byte + '&nbsp;/&nbsp;' + all_in_byte;
    judgeStatus();
}

function judgeStatus() {
    if (pageType == 1 && host_list_controlType == 1) {
        window.clearTimeout(hostListTimeOutId);
        hostListTimeOutId = window.setTimeout('init()', 2000);
    }
    if (pageType == 0 && host_list_ip_controlType == 1) {
        window.clearTimeout(hostListIpTimeOutId);
        hostListIpTimeOutId = window.setTimeout('lan_netviewInfo_ip_init()', 2000);
    }
}

function init() {
    pageType = 1;
    host_list_controlType = 1;
    nos.app.net('./get_max_num.cgi', 'current_html=lan_netviewinfo&action=get', initTableMax);
}

function lan_netviewInfo_ip_init() {
    pageType = 0;
    host_list_ip_controlType = 1;
    nos.app.net('./get_max_num.cgi', 'current_html=lan_netviewinfo_ip&action=get', initTableMax);
}
init();


window.top.onscroll = judge_scroll;
window.top.onload = set_scroll;

function judge_scroll() {
    var scrollPos;
    var me=this;
    if (typeof me.pageYOffset != 'undefined') {
        scrollPos = me.pageYOffset;
    } else if (typeof me.document.compatMode != 'undefined' &&
        me.document.compatMode != 'BackCompat') {
        scrollPos = me.document.documentElement.scrollTop;
    } else if (typeof me.document.body != 'undefined') {
        scrollPos =me.document.body.scrollTop;
    }
    document.cookie = "scrollTop=" + scrollPos; //存储滚动条位置到cookies中
}

function set_scroll() {
    var me=this;
    if (document.cookie.match(/scrollTop=([^;]+)(;|get_element_id)/) != null) {
        var arr = document.cookie.match(/scrollTop=([^;]+)(;|get_element_id)/); //cookies中不为空，则读取滚动条位置
        me.document.documentElement.scrollTop = parseInt(arr[1]);
        me.document.body.scrollTop = parseInt(arr[1]);
        return parseInt(arr[1]);
    }
    return 0;
}

function set_scroll_Top(data) {
    window.top.document.documentElement.scrollTop = data;
    window.top.document.body.scrollTop = data;
}

function check_max_num(key) {
    var _input = document.getElementById(key);
    if (_input) {
        var point_xy = getPosition(_input);
        point_xy.x += _input.clientWidth + 10;
        if (_input.nodeName.toLowerCase() == "select")
            point_xy.y -= 20;
        else
            point_xy.y -= _input.clientHeight;

        var reg_val = _input.value;
        var res = check_max_num_str(reg_val);
        if (res == true) res = CheckLength(_input);
        if (res != true) {
            var msgbox = new MessageBox(res, point_xy);
            msgbox.Show();
            return false;

        }
    }
    return true;
}

function check_max_num_str(str) {
    var errorStr=appHtml.maxNumError,ss;
    if (str == "" || str == null) {
        ss = errorStr[0];
        return ss;
    }
    var cmp = '0123456789';
    var buf = str;
    for (var h = 0; h < buf.length; h++) {
        var tst = buf.substring(h, h + 1);
        if (cmp.indexOf(tst) < 0) {
            ss = errorStr[1];
            return ss;
        }
    }
    if (parseInt(str) > 20) {
        ss = errorStr[2];
        return ss;
    }
    return true;
}