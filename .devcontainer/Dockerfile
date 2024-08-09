# Define the base image for the build, specifying the Node.js version
ARG BASE_IMAGE=node:20-slim
FROM ${BASE_IMAGE} AS devkit

# Define the directory path for Conflux node data
ARG CONFLUX_NODE_ROOT="/opt/conflux"

# Install necessary system dependencies and clean up the apt cache to reduce image size
RUN apt-get update && apt-get install -y --no-install-recommends \ 
        git \               
        sudo \    
        ca-certificates \
        curl \
    && rm -rf /var/lib/apt/lists/*

# Create the Conflux node root directory
RUN mkdir -p ${CONFLUX_NODE_ROOT}

# Set environment variable for the Conflux node root directory path
ENV CONFLUX_NODE_ROOT=${CONFLUX_NODE_ROOT}

# Define arguments for creating a new user with a specified UID and GID
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create a new user if it doesn't already exist, with the specified UID and GID
RUN id -u $USERNAME >/dev/null 2>&1 || (groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USERNAME -m -s /bin/bash $USERNAME)

# Configure passwordless sudo access for the created user
RUN echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Change ownership of the Conflux node directory to the created user
RUN chown -R ${USERNAME}:${USERNAME} ${CONFLUX_NODE_ROOT}

# Download and extract the devkit CLI tool from the specified release
RUN curl -sL "https://github.com/SPCFXDA/devkit-cli/releases/download/v0.1.0/devkit-v0.1.0.tar.gz" | tar xz -C /

# Switch to the newly created user context
USER $USERNAME  

# Set the working directory for the user
WORKDIR /workspaces/

# Expose ports required for Conflux node operations and related services
EXPOSE 3000 12535 12537 8545 8546

# Set environment variables for locale settings and editor configurations
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    EDITOR=code \
    VISUAL=code \
    GIT_EDITOR="code --wait"

# Define the entry point for the container, starting the Conflux node
ENTRYPOINT ["/bin/bash","-c","devkit start --scan"]
