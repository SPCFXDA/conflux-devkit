FROM confluxchain/conflux-rust:2.4.0 AS release
FROM node:20-slim AS devkit

ARG CONFLUX_NODE_ROOT="/opt/conflux"
ARG CONFIG_PATH=${CONFLUX_NODE_ROOT}"/develop.toml"

RUN apt-get update && apt-get install -y --no-install-recommends \ 
        git \
        sudo \
        gettext-base \
        ca-certificates \ 
    && rm -rf /var/lib/apt/lists/*

COPY --from=release /bin/conflux /bin/conflux
COPY --from=release /bin/cfxkey /bin/cfxkey
COPY --from=release /bin/pos-genesis-tool  /bin/pos-genesis-tool
COPY --from=release /bin/cfx-gen-dot /bin/cfx-gen-dot
COPY --from=release /bin/cfxstore /bin/cfxstore

RUN mkdir ${CONFLUX_NODE_ROOT} ${CONFLUX_NODE_ROOT}/log ${CONFLUX_NODE_ROOT}/pos_config

ADD utils ${CONFLUX_NODE_ROOT}/utils
ADD templates /tmp/

ENV CHAIN_ID=2029
ENV EVM_CHAIN_ID=2030
ENV CONFLUX_NODE_ROOT=${CONFLUX_NODE_ROOT}
ENV CONFIG_PATH=${CONFIG_PATH}

RUN cat /tmp/log.yaml.template | envsubst > ${CONFLUX_NODE_ROOT}/log.yaml
RUN cat /tmp/develop.toml.template | envsubst > ${CONFIG_PATH}

RUN (cd ${CONFLUX_NODE_ROOT}/pos_config && pos-genesis-tool random --initial-seed=0000000000000000000000000000000000000000000000000000000000000000  --num-validator=1 --num-genesis-validator=1 --chain-id=${CHAIN_ID})
RUN export WAYPOINT=$(cat ${CONFLUX_NODE_ROOT}/pos_config/waypoint_config) && cat /tmp/pos_config.yaml.template | envsubst > ${CONFLUX_NODE_ROOT}/pos_config/pos_config.yaml

RUN cat /tmp/dev_node.sh.template | envsubst > /usr/bin/dev_node && chmod +x /usr/bin/dev_node 
RUN cat /tmp/genesis_espace.sh.template | envsubst > /usr/bin/genesis_espace && chmod +x /usr/bin/genesis_espace
RUN cat /tmp/genesis_list.sh.template | envsubst > /usr/bin/genesis_list && chmod +x /usr/bin/genesis_list
RUN cat /tmp/faucet.sh.template | envsubst > /usr/bin/faucet && chmod +x /usr/bin/faucet

ARG USERNAME=node
ARG USER_UID=1000
ARG USER_GID=$USER_UID

# Create new user is $USERNAME don't exist
RUN id -u $USERNAME >/dev/null 2>&1 || (groupadd --gid $USER_GID $USERNAME \
    && useradd --uid $USER_UID --gid $USERNAME -m -s /bin/bash $USERNAME)

# Configuring passwordless sudo
RUN echo $USERNAME ALL=\(root\) NOPASSWD:ALL > /etc/sudoers.d/$USERNAME \
    && chmod 0440 /etc/sudoers.d/$USERNAME

RUN chown -R ${USER_UID}:${USER_GID} ${CONFLUX_NODE_ROOT}

USER $USERNAME

RUN (cd ${CONFLUX_NODE_ROOT}/utils && npm i && node genesis_secrets.js)

WORKDIR /workspaces/

EXPOSE 3000 12535 12537 8545 8546


FROM devkit AS openvscode

ARG SERVER_VERSION="1.90.0"
ARG SERVER_VERSION_NAME="openvscode-server-v"${SERVER_VERSION}"-linux-x64"
ARG SERVER_VERSION_URL="https://github.com/gitpod-io/openvscode-server/releases/download/openvscode-server-v"${SERVER_VERSION}"/"${SERVER_VERSION_NAME}".tar.gz"
ARG OPENVSCODE_SERVER_ROOT="/opt/openvscode-server"

USER root

RUN apt-get update && apt-get install -y --no-install-recommends \
    wget \
    libatomic1 \
    && rm -rf /var/lib/apt/lists/*

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
