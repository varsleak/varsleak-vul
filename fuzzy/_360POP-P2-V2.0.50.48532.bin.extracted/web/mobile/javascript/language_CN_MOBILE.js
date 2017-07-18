/**
 * Created by Administrator on 2015/3/16.
 */
var language_M = {};
language_M.CN = {
    COMMON: {
        fullTime: {
            day: "天",
            hour: "小时",
            min: "分钟"
        },
        timeTools: {
            confirmBtn: "确定",
            cancelBtn: "取消",
            year: "年",
            month: "月",
            day: "日",
            hour: "时",
            min: "分",
            sec: "秒",
            to: "至"
        },
        unknownDevice: "未命名设备",
        noLinkInter: "未连接外网",
        pwStrengthTxT: "密码强度:",
        time_group: {
            timeTxt: "WiFi定时开关:",
            weekTitle: "日期",
            day0: "星期一",
            day1: "星期二",
            day2: "星期三",
            day3: "星期四",
            day4: "星期五",
            day5: "星期六",
            day6: "星期日",
            timeTitle: "时间",
            startTxt: "起始时间：",
            s_hour: "时",
            s_min: "分",
            endTxt: "结束时间：",
            end_hour: "时",
            end_min: "分",
            time_group: "时间组"
        },
        noTableListDataTip: "当前没有有效列表",
        loadingTip: "努力加载中...",
        waringTip: {
            saveDataTip: "您的修改未保存，是否保存？",
            txtHtml: ["温馨提示", "保存", "放弃"]
        },
        status_switch_txt: ["关闭中", "开启中"]
    },
    RADIO: {
        wlb_channel_width_radio: {on: "20M", off: "自动"},
        ssid_broadcast_radio: {on: "隐藏", off: "显示"},
        broadcast_ssid_radio: {on: "隐藏", off: "显示"},
        authAllStatus_radio: {on: "禁止", off: "放行"}
    },
    SELECT: {
        channel_width_2_4_option: [
            {value: 4, txt: "自动"},
            {value: 2, txt: "20M(抗干扰能力强)"},
            {value: 3, txt: "40M(速度快)"}
        ],
        channel_width_5_option: [
            {value: 6, txt: "自动"},
            {value: 2, txt: "20M"},
            {value: 3, txt: "40M"},
            {value: 5, txt: "80M"}
        ],
        channel_num_2_4_option: [
            {value: 0, txt: "自动"},
            {value: 1, txt: "信道 1"},
            {value: 2, txt: "信道 2"},
            {value: 3, txt: "信道 3"},
            {value: 4, txt: "信道 4"},
            {value: 5, txt: "信道 5"},
            {value: 6, txt: "信道 6"},
            {value: 7, txt: "信道 7"},
            {value: 8, txt: "信道 8"},
            {value: 9, txt: "信道 9"},
            {value: 10, txt: "信道 10"},
            {value: 11, txt: "信道 11"},
            {value: 12, txt: "信道 12"},
            {value: 13, txt: "信道 13"}
        ],
        channel_num_5_option: [
            {value: 0, txt: "自动"},
            {value: 36, txt: "信道 36"},
            {value: 40, txt: "信道 40"},
            {value: 44, txt: "信道 44"},
            {value: 48, txt: "信道 48"},
            {value: 52, txt: "信道 52"},
            {value: 56, txt: "信道 56"},
            {value: 60, txt: "信道 60"},
            {value: 60, txt: "信道 64"},
            {value: 149, txt: "信道 149"},
            {value: 153, txt: "信道 153"},
            {value: 157, txt: "信道 157"},
            {value: 161, txt: "信道 161"},
            {value: 165, txt: "信道 165"}
        ],
        wifi_wap_option: [
            {value: 0, txt: "无"},
            {value: 3, txt: "WPA2-PSK AES"},
            {value: 4, txt: "WPA/WPA2-PSK AES"}
        ],ap_wap_option: [
            {value: 2, txt: "无需认证"},
            {value: 0, txt: "密码认证"},
            {value: 3, txt: "摩擦认证"}
        ],
        wan1_select_option: [
            {value: "auto", txt: "自动模式"},
            {value: "10f", txt: "10M全双工"},
            {value: "10h", txt: "10M半双工"},
            {value: "100f", txt: "100M全双工"},
            {value: "100h", txt: "100M半双工"}
        ],
        wireless_base_band_option: [
            {value: 2, txt: "802.11b"},
            {value: 4, txt: "802.11g"},
            {value: 8, txt: "802.11n"},
            {value: 6, txt: "802.11b+g"},
            {value: 12, txt: "802.11g+n"},
            {value: 14, txt: "802.11b+g+n"}
        ],
        wireless_preamble_option: [
            {value: 0, txt: "长帧"},
            {value: 1, txt: "短帧"}
        ],
        touch_link_def_option: [
            {value: 0, txt: "管理员认证模式"},
            {value: 1, txt: "无需认证模式"}
        ],
        timezone_sel_option: [
            {value: 12, txt: "<span>(GMT-12:00)</span><br/><span>埃尼威托克,夸贾林岛</span>"},
            {value: 11, txt: "<span>(GMT-11:00)</span><br/><span>中途岛,萨摩亚群岛</span>"},
            {value: 10, txt: "<span>(GMT-10:00)</span><br/><span>夏威夷</span>"},
            {value: 9, txt: "<span>(GMT-09:00)</span><br/><span>阿拉斯加</span>"},
            {value: 8, txt: "<span>(GMT-08:00)</span><br/><span>太平洋时间(美国和加拿大);蒂华</span>"},
            {value: 7, txt: "<span>(GMT-07:00)</span><br/><span>山地时间(美国和加拿大);亚利桑那</span>"},
            {value: 6, txt: "<span>(GMT-06:00)</span><br/><span>中部时间(美国和加拿大);中美洲</span>"},
            {value: 5, txt: "<span>(GMT-05:00)</span><br/><span>东部时间(美国和加拿大);波哥达</span>"},
            {value: 4, txt: "<span>(GMT-04:00)</span><br/><span>大西洋时间(加拿大);加拉加斯</span>"},
            {value: 3, txt: "<span>(GMT-03:00)</span><br/><span>巴西利亚,布宜诺斯艾利斯,乔治敦,格陵兰</span>"},
            {value: 2, txt: "<span>(GMT-02:00)</span><br/><span>中大西洋</span>"},
            {value: 1, txt: "<span>(GMT-01:00)</span><br/><span>佛得角群岛,亚速尔群岛</span>"},
            {value: 0, txt: "<span>(GMT)</span><br/><span>格林威治平时;都柏林,爱丁堡,伦敦,里斯本</span>"},
            {value: -1, txt: "<span>(GMT+01:00)</span><br/><span>阿姆斯特丹,柏林,罗马,斯得哥尔摩,巴黎</span>"},
            {value: -2, txt: "<span>(GMT+02:00)</span><br/><span>开罗,雅典,伊斯坦布尔,明斯克,耶路撒冷</span>"},
            {value: -3, txt: "<span>(GMT+03:00)</span><br/><span>巴格达,科威特,利雅得,莫斯科,圣彼得堡</span>"},
            {value: -4, txt: "<span>(GMT+04:00)</span><br/><span>阿布扎比,马斯喀特,巴库,第比利斯,埃里温</span>"},
            {value: -5, txt: "<span>(GMT+05:00)</span><br/><span>叶卡捷林堡,伊斯兰堡,卡拉奇,塔什干</span>"},
            {value: -6, txt: "<span>(GMT+06:00)</span><br/><span>阿拉木图,新西伯利亚,阿斯塔纳,达卡</span>"},
            {value: -7, txt: "<span>(GMT+07:00)</span><br/><span>曼谷,雅加达,河内</span>"},
            {value: -8, txt: "<span>(GMT+08:00)</span><br/><span>北京,重庆,乌鲁木齐,香港特别行政区,台北</span>"},
            {value: -9, txt: "<span>(GMT+09:00)</span><br/><span>东京,大坂,札幌,汉城,雅库茨克</span>"},
            {value: -10, txt: "<span>(GMT+10:00)</span><br/><span>布里斯班,关岛,堪培拉,墨尔本,悉尼</span>"},
            {value: -11, txt: "<span>(GMT+11:00)</span><br/><span>马加丹,索罗门群岛,新喀里多尼亚</span>"},
            {value: -12, txt: "<span>(GMT+12:00)</span><br/><span>富士,勘察加半岛,马绍尔群岛,惠灵顿</span>"},
            {value: -13, txt: "<span>(GMT+13:00)</span><br/><span>努库阿洛法</span>"}
        ],
        safeDefendHome_interface_option: [
            {value: "LAN", txt: "LAN"},
            {value: "WAN1", txt: "WAN"}
        ],
        proto_option: [
            {value: "tcp", txt: "TCP"},
            {value: "udp", txt: "UDP"},
            {value: "tcp+udp", txt: "TCP+UDP"}
        ],
		disk_sleep_time_sel:[
			{value:0, txt:"永不"},
			//{value:300, txt:"5分钟后"},
			{value:600, txt:"10分钟后"},
			{value:1200, txt:"20分钟后"},
			{value:1800, txt:"30分钟后"},
			{value:3600, txt:"1小时后"},
			{value:7200, txt:"2小时后"},
			{value:10800, txt:"3小时后"},
			{value:14400, txt:"4小时后"},
			{value:18000, txt:"5小时后"}
		]
    },
    INPUT: {
        placeholder: "请输入"
    },
    HTML: {
        index: {
            html: {
                routerStatus: "路由状态",
                routerSet: "路由设置",
                linkStatusInfo: "检测中",
                appSave: "保存",
                routerTxt: "360 安全路由",
                internetTxt: "互联网",
                onlineInfo: ["上网速度", "上网的手机电脑", "稳定运行"],
                mobileCountUnit: "台",
                tipConnectInfo: "请用手机连接以下WiFi无线网",
                moreAppMenu: "更多功能......",
                recoverSelect: "反选",
                allMenuSelect: "全选",
                addMenu: "确认",
                cancelAddMenu: "取消",
                fnUnit: "分钟"
            }
        },
        wifi_set: {
            html: {
                lbl_wireless_status: "无线网络状态：",
                lbl_ssid: "无线网络名称：",
                lbl_wlb_channel_width: "频道带宽：",
                lbl_wireless_base_channel_sel: "无线信道：",
                lbl_wls_ap_mode_sel: "加密方式：",
                lbl_wireless_key_val: "设置密码：",
                lbl_ssid_broadcast: "隐藏SSID：",
                wireless_same: "智能网络切换：",
                cutNetSetSuccess: "WiFi设置成功"
            },js: {
				disable_bandwidth:"目前处于WISP模式，无法修改频道带宽", 
				disable_channel:"目前处于WISP模式，无法修改信道" 
			}

        },
        wan_set: {
            html: {
                lbl_wan_set_pppoe: "宽带PPPoE",
                lbl_wan_set_dhcp: "动态IP 上网",
                lbl_wan_set_static: " 静态IP 上网"
            }
        },
        wan_pppoe: {
            html: {
                lbl_wan_setup_user0: "PPPoE 账户：",
                lbl_wan_setup_pass0: "PPPoE 密码：",
                lbl_wan_setup_mac0: " MAC 地址：",
                lbl_wan_setup_dns01: "主 DNS：",
                lbl_wan_setup_dns02: "从 DNS：",
                lbl_work_mode_nat: "启用NAT 模式：",
                lbl_wan1_select: "WAN 口配置：",
                lbl_server_name: "服务器名：",
                lbl_ac_name: "AC 名：",
                expertBtnTxt: "展开高级设置"

            }, placeholder: {
                wan_setup_mtu0: "(576-1480)",
                wan_setup_dns01: "（可选）",
                wan_setup_dns02: "（可选）",
                server_name0: "（仅供特殊地区用户填写）",
                ac_name0: "（仅供特殊地区用户填写）"
            }, js: {
                expertBtnTxtList: ["展开高级设置", "收起高级设置"]
            }
        },
        wan_dhcp: {
            html: {
                lbl_wan_setup_mac1: " MAC 地址：",
                lbl_wan_setup_dns11: "主 DNS：",
                lbl_wan_setup_dns12: "从 DNS：",
                lbl_work_mode_nat: "启用NAT 模式：",
                lbl_wan1_select: "WAN 口配置：",
                expertBtnTxt: "展开高级设置"

            }, placeholder: {
                wan_setup_mtu1: "(576-1480)",
                wan_setup_dns11: "（可选）",
                wan_setup_dns12: "（可选）"
            }, js: {
                expertBtnTxtList: ["展开高级设置", "收起高级设置"]
            }

        },
        wan_static: {
            html: {
                lbl_wan_setup_ip2: "IP 地址：",
                lbl_wan_setup_mask2: "子网掩码：",
                lbl_wan_setup_gw2: "默认网关：",
                lbl_wan_setup_mac2: " MAC 地址：",
                lbl_wan_setup_dns21: "主 DNS：",
                lbl_wan_setup_dns22: "从 DNS：",
                lbl_work_mode_nat: "启用NAT 模式：",
                lbl_wan1_select: "WAN 口配置：",
                expertBtnTxt: "展开高级设置"
            }, placeholder: {
                wan_setup_mtu2: "(576-1480)",
                wan_setup_dns22: "（可选）"
            }, js: {
                expertBtnTxtList: ["展开高级设置", "收起高级设置"]
            }
        },
        wifi_time_set: {
            html: {
                lbl_wireless_status: "无线网络状态：",
                lbl_ssid: "无线网络名称：",
                lbl_wlb_channel_width: "频道带宽：",
                lbl_wireless_base_channel_sel: "无线信道：",
                lbl_wls_ap_mode_sel: "加密方式：",
                lbl_wireless_key_val: "设置密码：",
                lbl_ssid_broadcast: "隐藏SSID："
            }
        },
        system_time: {
            html: {
                span_cur_time: "当前系统时间：",
                lbl_get_time: "自动获取系统时间：",
                lbl_system_date: "日期：",
                lbl_system_year: "-",
                lbl_system_month: "-",
                //lbl_system_day:"-",
                lbl_system_time: "时间：",
                lbl_system_hour: "：",
                lbl_system_minute: "：",
                //lbl_system_second：":",
                lbl_timezone_sel: "时区：",
                lbl_get_timezone: "自动获取时区："
            }
        },
        lan_setup: {
            html: {
                lbl_lan_ip_address: "IP地址：",
                lbl_lan_sub_mask: "子网掩码：",
                lbl_dhcp_status: "DHCP服务器：",
                lbl_dhcp_pool_start: "地址池开始：",
                lbl_dhcp_pool_end: "地址池结束：",
                cutNetSetSuccess: "路由地址修改成功"
            }
        },
        password: {
            html: {
                lbl_old_password: "原密码：",
                lbl_password1: "密码：",
                lbl_password2: "确认密码："
            }
        },
        misc_reboot: {
            html: {
                div_reboot_now_tip: "路由器系统将立即重新启动",
                span_reset_tip: "正在重启路由器，请勿断电，请稍候",
                cutNetSetSuccess: "路由器重启完成"
            },
            value: {
                red_btn: "立即重启"
            }
        },
        rally_default: {
            html: {
                div_manual_update_tip: "恢复出厂设置后将丢失配置信息<br/>需重新设置后才能正常上网",
                span_reset_tip: "正在重启路由器，请勿断电，请稍候",
                cutNetSetSuccess: "路由器已恢复出厂设置"
            },
            value: {
                red_btn: "恢复出厂设置"
            }
        },
        manual_update: {
            html: {
                div_manual_update_tip: "升级软件需要花费几分钟的时间<br/>请不要关闭电源或按重置按钮!",
				span_reset_tip: "正在重启路由器，请勿断电，请稍候",
                span_cur_ver: "当前版本：",
                span_view: "选择升级文件",
                cutNetSetSuccess: "路由器重启完成"
            }
        },
        auto_update: {
            html: {
                checkUpdate: "正在检查更新……",
                cutNetSetSuccess: "路由器重启完成"
            },
            value: {
                btn_cancel: "取消",
                btn_confirm: "确定"
            }
        },
        router_info: {
            html: {
                routerInfo: "路由器信息",
                router_name_info: "路由器名称：",
                router_name_info_a: "360安全路由5G",
                router_model: "处理器型号：",
                router_model_a: "MT7628AN",
                router_logo: "处理器品牌：",
                router_logo_a: "MediaTek",
                router_hz: "处理器主频：",
                router_hz_a: "580MHz",
                router_bone: "处理器架构：",
                router_bone_a: "MIPS",
                router_wifi_speed: "无线传输速率：",
                router_wifi_speed_a: "1167Mbps",
                router_save_in: "内存：",
                router_save_in_a: "128MB",
                router_save_onoff: "闪存：",
                router_save_onoff_a: "16MB",
                online_info: "上网信息",
                wanIp: "外网IP地址：",
                wanMask: "子网掩码：",
                wanGm: "默认网关：",
                wanMac: "MAC地址：",
                wanDns_a: "首选DNS地址：",
                wanDns_b: "备选DNS地址：",
                home_net_info: "家庭网络信息",
                lanIp: "路由器IP地址：",
                lanMask: "子网掩码：",
                dhcp_status: "DHCP服务器状态：",
                dhcp_range_start: "DHCP地址池开始：",
                dhcp_range_end: "DHCP地址池结束："
            }
        },
        oray_ddns: {
            html: {
                form_label: ["动态域名服务状态：", "动态域名服务商：", "用户帐号：", "密码：", "状态信息："],
                orayName: "花生壳"
            }
        },
        smart_qos: {
            html: {
                form_label: ["智能QoS状态：", "网络上行：", "网络下行："],
                smart_qos_bandwidth: "路由器带宽设置"
            }
        },
        baby_mode: {
            html: {
                addManageBtn: "+&nbsp;&nbsp;添加管理",
                limit_tip: "限制宝贝上网时间",
                baby_sex: ["宝贝是男孩", "宝贝是女孩"],
                time_group_txt: ["起始时间：", "终止时间："],
                lbl_baby_hour: "时",
                lbl_baby_minute: "分",
                baby_mode_edit: "确定"
            },
            js: {
				startAndEnd: "结束时间不能和起始时间相等！",
                manage: "管理",
                forbidOnline: "禁网",
                setBabyMode: "设置儿童模式",
                "baby-mode-control": ["添加限制时间", "管理上网时间"],
                "baby-mode-host": "儿童模式",
                "baby-mode-list": "选择管理"
            }
        },
        network_speed_manage: {
            html: {
                lbl_network_speed_manage_device: "上网白名单",
                lbl_network_speed_manage_black: "上网黑名单",
                lbl_device_name: "设备名称：",
                lbl_up_speed: "上行网速：",
                lbl_down_speed: "下行网速：",
                lbl_limit_up_speed: "上行限速：",
                lbl_limit_down_speed: "下行限速：",
                lbl_is_black: "禁止上网：",
                lbl_ip: "IP：",
                lbl_mac: "MAC：",
                btn_limit: "确认",
                btn_cancel_limit: "取消限速",
                btn_speed_limit: "限速"
            },
            js: {
                device_count_title1: "设备在线",
                device_count_title2: "台",
                device_down_speed_title2: "总网速：",
                forbidOnline: "禁网",
                not_cur_device_to_black: "不能拉黑当前使用设备到黑名单！",
                toBlackSuccess: "设备已禁止上网",
                toCancelBlackSuccess: "设备已可以上网",
                limit_up_speed_require: "请填写上行限制速度",
                limit_down_speed_require: "请填写下行限制速度",
                limit_speed_error0: "请填写0以上的数值",
                limit_speed_success: "限速成功",
                limit_cancel_speed_success: "取消限速成功",
                name_require: "请填写设备名称",
                no_data_title: "当前没有连接列表",
                edit_success: "修改成功",
                onlineTip: "在线 ",
                titleTxt: ["网速管理", "详情"],
                noEditInfo: "无任何修改信息！"
            }
        },
        ap_mode: {
            html: {
                form_label: [
                    "访客网络状态：", "无线网络名称：", "隐藏无线网络名称：", "无线间隔离：", "加密方式：", "设置密码：", "自动关闭：", "访客网络限速开关：", "访客网络上行：", "访客网络下行：", "访客接入数量："
                ],
                "app-set-txt": "访客网络设置",
                "app-list-txt": "访客无线列表",
                "ap-list-info-label": ["MAC地址：", "模式：", "发送速率：", "接收速率：", "连接时间："]
            },
            js: {
                "ap-nav": "访客模式",
                "ap-set": "访客网络设置",
                "ap-list": "访客无线列表",
                apName: "访客",
                noApListTip: "当前没有连接列表",
                msg_info_status: "请先开启访客模式"
            }
        },
        anti_ddos: {
            html: {
                ddos_tip: "开启DDoS防火墙，可以防御内外部各种流量攻击。在能够正常上网的情况下，不需要开启所有DDoS防火墙功能。",
                anti_ddos_basic_txt: "基本攻击防护",
                anti_ddos_advance_txt: "高级攻击防护",
                form_label: ["硬件攻击防御", "驱动攻击防御", "操作系统攻击防御", "应用攻击防御", "禁止WAN口响应ping包", "TCP SYN分片报文攻击保护", "ICMP分片报文攻击保护", "携带数据的TCP SYN攻击保护", "UDP炸弹攻击保护", "TCP Land攻击保护", "UDP Land攻击保护", "ICMP Land攻击保护", "TearDrop攻击保护", "ICMP数据包放大攻击保护", "非法TCP标识报文攻击保护", "未知IP类型报文攻击保护", "死亡之PING攻击保护", "IP电子欺骗(IP Spoof)攻击保护"]
            },
            value: {
                btn_normal_setting: "常规设置( 推荐 )",
                btn_enable_all: "全部开启",
                btn_disable_all: "全部关闭",
                btn_enable: "开启保护",
                btn_disable: "关闭保护( 推荐 )"
            }
        },
        wisp_set: {
            html: {
                wispTip: " 开启WISP功能，可以延伸无线信号，扩大无线网络覆盖范围，同时路由器的安全功能保持生效。",
                form_label: ["WISP网络：", "无线网络名称：", "Bssid：", "密码：", "获取IP："],
                "ap-search": "搜索WiFi",
                cutNetSetSuccess: "WiSP设置成功"
            },
            js: {
                "wisp-set": "WISP设置",
                "wisp-ap-list": "附近的无线网络",
                successWisp: "WISP设置成功,获取ip：",
                get_linking: "正在拼命连接中......",
                link_suc: "连接成功<br/>获取IP为:",
                link_failure: "连接失败",
                no_link_get: "未连接",
                getIp: "WISP设置成功,获取IP:"
            }
        },
        host_monitor: {
            html: {
                subTitle: ["实时监控", "家庭网络中的设备信息"],
                "host-item": ["内网活动主机数：", "连接数：", "WAN上行/下行速度(B/s)：", "上行/下行总流量(B)："],
                "host-e-item": ["设备名称：", "设备IP：", "设备MAC：", "连接数：", "上行速度：", "下行速度：", "上行总流量：", "下行总流量：", "在线时间："]
            },
            js: {
                "host-info": "设备监控",
                "host-e-info": "详情"
            }
        },
        power_progress: {
            html: {
                modeTxt: ["孕妇模式：", "均衡模式：", "穿墙模式："],
                "power-p-info": ["2%的WiFi发射功率,准妈妈再也不用担心辐射问题", "WiFi发射功率50%,既能轻松上网,又能降低辐射",
                    "P+内核信号增益已开,手机WiFi信号较弱时自动增强发射功率,家中信号死角地区也能畅快上网"]
            }
        },
        touch_link: {
            html: {
                guide_tip: "开启摩擦上网后，手机轻轻接触路由器即可上网，赶紧开启试试吧",
                guide_replenish: "该功能只作为临时使用，如有更高安全要求，请使用访客网络",
                touch_link_tip: "无需密码，轻轻碰一下您的路由器，即可轻松上网。",
                touch_link_set_txt: "访客摩擦上网",
                touch_link_list_txt: "摩擦无线连接列表",
                lbl_touch_link_switch: "访客摩擦上网",
                lbl_touch_link_def: "认证方式：",
                link: "轻轻摩擦路由器后，请在WiFi列表中连接"
            },
            value: {
                start_touch_link_btn: "立即开启"
            }
        },
        pptp_client: {
            html: {
                pptp_client_set_txt: "PPTP客户端设置",
                pptp_client_list_txt: "PPTP客户端列表",
                pptp_client_status_txt: "PPTP客户端状态",
                form_label: ["启动状态：", "服务器地址：", "服务器端口：", "用户名：", "密码："]
            },
            placeholder: {
                pptp_client_server_addr: "(可输入域名和IP地址)"
            }
        },
        developer_mode: {
            html: {
                wireless_advance_tip: "开发者模式提供研发级WiFi调试功能。",
                lbl_radio_criterion: "网络模式：",
                lbl_wireless_fragment: "分片阈值：",
                lbl_wireless_RTSThreshold: "RTS阈值：",
                lbl_wireless_preamble: "帧前导：",
                lbl_wireless_protection: "保护模式：",
                lbl_wireless_ampdu: "帧聚合模式：",
                lbl_wireless_tx_2_path: "双通道发射：",
				lbl_enable_upnp:"启用upnp：",
				lbl_p_plus:"P++信号增强：",
                lbl_safe_request: "安全访问开关：",
                lbl_deny_ip: "指定IP登陆管理界面："
            },
            placeholder: {
                wireless_RTSThreshold: "(256-2347)",
                wireless_fragment: "(256-2346)"
            }
        },
        safe_defend: {
            html: {
                netStatusTip: "您的网络安全状态<span></span>",
                "safeDefend-title": ["恶意网址防火墙：", "上网劫持防火墙：", "家庭网络防火墙：", "密码安全防火墙："],
                "net-safe-tip": ["阻断挂马网址", "阻断篡改首页等网址", "阻断钓鱼、欺诈网址", "阻断恶意软件下载网址", "阻断木马、下载者网址"],
                "internet-safe-tip": ["防止恶意广告弹出", "防止被劫持到钓鱼网站", "防止被劫持到挂马网站"],
                "home-safe-tip": ["阻止ARP断网掉线攻击", "防止被恶意限速"],
                "s-d-search-info": "查看保护详情>>",
                "safe-defend-net-info": ["正常网址：", "阻断挂马网址：", "阻断篡改首页等网址：", "阻断钓鱼、欺诈网址：", "阻断恶意软件下载网址：", "阻断木马、下载者网址："],
                "safe-defend-net-title": "已开启恶意网址防火墙！已累计保护<strong>00</strong>天",
                "safe-defend-internet-title": "已开启上网劫持防火墙！已累计保护<strong>00</strong>天",
                "safe-defend-password-tip": "累计拦截上网劫持行为<strong>100</strong>次！",
                "s-d-wifi-strength": "WiFi密码强度：",
                "s-d-psw-strength": "管理员密码强度：",
                "s-d-psw-edit": "修改密码",
                "s-d-home-sub-title": ["IP/MAC绑定", "IP/MAC绑定列表"],
                "s-d-arp-add": ["增加 <strong>+</strong> "],
                "safe-defend-net-shut-tip": "已关闭恶意网址防火墙！",
                "safe-defend-internet-shut-tip": "已关闭上网劫持防火墙！",
                "arp-defend-label": ["IP地址：", "MAC地址：", "备注：", "接口："]
            },
            js: {
                "safeDefend-host": "安全防护",
                "safe-defend-net": "恶意网址防火墙",
                "safe-defend-internet": "上网劫持防火墙",
                "safe-defend-home": "家庭网络防火墙",
                "safe-defend-password": "密码安全防火墙",
                defendStatus: ["未开启保护", "保护中"],
                trojanStatus: ["未开启保护", "安全"],
                pswStatus: ["安全", "有风险"],
                pswStrength: ["低", "中", "高"],
                "show-net-defend-info": "今日:current条 总计:total条"
            },
            placeholder: {
                "input-text": "输入"
            }
        },
        portMap: {
            html: {
                "portMapSer-title": "虚拟服务器",
                "portMapSerList-title": "虚拟服务器列表",
                "portMapDMZ-title": "DMZ 设置",
                "portM-set-label": ["虚拟服务名称：", "内网主机IP地址：", "协议：", "外部端口：", "内部端口："],
                "dmz-set-tip": "WAN 口 DMZ 配置",
                "dmz-set-label": ["DMZ状态：", "DMZ主机IP地址："]
            },
            js: {
                "portMap-list": "虚拟服务器列表",
                "dmz-set": "DMZ配置",
                "portHost": "端口映射",
                "portMap-set": ["虚拟服务器", "列表详情"]
            },
            placeholder: {
                "portmap-port-set-a": "起始端口号",
                "portmap-port-set-b": "结束端口号"
            }
        },
        log: {
            html: {
                "log-pppoe": "宽带PPPoE",
                "log-dynamic": "动态IP上网",
                "log-static": "静态IP上网"
            }
        },
        l2tp: {
            html: {
                "l2tp-child-title": ["L2TP客户端设置", "L2TP客户端列表", "L2TP客户端状态"],
                "l2tp-form-label": ["状态：", "服务器地址：", "用户名：", "密码："],
                "status-list-info-label": ["用户名：", "连接状态：", "本地IP地址：", "对端IP地址："]
            },
            js: {
                "l2tp-host": "L2TP客户端",
                "l2tp-set": ["L2TP客户端设置", "列表详情"],
                "l2tp-list": "L2TP客户端列表",
                "l2tp-status": "L2TP客户端状态",
                "l2tp-status-info": "状态详情",
                linkStatus: ["断开", "连接"],
                ipStr: ["本地IP：", "对端IP："]
            }
        },
        led_ctrl: {
            html: {
                ledCtrlTip: "轻松关闭路由指示灯,麻麻再也不用担心我晚上睡不好了。",
                ledCtrlShutTime: "关闭时间：",
                ledCtrlOpenTime: "开启时间：",
                ledCtrlCloseTip: "定时关闭指示灯：",
                lbl_baby_hour: "时",
                lbl_baby_minute: "分"
            }
        },
        safety_wireless: {
            html: {
                "form-label": ["状态：", "密码保护问题：", "自定义问题","密码保护答案：", "未认证用户禁止访问路由器:", "未认证用户禁止访问有线电脑:", "全部状态："],
                safeWirelessSeniorBtn: "展开高级设置",
                seniorSetTip: "高级设置",
                safetyBlackDelTxt: "全部删除",
                safetyWirelessTitle: ["防蹭网", "防蹭网白名单", "防蹭网黑名单"],
                cutNetSetSuccess: "防蹭网设置成功,认证通过后"
            },
            js: {
                safeWirelessSeniorBtn: ["展开高级设置", "收起高级设置"],
                safetyWirelessHost: "防蹭网",
                safetyWirelessSet: "防蹭网",
                safetyWirelessWhite: "防蹭网白名单",
                safetyWirelessBlack: "防蹭网黑名单",
				customQuestion:"自定义问题",
                hostName: "主机名：",
                addToBlack: "<strong>+</strong>添加到黑名单",
                addToWhite: "<strong>+</strong>添加到白名单",
                authBtn: ["取消认证", "认证"],
                safety_status_tip_txt: "请先开启防蹭网功能"
            },
            placeholder: {
                wirel_answer: "输入"
            }
        },
        samba: {
            html: {
                sambaTip: "温馨提示：开启Windows文件共享后，您可以在\"这台电脑>网络\"中访问存储设备中的共享数据；您还可以通过在IE浏览器或文件地址栏中输入\"\\\\luyou.360.cn\"（Windows用户）或\"smb://luyou.360.cn\"（Mac用户）访问共享数据",
                shareTxt: "共享状态:"
            }
        },
        dlna: {
            html: {
                dlnaTip: "温馨提示：首先，您需要在连接路由器的设备（例如手机、平板电脑等）中安装支持DLNA的多媒体终端，然后，开启多媒体共享,就可以在设备上播放存储设备中共享的图片、音乐、视频文件",
                shareTxt: "共享状态:"
            }
        },
		disk_sleep:{
			html:{
				disk_sleep_time:"进入休眠时间"
			},
			js:{
				run:"运行中…",
				sleep:"休眠中…"
			}
		}
    },
    JS: {
        index: {
            linkInfo: ["安全上网中", "网络错误", "检测中"]
        },
        auto_update: {
            newVersion: "新版本：",
            rebootRouter: "正在重启路由器，请勿断电，请稍候",
			verfy_file:"正在校验升级文件，请稍候……",
			start_update:"开始升级路由器，请稍候……",
            downloadFile: "正在下载固件，请稍候"
        },
        anti_ddos: {
            status: ["未开启", "已保护"]
        },
        touch_link: {
            touch_link_title: "访客摩擦上网",
            touch_link_list_title: "摩擦无线连接列表",
            touch_link_detail_title: "详情",
            auth_list_title: "上网管理",
            auth_list_null: "上网管理列表为空",
            mac_addr: "MAC地址",
            user_list_tab: ["设备名称：", "MAC：", "下行网速：", "上行网速：", "连接时间："],
            listNull: "该列表为空"
        },
        pptp_client: {
            status_name: ["用户名：", "连接状态：", "本地IP地址：", "对端IP地址："],
            link_status: ["断开", "已连接"],
            connect: "连接",
            disconnect: "断开",
            local_ip: "本地IP：",
            remote_ip: "对端IP：",
            pptp_client_title: "PPTP客户端",
            pptp_client_set_title: "PPTP客户端设置",
            pptp_client_list_title: "PPTP客户端列表",
            pptp_client_status_title: "PPTP客户端状态",
            pptp_client_status_detail_title: "状态详情",
            listNull: "该列表为空"
        },
        wifi_set: {
            tip: "登录电脑版wifi设置可以重新开启WiFi",
            success: "您的WiFi已成功关闭"
        },
        wifi_time_set: {
            check_time_at_least: "开启时间与关闭时间间隔不得小于{value}分钟"
        }
    }
};
var languageM_nav_map = {
    network_speed_manage: {
        title: "网速管理",
        src: "./images/speedLimit.png",
        currentHtml: "network_speed_manage",
        action: "require_App",
        save: "network_speed_manage_set",
        type: "default",
        ddCountNo: "3001"
    },
    wifi_set: {
        title: "WiFi设置",
        src: "./images/wifiSet.png",
        currentHtml: "wifi_set",
        action: "require_App",
        save: "wireless_base.wireless_base_set",
        formData: "wireless_base_frm",
        type: "default",
        ddCountNo: "3002"
    },
    internet_set: {
        title: "上网设置",
        src: "./images/setting.png",
        children: {
            wan_pppoe: {
                title: "宽带 PPPoE",
                cls: "no-padding-left",
                currentHtml: "wan_pppoe",
                action: "init_pppoe_setup",
                save: "submit_wan_config_pppoe",
                formData: "wan_pppoe_form",
                ddCountNo: "3003"
            },
            wan_dhcp: {
                title: "动态 IP 上网",
                cls: "no-padding-left",
                currentHtml: "wan_dhcp",
                action: "init_dhcp_setup",
                save: "submit_wan_config_dhcp",
                formData: "wan_dhcp_form",
                ddCountNo: "3004"
            },
            wan_static: {
                title: "静态 IP 上网",
                cls: "no-padding-left",
                currentHtml: "wan_static",
                action: "init_static_setup",
                save: "submit_wan_config_static",
                formData: "wan_static_form",
                ddCountNo: "3005"
            }
        },
        currentHtml: "wan_setup",
        action: "init_wan_setup",
        type: "default"
    },
    touch_link: {
        title: "访客摩擦上网",
        src: "./images/touchLink.png",
        currentHtml: "touch_link",
        action: "require_App",
        save: "touch_link.touch_link_submit",
        type: "default"
    },
    safe_defend: {
        title: "安全防护",
        src: "./images/safeDefend.png",
        currentHtml: "safe_defend",
        action: "require_App",
        type: "default"
    },
    wifi_time_set: {
        title: "WiFi定时开关",
        src: "./images/wifiTimeSwitch.png",
        currentHtml: "wifi_time_set",
        save: "app_compatible.wifi_time_set.submit_wifi_time_setting",
        formData: "wireless_base_2_4_frm"
    },
    led_ctrl: {
        title: "定时关闭指示灯",
        src: "./images/led_ctrl.png",
        currentHtml: "led_ctrl",
        action: "require_App",
        save: "save_led_ctrl",
        formData: "led_ctrl"
    },
    ap_mode: {
        title: "访客模式",
        src: "./images/clientMode.png",
        currentHtml: "ap_mode",
        action: "require_App",
        save: "wire_bas_ap_set"
    },
    baby_mode: {
        title: "儿童模式",
        src: "./images/babyMode.png",
        currentHtml: "baby_mode",
        action: "require_App"
    },
    power_progress: {
        title: "信号强度",
        src: "./images/signalStrength.png",
        currentHtml: "power_progress",
        action: "require_App",
        save: "setRadioPower",
        formData: "powerProgressFrm"
    },
    misc_reboot: {
        title: "重启路由器",
        src: "./images/misc-reboot.png",
        currentHtml: "misc_reboot",
        action: "init_misc_reboot"
    },
    rally_default: {
        title: "恢复出厂设置",
        src: "./images/reboot.png",
        currentHtml: "rally_default"
    },
    password: {
        title: "修改管理密码",
        src: "./images/password.png",
        currentHtml: "password",
//        action: "init_password",
        save: "user_password_set",
        formData: "user_pwd_frm"
    },
    update: {
        title: "升级系统",
        src: "./images/update.png",
        children: {
            manual_update: {
                title: "手动升级",
                cls: "no-padding-left",
                currentHtml: "manual_update",
                action: "init_manual_update",
                save: "answer"
            },
            auto_update: {
                title: "在线升级",
                cls: "no-padding-left",
                currentHtml: "auto_update",
                action: "init_auto_update",
                save: "submit_wan_config2"
            }
        },
        currentHtml: "update",
        action: "",
        type: "default"
    },
    system_time: {
        title: "时间设置",
        src: "./images/timeSet.png",
        currentHtml: "system_time",
        action: "init_system_time",
        save: "system_time_submit"
    },
    lan_setup: {
        title: "修改路由地址",
        src: "./images/lanStupe.png",
        currentHtml: "lan_setup",
        action: "init_lan_setup",
        save: "lan_setup_submit",
        formData: "lan_setup_frm"
    },
    router_info: {
        title: "我的路由信息",
        src: "./images/routerInfo.png",
        currentHtml: "router_info",
        action: "init_router_info"
    },
    log: {
        title: "拨号日志",
        src: "./images/pppoeLog.png",
        currentHtml: "log",
        action: "require_App"
    },
    wisp_set: {
        title: "WISP设置",
        src: "./images/WISP.png",
        currentHtml: "wisp_set",
        action: "require_App",
        save: "wisp_set.save_wisp",
        formData: "wisp"
    },
    portMap: {
        title: "端口映射",
        src: "./images/portVir.png",
        currentHtml: "portMap",
        action: "require_App"
    },
    smart_qos: {
        title: "智能QoS",
        src: "./images/intelligentQos.png",
        currentHtml: "smart_qos",
        action: "require_App",
        save: "smart_qos.qos_set_submit",
        formData: "qos_set_form"
    },
    oray_ddns: {
        title: "花生壳动态域名",
        src: "./images/oray.png",
        currentHtml: "oray_ddns",
        action: "require_App",
        save: "oray_ddns.save_oray_ddns",
        formData: "ddnsform"
    },
    host_monitor: {
        title: "设备监控",
        src: "./images/hostMonitor.png",
        currentHtml: "host_monitor",
        action: "require_App"
    },
    pptp_client: {
        title: "PPTP客户端",
        src: "./images/PPTPClient.png",
        currentHtml: "pptp_client",
        action: "require_App",
        save: "pptp_client.pptp_client_setup_submit"
    },
    l2tp: {
        title: "L2TP客户端",
        src: "./images/L2TPClient.png",
        currentHtml: "l2tp",
        action: "require_App"
    },
    anti_ddos: {
        title: "DDoS防火墙",
        src: "./images/DDoS.png",
        currentHtml: "anti_ddos",
        action: "require_App"
    },
    safety_wireless: {
        title: "防蹭网",
        src: "./images/fangCengNet.png",
        currentHtml: "safety_wireless",
        action: "require_App"
    },
    developer_mode: {
        title: "开发者模式",
        src: "./images/developer.png",
        currentHtml: "developer_mode",
        action: "init_developer",
        save: "developer_set",
        formData: "wireless_advance_frm"
    },
	disk_sleep:{
		title: "磁盘休眠",
        src: "./images/disk_sleep.png",
        currentHtml: "disk_sleep",
        action: "disk_sleep_init",
        save: "app_compatible.disk_sleep._set",
        formData: "samba_frm"
	}

};//总的菜单项

//可操作功能目录
var op_nav_map = {
    samba: {
        title: "文件共享",
        src: "/app/samba/webs/mobile/images/samba.png",
        currentHtml: "samba",
        action: "samba_dlna_init",
        save: "app_compatible.samba_dlna._set",
        formData: "samba_frm",
        isEnable: false
    },
    dlna: {
        title: "多媒体共享",
        src: "/app/dlna/webs/mobile/images/dlna.png",
        currentHtml: "dlna",
        action: "samba_dlna_init",
        save: "app_compatible.samba_dlna._set",
        formData: "dlna_frm",
        isEnable: false
    }
};
