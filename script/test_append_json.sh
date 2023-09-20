#!/bin/bash

source $(dirname $0)/utils.sh

nohup npm run build &

WAIT_FOR_SERVER 5
server_ready=$?

if [ $server_ready -eq 0 ]; then
    echo ----------------------------
    response=$(POST_JSON)
    hibon_data=$(echo "$response" | jq -r .hibon)
    echo "$hibon_data" > out.hibon

    STOP_SERVER
    echo ----------------------------

    WAIT_FOR_SERVER 1

else
    echo "Test failure. Exit"
fi

CHECK_PORT
port_busy=$?
echo Port busy: $port_busy

echo End test

echo ----------------------------
echo Output of server:
cat nohup.out 
rm nohup.out