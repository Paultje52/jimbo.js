import { Client, Intents, IntentsString, RecursiveReadonlyArray } from "discord.js";
import { managers } from ".";
import type { intents, ClientManagers, Command, CommandObject, Logger as LoggerImplementation } from "../types/index";
import promiseTimeout from "./util/promiseTimeout";

export default class JimboClient extends Client {

  private managers: ClientManagers;
  private commands: CommandObject;

  private ready: boolean = false;

  constructor(intents?: intents[], managers?: ClientManagers) {

    super({
      intents: new Intents((intents || []) as RecursiveReadonlyArray<IntentsString>)
    });

    this.managers = managers || {};
    this.ensureManagers();
      this.getLogger().info("Loaded managers!");

    this.start();
  }
  
  // Ensure managers
  private ensureManagers(): void {
    if (!this.managers.CommandLoader) this.managers.CommandLoader = new managers.CommandLoader("commands");
    if (!this.managers.Logger) this.managers.Logger = new managers.Logger();
  }

  // Get the logger
  public getLogger(): LoggerImplementation {
    return this.managers.Logger;
  }

  // Start the client
  private async start(): Promise<void> {
    this.commands = await this.loadCommands();

    this.ready = true;
  }

  // Load the commands using the CommandLoader manager
  private async loadCommands(): Promise<CommandObject> {
    let commands: Command[] = await this.managers.CommandLoader.loadCommands(this);
      this.getLogger().info(`Loaded ${commands.length} ${commands.length === 1 ? "command" : "commands"}!`);
    // Function to convert the command array to an object with the command name as the key and the command as the value
    return commands.reduce(
      (object: CommandObject, value: Command) => ({ ...object, [value.name]: value }), 
    {}) as CommandObject;
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
  
}