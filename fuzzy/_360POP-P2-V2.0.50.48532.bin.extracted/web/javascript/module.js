if(!igd) var igd=new Object();

igd.global_param = {
    user_url:"www.360.cn",
    app_url:"www.360.cn",
    language_type:"CN",
    update_time : 160,
    reboot_time : 80,
    default_ip:"192.168.0.1",
    default_lan_mask:"255.255.255.0",
    default_port:"80",
    default_user:"admin",
    wan_number:1,
    lan_number:2,
    variable:0,
    variable_num:0,
    is_oem:false,
    is_5G:true,    /*是否含有5G页面*/
    is_store_manage:true,    /*是否含有存储管理页面*/
	is_touch_link:true,
	need_wireless_pwd:true,/*true为需要无线密码，false为不需要*/
	pwd_string:"#$%&*!1234KIJD#$@&11OIHDD#$%^&*#$%&*!1234KIJD#$@&11OIHDD#$%^&*#$%&*!1234KIJD#$@&11OIHDD#$%^&*#$%&*!1234KIJD#$@&11OIHDD#$%^&*111",
    lan_position:'L',/*LAN口顺序 L为从左到右(lan1 lan2 lan3…) R为从右到左(lan3 lan2 lan1…)*/
    wan_position:'L',/*WAN口和LAN口顺序 L为从左到右（wan lan） R为从右到左(lan wan)*/
    pptp_max_num:10,
    l2tp_max_num:10
};
