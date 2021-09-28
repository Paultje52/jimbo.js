import { join } from "path";
import JimboClient from "..";
import { Event, EventLoader as EventLoaderType } from "../../types";
import loadDir from "../util/loadDir";
import { green } from "chalk";

export default class EventLoader implements EventLoaderType {
  private directory: string;

  constructor(directory?: string) {
    if (!directory) directory = "events";
    this.directory = join(process.cwd(), directory);
  }

  public async activateEvents(client: JimboClient, events: Event[]): Promise<void> {
    for (let event of events) {
      let eventMethod = event.run.bind(event);

      if (event.once) client.once(event.getEvent(), eventMethod);
      else client.on(event.getEvent(), eventMethod);
    }
  }

  public async loadEvents(client: JimboClient): Promise<Event[]> {
    let files = await loadDir(this.directory);

    let events: Event[] = [];
    for (let file of files) {
      let event = this.loadEvent(file, client);
      if (!event) continue;

      events.push(event);
      // Gets the last element of the file path
      client.getLogger().info(`Loaded event ${green(`${file.split(/\\|\//).pop()!.split(".")[0]} (type ${event.getEvent()})`)} `);
    }

    return events;
  }

  private loadEvent(file: string, client: JimboClient): Event {
    try {
      require(file);
    } catch(e) {
      client.getLogger().error(`Cannot load event ${file}: ${e}`);
      return;
    }

    let eventFile = require(file);
    if (typeof eventFile !== "function" && typeof eventFile.default === "function") eventFile = eventFile.default;

    if (typeof eventFile !== "function") {
      client.getLogger().error(`Cannot load event ${file}: No class export!`);
      return;
    }

    let event = new eventFile(client);

    try {
      event.setDir(file);
    } catch(e) {
      if (e.toString() === "TypeError: event.setDir is not a function") client.getLogger().error(`Cannot load event ${file}: Methods aren't implemented properly. Did you extend the Jimbo.js Event class?`);
      else client.getLogger().error(`Cannot load event ${file}: ${e}`);
      return;
    }
    
    return event;
  }

}