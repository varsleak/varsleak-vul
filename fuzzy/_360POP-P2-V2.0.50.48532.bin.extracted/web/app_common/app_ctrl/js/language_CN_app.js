/**
 * Created by lan on 2015/1/29.
 */
var languageApp = {};
languageApp.CN = {
    COMMON:{
        controlMessage:{
            c_suc:"操作成功!",
            s_suc:"设置成功!",
            c_fail:"操作失败！",
            s_fail:"设置失败！",
            a_suc:"添加成功！",
            a_fail:"添加失败！",
            d_suc:"删除成功！",
            d_fail:"删除失败！",
            e_suc:"修改成功！",
            e_fail:"修改失败！"
        },
        dialog:{
			use_wifi:"您当前为无线WiFi用户，开启防蹭网后将会断网，是否继续此操作？",
            del_single:"是否确定删除该条数据？",
            del_all:"请确认是否要清空全部数据？",
            cut_link:"请确认断开连接？"
        },
        Button:{
            edit:"修 改",
            add:"增 加",
            confirm:"确 定",
            cancel:"取 消",
            shut:"关 闭",
            del:"删 除",
            saving:"提交中..."
        },
        btnTitle:{
            edit:"修改",
            add:"增加",
            del:"删除",
            conf:"确认"
        },
        time:{
            day:"天",
            hour:"小时",
            min:"分钟",
            sec:"秒"
        },
        timeFull:{
            year:"年",
            month:"月",
            day:"日",
            hour:"时",
            min:"分钟",
            zhong:"钟",
            zhi:"制"
        },
        timeGroup:{
            time:"时间",
            fullDay:"全天",
            timeD:"时间段",
            timeG:"时间组",
            week:"星期",
            weekG:["星期一","星期二","星期三","星期四","星期五","星期六","星期日"]
        },
        lanUserGroup:{
            ipHost:"内网主机",
            allHost:"所有主机",
            speHost:"特定主机",
            hostSubIp:"主机子网",
            hostIpD:"主机IP段",
            lanIPTxt:{
                ip:"IP地址",
                mask:"子网掩码",
                startIp:"起始IP地址",
                endIp:"结束IP地址"
            }
        },
        wanUserGroup:{
            desHost:"目的主机",
            tip:"如：www.qq.com(精确匹配)或qq(模糊匹配)",
            dnsG:"DNS组",
            hostSubIp:"主机子网",
            hostIpD:"主机IP段",
            lanIPTxt:{
                ip:"IP地址",
                mask:"子网掩码",
                startIp:"起始IP地址",
                endIp:"结束IP地址"
            }
        },
        dnsUserGroup:{
            dns1:"DNS为：",
            dns2:"DNS组为："
        },
        portMode:{
            selectMode:"请选择模板",
            html:{
                proto_name:["协议及端口","协议及目的端口","外部端口"],
                src_port_label:["内部端口","源端口"],
                selectMode:"选择模板"
            }
        },
        timeSlotErrorTip:{
            startAndEnd: "结束时间不能和起始时间相等！",
            atLeastFiveMinute:"两时间段的间隔不得少于5分钟！",
            atLeastOneWeekDay:"请至少选择一个生效日期！"
        },
        other:{
            unknownDevice:"未命名设备",
            knull:"无"
        }
    },
    ERROR:{
        int:{},
        decimal:{},
        string:{},
        char:["请重新输入一个非空字符串","不能含有非法字符","不能含有中文字符"],
        pptp_l2tp:["请重新输入一个非空字符串","不能含有非法字符","和空格","不能含有中文字符"],
        ip:{ },
        in_ip:"IP地址应为LAN网段地址!",
        nin_ip:"IP地址应为LAN网段外地址! ",
        mac:{},
        mask:{},
        dns:{},
        hour:{},
        minute:{},
        url:{},
        ip_url:{},
        nin_ip_url:"服务器地址不能为空",
        password:{},
        password_blank:{},
        port:{},
        port0: ["端口不能为空!","端口不能含有非数字字符!","端口不能大于65535或小于0!"],
        prio: "优先级的范围应该在0到1000之间",
        pptp_connects: ["条目不能为空！","请输入1-","的数字！","请输入数字1"],
        l2tp_connects: ["条目不能为空！","请输入1-","的数字！","请输入数字1"],
        calendar: {},
		eq1_10:"数值应该为1至10之间",
		eq2_70:"数值应该为2至70之间",
        eq5: {},
        eq13: "请输入13个字符！",
        eq64: "请输入64个字符！",
        eq8_63: {},
        eq8_30: {},
		eq8_32: {},
        eq8_64: "请输入(8-64)个字符！",
        eq10: "请输入10个字符！",
        eq26: "请输入26个字符！",
        char16: "请输入数据!",
        ascii_base: "不能为空!",
        ascii_password: "密码不能为空!",
        ascii: ["不能含有中文字符!","不能含有除ASCII字符(A-Z,a-z,0-9)外的其它字符!"],
        update_min30: "更新周期最小值30，不更新为0！",
        udp_up:"范围应该在4到200之间",
		less100:"数值应该小于等于100",
		less12800:"数值应该小于等于12800",
        noneed:{},
        less32:"请输入小于32个字符！",
        less64:"请输入小于64个字符！",
        lastLength:"超出最大长度,已自动截短",
        start_end_ip:"起始IP大于结束IP",
        start_end_port:"起始端口不能大于结束端口",
        uiname_select:"不指定",
        time_week:"至少勾选一个星期选项！",
        time_group:"请至少勾选一个时间组！",
        user_group:"请至少勾选一个用户组！",
        dnsError:["当前的DNS组不存在，已自动切换到DNS！","当前的DNS组不存在，已自动切换到所有主机！"]
    },
    HTML:{
        anti_ddos:{
            hand_mode:{
                html:{
                    warning_count_txt:"DDoS是一种将多个计算机联合起来作为攻击平台，对一个或多个目标发动密集请求，达到让路由器和家庭网络内的服务器瘫痪的攻击方式。<br/>开启DDoS防火墙，可以防御内外部各种流量攻击。在能够正常上网的情况下，不需要完全开启高级攻击防护。",
                    form_label:[
                        "TCP SYN分片报文攻击保护",
                        "ICMP分片报文攻击保护",
                        "携带数据的TCP SYN攻击保护",
                        "UDP炸弹攻击保护",
                        "TCP Land攻击保护",
                        "UDP Land攻击保护",
                        "ICMP Land攻击保护",
                        "TearDrop攻击保护",
                        "ICMP数据包放大(ICMP Smurf)攻击保护",
                        "非法TCP标识报文攻击保护",
                        "未知IP类型报文攻击保护",
                        "死亡之PING(PING of Death)攻击保护",
                        "IP电子欺骗(IP Spoof)攻击保护"
                    ],
                    openPrevent:"已保护",
                    shutPrevent:"未开启",
                    openPreventBtn:"开启保护",
                    shutPreventBtn:"关闭保护( 推荐 )"
                }
            },
            set_state:{
                html:{
                    warning_count_txt:"DDoS是一种将多个计算机联合起来作为攻击平台，对一个或多个目标发动密集请求，达到让路由器和家庭网络内的服务器瘫痪的攻击方式。<br/>开启DDoS防火墙，可以防御内外部各种流量攻击。在能够正常上网的情况下，不需要开启所有DDoS防火墙功能。",
                    form_label:[
                        "硬件攻击防御",
                        "驱动攻击防御",
                        "操作系统攻击防御",
                        "应用攻击防御",
                        "禁止LAN到LAN的包",
                        "禁止WAN口响应ping包"
                    ],
                    nomalSetBtn:"常规设置(推荐)",
                    openAllBtn:"全部开启",
                    shutAllBtn:"全部关闭"
                }
            },
            js:{
				status:["未开启","已开启"],
                tabTitle:["基本攻击防护","高级攻击防护"]
            }
        },
        arp_oversee:{
            arp_inspect:{
                html:{
                    warning_count_txt:"家庭内部的电脑和手机被ARP病毒感染，可能造成家庭网络中的某些电脑和手机上网特别慢或者频繁掉线。<br/>为了您的上网流畅，请开启家庭网络防火墙。",
                    box_title:["ARP攻击防御","ARP监控列表"],
					form_label:["ARP攻击防御","发送广播免费ARP","防止IP/MAC被盗用"],
                    selectOption:["所有ARP信息","内网ARP信息","外网ARP信息"],
					/*arp_rate_check:"(建议仅在内网存在ARP欺骗时开启)",*/
                    arp_rate_dw:"包 / 秒",
					saveBtn:"保存生效",
                    bindALL:"绑定全部",
                    cleanAll:"清空所有"
                }
            },
            filter_arp:{
                html:{
                    warning_count_txt:"家庭内部的电脑和手机被ARP病毒感染，可能造成家庭网络中的某些电脑和手机上网特别慢或者频繁掉线。<br/>为了您的上网流畅，请开启家庭网络防火墙。",
                    box_title:["IP/MAC绑定","IP/MAC绑定列表"],
                    form_label:["IP地址","MAC地址","备注","接口"],
                    addBtn:"增加",
                    modify_cancel:"取消修改",
                    delAll:"删除全部"
                }
            },js:{
                tabTitle:["IP/MAC绑定","ARP攻击防御"],
                arp_inspect_tab_head:["序列号","IP地址","MAC地址","类型","接口","备注","操作"],
                status:["动态","静态"],
                bindStatus:["绑定","取消绑定"],
                unknown:"未知",
                filterArpTab:["序列号","IP地址","MAC地址","规则来源","接口","备注","操作"],
                setMode:{
                    hand:"手动添加",
                    auto:"自动绑定",
                    file_out:"文本方式导出ARP",
                    file:"文本方式导入ARP",
                    auto_undo:"取消自动绑定"},
                arpMessage:"发送广播免费ARP的值为1-10的数值"
            }
        },
        baby_mode: {
            index: {
                html: {
                    waiting_list_title: "选择你要管理的手机和电脑",
                    infoTip: "宝贝的手机和电脑<strong class=\"device-name-title\"></strong>",
                    boyTxt: "宝贝是男孩",
                    girlTxt: "宝贝是女孩",
                    limitTimeTip: "禁止宝贝的上网时间",
                    timeGroup: "时间段：",
                    weekRepeat:"生效日期：",
                    submit_btn: "确 定",
                    cancel_btn: "取 消"
                }
            },
            js: {
                camera: "360智能摄像机",
                router: "360安全路由器",
                cancel_baby_mode: "取消儿童模式",
                manageOnline: "添加禁止上网时间",
                babyModeListTxt: "选择你要管理的手机和电脑",
                setBabyMode: "设置儿童模式",
                noBabyModeFamilyTxt: "没有非儿童模式的家庭设备！",
                status_btn:["启用","禁用"],
                opt_btn:["修改","删除"],
				babyModeLimitTip:"您所设置的儿童设备已达到上限！",
                showAcrossText:"次日"
            }
        },
        dns_tramper:{
            js:{
                    shutInfo:"已关闭上网劫持防火墙！",
                    shutDetail:"应用开启网址安全检测功能后，自动和360安全体系联动，快速发现并拦截假冒网购、网银等钓鱼网站和木马病毒网页，避免银行卡账号、个人隐私泄露，实现整网防钓鱼、防木马。<br/>为了您的上网安全，请务必开启网址安全检测功能！",
                    openInfo:"已开启上网劫持防火墙！",
                    openDetail:"应用开启网址安全检测功能后，自动和360安全体系联动，快速发现并拦截假冒网购、网银等钓鱼网站和木马病毒网页，避免银行卡账号、个人隐私泄露，实现整网防钓鱼、防木马。<br/>为了您的上网安全，请务必开启网址安全检测功能！",
                    shutWallTip:"您确定要关闭上网劫持防火墙?",
                    preventSec1:"已累计保护",
                    openPrevent:"开启保护",
                    dns_shutDetail:"DNS被恶意劫持，遭受攻击的用户不仅会受到弹窗广告的骚扰，降低打开网站的速度，还可能出现输入正确的网址却进入了钓鱼网站的情况。开启上网劫持防火墙，路由器会自动监测和修复被篡改的DNS，有效阻止恶意广告弹出，防止网购时被劫持到钓鱼网站和挂马网站。为了您的上网安全，请开启上网劫持防火墙。",
                    dns_openDetail:"DNS被恶意劫持，遭受攻击的用户不仅会受到弹窗广告的骚扰，降低打开网站的速度，还可能出现输入正确的网址却进入了钓鱼网站的情况。开启上网劫持防火墙，路由器会自动监测和修复被篡改的DNS，有效阻止恶意广告弹出，防止网购时被劫持到钓鱼网站和挂马网站。为了您的上网安全，请开启上网劫持防火墙。"
            }
        },
        group_manager:{
            dns_group:{
                html:{
                    dnsName:"名称",
                    groupTxt:"DNS组名单",
                    dns_group_foot:"当前：<span>0</span>条，还剩：<span>200</span>条",
                    li:["各组名单之间需回车换行。","格式如下："],
                    save:"确　定",
                    cancel:"取　消",
                    frame_head:"DNS组列表",
                    delAllBtn:"删除全部"
                }
            },
            ip_group:{
                html:{
                    ipGroupName:"名称",
                    ipGroupText:"IP用户组名单",
                    ip_group_foot:"当前：<span>0</span>条，还剩：<span>200</span>条",
                    li:["各组名单之间需回车换行。","格式如下："],
                    save:"确　定",
                    cancel:"取　消",
                    frame_head:"IP用户组列表",
                    delAllBtn:"删除全部"
                }
            },
            mac_group:{
                html:{
                    ipGroupName:"名称",
                    ipGroupText:"MAC用户组列表",
                    ip_group_foot:"当前：<span>0</span>条，还剩：<span>200</span>条",
                    li:["各组名单之间需回车换行。","格式如下："],
                    save:"确　定",
                    cancel:"取　消",
                    frame_head:"IP用户组列表",
                    delAllBtn:"删除全部"
                }
            },
            time_group:{
                html:{
                    timeGroupName:"名称",
                    timeGroupType:"时间段类型",
                    weekSetTxt:"按周设置",
                    daySetTxt:"按日期设置",
                    monthSetTxt:"按月设置",
                    timeGroupSet:"时间段设置",
                    addTimeGtxt:"添加新的时间段",
                    mac_group_foot:"当前：<span>0</span>条，还剩：<span>200</span>条",
                    li:["各组名单之间需回车换行。","格式如下："],
                    save:"确　定",
                    cancel:"取　消",
                    frame_head:"时间组列表",
                    delAllBtn:"删除全部"
                },
                alt:{
                    addBtnImg:"添加新的时间段"
                }
//                ,
//                title:{
//                    addBtnImg:"添加新的时间段"
//                }
            },
            url_group:{
                html:{
                    urlGroupName:"名称",
                    urlGroupText:"URL组名单",
                    url_group_foot:"当前：<span>0</span>条，还剩：<span>200</span>条",
                    li:["各组名单之间需回车换行。","格式如下："],
                    save:"确　定",
                    cancel:"取　消",
                    frame_head:"URL组列表",
                    delAllBtn:"删除全部"
                }
            },
            js:{
                tabTitle:["DNS组","URL组","MAC用户组","IP用户组","时间组"]
            }
        },
        host_monitor:{
            html:{
                box_title:["实时监控","家庭网络中的设备信息","主机连接详细信息"],
                form_label:["内网活动主机数:","连接数:","WAN上行/下行速度(B/s):","上行/下行总流量(B):"],
                th:[
                    "名称","设备IP/MAC","连接数","上行速度","下行速度","上行总流量","下行总流量","在线时间","名称","主机IP/MAC","连接数","上行速度","下行速度","上行总流量","下行总流量","在线时间","协议","目的地址","源端口","目的端口","上行流量","下行流量","上行速率","下行速率","外出接口","操作"
                ],
                skipFirstPage:"首页",
                skipFrontPage:"上一页",
                skipNextPage:"下一页",
                skipLastPage:"末页",
                maxNumShow:"最大显示数量:",
                del:"删除全部",
                refresh:"刷&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;新",
                stop_refresh:"停止刷新",
                return_but:"返回",
                currentHostLineInfo:"当前主机连接信息"
            },
            js:{
                isFirstPage:"已经是首页了！",
                isLastPage:"已经是最后一页了！",
                deviceNum:"设备数：",
                lineNum:"连接数：",
                delBtnTitle:"删除",
                lookFor:"查看",
                maxNumError:[
                    "请重新输入一个0-20的非空整数!","不能含有非数字字符!","请重新输入一个0-20的非空整数!"
                ]
            }
        },
        igd_ap:{
            ap: {
                html: {
                    form_label: [
                        "朋友专享网络状态", "无线网络名称(SSID)", "访客认证模式", "认证密码", "", "SSID 显示状态", "无线间隔离", "自动关闭", "访客网络限速开关", "访客网络上行", "访客网络下行", "访客接入数量", "认证页面自定义", "认证图片"
                    ],
                    ap_auto_set: "启用（无人使用时关闭）",
                    lbl_ssid_broadcast:"隐藏网络名称",
                    noLimitPass: "无需认证",
                    //webLimitPass: "网页认证",
                    pwdLimitPass: "密码认证",
                    touchLinkPass: "摩擦认证",
                    view: "效果预览",
                    custom: "个性化设置>>",
                    wifi_tip: "开启WiFi的时间在WiFi定时关闭时间内，您可以在<a href=\"javascript:void(0);\">WiFi定时关闭</a>页面修改WiFi关闭时间",
                    save_btn: "保存生效"
                }
            },
            ap_list:{
                html:{
                    refresh:"刷新"
                }
            },
            js: {
                imageFormatErr: "<div style=\"line-height:2; padding:20px 0;\">你选择的图片格式不正确，请重新上传<div style=\"color:#FF3D3E\">目前支持jpg/jpeg/bmp/png格式</div></div>",
                view: "请选择上传图片",
                nameTooLange: "图片名称过长",
                tooLargeHost: "过多的无线接入，会影响到无线网络本身的质量",
                apTitle: ["朋友专享网络设置", "无线连接列表"],
                ssidStr: ["SSID不能为空", "SSID的长度需小于32位"],
                apListHead: ["序列号","主机名","MAC地址", "模式", "发送速率", "接收速率", "连接时间"],
                lbl_pass: "上网密码",
                btn: "一键上网",
                welcome: "欢迎来到",
                answerNotNull: "答案不能为空",
                file_type: "",
                pwdNotBlank: "密码不能全为空格",
                auth: ["认证成功！", "认证失败！", "认证中…"],
                authError: ["数据错误！", "[密码错误,您还有", "次机会！]"],
                hasAuthCount: ["您输入密码错误已达到5次，请您", "后再试......"],
                customQuestion: "自定义问题",
                refreshing: "正在刷新......"
            }
        },
        igd_wisp:{
            html:{
                box_title:["WISP设置","附近的无线网络"],
                form_label:[
                    "WISP网络","自动切换WISP接入点","接入SSID","连接状态","连接时间"
                ],
                //apSearch:"搜索WiFi（支持无线隐藏网络）",
                apSearch:"搜索WiFi",
                hide_list:"隐藏列表",
                wisp_pop_tip:"WISP设置",
                lbl_ssid:"无线网络名称(SSID) ",
                lbl_pwd:"设置密码",
                wisp_con_btn:"连接",
                wisp_del_btn:"删除",
                wisp_mod_btn:"修改"
            },
            value:{
                btn_confirm:"确定"
            },
            js:{
                status:[
                    "未连接","连接成功","连接失败，请确认连接的无线网络密码是否正确","正在拼命连接中"
                ],
                hiddenSSID:"隐藏网络",
                inputSSID:"请输入隐藏SSID",
                getIp:"获取IP",
                wait:"正在扫描附近的无线网络...",
                getApSuccess:"获取无线网络成功!",
                getApFailure:"获取无线网络失败!",
                wispListHead:[
                    //"序列号","无线网络名称","Bssid","信道","安全模式","信号","连接"
                    "序列号","无线网络名称","MAC地址","信道","安全模式","信号","连接","操作","状态"
                ],
                noLink:"未连接",
                s_link:"连接",
                s_linked:"已连接",
                saved:"已保存",
                edit:"编辑",
                modify:"修改",
                s_delete:"删除",
                edit_pwd:"修改密码"
            }
        },
        l2tp_client:{
            client_set:{
                html:{
                    form_label:["状态","服务器地址","用户名","密码","NAT","模式","服务器网段","服务器掩码"],
                    status:["启用","禁止"],
					lbl_vpn:"本地流量不走VPN，你懂吗？",
                    serverIPTip:"(可输入域名和IP地址)",
                    isOnNat:"是否启动NAT",
                    ISPMode:"ISP模式",
                    companyMode:"企业模式",
                    ISPModeInfo:"ISP模式：在远程网络上使用默认网关，代理内网用户访问Internet。",
                    companyModeInfo:"企业模式：通过L2TP隧道实现在隧道两端企业内网访问。",
                    interface:"接口",
                    save_btn:"增  加",
                    cancel_btn:"取消修改",
                    box_title:"L2TP客户端设置列表",
                    delAllBtn:"删除全部"
                }
            },
            status_client:{
                html:{
                    box_title:"L2TP客户端状态列表",
                    refreshBtn:"刷 新"
                }
            },
            js:{
                tabTitle:["L2TP客户端设置","L2TP客户端状态"],
                clientTabHead:["序列号","状态","服务器地址","用户名","密码","操作"],
                clientTabBtn:["添加","删除","修改","操作"],
                success:"成功！",
                status:["启用","禁止"],
                dialog:"请确认断开连接？",
                clientStatusTabHead:["序列号","用户名","连接状态","本地IP地址","对端IP地址","操作"],
                linkStr:["连接","断开"]
            }
        },
        oray_ddns:{
            html:{
                form_label:["动态域名服务(DDNS)状态","动态域名服务商","用户帐号","密码","状态信息"],
                orayName:"花生壳",
                saveBtn:"保存生效"
            },
            js:{
                ddns_map:{
                    DDNS_STATE_START: "正在连接中……",
                    DDNS_STATE_AUTH_FAILED: "认证失败，请核对你的帐号信息重新输入。",
                    DDNS_STATE_DOMAIN_FAILED: "更新失败，无法获取域名信息。",
                    DDNS_STATE_INPUT_ERR: "输入不完整，请核对你的帐号信息重新输入。",
                    DDNS_STATE_NO_MUDLE: "没有该功能。",
                    DDNS_STATE_START_WEB: "正在连接WebService……",
                    DDNS_STATE_EXIT: "意外退出",
                    DDNS_STATE_OK: "连接成功。",
                    DDNS_STATE_NODDNS_FAILED: "认证失败，无法获取域名信息。",
                    DDNS_STATE_AUTH_OK: "连接成功。"
                },
                urlName:"域名："
            }
        },
        portmap:{
            dmz:{
                html:{
                    box_title:["DMZ列表","<span id=\"title\"></span> DMZ配置","DMZ配置参数","DMZ配置列表"],
//                    setupBtn:"配置",
                    th:["序列号","接口","DMZ主机IP地址","状态","操作"],
                    form_label:["DMZ 状态","DMZ主机IP地址","DMZ主机IP地址","外网主机IP地址","外网主机掩码","外出WAN口"],
                    saveBtn:"保存生效",
                    dmz_return:"返&nbsp;&nbsp;回"
                }
            },
            virtual:{
                html:{
                    form_label:["虚拟服务名称","内网主机IP地址","接口"],
                    save:"确　定",
                    cancel:"取　消",
                    box_title:"虚拟服务器列表",
                    delAllBtn:"删除全部"
                }
            },
            js:{
                tabTitle:["虚拟服务器","DMZ设置"],
                controlMessage:"内部端口数量应和外部端口数量一致",
                virtualServiceList:["序列号", "虚拟服务名称", "内网主机IP地址", "协议", "外部端口", "内部端口", "操作"],
                dialog:["请确认是否要删除此条记录？","请确认是否要清空全部记录？"],
                openStatus:["开启","关闭"]
            }
        },
        power_progress: {
            html: {
                highTxt: "P+内核信号增益已开，手机WiFi信号较弱时自动增强发射功率，家中信号死角地区也能畅快上网",
                middleTxt: "WiFi发射功率50%，既能轻松上网，又能降低辐射",
                lowTxt: "2%的WiFi发射功率，准妈妈再也不用担心辐射问题",
                lowModeTxt: "孕妇模式",
                text_middle: "均衡模式",
                text_high: "穿墙模式",
                lbl_table_title:"调节时间段列表<span style='color: red;margin-left:5px;font-size: 12px;'>(不在规则内，将默认为穿墙模式)</span>",
                lbl_add_btn:"新增",
                lbl_add_frm_title:"定时调整信号强度",
                lbl_time_slot:"开启时间段",
                lbl_week_slot:"生效日期",
                lbl_power_progress_mode:"模式选择",
                add_btn: "添加",
                cancel_edit_btn:"取消"
            },
            js: {
                des: "json解析有误",
                status_btn:["启用","禁用"],
                timeSlotTabHead:["序列号","调节时间段","调节日期","模式","操作"],
                addBtn:["修改","添加"],
                setTip:"设置后，您的规则将会被禁用，是否继续？",
                limitNumTip:"最多只能添加6条规则"
            }
        },
        pptp_client:{
            pptp_client_setup:{
                html:{
                    form_label:[
                        "启动状态","服务器地址","服务器端口","用户名","密码","数据加密","NAT","模式","接口","服务器网段","服务器掩码"
                    ],
					lbl_vpn:"本地流量不走VPN，你懂吗？",
                    openPptpClient:"启用",
                    shutPptpClient:"禁止",
                    serverAddrTip:"(可输入域名和IP地址)",
                    setMppeTip:"启用128-bit数据加密",
                    openNAT:"启动NAT",
                    ISPMode:"ISP模式",
                    companyMode:"企业模式",
                    save:"增  加",
                    cancel:"取　消",
                    box_title:"PPTP客户端设置列表",
                    delAll:"删除全部"
                }
            },
            pptp_client_status:{
                html:{
                    box_title:"PPTP客户端状态列表",
                    refresh:"刷新"
                }
            },
            js:{
                tabTitle:["PPTP客户端设置","PPTP客户端状态"],
                pptpClinetFlag:["启用","禁止"],
                pptpClientSetupList:["序列号","状态","服务器地址","端口","用户名","密码","加密","操作"],
                changeInfo:["确定关闭该条规则？","确定开启该条规则？"],
                linStr:["连接","断开"],
                pptpClientStatusList:["序列号","用户名","连接状态","本地IP地址","对端IP地址","操作"],
                shutLink:"请确认断开连接？"
            }
        },
		igd_wakeup:{
			html:{
				wakeup_title:"新增条目",
				name:"别名",
				mac:"MAC",
				confirmBtn:"确定",
				add:"新增",
				wakeup_tip:"请确保您待唤醒的电脑和路由器在同一个交换网络下，并确保电脑BIOS或网卡参数设置正确",
				"box-title":"网络唤醒列表"
			},
			js:{
				wakeupList:["别名","MAC","状态","操作"],
				wakeState:["未唤醒","唤醒中","已唤醒","唤醒失败","唤醒"],
				unknownDevice:"未命名设备"
			}
		},
        qh_360:{
            js:{
                shutInfo:"已关闭恶意网址防火墙！",
                shutDetail:"360拥有世界上最全的恶意网址库，实时更新，从源头拦截挂马、钓鱼、欺诈、虚假等恶意网址。开启恶意网址防火墙，路由器将自动为您拦截微信、微博和网页中的恶意网址和欺诈网址，保护淘宝、支付宝等网购账户的安全。为了您的上网安全，请务必开启恶意网址防火墙。",
                openInfo:"已开启恶意网址防火墙！",
                openDetail:"360拥有世界上最全的恶意网址库，实时更新，从源头拦截挂马、钓鱼、欺诈、虚假等恶意网址。开启恶意网址防火墙，路由器将自动为您拦截微信、微博和网页中的恶意网址和欺诈网址，保护淘宝、支付宝等网购账户的安全。为了您的上网安全，请务必开启恶意网址防火墙。",
                shutWallTip:"您确定要关闭恶意网址防火墙?",
                preventSec1:"已累计保护",
                preventOnTip:"开启保护",
                line:"条"
            }
        },
        qos_limit:{
            index:{
                html:{
                    box_title:["所有未定义的主机带宽控制","主机带宽控制设置","主机带宽控制列表"],
                    form_label:["上传速度","下传速度","最大连接数","状态","命名","优先级","单个IP限速","所有IP总限速","最大连接数"],
                    speedTip:"(0为不受限制)",
                    saveBtn:"保　存",
                    enableT:"开启",
                    enableF:"关闭",
                    prioTip:"(数字越小优先级越高,范围0-1000)",
                    uploadTxt:"上传:",
                    downloadTxt:"下载:",
                    default_link:"高级设置>>",
                    save_button:"确　定",
                    cancel_button:"取　消",
                    delAllBtn:"删除全部"
                }
            },
            js:{
                ddns_map:{
                    DDNS_STATE_START:"正在连接中……",
                    DDNS_STATE_AUTH_FAILED:"认证失败，请核对你的帐号信息重新输入。",
                    DDNS_STATE_DOMAIN_FAILED:"更新失败，无法获取域名信息。",
                    DDNS_STATE_INPUT_ERR:"输入不完整，请核对你的帐号信息重新输入。",
                    DDNS_STATE_NO_MUDLE:"没有该功能。",
                    DDNS_STATE_START_WEB:"正在连接WebService……",
                    DDNS_STATE_EXIT:"意外退出",
                    DDNS_STATE_OK:"连接成功。",
                    DDNS_STATE_NODDNS_FAILED:"认证失败，无法获取域名信息。",
                    DDNS_STATE_AUTH_OK:"连接成功。"
                }
            }
        },
        safety_wireless:{
            index:{
                html:{
                    initTitle:"防蹭网"
                }
            },
            safety_black:{
                html:{
                    delAllBtn:"全部删除"
                }
            },
            safety_white:{
                html:{
                    warningCountTxt1:"被蹭网不仅仅导致带宽被占、网速变慢，同时内网信息也被暴露，微信、微博、上网等信息变的不安全。开启防蹭网防火墙后，<br/>手机和电脑连入WiFi时，还需要回答预设的问题才能上网。WiFi密码被破也不怕被蹭网了。",
                    warningCountTxt2:"温馨提示：手动认证前，请您检查并确认设备是否是非法蹭网用户。",
                    AllAllow:"全部放行",
                    AllForbid:"全部禁止"
                }
            },
            safety_wireless:{
                html:{
                    warningCountTxt:"被蹭网不仅仅导致带宽被占、网速变慢，暴露内网信息，而且微信、微博、上网等信息变得不安全。开启防蹭网防火墙功能，<br/>手机和电脑连入WiFi后，打开浏览器并输入任意网址，根据提示回答问题正确后上网。<br/>为了您的网络安全，请妥善保管密码保护问题和答案！ <strong style=\"color: red\">(该功能仅对连接主SSID的无线用户有效)</strong>",
                    form_label:["状态","密码保护问题","自定义问题","密码保护答案","","未认证用户禁止访问路由器","未认证用户禁止访问有线电脑"],
                    allowOpenBtn:"启用",
                    qh_360_wireless_btn2:"确定",
                    btn_text:"高级设置&gt;&gt;"
                }
            },
            safety_redirection: {
                html: {
                    noticeFirst: "请您根据密码保护问题提示，输入正确答案，回答正确后才能正常上网。",
                    noticeSec: "如果回答错误，将会被安全路由当成蹭网嫌疑用户！",
                    title: "360安全路由",
                    form_label: ["密码保护问题：", "密码保护答案："],
                    form_error: "密码不能为空！",
                    authing: "认证中……",
                    rem_answerTxt: "记住答案",
                    failure_tip: "您输入密码已错误5次，请您稍后再试！"
                },
                value: {
                    confirm_btn: "确 认"
                },
                title: "360防蹭网保护"
            },
            js: {
                customQuestion: "自定义问题",
                tabTitle: ["防蹭网", "防蹭网白名单", "防蹭网黑名单"],
                authType: ["密码认证", "手动认证", "未认证"],
                white_list: ["序列号", "主机名", "MAC地址", "认证情况", "操作"],
                whiteListBtn: ["认证", "取消认证", "添加黑名单"],
                black_list: ["序列号", "MAC地址", "操作"],
                blackListBtn: "添加到白名单",
                answerStr: ["请输入正确的手机号码后6位！", "请输入正确的数字！", "请输入正确的QQ号码！"],
                auth: ["认证成功！", "认证失败！"],
                authError: ["数据错误！", "[密码错误,您还有", "次机会！]"],
                hasAuthCount: ["您输入密码错误已达到5次，请您", "后再试......"],
                refreshing: "正在刷新......"
            }
        },
        security_pwd:{

        },
        smartqos:{
            qos_advance:{
                html:{
                    form_label:["启用私有IP跳过QoS","网页、游戏转发队列","网页视频转发队列","每IP UDP上传速率","WAN线路预留带宽"],
                    private_skip_tip:"(当外网口接入运营商存在私有网络时,可更好利用运营商内网私有IP资源)",
                    udp_up_len_tip:"(用于限制P2P上传，范围为：4-200，0为不受限制)",
                    mr_13:"上行",
                    m_rl:"下行",
                    li:["默认所有主机的保证带宽在队列2中转发",
                        "数据转发队列：分为8个队列，队列值越小的数据包会越优先转发。",
                        "保证带宽：队列至少使用的带宽百分比。",
                        "最大带宽：队列能使用的最大带宽百分比。如果最大带宽和保证带宽值一样，那么该队列不能借用其他队列带宽",
                        "默认所有数据都进入队列5转发，网页、小包、小流量具有优先转发权"],
                    th:["数据转发队列","保证带宽(%)","最大带宽(%)"],
                    save_btn:"保存生效"
                }
            },
            qos_priority:{
                html:{
                    form_label:["状态","规则名称","优先级","数据转发队列"],
                    enableTrue:"开启",
                    enableFalse:"关闭",
                    tip:["(0-1000.数字越小优先级越高)","(数字越小,包越先转发)"],
                    save_button:"增&nbsp;加",
                    cancel:"取消修改",
                    box_title:"规则列表",
                    delAll:"删除全部"
                }
            },
            qos_set:{
                html:{
                    form_label:["智能QoS状态","带宽预设"],
                    option:["请选择您的带宽","ADSL 1M","ADSL 2M","ADSL 3M","ADSL 4M","ADSL 6M","ADSL 8M","ADSL 10M","ADSL 12M","ADSL 15M","ADSL 20M","光纤 2M",
                        "光纤 3M","光纤 4M","光纤 5M","光纤 6M","光纤 7M","光纤 8M","光纤 9M","光纤 10M","光纤 20M","光纤 30M","光纤 40M","光纤 50M","光纤 60M",
                        "光纤 70M","光纤 80M","光纤 90M","光纤 100M","自定义带宽上下行"],
                    mr_20:["网络上行","网络下行"],
                    save_btn:"保存生效"
                }
            },
            js:{
				r_lte_m:"保证带宽需小于等于最大带宽",
				m_gte_r:"最大带宽需大于等于保证带宽",
                tabTitle:["QoS设置","分配规则","高级设置"],
                linkStr:["禁用","启用"],
                qosPriorityHead:["序列号", "优先级", "规则名", "操作"],
                dialogStr:["确定","该条规则？"]
            }
        },
		led_ctrl: {
            html: {
                "box-title": ["定时关闭指示灯","定时关闭指示灯列表"],
                form_label: ["定时关闭指示灯"],
                mr_20: ["关闭时间段", "生效日期"],
                add_btn: "添加",
                cancel_edit_btn:"取消"
            },js:{
                timeSlotTabHead:["序列号","关闭时间段","关闭日期","操作"],
                save_btn:["修改","添加"],
                status_btn:["启用","禁用"],
                setNumLimit:"您所设置的时间段条数已达到上限！",
				startAndEnd: "结束时间不能和起始时间相等！"
            }
        },
		ap_timer: {
            html: {
                "box-title": ["定时关闭WiFi","定时关闭WiFi列表"],
                form_label: ["定时关闭WiFi", "关闭日期"],
                card: ["日", "一", "二", "三", "四", "五", "六"],
                time_label: ["时", "分", "时", "分"],
                mr_20: ["关闭时间段", "生效日期"],
                ntp_layer: "<p>温馨提示：路由器时间和网络时间未同步，定时关闭WiFi暂时无法生效。</p><p class=\"ti5\">您可能需要连接互联网来同步时间。</p>",
                add_btn: "添加",
                cancel_edit_btn: "取消"
            },
            js: {
                timeSlotTabHead:["序列号","关闭时间段","关闭日期","操作"],
                save_btn:["修改","添加"],
                status_btn:["启用","禁用"],
                setNumLimit:"您所设置的时间段条数已达到上限！"
            }
        },
		auto_wan_lan:{
			html:{
				form_label:["WAN-LAN自适应状态"],
				detect_tip:"正在为您自动适配WAN口...<br/>请勿动网线关系"
			},
			js:{
				tips:["当前网口已全部重置为LAN口，请勿动网线关系。","WAN-LAN自适应已开启，黄色标注网口为WAN口。","WAN-LAN自适应关闭，黄色标注网口为默认WAN口。"],
				error:"适配失败，5s自动开启下次适配"
			}
		},
		ruijie:{
			ruijie_set:{
				html:{
					form_label:["锐捷认证","上网方式","用户名","密码","MAC地址","IP地址","子网掩码","默认网关","主DNS","从DNS","组播","DHCP方式"],
					wan_mode_type1:"动态IP",
                    wan_mode_type2:"静态IP",
					normal:"0(标准)",
					spe:"1(锐捷)",
					auth_2nd:"1(二次认证)",
					auth_before:"2(认证前)",
					auth_after:"3(认证后)",
					btn_clone_mac:"MAC地址克隆",
					btn_recover_mac:"恢复缺省MAC",
					word_sep:"(可选)",
					save:"保存生效"
				}
			},
			ruijie_log:{
				html:{
					ruijie_log_refresh_btn:"刷新",
					ruijie_log_del_btn:"删除"
				}
			},
			js:{
				tabTitle:["锐捷认证","日志记录"],
				no_use:"0(不使用)",
				log_null:"当前无任何日志条目",
				ruijie_log_list:["序列号","时间","事件描述"]
			}
		},
		hosts: {
            html: {
                host_tip: "自定义Host示例：<span id=\"host_example\">106.120.167.66&nbsp;&nbsp;&nbsp;www.360.cn</span>",
                lbl_ck_host: "自动删除格式错误条目",
                host_ip: "IP",
                host_url: "网址",
                save_btn: "保存",
                clear_btn: "清空"
            },
            js: {
                auto_delete: "格式错误的条目将会被自动删除",
                init_data: "正在初始化数据，请稍后……",
                index: "第",
                line: "行",
                single: "个",
                word: "字",
                max_input: "最多可以输入",
                has_input: "您已输入",
                in_domain: "域名中",
                url_single_len_err: "域名每段长度不超过63",
                url_segments_eq5_err: "域名段数不能超过5",
				url_segments_eq1_err: "域名段数不能等于1",
                url_max_len_err: "域名总长度不能超过63",
                max_letter_err: "总长度不能超过255",
                host_format_err: "HOSTS文件格式错误",
                max_len_err: "条目数超过1000，请重新输入！"
            }
        },
		igd_sw:{
			html:{
				start_tip:"请您先用网线把新老路由器WAN口对接",
				link_down_tip:"检测到WAN口未对接！<br/>请您先用网线把新老路由器WAN口对接",
				link_down_tip_retry:"网线已断开<br/>请连接好网线再重新尝试一键换机上网",
				wait_msg:"检测中…",
				setup_msg:"检测成功，配置中…",
				error_msg:"一键换机失败",
				correct_msg:"一键换机成功",
				detecting_tip:"请勿拔掉网线或关闭路由器",
				retry_btn:"重试",
				start_btn:"一键换机上网"
			},
			js:{
				connect_type_txt:"上网方式：",
				recommend:"（推荐）",
				connect_type:["DHCP","PPPoE","静态IP上网"],
				pppoe_list:["宽带帐号：","宽带密码："],
				static_list:["IP地址：","默认网关：","子网掩码：","首选DNS：","备用DNS："],
				recommend_tip:"如果您不想使用推荐参数，可在上网设置中修改",
				not_link_error:"未检测到旧路由器的上网设置，<br/>请您重新启动老路由器试试。",
				pppoe_spe_usr_error:"您的宽带帐号中含有特殊字符，为了安全考虑，不允许配置<br/><a class=\"link_sp\" href=\"#sp_data\">联系运营商</a>",
				pppoe_spe_pwd_error:"您的宽带密码中含有特殊字符，为了安全考虑，不允许配置<br/><a class=\"link_sp\" href=\"#sp_data\">联系运营商</a>",
				pppoe_spe_error:"您的宽带帐号和密码中含有特殊字符，为了安全考虑，不允许配置<br/><a class=\"link_sp\" href=\"#sp_data\">联系运营商</a>",
				pppoe_padi_error:"请检查旧路由是否配置有ac name，需要去掉后才能使用一键换机",
				pppoe_len_error:"您的宽带账号和密码长度超过新路由器支持的长度，不允许配置<br/><a class=\"link_sp\" href=\"#sp_data\">联系运营商</a>"
			}
		},
        touch_link:{
            touch_push:{
                html:{
                    touch_title:"访客摩擦上网",
                    tips:"开启摩擦上网后，手机轻轻接触路由器即可上网，赶紧开启试试吧",
                    push_auth_Pass:"朋友摩擦路由器后，还需要我的同意才能上网（推荐）",
                    push_auth_noPass:"朋友摩擦路由器后，即可直接上网"
                }
            },
            touch_set:{
                html:{
					wifi_tip:"开启WiFi的时间在WiFi定时关闭时间内，您可以在<a href=\"javascript:void(0);\">WiFi定时关闭</a>页面修改WiFi关闭时间",
                    switch_ctr_lbl:"访客摩擦上网",
                    link:"开启后，请在WiFi列表中连接",
                    form_label:"上网方式",
                    hopeGetCard:"上网管理"
                }
            },
            touch_switch:{
                html:{
                    touch_title:"访客摩擦上网",
                    tipsTxt:"开启摩擦上网后，手机轻轻接触路由器即可上网，赶紧开启试试吧",
                    use_tip:"该功能只作为临时使用，如有更高安全要求，请使用访客网络",
                    bigger_btn:"立即开启"
                }
            },
            wireless_list:{
                html:{
                    save:"刷新"
                }
            },
            js:{
				ssid_name:"360摩擦上网",
				unknownDevice:"未命名设备",
                switch_status_arr:["关闭","已开启"],
                push_status_arr:[
                    {statestr: '需要管理员确认后才能正常上网', linkstr: "切换到无需认证模式"},
                    {statestr: '轻轻摩擦路由器即可直接上网，不需要管理员确认', linkstr: "切换到管理员认证模式"}
                ],
                InitError:"初始化失败!",
                user_list:["主机名称","MAC地址","当前状态","操作"],
                noUserHope:"上网管理列表为空",
				confirmLink:"允许",
				rejectLink:"拒绝",
				rejectedLink:"已拒绝",
				addBlackLink:"添加到黑名单",
                tabTitle:["访客摩擦上网","摩擦无线连接列表"],
                mode_type:["等待管理员确认","通过验证未连接","连接","断开","已被管理员拒绝"],
                wireless_list:[
                    "序列号","主机名称","MAC地址","上行速率","下行速率","连接时间"
                ],
                getUserListFailure:"获取列表失败"
            }
        },
        multi_pppd: {
            html: {
                quickeningTip: ["正在检测本区域是否支持加速", "马上进行宽带提速，请稍等...", "整个加速过程可能需要一分钟，请稍等..."],
                quicken_btn: "立即加速",
                quicken_footer_tip: "该功能依赖运营商支持，如果您本地的运营商不支持，可能会加速失败。<br/>查看<a href='javascript:void(0)' class='danger_tip'>风险提示</a>",
                quicken_result_tip: "宽带加速已工作<span id=\"quicken_time\"></span><span id=\"quicken_time_unit\"></span>,提速后比提速前，提高了<span id=\"enhance_percent\"></span>的宽带。",
                noQuicken: "加速前",
                quickened: "加速后",
                reQuicken: "重新加速",
                stopQuicken: "关闭加速",
                up_speed: "上行速度",
                down_speed: "下行速度",
                log_loading_txt:"正在加载中......"
            }, js: {
                enhanceTip:[
                    ["正在检测本区域是否支持加速","正在检测本区域是否支持加速","经检测本地区支持宽带加速"],
                    ["马上进行宽带提速，请稍等...","正在进行宽带提速，请稍等...","宽带加速已成功叠加"],
                    ["整个加速过程可能需要一分钟，请稍等...","宽带加速完成，马上就能体验火箭般的网速！"]
                ],
                today:"今天",
                tabTitle: ["宽带加速", "加速日志"],
                quicken_btn: {quicken: "立即加速", quickening: "加速中...", failure: "重试"},
                log_status:["加速失败，请在宽带加速页面点击重试！","小遗憾，加速未满！","恭喜您，加速已满！"],
                log_txt_up:["当前上行带宽为","，已加速"],
                log_txt_down:["当前下行带宽为","，已加速"],
                quickenDanger_content:"网络不稳定可能会导致部分高级功能使用异常（例如：DDNS、DMZ、PPTP、L2TP等）<br/>如需恢复高级功能，请关闭宽带加速功能。",
                quickenFailureTip:["<span class='quicken_failure'>抱歉，加速失败！</span><br/>由于运营商的限制，本地区不支持宽带加速","<span class='quicken_failure'>测速失败，请稍候重试！</span>","<span class='quicken_failure'>加速失败，请检查您的网络是否正常！</span>","<span class='quicken_failure'>加速失败，请检查您的上网方式是否为PPPoE拨号！</span>","<span class='quicken_failure'>设置加速失败！</span>"],
                logListNull:"当前无任何日志信息",
                speedGetFauilre:"速度获取失败"
            }
        }
    }
};