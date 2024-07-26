import { NodeTask } from "./task";

export class Stop extends NodeTask {
  async execute(options: any) {
    this.stop();
  }
}
