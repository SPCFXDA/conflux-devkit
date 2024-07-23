#!/usr/bin/env node
import { Command } from "commander";
import {
  GenesisList,
  Faucet,
  GenesisToeSpace,
  Balance,
  Status,
  Start,
  Stop,
  Logs,
  Stderr,
} from "./index";
const program = new Command();

program
  .version("0.1.0")
  .description("DevKit CLI utils")
  .option("-l, --list", "List genesis accounts")
  .option("-b, --balance", "Balance of the genesis accounts")
  .option("-f, --faucet [value...]", "Faucet <amount> <address>")
  .option(
    "-e, --espace-genesis [value]",
    "Transfer from Core genesis address to eSpace",
  )
  .option("--start", "Start the development node")
  .option("--stop", "Stop the development node")
  .option("--status", "Show the node status")
  .option("--logs", "Show the node logs")
  .option("--stderr", "Show the errors the node produced in the stderr")
  .parse(process.argv);

const options = program.opts();

async function main() {
  const optionsKeys = Object.keys(options);
  let activeOption = optionsKeys.length > 0 ? optionsKeys[0] : undefined;

  switch (activeOption) {
    case "start":
      await new Start().run(options);
      break;
    case "stop":
      await new Stop().run(options);
      break;
    case "list":
      await new GenesisList().run(options);
      break;
    case "faucet":
      await new Faucet().run(options);
      break;
    case "espaceGenesis":
      await new GenesisToeSpace().run(options);
      break;
    case "balance":
      await new Balance().run(options);
      break;
    case "status":
      await new Status().run(options);
      break;
    case "logs":
      await new Logs().run(options);
      break;
    case "stderr":
      await new Stderr().run(options);
      break;
    default:
      if (!process.argv.slice(2).length) {
        program.outputHelp();
      }
      break;
  }
}

main().catch((error) => {
  console.error("An error occurred during startup:", error.message);
  process.exit(1);
});
