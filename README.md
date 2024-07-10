# Conflux DevKit
## Overview
Conflux DevKit provides an easy-to-setup development environment for the Conflux blockchain spaces (Core Space and ESpace EVM). It leverages Docker to create a devcontainer with all necessary tools, dependencies, and configurations pre-installed, ensuring a seamless and consistent development experience. This repository provides a minimal setup and serves as a foundation for creating more task-specific repositories, such as a Hardhat repository or a frontend template repository.
## Features
- Pre-configured development environment for Conflux Core, ESpace, and PoS.
- Simplified setup with all dependencies installed and utilities.
- Consistent and isolated development environment.
- Integrated OpenVSCode server for a web-based development experience.
- Compatibility with GitHub Codespaces and VS Code's devcontainer feature.
## What is available in this dev environment
Using the following [Dockerfile](.devcontainer/conflux/Dockerfile) and [develop.toml.template](.devcontainer/conflux/templates/develop.toml.template), the Docker instance will create an [independent chain](https://doc.confluxnetwork.org/docs/general/run-a-node/advanced-topics/running-independent-chain).
The `independent chain` will be reachable with the following RPC that can be added to [Fluent](https://fluentwallet.com/) or [Metamask](https://metamask.io/) wallet:

- Core:  http://localhost:12537 (or Codespace host instead of localhost)
- Espace: http://localhost:8545 (or Codespace host instead of localhost)

You can test the endpoint with the following command from your local system:

```sh
curl --location 'http://localhost:12537' --header 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"cfx_clientVersion","params":[],"id":67}'
```

the response should look like this:

```json
{"jsonrpc":"2.0","result":"conflux-rust/v2.4.0-205095d-20240628/x86_64-linux-gnu/rustc1.77.2","id":67}
```

During the image build process the official [conflux-rust](https://hub.docker.com/r/confluxchain/conflux-rust/tags) image will be used to install the precompiled binary, and all relevant configuration and data directories will be located in the `/opt/conflux/` folder and accessible to a Non-Root user.

Five genesis account private keys will be created in the same folder using the following script: [genesis_secrets.js](.devcontainer/conflux/utils/genesis_secrets.js).

The genesis account will be funded with 10000 CFX and the details can be found in `/opt/conflux/genesis_secrets.txt` or you can use the `genesis_list` command. You can import these accounts into your wallet, or you can add your development private key to this file before starting the Conflux node.

If you are using the devcontainer setup, to start the `independent chain`, open the terminal in the VS Code interface (this is the same for the locally installed VS Code or the web-based one in Codespaces or OpenVSCode-Server) and use this command:

```sh
dev_node
```
`dev_node` is a shell script located in `/usr/bin/dev_node` with the following content:
```sh
#/bin/bash
ulimit -n 10000
export RUST_BACKTRACE=1
conflux --config /opt/conflux/develop.toml
```
Once the `independent chain` is running, you can open another terminal and transfer funds from the genesis Core addresses to their ESpace addresses with the following command:
```sh
genesis_espace
```
This command executes the [genesis_espace](.devcontainer/conflux/utils/genesis_espace.js) script that reads the genesis private keys and uses them to call the [crossSpaceCall](https://doc.confluxnetwork.org/docs/core/core-space-basics/internal-contracts/crossSpaceCall) internal contract.
Or you can send CFX to a Core or Espace address with the [faucet](.devcontainer/conflux/utils/faucet.js) script that will use the miner account to fund the faucet. You can check the faucet availability by invoking the script with the following command in the terminal:
```
faucet
```
If the amount available is 0, you need to wait a few seconds for the mining rewards to reach the account. Once there are enough funds to send, you can invoke the script in the following way:
`faucet` `<amount>` `<address>`
For example, for Core:
```
faucet 100 net2029:aarphdvpx0b2xyfg56rn0b6m237cjmbkkjre6fcdby
```
For ESpace:
```
faucet 100 0xAAC38E2c9D8389D0a6df1abB078aC67a2428294a
```
The script will recognize the type of address and do a simple transfer or call the internal contract for cross space call.
## Getting Started
### Prerequisites
- Docker installed on your machine (if used locally).
### Run as independent docker image
If you don't need the devcontainer functionality, but you want to use the devkit setup, you can quickly run a development node with the following command:
```bash
docker run -it -p 12537:12537 -p 8535:8535 --rm --name devkit spcfxda/conflux-devkit
```
This command will run the devkit container and expose the necessary ports.
Once the devkit container is running, you can execute the utility scripts described above with exec:
```bash
docker exec -it devkit genesis_list
docker exec -it devkit faucet 100 0xf1428162e14ec7a29b50210fbaefdb45050ee4dd
docker exec -it devkit genesis_espace
```
### Run in GitHub Codespaces
You can open this repository in Codespaces using the Codespaces tab under the `CODE` button:

![alt text](README/codespace_tab.png)

After the build and download of the layers are completed, the environment will be ready to use.
### Run in VS Code devcontainer
After opening the repository folder with VS Code, a popup will appear in the bottom right corner:

![alt text](README/vscode.png)

Click on the `Reopen in Container` button. After the build and download of the layers are completed, your VS Code instance will be inside the devcontainer. You can confirm this from the status in the bottom left corner that should look like this:

![alt text](README/vscode_devcontainer.png)

### Customization for VS Code and Codespaces Devcontainer

The main configuration file for the devcontainer is [devcontainer.json](.devcontainer/devcontainer.json), where you can easily change parameters for building the local Docker image. Here is an excerpt:

```json
{
    "name": "Conflux DevKit",
    "build": {
        "context": "conflux",
        "dockerfile": "conflux/Dockerfile",
        "args": {
            // "NODE_RELEASE": "2.4.0",
            // "BASE_IMAGE": "node:20-slim",
            // "CONFLUX_NODE_ROOT": "/opt/conflux",
            // "USERNAME": "conflux",
            // "USER_UID": "1001"
            // "USER_GID": "1001"
        },
        "target": "devkit"
    },
    "forwardPorts": [3000, 12535, 12537, 8545, 8546]
}
```

**Parameter Descriptions:**

- **`NODE_RELEASE`**: Specifies the tag of the official conflux-rust image. This can be changed to point to a different hardfork version of the binary.

- **`BASE_IMAGE`**: Defines the base image used for the development environment. By default, `node:20-slim` is chosen for compatibility. This can be changed to your preferred base image, although some amendments to the Dockerfile may be necessary.

- **`CONFLUX_NODE_ROOT`**: Sets the destination folder inside the container for all the node data.

- **`USERNAME`**, **`USER_UID`**, **`USER_GID`**: Ensure you set the correct `USERNAME`, `USER_UID`, and `USER_GID` values for your system. The default user is `node`, with `1000:1000` as the UID:GID, which already exists in the base `node:20-slim` image. On Linux systems, the first user typically starts with `1000:1000` UID:GID. If you have multiple users on your system, you may need to change the Docker user to avoid read/write permission issues between the local filesystem and the Docker image.

#### Changing Container Logic and Rebuilding

To customize the behavior of the devcontainer, modify the files located under the [.devcontainer/conflux](.devcontainer/conflux/) directory.

Here's the structure of the devcontainer:

```
.
├── Dockerfile // Dockerfile divided into three sections: release, devkit, openvscode
├── templates
│   ├── develop.toml.template // Node configuration template
│   ├── dev_node.sh.template
│   ├── faucet.sh.template
│   ├── genesis_espace.sh.template
│   ├── genesis_list.sh.template
│   ├── log.yaml.template // Node log configuration
│   └── pos_config.yaml.template // Node PoS configuration
└── utils // Utility logic written in JavaScript with js-conflux-sdk
    ├── eslint.config.mjs
    ├── faucet.js
    ├── genesis_espace.js
    ├── genesis_list.js
    ├── genesis_secrets.js
    ├── package.json
    └── package-lock.json
```

After making changes to any file to suit your preferences, rebuild the container by following these steps:

1. In VS Code, navigate to the bottom left corner and click on the icon that indicates the current status of the devcontainer setup.

    ![alt text](README/vscode_devcontainer.png)

2. From the menu that appears, select `Rebuild container`.

This rebuilds the devcontainer with your modified settings, ensuring that your changes take effect in the development environment.

### Run the Docker Container with OpenVSCode Server
To quickly start the DevKit server with OpenVSCode Server, use the following command:
```bash
docker run -it -p 5000:5000 -p 12537:12537 -p 8535:8535 -v "$(pwd):/workspaces:cached" --rm --name devkit-server spcfxda/conflux-devkit-server
```
This command performs the following actions:
- **`-it`**: Runs the container in interactive mode with a TTY enabled, allowing you to interact with the container via the command line.
- **`-p 5000:5000`**: Maps port 5000 on your local machine to port 5000 in the container, providing access to the OpenVSCode Server.
- **`-p 12537:12537`**: Maps port 12537 on your local machine to port 12537 in the container, providing access to the Conflux Core RPC endpoint.
- **`-p 8535:8535`**: Maps port 8535 on your local machine to port 8535 in the container, providing access to the Conflux ESpace RPC endpoint.
- **`-v "$(pwd):/workspaces:cached"`**: Mounts the current directory on your local machine (`$(pwd)`) to the `/workspaces` directory in the container with caching enabled, allowing you to work with your local files inside the container.
- **`--rm`**: Automatically removes the container when it is stopped.
- **`--name devkit-server`**: Names the running container `devkit-server` for easier management and reference.

Consider that `$(pwd)` is a linux command, in windows you will have to substitute it with the full path of the directory you want to map.

If you need to customize the Dockerfile or some of its configuration you can follow these steps:

1. Clone the repository:
```sh
git clone https://github.com/your-repo/conflux-devkit.git
cd conflux-devkit
```
2. After you saved the changes you needed, to start the container with the Conflux node and OpenVSCode server, use the `start_server.sh` script located in the root of the repository:
```sh
./start_server.sh
```
The content of the script will build and run the Docker instance. This is the content of the shell script for reference:
```sh
#/bin/bash
docker build .devcontainer/conflux --tag "conflux-devkit-server"
docker run -it -p 5000:5000 -p 12537:12537 -p 8545:8545 -v "$(pwd):/workspaces:cached" -d conflux-devkit-server --name conflux-devkit-server
```
### Access the OpenVSCode Server
Open your browser and navigate to `http://localhost:5000` to access the OpenVSCode server.
## Configuration

### Build Arguments and Environment Variables

The Dockerfile for the devcontainer includes several build arguments (ARG) and environment variables (ENV) that control various aspects of the build and runtime configuration. Below is a description of each:

**Build Arguments (ARG):**

- **`NODE_RELEASE`**: Specifies the tag of the official Conflux Rust image. This can be modified to use a different version of the binary.
- **`BASE_IMAGE`**: Defines the base image used for the development environment. The default is `node:20-slim` for compatibility, but it can be changed to another base image if necessary.
- **`CONFLUX_NODE_ROOT`**: Sets the directory inside the container where all node data will be stored.
- **`CONFIG_PATH`**: Specifies the path to the main configuration file for the Conflux node.
- **`USERNAME`**: Defines the default username inside the container. This is set to `node`.
- **`USER_UID`**: Sets the user ID for the default user.
- **`USER_GID`**: Sets the group ID for the default user, which is the same as the user ID.
- **`SERVER_VERSION`**: Specifies the version of OpenVSCode server to be used.
- **`SERVER_VERSION_NAME`**: Defines the name of the OpenVSCode server version.
- **`SERVER_VERSION_URL`**: URL to download the specified version of the OpenVSCode server.
- **`OPENVSCODE_SERVER_ROOT`**: Sets the directory inside the container where OpenVSCode server will be installed.

**Environment Variables (ENV):**

- **`CHAIN_ID=2029`**: Sets the chain ID for the Conflux node.
- **`EVM_CHAIN_ID=2030`**: Sets the chain ID for the EVM space.
- **`CONFLUX_NODE_ROOT=${CONFLUX_NODE_ROOT}`**: Ensures the `CONFLUX_NODE_ROOT` path is set as an environment variable.
- **`CONFIG_PATH=${CONFIG_PATH}`**: Ensures the `CONFIG_PATH` is set as an environment variable.
- **`LANG=C.UTF-8`**: Sets the language to UTF-8.
- **`LC_ALL=C.UTF-8`**: Ensures all locale settings use UTF-8.
- **`HOME=/workspaces`**: Sets the home directory inside the container.
- **`EDITOR=code`**: Sets the default editor to VS Code.
- **`VISUAL=code`**: Sets the default visual editor to VS Code.
- **`GIT_EDITOR="code --wait"`**: Sets VS Code as the editor for Git commits.
- **`OPENVSCODE_SERVER_ROOT=${OPENVSCODE_SERVER_ROOT}`**: Ensures the `OPENVSCODE_SERVER_ROOT` path is set as an environment variable.

These arguments and environment variables provide a flexible way to configure the development environment to suit different needs and preferences.

### Ports
- `3000`: Default port for Node application.
- `12535`: Core WebSocket RPC.
- `12537`: Core HTTP RPC (Endpoint port for Fluent wallet).
- `8545`: ESpace HTTP RPC (Endpoint port for Fluent/MetaMask wallet).
- `8546`: ESpace WebSocket RPC.
- `5000`: Port for OpenVSCode server.
## Advanced Usage
### Passwordless Sudo
Passwordless sudo is configured for the user specified by `USERNAME`. This allows the user to execute commands with root privileges without entering a password.
## Contributing
Contributions are welcome! Please refer to the [Contributing guideline](CONTRIBUTING.md) and the [Code of conduct](CODE_OF_CONDUCT.md).
## License
This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Conflux](https://confluxnetwork.org/)
- [Conflux-Rust](https://github.com/Conflux-Chain/conflux-rust/releases)
- [Conflux-Docker](https://github.com/Conflux-Chain/conflux-docker/tree/master)
- [Fluent](https://fluentwallet.com/)
- [OpenVSCode Server](https://github.com/gitpod-io/openvscode-server)

For more information, visit the [official documentation](https://doc.confluxnetwork.org/).
