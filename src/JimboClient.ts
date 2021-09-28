import { Client, Intents, IntentsString, RecursiveReadonlyArray } from "discord.js";
import { managers } from ".";
import type { intents, ClientManagers, Command, CommandObject, EventsObject, Logger as LoggerImplementation, Event } from "../types/index";
import promiseTimeout from "./util/promiseTimeout";
import { blue } from "chalk";

export default class JimboClient extends Client {

  private managers: ClientManagers;
  private commands: CommandObject;
  private events: EventsObject;

  private ready: boolean = false;

  constructor(intents?: intents[], managers?: ClientManagers) {

    super({
      intents: new Intents((intents || []) as RecursiveReadonlyArray<IntentsString>)
    });

    this.managers = managers || {};
    this.ensureManagers().then(() => {
      this.getLogger().success("Loaded managers!");

      this.start();
    });
  }
  
  // Ensure managers
  private async ensureManagers(): Promise<void> {
    if (!this.managers.Logger) this.managers.Logger = new managers.Logger();
    while (!this.managers.Logger.ready) {
      await promiseTimeout(100);
    }

    if (!this.managers.CommandLoader) this.managers.CommandLoader = new managers.CommandLoader("commands");
    if (!this.managers.EventLoader) this.managers.EventLoader = new managers.EventLoader("events");
  }

  // Get the logger
  public getLogger(): LoggerImplementation {
    return this.managers.Logger;
  }

  // Start the client
  private async start(): Promise<void> {
    this.commands = await this.loadCommands();
    this.events = await this.loadEvents();
    this.managers.EventLoader.activateEvents(this, this.getEventsArray());

    this.ready = true;
    this.emit("jimbo.ready", null);
    this.getLogger().info("JimboClient is ready for login!");
  }

  // Load the commands using the CommandLoader manager
  private async loadCommands(): Promise<CommandObject> {
    let commands: Command[] = await this.managers.CommandLoader.loadCommands(this);
      this.getLogger().success(`Loaded ${blue(commands.length)} ${commands.length === 1 ? "command" : "commands"}!`);
    // Function to convert the command array to an object with the command name as the key and the command as the value
    return commands.reduce(
      (object: CommandObject, value: Command) => ({ ...object, [value.name]: value }), 
    {}) as CommandObject;
  }

  // Load the events using the EventLoader manager
  private async loadEvents(): Promise<EventsObject> {
    let events: Event[] = await this.managers.EventLoader.loadEvents(this);
      this.getLogger().success(`Loaded ${blue(events.length)} ${events.length === 1 ? "event" : "events"}!`);
    // Function to convert the event array to an object with the event dir as the key and the event as the value
    return events.reduce(
      (object: EventsObject, value: Event) => ({ ...object, [value.getDir()]: value }),
    {}) as EventsObject;
  }


  // Get command functions
  public getCommands(): CommandObject {
    return this.commands;
  }
  public getCommand(name: string): Command | undefined {
    return this.commands[name];
  }
  public getCommandsArray(): Command[] {
    return Object.values(this.commands);
  }

  // Get event functions
  public getEvents(): EventsObject {
    return this.events;
  }
  public getEvent(dir: string): Event | undefined {
    return this.events[dir];
  }
  public getEventsArray(): Event[] {
    return Object.values(this.events);
  }

  // Ready functions
  public isReady(): boolean {
    return this.ready;
  }
  public isOnline(): boolean {
    return Client.prototype.isReady.call(this);
  }
  public waitUntilReady(): Promise<JimboClient> {
    return new Promise(async (resolve) => {
      while (!this.isReady()) {
        await promiseTimeout(100);
      }
      resolve(this);
    });
  }

  // Login function
  public login(token?: string): Promise<string> {
    return new Promise(async (resolve) => {
      this.on("ready", () => {
        this.getLogger().success(`Jimbo is logged in with ${this.user.username} (${this.user.id}) in ${this.guilds.cache.size} ${this.guilds.cache.size === 1 ? "guild" : "guilds"}!`);
        resolve(token);
      });

      this.getLogger().info("Logging in...");
      await Client.prototype.login.call(this, token);
      this.getLogger().info("Jimbo logged in, waiting for ready...");
    });
  }
  
}