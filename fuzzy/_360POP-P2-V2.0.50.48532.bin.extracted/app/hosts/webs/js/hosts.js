//页面初始化函数
var appHtml=appL.hosts.js;
$(document).ready(function(){
	init_app_language(appL.hosts);
	init_host();
});

(function(){
	var me;
	var host = {
		path:"/app/hosts/webs",
		DEFAULT_LINE_LEN:1,
		ONE_PAGE_LEN:15,
		MAX_LINE_LEN:1000,
		total_line_len:0,
		line_str:"",
		offset:20,
		cursor_postion:0,
		scroll_time:200,
		scroll_timer:null,
		sleep_timer:null,
		check_timer:null,//初始化数据计时器
		jump_top:null,//跳转至首行延时器
		fin_flag:null,//用来标识初始化是不是触发了滚动事件，触发则为tru
		err_index:[],
		hide_pop:function(){
			window.top.hide_pop_layer("message_layer");
			window.top.hide_pop_layer("lock_div");
		},
		bind_ctrl_event:function(){
			var _this = this;
			$("#host").attr("wrap", "off").css({
				"overflow-x":"scroll",
				"overflow-y":"auto"
			}).off("scroll keydown paste click").on("scroll keydown paste click", function(e){
				if(e.type == "scroll" || e.type == "keydown" || e.type == "paste"){
					me.host_line_count(e);
				}
				me.hide_error_tip();
			});
			$("#host_set_frm").off("submit").on("submit",function(){
				host.host_submit();
				return false;
			});
			$("#ck_host").off("click").on("click",function(){
				var _this = this;
				me.hide_error_tip();
				if($("#host").val() == "")
					return;
				if($(_this).prop("checked")>>>0){
					show_dialog(appHtml.auto_delete,function(){
						show_message("wait",appCommonJS.controlMessage.s_wait);
						me.host_submit_check();
						window.clearInterval(me.check_timer);
						me.hide_pop();
					},function(){
						$(_this).prop("checked",false);
						parentEmt.hide_dialog();
					});
				}
			});
			$("#clear_btn").off("click").on("click",function(){
				$("#host").val("").focus();
				me.hide_error_tip();
				show_message("save");
				nos.app.net('./delhosts.cgi','hosts='+$("#host").val(),function(result){
					if(result=="SUCCESS"){
						show_message("success",appCommonJS.controlMessage.s_suc);
					}else{
						show_message("error",igd.make_err_msg(result));
					}
					me.host_init(false);
				});
			});
			$("#error_tip").off("click").on("click",function(){
				me.hide_error_tip();
				var obj = $("#host").get(0);
				$("#host").caret(me.cursor_postion);
			});
		},
		unique:function(arr) {
			var result = [], hash = {};
			for (var i = 0, elem; (elem = arr[i]) != null; i++) {
				if (!hash[elem]) {
					result.push(elem);
					hash[elem] = true;
				}
			}
			return result;
		},
		//一个字符串在另一个字符串中出现次数,isIgnore是否忽略大小写
		count_sub_str:function(str,substr,isIgnore){
			var count;
			var reg="";
			if(isIgnore==true){
				reg="/"+substr+"/gi"; 
			}
			else{
				reg="/"+substr+"/g";
			}
			reg=eval(reg);
			if(str.match(reg)==null){
				count=0;
			}
			else{
				count=str.match(reg).length;
			}
			return count;
		},
		get_cursor_pos:function(str,substr,index,arr){
			var pos = 0;
			var count = me.count_sub_str(str,substr,false);
			if(count > 1){
				if(arr)
					pos = me.get_cursor_pos(str,decodeURIComponent(arr[index-1]));
				else
					pos = 0;
			}
			else{
				pos = str.indexOf(decodeURIComponent(substr));
			}
			return pos;
		},
		fill_host_line:function(len){
			me.line_str = "";
			for(me.total_line_len = 1; me.total_line_len <= len; me.total_line_len++){
				me.line_str += me.total_line_len +"    \n";
			}
			$("#host_lineshow").val(me.line_str);
			
		},
		cut_off_host:function(){
			var trimmedtext = encodeURIComponent($("#host").val());
			var arr = trimmedtext.split("%0A");
			if(arr.length >= me.MAX_LINE_LEN){
				var str = "";
				for(var i = 0; i < me.MAX_LINE_LEN; i++){
					str += arr[i] + "%0A";
				}
				str = decodeURIComponent(str.substring(0,str.length-3));
				$("#host").val(str);
			}
			return arr.length;
		},
		refill_host:function(index,arr){
			var str = "";
			var len  = arr.length;
			for(var i = 0; i < len; i++){
				if(index[i] != undefined){
					delete arr[index[i]-1]
				}
			}
			for(var i = 0; i < arr.length; i++){
				if(arr[i] != undefined)
					str += arr[i] + "%0A";
			}
			str = decodeURIComponent(str.substring(0,str.length-3));
			var elem = $("#host");
			elem.val(str);
			elem.scrollTop(elem.get(0).scrollHeight);
			return str;
		},
		host_line_count:function(e){
			var me = this;
			if($("#host").val() == "" && e.type == "scroll")//当触发滚动条并且内容为空的时候，说明用户一直在输入回车键
				return;
			if(e.type == "scroll"){
				me.cut_off_host();
				if(me.sleep_timer)
					window.clearInterval(me.sleep_timer);
				me.sleep_timer = window.setInterval(function(){
					if($("#host_lineshow").scrollTop() != $("#host").scrollTop()){
						if(window.top.$("#message_layer").css("display") == "none" && $("#host_lineshow").scrollTop() != $("#host").scrollTop() &&  $("#host").scrollTop()-$("#host_lineshow").scrollTop() > me.ONE_PAGE_LEN*me.offset && !me.fin_flag)
							show_message("wait",appCommonJS.controlMessage.s_wait);
						me.host_line_count_loop(e);
					}
					else{
						me.fin_flag = true;
						window.clearInterval(me.sleep_timer);
						me.hide_pop();
					}
				},1);
			}
			else{
				if(e.type == "keydown" && e.keyCode*1 != 13){
					return;
				}
				if(me.sleep_timer)
					window.clearInterval(me.sleep_timer);
				me.sleep_timer = window.setInterval(function(){
					var len = me.cut_off_host();
					if(e.type == "keypress"){
						if(me.total_line_len == len)
							me.fill_count();
						else{
							for(var i = 1; i <= (me.total_line_len - len); i++)
								me.fill_count();
						}
					}
					else{
						for(var i = 1; i < len; i++)
							me.fill_count();
					}
					me.fin_flag = true;
					window.clearInterval(me.sleep_timer);
				},me.scroll_time);
			}
		},
		host_line_count_loop:function(e){//this function use to slow down do-while loop
			if(e.type == "keydown"){
				//支持的快捷键包括ctrl+A ctrl+C ctrl+V 
				if(e.ctrlKey && (e.keyCode * 1 != 17 || e.keyCode * 1 != 65 || e.keyCode*1 != 86 || e.keyCode*1 != 67))
					return;
				if (e.shiftKey && e.keyCode != "")
					return;
				else if(!e.ctrlKey && !e.shiftKey && e.keyCode != 13)
					return;
			}
			this.fill_count();
		},
		fill_count:function(){
			var me = this;
			me.line_str += (me.total_line_len++) + "    \n";
			$("#host_lineshow").val(me.line_str);
			$("#host_lineshow").scrollTop($("#host").scrollTop());
			me.fin_flag = false;
		},
		host_init:function(flag){
			var _this = this;
			me.fin_flag = null;
			nos.app.net('./gethosts.cgi','noneed=noneed',function(data){
				var elem = $("#host");
				elem.focus();
				var str = decodeURIComponent(data.hosts);
				//判断行数显示行号
				if(str != ""){
					var arr = str.split("\n");
					me.fill_host_line(arr.length);
					elem.val(str);
					elem.scrollTop(elem.get(0).scrollHeight);
				}
				else{
					me.fill_host_line(me.DEFAULT_LINE_LEN);
					elem.val("");
				}
				//赋值完后又跳回第一行
				if(flag == undefined && str != ""){
					show_message("wait",appHtml.init_data);
					if(me.check_timer)
						window.clearInterval(me.check_timer);
					me.check_timer = window.setInterval(function(){
						if(me.fin_flag || me.fin_flag == null){
							window.clearInterval(me.check_timer);
							if(me.fin_flag == null){
								me.hide_pop();
							}
							if(me.jump_top)
								window.clearTimeout(me.jump_top);
							me.jump_top = window.setTimeout(function(){
								elem.scrollTop(0);
							},200);
						}	
					},100)
				}
			});
		},
		hide_error_tip:function(){
			var _status = $("#error_tip").css("display");
			if( _status == "block" || _status == ""){
				$("#error_tip").css("display","none");
				$("#error_msg").html("");
			}
		},
		show_error_tip:function(index,msg){
			$("#host").scrollTop(0);
			var tip = $("#error_tip");
			tip.css({top:'0px'});
			if(index <= me.ONE_PAGE_LEN){
				if(me.scroll_timer)
					window.clearTimeout(me.scroll_timer);
				me.scroll_timer = window.setTimeout(function(){
					tip.css("display","block");
					$("#error_msg").html(appHtml.index + index + appHtml.line + "<br/>" + msg);
					var pos = (index-1) * me.offset;
					tip.stop(true,true).animate({
						top: pos +"px"
					},200);
					$("#error_msg").css("top",pos +"px");
				},me.scroll_time);
			}
			else{//超过一屏的条件
				//定位滚动条
				$("#host").scrollTop((index-me.ONE_PAGE_LEN + 1) * me.offset);
				if(me.scroll_timer)
					window.clearTimeout(me.scroll_timer);
				me.scroll_timer = window.setTimeout(function(){
					tip.css("display","block");
					$("#error_msg").html(appHtml.index + index + appHtml.line + "<br/>" + msg);
					tip.stop(true,true).animate({
						top:(me.ONE_PAGE_LEN-2) * me.offset +"px"
					},200);
					$("#error_msg").css("top",(me.ONE_PAGE_LEN-2) * me.offset +"px");
				},me.scroll_time);
			}
		},
		host_submit_check:function(){
			me.cursor_postion = 0;
			me.err_index = [];
			me.fomat_arr = [];
			var src_val = $("#host").val();
			var _val = encodeURIComponent(src_val).replace(/%09/g,"%20");
			//拆分回车换行
			var arr = _val.split("%0A");
			me.fomat_arr = arr;
			var index = 0;
			for(var i in arr){
				index++;
				//特殊字符的校验（特别是针对注释中的特殊字符）
				if(arr[i] != ""){
					var ret = parentEmt.check_string(decodeURIComponent(arr[i]));
					if(ret != true){
						me.cursor_postion = me.get_cursor_pos(src_val,arr[i],index,arr);
						if($("#ck_host").prop("checked")){
							me.err_index.push(index);
						}
						else{
							me.show_error_tip(index,ret);
							return false;
						}
					}
				}
				var str_obj = {};
				str_obj.value = decodeURIComponent(arr[i]);
				str_obj.maxLength = 255;
				var ret = parentEmt.CheckLength(str_obj);
				if(typeof ret == "string"){
					if($("#ck_host").prop("checked")){
						me.err_index.push(index);
						continue;
					}
					else{
						me.show_error_tip(index,appHtml.max_letter_err);
						return false;
					}
				}
				if(arr[i].substring(0,3) == "%23"){//注释在开头
					/*if($("#ck_host").prop("checked")){
						me.err_index.push(index);
						continue;
					}*/
					continue;
				}
				if(arr[i].substring(0,3) == "%20"){//空格在开头
					if($("#ck_host").prop("checked")){
						me.err_index.push(index);
						continue;
					}
					else{
						me.show_error_tip(index,appHtml.host_format_err);
						return false;
					}
				}
				else if(arr[i] == ""){//为空
					/*if($("#ck_host").prop("checked")){
						me.err_index.push(index);
						continue;
					}*/
					continue;
				}
				else{
					//先找下看改行有没有#，找到#号,丢弃#号后的所有字符
					var str = "";
					if(arr[i].indexOf("%23") != -1){
						str = arr[i].substring(0,arr[i].indexOf("%23"));
					}
					else
						str = arr[i];
					var segments = str.split("%20");
					for(var i = 0 ;i<segments.length;i++){
						if(segments[i] == "" || typeof(segments[i]) == "undefined"){
							segments.splice(i,1);
							i= i-1;
						}
					}
					if(segments.length != 2){//"第" + index + "行,段数不正确;
						if(segments.length <= 1){
							me.cursor_postion = me.get_cursor_pos(src_val,segments[0],index,arr);
						}
						else{
							me.cursor_postion = me.get_cursor_pos(src_val,segments[1],index,arr);//segments[2]
						}
						if($("#ck_host").prop("checked")){
							me.err_index.push(index);
							continue;
						}
						else{
							me.show_error_tip(index,appHtml.host_format_err);
							return false;
						}
					}
					//检查网址正确性
					if(decodeURIComponent(segments[1]).length > 63){
						me.cursor_postion = me.get_cursor_pos(src_val,segments[1],index,arr);
						if($("#ck_host").prop("checked")){
							me.err_index.push(index);
							continue;
						}
						else{
							me.show_error_tip(index,appHtml.url_max_len_err);
							return false;	
						}
					}
					else{
						var url_seg = segments[1].split(".");
						if(url_seg.length == 1 || url_seg.length > 5){
							me.cursor_postion = me.get_cursor_pos(src_val,segments[1],index,arr);
							if($("#ck_host").prop("checked")){
								me.err_index.push(index);
								continue;
							}
							else{
								if(url_seg.length == 1)
									me.show_error_tip(index,appHtml.url_segments_eq1_err);
								else
									me.show_error_tip(index,appHtml.url_segments_eq5_err);
								return false;	
							}
						}
						else{
							var ret = parentEmt.check_url(decodeURIComponent(segments[1]));
							if(ret != true){
								me.cursor_postion = me.get_cursor_pos(src_val,segments[1],index,arr);
								if($("#ck_host").prop("checked")){
									me.err_index.push(index);
									continue;
								}
								else{
									me.show_error_tip(index,appHtml.url_segments_err);
									return false;	
								}
							}
							for(var j in url_seg){
								if(decodeURIComponent(url_seg[j]).length > 63){
									me.cursor_postion = me.get_cursor_pos(src_val,segments[1],index,arr);
									if($("#ck_host").prop("checked")){
										me.err_index.push(index);
										continue;
									}
									else{
										me.show_error_tip(index,appHtml.url_single_len_err);
										return false;	
									}
								}
							}
						}
					}
					//检查IP
					var ip_ret = parentEmt.check_ip_come(decodeURIComponent(segments[0]),null,null,null,true);
					if(ip_ret != true){
						me.cursor_postion = me.get_cursor_pos(src_val,segments[0],index,arr);
						if($("#ck_host").prop("checked")){
							me.err_index.push(index);
							continue;
						}
						else{
							me.show_error_tip(index, ip_ret);
							return false;	
						}
					}
				}
			}
			if(arr.length > me.MAX_LINE_LEN){
				if($("#ck_host").prop("checked")){
					me.err_index.push(index);
				}
				else{
					show_message("error",appHtml.max_len_err);
					return false;	
				}
			}
			me.err_index = me.unique(me.err_index);
			if($("#ck_host").prop("checked")){
				_val = encodeURIComponent(me.refill_host(me.err_index,arr));
			}
			if(_val == ""){
				return true;
			}
			return _val;
		},
		host_submit:function(){
			var ret = me.host_submit_check();
			if(ret == false)
				return;
			else if(ret == true){
				ret = "NULL";
			}
			show_message("save");
			nos.app.net('./sethosts.cgi','hosts='+ret,function(result){
				if(result=="SUCCESS"){
					show_message("success",appCommonJS.controlMessage.s_suc);
				}else{
					show_message("error",igd.make_err_msg(result));
				}
				me.host_init(false);
			});
		},
		init:function(flag){
			me = this;
			me.bind_ctrl_event();      
			me.host_init(flag);
			//$("#words").html(appHtml.max_input + this.MAX_WORDS + appHtml.single + appHtml.word + "，" + appHtml.has_input + "<span>0</span>" + appHtml.single);
		}
	};
	
	var init_host = function(){
		host.init();
	};
	
	window.init_host = init_host;
})();

