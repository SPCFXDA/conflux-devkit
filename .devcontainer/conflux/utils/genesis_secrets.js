const TOML = require('@iarna/toml');
const fs = require('fs');
const { PrivateKeyAccount: Account } = require('js-conflux-sdk');
const configPath = process.env.CONFIG_PATH || "/opt/conflux/develop.toml";

function genesisSecrets() {
    const configString = fs.readFileSync(configPath, "utf-8");
    const config = TOML.parse(configString);

    let secrets = [];
    
    for (let i = 0; i < 5; i++) {
      const randomAccount = Account.random(undefined, config.chain_id);
      secrets.push(randomAccount.privateKey.replace('0x', ''));
    }

    fs.appendFile(config.genesis_secrets, secrets.join('\n'), (err) => {
      if (err) {
        console.error(err);
      } else {
        console.log('Secrets generated successfully!');
      }
    });
}

genesisSecrets();

