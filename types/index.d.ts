import { ColorResolvable } from "discord.js";
import JimboClient from "../src";

export type intents = "GUILDS" | "GUILD_MEMBERS" | "GUILD_BANS" | "GUILD_EMOJIS_AND_STICKERS" | "GUILD_INTEGRATIONS" | "GUILD_WEBHOOKS" | "GUILD_INVITES" | "GUILD_VOICE_STATES" | "GUILD_PRESENCES" | "GUILD_MESSAGES" | "GUILD_MESSAGE_REACTIONS" | "GUILD_MESSAGE_TYPING" | "DIRECT_MESSAGES" | "DIRECT_MESSAGE_REACTIONS" | "DIRECT_MESSAGE_TYPING";

export declare class Command {
  name: string;
  description: string;

  setDir: (dir: string) => void;
  getDir: () => string;
}

export declare class CommandLoader {
  loadCommands(client: JimboClient): Promise<Command[]>;
}
export type ClientManagers = {
  CommandLoader?: CommandLoader;
  Logger?: Logger;
};

export type BaseCommandSettings = {
  name: string;
  description: string;
};

export type CommandObject = {
  [commandName: string]: Command;
};

export declare class Logger {
  error: (error: string | Error) => void;
  warn: (warn: string) => void;
  info: (log: string) => void;
  ready: boolean;
}
type filename = string;
export type LoggerOptions = {
  writeFile?: false | filename;
  color?: LoggerColor;
}
export type LoggerColor = {
  error?: string;
  warn?: string;
  info?: string;
};
export type LoggerEvent = "error" | "warn" | "info" | "*";