/**
 * Created by lan on 14-3-24.
 */
//排序------
var host_info_sort_type_arr=new  Object();
host_info_sort_type_arr.ip_type='up';
//host_info_sort_type_arr.mac_type='up';
host_info_sort_type_arr.conn_count_type='up';
host_info_sort_type_arr.up_speed_qos_type='up';
host_info_sort_type_arr.down_speed_qos_type='up';
host_info_sort_type_arr.up_byte_type='up';
host_info_sort_type_arr.down_byte_type='up';
host_info_sort_type_arr.host_name_type='up';
host_info_sort_type_arr.up_time_type='up';

function init_host_info_sort_type(){
    host_info_sort_type_arr.ip_type=(host_info_sort_type_arr.ip_type=='up'?'down':'up');
//    host_info_sort_type_arr.mac_type=(host_info_sort_type_arr.mac_type=='up'?'down':'up');
    host_info_sort_type_arr.conn_count_type=(host_info_sort_type_arr.conn_count_type=='up'?'down':'up');
    host_info_sort_type_arr.up_speed_qos_type=(host_info_sort_type_arr.up_speed_qos_type=='up'?'down':'up');
    host_info_sort_type_arr.down_speed_qos_type=(host_info_sort_type_arr.down_speed_qos_type=='up'?'down':'up');
    host_info_sort_type_arr.up_byte_type=(host_info_sort_type_arr.up_byte_type=='up'?'down':'up');
    host_info_sort_type_arr.down_byte_type=(host_info_sort_type_arr.down_byte_type=='up'?'down':'up');
    host_info_sort_type_arr.host_name_type=(host_info_sort_type_arr.host_name_type=='up'?'down':'up');
    host_info_sort_type_arr.up_time_type=(host_info_sort_type_arr.up_time_type=='up'?'down':'up');
}

function host_info_sort(host_sort_type){
    host_list_sort_type=host_sort_type;
    host_info_sort_type_arr[host_sort_type+'_type']=(host_info_sort_type_arr[host_sort_type+'_type']=='up'?'down':'up');

    lan_net_view_stop_refresh();
    host_info_sort_fun();

    var dataStrip=host_list_temp_info.length; //得到多少条表格数据
    if(pageType==1){
        pre_scrollTop=set_scroll();
        clearTableData('host_con_info');
        initTableStripNum(dataStrip,pageType); //初始化表格的 当前 还剩 的数据
        initHostListTableInfo(dataStrip);
    }
    else{
        pre_scrollTop=set_scroll();
        clearTableData('host_list_ip_title_info');
        initHostListIpTitleTable(data,dataStrip);
    }
    lan_net_view_refresh();
}
function host_info_sort_fun(){
    switch (host_list_sort_type){
        case 'ip':host_list_ip();break;
//        case 'mac':host_list_mac();break;
        case 'conn_count':host_list_conn_count();break;
        case 'up_speed_qos':host_list_up_speed_qos();break;
        case 'down_speed_qos':host_list_down_speed_qos();break;
        case 'up_byte':host_list_up_byte();break;
        case 'down_byte':host_list_down_byte();break;
        case 'host_name':host_list_host_name();break;
        case 'up_time':host_list_up_time();break;
    }
}
//host 排序函数
function host_list_ip(){
    host_list_temp_info.sort(host_Array_int_compare_ip);
    if(host_info_sort_type_arr.ip_type=='down')   host_list_temp_info.reverse();
//    host_info_sort_type_arr.ip_type=(host_info_sort_type_arr.ip_type=='up'?'down':'up');
}
//function host_list_mac(){
//    host_list_temp_info.sort(host_Array_int_compare_mac);
//    if(host_info_sort_type_arr.mac_type=='down')
//        host_list_temp_info.reverse();
//    host_info_sort_type_arr.mac_type=(host_info_sort_type_arr.mac_type=='up'?'down':'up');
//}
function host_list_conn_count(){
    host_list_temp_info.sort(host_Array_int_compare_conn_count);
    if(host_info_sort_type_arr.conn_count_type=='down')
        host_list_temp_info.reverse();
//    host_info_sort_type_arr.conn_count_type=(host_info_sort_type_arr.conn_count_type=='up'?'down':'up');
}
function host_list_up_speed_qos(){
    host_list_temp_info.sort(host_Array_int_compare_up_speed_qos);
    if(host_info_sort_type_arr.up_speed_qos_type=='down')
        host_list_temp_info.reverse();
//    host_info_sort_type_arr.up_speed_qos_type=(host_info_sort_type_arr.up_speed_qos_type=='up'?'down':'up');
}
function host_list_down_speed_qos(){
    host_list_temp_info.sort(host_Array_int_compare_down_speed_qos);
    if(host_info_sort_type_arr.down_speed_qos_type=='down')
        host_list_temp_info.reverse();
//    host_info_sort_type_arr.down_speed_qos_type=(host_info_sort_type_arr.down_speed_qos_type=='up'?'down':'up');
}
function host_list_up_byte(){
    host_list_temp_info.sort(host_Array_int_compare_up_byte);
    if(host_info_sort_type_arr.up_byte_type=='down')
        host_list_temp_info.reverse();
//    host_info_sort_type_arr.up_byte_type=(host_info_sort_type_arr.up_byte_type=='up'?'down':'up');
}
function host_list_down_byte(){
    host_list_temp_info.sort(host_Array_int_compare_down_byte);
    if(host_info_sort_type_arr.down_byte_type=='down')
        host_list_temp_info.reverse();
//    host_info_sort_type_arr.down_byte_type=(host_info_sort_type_arr.down_byte_type=='up'?'down':'up');
}
function host_list_host_name(){
    host_list_temp_info.sort(host_Array_str_compare_host);
    if(host_info_sort_type_arr.host_name_type=='down')
        host_list_temp_info.reverse();
//    host_info_sort_type_arr.host_name_type=(host_info_sort_type_arr.host_name_type=='up'?'down':'up');
}
function host_list_up_time(){
    host_list_temp_info.sort(host_Array_int_compare_time);
    if(host_info_sort_type_arr.up_time_type=='down')
        host_list_temp_info.reverse();
//    host_info_sort_type_arr.up_time_type=(host_info_sort_type_arr.up_time_type=='up'?'down':'up');
}

