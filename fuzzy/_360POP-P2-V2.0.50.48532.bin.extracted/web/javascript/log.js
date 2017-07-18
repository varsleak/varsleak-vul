/*
 *系统日志
 *[0] 表示“action”,默认为“阻断，允许”,要指定其他action，请在最后加上“@LOG_XXX_action”,没有则不写.
 *如果action不在末尾请加上分隔符[SP]
 *需要IP字段的加上分隔符[IP]
 *[1][2][3]...  依次对应返回的msg数组的数据, 位置任意.
 */
if (!igd)var igd = new Object();
igd.log_info = {
    LOG_SYSTEM_CPU_TOTAL: "CPU使用率[1]%",
    LOG_SYSTEM_CPU_1: "#1CPU使用率[1]%",
    LOG_SYSTEM_CPU_2: "#2CPU使用率[1]%",
    LOG_SYSTEM_MEM_TOTAL: "L1 MEM使用率[1]%",
    LOG_SYSTEM_MEM_USE: "L2 MEM使用率[1]%",

    LOG_SYSTEM_EVENT_STARTUP: "上电", /*上电*/
    LOG_SYSTEM_EVENT_REBOOT: "重启", /*重启*/
    LOG_SYSTEM_EVENT_LOGIN: "用户[1]在[IP]登陆路由器[0]@LOG_SUCC_FAILED_action",
    LOG_SYSTEM_EVENT_UPGRADE: "[1]升级固件[0]@LOG_SUCC_FAILED_action",
    LOG_SYSTEM_EVENT_NTP: "WAN[1]获取NTP时间[0]@LOG_SUCC_FAILED_action",
    LOG_SYSTEM_EVENT_LAN: "IP [IP][0]@LOG_SYSTEM_EVENT_LAN_action[SP]，累计上行流量[1]，累计下行流量[2]<br/>此次在线时间为[5]天[6]小时[7]分[8]秒，上行流量为[3]，下行流量[4]",

    LOG_SYSTEM_CONFIG_FUNCTION: "[1]功能[0]@LOG_ON_OFF_action", /*功能选择*/
    LOG_SYSTEM_CONFIG_LAN: "[1]LAN设置", /*LAN设置*/
    LOG_SYSTEM_CONFIG_WAN: "[1]接入设置", /*接入设置*/
    LOG_SYSTEM_CONFIG_USER: "[1]用户组设置", /*用户组设置*/
    LOG_SYSTEM_CONFIG_TIME: "[1]时间段设置", /*时间段设置*/
    LOG_SYSTEM_CONFIG_ACL: "[1]ACL设置", /*ACL设置*/
    LOG_SYSTEM_CONFIG_QOS: "[1]QoS设置", /*QoS设置*/

    /*攻击日志*/
    LOG_ATTACK_FRAGME: "分片报文攻击:[1] [2]", /*分片报文攻击*/
    LOG_ATTACK_LAND: "Land攻击:[1] [2]", /*Land攻击*/
    LOG_ATTACK_TEARDROP: "TearDrop攻击:[1] [2]", /*TearDrop攻击*/
    LOG_ATTACK_SMURF: "Smurf攻击:[1] [2]", /*Smurf攻击*/
    LOG_ATTACK_PINGTODEATH: "PING to Death攻击:[1] [2]", /*PING to Death攻击*/
    LOG_ATTACK_IPSPOOF: "IP Spoof攻击:[1] [2]", /*IP Spoof攻击*/
    LOG_ATTACK_ARP: "ARP欺骗:[1] ", /*ARP欺骗*/
    LOG_ATTACK_TCPFLOOD: "SYN FLOOD:[1] [2]", /*SYN FLOOD*/
    LOG_ATTACK_UDPFLOOD: "UDP FLOOD:[1] [2]", /*UDP FLOOD*/
    LOG_ATTACK_ICMPFLOOD: "ICMP FLOOD:[1] [2]", /*ICMP FLOOD*/
    LOG_ATTACK_DNSFLOOD: "DNS FLOOD:[1] [2]", /*DNS FLOOD*/
    LOG_ATTACK_CC: "CC攻击:[1] [2]", /*CC攻击*/
    LOG_ATTACK_WANOPENPORT: "外网开放服务端口的特殊防御[1] [2]", /*外网开放服务端口的特殊防御*/
    LOG_ATTACK_SYNPROXYHIP: "SYN proxy + HIP[1] [2]", /*SYN proxy + HIP*/
    LOG_ATTACK_PINGWAN: "ping WAN[1] [2]", /*ping WAN*/
    LOG_ATTACK_PINGLAN: "ping LAN[1] [2]", /*ping LAN*/
    LOG_ATTACK_VIROUS: "病毒过滤[1] [2]", /*病毒过滤*/

    /*转发日志*/
    LOG_TRANSMIT_WAN: "WAN口状态[1]", /*WAN口状态*/
    LOG_TRANSMIT_LAN: "LAN口状态[1]", /*LAN口状态*/
    LOG_TRANSMIT_NAT: "NAT状态[1]", /*NAT状态*/
    LOG_TRANSMIT_USER: "用户状态[1]", /*用户状态*/

// LOG_TRANSMIT_WAN_UP_PKT 		LOG_2SET(LOG_TRANSMIT_WAN,1)		/*上传流量*/
    LOG_TRANSMIT_WAN_UP_BYTE: "WAN[1]上传流量:[2]KB", /*上传流量*/
// LOG_TRANSMIT_WAN_DOWN_PKT 	LOG_2SET(LOG_TRANSMIT_WAN,2)		/*下载流量*/
    LOG_TRANSMIT_WAN_DOWN_BYTE: "WAN[1]下载流量:[2]KB", /*下载流量*/
    LOG_TRANSMIT_WAN_UP_SPEED: "WAN[1]上传速率:[2]KBS", /*上传速率*/
    LOG_TRANSMIT_WAN_DOWN_SPEED: "WAN[1]下载速率:[2]KBS", /*下载速率*/

// LOG_TRANSMIT_LAN_UP_PKT 		LOG_2SET(LOG_TRANSMIT_LAN,1)		/*上传流量*/
    LOG_TRANSMIT_LAN_UP_BYTE: "LAN[1]上传流量:[2]KB", /*上传流量*/
// LOG_TRANSMIT_LAN_DOWN_PKT 	LOG_2SET(LOG_TRANSMIT_LAN,2)		/*下载流量*/
    LOG_TRANSMIT_LAN_DOWN_BYTE: "LAN[1]下载流量:[2]KBS", /*下载流量*/
    LOG_TRANSMIT_LAN_UP_SPEED: "LAN[1]上传速率:[2]KB", /*上传速率*/
    LOG_TRANSMIT_LAN_DOWN_SPEED: "LAN[1]下载速率:[2]KBS", /*下载速率*/

    LOG_TRANSMIT_NAT_TCP: "TCP[1] [2] [3] [0]", /*TCP*/
    LOG_TRANSMIT_NAT_UDP: "UDP[1] [2] [3] [0]", /*UDP*/
    LOG_TRANSMIT_NAT_ICMP: "ICMP[1] [2] [3] [0]", /*ICMP*/
    LOG_TRANSMIT_USER_CONN: "[1] [2]连接数:[3]", /*连接数*/
// LOG_TRANSMIT_USER_UP_PKT		LOG_2SET(LOG_TRANSMIT_USER,2)		/*上传流量*/

    LOG_TRANSMIT_USER_UP_BYTE: "[1] [2]上传流量:[3]KB", /*上传流量*/
// LOG_TRANSMIT_USER_DOWN_PKT	LOG_2SET(LOG_TRANSMIT_USER,3)		/*下载流量*/
    LOG_TRANSMIT_USER_DOWN_BYTE: "[1] [2]下载流量:[3]KB", /*下载流量*/
    LOG_TRANSMIT_USER_UP_SPEED: "[1] [2]上传速率:[3]KBS", /*上传速率*/
    LOG_TRANSMIT_USER_DOWN_SPEED: "[1] [2]下载速率:[3]KBS", /*下载速率*/

    /*访问授权日志*/
    LOG_ACCESS_IP: "IP[1]:[0]", /*基于IP*/
    LOG_ACCESS_ACCOUNT: "帐户[1]:[0]", /*基于帐户*/

    /*上网行为日志*/
    LOG_ONLINE_URL: "网址访问", /*网址访问*/
    LOG_ONLINE_GAMES: "游戏过滤 [1] [2] [3] [0]", /*游戏过滤*/
    LOG_ONLINE_IM: "IM软件 [1] [2] [3] [0]", /*IM软件*/
    LOG_ONLINE_P2P: "P2P过滤, download [1] [2] [3] [0]", /*P2P过滤, download*/
    LOG_ONLINE_EMAIL: "邮件监控 [1] [2] [0]", /*邮件监控*/
    LOG_ONLINE_PROXY: "代理过滤 [1] [2] [3] [0]", /*代理过滤*/
    LOG_ONLINE_WEB: "WEB管理 [1] [2] [3] [0]", /*WEB管理*/
    LOG_ONLINE_STOCK_HUAANZHENGJUAN: "华安证券  [1] [2] [3] [0]",
    LOG_ONLINE_STOCK: "STOCK [1] ",
    LOG_ONLINE_MOVIE: "MOVIE [1] ",

    /* games */

    LOG_ONLINE_URL_BLACK: "[1] [2]<br/>访问网址黑名单[3]:[0]", /*网址黑名单*/
    LOG_ONLINE_URL_WHITE: "[1] [2]<br/>访问网址白名单[3]:[0]", /*网址白名单*/
    LOG_ONLINE_URL_MUSIC: "[1] [2]<br/>访问休闲娱乐类[3]:[0]", /*休闲娱乐类*/
    LOG_ONLINE_URL_NEWS: "[1] [2]<br/>访问新闻资讯类[3]:[0]", /*新闻资讯类*/
    LOG_ONLINE_URL_CHAT: "[1] [2]<br/>访问聊天交友类[3]:[0]", /*聊天交友类*/
    LOG_ONLINE_URL_GAMES: "[1] [2]<br/>访问网络游戏类[3]:[0]", /*网络游戏类*/
    LOG_ONLINE_URL_SHOPPING: "[1] [2]<br/>访问电子购物类[3]:[0]", /*电子购物类*/
    LOG_ONLINE_URL_BBS: "[1] [2]<br/>访问论坛博客类[3]:[0]", /*论坛博客类*/
    LOG_ONLINE_URL_SECURITIES: "[1] [2]<br/>访问证券基金类[3]:[0]", /*证券基金类*/
    LOG_ONLINE_URL_EMAIL: "[1] [2]<br/>访问电子邮件类[3]:[0]", /*电子邮件类*/
    LOG_ONLINE_URL_BANK: "[1] [2]<br/>访问电子银行类[3]:[0]", /*电子银行类*/
    LOG_ONLINE_URL_TUANGOU: "[1] [2]<br/>访问团购类[3]:[0]", /*团购类*/
    LOG_ONLINE_URL_PHONE: "[1] [2]<br/>访问手机论坛类[3]:[0]", /*手机论坛类*/
    LOG_ONLINE_URL_OTHERS: "[1] [2]<br/>访问其他类[3]:[0]", /*其他类*/


    LOG_ONLINE_IM_QQ: "[1] [2]<br/>登陆QQ[0]:[3]", /*QQ*/
    LOG_ONLINE_IM_MSN: "[1] [2]<br/>登陆MSN[0]:[3]", /*MSN*/
    LOG_ONLINE_IM_FETION: "[1] [2]<br/>登陆飞信:[0]", /*飞信*/
    LOG_ONLINE_IM_SKYPE: "[1] [2]<br/>登陆SKYPE:[0]", /*SKYPE*/
    LOG_ONLINE_IM_ALITALK: "[1] [2]<br/>登陆阿里旺旺:[0]", /*阿里旺旺*/
    LOG_ONLINE_IM_UTGAME: "[1] [2]<br/>登陆UT:[0]", /*阿里旺旺*/
    LOG_ONLINE_IM_YAHOO_MSG: "[1] [2]<br/>登陆雅虎:[0]", /*阿里旺旺*/
    LOG_ONLINE_IM_POP163: "[1] [2]<br/>登陆pop163:[0]", /*阿里旺旺*/
    LOG_ONLINE_IM_SOQ: "[1] [2]<br/>登陆SOQ:[0]", /*阿里旺旺*/
    LOG_ONLINE_IM_DUOWAN_WAIWAI: "[1] [2]<br/>登陆歪歪:[0]", /*阿里旺旺*/
    LOG_ONLINE_IM_ICQ: "[1] [2]<br/>登陆ICQ:[0]", /*阿里旺旺*/

    LOG_ONLINE_IM_QQ_WHITE: "[1] [2]<br/>访问QQ 白名单被[0]:[3]", /*QQ 白名单*/
    LOG_ONLINE_IM_QQ_BLACK: "[1] [2]<br/>访问QQ 黑名单被[0]:[3]", /*QQ 黑名单*/
    LOG_ONLINE_IM_MSN_WHITE: "[1] [2]<br/>访问MSN 白名单被[0]:[3]", /*MSN 白名单*/
    LOG_ONLINE_IM_MSN_BLACK: "[1] [2]<br/>访问MSN 黑名单被[0]:[3]", /*MSN 黑名单*/
    /* download */
    LOG_ONLINE_P2P_XUNLEI: "[1] [2]<br/>使用迅雷:[0]", /*迅雷*/
    LOG_ONLINE_P2P_BT: "[1] [2]<br/>使用BT:[0]", /*BT*/
    LOG_ONLINE_P2P_EMULE: "[1] [2]<br/>使用电驴:[0]", /*电驴*/
    LOG_ONLINE_P2P_KUGOU: "[1] [2]<br/>使用酷狗:[0]", /*KUGOU*/
    LOG_ONLINE_P2P_KUWO: "[1] [2]<br/>使用酷我音乐盒:[0]",
    LOG_ONLINE_P2P_FLASHGET: "[1] [2]<br/>使用FLASHGET:[0]",
    LOG_ONLINE_P2P_QQ_XUANFENG: "[1] [2]<br/>使用QQ旋风:[0]",
    LOG_ONLINE_P2P_VAGAA: "[1] [2]<br/>使用VAGAA:[0]",
    LOG_ONLINE_P2P_NAMI: "[1] [2]<br/>使用纳米:[0]",
    LOG_ONLINE_P2P_RAYFILE: "[1] [2]<br/>使用RAYFILE:[0]",
    LOG_ONLINE_P2P_PPP2008: "[1] [2]<br/>使用PPP2008:[0]",

    LOG_ONLINE_P2P_U115: "[1] [2]<br/>使用115优盘:[0]",
    LOG_ONLINE_P2P_QQLIVE: "[1] [2]<br/>使用QQLIVE:[0]",
    LOG_ONLINE_P2P_PPLIVE: "[1] [2]<br/>使用PPLIVE:[0]",
    LOG_ONLINE_P2P_PPSTREAM: "[1] [2]<br/>使用PPS影音:[0]",

    /* game   */
    LOG_ONLINE_GAME_QQ_GAME: "[1] [2]<br/>访问QQ游戏:[0]",
    LOG_ONLINE_GAME_LIANZHONG: "[1] [2]<br/>访问联众:[0]",
    LOG_ONLINE_GAME_HAOFANG: "[1] [2]<br/>访问浩方:[0]",
    LOG_ONLINE_GAME_BIANFENG: "[1] [2]<br/>访问边锋游戏:[0]",
    LOG_ONLINE_GAME_SOHU_GAME: "[1] [2]<br/>访问搜狐游戏:[0]",
    LOG_ONLINE_GAME_WOW: "[1] [2]<br/>访问魔兽世界:[0]",
    LOG_ONLINE_GAME_KADINGCHE: "[1] [2]<br/>访问卡丁车:[0]",
    LOG_ONLINE_GAME_JINWUTUAN: "[1] [2]<br/>访问劲舞团:[0]",
    LOG_ONLINE_GAME_MOYU: "[1] [2]<br/>访问魔域:[0]",
    LOG_ONLINE_GAME_ZHUXIAN: "[1] [2]<br/>访问诛仙:[0]",
    LOG_ONLINE_GAME_ZHENGTU: "[1] [2]<br/>访问征途:[0]",
    LOG_ONLINE_GAME_WANMEI: "[1] [2]<br/>访问完美世界:[0]",
    LOG_ONLINE_GAME_QIJISHIJIE: "[1] [2]<br/>访问奇迹世界:[0]",
    LOG_ONLINE_GAME_DAHUAXIYOU: "[1] [2]<br/>访问大话西游:[0]",
    LOG_ONLINE_GAME_JIANXIA2: "[1] [2]<br/>访问剑侠2:[0]",
    LOG_ONLINE_GAME_TIANLONGBABU: "[1] [2]<br/>访问天龙八部:[0]",
    LOG_ONLINE_GAME_REXUECHUANQI: "[1] [2]<br/>访问热血传奇:[0]",
    LOG_ONLINE_GAME_REXUEJIANGHU: "[1] [2]<br/>访问热血江湖:[0]",
    LOG_ONLINE_GAME_PAOPAOTANG: "[1] [2]<br/>访问泡泡堂:[0]",
    LOG_ONLINE_GAME_KAIXINWANG: "[1] [2]<br/>访问开心网:[0]",
    LOG_ONLINE_GAME_QQ_FARM: "[1] [2]<br/>访问QQ农场:[0]",
    LOG_ONLINE_GAME_YUWANG_QIPAI: "[1] [2]<br/>访问娱乐棋牌:[0]",
    LOG_ONLINE_GAME_QINPENG_QIPAI: "[1] [2]<br/>访问亲朋棋牌:[0]",
    LOG_ONLINE_GAME_CHINA_GAME: "[1] [2]<br/>访问中国游戏中心:[0]",
    LOG_ONLINE_GAME_YOUXI_CHAYUAN: "[1] [2]<br/>访问游戏茶苑:[0]",
    LOG_ONLINE_GAME_JINYOU: "[1] [2]<br/>访问金游:[0]",
    LOG_ONLINE_GAME_263_GAME: "[1] [2]<br/>访问263游戏:[0]",
    LOG_ONLINE_GAME_VS: "[1] [2]<br/>访问vs:[0]",
    LOG_ONLINE_GAME_CAIHONGDAO: "[1] [2]<br/>访问彩虹岛:[0]",
    LOG_ONLINE_GAME_FENGHUOZHILV2: "[1] [2]<br/>访问风火之旅:[0]",
    LOG_ONLINE_GAME_WULINWAIZHUAN: "[1] [2]<br/>访问武林外传:[0]",
    LOG_ONLINE_GAME_MENGHUANXIYOU: "[1] [2]<br/>访问梦幻西游:[0]",
    LOG_ONLINE_GAME_YONGHENGZHITA: "[1] [2]<br/>访问永恒之塔:[0]",
    LOG_ONLINE_GAME_SANGUOSHA: "[1] [2]<br/>访问三国杀:[0]",
    LOG_ONLINE_GAME_QQ_FARM: "[1] [2]<br/>访问QQ农场[3]:[0]", /*QQ农场*/
    LOG_ONLINE_GAME_KAIXINWANG: "[1] [2]<br/>访问开心网[3]:[0]",

    /* stock */
    LOG_ONLINE_STOCK_DAZHIHUI: "[1] [2]<br/>访问大智慧:[0]",
    LOG_ONLINE_STOCK_QIANLONG_2009: "[1] [2]<br/>访问钱龙:[0]",
    LOG_ONLINE_STOCK_TONGHUASHUN: "[1] [2]<br/>访问同花顺:[0]",
    LOG_ONLINE_STOCK_DACHELUE: "[1] [2]<br/>访问大策略:[0]",
    LOG_ONLINE_STOCK_HUAANZHENGJUAN: "[1] [2]<br/>访问华安证券:[0]",
    LOG_ONLINE_STOCK_JIANGHAIZHENGJUAN: "[1] [2]<br/>访问江海证券:[0]",
    LOG_ONLINE_STOCK_FENXIJIA: "[1] [2]<br/>访问分析家:[0]",
    LOG_ONLINE_STOCK_GUOTAIJUNAN: "[1] [2]<br/>访问国泰君安:[0]",
    LOG_ONLINE_STOCK_ZHENGJUANZHIXING: "[1] [2]<br/>访问证券之星:[0]",
    LOG_ONLINE_STOCK_TONGXINDA: "[1] [2]<br/>访问通达信:[0]",
    LOG_ONLINE_STOCK_HEXUNGUDAO: "[1] [2]<br/>访问和讯股道:[0]",
    LOG_ONLINE_STOCK_YIMENG_CAOPANSHOU: "[1] [2]<br/>访问益盟操盘手:[0]",
    LOG_ONLINE_STOCK_DONGFANG_CAIFUTONG: "[1] [2]<br/>访问东方财富通:[0]",
    LOG_ONLINE_STOCK_ZHUOMIAN_GUPIAO: "[1] [2]<br/>访问桌面股票:[0]",
    LOG_ONLINE_STOCK_ANXIN_ZHENGJUAN: "[1] [2]<br/>访问安信证券:[0]",

    /* movie */
    LOG_ONLINE_MOVIE_PPLIVE: "[1] [2]<br/>访问PPTV:[0]",
    LOG_ONLINE_MOVIE_PPS: "[1] [2]<br/>访问PPS影音:[0]",
    LOG_ONLINE_MOVIE_QQLIVE: "[1] [2]<br/>访问QQLIVE:[0]",
    LOG_ONLINE_MOVIE_SINA_TV: "[1] [2]<br/>访问新浪TV:[0]",
    LOG_ONLINE_MOVIE_XUNLEI_KANKAN: "[1] [2]<br/>访问迅雷看看:[0]",
    LOG_ONLINE_MOVIE_PPVOD: "[1] [2]<br/>访问PPVOD:[0]",
    LOG_ONLINE_MOVIE_PPGOU: "[1] [2]<br/>访问PPGOU:[0]",
    LOG_ONLINE_MOVIE_SOHU_TV: "[1] [2]<br/>访问搜狐TV:[0]",
    LOG_ONLINE_MOVIE_TUDOU: "[1] [2]<br/>访问土豆视频:[0]",
    LOG_ONLINE_MOVIE_YOUKU: "[1] [2]<br/>访问优酷:[0]",
    LOG_ONLINE_MOVIE_KU6: "[1] [2]<br/>访问酷6:[0]",
    LOG_ONLINE_MOVIE_6ROOMS: "[1] [2]<br/>访问六间房:[0]",
    LOG_ONLINE_MOVIE_PIPI: "[1] [2]<br/>访问皮皮影视:[0]",
    LOG_ONLINE_MOVIE_SOPCAST: "[1] [2]<br/>访问SOPCAST:[0]",
    LOG_ONLINE_MOVIE_UUSEE: "[1] [2]<br/>访问UUSEE:[0]",
    LOG_ONLINE_MOVIE_PPMATE: "[1] [2]<br/>访问PPMATE:[0]",
    LOG_ONLINE_MOVIE_TVANTS: "[1] [2]<br/>访问TVANTS:[0]",
    LOG_ONLINE_MOVIE_QYULE: "[1] [2]<br/>访问QYULE:[0]",
    LOG_ONLINE_MOVIE_TV56: "[1] [2]<br/>访问TV56:[0]",
    LOG_ONLINE_MOVIE_TTLIVE: "[1] [2]<br/>访问天天LIVE:[0]",
    LOG_ONLINE_MOVIE_FUNSHION: "[1] [2]<br/>访问风行:[0]",
    LOG_ONLINE_MOVIE_BAOFENG: "[1] [2]<br/>访问暴风影音2012:[0]",
    LOG_ONLINE_MOVIE_QVOD: "[1] [2]<br/>访问快播:[0]",
    LOG_ONLINE_MOVIE_QQMUISC: "[1] [2]<br/>访问QQ音乐:[0]",
    LOG_ONLINE_MOVIE_BAIDU_YINGYIN: "[1] [2]<br/>访问百度影音:[0]",

    LOG_CALLBOARD_SEND: "向[1]发送\"[2]\"公告",
    LOG_CALLBOARD_RECV: "收到[1]的\"[2]\"公告确认",

    LOG_ONLINE_PROXY_HTTP: "HTTP代理[1] [2] [0]", /*HTTP*/
    LOG_ONLINE_PROXY_SOCKET4: "SOCKET4代理[1] [2] [0]", /*SOCKET4*/
    LOG_ONLINE_PROXY_SOCKET5: "SOCKET5代理[1] [2] [0]", /*SOCKET5*/

    LOG_ONLINE_WEB_POST: "WEB提交 [1] [2] [3] [0]", /*POST*/
    LOG_ONLINE_WEB_EXTENSION: "文件扩展类型[1] [2] [3] [0]", /*扩展名*/
    LOG_ONLINE_WEB_KEY: "URL关键字[1] [2] [3] [0]", /*关键字*/

    /*接入管理日志*/
    LOG_CONNECT_STANDARD: "标准接入[1] [2] [3] [0]", /*标准接入*/
    LOG_CONNECT_L2TP: "L2TP[0]@LOG_SUCC_FAILED_action", /*L2TP*/
    LOG_CONNECT_PPTP: "PPTP[0]@LOG_SUCC_FAILED_action", /*PPTP*/
    LOG_CONNECT_LOAD_BALANCE: "负载均衡 源WAN[1] 目的WAN[2]:[0]", /*负载均衡*/
    LOG_CONNECT_POLICY_ROUTE: "策略路由WAN[1] IP[2]:[0]", /*策略路由*/

    LOG_CONNECT_STANDARD_PORT: "WAN[0]@LOG_CONN_DISC_action", /*物理端口*/
    LOG_CONNECT_STANDARD_STATIC: "[0]@LOG_CONN_STATIC_action", /*STATIC*/
    LOG_CONNECT_STANDARD_DHCP: "[0]@LOG_CONNECT_STANDARD_DHCP_action", /*DHCP*/
    LOG_CONNECT_STANDARD_PPTP: "PPTP客户端 [1] [0]@LOG_CONNECT_STANDARD_PPPOE_action", /*pptp*/
    LOG_CONNECT_STANDARD_PPTP_SERVER: "PPTP服务器 [1] [0]@LOG_CONNECT_STANDARD_PPPOE_action", /*pptp*/
    LOG_CONNECT_STANDARD_L2TP: "L2TP客户端 [1] [0]@LOG_CONNECT_STANDARD_PPPOE_action", /*l2tp*/
    LOG_CONNECT_STANDARD_L2TP_SERVER: "L2TP服务器 [1] [0]@LOG_CONNECT_STANDARD_PPPOE_action", /*l2tp*/
    LOG_CONNECT_STANDARD_PPPOE_SERVER: "帐号[1] [0]@LOG_CONNECT_STANDARD_PPPOE_action", /*PPPoE server*/
    LOG_CONNECT_STANDARD_PPPOE: "[0]@LOG_CONNECT_STANDARD_PPPOE_action", /*PPPoE*/
    LOG_CONNECT_STANDARD_GUANGDIAN: "WAN[1] [0]@LOG_CONNECT_STANDARD_GUANGDIAN_action", /*广电*/
    LOG_CONNECT_STANDARD_HLJ: "WAN[1] [0]@LOG_CONNECT_STANDARD_HLJ_action", /*黑龙江农垦*/
    LOG_CONNECT_STANDARD_HN_DHCP: "WAN[1] [0]@LOG_CONNECT_STANDARD_HN_DHCP_action", /*河南DHCP*/

    LOG_WORKMODE_CHANGING: "WAN[1] 改变接口工作模式",

    LOG_VIRUSRECOVERY_SET: "病毒防御日志:[1] [2]",

    LOG_SYSTEM_CONFIG_CGI: "[1] [0] [2]@LOG_SYSTEM_CONFIG_CGI_action",
    LOG_IFSTATE_CHECK: "[1] [0]@LOG_IFSTATE_action",
    LOG_IFSTATE_PING_CHECK: "Ping WAN[1] [0]@LOG_IFSTATE_action",
    LOG_ARP_CLASH: "ARP冲突: [1]",
    unknown: ""
};

