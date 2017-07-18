var current_html = null;

//===========================基本模块部分开始================================

//======================选项卡部分=======================
//初始化选项卡
function init_tab(init_fun){
	paint_tab();
	if(init_fun){$(".tab_area").find("h3").eq(0).addClass("selected");return;}
	$(".tab_area").find("h3").eq(0).click();
}

//绘制选项卡
function paint_tab(){
	$(".tab_area").html("");
	var len = current_tab_name.length;
	var total_width = $("body").width()-30;//需除开滚动条的位置
	var width = (total_width/len).toFixed(2);
	for(var i = 0; i < len; i++){
		var $h3 = $("<h3/>");
		var tab_title = current_tab_name[i].tab_title;
		$h3.html(tab_title);
		$h3.css("width",width+"px");
		var tab_id = current_tab_name[i].tab_id;
		if(tab_id != ""){
			$h3.attr("id",tab_id);
		}
		if(current_tab_name[i].init_fun != undefined){
			var init_fun =  current_tab_name[i].init_fun;
			$h3.attr("name",init_fun);
		}
		
		if((len - i) == 1){
			$h3.attr("class","last");
			$h3.css("width",(width-3)+"px");
		}
		$(".tab_area").append($h3);
		$h3.unbind("click").bind("click",function(){
			var $obj = $(".tab_area h3").removeClass("selected");
			$(this).addClass("selected");
			var tmp_id;
			if($(this).attr("id") != undefined){
				tmp_id = $(this).attr("id").split("_tab")[0];
			}
			if($(this).attr("name") != undefined && tmp_id != undefined){
				var tmp_name = $(this).attr("name");
				load_app_page(tmp_id,tmp_name);
			}
			else{
				if(tmp_id != undefined){
					tmp_id = $(this).attr("id").split("_tab")[0];
					load_app_page(tmp_id,'init_'+tmp_id);
				}
			}
		});
	}
}

//加载app页面
function load_app_page(html_name,init_function){
	hide_msgbox();
	current_html = html_name;
	$.ajax({
		type:"get",
		url:"./"+html_name+".html",
		dataType:"html",
		error: function(XMLHttpRequest, textStatus){
			window.top.open("/","_self");
		},
		success:function(ret){
			if(ret.indexOf("NetcoreLoginFlag") != -1){
				window.top.open("/","_self");
			}
			var _this = $("#app_page");
			_this.html(ret);
			if(init_function != null&&init_function != ""){
				try{
					eval(init_function+"();");
				}
				catch(e){}
			}	
		}
	});
}
//======================================================

//======================表格部分=======================
var arrPage;

var GetPage = function(data,pageSize,pageIndex){
	var temp = data;
	var pageSize = pageSize; 	
	var pageIndex = pageIndex;
	
	var arrPage = new Array();;
	
	for(var i = pageSize*(pageIndex-1);i<pageSize*pageIndex;i++)
	{
		if(i<temp.length)
		arrPage.push(temp[i]);	
	}
	return arrPage;
}

function libTable(head,data,index,size,totalNum){
	this.head = head;
	this.data = data;
	this.index = index;
	this.size = size;
	if(totalNum)
		this.totalNum = totalNum;
}
String.prototype.Append = function(str){
	var temp = String(this);
	temp += str;
	return temp;
}

var tempData;

//绘制表格
function print_table(id,tabObj,fun_arr,isAll_param){
	tabObj.maxIndex = Math.ceil(tabObj.data.length/tabObj.size);
	var table = $("#" + id);
	table.html("");
	var obj = tabObj;
	tempData = GetPage(obj.data,obj.size,obj.index);
	
	if(tabObj.head != null){
		//构造thead
		var data_thead = $("<thead/>");
		var thead_row = $("<tr/>");
		for(var cell in obj.head){
			var thead_cell = $("<th/>");
			thead_cell.html(obj.head[cell]);
			thead_row.append(thead_cell);
		}
		data_thead.append(thead_row);
	}
	var tempData = GetPage(obj.data,obj.size,obj.index);
	
	if(tabObj.head != null){
		//构造tbody
		var data_tbody=$("<tbody/>");
	}
	var cols = 1;
	for(var row in tempData){
		var cellRow = "";
		var param='';
		var cell_id = 0;
		var cnt_cellData="";
		
		var data_row;
		if(row%2 == 0){
			data_row = $("<tr/>");
		}
		else{
			data_row = $("<tr class=\"evenrow\"/>");
		}
		
		var cell_id = 0;
		for(cell in tempData[row]){
			cols++;
			var text =  tempData[row][cell];
			cnt_cellData += '<td>'+text+'</td>';
			if(cell_id == 0){
				param='\''+tempData[row][cell]+'\'';
			}
			else{
				if(isAll_param)
					param+=',\''+tempData[row][cell]+'\'';
			}
			cell_id++;
		}
		
		var fun_cellData="";
		if(fun_arr){
			fun_cellData ='<td>';
			for(var i in fun_arr){
				var fun = fun_arr[i];
				if(fun.type == "modify"){
					var val_str = "修改";
					p = param;
					fun_cellData += '<a href="javascript:void(0);" class="fun_link" onclick="'+fun.name+'('+p+')"><image alt="'+val_str+'" src="./images/edit.gif" title="'+val_str+'"/></a>';
				}
				else if(fun.type == "del"){
					var val_str = "删除";
					 p = param;
					fun_cellData += '<a href="javascript:void(0);"  class="fun_link" onclick="'+fun.name+'('+p+')"><image alt="'+val_str+'" src="./images/del.gif" title="'+val_str+'"/></a>';
				}
				else {
					p = param;
					fun_cellData += '<a href="javascript:void(0);"  class="fun_link" onclick="'+fun.name+'('+p+')"><image alt="'+fun.str+'" src="./images/'+fun.type+'.gif" title="'+fun.str+'"/></a>';
				}
			}
			cellRow = cnt_cellData + fun_cellData+'</td>';
		}
		else{
			cellRow = cnt_cellData;
		}
		data_row.html(cellRow);
		if(tabObj.head != null){
			data_tbody.append(data_row);
		}
		else{
			table.append(data_row);
		}
	}
	if(tabObj.head != null){
		table.append(data_tbody);
	}
	
	if(tabObj.head != null){
		//构造tfoot
		var data_tfoot=$("<tbody/>");
	}
	var tfoot_row =$("<tr/>");
	var tfoot_cell = $("<td/>");
	tfoot_cell.attr("colspan",cols);
	tfoot_cell.attr("class","paging");
	tfoot_row.append(tfoot_cell);
	if(tabObj.head != null){
		if(tempData.length != 0)
			data_tfoot.append(tfoot_row);
	}
	else{
		if(tempData.length != 0)
			table.append(tfoot_row);
	}
	
	if(obj.data.length != 0)
		print_page(obj,tfoot_cell,id,fun_arr,isAll_param);//分页函数
	if(tabObj.head != null){
		table.append(data_thead);
		table.append(data_tbody);
		table.append(data_tfoot);
	}
	nos.app.resizePage();
}

var step = 10;
//分页函数
function print_page(tab,page_obj,id,fun_arr,isAll_param){
	var page_obj = typeof(page_obj) == "object" ? page_obj : $("#" + page_obj);
	
	var allNum = Math.ceil(tab.data.length/tab.size);
	var nowNum = tab.index;
	//首页
	var oA = $("<a/>");
	oA.attr("href","#1");
	oA.html("首页");
	page_obj.append(oA);
	
	//上一页
	if(nowNum>=2){
		var oA = $("<a/>");
		oA.attr("href","#"+(nowNum - 1));
		oA.html("上一页");
		page_obj.append(oA);
	}
	
	//显示格式
	if(allNum <= step){
		for(var i = 1;i <= allNum;i++){
			var oA = $("<a/>");
			oA.attr("href","#"+i);
			if(nowNum == i){
				oA.attr("class","current");
			}
			oA.html(i);
			page_obj.append(oA);
		}
	}
	else{
		//每页都只显示步长那么多条,最后一页可能不满步长
		var tmp_len = allNum-nowNum + Math.floor((step-1)/2)+1,len=0;
		if(tmp_len < step)
			len = tmp_len;
		else
			len = tab.size;
		for(var i = 0;i < len;i++){
			if(nowNum >= step){
				var oA = $("<a/>");
				var cur_num = nowNum - Math.floor((step-1)/2) + i;
				oA.attr("href","#"+cur_num);
					
				if(cur_num == nowNum){
					oA.html(nowNum);
					oA.attr("class","current");
				}
				else{
					oA.html(cur_num);
				}
				page_obj.append(oA);
			}
			
			else{
				for(var i = 1;i <= step;i++){
					var oA = $("<a/>");
					oA.href = '#' + i;
					if(nowNum == i){
						oA.attr("class","current");
					}
					oA.html(i);
					page_obj.append(oA);
				}
			}
		}	
	}
	
	//下一页
	if( (allNum - nowNum) >= 1 ){
		var oA = $("<a/>");
		oA.attr("href","#" + (nowNum + 1));
		oA.html("下一页");
		page_obj.append(oA);
	}
	//尾页
	var oA = $("<a/>");
	oA.attr("href","#" + allNum);
	oA.html("尾页");
	page_obj.append(oA);
	
	
	var page_a = page_obj.find('a');
	page_a.unbind("click").bind("click",function(){
		var nowNum =  parseInt($(this).attr('href').substring(1));
		tab.index = nowNum;
		print_table(id,tab,fun_arr,isAll_param);
		return false;
	});
	
}
//====================================================

//=======================表格排序========================
var TempArray = {};
TempArray.id="up";
TempArray.ip="up";
TempArray.user="up";
TempArray.day="up";
TempArray.charge = "up";
TempArray.uptime = "up";


var ArrayData_sort = {};
ArrayData_sort.array = [];
ArrayData_sort.fun = function(){};
function Array_sort_by_type(type,obj){
	if(type == "id"){
		ArrayData_sort.array.sort(Array_int_compare_id);
		if(TempArray.id=="down"){
			ArrayData_sort.array.reverse();
		}
		if(TempArray.id=="up"){ 
			TempArray.id="down";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_asc");
		}
		else{
			TempArray.id="up";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_desc");
		}
	}
	else if(type=="ip"){
		ArrayData_sort.array.sort(Array_int_compare_ip);
		if(TempArray.ip=="down")
			ArrayData_sort.array.reverse();
		if(TempArray.ip=="up"){ 
			TempArray.ip="down";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_asc");
		}
		else{
			TempArray.ip="up";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_desc");
		}
	}
	else if(type=="user"){
		ArrayData_sort.array.sort(Array_str_compare_user);
		if(TempArray.user=="down")
			ArrayData_sort.array.reverse();
		if(TempArray.user=="up"){ 
			TempArray.user="down";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_asc");
		}
		else{
			TempArray.user="up";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_desc");
		}
	}
	else if(type=="charge"){
		ArrayData_sort.array.sort(Array_str_compare_charge_sort);
		if(TempArray.charge=="down"){
			ArrayData_sort.array.reverse();
		}
		if(TempArray.charge=="up"){
			TempArray.charge="down";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_asc");
		}
		else{
			TempArray.charge="up";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_desc");
		}
	}
	else if(type == "day"){
		ArrayData_sort.array.sort(Array_str_compare_day);
		if(TempArray.day=="down")
			ArrayData_sort.array.reverse();
		if(TempArray.day=="up"){ 
			TempArray.day="down";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_asc");
		}
		else{
			TempArray.day="up";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_desc");
		}
	}
	else if(type == "uptime"){
		ArrayData_sort.array.sort(Array_str_compare_uptime);
		if(TempArray.uptime=="down")
			ArrayData_sort.array.reverse();
		if(TempArray.uptime=="up"){ 
			TempArray.uptime="down";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_asc");
		}
		else{
			TempArray.uptime="up";
			reset_sort_bg(obj);
			$(obj).removeClass().addClass("sort_desc");
		}
	}
	ArrayData_sort.fun(ArrayData_sort.array);
}

