import { join } from "path";
import JimboClient from "..";
import { Command } from "../../types";
import loadDir from "../util/loadDir";

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
      commands.push(this.loadCommand(file, client));
    }
    return commands;
  }

  private loadCommand(file: string, client: JimboClient): Command {
    let cmd = require(file);
    if (typeof cmd !== "function" && typeof cmd.default === "function") cmd = cmd.default;
    
    let command: Command = new cmd(client);
    command.setDir(file);
    return command;
  }

}