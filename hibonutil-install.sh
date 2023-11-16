#!/bin/bash

# This script is used for Docker image to download and install
# locally hibonutil from private repository using GITBOT_TOKEN

echo $GITHUB_TOKEN | gh auth login --with-token

mkdir -p /usr/src/app/artifact
cd /usr/src/app/artifact
gh run download -n successful_artifact --repo tagion/tagion

tar -xzf *.tar.gz -C /usr/local/bin
rm -r *.tar.gz
ln -s /usr/local/bin/tagion /usr/local/bin/hibonutil
chmod +x /usr/local/bin/hibonutil
