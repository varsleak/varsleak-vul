if (typeof(nos) == 'undefined' || nos == null) {
    var nos = {};
}
if (typeof parentEmt == "undefined" || parentEmt == null) {
    parentEmt = this.parent;
}

nos.app = {};

/* 数据读取
 @param strUrl		读取的url
 @param StrParam	传递的url参数或者表单的name属性
 @param fnDone		数据读取成功的回调函数(返回json值)或者回填表单的name属性
 @param fnError		数据读取失败的回调函数(可选)
 @param bAsync		同步或者异步(可选)
 */
nos.app.net = function (strUrl, StrParam, fnDone, fnError, bAsync) {
    var successFn = function (result) {
        if (result == '') {
            if (typeof(fnError) != 'undefined' && fnError != null && typeof(eval(fnError)) == "function") {
                fnError();
            }
            return;
        }
        var json = eval("(" + result + ")");
        if (typeof(eval(fnDone)) == "function") {
            fnDone(json);
        }
        else {
            nos.app.setForm(fnDone, json);
        }
    }
    var tempParam = ((typeof(StrParam) == "string" && (StrParam == "" || StrParam.search(/=|&/) >= 0)) ? StrParam : nos.app.getForm(StrParam));
    if (bAsync == null || typeof(bAsync) != "boolean") {
        $.ajax({
            url: strUrl,
            data:tempParam,
            type: "POST",
            async: true,
            success: successFn,
            error: fnError
        });
    }
    else {
        $.ajax({
            url: strUrl,
            data:tempParam,
            type: "POST",
            async: bAsync,
            success: successFn,
            error: fnError
        });
    }
}
;

/* 将值自动填充到表单中
 @param tForm	表单的name属性
 @param sVar	json值
 */
nos.app.setForm = function (tForm, sVar) {
    if (typeof(tForm) == "string") {
        if(current_html=="vpn_client" || current_html == "wakeup"){//获取top表单
            tForm = parentEmt.document.forms[tForm];
        }else{
            tForm = document.forms[tForm];
        }
    }
    if (typeof(sVar) != "object") {
        return;
    }
    for (var i = 0; i < tForm.elements.length; i++) {
        var tempname = tForm.elements[i].name;
        var temptype = tForm.elements[i].type;
        if (typeof(sVar[tempname]) != 'undefined' && sVar[tempname] != null) {
            var tempvalue = sVar[tempname];
            if (temptype == "checkbox") {
                if (typeof(sVar[tempname]) == 'object') {
                    tempvalue = ",";
                    for (var j = 0; j < sVar[tempname].length; j++) {
                        tempvalue += sVar[tempname][j] + ",";
                    }
                }
                else {
                    tempvalue = "," + tempvalue + ",";
                }
                if (tempvalue.indexOf("," + tForm.elements[i].value + ",") > -1) {
                    tForm.elements[i].checked = true;
                }
                else {
                    tForm.elements[i].checked = false;
                }
            }
            else if (temptype == "radio") {
                if (tForm.elements[i].value == tempvalue) {
                    tForm.elements[i].checked = true;
                }
                else {
                    tForm.elements[i].checked = false;
                }
            }
            else if (temptype == "select-one") {
                var tempj = -1;
                for (var j = 0; j < tForm.elements[i].length; j++) {
                    tForm.elements[i].options[j].selected = false;
                    if (tempj < 0 && tForm.elements[i].options[j].value == tempvalue) {
                        tempj = j;
                    }
                }
                if (tempj >= 0) {
                    tForm.elements[i].options[tempj].selected = true;
                }
            }
            else {
                if (tForm.elements[i].getAttribute('data-aes') && tForm.elements[i].getAttribute('data-aes') == 'true') {
                    tForm.elements[i].value = parentEmt.getDAesString(tempvalue);
                } else {
                    tForm.elements[i].value = tempvalue;
                }

            }
        }
    }
    if ((typeof  Placeholder) != "undefined") {
        Placeholder();
    }
};

/* 获取表单的值
 @param tForm	表单的name属性
 @return string	表单的值的连接字符串，可直接用于数据提交
 */
nos.app.getForm = function (tForm) {
    if (typeof(tForm) == "string") {
        if(current_html=="vpn_client" || current_html == "wakeup"){//获取top表单
            tForm = parentEmt.document.forms[tForm];
        }else{
            tForm = document.forms[tForm];
        }
    }
    var iUrl = "";
    for (var i = 0; i < tForm.elements.length; i++) {
        if (tForm.elements[i].name == '') {
            continue;
        }
        if (tForm.elements[i].type == "checkbox" || tForm.elements[i].type == "radio") {
            if (tForm.elements[i].checked) {
                iUrl += tForm.elements[i].name + '=' + encodeURIComponent(tForm.elements[i].value) + '&';
            }
        }
        else {
            if (tForm.elements[i].getAttribute('data-aes') && tForm.elements[i].getAttribute('data-aes') == 'true') {
                iUrl += tForm.elements[i].name + '=' + parentEmt.getAesString(tForm.elements[i].value) + '&';
            } else {
                iUrl += tForm.elements[i].name + '=' + encodeURIComponent(tForm.elements[i].value) + '&';
            }

        }
    }
    if (iUrl != '') {
        iUrl = iUrl.slice(0, -1);
    }
    return iUrl;
};

