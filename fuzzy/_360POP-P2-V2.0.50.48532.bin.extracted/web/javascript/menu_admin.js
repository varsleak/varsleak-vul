window.igd = igd || {};
igd.menu = {
    index_page: {
        title: L.my_router
    },
    nav_device_list: {
        title: L.who_is_on_line
    },
    nav_protection: {
        title: L.internet_security
    },
    nav_addon: {
        title: L.function_extend
    },
    nav_setting: {
        title: L.route_set,
        submenu: [
            {
                title: L.quick_set,
                submenu: [
                    {tab_title: L.wireless_menu_title, tab_id: "wireless_base_tab"},
                    {tab_title: L.wan_setup_menu_title, tab_id: "wan_setup_tab"},
                    {tab_title: L.misc_reboot_menu_title, tab_id: "misc_reboot_tab"}
                ]
            },
            {
                title: L.advance_set,
                submenu: [
                    {tab_title: L.password_menu_title, tab_id: "password_tab"},
                    {tab_title: L.lan_setup_menu_title, tab_id: "lan_setup_tab"},
                    {tab_title: L.update_menu_title, tab_id: "update_tab"},
                    {tab_title: L.system_time_menu_title, tab_id: "system_time_tab"},
                    {tab_title: L.rally_default_menu_title, tab_id: "rally_default_tab"},
					{tab_title: L.developer_menu_title, tab_id: "developer_tab"},
					{tab_title: L.log_menu_title, tab_id: "log_tab"},
                    {tab_title: L.my_router_menu_title, tab_id: "router_info_tab"}
                ]
            }
        ]
    },
    nav_mobile_app:{
        title: L.use_mobile
    },
	smart_home:{
        title: L.smart_home
    },
	igd_ap:{
		title: L.igd_ap
	},
    store_manage:{
        title: L.store_manage
    },
    igd_sw:{
        title: L.hitch_diagnosis
    },
    igd_wisp:{
        title: L.hitch_diagnosis
    }

};