igd.log_action = {
    LOG_IFSTATE_action: ['初始化成功', '初始化失败', '线路检测成功', '线路检测失败'],
    LOG_CONNECT_STANDARD_DHCP_action: [
        "WAN口向服务器发送拨号请求DHCP DISCOVERY",
        "WAN口向DHCP服务器发送DHCP REQUEST",
        "WAN口向DHCP服务器发送续租请求DHCP REQUEST",
        "WAN口向DHCP服务器发送断开DHCP RELEASE",
        "WAN口收到DHCP服务器发送的配置确认DHCP ACK",
        "WAN口收到DHCP服务器发送的配置确认DHCP NAK",
        "WAN口收到DHCP服务器发送的拨号请求回应DHCP OFFER",
        "拨号成功,获取到IP地址[2],租期[3]分钟",
        "WAN口向服务器发送地址冲突确认DHCP DECLINE",
        "DHCP客户端建立socket失败",
        "DHCP服务器没有响应请求",
        "DHCP服务器地址池已满",
        "设置上网方式为动态IP上网"
    ],
    LOG_CONNECT_STANDARD_PPPOE_action: [
        "WAN口向服务器发送拨号请求PADI",
        "WAN口向服务器发送PADR",
        "WAN口收到服务器发送的PADO",
        "WAN口收到服务器发送的PADS",
        "WAN口向服务器发送断开连接请求PADT",
        "WAN口收到服务器发送PPPoE断开连接请求PADT",
        "拨号成功，获取到IP地址[3]",
        "拨号认证失败，请检查用户名密码或向运营商咨询",
        "用户名密码正确，拨号认证成功",
        "发送认证的用户名称和密码",
        "用户请求断开或连接超时断开",
        "WAN口向服务器发送断开连接请求Terminate Request",
        "WAN口向服务器发送断开连接确认Terminate ACK",
        "WAN口收到服务器发送断开连接请求Terminate Request",
        "WAN口收到服务器发送断开连接确认Terminate ACK",
        "LCP连接建立失败",
        "ECP、CCP协议都没有运行",
        "MPPE出错",
        "PPPD初始化失败，请检查线路及服务器是否开启服务",
        "PPPoE服务器被攻击，企图中断此用户连接",
        "WAN口和服务器协商的认证方式为PAP",
        "WAN口和服务器协商的认证方式为CHAP",
        "WAN口和服务器协商的认证方式为MS-CHAP",
        "WAN口和服务器协商的认证方式为MS-CHAP2",
        "WAN口和服务器协商的认证方式为EAP",
        "获取到IP地址失败，请向运营商咨询",
        "WAN口向服务器发送链路检测ECHO REQUEST",
        "WAN口收到服务器发送的链路检测ECHO REPLY",
        "WAN口收到服务器发送的链路检测ECHO REQUEST",
        "WAN口向服务器发送的链路检测ECHO REPLY",
        "设置上网方式为PPPoE拨号上网"
    ],
    LOG_CONNECT_STANDARD_GUANGDIAN_action: [
        "帐号，密码 认证通过",
        "帐号，密码 认证失败",
        "发送认证报文",
        "发送维护报文",
        "收到认证报文回应",
        "收到维护报文回应",
        "Router已经发送了4个认证报文，但是没有收到服务器的回应，停止发送认证报文",
        "发送认证报文超时，重新发送认证报文",
        "发送断开连接报文"
    ],
    LOG_CONNECT_STANDARD_HLJ_action: [
        "帐号，密码 认证通过",
        "帐号，密码 认证失败",
        "发送认证报文",
        "发送维护报文",
        "收到认证报文回应",
        "收到维护报文回应",
        "Router已经发送了4个认证报文，但是没有收到服务器的回应，停止发送认证报文",
        "发送认证报文超时，重新发送认证报文",
        "发送断开连接报文"
    ],
    LOG_CONNECT_STANDARD_HN_DHCP_action: [
        "帐号，密码 认证通过",
        "帐号，密码 认证失败",
        "发送认证报文",
        "收到认证报文回应",
        "发送断开连接报文"
    ],
    LOG_CONN_DISC_action: [
        "口连接成功, 当前速度[2],[3]",
        "口断开连接"
    ],
    LOG_CONN_STATIC_action: [
        "设置静态IP：[2]",
        "释放静态IP：[2]",
        "设置上网方式为静态IP上网",
        "WAN口发送对地址[2]的ARP请求",
        "WAN口收到地址[2]的ARP响应",
        "WAN口收到地址为[2]的ARP请求",
        "WAN口回应地址[2]的ARP请求"
    ],
    LOG_SUCC_FAILED_action: ["成功", "失败", "文件格式不正确", "内容不正确"],
    LOG_ON_OFF_action: ["关闭", "开启"],
    LOG_DEFUALT_action: ["阻断", "允许", "警告"],
    LOG_SYSTEM_EVENT_LAN_action: ["上线", "下线"],
    LOG_SYSTEM_CONFIG_CGI_action: ["开启", "关闭", "增加", "修改", "删除", "删除所有", "连接", "断开", "成功", "失败"]
};