function reset_sort_bg(obj){
	var _this =  $(obj).parent().find("th");
	for(var i = 0; i < _this.length; i++){
		if(_this.eq(i).attr("class") != undefined)
			_this.eq(i).removeClass().addClass("sort_bg");
	}
}

function int_compare(int1,int2){
	var a=parseInt(int1,10);
	var b=parseInt(int2,10);
	if(a < b)
		return -1;
	else if(a == b)
		return 0;
	else
		return 1;
}

function str_compare(str1,str2){
	if(str1 < str2)
		return -1;
	else if(str1 == str2)
		return 0;
	else
		return 1;
}

function Array_int_compare_id(a,b){
	return int_compare(a.id,b.id);
}

function ip_compare(ip1, ip2){
	var a1 = ip1.split('.');
	var b1 = ip2.split('.');
	var i = 0;
	for( i= 0 ; i < a1.length; i ++)
	{
		if(parseInt(a1[i],10) > parseInt(b1[i],10))
			return 1;
		if(parseInt(a1[i],10) < parseInt(b1[i],10))
			return -1;		
	}
    return 0;
}

function Array_int_compare_ip(a,b){
	return ip_compare(a.ip,b.ip);
}

function Array_str_compare_charge_sort(a,b){
	var a_str=a.charge.charAt(a.charge.length - 1);
	var b_str=b.charge.charAt(b.charge.length - 1);
	if(a_str == "日" && b_str == "日"){
		var t3_year=a.charge.split("：")[1].split("年")[0];
		var t3_month=parseInt(a.charge.split("：")[1].split("年")[1].split("月")[0],10);
		t3_month = t3_month>9?t3_month:"0"+t3_month;
		var t3_day=parseInt(a.charge.split("：")[1].split("年")[1].split("月")[1].split("日")[0]);
		t3_day = t3_day>9?t3_day:"0"+t3_day;
		var t3=parseInt(t3_year+t3_month+t3_day,10);
		
		var t4_year=b.charge.split("：")[1].split("年")[0];
		var t4_month=parseInt(b.charge.split("：")[1].split("年")[1].split("月")[0],10);
		t4_month = t4_month>9?t4_month:"0"+t4_month;
		var t4_day=parseInt(b.charge.split("：")[1].split("年")[1].split("月")[1].split("日")[0]);
		t4_day = t4_day>9?t4_day:"0"+t4_day;
		var t4=parseInt(t4_year+t4_month+t4_day,10);
		
		if(t3>t4)
			return 1;
		else if(t3<t4)
			return -1;
		else
			return 0;
	}
	else if(a_str == "日" && b_str == "制")
		return 1;
	else if(a_str == "日" && b_str != "制")
		return -1;
	
	else if(a_str == "制" && b_str == "制")
		return 0;
	else if(a_str == "制" && b_str != "制")
		return -1;
	
	else if((a_str == "时"&& b_str == "时")||(a_str == "K" && b_str == "K")||(a_str == "M" && b_str == "M")||(a_str == "G" && b_str == "G")||(a_str == "T" && b_str == "T")){
		var t1=parseInt(a.charge.split("：")[2],10);
		var t2=parseInt(b.charge.split("：")[2],10);
		
		if(t1>t2)
			return 1;
		else if(t1<t2)
			return -1;
		else
			return 0;
	}
	else if((a_str == "时"&& b_str=="制")||(a_str == "时" && b_str == "日"))
		return 1;
	else if((a_str == "时" && b_str == "K")||(a_str == "时" && b_str == "M")||(a_str == "时" && b_str == "G")||(a_str == "时" && b_str == "T"))
		return -1;
	else if((a_str=="钟" && b_str == "钟")||(a_str == "时" && b_str == "钟")||(a_str == "钟" && b_str == "时")){
		var a_tmp=a.charge.split("：")[2];
		var b_tmp=b.charge.split("：")[2];
		var t5,t6;
		
		if(a_tmp.indexOf("时")!= -1&&b_tmp.indexOf("时") != -1){
			t5 = a_tmp.split("小时")[0];
			if(t5==0)
				return -1;
			else{
				if(a_tmp.indexOf("分钟")!=-1){
					t5 += a_tmp.split("小时")[1].split("分钟")[0];
				}
				t5 = parseInt(t5,10);
			}
			
			t6 = b_tmp.split("小时")[0];
			if(t6==0)
				return 1;
			else{
				if(b_tmp.indexOf("分钟")!=-1){
					t6 += b_tmp.split("小时")[1].split("分钟")[0];
				}
				t6 = parseInt(t6,10);
			}
			
			if(t5>t6)
				return 1;
			else if(t5<t6)
				return -1;
			else
				return 0;
		}
		else if(a_tmp.indexOf("时") != -1&&b_tmp.indexOf("时") == -1){
			if(parseInt(a_tmp.split("小时")[0])==0){
				return -1;
			}
			else
				return 1;
		}
		else if(a_tmp.indexOf("时") == -1&&b_tmp.indexOf("时")!= -1){
			if(parseInt(b_tmp.split("小时")[0])==0){
				return -1;
			}
			else
				return -1;
		}
		else if(a_tmp.indexOf("时") == -1&&b_tmp.indexOf("时") == -1){
			t5 = parseInt(a_tmp,10);
			t6 = parseInt(b_tmp,10);
			if(t5>t6)
				return 1;
			else if(t5<t6)
				return -1;
			else
				return 0;
		}
	}
	else if((a_str=="钟" && b_str == "制")|| (a_str == "钟" && b_str == "日"))
		return 1;
	else if((a_str == "钟" && b_str == "K")||(a_str == "钟" && b_str == "M")||(a_str == "钟" && b_str == "G")||(a_str == "钟" && b_str == "T"))
		return -1;	
		
	else if((a_str == "K" && b_str == "M")|| (a_str == "K" && b_str == "G") || (a_str == "K" && b_str == "T"))
		return -1;
	else if((a_str == "K" && b_str == "钟")|| (a_str == "K" && b_str == "时") || (a_str == "K" && b_str == "制") || (a_str == "K" && b_str == "日"))
		return 1;
		
	
	else if((a_str=="M" && b_str=="K") || (a_str == "M" && b_str == "钟") || (a_str == "M" && b_str == "时") || (a_str == "M" && b_str == "制") || (a_str == "M" && b_str == "日"))
		return 1;
	else if((a_str == "M" && b_str == "G") || (a_str == "M" && b_str == "T"))
		return -1;
	
	else if(a_str=="G" && b_str == "T")
		return -1;
	
	else if((a_str == "G" && b_str == "M") || (a_str == "G" && b_str == "K") || (a_str == "G" && b_str == "钟") || (a_str == "G" && b_str == "时") || (a_str == "G" && b_str == "制") || (a_str == "G" && b_str == "日"))
		return 1;
	
	else if(a_str == "T" && b_str != "T")
		return 1;
	
	else
		return 0;
	
}

function Array_str_compare_uptime(a,b){
	var a_uptime = convert_time_reverse(a.uptime);
	var b_uptime = convert_time_reverse(b.uptime);
	return int_compare(a_uptime,b_uptime);
}

function Array_str_compare_user(a,b){
	return str_compare(a.user,b.user);
}

function Array_str_compare_day(a,b){
	return time_compare(a.day,b.day);
}

//支持格式xxxx-xx-xx
function time_compare(a,b){	
	if(a!="-"){
		a=a.replace(/-/g,"");
		a=a.replace(/ /g,"");
		a=a.replace(/:/g,"");
		a=parseInt(a,10);
	}
	else{
		a=0;
	}
	if(b!="-"){
		b=b.replace(/-/g,"");
		b=b.replace(/ /g,"");
		b=b.replace(/:/g,"");
		b=parseInt(b,10);
	}
	else{
		b=0;
	}
	return int_compare(a,b);
}

//======================校验出错提示部分=======================
//Point类
function Point(x,y){
	this.x = x;
	this.y = y;
}

//获取一个页面元素的绝对坐标
function getPosition(obj){
	var p = new Point(0,0);
	while(obj){
		p.x = p.x + obj.offsetLeft;
		p.y = p.y + obj.offsetTop;
		obj = obj.offsetParent;
	}
	return p;
}

//消息框
if(!igd) var igd=new Object();
igd.msgbox = function(id,msg){
	this.id = id;
	this.msg = msg;
	this.state = "INIT";
	igd.msgbox.prototype.show = function(){
		this.state = "SHOW";
	}
	igd.msgbox.prototype.hide = function(){
		this.state = "HIDE";
	}
};

//MessageBox类
function MessageBox(msg, position){
	this.msg = msg;
	this.position = position;	

	if(typeof MessageBox._initialized == "undefined"){
		MessageBox.prototype.Obj = document.createElement("div");
		MessageBox.prototype.Obj.id = "_MessageBox_";
		MessageBox.prototype.Obj.className="MessageBox";
		MessageBox.prototype.Obj.appendChild(document.createElement("div"));
		MessageBox.prototype.Obj.firstChild.className="MessageBox_div";
		MessageBox.prototype.Show = function(_msg, _position)
		{
			var obj = this.Obj;
			obj.style.visibility = "visible";

			if(_msg)
				obj.firstChild.innerHTML= _msg;
			else
				obj.firstChild.innerHTML = this.msg;

			if(_position){
				obj.style.left = (_position.x) + "px";
				obj.style.top = (_position.y) + "px";
			}
			else{
				obj.style.left = (this.position.x) + "px";
				obj.style.top = (this.position.y)+ "px";
			}
			document.body.appendChild(this.Obj);
		}
		
		
		MessageBox.prototype.Hide = function()
		{
			this.Obj.style.visibility = "hidden";
		}
		MessageBox._initialized = true;
	}
}

function hide_msgbox(){
	var msgbox = new MessageBox();
	if(msgbox){
		msgbox.Hide();
	}
}
//========================================================

//======================数据校验类型====================
//请勿删除原有类型，以免影响到路由器基本opk模块的数据验证，如需添加新的类型，请在列表后追加
var check_app_map = {
	int : check_int,
	string : check_string,
	char:check_char,
	ip:check_ip,
    mac:check_mac,
	mask:check_mask,
	dns:check_dns,
	hour:check_hour,
	minute:check_min,
	url:check_url,
	ip_url:check_ip_url,
	password : check_password,
	user_password : check_user_password,
	decimal:check_decimal,
	port:check_port,
	pptp_connects:check_pptp_connects,
	l2tp_connects:check_l2tp_connects,
    calendar:check_calendar,
    eq5:check_eq5,
    eq13:check_eq13,
    eq64:check_eq64,
    eq8_63:check_eq8_63,
    eq10:check_eq10,
    eq26:check_eq26,
    char16:check_char16,
	noneed:null
}

