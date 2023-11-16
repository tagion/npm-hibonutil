#!/bin/bash

# This script is used for Docker image to download and install
# locally hibonutil from private repository using GITBOT_TOKEN

# Install gh
apt update && apt install -y \
    curl \
    gpg
curl -fsSL https://cli.github.com/packages/githubcli-archive-keyring.gpg | gpg --dearmor -o /usr/share/keyrings/githubcli-archive-keyring.gpg;
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/githubcli-archive-keyring.gpg] https://cli.github.com/packages stable main" | tee /etc/apt/sources.list.d/github-cli.list > /dev/null;
apt update && apt install -y gh;

# Download and install hibonutil
echo $1 | gh auth login --with-token

mkdir -p artifact
cd artifact
gh run download -n successful_artifact --repo tagion/tagion
tar -xzf *.tar.gz
rm -r *.tar.gz
cd build/x86_64-linux/bin
ln -s tagion hibonutil
chmod +x hibonutil
cp hibonutil /usr/local/bin/