import { NodeTask } from "./task";

export class Stderr extends NodeTask {
  async execute(options: any) {
    this.stderr();
  }
}
