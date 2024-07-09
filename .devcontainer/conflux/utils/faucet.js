// Import required modules
const TOML = require('@iarna/toml'); // For parsing TOML files
const fs = require('fs'); // For file system operations
const { Conflux, Drip, address } = require('js-conflux-sdk'); // Conflux SDK for blockchain interactions
const { isValidAddress } = require('ethereumjs-util'); // Utility for validating Ethereum addresses

// Define paths and RPC host from environment variables or default values
const secretPath = process.env.MINER_PATH || "/opt/conflux/mining_account.txt";
const configPath = process.env.CONFIG_PATH || "/opt/conflux/develop.toml";
const rpcHost = process.env.RPC_HOST || "localhost";

// Capture command line arguments
const args = process.argv.slice(2);

// Function to check if a value is numeric
function isNumeric(n) {
    return !isNaN(parseFloat(n)) && isFinite(n);
}

// Main function to handle the faucet logic
async function faucet() {
    // Retrieve request amount and destination address from arguments
    const requestAmount = args[0];
    const destinationAddress = args[1];

    // Read secret and config files
    const secretString = fs.readFileSync(secretPath, "utf-8");
    const configString = fs.readFileSync(configPath, "utf-8");
    const config = TOML.parse(configString);

    // Initialize Conflux instance with RPC URL and network ID from config
    const conflux = new Conflux({
        url: `http://${rpcHost}:${config.jsonrpc_http_port}`,
        networkId: config.chain_id,
    });

    // Add miner private key to Conflux wallet and get balance
    const miner = conflux.wallet.addPrivateKey(secretString);
    const balance = Drip(await conflux.cfx.getBalance(miner.address)).toCFX();
    console.log(`Faucet balance is ${balance} CFX`);

    // Exit if no arguments are provided
    if (!args.length) {
        return;
    }

    // Check if the request amount is numeric
    if (!isNumeric(requestAmount)) {
        console.error("Requested amount is not a number");
        return;
    }

    // Check if the request amount exceeds the faucet balance
    if (parseFloat(requestAmount) >= parseFloat(balance)) {
        console.error('Requested amount exceeds faucet availability');
        return;
    }

    // Check if the destination address is a valid Conflux address
    if (address.isValidCfxAddress(destinationAddress)) {
        // Send transaction to the Conflux address
        await conflux.cfx.sendTransaction({
            from: miner.address,
            to: destinationAddress,
            value: Drip.fromCFX(parseFloat(requestAmount)),
        });
        console.log(`${requestAmount} CFX successfully sent to ${destinationAddress}`);
        return;
    }

    // Check if the destination address is a valid Ethereum address
    if (isValidAddress(destinationAddress)) {
        // Initialize CrossSpaceCall internal contract for cross-space transactions
        const crossSpaceCall = conflux.InternalContract('CrossSpaceCall');

        // Function to handle cross-space call transactions
        async function crossSpaceCallFx(eSpaceAddress, amount) {
            const receipt = await crossSpaceCall.transferEVM(eSpaceAddress)
                .sendTransaction({
                    from: miner,
                    value: Drip.fromCFX(amount),
                }).executed();

            // Check transaction outcome status
            if (receipt.outcomeStatus === 0) {
                console.log(`${amount} CFX successfully sent to ${eSpaceAddress}`);
            } else {
                console.log(`Transfer failed to ${eSpaceAddress}`);
            }
        }

        // Execute cross-space call
        await crossSpaceCallFx(destinationAddress, requestAmount);
        return;
    }

    // Log error if the destination address is invalid
    console.error("Invalid destination address");
}

// Execute the faucet function and handle errors
faucet()
    .then(() => process.exit(0))
    .catch(error => {
        console.error(error);
        process.exit(1);
    });