//检查整数
function check_int(str){
	if(str==""||str==null){
		var ss="请重新输入一个非空整数!";
		return ss;
	}
	var cmp='0123456789';
	var buf=str;
	for(var h=0;h<buf.length;h++){
		var tst=buf.substring(h,h+1);
		if(cmp.indexOf(tst) < 0){
			var ss="不能含有非数字字符!";
			return ss;
		}
	}
	return true;
}

//检查小数
function check_decimal(str){
    if(str==""||str==null){
        var ss="请重新输入一个非空实数!";
        return ss;
    }
    var cmp='0123456789.';
    var buf=str;
    for(var h=0;h<buf.length;h++){
        var tst=buf.substring(h,h+1);
        if(cmp.indexOf(tst) < 0){
            var ss="不能含有除数字和小数点外的其它字符!";
            return ss;
        }
    }
	 if(str.split(".")[0]==''||str.split(".").length>2||str.split(".")[1]==''){
        var ss="数字格式不正确!";
        return ss;
    }
    return true;
}

//检查dns合法性
function check_dns(str){
	if(str==""){
		var ss="DNS不能为空";
		return ss;
	}
	var reg = /^(|((22[0-3])|(2[0-1]\d)|(1\d\d)|([1-9]\d)|[1-9])(\.((25[0-5])|(2[0-4]\d)|(1\d\d)|([1-9]\d)|\d)){3})$/;
	flag = reg.test(str);
	if(!flag){
		var ss="DNS格式不正确";
		return ss;
	}
	var str2=str.split(".");
	if(str2[0] == 127 || str2[3] == 0){
		var ss="DNS格式不正确";
		return ss;
	}
	return true;
}

//检查端口
function check_port(str){
    if(str==""||str==null){
        var ss="端口不能为空!";
        return ss;
    }
    var cmp='0123456789';
    var buf=str;
    for(var h=0;h<buf.length;h++){
        var tst=buf.substring(h,h+1);
        if(cmp.indexOf(tst) < 0){
            var ss="端口不能含有非数字字符!";
            return ss;
        }
    }
    if(parseInt(str,10)>65535||parseInt(str,10)<1){
        var ss="端口不能大于65535或小于1!";
        return ss;
    }
    return true;
}

//基类
function check_string(str){
	if(str==""||str==null){
		var ss="请重新输入一个非空字符串!";
		return ss;
	}
	var cmp='\\\'"<>';
	var buf=str;
	for(var h=0;h<buf.length;h++){
		var tst=buf.substring(h,h+1);
		if(cmp.indexOf(tst) >= 0){
			var ss='不能含有非法字符'+cmp;
			return ss;
		}
	}
	return true;
}

//不含中文
function check_char(str){
	if(str==""||str==null){
		var ss="请重新输入一个非空字符串!";
		return ss;
	}
	var cmp='\\\'"<>';
	var buf=str;
	for(var h=0;h<buf.length;h++){
		var tst=buf.substring(h,h+1);
		if(cmp.indexOf(tst) >= 0){
			var ss='不能含有非法字符'+cmp;
			return ss;
		}
		if(tst.charCodeAt(0)<0 || tst.charCodeAt(0)>255){
			var ss='不能含有中文字符';
			return ss;
		}
	}
	return true;
}

//检查ip合法性
function check_ip(str){
	var flg=0;
	if(str==""){
		var ss="IP地址不能为空";
		return ss;
	}
	for(var h=0;h<str.length;h++){
		cmp="0123456789.";
		var tst=str.substring(h,h+1);
		if(cmp.indexOf(tst) < 0){
			flg++;
		}
	}
	if (flg!=0){
		var ss="IP地址只接受数字,发现"+flg+"个非法字符!"; 
		return ss; 
	} 
	var str2=str.split(".");
	if(str2.length != 4 ){
		var ss="IP长度不正确";
		return ss;
	}
	for(var h=0;h<str2.length;h++){
		if(str2[h]==""){
			var ss="第"+(h+1)+"段IP值不能为空";
			return ss;
		}
		if(str2[h]>255 || str2[h]<0){
			var ss="第"+(h+1)+"段IP值只能在0-255之间";
			return ss;
		}
	}
	if(str2[0]==0){
		var ss="IP第一位不能为0";
		return ss;
	}
	if(str2[0]==1 && str2[1] == 0 && str2[2] == 0 && str2[3]==0){
		var ss="IP不合法";
		return ss;
	}
	if(str2[0]==127){
		var ss="IP不能为回环地址";
		return ss;
	}
	if(str2[0]>=224&&str2[0]<=239){
		var ss="IP不能为组播地址";
		return ss;
	}
	return true;
}

//检查mac是否合法
function check_mac(str){
    var err_obj = new Object;
    err_obj.mac_addr_err = "MAC地址错误";
    if(str==""){
        var ss=err_obj.mac_addr_err;
        return ss;
    }
    if(str=="00-00-00-00-00-00"||str=="00:00:00:00:00:00"){
        var ss="MAC地址不能为全0";
        return ss;
    }
    var tmp_str=str.toUpperCase();
    if(tmp_str=="FF-FF-FF-FF-FF-FF"||tmp_str=="FF:FF:FF:FF:FF:FF"){
        var ss="MAC地址不能为全F";
        return ss;
    }
    if(str.length!=17){
        var ss=err_obj.mac_addr_err;
        return ss;
    }
    var pattern="/^([0-9A-Fa-f]{2})(-[0-9A-Fa-f]{2}){5}|([0-9A-Fa-f]{2})(:[0-9A-Fa-f]{2}){5}/";
    eval("var pattern=" + pattern);
    var ck = pattern.test(str);
    if(ck==false)
    {
        var ss=err_obj.mac_addr_err;
        return ss;
    }
    return true;
}

//检查mask是否合法
function check_mask(str){
	var strsub=str.split(".");
	if(str=="" || str=="0.0.0.0" || strsub.length != 4){
		var ss="子网掩码输入错误";
		return ss;
	}
	for(var j=0;j<strsub.length;j++){
		strsub[j]=parseInt(strsub[j],10);
		if(strsub[j]!=0 && strsub[j]!=128 && strsub[j]!=192 && strsub[j]!=224 && strsub[j]!=240 && strsub[j]!=248 &&  
			strsub[j]!=252 && strsub[j]!=254 && strsub[j]!=255 ){
			var ss="子网掩码输入错误在第 "+ (j+1) +" 段";
			return ss;
		}
	}
	if(parseInt(strsub[0],10)!=255 && parseInt(strsub[1],10)!=0){
		var ss="第二段子网掩码不符合规范";
		return ss;
	}
	if(parseInt(strsub[1],10)!=255 && parseInt(strsub[2],10)!=0){
		var ss="第三段子网掩码不符合规范";
		return ss;
	}
	if(parseInt(strsub[2],10)!=255 && parseInt(strsub[3],10)!=0){
		var ss="第四段子网掩码不符合规范";
		return ss;
	}
	return true;
}

//检查小时
function check_hour(str){
	if(str==""||str==null){
		var ss="请重新输入一个非空整数!";
		return ss;
	}
	var cmp='0123456789';
	var buf=str;
	for(var h=0;h<buf.length;h++){
		var tst=buf.substring(h,h+1);
		if(cmp.indexOf(tst) < 0){
			var ss="不能含有非数字字符!";
			return ss;
		}
	}
	if(parseInt(str,10)<0){
		var ss="请重新输入小时0-23!";
		return ss;
	}
	else if(parseInt(str,10)>23)
	{
		var ss="请重新输入小时0-23!";
		return ss;
	}
	return true;
}

//检查分钟
function check_min(str){
	if(str==""||str==null){
		var ss="请重新输入一个非空整数!";
		return ss;
	}
	var cmp='0123456789';
	var buf=str;
	for(var h=0;h<buf.length;h++){
		var tst=buf.substring(h,h+1);
		if(cmp.indexOf(tst) < 0){
			var ss="不能含有非数字字符!";
			return ss;
		}
	}
	if(parseInt(str,10)<0){
		var ss="请重新输入分钟0-59!";
		return ss;
	}
	else if(parseInt(str,10)>59)
	{
		var ss="请重新输入分钟0-59!";
		return ss;
	}
	return true;
}

//检查url
function check_url(str){
	if(str==""||str==null){
		var ss="请重新输入一个非空网址!";
		return ss;
	}
	var cmp='<>();+[]{} ';
	var buf=str;
	for(var h=0;h<buf.length;h++){
		var tst=buf.substring(h,h+1);
		if(tst=="."){
			var temp=buf.substring(h+1,h+2);
			if(temp=="."||h==buf.length-1){
				var ss="网址不正确!";
				return ss;
			}
		}
		if(cmp.indexOf(tst) >= 0){
			var ss='不能含有非法字符'+cmp+"及空格";
			return ss;
		}
		if(tst.charCodeAt(0)<0 || tst.charCodeAt(0)>255){
			var ss="不能含有中文字符!";
			return ss;
		}
	}
	return true;
}

//检查ip+url
function check_ip_url(str){
	var flg=0;
	if(str==""){
		var ss="服务器地址不能为空";
		return ss;
	}
	for(var h=0;h<str.length;h++){
		cmp="0123456789.";
		var tst=str.substring(h,h+1);
		if(cmp.indexOf(tst) < 0){
			flg++;
		}
	}
	if (flg != 0){//url
		var ss = check_url(str);
		if(ss != true)
			return ss;
	}
	else{//ip
		var ss = check_ip(str);
		if(ss != true)
			return ss;
	}
	return true;
}

//检查密码
function check_password(str){
	if(str==""||str==null){
		var ss="密码不能为空!";
		return ss;
	}
	var cmp='\\\'"<>';
	var buf=str;
	for(var h=0;h<buf.length;h++){
		var tst=buf.substring(h,h+1);
		if(cmp.indexOf(tst) >= 0){
			var ss='不能含有非法字符'+cmp;
			return ss;
		}
		if(tst.charCodeAt(0)<0 || tst.charCodeAt(0)>255){
			var ss = "不能含有中文字符!"; 
			return ss;
		}
	}
	return true;
}

//检查登录密码
function check_user_password(str){
	if(str==""||str==null){
		var ss="密码不能为空!";
		return ss;
	}
	var cmp='\\\'"<>:';
	var buf=str;
	for(var h=0;h<buf.length;h++){
		var tst=buf.substring(h,h+1);
		if(cmp.indexOf(tst) >= 0){
			var ss='不能含有非法字符'+cmp;
			return ss;
		}
		if(tst.charCodeAt(0)<0 || tst.charCodeAt(0)>255){
			var ss = "不能含有中文字符!"; 
			return ss;
		}
	}
	return true;
}

//检查pptp连接数
function check_pptp_connects(str){
	var max_val=parseInt(pptp_max_num,10);
	if(str == ""){
		var ss = "条目不能为空！";
		return ss;
	}
	if(isNaN(str) || str < 1 || str > max_val){
		if(max_val != 1){
			var ss = "请输入1-"+max_val+"的数字！";
			return ss;
		}
		else{
			var ss = "请输入数字1";
			return ss;
		}
	}
	return true;
}

//检查l2tp连接数
function check_l2tp_connects(str){
	var max_val=parseInt(l2tp_max_num,10);
	if(str == ""){
		var ss = "条目不能为空！";
		return ss;
	}
	if(isNaN(str) || str < 1 || str > max_val){
		if(max_val != 1){
			var ss = "请输入1-"+max_val+"的数字！";
			return ss;
		}
		else{
			var ss = "请输入数字1";
			return ss;
		}
	}
	return true;
}

