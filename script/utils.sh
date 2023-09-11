#!/bin/bash

ADDRESS="localhost"
PORT=3000
ENDPOINT="hibonutil"

SERVER_ADDRESS="http://${ADDRESS}:${PORT}/${ENDPOINT}/"


POST_RECORD ()
{
    echo Send POST to $SERVER_ADDRESS
    curl -s -X POST -d "key=$1&type=$2&value=$3" $SERVER_ADDRESS
    echo 
}

WAIT_FOR_SERVER ()
{
    echo Wait for server to start...

    MAX_RETRIES=$1

    DELAY=1

    retry_count=0

    while [ $retry_count -lt $MAX_RETRIES ]; do
        if curl -Is "${SERVER_ADDRESS}" >/dev/null 2>&1; then
            echo "Server is running and ready"
            return 0
        else
            echo "Waiting..."
            sleep $DELAY
            ((retry_count++))
        fi
    done

    echo "Can't reach server within ${MAX_RETRIES} retries"
    return 1
}

CHECK_PORT ()
{
    output=$(lsof -i :${PORT})   
    return $([[ -z "$output" ]])
}