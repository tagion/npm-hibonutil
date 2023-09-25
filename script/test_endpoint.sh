#!/bin/bash

source $(dirname $0)/utils.sh

nohup npm run start -- --trusted -p $PORT &

WAIT_FOR_SERVER 5
server_ready=$?

if [ $server_ready -eq 0 ]; then
    echo -------------------- START TEST --------------------
    response=$(POST_JSON "/hibonutil/validate")
    echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"
    echo "$response"
    echo "~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~"

    response=$(POST_JSON "/hibonutil/convert")
    hibon_file="tmp/script_out.hibon"

    echo "$response" > $hibon_file
    echo "Received hibon data saved in '$hibon_file'"

    decoded_response=$(hibonutil -cp < <(echo -n "$response"))

    if [ "$JSON_STRING" = "$decoded_response" ]; then
        echo -e "\e[32mSUCCESS:\e[0m HiBON JSON decoded successfully"
    else
        echo -e "\e[31mFAIL:\e[0m Fail to decode HiBON JSON!"
    fi

    echo Shutting down server...
    STOP_SERVER
    echo -------------------- END TEST --------------------

    echo Check that server is offline
    WAIT_FOR_SERVER 1
    echo -e "\e[32mSUCCESS:\e[0m Server is offline"

else
    echo -e "\e[31mFAIL:\e[0m Server is unavailable!"
fi

if CHECK_PORT; then
    echo -e "\e[32mSUCCESS:\e[0m Port is available"
else
    echo -e "\e[31mFAIL:\e[0m Port is still busy!"
fi

echo -------------------- SERVER OUTPUT --------------------
cat nohup.out 
rm nohup.out