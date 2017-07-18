var T_timer;
function Table(id,head,data,options){
	if($("#config_page").length != 0){
		this.elem = $("#config_page").get(0).contentWindow.$("#" + id);
	}
	else
		this.elem = $("#" + id);
	this.head = head;
	this.data = data;
	var defaults = {//
		size:10,//每页条目数量
		index:1,//当前页码
		auto_index:false,//自动编号，用于排序时候序列号依旧从1
		radio: false,
    	checkbox: false,
		sortable:false,
		info:"",//表格为空的时候，表格内部显示的提示信息
		sortOptions:{}
	};
	this.options = $.extend(defaults,options);
}

Table.prototype.initTable = function(){
	this.elem.html("");
	this.initHead();
	this.initBody();
	this.initFooter();
}

Table.prototype.initHead = function(){
	var _this = this;
/*	//表格内容优先级最高，如果表格内容为空，那么表头表尾都不显示
	if(!_this.data.length)
		return;*/
	//临时改成，如果内容为空，则显示表头 + 当前暂无任何内容
    var curTabFooter = this.elem.find(".TabHeader");
    if(curTabFooter.length > 0){
        curTabFooter.remove();
    }
	this.$header = $("<thead/>");
	this.$header.addClass("TabHeader");
	this.elem.append(this.$header);

	if (!this.$header.find('tr').length) {
		this.$header.append('<tr/>');
	}
	$.each(this.head,function(k,v){
		var $th = $("<th/>");
		$th.html(v);
		$th.addClass("th_" + k);
		if(_this.options.sortable == true && _this.options.sortOptions.length != 0){
			if(_this.options.sortOptions[k].sortEvent != "" && _this.options.sortOptions[k].sortEvent != undefined){
				$th.addClass("sortable");
				$th.addClass(_this.options.sortOptions[k].sortOrder);
				$th.unbind("click").bind("click",function(){
					var index = $(this).index();//获取当前索引值，找到对应的callback
					_this.onSort(this,_this.options.sortOptions[index].sortEvent);
				});
			}
		}
		_this.$header.find("tr").append($th);
	});
}

Table.prototype.initBody = function(){
	var _this = this;
    var curTabFooter = this.elem.find(".TabBody");
    if(curTabFooter.length > 0){
        curTabFooter.remove();
    }
	this.$body = $("<tbody/>");
	this.$body.addClass("TabBody");
	this.elem.append(this.$body);
	
	var data = this.getData();
	//暂无任何内容
	var info = this.options.info ? this.options.info : window.top.L.item_null;
	if(data.length == 0){
		_this.$body.eq(0).html("<tr><td colspan=\""+ this.head.length +"\"><p style=\"padding:15px 0;\">"+ info +"</p></td></tr>");
	}
	$.each(data,function(row,row_val){
		var data_row = $("<tr/>");
		if(row % 2 != 0){
			data_row.addClass("evenrow");
		}
		var index = 0;
		$.each(row_val,function(cell,cell_val){
			var data_cell = $("<td/>");
			if(index == 0){ 
				if(_this.options.auto_index == true)
					data_cell.html((_this.options.index-1) * _this.options.size + (row + 1));
				else
					data_cell.html(cell_val);
			}
			else
				data_cell.html(cell_val);
			index++;
			data_row.append(data_cell);
		});
		_this.$body.eq(0).append(data_row);
	});
	//iframe自己适应高度
	if($("#config_page").length != 0){
		if(T_timer)
			window.clearTimeout(T_timer);
		T_timer = window.setTimeout(function(){
			$("#config_page").get(0).contentWindow.nos.app.resizePage();		   
		},20);
		
	}
}

Table.prototype.initFooter = function(){
	//构造tfoot时候同时构造分页
	var _this = this;
	//总条目数小于等于每页显示的数量
	if(!_this.data.length || _this.data.length <= this.options.size)
		return;
	var curTabFooter = this.elem.find(".TabFooter");
	if(curTabFooter.length > 0){
        curTabFooter.remove();
	}
	this.$footer = $("<tbody/>");
	this.$footer.addClass("TabFooter");
	this.elem.append(this.$footer);
	if(!this.$footer.find('tr').length) {
		var $tr = $("<tr/>");
		var $td = $("<td/>");
		$td.attr({
			"class":"paging",
			"colspan":_this.head.length
		});
		$tr.append($td);
		this.$footer.append($tr);
		//iframe自己适应高度
		if($("#config_page").length != 0){
			if(T_timer)
				window.clearTimeout(T_timer);
			T_timer = window.setTimeout(function(){
				$("#config_page").get(0).contentWindow.nos.app.resizePage();		   
			},20);
		}
		this.pagenation($td);
	}
}

