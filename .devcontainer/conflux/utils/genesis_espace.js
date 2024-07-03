const TOML = require('@iarna/toml');
const fs = require('fs');
const { Conflux, Drip } = require('js-conflux-sdk');
const { privateToAddress } = require('ethereumjs-util');

const configPath = process.env.CONFIG_PATH || "/opt/conflux/develop.toml";
const rpcHost = process.env.RPC_HOST || "localhost";

function genesisToeSpace() {
  const configString = fs.readFileSync(configPath, "utf-8");
  const config = TOML.parse(configString);

  const conflux = new Conflux({
    url: `http://${rpcHost}:${config.jsonrpc_http_port}`,
    networkId: config.chain_id,
  });

  const crossSpaceCall = conflux.InternalContract('CrossSpaceCall');

  async function crossSpaceCallFx(privateKey) {
    const account = conflux.wallet.addPrivateKey(`0x${privateKey}`);
    const eSpaceAddress = `0x${privateToAddress(Buffer.from(privateKey, "hex")).toString("hex")}`

    const receipt = await crossSpaceCall.transferEVM(eSpaceAddress)
    .sendTransaction({
        from: account,
        value: Drip.fromCFX(1000),  // transfer 1 CFX, the amount is specify by value
    }).executed();

    console.log(`Transfer from ${account.address} to ${eSpaceAddress} ${receipt.outcomeStatus === 0 ? 'succeed' : 'failed'}`);
  }

  const secrets = fs.readFileSync(config.genesis_secrets, 'utf-8');
  secrets.split(/\r?\n/).forEach(line =>  {
    if(line.length) {
      crossSpaceCallFx(line);
    }
  });
}

genesisToeSpace();