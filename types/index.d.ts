import JimboClient from "../src";

// Client
export type intents = "GUILDS" | "GUILD_MEMBERS" | "GUILD_BANS" | "GUILD_EMOJIS_AND_STICKERS" | "GUILD_INTEGRATIONS" | "GUILD_WEBHOOKS" | "GUILD_INVITES" | "GUILD_VOICE_STATES" | "GUILD_PRESENCES" | "GUILD_MESSAGES" | "GUILD_MESSAGE_REACTIONS" | "GUILD_MESSAGE_TYPING" | "DIRECT_MESSAGES" | "DIRECT_MESSAGE_REACTIONS" | "DIRECT_MESSAGE_TYPING";
export type ClientManagers = {
  Logger?: Logger;
  CommandLoader?: CommandLoader;
  EventLoader?: EventLoader;
};

// Command
export declare class CommandLoader {
  loadCommands(client: JimboClient): Promise<Command[]>;
}
export type BaseCommandSettings = {
  name: string;
  description: string;
};
export type CommandObject = {
  [commandName: string]: Command;
};
export declare class Command {
  name: string;
  description: string;

  setDir: (dir: string) => void;
  getDir: () => string;
}

// Event
export declare class Event {
  run: (...args: any) => Promise<void>;
  setDir: (dir: string) => void;
  getDir: () => string;
  getEvent: () => string;
  once: boolean;
}
export declare class EventLoader {
  loadEvents(client: JimboClient): Promise<Event[]>;
  activateEvents(client: JimboClient, events: Event[]): Promise<void>;
}
export type EventsObject = {
  [eventDir: string]: Event;
}
export type EventOptions = {
  event: string;
  once?: boolean;
}

// Logger
export declare class Logger {
  error: (error: string | Error) => void;
  warn: (warn: string) => void;
  info: (log: string) => void;
  success: (log: string) => void;
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
  success?: string
};
export type LoggerEvent = "error" | "warn" | "info" | "success" | "*";