//检验日期格式为YYYY-MM-DD
function check_calendar(str){
    if(str==""||str==null){
        var ss="请重新输入日期!";
        return ss;
    }
    var parts;
    var msg="日期格式不正确!";
    if (str.indexOf("-") > -1){
        parts = str.split('-');
    }else{
        return msg;
    }
    if(parts.length < 3){
        return msg;
    }
    for(i = 0 ;i < 3; i ++){
        if(isNaN(parseInt(parts[i],10))){
            return msg;
        }
    }
    var y = parseInt(parts[0],10);
    var m = parseInt(parts[1],10);
    var d = parseInt(parts[2],10);
    if(y < 1900||y > 3000){
        var ss="年份输入不正确!";
        return ss;
    }
    if(m < 1 || m > 12){
        var ss="月份输入不正确";
        return ss;
    }
    var ss_msg="日期输入不正确";
    if(d < 1 || d > 31){
        return ss_msg;
    }
    switch(d){
        case 29:
            if(m == 2){
                if((y%4==0)&&(y%100 !=0)){
                    return true;
                }
                else if(y%400==0){
                    return true;
                }
                else
                    return ss_msg;
            }
            break;
        case 30:
            if(m == 2)
                return ss_msg;
            break;
        case 31:
            if(m == 2 || m == 4 || m == 6 || m == 9 || m == 11)
                return ss_msg;
            break;
        default:
            break;
    }
    return true;
}
function check_eq5(str){
    var ss = "请输入5个字符！";
    if(str.length != 5)
        return ss;
    return true;
}
function check_eq13(str){
    var ss = "请输入13个字符！";
    if(str.length != 13)
        return ss;
    return true;
}
function check_eq8_63(str){
    var ss = "请输入(8-63)个字符！";
    if (str.length < 8 || str.length > 63)
        return ss;
    return true;
}
function check_eq64(str){
    var ss = "请输入64个字符！";
    if(str.length != 64)
        return ss;
    return true;
}
function check_eq10(str){
    var ss = "请输入10个字符！";
    if(str.length != 10)
        return ss;
    return true;
}
function check_eq26(str){
    var ss = "请输入26个字符！";
    if(str.length != 26)
        return ss;
    return true;
}
function check_char16(str){
    if(str==""||str==null){
        var ss="请输入数据!";
        return ss;
    }
    return true;
}

//====================================================

//======================数据校验部分======================

//表单整体校验
function check_app_input(key){
	var page_map = reg_app_map[key];
	for(var i in page_map){
		var _input = document.getElementById(page_map[i].id);
		if(_input){
			var point_xy=getPosition(_input);
			point_xy.x += _input.clientWidth+10;
			if(_input.nodeName.toLowerCase()=="select")
				point_xy.y -= 20;
			else
				point_xy.y -= _input.clientHeight;
				
			var reg_val = _input.value;
			if(reg_val == ''){
				if(page_map[i].type.indexOf("noneed") != -1)
					continue;
			}
			var types = page_map[i].type.split(' ');
			for(var p in types){
				if(types[p] == "noneed")
					continue;
				var reg_type = types[p];
				var res = check_app_map[reg_type](reg_val);
					if(res == true)res =CheckLength(_input);
				if(res != true){
					var msgbox = new MessageBox(res,point_xy);
					msgbox.Show();
					return false;
				}
			}
		}
	}
	return true;
}

//表单各项最大长度检查
function CheckLength(strTemp){    
	var i,sum,count;
	count = strTemp.value.length;
	sum=0; 
	
	for(i=0;i<count;i++)
	{
		if ((strTemp.value.charCodeAt(i)>=0) && (strTemp.value.charCodeAt(i)<=255))    
			sum=sum+1;    
	  	else   
			sum=sum+3;
		
		if(sum > strTemp.maxLength){
			var v = strTemp.value.substring(0,i);
			strTemp.value=v;
			return "超出最大长度,已自动截短";
		}
	}
	return true;
}

//单项校验
function get_msgbox(id,type){
	var _input;
	if(typeof(id) == "object"){
		_input = id;
	}
	else{
		_input = document.getElementById(id);
	}
	if(_input == null)
		return;
	var point_xy=getPosition(_input);
	point_xy.x += _input.clientWidth+5;
	if(_input.nodeName.toLowerCase()=="select")
		point_xy.y -= 20;
	else
		point_xy.y -= _input.clientHeight;
	var reg_val = _input.value;
	var types = type.split(' ');
	
	for(var p in types){
		if(types[p] == "noneed")
			continue;
		var reg_type = types[p];
		var res = check_app_map[reg_type](reg_val);
			if(res == true)res =CheckLength(_input);
		if(res != true){
				var msgbox = new MessageBox(res,point_xy);
				msgbox.Show();
				return false;	
		}
	}
	return true;
}

//检验textarea
function check_textarea(id,str){
	var ctr_obj = document.getElementById(id);
	var str = ctr_obj.value;
	var point_xy=getPosition(ctr_obj);
	point_xy.x += ctr_obj.clientWidth+5;
	point_xy.y -= 20;
	var ss = check_string(str);
	if(ss != true){
		var msgbox = new MessageBox(ss,point_xy);
		msgbox.Show();
		return false;
	}
	return true;
}
//======================================================

//=============================其他========================================

//设置选中select
function select_chose_set(sel_id, val, func){
  var collection = document.getElementById(sel_id);
  if(collection)
	  for (var i=0;i<collection.options.length;i++){
		if (collection.options[i].value == val){
			collection.options[i].selected=true;
		}
	  }
	if(func){
		func(val);
	}
}

//设置选中radio
function radio_sele_set(radio_name,get_value,func){
	var collection = document.getElementsByName(radio_name);
	for (i=0;i<collection.length;i++){
    	collection[i].checked =(collection[i].value == get_value)?true:false;
	}
	if(func){
		func(get_value);
	}
}

//检查起始IP大小
function check_start_end_ip(ip1,ip2){
	var ip_arr1=ip1.split(".");
	var ip_arr2=ip2.split(".");
	for(var i=0;i<4;i++){
		if(parseInt(ip_arr1[i],10)>parseInt(ip_arr2[i],10)){
			var ss="起始IP大于结束IP";
			return ss;
		}
		if(parseInt(ip_arr1[i],10)<parseInt(ip_arr2[i],10))
			break;
	}
	return true;
}

//检查起始端口大小
function check_start_end_port(port1,port2){
	var port_a = parseInt(port1,10);
	var port_b = parseInt(port2,10);
	if(port_a > port_b){
		var ss="起始端口大于结束端口";
		return ss;
	}
	return true;
}

//绘制下拉框
function paint_select(id,arr){
	$("#"+id).html("");
	for(var i in arr){
		$("#"+id).append("<option value=\""+arr[i].value+"\">"+arr[i].text+"</option>");
	}
}

//wan口显示（适用于多wan口的情况）
var g_wan_num = 1;

function format_wan(i){
	var tmp = "";
	if(g_wan_num == 1)
		tmp = "WAN";
	else
		tmp = "WAN" + i;
	return tmp;
}

//绘制wan下拉框（适用于多wan口的情况）
function set_uiname_select(id,type){
	var arr = [];
	if(type == "ALL"){
		arr.push({text:"ALL", value:"ALL"});
		for(var i = 1;i<=g_wan_num;i++){
			var wan_text = format_wan(i);
			var wan_val = "WAN" + i;
			arr.push({text:wan_text,value:wan_val});	
		}
		arr.push({text:"LAN", value:"LAN"});
	}
	else if(type == "WAN"){
		for(var i = 1;i<=g_wan_num;i++){
			var wan_text = format_wan(i);
			var wan_val = "WAN" + i;
			arr.push({text:wan_text,value:wan_val});	
		}
	}
	else if(type == "LAN"){
		arr.push({text:"LAN", value:"LAN"});
	}
	else if(type == "WAN+LAN"){
		for(var i = 1;i<=g_wan_num;i++){
			var wan_text = format_wan(i);
			var wan_val = "WAN" + i;
			arr.push({text:wan_text,value:wan_val});	
		}
		arr.push({text:"LAN", value:"LAN"});
	}
	else if(type == "NODEV"){
		arr.push({text:"不指定", value:"nodev"});
		for(var i = 1;i<=g_wan_num;i++){
			var wan_text = format_wan(i);
			var wan_val = "WAN" + i;
			arr.push({text:wan_text,value:wan_val});	
		}
		arr.push({text:"LAN", value:"LAN"});
	}
	paint_select(id,arr);
}

//转换函数
function math_unit_conversion(str){
	var int_v=parseInt(str,10);
	var map={0:"",1:"K",2:"M",3:"G",4:"T"};
	var h=0;
	for(h=0;int_v>1024;h++){
		int_v=int_v/1024;
	}
	if(h>4){
		int_v=int_v*Math.pow(1024,(h-4));
		h=4;
	}
	
	var ret_str=int_v.toString().indexOf(".")>-1?int_v.toFixed(2) : int_v; 
	if(ret_str == "1024"){
		return "1"+ map[h+1];
	}
	else
		return ret_str+map[h];
}

function math_unit_converter(str){
	var int_v=parseInt(str,10);
	var map={0:"B",1:"K",2:"M",3:"G",4:"T"};
	var h=0;
	for(h=0;int_v>1024;h++){
		int_v=int_v/1024;
	}
	if(h>4){
		int_v=int_v*Math.pow(1024,(h-4));
		h=4;
	}

	var ret_str=int_v.toString().indexOf(".")>-1?int_v.toFixed(2) : int_v; 
	return ret_str+map[h];
}

function convert_time(timeStr){
	var int_v=parseInt(timeStr,10);
	var map={0:"秒",1:"分",2:"小时",3:"天"};
	var h=0;
	if(0<int_v<60){h=0}
	if(int_v>=60&&int_v<3600){h=1}
	if(int_v>=3600&&int_v<86400){h=2}
	if(int_v>=86400){h=3}
	var re_str="";
	if(h==0){ret_str=int_v+map[h];}
	if(h==1){
		var p1=0,p2=0;
		p1=Math.floor(int_v/60);
		p2=Math.floor(int_v%60);
		if(p2!=0)
			ret_str=p1+map[h]+p2+map[h-1];
		else
			ret_str=p1+map[h];
	}
	if(h==2){
		var p1=0,p2=0,p3=0;
		p1=Math.floor(int_v/3600);
		p2=Math.floor((int_v%3600)/60);
		p3=Math.floor(int_v%60);
		if(p3==0&&p2==0)
			ret_str=p1+map[h];
		else if(p3!=0&&p2==0)
			ret_str=p1+map[h]+p3+map[h-2];
		else if(p3==0&&p2!=0)
			ret_str=p1+map[h]+p2+map[h-1];
		else
			ret_str=p1+map[h]+p2+map[h-1]+p3+map[h-2];
	}
	if(h==3){
		var p1=0,p2=0,p3=0,p4=0;
		p1=Math.floor(int_v/(60*60*24));
		p2=Math.floor((int_v/3600)%24);
		p3=Math.floor((int_v%3600)/60);
		p4=Math.floor(int_v%60);
		if(p2==0&&p3==0&p4==0)
			ret_str=p1+map[h];
		else if(p2!=0&&p3==0&&p4==0)
			ret_str=p1+map[h]+p2+map[h-1];
		else if(p2==0&&p3!=0&&p4==0)
			ret_str=p1+map[h]+p3+map[h-2];
		else if(p2==0&&p3==0&&p4!=0)
			ret_str=p1+map[h]+p4+map[h-3];
		else if(p2!=0&&p3!=0&&p4==0)
			ret_str=p1+map[h]+p2+map[h-1]+p3+map[h-2];
		else if(p2==0&&p3!=0&&p4!=0)
			ret_str=p1+map[h]+p3+map[h-2]+p4+map[h-3];
		else if(p2!=0&&p3==0&&p4!=0)
			ret_str=p1+map[h]+p2+map[h-1]+p4+map[h-3];
		else
			ret_str=p1+map[h]+p2+map[h-1]+p3+map[h-2]+p4+map[h-3];
	}
	return ret_str;
}

