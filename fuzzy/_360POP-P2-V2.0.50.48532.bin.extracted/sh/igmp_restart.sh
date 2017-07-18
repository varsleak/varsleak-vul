#! /bin/sh
echo ==========restart igmpproxy========== > /dev/console
while [ true ]; do
        killall igmpproxy
        sleep 1
        igmpproxy && break
        echo ==========restart igmpproxy retry========== > /dev/console
done
