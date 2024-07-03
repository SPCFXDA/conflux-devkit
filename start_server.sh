#!/bin/bash
docker build .devcontainer/conflux --tag "conflux_devkit_server" && docker run -it -p 5000:5000 -p 12537:12537 -p 8545:8545 -v "$(pwd):/workspaces:cached" -d conflux_devkit_server
