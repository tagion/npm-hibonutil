#!/bin/bash

ADDRESS="localhost"
PORT=3000
ENDPOINT="hibonutil"

SERVER_ADDRESS="http://${ADDRESS}:${PORT}"


POST_RECORD ()
{
    echo Send POST to $SERVER_ADDRESS
    curl -s -X POST -d "key=$1&type=$2&value=$3" $SERVER_ADDRESS
    echo 
}

POST_JSON ()
{
    response=$(curl -X POST $SERVER_ADDRESS/$ENDPOINT/convert -H "Content-Type: application/json" -d '{
        "BIGINT": [
            "big",
            "@meiC-oiHr6Tg-POQtYdZ"
        ],
        "BOOLEAN": true,
        "FLOAT32": [
            "f32",
            "0x1.3ae148p+0"
        ],
        "FLOAT64": [
            "f64",
            "0x1.9b5d96fe285c6p+664"
        ],
        "INT32": [
            "i32",
            -42
        ],
        "INT64": [
            "i64",
            "0xfffb9d923e586d5a"
        ],
        "UINT32": [
            "u32",
            42
        ],
        "UINT64": [
            "u64",
            "0x4626dc1a792a6"
        ],
        "sub_hibon": {
            "BINARY": [
                "*",
                "@AQIDBA=="
            ],
            "STRING": "Text",
            "TIME": [
                "time",
                "2023-09-20T13:01:25.5186591"
            ]
        }
    }')

    echo "$response"
}

STOP_SERVER()
{
    curl -X POST $SERVER_ADDRESS/stop
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