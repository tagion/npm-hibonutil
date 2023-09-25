#!/bin/bash

PORT=3000
SERVER_ADDRESS="http://localhost:$PORT"

SAMPLE_JSON="script/sample.json"
JSON_STRING=$(<"$SAMPLE_JSON")

POST_RECORD ()
{
    echo Send POST to $SERVER_ADDRESS
    curl -s -X POST -d "key=$1&type=$2&value=$3" $SERVER_ADDRESS
    echo 
}

POST_JSON ()
{
    response=$(curl -s -X POST $SERVER_ADDRESS/hibonutil/convert -H "Content-Type: application/json" -d "$JSON_STRING")

    echo "$response"
}

STOP_SERVER()
{
    echo $(curl -s -X POST $SERVER_ADDRESS/stop)
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