//排序函数----------
function host_Array_int_compare_ip(a,b){
    return ip_compare(a.ip,b.ip);
}
function host_Array_int_compare_mac(a,b){ //add jdx 20111220
    return mac_compare(a.mac,b.mac);
}
function host_Array_int_compare_conn_count(a,b){
    return int_compare(a.conn_count,b.conn_count);
}
function host_Array_int_compare_up_speed_qos(a,b){
    return int_compare(a.up_speed_qos,b.up_speed_qos);
}
function host_Array_int_compare_down_speed_qos(a,b){
    return int_compare(a.down_speed_qos,b.down_speed_qos);
}
function host_Array_int_compare_up_byte(a,b){
    return int_compare(a.up_byte,b.up_byte);
}
function host_Array_int_compare_down_byte(a,b){
    return int_compare(a.down_byte,b.down_byte);
}
function host_Array_str_compare_host(a,b){
    if(a.host_name>b.host_name)return 1;
    else if(a.host_name<b.host_name)return -1;
    else return 0;
}
function host_Array_int_compare_time(a,b){
    var at=a.up_time;
    var bt=b.up_time;
    var cur=at.day-bt.day;
    if(cur==0)cur=at.hour-bt.hour;
    else return parseInt(cur,10);
    if(cur==0)cur=at.min-bt.min;
    else return parseInt(cur,10);
    if(cur==0)cur=at.sec-bt.sec;
    return parseInt(cur,10);
}
///////IP比较
function ip_compare(ip1, ip2)
{
    var a1 = ip1.split('.');
    var b1 = ip2.split('.');
    var i = 0;
    for( i= 0 ; i < a1.length; i ++)
    {
        if(parseInt(a1[i],10) > parseInt(b1[i],10))
            return 1;
        if(parseInt(a1[i],10) < parseInt(b1[i],10))
            return -1;
    }

//    if(igd_order=="dec")
//        return 1;
//    else
//        return 0;

    /*if(parseInt(a1[i]) == parseInt(b1[i]))
     {
     if(igd_order=="dec")
     return 1;
     else
     return 0;
     }
     return 0;*/
}
//MAC 和 String 比较
function mac_compare(mac1, mac2)
{
    if(mac1 < mac2)
        return -1;
    else if(mac1 == mac2)
    {
//        if(igd_order=="dec")
//            return 1;
//        else
        return 0;
    }
    else
        return 1;
}
function int_compare(int1,int2)
{
    var a=parseInt(int1,10);
    var b=parseInt(int2,10);
    if(a < b)
        return -1;
    else if(a == b)
    {
//        if(igd_order=="dec")  return 1;
//        else
        return 0;
    }
    else
        return 1;
}