function convert_time_reverse(s_val){
	var s_day = "";
	var s_hour = "";
	var s_min = "";
	var s_sec = "";
	var s_day_flag = false;
	var s_hour_flag = false;
	var s_min_flag = false;
	if(s_val.indexOf("天") != -1){
		s_day = s_val.split("天")[0];
		s_day_flag = true;
	}
	if(s_val.indexOf("小时") != -1){
		s_hour_flag = true;
		if(s_day_flag){
			s_hour = s_val.split("天")[1].split("小时")[0];
		}
		else{
			s_hour = s_val.split("小时")[0];
		}
	}
	if(s_val.indexOf("分") != -1){
		s_min_flag = true;
		if(s_day_flag && s_hour_flag){
			s_min = s_val.split("天")[1].split("小时")[1].split("分")[0];
		}
		else if(s_day_flag && !s_hour_flag){
			s_min = s_val.split("天")[1].split("分")[0];
		}
		else if(!s_day_flag && s_hour_flag){
			s_min = s_val.split("小时")[1].split("分")[0];
		}
		else if(!s_day_flag && !s_hour_flag){
			s_min = s_val.split("分")[0];
		}
	}
	if(s_val.indexOf("秒") != -1){
		if(s_day_flag && s_hour_flag && s_min_flag){
			s_sec = s_val.split("天")[1].split("小时")[1].split("分")[1].split("秒")[0];
		}
		else if(s_day_flag && s_hour_flag && !s_min_flag){
			s_sec = s_val.split("天")[1].split("小时")[1].split("秒")[0];
		}
		else if(s_day_flag && !s_hour_flag && s_min_flag){
			s_sec = s_val.split("天")[1].split("分")[1].split("秒")[0];
		}
		else if(s_day_flag && !s_hour_flag && !s_min_flag){
			s_sec = s_val.split("天")[1].split("秒")[0];
		}
		else if(!s_day_flag && s_hour_flag && s_min_flag){
			s_sec = s_val.split("小时")[1].split("分")[1].split("秒")[0];
		}
		else if(!s_day_flag && s_hour_flag && !s_min_flag){
			s_sec = s_val.split("小时")[1].split("秒")[0];
		}
		else if(!s_day_flag && !s_hour_flag && s_min_flag){
			s_sec = s_val.split("分")[1].split("秒")[0];
		}
		else if(!s_day_flag && !s_hour_flag && !s_min_flag){
			s_sec = s_val.split("秒")[0];
		}
	}
	var s_uptime = 0;
	
	if(s_day != "")
		s_uptime += parseInt(s_day*24*3600,10);
	if(s_hour != "")
		s_uptime += parseInt(s_hour*3600,10);
	if(s_min != "")
		s_uptime += parseInt(s_min*60,10);
	if(s_sec != "")
		s_uptime += parseInt(s_sec,10);
	return s_uptime;
}

//换行
function break_row(str,len){
	var temp_str="",n=1;
	if(str.length<=len){
		temp_str=str;
	}
	else{
		var temp_arr=new Array();
		for(var i=0;i<str.length;i++){
			temp_arr[i]=str.charAt(i);
			if(n%len==0){
				temp_arr[i]=temp_arr[i]+"<br/>";
			}
			n++;
			temp_str +=temp_arr[i];
		}
	}
	return temp_str;
}

//===========================基本模块部分结束================================



//===========================通用模块部分开始================================

//各种组类型
//===========================用户组=========================================
var g_user_group;
//初始化用户组
function init_user_group(data){
	$("#user_group_cnt").html("");
	g_user_group = data;
	var user_grp = data;
	for(var i in user_grp){
		if(i%3 == 0 && i!= 0){
			$("#user_group_cnt").append("<br/>");
		}
		var $cusr = $("<input type='checkbox' value='"+user_grp[i].gid+"' id='user_grp"+i+"'>");
		var $lusr = $("<label for='user_grp"+i+"' class='inline'>"+user_grp[i].name+"</label>");
		$("#user_group_cnt").append($cusr);
		$("#user_group_cnt").append($lusr);
	}
}
//修改用户组
function modify_user_group(data){
	$("#user_group_cnt :checkbox").attr("checked",false);
	var len = $("#user_group_cnt :checkbox").length;
	var gid_value_arr = [];
	if(data.ugid == undefined)
		return;
	gid_value_arr = data.ugid.split(",");
	for(var i=0; i < gid_value_arr.length; i++){
		for(var m = 0; m < len; m ++ ){
			var usr_grp_value = $("#user_grp"+m).val();
			if(parseInt(gid_value_arr[i],10) == parseInt(usr_grp_value,10)){
				$("#user_grp"+m).attr("checked",true);
				break;
			}
		}
	}
}
//绘制用户组
function paint_user_group(obj){
	var str = '';
	var user_group_arr = [];
	if(obj.ugid == undefined)
		return str;
	user_group_arr = obj.ugid.split(",");
	for(var i in g_user_group){
		for(var j in user_group_arr){
			if(user_group_arr[j] == g_user_group[i].gid){
				str +=  g_user_group[i].name +"<br/>";
				continue;
			}
		}
	}
	str = str.slice(0,-1);
	return str;	
}

//===========================时间组设置=====================================

function paint_time_segment_dom(){
	$("#time_segment_layer").html("");
	var str = "";
	str += '<dd>';
	str += '<label for="g_time0" class="isneed">时间</label>';
	str += '<input type="radio" name="g_time" value="0" onClick="g_time_change(this.value)" id="g_time0" checked="checked"/>';
	str += '<label for="g_time0" class="inline">全天</label>';
	str += '<input type="radio" name="g_time" value="1" onClick="g_time_change(this.value)" id="g_time1"/>';
	str += '<label for="g_time1" class="inline">时间段</label>';
	str += '<input type="hidden" name="timer_enable" id="g_time_flag" value="0"/>';
	str += '</dd>';
	str += '<div id="g_time_layer" class="off">';
	str += '<dd>';
	str += '<label style="width:170px;" class="isneed">星期</label>';
	str += '<input type="checkbox" value="1" id="g_day0">';
	str += '<label for="g_day0" class="inline">星期一</label>';
	str += '<input type="checkbox" value="2" id="g_day1">';
	str += '<label for="g_day1" class="inline">星期二</label>';
	str += '<input type="checkbox" value="3" id="g_day2">';
	str += '<label for="g_day2" class="inline">星期三</label>';
	str += '<input type="checkbox" value="4" id="g_day3">';
	str += '<label for="g_day3" class="inline">星期四</label>';
	str += '<input type="checkbox" value="5" id="g_day4">';
	str += '<label for="g_day4" class="inline">星期五</label>';
	str += '<input type="checkbox" value="6" id="g_day5">';
	str += '<label for="g_day5" class="inline">星期六</label>';
	str += '<input type="checkbox" value="7" id="g_day6">';
	str += '<label for="g_day6" class="inline">星期日</label>';
	str += '<input type="hidden" name="timer_day" id="g_day" value=""/>';
	str += '</dd>';
	str += '<dd>';
	str += '<label for="g_start_hour">时间</label>';
	str += '<input type="text" maxlength="2" size="5" name="start_hour" id="g_start_hour"/>';
	str += '<label class="inline" for="g_start_hour">时</label>';
	str += '<input type="text" maxlength="2" size="5" name="start_minute" id="g_start_min"/>';
	str += '<label class="inline" for="g_start_min">分</label>';
	str += '<span>---</span>';
	str += '<input type="text" maxlength="2" size="5" name="end_hour" id="g_end_hour"/>';
	str += '<label class="inline" for="g_end_hour">时</label>';
	str += '<input type="text" maxlength="2" size="5" name="end_minute" id="g_end_min"/>';
	str += '<label class="inline" for="g_end_min">分</label>';
	str += '</dd>';
	str += '</div>';
	$("#time_segment_layer").html(str);
}

var g_time_obj = {};
//时间组设置
function g_time_change(value){
	if(value == "0"){
		$("#g_time_layer").removeClass("on").addClass("off");
	}
	else{
		$("#g_time_layer").removeClass("off").addClass("on");
	}
	$("#g_time_flag").val(value);
	//清空
	hide_msgbox();
	clear_g_time_text();
	nos.app.resizePage();
	//赋值
	if(g_time_obj.start_hour)
		$("#g_start_hour").val(g_time_obj.start_hour);
	if(g_time_obj.start_min)
		$("#g_start_min").val(g_time_obj.start_min);
	if(g_time_obj.end_hour)
		$("#g_end_hour").val(g_time_obj.end_hour);
	if(g_time_obj.end_min)
		$("#g_end_min").val(g_time_obj.end_min);
	if(g_time_obj.day){
		var week = g_time_obj.day.split(' ');
		for(e= 0; e<week.length; e++)
		{
			var j = parseInt(week[e],10) - 1;
			$("#g_day"+j).attr("checked",true);
		}
	}
}
//时间组显示
function show_g_time(data){
	g_time_obj ={};
	if(!(data.start_hour == "0" && data.start_minute == "0" && data.end_hour == "0" && data.end_minute == "0" && data.timer_day =="")){
		g_time_obj.start_hour = data.start_hour;
		g_time_obj.start_min = data.start_minute;
		g_time_obj.end_hour = data.end_hour;
		g_time_obj.end_min = data.end_minute;
		g_time_obj.day = data.timer_day;
	}
	radio_sele_set("g_time",data.timer_enable);
	g_time_change(data.timer_enable);
}
//打印时间组
function print_time_str(obj){	
	var timer_enable = obj.timer_enable;
	var timer_str = '';
	if(timer_enable == "1")
	{
		var timer_day = obj.timer_day;
		var timer_day_arr = timer_day.split(' ');
		var start_hour = obj.start_hour;
		var start_minute = obj.start_minute;
		var end_hour = obj.end_hour;
		var end_minute = obj.end_minute;
		if(timer_day != ''){
			var  tmp_str = "星期";
			for(var m = 0 ; m < timer_day_arr.length; m ++){
				var j = timer_day_arr[m];
					switch(parseInt(j,10))
					{
						case 1: tmp_str += "一,";break;
						case 2: tmp_str += "二,";break;
						case 3: tmp_str += "三,";break;
						case 4: tmp_str += "四,";break;
						case 5: tmp_str += "五,";break;
						case 6: tmp_str += "六,";break;
						case 7: tmp_str += "日,";break;
					}	
				
			}
			timer_str += tmp_str.slice(0, -1);
		
			if(!(0 == start_hour && 0 == start_minute && 23 == end_hour && 59 == end_minute)){
				timer_str+=" ("+format_number(start_hour)+":"+format_number(start_minute)+"-"+
				 +format_number(end_hour)+":"+format_number(end_minute)+")" ;
			}
			//timer_str +="<br/>";
		}
		//时间组函数预留位置
		//timer_str += paint_user_group(obj, "time");
	}
	else if(timer_enable == "0"){
		timer_str = "全天";
	}
	return timer_str;		
}
function format_number(no){
	no = ""+no;
	if(no.length == 1){
		no = "0" + no;
	}
	return no;
}
//清空时间组
function clear_g_time_text(){
	$("#g_start_hour").val("");
	$("#g_start_min").val("");
	$("#g_end_hour").val("");
	$("#g_end_min").val("");
	$("#g_day").val("");
	for(var i=0;i<7;i++){
		$("#g_day"+i).attr("checked",false);
	}
}
//时间组校验
function check_g_time(){
	if(!check_time_week()){
		return false;
	}
	if("1" == $("#g_time_flag").val() && (!check_time_segment())){
		return false;
	}
	return true;
}

