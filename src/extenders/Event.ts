import JimboClient from "..";
import { Event as EventType, EventOptions } from "../../types";

export default class Event implements EventType {

  public client: JimboClient;
  public once: boolean;
  private event: string;
  private dir: string;

  constructor(jimboClient: JimboClient, options: EventOptions) {
    this.client = jimboClient;
    this.event = options.event;
    this.once = options.once || false;
  }

  public async run(): Promise<any> {}

  public setDir(dir: string) {
    this.dir = dir;
  }
  public getDir() {
    return this.dir;
  }
  public getEvent() {
    return this.event;
  }

}