//host_conn 排序------------------

var host_conn_sort_type_arr=new  Object();
host_conn_sort_type_arr.proto='up';
host_conn_sort_type_arr.src_ip='up';
host_conn_sort_type_arr.des_ip='up';
host_conn_sort_type_arr.src_port='up';
host_conn_sort_type_arr.dest_port='up';
host_conn_sort_type_arr.app_name='up';
host_conn_sort_type_arr.up_bytes='up';
host_conn_sort_type_arr.down_bytes='up';
host_conn_sort_type_arr.up_speed='up';
host_conn_sort_type_arr.down_speed='up';
host_conn_sort_type_arr.out_interface='up';

function init_host_conn_sort_type(){
    host_conn_sort_type_arr.proto=(host_conn_sort_type_arr.proto=='up'?'down':'up');
    host_conn_sort_type_arr.src_ip=(host_conn_sort_type_arr.src_ip=='up'?'down':'up');
    host_conn_sort_type_arr.des_ip=(host_conn_sort_type_arr.des_ip=='up'?'down':'up');
    host_conn_sort_type_arr.src_port=(host_conn_sort_type_arr.src_port=='up'?'down':'up');
    host_conn_sort_type_arr.dest_port=(host_conn_sort_type_arr.dest_port=='up'?'down':'up');
    host_conn_sort_type_arr.app_name=(host_conn_sort_type_arr.app_name=='up'?'down':'up');
    host_conn_sort_type_arr.up_bytes=(host_conn_sort_type_arr.up_bytes=='up'?'down':'up');
    host_conn_sort_type_arr.down_bytes=(host_conn_sort_type_arr.dowm_bytes=='up'?'down':'up');
    host_conn_sort_type_arr.up_speed=(host_conn_sort_type_arr.up_speed=='up'?'down':'up');
    host_conn_sort_type_arr.down_speed=(host_conn_sort_type_arr.dowm_speed=='up'?'down':'up');
    host_conn_sort_type_arr.out_interface=(host_conn_sort_type_arr.out_interface=='up'?'down':'up');
}