var LOG_CGI_FUN = {

    LOG_CGI_FUN_WANCONN: "WAN口连接",
    LOG_CGI_FUN_SYSLOG: "系统日志",
    LOG_CGI_FUN_L7LOG: "行为管理日志",
    LOG_CGI_FUN_SERVERLOG: "日志服务器",
    LOG_CGI_FUN_CBLOG: "公告日志",
    LOG_CGI_FUN_WANCONFIG: "外网接入配置",
    LOG_CGI_FUN_WANNS: "网络尖兵配置",
    LOG_CGI_FUN_LANMAC: "LAN口MAC",
    LOG_CGI_FUN_LANIP: "LAN口IP",
    LOG_CGI_FUN_DHCPCONF: "DHCP配置",
    LOG_CGI_FUN_DHCPBAOLIU: "DHCP保留",
    LOG_CGI_FUN_WANMODE: "WAN口模式",


    LOG_CGI_FUN_L7USER: "用户组",
    LOG_CGI_FUN_L7TIME: "时间段",
    LOG_CGI_FUN_L7ONLINE: "网址分类管理",
    LOG_CGI_FUN_L7WEB: "WEB安全管理",
    LOG_CGI_FUN_L7PROXY: "代理过滤",
    LOG_CGI_FUN_L7CHAT: "聊天软件过滤",
    LOG_CGI_FUN_L7P2P: "P2P软件过滤",
    LOG_CGI_FUN_L7VIDEO: "视频软件过滤",
    LOG_CGI_FUN_L7QQ: "QQ黑白名单",
    LOG_CGI_FUN_L7MSN: "MSN黑白名单",
    LOG_CGI_FUN_L7URL: "URL黑白名单",
    LOG_CGI_FUN_L7ONLINEEXP: "网址分类例外组",
    LOG_CGI_FUN_L7WEBEXP: "WEB安全例外组",
    LOG_CGI_FUN_L7PROXYEXP: "代理软件例外组",
    LOG_CGI_FUN_L7CHATEXP: "聊天软件例外组",
    LOG_CGI_FUN_L7P2PEXP: "P2P软件例外组",
    LOG_CGI_FUN_L7VIDEOEXP: "视频软件例外组",


    LOG_CGI_FUN_PINGWAN: "忽略WAN口的PING包",
    LOG_CGI_FUN_PINGLAN: "禁止PING网关",
    LOG_CGI_FUN_DUANKOU: "忽略端口扫描报文",
    LOG_CGI_FUN_ICMPFLOOD: "ICMP-Flood攻击防御",
    LOG_CGI_FUN_TCPFLOOD: "TCP-SYN-Flood攻击防御",
    LOG_CGI_FUN_UDPFLOOD: "UDP-Flood攻击防御",
    LOG_CGI_FUN_BINGDU: "病毒过滤",
    LOG_CGI_FUN_ARPATTACK: "ARP攻击防御",
    LOG_CGI_FUN_DEFHOSTLIMIT: "默认主机连接限制",
    LOG_CGI_FUN_HOSTLIMIT: "主机连接限制",
    LOG_CGI_FUN_ARPBIND: "IP/MAC绑定",
    LOG_CGI_FUN_NTOOLS: "网络工具",
    LOG_CGI_FUN_IPFILTER: "IP访问控制",
    LOG_CGI_FUN_MACFILTER: "MAC地址过滤",


    LOG_CGI_FUN_FTP: "FTP私有端口",
    LOG_CGI_FUN_ALGPPTP: "PPTP透传",
    LOG_CGI_FUN_ALGFTP: "FTP自适应主被动",
    LOG_CGI_FUN_ALGMSN: "MSN语音视频支持",
    LOG_CGI_FUN_ALGNETM: "NetMeeting语音视频支持",
    LOG_CGI_FUN_ALGQQ: "QQ语音视频支持",
    LOG_CGI_FUN_UPNP: "UPNP设置",
    LOG_CGI_FUN_DMZ: "DMZ设置",
    LOG_CGI_FUN_VIRTUAL: "虚拟服务",


    LOG_CGI_FUN_QOSXIANZDEF: "默认主机带宽控制",
    LOG_CGI_FUN_QOSXIANZ: "主机带宽控制",
    LOG_CGI_FUN_QOSAPP: "应用优先级配置",


    LOG_CGI_FUN_TIME: "时间设置",
    LOG_CGI_FUN_VLAN: "VLAN配置",
    LOG_CGI_FUN_DNSMASQ: "DNS域名服务",
    LOG_CGI_FUN_DDNS: "DDNS动态域名",
    LOG_CGI_FUN_DROUTE: "动态路由",
    LOG_CGI_FUN_LANROUTE: "LAN到LAN路由",
    LOG_CGI_FUN_SROUTE: "静态路由",

    LOG_CGI_FUN_REBOOT: "重启路由器",
    LOG_CGI_FUN_RESTORE: "恢复默认参数",
    LOG_CGI_FUN_USERNAME: "用户名密码",
    LOG_CGI_FUN_WEBPORT: "WEB端口管理",
    LOG_CGI_FUN_WEBREMOTE: "WEB远程管理",
    LOG_CGI_FUN_UPGRADE: "固件升级",
    LOG_CGI_FUN_PARAUP: "参数导入",
    LOG_CGI_FUN_PARADOWN: "参数导出",
    unknown: ""
}


