# Conflux DevKit

## Overview

Conflux DevKit is a streamlined development environment tailored for the Conflux blockchain ecosystem, including Core Space and ESpace EVM. It simplifies the setup process, allowing developers to focus on building applications without worrying about environment configurations.

It leverages Docker to create a devcontainer with all necessary tools, dependencies, and configurations pre-installed, ensuring a seamless and consistent development experience.

This repository offers a minimal setup and serves as a foundation for creating more task-specific repositories, such as a Hardhat repository or a frontend template repository.

## Features

- Pre-configured development environment for Conflux Core, ESpace, and PoS.
- Simplified setup with all dependencies installed.
- Consistent and isolated development environment.
- Compatibility with GitHub Codespaces and VS Code's devcontainer feature.

## What is Available in This Dev Environment

Using the [Dockerfile](.devcontainer/conflux/Dockerfile) and the [devkit-cli](https://github.com/SPCFXDA/devkit-cli) utility, the Docker instance will create an [independent chain](https://doc.confluxnetwork.org/docs/general/run-a-node/advanced-topics/running-independent-chain).

The independent chain will be reachable with the following RPC endpoints, which can be added to [Fluent](https://fluentwallet.com/) (Core and ESpace) or [Metamask](https://metamask.io/) (eSpace) wallet:

- Core: `http://localhost:12537`
- ESpace: `http://localhost:8545`

### devkit Utility

To start the independent chain in the devcontainer setup, open the terminal in the VS Code interface (this applies to both locally installed VS Code and the web-based version in Codespaces) and use the following command:

```sh
devkit start
```
To stop the independent chain node, use the following command:

```sh
devkit stop
```
For other details on the devkit utility, you can head to [devkit-cli](https://github.com/SPCFXDA/devkit-cli) or run in the terminal:

```sh
devkit --help
```

## Getting Started

### Prerequisites

Ensure Docker is installed on your machine if you plan to run the environment locally. You can download Docker from [here](https://www.docker.com/get-started).

### Run as Independent Docker Image

If you don't need the devcontainer functionality but want to use the devkit setup, you can quickly run a development node with the following command:

```bash
docker run --name cdk -p 12537:12537 -p 8545:8545 spcfxda/conflux-devkit:latest
```

This command will run the devkit container and expose the necessary ports. Once the devkit container is running, you can execute the CLI utility with exec:

```bash
docker exec -it cdk devkit
docker exec -it cdk devkit faucet 100 0xf1428162e14ec7a29b50210fbaefdb45050ee4dd
docker exec -it cdk devkit balance 0xf1428162e14ec7a29b50210fbaefdb45050ee4dd 
```

### Run in GitHub Codespaces

You can open this repository in Codespaces using the Codespaces tab under the `CODE` button:

![Codespaces tab](README/codespace_tab.png) - Click the 'Codespaces' tab to create a new Codespace.

After the build and download of the layers are completed, the environment will be ready to use.

### Run in VS Code devcontainer

After opening the repository folder with VS Code, a popup will appear in the bottom right corner:

![Reopen in Container](README/vscode.png) - Click the 'Reopen in Container' button to enter the devcontainer environment.

After the build and download of the layers are completed, your VS Code instance will be inside the devcontainer.

You can confirm this from the status in the bottom left corner that should look like this:

![Devcontainer status](README/vscode_devcontainer.png)

### Customization for VS Code and Codespaces Devcontainer

Devcontainers are a feature of VS Code and GitHub Codespaces that allows you to define a containerized development environment. This ensures consistency across different development environments and facilitates easy setup.

The main configuration file for the devcontainer is [devcontainer.json](.devcontainer/devcontainer.json), where you can easily change parameters for building the local Docker image. Here is an excerpt:

```json
{
    "name": "Conflux DevKit",
    "build": {
        "context": "conflux",
        "dockerfile": "conflux/Dockerfile",
        "args": {
            // "BASE_IMAGE": "node:20-slim",
            // "CONFLUX_NODE_ROOT": "/opt/conflux",
            // "USERNAME": "conflux",
            // "USER_UID": "1001",
            // "USER_GID": "1001"
        },
        "target": "devkit"
    },
    "forwardPorts": [12535, 12537, 8545, 8546]
}
```

**Parameter Descriptions:**

- **`BASE_IMAGE`**: Defines the base image used for the development environment. By default, `node:20-slim` is chosen for compatibility. This can be changed to your preferred base image, although some amendments to the Dockerfile may be necessary.

- **`CONFLUX_NODE_ROOT`**: Sets the destination folder inside the container for all the node data.

- **`USERNAME`**, **`USER_UID`**, **`USER_GID`**: Ensure you set the correct `USERNAME`, `USER_UID`, and `USER_GID` to match your system user and group. This facilitates smoother operation of the Docker container by preventing file permission conflicts.

### Ports

- `12535`: Core WebSocket RPC.
- `12537`: Core HTTP RPC (Endpoint port for Fluent wallet).
- `8545`: ESpace HTTP RPC (Endpoint port for Fluent/MetaMask wallet).
- `8546`: ESpace WebSocket RPC.

## Advanced Usage

### Passwordless Sudo

The devcontainer is pre-configured with passwordless `sudo` access for the specified user (defined by `USERNAME`). This allows you to execute administrative commands without needing to enter a password.

Using `sudo`, you can install new packages with [apt](https://manpages.debian.org/bookworm/apt/apt.8.en.html) or make system modifications as needed. However, please note that any changes made this way will be lost if the image is rebuilt. To ensure that your changes persist, you should amend the Dockerfile accordingly.

### Endpoint Test

You can test the endpoint with the following command from your local system:

```sh
curl --location 'http://localhost:12537' --header 'Content-Type: application/json' --data '{"jsonrpc":"2.0","method":"cfx_clientVersion","params":[],"id":67}'
```

The response should look like this:

```json
{
  "jsonrpc": "2.0",
  "result": "conflux-rust/v2.4.0-205095d-20240628/x86_64-linux-gnu/rustc1.77.2",
  "id": 67
}
```

## Using This Repository for Your Own Project

There are several ways to reuse the code from this repository. We recommend the following method:

1. Download the zip file of the template branch: [template](https://github.com/SPCFXDA/conflux-devkit/archive/refs/heads/template.zip).
2. Extract the contents of the zip file.
3. Follow the instructions in the README.md file to set up your project.
4. Initialize your new Git repository from this template.

Alternatively, you can fork this repository to your own GitHub account and modify it to suit your project’s needs.

## Contributing

Contributions are welcome! Please see the [Contributing guideline](CONTRIBUTING.md) for more details on how to get started. Make sure to follow the [Code of conduct](CODE_OF_CONDUCT.md) in all your interactions.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for details.

## Acknowledgements

- [Conflux](https://confluxnetwork.org/)
- [Conflux-Rust](https://github.com/Conflux-Chain/conflux-rust/releases)
- [Conflux-Docker](https://github.com/Conflux-Chain/conflux-docker/tree/master)
- [js-conflux-sdk](https://github.com/Conflux-Chain/js-conflux-sdk)
- [Fluent](https://fluentwallet.com/)

For more information, visit the [official documentation](https://doc.confluxnetwork.org/).
