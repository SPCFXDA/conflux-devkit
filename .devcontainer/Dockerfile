# Define build arguments for Node.js and Conflux release versions
ARG BASE_IMAGE=node:20-slim
FROM ${BASE_IMAGE} AS devkit

# Define build arguments for Conflux node configuration
ARG CONFLUX_NODE_ROOT="/opt/conflux"

# Install necessary dependencies and clean up apt lists to reduce image size
RUN apt-get update && apt-get install -y --no-install-recommends \ 
        git \
        sudo \
        gettext-base \
        ca-certificates \
        curl \
        unzip \
    && rm -rf /var/lib/apt/lists/*

# Create necessary directories for Conflux node operation
RUN mkdir -p ${CONFLUX_NODE_ROOT}

# Set environment variables for chain IDs and configuration paths
ENV CONFLUX_NODE_ROOT=${CONFLUX_NODE_ROOT}

# Define build arguments for user creation
ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Add utility scripts and templates to the image

# Create a new user if $USERNAME doesn't exist
RUN id -u $USERNAME >/dev/null 2>&1 || (groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USERNAME -m -s /bin/bash $USERNAME)

# Configure passwordless sudo for the created user
RUN echo "$USERNAME ALL=(root) NOPASSWD:ALL" > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

# Change ownership of the Conflux node directory to the created user
RUN chown -R ${USERNAME}:${USERNAME} ${CONFLUX_NODE_ROOT}

RUN curl -sL "https://github.com/SPCFXDA/devkit-cli/releases/download/v0.1.0/devkit-v0.1.0.tar.gz" | tar xz -C /

# Switch to the created user context
USER $USERNAME  

# Set the working directory for the user
WORKDIR /workspaces/

# Expose necessary ports for the Conflux node
EXPOSE 3000 12535 12537 8545 8546

# Set additional environment variables for the user
ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    EDITOR=code \
    VISUAL=code \
    GIT_EDITOR="code --wait" \
    PATH=$PATH:/home/${USERNAME}/.local/bin: