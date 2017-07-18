;(function (window) {
    //---存储管理
    ////////////////////////////////////
    var store_manage_loop_timer,
        progress_loop_timer,
        control_show = new Object(),    // 1 为原始展开 0为原始折叠
        L_store_mange = L.storage_manage;

    function show_state(disk_num,disk_len) {
        var keyStr = "disk_" + disk_num,
            state = control_show[keyStr];

        if(disk_len == 1){
            $(".disk").find(".icon").eq(0).remove();
        }
        if (state) {
            if(disk_len == 1){
                control_show["disk_0"]['status'] = '1';//第一个默认展开
                for(var key in control_show){//删除其他的原始数据
                    if(key !=="disk_0"){
                        delete control_show[key];
                    }
                }
            }
            return state['status'];
        }
        else {
            control_show[keyStr] = new Object();
            control_show[keyStr]['status'] = '0';//初始化折叠
            control_show["disk_0"]['status'] = '1';//第一个默认展开
            return control_show[keyStr]['status'];
        }
    }

/////////////////////////////////////
    var store_manage = {
        enable_app:true,
        err: {
            "_default": L_store_mange["_default"],
            "-1": L_store_mange["-1"],
            "-2": L_store_mange["-2"],
            "-3": L_store_mange["-3"],
            "-8": L_store_mange["-8"],
            "-9": L_store_mange["-9"],
            "-10": L_store_mange["-10"],
            "-11": L_store_mange["-11"]
        },
        make_err_msg: function (key) {
            if (!this.err[key]) {
                return this.err._default;
            }
            var str = this.err[key];
            return str;
        },
        init: function () {
            current_html = "store_info";
            this.store_manage_show();
            this.store_manage_show_loop();
        },
        store_manage_show: function () {
            var _this = this;
            $.post("/router/system_application_config.cgi", {action: "get_storeinfo"}, function (ret) {
                ret = dataDeal(ret);
                _this.show_call_back(ret);
            });
        },
        store_manage_show_loop: function () {
            // return;
            var _this = this;
            if (store_manage_loop_timer)
                clearInterval(store_manage_loop_timer);
            store_manage_loop_timer = setInterval(function () {
                if (current_html === "store_info") {
                    _this.store_manage_show();
                }
                else {
                    clearInterval(store_manage_loop_timer);
                    control_show = {};
                }
            }, 3000);
        },
        show_call_back: function (ret) {
            var _this = this;

            var sort = function (data) {//排序
                if (data == '' || data == null) {
                    return;
                }
                var temp_arr = [], temp_arr1 = [], temp_arr2 = [], temp_arr3 = [], temp = [];
                for (var i = 0, len = data.length; i < len; i++) {
                    if (data[i]["disk_type"] == "5") {
                        temp_arr1.push(data[i]);
                    }
                    if (data[i]["disk_type"] != "5" && data[i]["disk_type"] != "0") {
                        temp_arr2.push(data[i]);
                    }
                    if (data[i]["disk_type"] == "0") {
                        temp_arr3.push(data[i]);
                    }
                }
                temp = temp_arr3.concat(temp_arr1);
                temp_arr = temp.concat(temp_arr2);
                return temp_arr;
            }
            var $store = $("#store_manage_wrap");
            if (ret.result) {
                return;
            } else {
                if (ret.length == 0) {//未挂载设备
                    this.enable_app = false;
                    $store.find(".no-new-disk").removeClass("section_hide").addClass("section_show");
                    $store.find(".disk-wrap").removeClass("section_show").addClass("section_hide");
                    $store.find(".no-disk").removeClass("section_hide").addClass("section_show");
                    $store.find(".new-disk").removeClass("section_show").addClass("section_hide");
					$store.find(".disk-tip").removeClass("section_show").addClass("section_hide");
					$store.find(".btn-wrap").removeClass("section_show").addClass("section_hide");
					
                } else {
                    this.enable_app = true;
                    if (ret.length == 1 && !ret[0].disk_part) {//单个新设备没有格式化分区
                        $store.find(".no-new-disk").removeClass("section_hide").addClass("section_show");
                        $store.find(".disk-wrap").removeClass("section_show").addClass("section_hide");
                        $store.find(".no-disk").removeClass("section_show").addClass("section_hide");
                        $store.find(".new-disk").removeClass("section_hide").addClass("section_show");
						$store.find(".disk-tip").removeClass("section_show").addClass("section_hide");
						$store.find(".btn-wrap").removeClass("section_show").addClass("section_hide");
                    } else {//正常设备 + 新设备 + 未识别
                        $store.find(".no-new-disk").removeClass("section_show").addClass("section_hide");
                        $store.find(".disk-wrap").removeClass("section_hide").addClass("section_show");
						$store.find(".disk-tip").removeClass("section_hide").addClass("section_show");
						$store.find(".btn-wrap").removeClass("section_hide").addClass("section_show");
                        var result = sort(ret);   // 排序
                        _this.init_disk_info(result);
                        _this.set_disk_info(result);
                        _this.bind_disk_event(result);
                        _this.accordion();
                    }
                }
            }
        },
		get_file_type:function (fs_type) {//得到文件系统类型
			var file_name = "";
			switch (fs_type) {
				case "1":
					file_name = L_store_mange.unknown;
					break;
				case "2":
					file_name = "NTFS";
					break;
				case "3":
					file_name = "FAT";
					break;
				case "4":
					file_name = "EXT2";
					break;
				case "5":
					file_name = "EXT3";
					break;
				case "6":
					file_name = "EXT4";
					break;
				case "7":
					file_name = "JFFS";
					break;
				case "8":
					file_name = "EXFAT";
					break;
			}
			return file_name;
		},
		get_memory_size:function (disk_all_size, disk_free_size) {//单位M
			var disk_all_size_one = parseFloat(disk_all_size),
				disk_free_size_one = parseFloat(disk_free_size),
				disk_used_size_one = disk_all_size_one - disk_free_size_one;

			if(isNaN(disk_free_size_one))
				return {
					all_size: 0,
					free_size: 0,
					used_size: 0
				}

			var disk_all_size_one_str = disk_all_size_one >= 1024 ? (disk_all_size_one / 1024).toFixed(2) + "GB" : disk_all_size_one + "MB",
				disk_free_size_one_str = disk_free_size_one >= 1024 ? (disk_free_size_one / 1024).toFixed(2) + "GB" : disk_free_size_one + "MB",
				disk_used_size_one_str = disk_used_size_one >= 1024 ? (disk_used_size_one / 1024).toFixed(2) + "GB" : disk_used_size_one + "MB";

			return {
				all_size: disk_all_size_one_str,
				free_size: disk_free_size_one_str,
				used_size: disk_used_size_one_str
			}
		},
        init_disk_info: function (result) {
            var _this = this;

            var get_disk_type = function (disk_type) {//得到磁盘类型
                var disk_name = "";
                switch (disk_type) {
                    case "1":
                        disk_name = L_store_mange.disk_name1;
                        break;
                    case "2":
                        disk_name =  L_store_mange.disk_name2;
                        break;
                    case "3":
                        disk_name =  L_store_mange.disk_name3;
                        break;
                    case "4":
                        disk_name =  L_store_mange.disk_name4;
                        break;
                    case "5":
                        disk_name =  L_store_mange.disk_name5;
                        break;
                }
                return disk_name;
            }
            var set_progress = function (disk_all_size, disk_free_size) {//容量条   M
                var all = parseFloat(disk_all_size),
                    free = parseFloat(disk_free_size),
                    used = all - free,
                    per = used / all;
                return per * 100;
            }
            var $store = $("#store_manage_wrap");
            $store.find(".disk").html("");

            var disk_title = "",
                part_num = 1,              //每个设备的分区数
                NUM = 0,                   //所有设备分区序号
                usb_tmp_arr = [],
                orig_used_size;            // 应用分区 已使用空间大小

            var disk_dev_name, disk_all_size, disk_free_size, file_type, disk_flag, disk_type;
            reg_map["store_manage"] = [];
            var disk_str = (function () {
                var disk_str_temp = "";
                var get_new_data = function (data) {
                    var disk_free_size = 0,
                        disk_all_size = 0;
                    $.each(data, function (m, n) {
                        disk_free_size = 0;
                        disk_all_size = 0;
                        if (n.disk_part && n.disk_part.length > 0) {
                            $.each(n.disk_part, function (p, q) {
                                disk_free_size += parseFloat(q.disk_free_size);
                                disk_all_size += parseFloat(q.disk_all_size);
                            })
                        }
                        n.disk_free_size = disk_free_size;
                        n.disk_all_size = disk_all_size;    // 修正不能识别出的盘符容量
                    })
                    return data;
                }
                result = get_new_data(result);

                $.each(result, function (i, o) {//i 代表设备个数 从0开始 0 表示第一个设备
                    disk_dev_name = o.dev_name;
                    disk_type = o.disk_type;  //判定设备/分区
                    disk_all_size = o.disk_all_size; //设备总空间大小 单位M
                    disk_free_size = o.disk_free_size; //设备可用空间大小 单位M
                    file_type = o.fs_type;     //文件类型
                    disk_flag = o.disk_flag;

                    if (disk_type == "1" || disk_type == "3") {
                        usb_tmp_arr.push(o);
                        if (usb_tmp_arr.length == 1) {
                            disk_title = L_store_mange.disk_title1;
                        } else {
                            for (var u = 0; u < usb_tmp_arr.length; u++) {
                                var uleng = u + 1;
                                disk_title =  L_store_mange.disk_title1 + uleng;
                            }
                        }
                    } else if (disk_type == "2" || disk_type == "4") {
                        disk_title = L_store_mange.disk_title2;
                    } else if (disk_type == "5") {
                        disk_title = L_store_mange.disk_title3;
                        orig_used_size = parseFloat(disk_all_size) - parseFloat(disk_free_size);  //  M
                        orig_used_size = (orig_used_size / 1024).toFixed(2);   //G
                    } else if (disk_type == "0") {
                        disk_title = L_store_mange.disk_title4;
                    }
                    if (o.disk_part) {
                        part_num = o.disk_part.length;
                    }
                    var get_fixed_title = function(i){
                        var len = result.length;
                        if(len == 1){
                            return "";
                        }else{
                            return (i+1);
                        }
                    }
                    var disk_arr = [
                        '<div class="panel">',
                            '<div class="panel-head">',
                            '<p class="panel-title" data-disk_num="' + i + '">'+ L_store_mange.store_disk + get_fixed_title(i) + '</p>',
                            (function () {
                                var tit = "";
                                if (i === 0) {
                                    tit = '<div class="panel-item section_hide">'
                                } else {
                                    tit = '<div class="panel-item line-h section_hide">'
                                }
                                return tit;
                            })(),
                                '<p class="panel-sub-title">'+L_store_mange.store_disk + get_fixed_title(i) + '</p>',
                                (function () {
                                    var str = "";
                                    if (o.disk_part) {
                                        str = '<p class="num-item"><span class="num">' + part_num + '</span>'+ L_store_mange.part_num+'</p>';
                                        str += '<p class="memory-item">'+L_store_mange.used+'<span class="num">' + _this.get_memory_size(o.disk_all_size, o.disk_free_size).used_size + '</span>/'+L_store_mange.total+'<span class="num">' + _this.get_memory_size(o.disk_all_size, o.disk_free_size).all_size + '</span></p>';
                                    } else {
                                        str = '<p class="num-item"><span class="num">' + L_store_mange.unformatted + '</span></p>';
                                        str += '<p class="memory-item"><span class="num">------' + '</span><span class="num">&nbsp;' + '</span></p>';
                                    }
                                    return str;
                                })(),
                                '<p class="btn-wrap-head section_hide">',
                                    '<a href="javascript:void(0);" class="panel-btn uninstall-btn" data-disk_flag="' + o.disk_flag + '" data-dev_name="' + o.dev_name + '">'+L_store_mange.uninstall +'</a>',
                                '</p>',
                            '</div>',
                            '<i class="icon icon-down" data-disk_num="' + i + '"></i>',
                        '</div>',
                        '<div class="panel-body">',
                            '<div class="partition-wrap">',
                                '<div class="partition">',
                                    (function () {
                                        var part_str = "",
                                            part_arr;
                                        if (o.disk_part) {
                                            $.each(o.disk_part, function (j, k) {

                                                reg_map["store_manage"][NUM] = {id: 'disk_' + i + '_' + j, type: "string"};

                                                NUM++;

                                                part_arr = [
                                                    (function () {
                                                        if (j == 0) {
                                                            return  '<div class="part">';
                                                        } else {
                                                            return '<div class="part line-h">';
                                                        }
                                                    })(),
                                                      '<div class="item">',
													  		'<div class="disk_icon"><img src="/images/disk_icon.png" /></div>',
                                                            '<span class="tit position pos-2">'+L_store_mange.disk_name+'</span>',
                                                            '<input type="text" class="tit position pos-3 pos-top disk_label" maxlength="32" data-dev_name="' + k.dev_name + '" value="' + _this.check_disk_label($.trim(k.disk_label), k.fs_type) + '(' + k.dev_name + ')' + '" id="disk_' + i + '_' + j + '" data-fs_type="' + k.fs_type + '" data-disk_label="' + k.disk_label + '"/>',
                                                     '</div>',
                                                    '<div class="item">',
                                                        '<span class="tit position pos-2">'+L_store_mange.store_capacity+'</span>',
                                                        '<span class="position pos-3 bar-wrap">',
                                                            '<div class="bar bar-bg"></div>',
                                                            '<div class="bar bar-progress" style="width:' + set_progress(k.disk_all_size, k.disk_free_size) + '%"></div>',
                                                            (function () {
                                                                var width = set_progress(k.disk_all_size, k.disk_free_size);
                                                                var str = "",used = _this.get_memory_size(k.disk_all_size, k.disk_free_size).used_size,total = _this.get_memory_size(k.disk_all_size, k.disk_free_size).all_size;
                                                                if(used != 0 && total != 0){
																	if (width >= 70)
																		str = '<div class="memory-num" style="color:#fff;">'+L_store_mange.used + used + '/'+L_store_mange.total + total + '</div>';
																	else
																		str = '<div class="memory-num">'+L_store_mange.used + used + '/'+L_store_mange.total + total + '</div>';
																}
                                                                return str;
                                                            })(),
                                                        '</span>',
                                                    '</div>',
                                                    '<div class="item">',
                                                        '<span class="tit position pos-2">'+L_store_mange.file_system+'</span>',
                                                        (function () {
                                                            var str = "";
                                                            if (k.fs_type == "1") {
                                                                str = '<span class="position pos-3 tit red">' + _this.get_file_type(k.fs_type) + '</span>';
                                                            } else {
                                                                str = '<span class="position pos-3 tit">' + _this.get_file_type(k.fs_type) + '</span>';
                                                            }
                                                            return str;
                                                        })(),
                                                        '<a href="javascript:void(0);" class="position pos-4 format-btn" data-fs_type="' + k.fs_type + '" data-disk_flag="' + k.disk_flag + '" data-dev_name="' + k.dev_name + '">'+L_store_mange.formatting+'</a>',
                                                    '</div>',
                                                    '</div>'
                                                ];
                                                part_str += part_arr.join("");
                                            })
                                            part_str += '<div class="btn-wap-body section_hide"><button class="uninstall-btn" data-disk_flag="' + o.disk_flag + '" data-dev_name="' + o.dev_name + '">'+L_store_mange.uninstall+'</button></div>';
                                        } else {
                                            part_arr = [
                                                '<div class="new-disk">',
                                                    '<p class="sub-title">'+L_store_mange.new_disk_tip+'</p>',
                                                    '<p class="title">'+L_store_mange.init_tip+'</p>',
                                                    '<div class="new-disk-img"></div>',
                                                '</div>'
                                            ];
                                            part_str = part_arr.join("");
                                        }
                                        return part_str;
                                    })(),
                                    '</div>',
                                '</div>',
                            '</div>',
                        '</div>'
                    ];
                    disk_str_temp += disk_arr.join("");
                })
                return disk_str_temp;
            })();

            $store.find(".disk").html(disk_str);
        },
        set_disk_info: function (data) {
            //////////////////////////////////////////////  轮询时候设置折叠/展开
            var show_flag;
            var $store = $("#store_manage_wrap"),
                $penel_head = null,
                $penel_body = null,
                disk_len = data.length;
            $.each(data, function (i, o) {
                show_flag = show_state(i,disk_len);
                $penel_head = $store.find(".panel").eq(i).find(".panel-head");
                $penel_body = $store.find(".panel").eq(i).find(".panel-body");
                if (show_flag == "1") {
                    $penel_body.show();
                    $penel_head.find(".panel-title").removeClass("section_hide").addClass("section_show");
                    $penel_head.find(".panel-item").removeClass("section_show").addClass("section_hide");
                    $penel_head.find(".icon").hide();
                } else {
                    $penel_body.hide();
                    $penel_head.find(".panel-title").removeClass("section_show").addClass("section_hide");
                    $penel_head.find(".panel-item").removeClass("section_hide").addClass("section_show");
                    $penel_head.find(".icon").show();
                }
                ///////////////////////////////////////////////
            })
        },
        check_disk_label: function (str, fs_type) {
            var _checkLength = function (strTemp, fs_type, maxLength) {
                var i, sum, count,charCode;
                count = strTemp.length;
                sum = 0;
                for (i = 0; i < count; i++) {
                     charCode = strTemp.charCodeAt(i);
                    if(fs_type && fs_type == "3"){
                        if (charCode < 0x007f) { //127
                            sum += 1;
                        }
                        else{//128-65535  后台gb2312
                            sum += 3;
                        }
                    }else{
                        if (charCode < 0x007f) { //127
                            sum += 1;
                        }
                        else if ((0x0080 <= charCode) && (charCode <= 0x07ff)) {//128-2047
                            sum += 2;
                        }
                        else if ((0x0800 <= charCode) && (charCode <= 0xffff)) {//2048-65535
                            sum += 3;
                        }
                    }
                    if (sum > maxLength) {
                        var v = strTemp.substring(0, i);
                        return v + "...";
                    }
                }
                return strTemp;
            }
            return _checkLength(str, fs_type, 27);
        },
        bind_disk_event: function (data) {
            var _this = this, $store = $("#store_manage_wrap");
            $store.off("click").on("click", ".format-btn,.uninstall-btn,.uninstall-all-btn", function (event) {//格式化/卸载 绑定事件
                event.preventDefault();
                var $this = $(this),
                    dev_name = $this.data("dev_name"),
                    disk_flag = $this.data("disk_flag"),
                    fs_type = $this.data("fs_type");
                if ($this.hasClass("format-btn")) {
                    _this.format(dev_name, fs_type, disk_flag);  //格式化操作函数
                } else if($this.hasClass("uninstall-btn")){
                    _this.unstall(dev_name, disk_flag);         //卸载单个设备操作函数
                }else{
                    _this.unstall_all();         //卸载所有设备操作函数
                }
            })
            $store.off("focusin").on("focusin", ".disk_label", function (event) {
                var $this = $(this),
                    fs_type = $this.data("fs_type"),
                    old_disk_label = $.trim($this.attr("data-disk_label"));
                if (fs_type == "3") {//fat
                    $this.attr("maxlength", 11);
                } else if (fs_type == "4" || fs_type == "5" || fs_type == "6") {
                    $this.attr("maxlength", 16);
                } else {
                    $this.attr("maxlength", 32);
                }
                $this.addClass("focusin");

                $this.val(old_disk_label);

                if (store_manage_loop_timer) clearInterval(store_manage_loop_timer);

            })
            $store.off("focusout").on("focusout", ".disk_label", function (event) {
                var $this = $(this),
                    fs_type = $this.data("fs_type"),
                    dev_name = $this.data("dev_name"),
                    disk_label = $.trim($this.val()),
                    old_disk_label = $.trim($this.attr("data-disk_label"));
                var temp_val = _this.check_disk_label(disk_label, fs_type) + "(" + dev_name + ")";

                if (old_disk_label === disk_label) {
                    $this.removeClass("focusin");
                    $this.val(temp_val);
                    _this.store_manage_show_loop();
                    return;
                }
                if (!check_input("store_manage")) {
                    return;
                }
                $this.removeClass("focusin");
                _this.set_disk_label(dev_name, disk_label);         //分区修改名字操作函数
                $this.val(temp_val);
            })

        },
        accordion: function () {
            var _this = this;
            //手风琴事件
            $(".disk").off("click").on("click", ".icon", function (e) {
                var $this = $(this),
                    disk_num = $this.data("disk_num");
                var accordion_arrow = function () {

                    if (control_show["disk_" + disk_num]['status'] == "1") {    // 原来是展开状态
                        return ;
                        $this.parent(".panel-head").siblings(".panel-body").stop(true, true).slideUp("fast", function () {
                            $this.prevAll(".panel-title").removeClass("section_show").addClass("section_hide");
                            $this.prev(".panel-item").removeClass("section_hide").addClass("section_show");
                            $this.parent(".panel-head").siblings(".panel-body").removeClass("section_show");  //fire bug ie 7
                        });
                        control_show["disk_" + disk_num]['status'] = "0";     //  折叠后 状态变为 0

                    } else {  //原来是折叠状态
                        store_manage_loop_timer && clearInterval(store_manage_loop_timer);
                        $this.parent().siblings().stop(true, true).slideDown("fast", function () {
                            $this.prevAll(".panel-title").removeClass("section_hide").addClass("section_show");
                            $this.prev(".panel-item").removeClass("section_show").addClass("section_hide");
                            $this.parent(".panel-head").siblings(".panel-body").removeClass("section_hide"); //fix bug ie 7
                            $this.hide();
                            _this.store_manage_show_loop();

                        });
                        control_show["disk_" + disk_num]['status'] = "1";
                    }
                    var _obj = $this.parent(".panel-head").parent(".panel").siblings().find(".panel-body");
                    _obj.slideUp("fast", function () {
                        _obj.parent(".panel").find(".panel-head .panel-title").removeClass("section_show").addClass("section_hide");
                        _obj.parent(".panel").find(".panel-head .panel-item").removeClass("section_hide").addClass("section_show");
                        _obj.parent(".panel").find(".panel-head .icon").show();
                        //其他所有状态重置为折叠状态0
                        for (var key in control_show) {
                            if (key !== "disk_" + disk_num) {
                                control_show[key]['status'] = "0";
                            }
                        }
                    });

                }
                if ($this.hasClass("icon")) {
                    accordion_arrow();
                } else {
                    $this.siblings(".icon").click();
                }
            });
        },
        format: function (disk_dev_name, file_type, disk_flag) {//格式化
            var _this = this;
            var parmStr = "action=set_format&dev_name=" + disk_dev_name + "&fs_type=2";
            //fs_type=2  代表 ntfs 文件类型 目前只支持这种
            show_dialog("<p class=\"format_tip\">" + L_store_mange.format_tip + "</p><p class=\"support_tip\">(" + L_store_mange.support + ")</p>", function () {
                if (store_manage_loop_timer) clearInterval(store_manage_loop_timer);
                show_message("wait_one_min", L_store_mange.waiting);
                $.post('/router/system_application_config.cgi', parmStr, function (data) {
                    data = dataDeal(data);
                    if (data.result == "0") {
                        if (progress_loop_timer)  clearInterval(progress_loop_timer);
                        progress_loop_timer = setInterval(function () {
                            $.post('/router/system_application_config.cgi', 'action=get_progress', function (data2) {
                                data2 = dataDeal(data2);
                                if (data2.result > 0) {
                                    show_message("wait_one_min", L_store_mange.is+L_store_mange.formatting+"...");
                                    if (data2.result == "100") {
                                        clearInterval(progress_loop_timer);
                                        _this.store_manage_show_loop();
                                        show_message("format_success");
                                    }
                                } else {
                                    clearInterval(progress_loop_timer);
                                    show_message("error", _this.make_err_msg(data2.result));
                                    _this.store_manage_show_loop();
                                }
                            })
                        }, 1000);
                    } else {
                        show_message("error", _this.make_err_msg(data.result));
                        _this.store_manage_show_loop();
                    }
                });
            }, null, "format");
        },
        unstall_temp:function(act,dev_name,disk_flag){
            var _this = this;
            var parmStr = "action="+act+"&dev_name=" + dev_name ;

            show_dialog(L_store_mange.whether + L_store_mange.uninstall , function () {
                if (store_manage_loop_timer) clearInterval(store_manage_loop_timer);
                show_message("wait_one_min", L_store_mange.waiting);
                $.post("/router/system_application_config.cgi", parmStr, function (data) {
                    data = dataDeal(data);
                    if (data.result == "0") {
                        if (progress_loop_timer)  clearInterval(progress_loop_timer);
                        progress_loop_timer = setInterval(function () {
                            $.post('/router/system_application_config.cgi', 'action=get_progress', function (data2) {
                                data2 = dataDeal(data2);
                                if (data2.result > 0) {
                                    if (data2.result == "100") {
                                        clearInterval(progress_loop_timer);
                                        _this.store_manage_show_loop();
                                        show_message("uninstall_success");
                                    }
                                } else {
                                    clearInterval(progress_loop_timer);
                                    show_message("error", _this.make_err_msg(data2.result));
                                    _this.store_manage_show_loop();
                                }
                            })
                        }, 1000)

                    } else {
                        show_message("error", _this.make_err_msg(data.result));
                        _this.store_manage_show_loop();
                    }
                });
            }, null, "unstall");
        },
        unstall: function (dev_name, disk_flag) {//卸载单个设备
            this.unstall_temp("uninstall",dev_name, disk_flag);

        },
        unstall_all:function(){//卸载所有设备
            this.unstall_temp("uninstall_all","all");
        },
        set_disk_label: function (dev_name, disk_label) {//分区修改名字
            var _this = this;
            var parmObj = {
                action: "set_disk_label",
                dev_name: dev_name,
                disk_label: disk_label
            }
            $.post('/router/system_application_config.cgi', parmObj, function (data) {
                data = dataDeal(data);
                if (data.result == "0") {

                } else {
                    show_message("error", _this.make_err_msg(data.result));
                }
                _this.store_manage_show();
				_this.store_manage_show_loop();
            });
        }
    }

    var app_samba_dlna = {
        loop_timer:0,
        loop_timer_load:0,
        url:{
            "all_app":"/router/app.cgi",
            "samba":"/app/samba/webs/samba.cgi",
            "dlna":"/app/dlna/webs/dlna.cgi",
            "loadinfo":"/storage/storage_manage.cgi"
        },
        clicked_toggle:{
            "samba": false,
            "dlna" : false
        },
        download_app:{
            "samba": false,
            "dlna" : false
        },
        init:function(){
            current_html = "store_share";
            this.add_event_list();
            this.init_store_share();
            this.init_store_share_loop()
        },
        init_store_share:function(){
            var me = this;
            me.init_install();
        },
        init_store_share_loop:function(){
            var _this = this;
            if (_this.loop_timer)
                clearInterval(_this.loop_timer);
            _this.loop_timer = setInterval(function () {
                if (current_html === "store_share") {
                    _this.init_store_share();
                }
                else {
                    clearInterval(_this.loop_timer);
                }
            }, 3000);
        },
        init_all_app_data:function(){
            var me = this,parm = {};
			parm.action="get_app_list";
			parm.list_mark="1";
            var deferred = $.Deferred();
            $.post(me.url.all_app,parm,function(data){
                data = dataDeal(data);
                if(data.length){
                    deferred.resolve({app_list:data});
                }
            })
            return deferred.promise();
        },
        init_install:function(){
            var me = this,
                install_samba = 0,
                install_dlna = 0;//默认没有安装不可用
            var data = [];
            $.when(me.init_all_app_data()).then(function(value){
				data = value["app_list"];
				for(var i = 0,len = data.length; i < len;i++){
					if(data[i].appsign == "samba"){
						install_samba = 1;
					}
					if(data[i].appsign == "dlna"){
						install_dlna = 1;
					}
				}
                me.init_samba_dlna("samba",install_samba);
                me.init_samba_dlna("dlna",install_dlna);
            });
        },
        radio_set:function(key,id){
            if(key == "1"){
                $("#" + id).removeClass("radio_off").addClass("radio_on");
            }
            else{
                $("#" + id).removeClass("radio_on").addClass("radio_off");
            }
            $("#"+ id +"_hidden").val(key);
        },
        enable_app:function(flag){
            var that = this,
                L_status = "",
                status = "0";   //默认共享关闭

            that.enable(flag);

            var parm = "action=get";
            $.post(that.url[flag],parm,function(data){
                data = dataDeal(data);
                status = data.is_enable;
                if(!that.clicked_toggle[flag]){
                    that.radio_set(status,flag+"_status");
                }
            })
            L_status = L_store_mange[flag+"_1"];
            $("#"+flag+"_tips").html(L_status);
        },
        disable_app:function(flag){
            var that = this,
                L_status = "";
            that.clicked_toggle[flag] = false;

            that.disable(flag);

            that.radio_set("0",flag+"_status");
            L_status = L_store_mange[flag+"_0"];
            $("#"+flag+"_tips").html(L_status);
        },
        init_samba_dlna:function(flag,install_flag){
            var that = this;
            var is_install = function(flag,install_flag){
                if(!!install_flag){
                    that.enable_app(flag);
                }else{
                    that.disable_app(flag);
                    if(!that.download_app[flag]){
                        that.getLoadInfoLoop();
                    }
                }
            }
            is_install(flag,install_flag);
        },
        getLoadInfoData:function(){
            var me = this,
                parm = {action:"getpreloadinfo2"};
            var deferred = $.Deferred();
            $.post(me.url.loadinfo,parm,function(res){
                res = dataDeal(res);
                if(res.err_no == "0"){
                    deferred.resolve({app_list:res.data.info});
                }
            })
            return deferred.promise();
        },
        getLoadInfo:function(){
            var me = this,
                data = [];
            var set_load_info = function(flag,load_status){
                var L_status = "";
                //0：还没有开始安装1：下载中2：下载成功3：crc校验4：校验成功5：开始安装6：安装成功7：安装失败
                if(load_status == 1 || load_status == 2 ||load_status == 3 ||load_status == 4){
                    L_status = L_store_mange["download_ing"];
                    $("#"+flag+"_tips").html(L_status);
                }else if(load_status == 5){
                    L_status = L_store_mange["install_ing"];
                    $("#"+flag+"_tips").html(L_status);
                }else if(load_status == 6){
                    me.enable_app(flag);
                }else if(load_status == 7){
                    L_status = L_store_mange["install_error"];
                    $("#"+flag+"_tips").html(L_status);
                }

                if(load_status == 6 || load_status == 7){
                    me.download_app[flag] = true;
                }else{
                    me.download_app[flag] = false;
                }
            }
           $.when(me.getLoadInfoData()).then(function(value){
				data = value["app_list"];
				for(var k = 0,len = data.length; k < len;k++){
					if(data[k].app_sign == "samba"){
						set_load_info("samba",data[k]["load_status"]);
					}
					if(data[k].app_sign == "dlna"){
						set_load_info("dlna",data[k]["load_status"]);
					}
				}
                if(me.download_app["samba"] && me.download_app["dlna"]){
                    me.init_store_share_loop();
                    me.loop_timer_load && clearInterval(me.loop_timer_load);
                }

            });
        },
        getLoadInfoLoop:function(){
            var _this = this;
                _this.loop_timer && clearInterval(_this.loop_timer);
                _this.loop_timer_load && clearInterval(_this.loop_timer_load);
            _this.loop_timer_load = setInterval(function () {
                if (current_html === "store_share") {
                    _this.getLoadInfo();
                }
                else {
                    clearInterval(_this.loop_timer_load);
                }
            }, 3000);
        },
        add_event_list:function(){
            this.bind_event_click_tab();
        },
        bind_event_click_tab:function(){
            var that = this;
            $("#store_type_layer").off("click").on("click",".tab-item",function(){
                var me = $(this),
                    index = me.index(),
                    container = $(".tab_item_container");
                    if(store_manage.enable_app){
                        me.siblings(".tab-item").removeClass("on").end().addClass("on");
                        container.eq(index).removeClass("section_hide").addClass("section_show")
                            .siblings(".tab_item_container").removeClass("section_show").addClass("section_hide");

                        if(index == 0){
							disk_sleep.hide();
                            store_manage.init();
                            that.clicked_toggle["samba"] = false;
                            that.clicked_toggle["dlna"] = false;
                        }else if(index == 1){
                            disk_sleep.show();
							disk_sleep.init();
							disk_sleep.data_loop();
							//app_samba_dlna.init();
                        }
                    }
            })
        },
        enable:function(flag){
            var that = this;
            var $btn =  $("#"+flag).find(".btn_save");
            var $radio = $("#"+flag).find(".radio_form");
            $btn.off("click."+flag).on("click."+flag,function(){
                that.submit_data(flag);
            })
            $radio.off("click."+flag).on("click."+flag,function(){
                that.radio_toggle(this,flag);
            });
            $btn.attr("disabled",false).removeClass("disabled");
            $(".app-"+flag).find(".app-logo").removeClass("logo-default").addClass("logo-"+flag);

        },
        disable:function(flag){
            var $btn =  $("#"+flag).find(".btn_save");
            var $radio = $("#"+flag).find(".radio_form");
            $btn.off("click."+flag);
            $radio.off("click."+flag);

            $btn.attr("disabled",true).removeClass("disabled").addClass("disabled");
            $(".app-"+flag).find(".app-logo").removeClass("logo-"+flag).addClass("logo-default");
        },
        radio_toggle:function(obj,flag){
            var that = this;
            that.clicked_toggle[flag] = true;
            radio_toggle(obj,function(){
                that.submit_data(flag);
            });
        },
        submit_data:function(flag){
            var that = this;
            var parm = igd.ui.form.collect(flag);
            show_message("save");
            that.loop_timer && clearInterval(that.loop_timer);
            $.post(that.url[flag],parm,function(data){
                data = dataDeal(data);
                if(data == "SUCCESS"){
                    show_message("success");
                }else{
                    //show_message("error", igd.make_err_msg(data));
					show_message("exception");
                }
                that.clicked_toggle[flag] = false;
                that.init_store_share_loop();
            })
        }
    }
	
	var disk_sleep = {
		timer:null,
		show:function(){
			 $("#disk_sleep").removeClass("section_hide");
		},
		hide:function(){
			$("#disk_sleep").addClass("section_hide");
		},
		data_init:function(){
			var me = this;
			$.post('/router/system_application_config.cgi', 'action=get_sleep_info', function (data) {
                data = dataDeal(data);
				$("#disk_sleep_time_sel").val(data.sleep_time);
				me.get_status(data.sleep_status);
            });
		},
		get_status:function(status){
			if(status == "1"){
				$("#run_status").html(L["storage_manage"]["run"]).addClass("run");
			}
			else{
				$("#run_status").html(L["storage_manage"]["sleep"]).addClass("sleep");
			}
		},
		data_loop:function(){
			var me = this;
            if (me.timer)
                window.clearInterval(me.timer);
            me.timer = window.setInterval(function () {
                if (current_html === "store_share") {
                    $.post('/router/system_application_config.cgi', 'action=get_sleep_info', function (data) {
						data = dataDeal(data);
						me.get_status(data.sleep_status);
					});
                }
                else {
                    window.clearInterval(me.timer);
                }
            }, 3000);
		},
		data_set:function(){
			var obj = igd.ui.form.collect("disk_sleep_frm");
			show_message("save");
			$.post('/router/system_application_config.cgi', obj, function (data) {
                data = dataDeal(data);
				if(data.result == "0"){
					 show_message("success");
				}
				else{
					 show_message("error",L["storage_manage"][-1]);
				}
            });
		},
		add_event:function(){
			var me = this;
			$("#disk_sleep .btn").off("click").on("click",function(){
				me.data_set();
			});
		},
		init:function(){
			this.add_event();
			this.data_init();
		}
	};

    function _init_store_manage() {
        app_samba_dlna.bind_event_click_tab();
        store_manage.init();
       // app_samba_dlna.init();
    }
    window.init_store_manage = _init_store_manage;
	window.store_manage = store_manage;
})(window);




