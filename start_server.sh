#!/bin/bash
docker build .devcontainer/conflux --tag "conflux-devkit-server"
docker run -it -p 5000:5000 -p 12537:12537 -p 8545:8545 -v "$(pwd):/workspaces:cached" -d conflux-devkit-server --name conflux-devkit-server
