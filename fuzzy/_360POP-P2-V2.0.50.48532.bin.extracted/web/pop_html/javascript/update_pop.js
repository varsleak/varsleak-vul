var nos_update_msg = {
	path:"http://cloud.netcoretec.com:3333/",
	login_page_name:"pop_html/insert_login",
	listener_timer:null,
	WIDTH:415,//容器宽度
	HEIGHT:285,
	auto_fade_time:60*1000,
	gw:null,
	ver:null,
	model:null,
	type:null,
	//获取服务器返回状态码
	getHttpStatus:function(){
		var x = window.XMLHttpRequest?new window.XMLHttpRequest():new ActiveXObject( "Microsoft.XMLHTTP") 
		var str = window.location.href;
		str = str.toString();
		x.open("GET",str,false); 
		x.setRequestHeader('If-Modified-Since', '0'); 
		x.send();
		return x.status;
	},
	init_param:function(){
		var arr = document.getElementsByTagName("script");
		var location_argc = arr[arr.length-1].getAttribute("src").split("?")[1];
		
		var location_arr = location_argc.split("&");
		for(var i =0; i < location_arr.length; i++){
			if(location_arr[i].indexOf("gw") != -1)
				this.gw = location_arr[i].split("=")[1];
			if(location_arr[i].indexOf("ver") != -1)
				this.ver = location_arr[i].split("=")[1];
			if(location_arr[i].indexOf("model") != -1)
				this.model = location_arr[i].split("=")[1];
			if(location_arr[i].indexOf("type") != -1)
				this.type = location_arr[i].split("=")[1];
		}
	},
	getViewport:function() {
		var viewPortWidth;
		var viewPortHeight;
		
		// the more standards compliant browsers (mozilla/netscape/opera/IE7) use window.innerWidth and window.innerHeight
		if (typeof window.innerWidth != 'undefined') {
		viewPortWidth = window.innerWidth,
		viewPortHeight = window.innerHeight
		}
		
		// IE6 in standards compliant mode (i.e. with a valid doctype as the first line in the document)
		else if (typeof document.documentElement != 'undefined'
		&& typeof document.documentElement.clientWidth !=
		'undefined' && document.documentElement.clientWidth != 0) {
		viewPortWidth = document.documentElement.clientWidth,
		viewPortHeight = document.documentElement.clientHeight
		}
		
		// older versions of IE
		else {
		viewPortWidth = document.getElementsByTagName('body')[0].clientWidth,
		viewPortHeight = document.getElementsByTagName('body')[0].clientHeight
		}
		return [viewPortWidth, viewPortHeight];
	},
	create_topbar:function(){
		var arr = this.getViewport();
		var _div = document.createElement("div");
		//获取屏幕的宽度
		if(arr[0] >= 414)
			_div.style.height = "50px";
		else{
			_div.style.height = "100px";
			_div.style.textAlign = "center";
		}
		if(this.browser_detect() == "MSIE 6")
			_div.style.position = "absolute";
		else
			_div.style.position = "fixed";
		_div.style.zIndex = "9999";
		_div.style.left = "0";
		_div.style.top = "0";
		if(this.browser_detect().indexOf("MSIE") != -1)
			_div.style.filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr=#A5000000,endColorstr=#A5000000)";
		else
			_div.style.background = "rgba(0,0,0,0.65)";
		
		_div.style.width = "100%";
		_div.setAttribute("id","nos_topbar");
		
		var _div_wrap = document.createElement("div");
		if(arr[0] >= 1004)
			_div_wrap.style.width = "1004px";
		else if(arr[0] < 1004 && arr[0] > 414)
			_div_wrap.style.width = arr[0] + "px";
		else
			_div_wrap.style.width = (arr[0]-20) + "px";
		_div_wrap.style.margin = "0 auto";
		_div_wrap.style.position = "relative";
		
		var _span = document.createElement("span");
		_span.style.color = "#FFF";
		_span.style.fontSize = "16px";
		_span.style.lineHeight = "50px";
		_span.style.fontFamily = "微软雅黑";
		_span.innerHTML = "发现360安全路由最新版本";
		
		var _update_btn,_ignore_btn;
		_ignore_btn = document.createElement("input");
		_update_btn = document.createElement("input");
		_update_btn.setAttribute("type","button");
		_ignore_btn.setAttribute("type","button");
		_update_btn.value = "升级";
		_ignore_btn.value = "暂不升级";
		
		_update_btn.style.border = _ignore_btn.style.border = "1px solid #fff";
		_update_btn.style.background = _ignore_btn.style.background = "none";
		_update_btn.style.color = _ignore_btn.style.color = "#fff";
		_update_btn.style.fontFamily  = _ignore_btn.style.fontFamily = "微软雅黑";
		_update_btn.style.width = _ignore_btn.style.width = "85px";
		_update_btn.style.height = _ignore_btn.style.height = "27px";
		_update_btn.style.fontSize = _ignore_btn.style.fontSize = "14px";
		_update_btn.style.verticalAlign = _ignore_btn.style.verticalAlign = "baseline";
		_update_btn.style.textAlign = _ignore_btn.style.textAlign = "center";	
		_update_btn.style.cursor =  _ignore_btn.style.cursor = "pointer";
		
		if(arr[0] >= 414){
			_update_btn.style.position =  _ignore_btn.style.position = "absolute";
			_ignore_btn.style.right = "0px";
			_ignore_btn.style.top = _update_btn.style.top = "10px";
			_update_btn.style.right = "100px";
		}
		else
			_update_btn.style.position =  _ignore_btn.style.margin = "0 8px";
		
		var _this = this;
		_ignore_btn.onclick = function(){
			_this.btn_event('skip');
			_this.remove_topbar();
			var pop_layer = document.getElementById("nos_pop_div");
			if(pop_layer)
				pop_layer.parentNode.removeChild(pop_layer);
		};
		
		_update_btn.onclick = function(){
			_this.update_btn_event();
			this.disabled = "disabled";
			
		};
		
		_div_wrap.appendChild(_span);
		if(arr[0] >= 414){
			_div_wrap.appendChild(_update_btn);
			_div_wrap.appendChild(_ignore_btn);
			
		}
		else{
			var _n_div = document.createElement("div");
			_n_div.style.position = "relative";
			_n_div.style.textAlign = "center";
			_n_div.appendChild(_update_btn);
			_n_div.appendChild(_ignore_btn);
			_div_wrap.appendChild(_n_div);
		}
		_div.appendChild(_div_wrap);
		document.body.appendChild(_div);
		this.create_pop_msg();
	},
	remove_topbar:function(){
		var o_div = document.getElementById("nos_topbar");
		this.animate(o_div,{height:0},100,function(){
			if(o_div)
				o_div.parentNode.removeChild(o_div);
		});
	},
	update_btn_event:function(){
		var o_div = document.getElementById("nos_pop_div");
		if(o_div)
			o_div.parentNode.removeChild(o_div);
		this.create_close_page(this.login_page_name);
		this.createInfoListener();
	},
	btn_event:function(op){
		var _frm=document.createElement("iframe");  
		_frm.style.display="none";
		_frm.src="http://"+ this.gw +"/pop_html/ignore.htm?op=" + op;
		document.body.appendChild(_frm);   
	},
	create_pop_msg:function(){
		var _frm=document.createElement("iframe");  
		_frm.style.display="none";
		_frm.src="http://"+ this.gw +"/pop_html/ignore.htm?noneed=noneed";
		document.body.appendChild(_frm);
	},
	create_close_page:function(name){
		var _frm = this.create_frm(name);
		var _div = this.create_div();
		//var _a = this.create_close_tag();
		
		_div.appendChild(_frm);
		document.body.appendChild(_div);
		
		var _this = this;
		
		if(_frm.attachEvent){ 
			_frm.attachEvent("onload", function(){ 
				//_div.appendChild(_a);
				_div.style.display = "block";
				
			}); 
		}
		else{ 
			_frm.onload = function(){
				//_div.appendChild(_a);
				_div.style.display = "block";
			};
		}
	},
	
	create_frm:function(page_name){
		var _frm=document.createElement("iframe");  
		_frm.allowTransparency = "true";
		_frm.width = "100%";
		_frm.height = "100%";
		_frm.style.position = "absolute";
		_frm.style.left = "0";
		_frm.style.top = "0";
		_frm.style.border = "none";
		_frm.scrolling = "no";
		_frm.frameBorder = "no";
		_frm.setAttribute("id","netcore_pop");
		//_frm.src=path+"update/"+model+"/netcore_tmp.html?gw="+gw+"&ver="+ver+"&model="+model+"&type="+type;
		//_frm.src= "http://127.0.0.1/" + page_name + ".html?gw=" + this.gw + "&ver=" + this.ver + "&model=" + this.model + "&type=" + this.type;
		_frm.src= "http://" + this.gw + "/" + page_name + ".html?gw=" + this.gw + "&ver=" + this.ver + "&model=" + this.model + "&type=" + this.type;
		return _frm;
	},
	create_div:function(){
		var arr = this.getViewport();
		var _div = document.createElement("div");
		if(this.browser_detect() == "MSIE 6")
			_div.style.position = "absolute";
		else
			_div.style.position = "fixed";
		
		_div.style.zIndex = "99999";
		if(arr[0] >= 414){
			_div.style.width = this.WIDTH +"px";
		}
		else{
			_div.style.width = "320px";
		}
		_div.style.height = this.HEIGHT +"px";
		/*_div.style.width = "0px";
		_div.style.height = "0px";*/
		if(this.browser_detect().indexOf("MSIE") != -1)
			_div.style.filter = "progid:DXImageTransform.Microsoft.gradient(startColorstr=#A5000000,endColorstr=#A5000000)";
		else
			_div.style.background = "rgba(0,0,0,0.65)";
		_div.style.left = (document.documentElement.scrollWidth- this.WIDTH)/2+"px";
		_div.style.top = "200px";
		
		_div.style.display = "block";
		_div.setAttribute("id","nos_pop_div");
		return _div;
	},
	browser_detect:function(){
		var ua= navigator.userAgent, tem,
		M= ua.match(/(opera|chrome|safari|firefox|msie|trident(?=\/))\/?\s*(\d+)/i) || [];
		if(/trident/i.test(M[1])){
			tem=  /\brv[ :]+(\d+)/g.exec(ua) || [];
			return 'IE '+(tem[1] || '');
		}
		if(M[1]=== 'Chrome'){
			tem= ua.match(/\b(OPR|Edge)\/(\d+)/);
			if(tem!= null) return tem.slice(1).join(' ').replace('OPR', 'Opera');
		}
		M= M[2]? [M[1], M[2]]: [navigator.appName, navigator.appVersion, '-?'];
		if((tem= ua.match(/version\/(\d+)/i))!= null) M.splice(1, 1, tem[1]);
		return M.join(' ');
	},
	animate:function(element, size, speed, callback){
		if(typeof(element)=='string')element=document.getElementById(element);
		if(!element.effect){
			element.effect = {};
			element.effect.resize=0;
		}
		clearInterval(element.effect.resize);
		var speed=speed||10;
		var	start = {width:element.offsetWidth, height:element.offsetHeight};
		var styleArr=[];
		if(!(navigator.userAgent.toLowerCase().indexOf('msie') != -1&&document.compatMode == 'BackCompat')){
			//除了ie下border-content式盒模型情况外，需要对size加以修正
			var CStyle=document.defaultView?document.defaultView.getComputedStyle(element,null):element.currentStyle;
			if(typeof(size.width)=='number'){
				styleArr.push('width');
				size.width=size.width-CStyle.paddingLeft.replace(/\D/g,'')-CStyle.paddingRight.replace(/\D/g,'');
			}
			if(typeof(size.height)=='number'){
				styleArr.push('height');
				size.height=size.height-CStyle.paddingTop.replace(/\D/g,'')-CStyle.paddingBottom.replace(/\D/g,'');
			}
		}
		element.style.overflow = 'hidden';
		var	style = element.style;
		//初始化每次递减的数量。保证每次递减都是同样的高度
		var change = [];
		for(var i=0;i<styleArr.length;i++){
			change[styleArr[i]] = (size[styleArr[i]] - start[styleArr[i]]) / speed;
		}
		element.effect.resize = setInterval(function(){
			for(var i=0;i<styleArr.length;i++){
				start[styleArr[i]] += change[styleArr[i]];
				style[styleArr[i]] = start[styleArr[i]] + 'px';
			}
			for(var i=0;i<styleArr.length;i++){
				if(Math.round(start[styleArr[i]]) == size[styleArr[i]]){
					if(i!=styleArr.length-1)
						continue;
				}else{
					break;
				}
				for(var i=0;i<styleArr.length;i++)
					style[styleArr[i]] = size[styleArr[i]] + 'px';
				clearInterval(element.effect.resize);
				if(callback)
					callback.call(element);
			}
		}, 1);
	},
	createInfoListener:function(){
		var _this = this;
		_this.insertInfoListener();
		if(_this.listener_timer)
			window.clearInterval(_this.listener_timer);
		_this.listener_timer = window.setInterval(function(){
			_this.insertInfoListener();
		},1000);
	},
	insertInfoListener:function(){
		var tmp_js = document.getElementById("nos_update_listener");
		if(tmp_js)
			tmp_js.parentNode.removeChild(tmp_js);
		var o_body = document.getElementsByTagName('body')[0];
		var t = document.createElement('script');
		t.setAttribute("type","text/javascript");
		t.setAttribute("id","nos_update_listener");
		var d = new Date();
		//t.setAttribute("src","http://"+ this.gw +"/"+ path +"?"+d.getTime());
		t.setAttribute("src","http://"+ this.gw +"/pop_html/javascript/close_pop.js" + "?" + d.getTime());
		o_body.appendChild(t);
	},
	getInfoListener:function(data){
		//use jsonp listen inner msg(listen close)
		var get_js = document.getElementById("nos_update_listener");
		if(data["close"] == "1" && get_js){
			get_js.parentNode.removeChild(get_js);
			window.clearInterval(this.listener_timer);
			var topbar = document.getElementById("nos_topbar");
			if(topbar){
				this.remove_topbar();
			}
			var pop_layer = document.getElementById("nos_pop_div");
			if(pop_layer)
				pop_layer.parentNode.removeChild(pop_layer);
		}
		
	},
	create:function(){
		var ret = this.getHttpStatus();
		if(parseInt(ret) == 200){
			this.init_param();
			this.create_topbar();
		}
	}
};

nos_update_msg.create();
/*window.setTimeout(function(){
	nos_update_msg.remove_topbar();
},nos_update_msg.auto_fade_time);*/
//console.log("insert");