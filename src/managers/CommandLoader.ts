import { join } from "path";
import JimboClient from "..";
import { Command } from "../../types";
import loadDir from "../util/loadDir";
import { blue } from "chalk";

export default class CommandLoader implements CommandLoader {
  private directory: string;

  constructor(directory?: string) {
    if (!directory) directory = "commands";
    this.directory = join(process.cwd(), directory);
  }

  public async loadCommands(client: JimboClient): Promise<Command[]> {
    let files = await loadDir(this.directory);

    let commands: Command[] = [];
    for (let file of files) {
      let cmd = this.loadCommand(file, client);
      if (!cmd) continue;

      commands.push(cmd);
      client.getLogger().info(`Loaded command ${blue(cmd.name)}`);
    }
    return commands;
  }

  private loadCommand(file: string, client: JimboClient): Command {
    try {
      require(file);
    } catch(e) {
      client.getLogger().error(`Cannot load command ${file}: ${e}`);
      return;
    }

    let cmd = require(file);
    if (typeof cmd !== "function" && typeof cmd.default === "function") cmd = cmd.default;

    if (typeof cmd !== "function") {
      client.getLogger().error(`Cannot load command ${file}: No class export!`);
      return;
    }

    let command = new cmd(client);

    try {
      command.setDir(file);
    } catch(e) {
      if (e.toString() === "TypeError: command.setDir is not a function") client.getLogger().error(`Cannot load command ${file}: Methods aren't implemented properly. Did you extend the Jimbo.js Command class?`);
      else client.getLogger().error(`Cannot load command ${file}: ${e}`);
      return;
    }
    
    return command;
  }

}