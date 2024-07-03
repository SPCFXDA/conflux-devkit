FROM node:20-slim AS devkit
RUN apt-get update && apt-get install -y --no-install-recommends \ 
        git \
        sudo \
        wget \
        libatomic1 \
        ca-certificates \
        unzip \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /home/

ARG NODE_VERSION="2.3.5"
ARG NODE_VERSION_URL="https://github.com/Conflux-Chain/conflux-rust/releases/download/v"${NODE_VERSION}"/conflux_linux_glibc2.27_x64_v"${NODE_VERSION}".zip"
ARG CONFLUX_NODE_ROOT="/opt/conflux"
ARG CONFIG_PATH=${CONFLUX_NODE_ROOT}"/develop.toml"

RUN echo ${NODE_VERSION_URL}
RUN wget ${NODE_VERSION_URL} -O /tmp/conflux_node.zip &&\
    unzip /tmp/conflux_node.zip -d /opt &&\
    rm /tmp/conflux_node.zip &&\
    mv /opt/run ${CONFLUX_NODE_ROOT}
    
COPY develop.toml ${CONFIG_PATH}
ADD utils ${CONFLUX_NODE_ROOT}/utils

RUN echo '#!/bin/bash\nulimit -n 10000\nexport RUST_BACKTRACE=1\n'${CONFLUX_NODE_ROOT}'/conflux --config '${CONFIG_PATH} > /usr/bin/start_dev_node && \
    chmod +x /usr/bin/start_dev_node

RUN sed -i 's|"log/|"'${CONFLUX_NODE_ROOT}'/log/|g' ${CONFLUX_NODE_ROOT}/log.yaml

ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Enable these row to enable the creation of a custom user, remember to set the correct USERNAME, USER_UID and USER_GID
#  RUN groupadd --gid $USER_GID $USERNAME \
#      && useradd --uid $USER_UID --gid $USERNAME -m -s /bin/bash $USERNAME

# Configuring passwordless sudo
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

RUN chown -R $USERNAME:$USERNAME ${CONFLUX_NODE_ROOT}

USER $USERNAME

RUN (cd ${CONFLUX_NODE_ROOT}/utils && npm i && CONFIG_PATH=${CONFIG_PATH} node genesis_secrets.js)

WORKDIR /workspaces/

EXPOSE 3000 12535 12537 8545 8546

FROM devkit AS openvscode

ARG SERVER_VERSION="1.90.0"
ARG SERVER_VERSION_NAME="openvscode-server-v"${SERVER_VERSION}"-linux-x64"
ARG SERVER_VERSION_URL="https://github.com/gitpod-io/openvscode-server/releases/download/openvscode-server-v"${SERVER_VERSION}"/"${SERVER_VERSION_NAME}".tar.gz"
ARG OPENVSCODE_SERVER_ROOT="/opt/openvscode-server"

USER root
RUN wget ${SERVER_VERSION_URL} -O /tmp/code-server.tar.gz &&\
    tar -xzf /tmp/code-server.tar.gz -C /opt &&\
    rm /tmp/code-server.tar.gz &&\
    mv /opt/${SERVER_VERSION_NAME} ${OPENVSCODE_SERVER_ROOT}

RUN chown -R $USERNAME:$USERNAME ${OPENVSCODE_SERVER_ROOT}

USER $USERNAME

ENV LANG=C.UTF-8 \
    LC_ALL=C.UTF-8 \
    HOME=/workspaces \
    EDITOR=code \
    VISUAL=code \
    GIT_EDITOR="code --wait" \
    OPENVSCODE_SERVER_ROOT=${OPENVSCODE_SERVER_ROOT}

EXPOSE 5000

ENTRYPOINT [ "/bin/sh", "-c", "exec ${OPENVSCODE_SERVER_ROOT}/bin/openvscode-server --port 5000 --host 0.0.0.0 --without-connection-token \"${@}\"", "--" ] 
