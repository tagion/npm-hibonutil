#!/bin/bash

source $(dirname $0)/utils.sh

nohup npm run build &

WAIT_FOR_SERVER 5
server_ready=$?

if [ $server_ready -eq 0 ]; then
    echo ----------------------------
    POST_RECORD 0 f32 "0x1.3ae148p+0"
    POST_RECORD 1 f64 "0x1.9b5d96fe285c6p+664"
    POST_RECORD 2 bool true
    POST_RECORD 3 i32 -42

    POST_RECORD null null null
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