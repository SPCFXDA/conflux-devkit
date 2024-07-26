import { ClientTask } from "./task";

export class Start extends ClientTask {
  async execute(options: any) {
    await this.start();
    console.log("bootstrap...");
    await this.status();
    console.log("Node started!");
    if (options.logs) {
      await this.logs();
    } else {
      process.exit(0);
    }
  }
}