/* 页面显示调整 */
nos.app.resizePage = function () {
   if (window.top != window.self && parent.document.getElementById("config_page") != null) {
        var xScroll, yScroll;
		parent.document.getElementById("config_page").height = 450;
        if (window.innerHeight && window.scrollMaxY)
			{
				xScroll = window.innerWidth + window.scrollMaxX;
				yScroll = window.innerHeight + window.scrollMaxY;
			}
			else if (document.body.scrollHeight > document.body.offsetHeight)
			{
				xScroll = document.body.scrollWidth;
				yScroll = document.body.scrollHeight;
			}
			else
			{
				xScroll = document.body.offsetWidth;
				yScroll = document.body.offsetHeight;
			}
			
			var windowWidth, windowHeight;
			if (self.innerHeight) 
			{
				windowWidth = self.innerWidth;
				windowHeight = self.innerHeight;
			}
			else if (document.documentElement && document.documentElement.clientHeight)
			{
				windowWidth = document.documentElement.clientWidth;
				windowHeight = document.documentElement.clientHeight;
			}
			else if (document.body)
			{
				windowWidth = document.body.clientWidth;
				windowHeight = document.body.clientHeight;
			}
			
			
			var pageWidth,pageHeight;
			if(yScroll < windowHeight)
			{
				pageHeight = windowHeight;
				y = pageHeight;
			}
			else
			{
				pageHeight = yScroll;
				y = pageHeight;
			}
			
			if(xScroll < windowWidth)
			{
				pageWidth = windowWidth;
			}
			else
			{
				pageWidth = xScroll;
			}
			
			parent.document.getElementById("config_page").height = pageHeight;
		
		if (jQuery.browser.msie && (jQuery.browser.version == "7.0"||jQuery.browser.version == "8.0")) {
			var offset = getPosition(window.top.document.getElementById("app_set"));
			var shadow = window.top.document.getElementById("fix_app_ie_shadow");
			if(shadow){
				var shadow_height;
				if(pageHeight > 450)
					shadow_height = pageHeight;
				else
					shadow_height = 450;
				shadow.style.width = window.top.document.getElementById("app_set").clientWidth + "px";
				shadow.style.height = shadow_height + "px";
				shadow.style.left = offset.x - 2 + "px";
				shadow.style.top = offset.y - 2 + "px";
			}		
		}
    }
    else {
        //alert('无效操作！');
    }
};

/* 网络连接 */
nos.app._ajax = function () {
    var xmlhttp, bComplete = false;
    try {
        xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");
    }
    catch (e) {
        try {
            xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
        }
        catch (e) {
            try {
                xmlhttp = new XMLHttpRequest();
            }
            catch (e) {
                xmlhttp = false;
            }
        }
    }
    if (!xmlhttp) return null;
    this.connect = function (sURL, sMethod, sVars, sAsync, fnDone, fnError) {
        if (!xmlhttp) return false;
        bComplete = false;
        sMethod = sMethod.toUpperCase();
        try {
            if (sMethod == "GET") {
                xmlhttp.open(sMethod, sURL + "?" + sVars, sAsync);
                sVars = "";
            }
            else {
                xmlhttp.open(sMethod, sURL, sAsync);
                xmlhttp.setRequestHeader("Method", "POST " + sURL + " HTTP/1.1");
                xmlhttp.setRequestHeader("Content-Type",
                    "application/x-www-form-urlencoded");
            }
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 0) && !bComplete) {
                    bComplete = true;
                    var result = xmlhttp.responseText;
                    if (result == '') {
                        if (typeof(fnError) != 'undefined' && fnError != null && typeof(eval(fnError)) == "function") {
                            fnError();
                        }
                        return;
                    }
                    var json = eval("(" + result + ")");
                    if (typeof(eval(fnDone)) == "function") {
                        fnDone(json);
                    }
                    else {
                        nos.app.setForm(fnDone, json);
                    }
                }
                else if (typeof(fnError) != 'undefined' && fnError != null && typeof(eval(fnError)) == "function") {
                    fnError();
                }
            };
            xmlhttp.send(sVars);
        }
        catch (z) {
            return false;
        }
        return true;
    };
    return this;
};