var lan_replace_arr = ["0天", "0小时", "0分", "0秒"];

var wan_replace_arr = [
    [],
    ["", "10Mbps", "100Mbps"],
    ["", "全双工", "半双工"]
];

function get_log_msg(data) {
    msg_str = igd.log_info[data.event];
    if (!msg_str) {											//在igd.log_info中未定义，打出提示
        msg_str = data.event + " not found in log.js  /msg:";
        for (i = 0; i < data.msg.length; i++) {
            if (data.msg[i])
                msg_str += ' ' + data.msg[i];
        }
        return msg_str.fontcolor("red");
    }
    var contain_sp_arr = []; 								//专门用于取带有[SP]动作的action contain_sp_arr[0]为动作名称
    action_arr = msg_str.split("@");						//取@后面的action动作
    action = data.action - 1;
    if (action_arr.length == 1) {
        action_str = igd.log_action.LOG_DEFUALT_action[action];//action动作默认：阻断，允许
    } else {
        msg_str = action_arr[0];
        if (action_arr[1].indexOf("[SP]") != -1) {					//action动作不在末尾
            contain_sp_arr = action_arr[1].split("[SP]");
            action_str = igd.log_action[contain_sp_arr[0]][action];
            msg_str += contain_sp_arr[1];
        }
        else {													//通过@LOG_XXX_action 指定的action动作
            action_str = igd.log_action[action_arr[1]][action];
        }
    }

    tmp_arr = msg_str.split('[0]');
    if (tmp_arr.length != 1) {									//有action动作
        msg_str = tmp_arr[0] + action_str + tmp_arr[1];
    }

    for (i = 0; i < data.msg.length; i++) {
        j = i + 1;
        if (msg_str.indexOf("[" + j + "]") > -1) {
            tmp_arr = msg_str.split("[" + j + "]");
            if (typeof tmp_arr[1] == "undefined")
                tmp_arr[1] = '';
            if (data.event == "LOG_SYSTEM_CONFIG_CGI" && LOG_CGI_FUN[data.msg[i]]) {
                msg_str = tmp_arr[0] + LOG_CGI_FUN[data.msg[i]] + tmp_arr[1];
            }
            else {
                if (contain_sp_arr[0] == "LOG_SYSTEM_EVENT_LAN_action" && i >= 0 && i <= 3) {//内网监控日志并且参数为上下行
                    data.msg[i] = math_unit_converter(data.msg[i]);
                }
                if (data.event == "LOG_CONNECT_STANDARD_PORT" && data.action == "1") {//物理端口日志
                    data.msg[i] = wan_replace_arr[i][parseInt(data.msg[i])];
                }
                msg_str = tmp_arr[0] + data.msg[i] + tmp_arr[1];
            }
        }
    }

    var ip_tmp_arr = msg_str.split('[IP]');//有IP
    if (ip_tmp_arr.length != 1) {
        if (data.ip != "0.0.0.0") {
            msg_str = ip_tmp_arr[0] + data.ip + ip_tmp_arr[1];
        }
        else {
            msg_str = ip_tmp_arr[0] + ip_tmp_arr[1];
        }
    }
    ///
    if (ROUTE_INFO.g_wan_number == 1) {
        var temp = msg_str.split("WAN1");
        if (temp.length != 1) {
            var temp_str = "";
            for (var i = 0; i < temp.length; i++) {
                if (i != temp.length - 1)
                    temp_str += temp[i] + "WAN";
                else
                    temp_str += temp[i];
            }
            msg_str = temp_str;
        }
    }
    //内网监控日志
    if (contain_sp_arr[0] == "LOG_SYSTEM_EVENT_LAN_action") {
        if (data.action == "1") {
            msg_str = msg_str.split("<br/>")[0];
        }
        msg_str = format_lan_action(msg_str);
    }
    return msg_str;
}

