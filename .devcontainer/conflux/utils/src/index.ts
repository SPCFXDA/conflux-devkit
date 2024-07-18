#!/usr/bin/env node
import { Command } from "commander";
import {
  genesisList,
  faucet,
  genesisToeSpace,
  genesisSecrets,
  balance,
  status,
  start,
  stop,
  logs,
  stderr,
} from "./utils";
const program = new Command();

program
  .version("0.1.0")
  .description("DevKit CLI utils")
  .option("-l, --list", "List genesis accounts")
  .option("-b, --balance", "Balance of the genesis accounts")
  .option("-f, --faucet [value...]", "Faucet <amount> <address>")
  .option("-e, --eSpaceGenesis", "Transfer from Core genesis address to eSpace")
  .option("-g, --generateGenesis [value]", "Generate genesis addresses")
  .option("--start", "Start the development node")
  .option("--stop", "Stop the development node")
  .option("--status", "Show the node status")
  .option("--logs", "Show the node logs")
  .option("--stderr", "Show the errors the node produced in the stderr")
  .parse(process.argv);

const options = program.opts();

if (options.list) {
  // console.log(options.list)
  genesisList();
}

if (options.faucet) {
  faucet(options.faucet);
}

if (options.eSpaceGenesis) {
  genesisToeSpace();
}

if (options.generateGenesis) {
  let value = options.generateGenesis == true ? "5" : options.generateGenesis;
  genesisSecrets(value);
}

if (options.balance) {
  balance();
}

if (options.start) {
  start();
}

if (options.stop) {
  stop();
}

if (options.status) {
  status();
}

if (options.logs) {
  logs();
}

if (options.stderr) {
  stderr();
}

if (!process.argv.slice(2).length) {
  program.outputHelp();
}
