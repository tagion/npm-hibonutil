#!/bin/bash

tsc
pm2 start ecosystem.config.cjs

echo "Wait for server to start..."
sleep 2

npx jest
exit_code=$?

pm2 delete hibon-server

exit $exit_code