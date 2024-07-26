import { NodeTask } from "./task";

export class Logs extends NodeTask {
  async execute(options: any) {
    await this.logs();
  }
}