function host_conn_sort(conn_sort_type){
    host_conn_sort_type=conn_sort_type;
    host_conn_sort_type_arr[conn_sort_type]=(host_conn_sort_type_arr[conn_sort_type]=='up'?'down':'up');
    lan_net_view_stop_refresh();

    var dataStrip=host_list_ip_temp_info.length; //得到多少条表格数据
    pre_scrollTop=set_scroll();
    clearTableData('host_list_ip_info');
    initTableStripNum(dataStrip,pageType);
    initHostListTableIpInfo(dataStrip);

    lan_net_view_refresh();

}
function host_conn_sort_fun(){
    switch (host_conn_sort_type){
        case 'proto':host_conn_proto();break;
        case 'src_ip':host_conn_src_ip();break;
        case 'des_ip':host_conn_des_ip();break;
        case 'src_port':host_conn_src_port();break;
        case 'dest_port':host_conn_dest_port();break;
        case 'app_name':host_conn_app_name();break;
        case 'up_bytes':host_conn_up_bytes();break;
        case 'down_bytes':host_conn_dowm_bytes();break;
        case 'up_speed':host_conn_up_speed();break;
        case 'down_speed':host_conn_dowm_speed();break;
        case 'out_interface':host_conn_out_interface();break;
    }
}
//host 排序函数
function host_conn_proto(){
    host_list_ip_temp_info.sort(host_Array_str_compare_proto);
    if(host_conn_sort_type_arr.proto=='down')   host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.proto=(host_conn_sort_type_arr.proto=='up'?'down':'up');
}
function host_conn_src_ip(){
    host_list_ip_temp_info.sort(host_Array_int_compare_src_ip);
    if(host_conn_sort_type_arr.src_ip=='down')
        host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.src_ip=(host_conn_sort_type_arr.src_ip=='up'?'down':'up');
}
function host_conn_des_ip(){
    host_list_ip_temp_info.sort(host_Array_int_compare_dst_ip);
    if(host_conn_sort_type_arr.des_ip=='down')
        host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.des_ip=(host_conn_sort_type_arr.des_ip=='up'?'down':'up');
}
function host_conn_src_port(){
    host_list_ip_temp_info.sort(host_Array_int_compare_src_port);
    if(host_conn_sort_type_arr.src_port=='down')
        host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.src_port=(host_conn_sort_type_arr.src_port=='up'?'down':'up');
}
function host_conn_dest_port(){
    host_list_ip_temp_info.sort(host_Array_int_compare_dst_port);
    if(host_conn_sort_type_arr.dest_port=='down')
        host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.dest_port=(host_conn_sort_type_arr.dest_port=='up'?'down':'up');
}
function host_conn_app_name(){
    host_list_ip_temp_info.sort(host_Array_str_compare_app_name);
    if(host_conn_sort_type_arr.app_name=='down')
        host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.app_name=(host_conn_sort_type_arr.app_name=='up'?'down':'up');
}
function host_conn_up_bytes(){
    host_list_ip_temp_info.sort(host_Array_int_compare_up_bytes);
    if(host_conn_sort_type_arr.up_bytes=='down')
        host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.up_bytes=(host_conn_sort_type_arr.up_bytes=='up'?'down':'up');
}
function host_conn_dowm_bytes(){
    host_list_ip_temp_info.sort(host_Array_int_compare_down_bytes);
    if(host_conn_sort_type_arr.down_bytes=='down')
        host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.dowm_bytes=(host_conn_sort_type_arr.dowm_bytes=='up'?'down':'up');
}
function host_conn_up_speed(){
    host_list_ip_temp_info.sort(host_Array_int_compare_up_speed);
    if(host_conn_sort_type_arr.up_speed=='down')
        host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.up_speed=(host_conn_sort_type_arr.up_speed=='up'?'down':'up');
}
function host_conn_dowm_speed(){
    host_list_ip_temp_info.sort(host_Array_int_compare_down_speed);
    if(host_conn_sort_type_arr.down_speed=='down')
        host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.dowm_speed=(host_conn_sort_type_arr.dowm_speed=='up'?'down':'up');
}
function host_conn_out_interface(){
    host_list_ip_temp_info.sort(host_Array_str_compare_out_interface);
    if(host_conn_sort_type_arr.out_interface=='down')
        host_list_ip_temp_info.reverse();
//    host_conn_sort_type_arr.out_interface=(host_conn_sort_type_arr.out_interface=='up'?'down':'up');
}
//
function host_Array_str_compare_proto(a,b)
{
    if(a.proto>b.proto)return 1;
    else if(a.proto<b.proto)return -1;
    else return 0;
}
function host_Array_int_compare_src_ip(a,b){
    return ip_compare(a.src_ip,b.src_ip);
}
function host_Array_int_compare_dst_ip(a,b){
    return ip_compare(a.des_ip,b.des_ip);
}
function host_Array_int_compare_src_port(a,b){
    return int_compare(a.src_port,b.src_port);
}
function host_Array_int_compare_dst_port(a,b){
    return int_compare(a.dest_port,b.dest_port);
}
function host_Array_str_compare_app_name(a,b){
    if(a.app_name>b.app_name)return 1;
    else if(a.app_name<b.app_name)return -1;
    else return 0;
}
function host_Array_int_compare_up_bytes(a,b){
    return int_compare(a.up_bytes,b.up_bytes);
}
function host_Array_int_compare_down_bytes(a,b){
    return int_compare(a.down_bytes,b.down_bytes);
}
function host_Array_int_compare_up_speed(a,b){
    return int_compare(a.up_speed,b.up_speed);
}
function host_Array_int_compare_down_speed(a,b){
    return int_compare(a.down_speed,b.down_speed);
}
function host_Array_str_compare_out_interface(a,b){
    if(a.out_interface>b.out_interface)return 1;
    else if(a.out_interface<b.out_interface)return -1;
    else return 0;
}