Table.prototype.pagenation = function(obj){
	var _this = this;
    var allNum = Math.ceil(this.data.length / this.options.size);
	if(allNum < 2)
		return;
    var nowNum = this.options.index;

    //上一页
	var oA = $("<a/>");
	if(nowNum >= 2)
		oA.attr("href", "#" + (nowNum - 1));
	else
		oA.attr("href", "javascript:void(0);");
	oA.html("&lt;");
	obj.append(oA);

    //显示格式
    if (allNum <= this.options.size) {
        for (var i = 1; i <= allNum; i++) {
            var oA = $("<a/>");
            oA.attr("href", "#" + i);
            if (nowNum == i) {
                oA.attr("class", "current");
            }
            oA.html(i);
            obj.append(oA);
        }
    }
    else {
        //每页都只显示步长那么多条,最后一页可能不满步长
        var tmp_len = allNum - nowNum + Math.floor((this.options.size - 1) / 2) + 1, len = 0;
        if (tmp_len < this.options.size)
            len = tmp_len;
        else
            len = this.options.size;
        for (var i = 0; i < len; i++) {
            if (nowNum >= this.options.size) {
                var oA = $("<a/>");
                var cur_num = nowNum - Math.floor((this.options.size - 1) / 2) + i;
                oA.attr("href", "#" + cur_num);

                if (cur_num == nowNum) {
                    oA.html(nowNum);
                    oA.attr("class", "current");
                }
                else {
                    oA.html(cur_num);
                }
                obj.append(oA);
            }

            else {
                for (var i = 1; i <= this.options.size; i++) {
                    var oA = $("<a/>");
                    oA.attr("href", "#" + i);
                    if (nowNum == i) {
                        oA.attr("class", "current");
                    }
                    oA.html(i);
                    obj.append(oA);
                }
            }
        }
    }

    //下一页
	var oA = $("<a/>");
	if((allNum - nowNum) >= 1)
		oA.attr("href", "#" + (nowNum + 1));
	else
		oA.attr("href", "javascript:void(0);");
	oA.html("&gt;");
	obj.append(oA);


    var page_a = obj.find('a');
    page_a.unbind("click").bind("click", function () {
        var nowNum = parseInt($(this).attr('href').substring(1));
		if(isNaN(nowNum))
			return;
        _this.options.index = nowNum;
        _this.initBody();
		_this.initFooter();
        return false;
    });
}

Table.prototype.getData = function(){
	var data = this.data;
	var pageSize = this.options.size;
	var pageIndex = this.options.index;
	var arr = [];
	for (var i = pageSize * (pageIndex - 1); i < pageSize * pageIndex; i++) {
        if (i < data.length)
            arr.push(data[i]);
    }
    return arr;
}

Table.prototype.onSort = function(obj,fun){
	var _this = this;
	_this.data.sort(eval("("+ fun + ")"));
	var s_class = $(obj).attr("class");
	var change_order = "";
	if(s_class.indexOf("desc") != -1){
		change_order = "asc";
	}
	else{
		_this.data.reverse();
		change_order = "desc";
	}
	_this.options.index = 1;
	//复位其他表头
	$.each(_this.$header.find("th"),function(i){
		var s_class = _this.resetSortClass(this);
		if($(this).attr("class").indexOf("sortable") > -1){
			$(this).removeClass().addClass(s_class + " none");
			
		}
	});
	var default_class = _this.resetSortClass(obj);
	$(obj).removeClass("").attr("class",default_class + " " + change_order);
	
	_this.initBody();
	_this.initFooter();

}

Table.prototype.resetSortClass = function(obj){
	var tmp_class = $(obj).attr("class").replace("asc","").replace("desc","").replace("none","").trim();
	return tmp_class;
}

function Array_str_compare_time(a,b){
	return time_compare(a.time,b.time);
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

function Array_str_compare_event(a,b){
	return str_compare(a["msg"],b["msg"]);
}

function str_compare(str1,str2){
	if(str1 < str2)
		return -1;
	else if(str1 == str2)
		return 0;
	else
		return 1;
}


Table.prototype.onSearch = function(){}