function check_time_week(){
	if($("#g_time_flag").val() != "1")//1为时间段
		return true;
	else{
		var day_str='';
		var nu=0;
		for(var h=0;h<7;h++){
			var obj=$('#g_day'+h);
			if(obj.get(0).checked == true){
				day_str=day_str + obj.val() +' ';
				nu++;
			}
		}
		if(day_str == ""){
			alert("至少勾选一个星期选项！");
			return false;
		}
		$("#g_day").val(day_str);
		return 1;
	}
}

function check_time_segment(){
	var hour_s = $("#g_start_hour");
	var min_s = $("#g_start_min");
	var hour_e = $("#g_end_hour");
	var min_e = $("#g_end_min");
	if("" == hour_s.val() && "" == min_s.val() && "" == hour_e.val() && "" == min_e.val()){
		hour_s.val(0);
		min_s.val(0);
		hour_e.val(23);
		min_e.val(59);
	}
	else{
		if(!check_app_input("g_time_segment")){
			return false;
		}
		/*if(hour_s.val()*60+parseInt(min_s.val()) >= hour_e.val()*60+parseInt(min_e.val())){
			alert("结束时间应大于起始时间");
			return false;
		}*/
	}
	return true;
}
//========================================================================

//===========================网址组=========================================
//初始化网址组
function init_bw_url_group(content){
	$("#url_grp_sel").html("");
	var ctent = content;
	if(ctent.length==0){
		$opt = $("<option value='-1'>无</option>");
		$opt.appendTo("#url_grp_sel");
		return;
	}
	for(var i in ctent)
	{
		$opt = $("<option value='"+ctent[i].gid+"'>"+ctent[i].name+"</option>");
		$opt.appendTo("#url_grp_sel");
	}
}

//===========================DNS组==========================================
var g_dns_group;
//change dgid into grp_name
//初始化DNS组
function init_dns_group_sele(content){
	g_dns_group = content;
	$("#dns_filter_group").html("");
	var ctent = content;
	if(ctent.length==0){
		$opt = $("<option value='-1'>无</option>");
		$opt.appendTo("#dns_filter_group");
		return;
	}
	for(var i in ctent)
	{
		//$opt = $("<option value='"+ctent[i].gid+"'>"+ctent[i].name+"</option>");
		$opt = $("<option value='"+ctent[i].name+"'>"+ctent[i].name+"</option>");
		$opt.appendTo("#dns_filter_group");
	}
}

//绘制DNS组
function paint_dns_group(obj){
	var str = '';
/*	if(obj.dgid == undefined)
		return str;
	for(var i in g_dns_group){
		if(obj.dgid == g_dns_group[i].gid){
			str =  g_dns_group[i].name;
		}
	}*/
	if(obj.grp_name == undefined)
		return str;
	str = obj.grp_name;
	return str;	
}


//===========================内网主机（源主机） 开始========================

//绘制内网主机（源主机）+用户组
function paint_lan_ip_dom(){
	$("#lan_ip_layer_wrap").html("");
	var str = '';
	str += '<div id="lan_ip_layer">';
	str += '<dd>';
	str += '<label class="isneed" for="lan_host_flag">内网主机</label>';
	str += '<select id="lan_host_flag" name="lan_host_flag" onChange="lan_mode_change(this.value)">';
	str += '<option value="all" >所有主机</option>';
	str += '<option value="user_group">用户组</option>';
	str += '<option value="host">特定主机</option>';
	str += '<option value="sub_host">主机子网</option>';
	str += '<option value="ip_host">主机IP段</option>';
	str += '</select>';
	str += '<input type="hidden" id="user_type" name="user_type"/>';
	str += '</dd>';
	str += '<div id="lan_host_sub_ip" class="off">';
	str += '<dd>';
	str += '<label id="lan_host_first" for="lan_filter_ip" class="isneed"></label>';
	str += '<input name="lan_host_ip" id="lan_filter_ip" type="text" size="17" maxlength="31"/>';
	str += '</dd>';
	str += '<dd>';
	str += '<label id="lan_host_second" for="lan_filter_mask" class="isneed"></label>';
	str += '<input name="lan_host_mask" id="lan_filter_mask" type="text" size="17" maxlength="31"/>';
	str += '</dd>';
	str += '</div>';
	str += '</div>';
	str += '<div id="user_group_layer" class="off">';
	str += '<dd>';
	str += '<div id="user_group_cnt" style="margin-left:200px;"></div>';
	str += '<input type="hidden" id="user_group" name="ugid" />';
	str += '</dd>';
	str += '</div>';
	$("#lan_ip_layer_wrap").html(str);
}

//内网主机（源主机）类型切换
function lan_mode_change(ip_mode){
	$("#lan_filter_ip").val("");
	$("#lan_filter_mask").val("");
	$("#user_group_cnt :checkbox").attr("checked",false);
	if(ip_mode == "host"){
		$("#lan_host_sub_ip").removeClass("off").addClass("on");
		$("#user_group_layer").removeClass("on").addClass("off");
		$("#lan_host_first").html('IP地址');
		$("#lan_host_second").html('子网掩码');
		$("#lan_filter_mask").val("255.255.255.255");
		$("#lan_filter_mask").attr("disabled",true);
	}
	else if(ip_mode == "sub_host"){
		$("#lan_host_sub_ip").removeClass("off").addClass("on");
		$("#user_group_layer").removeClass("on").addClass("off");
		$("#lan_host_first").html('IP地址');
		$("#lan_host_second").html('子网掩码');
		$("#lan_filter_mask").val("");
		$("#lan_filter_mask").attr("disabled",false);
	}
	else if(ip_mode == "ip_host"){
		$("#lan_host_sub_ip").removeClass("off").addClass("on");
		$("#user_group_layer").removeClass("on").addClass("off");
		$("#lan_host_first").html('起始IP地址');
		$("#lan_host_second").html('结束IP地址');
		$("#lan_filter_mask").val("");
		$("#lan_filter_mask").attr("disabled",false);
	}
	else if(ip_mode == "user_group"){
		$("#lan_host_sub_ip").removeClass("on").addClass("off");
		$("#user_group_layer").removeClass("off").addClass("on");
	}
	else if(ip_mode == "all"){
		$("#lan_host_sub_ip").removeClass("on").addClass("off");
		$("#user_group_layer").removeClass("on").addClass("off");
	}
	nos.app.resizePage();
}
//修改内网主机（源主机）
function modify_lan_mode_change(obj){
	var user_type = obj.user_type;
	$("#lan_filter_ip").val("");
	$("#lan_filter_mask").val("");
	if(user_type == "1"){
		var ip_mode = obj.lan_host_flag;
		select_chose_set("lan_host_flag",ip_mode);
		if(ip_mode=="host"){
			$("#lan_host_sub_ip").removeClass("off").addClass("on");
			$("#lan_host_first").html('IP地址');
			$("#lan_host_second").html('子网掩码');
			$("#lan_filter_mask").val('255.255.255.255');
			$("#lan_filter_mask").attr("disabled",true);
			$("#lan_filter_ip").val(obj.lan_host_ip);
		}
		else if(ip_mode=="sub_host"){
			$("#lan_host_sub_ip").removeClass("off").addClass("on");
			$("#lan_host_first").html('IP地址');
			$("#lan_host_second").html('子网掩码');
			$("#lan_filter_mask").val(obj.lan_host_mask);
			$("#lan_filter_mask").attr("disabled",false);
			$("#lan_filter_ip").val(obj.lan_host_ip);
		}
		else if(ip_mode=="ip_host"){
			$("#lan_host_sub_ip").removeClass("off").addClass("on");
			$("#lan_host_first").html('起始IP地址');
			$("#lan_host_second").html('结束IP地址');
			$("#lan_filter_mask").val(obj.lan_host_mask);
			$("#lan_filter_mask").attr("disabled",false);
			$("#lan_filter_ip").val(obj.lan_host_ip);
		}
		else if(ip_mode == "all"){
			$("#lan_host_sub_ip").removeClass("on").addClass("off");
			$("#user_group_layer").removeClass("on").addClass("off");
		}
	}
	else if(user_type == "2"){
		$("#lan_host_sub_ip").removeClass("on").addClass("off");
		$("#user_group_layer").removeClass("off").addClass("on");
		select_chose_set("lan_host_flag","user_group");
		modify_user_group(obj);
	}
}
//获取内网主机（源主机）+用户组字符串
function get_lanhost_str(data){
	var lanhost_str = "";
	if("all" == data.lan_host_flag){
	   lanhost_str = "ALL" + "<br/>" ;
	}
	else if("host" == data.lan_host_flag){
	   lanhost_str = data.lan_host_ip + "<br/>" ;
	}
	else if("sub_host" == data.lan_host_flag){
	   lanhost_str = data.lan_host_ip+"<br>/"+data.lan_host_mask + "<br/>" ;
	}
	else if("ip_host" == data.lan_host_flag){
	   lanhost_str = data.lan_host_ip+"<br>/"+data.lan_host_mask + "<br/>" ;
	}
	else{
	   lanhost_str = ''; 
	}
	lanhost_str += paint_user_group(data);
	return lanhost_str;
}
//获取内网主机（源主机）+用户组类型
function get_user_lan_ip_conbine(){
	if($("#lan_host_flag").val() == "user_group"){
		$("#user_type").val("2");
		get_user_group();
	}
	else{
		$("#user_type").val("1");
	}
}
//获取用户组
function get_user_group(){
	var tmp_str = "";
	var len = $("#user_group_cnt :checkbox").length;
	for(var t = 0; t < len; t++){
		if($("#user_grp"+t).attr("checked")){
			tmp_str += $("#user_grp"+t).val() + ",";
		}
	}
	$("#user_group").val(tmp_str);
	return tmp_str;
}
//内网主机（源主机）+用户组校验函数
function check_user_lan_ip_combine(){
	var ck_user_type = $("#lan_host_flag").val();
	if(ck_user_type != "user_group"){
		if(!lan_mode_check()){
			return false;
		}
	}
	else{
		if(!check_user_group()){
			return false;
		}
	}
	return true;
}
//内网主机（源主机）校验
function lan_mode_check(){
	var flag = $("#lan_host_flag").val();
	if("host" == flag){
		if(!check_app_input("lan_host")){
			return false;
		}
	}
	else if("sub_host" == flag){
		if(!check_app_input("lan_sub_host")){
			return false;
		}
	}
	else if("ip_host" == flag){
		if(!check_app_input("lan_ip_host")){
			return false;
		}
		var return_val = host_ip_check("lan_filter_ip");
		if(return_val!=true){
			return false;
		}
	}
	return true;
}
//用户组校验
function check_user_group(){
	var ck_flag = false;
	var obj = $("#user_group_cnt :checkbox");
	var len = obj.length;
	for(var i=0;i<len;i++){
		if(obj.eq(i).attr("checked")){
			ck_flag = true;
			break;
		}
	}
	if(!ck_flag){
		alert("请至少勾选一个用户组！");
		return false;
	}
	else
		return true;
}

