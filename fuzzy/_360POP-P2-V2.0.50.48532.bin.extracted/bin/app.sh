
echo 16384 > /proc/sys/vm/min_free_kbytes
mknod /tmp/app_part b 31 9
mknod /tmp/loop0 b 7 0
mknod /tmp/loop1 b 7 1
mknod /tmp/loop2 b 7 2

killall app_manager usb_check
sleep 2
usb_check
sleep 1
check_default_by_start
#mkdir /tmp/cgroup
#mkdir /tmp/cgroup/cpu
#mkdir /tmp/cgroup/memory
#mount -t cgroup -o cpu cpu /tmp/cgroup/cpu
#mount -t cgroup -o memory memory /tmp/cgroup/memory
app_manager &
restore_default &
app_preload &

