import { ClientTask } from "./task";

export class Status extends ClientTask {
  async execute(options: any) {
    console.log(await this.status());
  }
}