//===========================内网主机（源主机） 结束=======================



//===========================目的主机 开始===========================

//绘制目的主机+dns组
function paint_wan_ip_dom(){
	$("#wan_ip_layer_wrap").html("");
	var str = '';
	str += '<div id="wan_ip_layer">';
	str += '<dd>';
	str += '<label class="isneed" for="wan_host_flag">目的主机</label>';
	str += '<select id="wan_host_flag" name="wan_host_flag" onChange="wan_mode_change(this.value)">';
	str += '</select>';
	str += '</dd>';
	str += '<div id="wan_host_sub_ip" class="off">';
	str += '<dd>';
	str += '<label id="wan_host_first" for="wan_filter_ip" class="isneed"></label>';
	str += '<input name="wan_host_ip" id="wan_filter_ip" type="text" size="17" maxlength="31"/>';
	str += '</dd>';
	str += '<dd>';
	str += '<label id="wan_host_second" for="wan_filter_mask" class="isneed"></label>';
	str += '<input name="wan_host_mask" id="wan_filter_mask" type="text" size="17" maxlength="31"/>';
	str += '</dd>';
	str += '</div>';
	str += '</div>';
	str += '<div id="dns_type_choose_layer">';
	str += '<dd id="dns_url_layer" class="off">';
	str += '<label class="isneed" for="dns_filter_url">DNS</label>';		
	str += '<input type="text" id="dns_filter_url" name="dns_txt" maxlength="31" size="30" />';
	str += '<span>如：www.qq.com(精确匹配)或qq(模糊匹配)</span>';					
	str += '</dd>';
	str += '<dd id="dns_group_name_layer" class="off">';
	str += '<label class="isneed" for="dns_filter_group">DNS组</label>';
	str += '<select id="dns_filter_group" name="grp_name" />';
	str += '</select>';		
	str += '</dd>';
	str += '</div>';
	$("#wan_ip_layer_wrap").html(str);
}

//初始化目的主机
//此函数接收一个参数判断是否类型为dns过滤页面的目的主机
function init_wan_mode_sele(type){
	$("#wan_host_flag").empty("");
	if(type == "dns_filter"){
		$("#wan_host_flag").append("<option value=\"dns\">DNS</option>");
		$("#wan_host_flag").append("<option value=\"dns_group\">DNS组</option>");
		$("#dns_type_choose_layer").removeClass("off").addClass("on");
		$("#dns_url_layer").removeClass("off").addClass("on");
	}
	else{
		$("#wan_host_flag").append("<option value=\"all\" selected=\"selected\">所有主机</option>");
		$("#wan_host_flag").append("<option value=\"host\">特定主机</option>");
		$("#wan_host_flag").append("<option value=\"sub_host\">主机子网</option>");
		$("#wan_host_flag").append("<option value=\"ip_host\">主机IP段</option>");
		$("#wan_host_flag").append("<option value=\"dns\">DNS</option>");
		$("#wan_host_flag").append("<option value=\"dns_group\">DNS组</option>");
	}
}
//目的主机类型切换
function wan_mode_change(ip_mode){
	$("#wan_filter_ip").val("");
	$("#wan_filter_mask").val("");
	$("#dns_filter_url").val("");
	$("#dns_filter_group").get(0).selectedIndex = "0";
	if(ip_mode == "host"){
		$("#wan_host_sub_ip").removeClass("off").addClass("on");
		$("#dns_type_choose_layer").removeClass("on").addClass("off");
		$("#wan_host_first").html('IP地址');
		$("#wan_host_second").html('子网掩码');
		$("#wan_filter_mask").val("255.255.255.255");
		$("#wan_filter_mask").attr("disabled",true);
	}
	else if(ip_mode == "sub_host"){
		$("#wan_host_sub_ip").removeClass("off").addClass("on");
		$("#dns_type_choose_layer").removeClass("on").addClass("off");
		$("#wan_host_first").html('IP地址');
		$("#wan_host_second").html('子网掩码');
		$("#wan_filter_mask").val("");
		$("#wan_filter_mask").attr("disabled",false);
	}
	else if(ip_mode == "ip_host"){
		$("#wan_host_sub_ip").removeClass("off").addClass("on");
		$("#dns_type_choose_layer").removeClass("on").addClass("off");
		$("#wan_host_first").html('起始IP地址');
		$("#wan_host_second").html('结束IP地址');
		$("#wan_filter_mask").val("");
		$("#wan_filter_mask").attr("disabled",false);
	}
	else if(ip_mode == "all"){
		$("#wan_host_sub_ip").removeClass("on").addClass("off");
		$("#dns_type_choose_layer").removeClass("on").addClass("off");
	}
	else if(ip_mode == "dns"){
		$("#wan_host_sub_ip").removeClass("on").addClass("off");
		$("#dns_type_choose_layer").removeClass("off").addClass("on");
		$("#dns_url_layer").removeClass("off").addClass("on");
		$("#dns_group_name_layer").removeClass("on").addClass("off");
	}
	else if(ip_mode == "dns_group"){
		$("#wan_host_sub_ip").removeClass("on").addClass("off");
		$("#dns_type_choose_layer").removeClass("off").addClass("on");
		$("#dns_group_name_layer").removeClass("off").addClass("on");
		$("#dns_url_layer").removeClass("on").addClass("off");
	}
	nos.app.resizePage();
}
//修改目的主机
function modify_wan_mode_change(obj){
	$("#wan_filter_ip").val("");
	$("#wan_filter_mask").val("");
	$("#dns_filter_url").val("");
	$("#dns_filter_group").get(0).selectedIndex = "0";
		var ip_mode = obj.wan_host_flag;
		select_chose_set("wan_host_flag",ip_mode);
		if(ip_mode=="host"){
			$("#wan_host_sub_ip").removeClass("off").addClass("on");
			$("#dns_type_choose_layer").removeClass("on").addClass("off");
			$("#wan_host_first").html('IP地址');
			$("#wan_host_second").html('子网掩码');
			$("#wan_filter_mask").val('255.255.255.255');
			$("#wan_filter_mask").attr("disabled",true);
			$("#wan_filter_ip").val(obj.wan_host_ip);
		}
		else if(ip_mode=="sub_host"){
			$("#wan_host_sub_ip").removeClass("off").addClass("on");
			$("#dns_type_choose_layer").removeClass("on").addClass("off");
			$("#wan_host_first").html('IP地址');
			$("#wan_host_second").html('子网掩码');
			$("#wan_filter_mask").val(obj.lan_host_mask);
			$("#wan_filter_mask").attr("disabled",false);
			$("#wan_filter_ip").val(obj.wan_host_ip);
		}
		else if(ip_mode=="ip_host"){
			$("#wan_host_sub_ip").removeClass("off").addClass("on");
			$("#dns_type_choose_layer").removeClass("on").addClass("off");
			$("#wan_host_first").html('起始IP地址');
			$("#wan_host_second").html('结束IP地址');
			$("#wan_filter_mask").val(obj.lan_host_mask);
			$("#wan_filter_mask").attr("disabled",false);
			$("#wan_filter_ip").val(obj.wan_host_ip);
		}
		else if(ip_mode == "all"){
			$("#wan_host_sub_ip").removeClass("on").addClass("off");
			$("#dns_type_choose_layer").removeClass("on").addClass("off");
		}
		else if(ip_mode == "dns"){
			$("#wan_host_sub_ip").removeClass("on").addClass("off");
			$("#dns_type_choose_layer").removeClass("off").addClass("on");
			$("#dns_url_layer").removeClass("off").addClass("on");
			$("#dns_group_name_layer").removeClass("on").addClass("off");
			$("#dns_filter_url").val(obj.dns_txt);
			$("#wan_host_flag").val();
		}
		else if(ip_mode == "dns_group"){
			$("#wan_host_sub_ip").removeClass("on").addClass("off");
			$("#dns_type_choose_layer").removeClass("off").addClass("on");
			$("#dns_group_name_layer").removeClass("off").addClass("on");
			$("#dns_url_layer").removeClass("on").addClass("off");
			//if($('#dns_filter_group option[value='+obj.dgid+']').length == 0){
			if($('#dns_filter_group option[value='+obj.grp_name+']').length == 0){
				if(current_html == "dns_filter"){
					alert("当前的DNS组不存在，已自动切换到DNS！");
					select_chose_set("wan_host_flag","dns");
					wan_mode_change("dns");
				}
				else{
					alert("当前的DNS组不存在，已自动切换到所有主机！");
					select_chose_set("wan_host_flag","all");
					wan_mode_change("all");
				}
			}
			else{
				//$("#dns_filter_group").val(obj.dgid);
				$("#dns_filter_group").val(obj.grp_name);
			}
			$("#wan_host_flag").val();
		}
}
//获取目的主机+用户组字符串
function get_wanhost_str(data){
	var wanhost_str = "";
	if("all" == data.wan_host_flag){
		wanhost_str = "ALL";
	}
	else if("host" == data.wan_host_flag){
		wanhost_str = data.wan_host_ip;
	}
	else if("sub_host" == data.wan_host_flag){
		wanhost_str = data.wan_host_ip+"<br>/" + data.wan_host_mask;
	}
	else if("ip_host" == data.wan_host_flag){
		wanhost_str = data.wan_host_ip+"<br>/" + data.wan_host_mask;
	}
	else if("dns" == data.wan_host_flag){
		wanhost_str = "DNS为：" + data.dns_txt;
	}
	else if("dns_group" == data.wan_host_flag){
		wanhost_str = "DNS组为：" + paint_dns_group(data);
	}
	else{
		wanhost_str = '';
	}
	return wanhost_str;
}
//目的主机+dns组校验
function check_dns_wan_ip_combine(){
	var ck_user_type = $("#wan_host_flag").val();
	if(ck_user_type != "dns" && ck_user_type != "dns_group"){
		if(!wan_mode_check()){
			return false;
		}
	}
	else{
		if(ck_user_type == "dns"){
			if(!get_msgbox("dns_filter_url","url")){
				return false;
			}	
		}
	}
	return true;
}
//目的主机校验
function wan_mode_check(){
	var flag = $("#wan_host_flag").val();
	if("host" == flag){
		if(!check_app_input("wan_host")){
			return false;
		}
	}
	else if("sub_host" == flag){
		if(!check_app_input("wan_sub_host")){
			return false;
		}
	}
	else if("ip_host" == flag){
		if(!check_app_input("wan_ip_host")){
			return false;
		}
		var return_val = host_ip_check("wan_filter_ip");
		if(return_val!=true){
			return false;
		}
	}
	return true;
}
//===========================目的主机 结束===========================

//===========================内网主机（源主机） 目的主机 共同函数===========================
//内网主机（源主机）/目的主机 起始IP大小校验
function host_ip_check(ctr){
	var ip1=$("#lan_filter_ip").val();
	var ip2=$("#lan_filter_mask").val();
	var return_val=check_start_end_ip(ip1,ip2);
	if(return_val!=true){
		var ctr_obj=document.getElementById(ctr);
		var point_xy=getPosition(ctr_obj);
		point_xy.x += ctr_obj.clientWidth+5;
		point_xy.y -= ctr_obj.clientHeight;
		var msgbox = new MessageBox(return_val,point_xy);
		msgbox.Show();
		return false;
	}
	return true;
}
//=====================================================================================


