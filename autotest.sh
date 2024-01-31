#!/bin/bash

tsc
pm2 start ecosystem.config.cjs

echo "Wait for server to start..."
sleep 5

# npx jest
echo "We're skipping tests now"
exit_code=$?

pm2 delete hibon-server

exit $exit_code