//内网监控日志显示格式化
function format_lan_action(msg) {
    var str = msg;
    for (var i = 0; i < lan_replace_arr.length; i++) {
        str = str.replace(lan_replace_arr[i], "");
    }
    return str;
}

//=========================拨号日志===========================
var log_timer;
function init_log(flag) {
    if (flag == "refresh") {
        show_message("refreshing");
        if (log_timer)
            window.clearTimeout(log_timer);
        log_timer = window.setTimeout(function () {
            get_log("refresh");
        }, 500);
    }
    else
        get_log();

}
function get_log(flag) {
    $.post("router/log_get.cgi", {mid: 0}, function (data) {
        if (flag == "refresh") {
            hide_pop_layer("message_layer");
            hide_pop_layer("lock_div");
        }
        var data = dataDeal(data);
        paint_log_tab(data);
    });
}

function paint_log_tab(data) {
    $("#logTab").html("");
    var log_empty = $("#log_empty");
    if (log_empty.length > 0)
        $("#log_empty").remove();
    if (data.length == 0) {
        $("#log_delete_btn").css("display", "none");
        $("#logTab").after("<p id=\"log_empty\" class=\"center_tip\">" + L.log_null + "</p>");
    }
    else {
        $("#log_delete_btn").css("display", "");
        data.reverse();
        var new_data = [];

        for (var id in data) {
            new_data.push({id: "", time: data[id].time, msg: get_log_msg(data[id])});//已开启自动编号
        }

        var tab = new Table("logTab", [L.index, L.s_time, L.s_event], new_data, {
            sortable: true,
            auto_index: true,
            sortOptions: [
                {},
                {sortOrder: "desc", sortEvent: "Array_str_compare_time"},
                {sortOrder: "none", sortEvent: "Array_str_compare_event"}
            ]
        });
        tab.initTable();
    }
}

function log_delete() {
    show_dialog(L.confirm_del_log, function () {
        show_message("deleteing");
        $.post("/router/log_clean.cgi", {filter: "general"}, function (data) {
            var data = dataDeal(data);
            if (data == "SUCCESS") {
                show_message("del_success");
            }
            else {
                show_message("error", igd.make_err_msg(data));
            }
            init_log();
        });
    });
}
//===========================================================