//=================================协议与端口===========================================

var port_proto_map = [];
	port_proto_map[0] = ["", "", "1"]; port_proto_map[1] = ["HTTP", "80", "1"];
	port_proto_map[2] = ["HTTPS", "443", "1"]; port_proto_map[3] = ["FTP", "21", "1"];
	port_proto_map[4] = ["POP3", "110", "1"]; port_proto_map[5] = ["SMTP", "25", "1"];
	port_proto_map[6] = ["DNS", "53", "2"]; port_proto_map[7] = ["TELNET", "23", "1"];
	port_proto_map[8] = ["IPSEC", "500", "2"]; port_proto_map[9] = ["PPTP", "1723", "1"];
	port_proto_map[10] = ["TERMINAL CLIENT", "3389", "1"]; port_proto_map[11] = ["GuruGuru", "9292", "1"];
	port_proto_map[12] = ["H323 VoIP Phone", "1720", "1"]; port_proto_map[13] = ["Soribada", "22321", "2"];
	port_proto_map[14] = ["", "", ""];

//绘制协议与端口
function paint_proto_port_dom(){
	$("#proto_port_wrap").html("");
	var str = '';
	str += '<div id="proto_port_layer">';
	str += '<dd id="out_port_layer">';
	str += '<label class="isneed" id="proto_name" for="proto"></label>';
	str += '<select id="proto" name="protocol" onchange="proto_user_sele(this.value);">';
	str += '</select>';
	str += '<span style="padding-left:5px"></span>';
	str += '<input id="dest_port_a" type="text" size="5" maxlength="5" disabled="disabled" />';
	str += '<span style="padding:0 5px">-</span>';
	str += '<input id="dest_port_b" type="text" size="5" maxlength="5" disabled="disabled" />';
	str += '<span style="padding-left:5px" id="proto_port_template_layer" class="off">';
	str += '<select id="protocol_sel" onChange="user_sele_protocol()">';
	str += '<option value="tcp" selected="true">请选择模板</option>';
	str += '<option value="tcp">HTTP</option>';
	str += '<option value="tcp">HTTPS</option>';
	str += '<option value="tcp">FTP</option>';
	str += '<option value="tcp">POP3</option>';
	str += '<option value="tcp">SMTP</option>';
	str += '<option value="udp">DNS</option>';
	str += '<option value="tcp">TELNET</option>';
	str += '<option value="udp">IPSEC</option>';
	str += '<option value="tcp">PPTP</option>';
	str += '<option value="tcp">Windows Terminal Client</option>';
	str += '<option value="tcp">GuruGuru</option>';
	str += '<option value="tcp">H323 VoIP Phone</option>';
	str += '<option value="udp">Soribada</option>';
	str += '</select>';
	str += '</span>';
	str += '</dd>';
	str += '<dd id="in_port_layer" class="off">';
	str += '<label for="src_port_a" id="src_port_label" class="isneed"></label>';
	str += '<input id="src_port_a" type="text" size="5" maxlength="5" />';
	str += '<span style="padding:0 5px">-</span>';
	str += '<input id="src_port_b" type="text" size="5" maxlength="5" />';
	str += '</dd>';
	str += '</div>';
	$("#proto_port_wrap").html(str);
}

//初始化协议与端口
//此函数接收一个参数,用于判断是哪个页面，需要以何种样式显示协议与端口
function init_user_sele_protocol(page_name){
	$("#proto").empty("");
	if(page_name != "virtual")
		$("#proto").append("<option value=\"all\" selected=\"selected\">ALL</option>");
	$("#proto").append("<option value=\"tcp\">TCP</option>");
	$("#proto").append("<option value=\"udp\">UDP</option>");
	if(page_name == "access_control" || page_name == "qos_speed" || page_name == "qos_filter"){//访问控制 主机带宽控制 应用优先级
		$("#proto_name").html("协议及端口");
		$("#src_port_label").html("内部端口");
		$("#proto").append("<option value=\"tcp+udp\">TCP+UDP</option>");
		$("#proto").append("<option value=\"icmp\">ICMP</option>");
		$("#dest_port_a").attr("name","start_port");
		$("#dest_port_b").attr("name","end_port");
		$("#src_port_a").attr("name","");
		$("#src_port_b").attr("name","");
	}
	else if(page_name == "policy_routing"){//策略路由
		$("#proto_name").html("协议及目的端口");
		$("#src_port_label").html("源端口");
		$("#in_port_layer").removeClass("off").addClass("on");
		$("#proto").append("<option value=\"tcp+udp\">TCP+UDP</option>");
		$("#proto").append("<option value=\"icmp\">ICMP</option>");
		$("#dest_port_a").attr("name","start_port");
		$("#dest_port_b").attr("name","end_port");
		$("#src_port_a").attr("name","src_start_port");
		$("#src_port_b").attr("name","src_end_port");
		$("#src_port_a").val("1");
		$("#src_port_b").val("65535");
	}
	else if(page_name == "virtual"){//虚拟服务
		$("#proto_name").html("外部端口");
		$("#src_port_label").html("内部端口");
		$("#proto").append("<option value=\"tcp+udp\">TCP+UDP</option>");
		$("#dest_port_a").attr("disabled",false);
		$("#dest_port_b").attr("disabled",false);
		$("#in_port_layer").removeClass("off").addClass("on");
		$("#dest_port_a").attr("name","out_start_port");
		$("#dest_port_b").attr("name","out_end_port");
		$("#src_port_a").attr("name","in_start_port");
		$("#src_port_b").attr("name","in_end_port");
		$("#dest_port_a").val("1");
		$("#dest_port_b").val("65535");
		$("#src_port_a").val("1");
		$("#src_port_b").val("65535");
	}
	else if(page_name == "capture"){//抓包
		$("#proto_name").html("协议及端口");
		$("#src_port_label").html("内部端口");
		$("#proto").append("<option value=\"tcp+udp\">TCP+UDP</option>");
		$("#proto").append("<option value=\"icmp\">ICMP</option>");
		$("#proto").append("<option value=\"arp\">ARP</option>");
		$("#dest_port_a").attr("name","start_port");
		$("#dest_port_b").attr("name","end_port");
		$("#src_port_a").attr("name","");
		$("#src_port_b").attr("name","");
	}
	$("#proto").append("<option value=\"template\">选择模版</option>");
}

//模版事件函数
function user_sele_protocol(){
	var i = $("#protocol_sel").get(0).selectedIndex;
	$("#dest_port_a").val(port_proto_map[i][1]);
	if(current_html != "policy_routing"){
		$("#src_port_a").val(port_proto_map[i][1]);
	}
	$("#proto").get(0).selectedIndex = port_proto_map[i][2];
	$("#dest_port_b").val('');
	$("#dest_port_a").attr("disabled",false);
	$("#dest_port_b").attr("disabled",false);
	if(current_html != "policy_routing"){
		$("#src_port_a").attr("disabled",false);
		$("#src_port_b").attr("disabled",false);
	}
}
//协议事件函数
function proto_user_sele(strvalue){
    if(strvalue == 'all' || strvalue == 'icmp'|| strvalue == 'arp'){
		$("#proto_port_template_layer").addClass("off");
		$("#dest_port_a").attr("value","");
		$("#dest_port_b").attr("value","");
		$("#dest_port_a").attr("disabled",true);
		$("#dest_port_b").attr("disabled",true);
		if(current_html != "policy_routing"){
			$("#src_port_a").attr("value","");
			$("#src_port_b").attr("value","");
			$("#src_port_a").attr("disabled",true);
			$("#src_port_b").attr("disabled",true);
		}
    }
    else if(strvalue == 'tcp' || strvalue == 'udp' || strvalue == 'tcp+udp'){
		$("#proto_port_template_layer").addClass("off");
		$("#dest_port_a").attr("disabled",false);
		$("#dest_port_b").attr("disabled",false);
		$("#dest_port_a").attr("value","1");
		$("#dest_port_b").attr("value","65535");
		if(current_html != "policy_routing"){
			$("#src_port_a").attr("disabled",false);
			$("#src_port_b").attr("disabled",false);
			$("#src_port_a").attr("value","1");
			$("#src_port_b").attr("value","65535");
		}
    }
	else if(strvalue == 'template'){
		$("#proto_port_template_layer").removeClass("off");
		if($("#proto option[value = 'all']").length != 0){
			$("#proto").val("all");
			$("#dest_port_a").attr("disabled",true);
			$("#dest_port_b").attr("disabled",true);
			if(current_html != "policy_routing"){
				$("#src_port_a").attr("disabled",true);
				$("#src_port_b").attr("disabled",true);
			}
		}
		else{
			$("#proto").val("tcp");
		}
		$("#dest_port_a").attr("value","");
		$("#dest_port_b").attr("value","");
		if(current_html != "policy_routing"){
			$("#src_port_a").attr("value","");
			$("#src_port_b").attr("value","");
		}
	}
}
//修改协议于端口
function change_proto_user_sele(obj){
	select_chose_set("proto",obj.protocol);
	proto_user_sele(obj.protocol);
	if(current_html != "virtual"){
		$("#dest_port_a").val(obj.start_port);
		$("#dest_port_b").val(obj.end_port);
		$("#src_port_a").val(obj.src_start_port);
		$("#src_port_b").val(obj.src_end_port);
	}
	else{
		$("#dest_port_a").val(obj.out_start_port);
		$("#dest_port_b").val(obj.out_end_port);
		$("#src_port_a").val(obj.in_start_port);
		$("#src_port_b").val(obj.in_end_port);
	}
}

//获取协议与端口字符串
function get_proto_port_str(data){
	var proto_port_str = "";
	if('ALL' == data.protocol || "ICMP" == data.protocol){
			proto_port_str = data.protocol;
		}
	else{
		if(data.start_port != data.end_port){
			proto_port_str = data.protocol +':'+ data.start_port + "-" + data.end_port;
		}
		else{
			var proto_str = get_filter_modal_by_port(data.start_port);
			if("" != proto_str){
				proto_port_str = data.protocol+':'+proto_str;
			}
			else{
				proto_port_str = data.protocol+':'+data.start_port;
			}
		}
	}
	return proto_port_str;
}
function get_filter_modal_by_port(port){
	var str = "";
	for(var i=0;i<port_proto_map.length;i++) {
		if(port == port_proto_map[i][1]){
			str = port_proto_map[i][0];
		}
	}
	return str;
}
//协议于端口校验函数
function check_proto_sele(){
	var flag = $("#proto").val();
	var porta=$("#dest_port_a").val();
	var portb=$("#dest_port_b").val();
	if("all" != flag && "icmp" != flag){
		if(!check_app_input("port_a")){
			return false;
		}
		if("" != portb){
			if(!check_app_input("port_b")){
				return false;
			}
			var return_val=check_start_end_port(porta,portb);
			if(return_val!=true){
				var ctr_obj=document.getElementById("dest_port_a");
				var point_xy=getPosition(ctr_obj);
				point_xy.x += ctr_obj.clientWidth+5;
				point_xy.y -= ctr_obj.clientHeight;
				var msgbox = new MessageBox(return_val,point_xy);
				msgbox.Show();
				return false;
			}
		}
	}
	return true;
}

