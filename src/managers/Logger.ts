import type { LoggerOptions, Logger as LoggerImplementation, LoggerEvent, LoggerColor } from "../../types";
import * as EventEmitter from "events";
import { createWriteStream, WriteStream, promises as fsPromises, constants as fsConstants } from "fs";
import { join } from "path"
import moment = require("moment");
import { hex as chalkHex } from "chalk";

export default class Logger extends EventEmitter implements LoggerImplementation {

  private writeFileStream: WriteStream;
  private colors: LoggerColor;
  public ready: boolean = true;

  constructor(loggerOptions?: LoggerOptions) {
    super();
    if (!loggerOptions) loggerOptions = {};

    if (!loggerOptions.writeFile) loggerOptions.writeFile = false;
    if (loggerOptions.writeFile) {
      this.ready = false;

      this.initializeWriteFileStream(loggerOptions.writeFile).then((writeStream) => {
        this.writeFileStream = writeStream;
        this.info("Logger filestream initialized!");
        this.ready = true;

      }).catch(() => {
        this.error(`Cannot initialize filestream for ${loggerOptions.writeFile}, folder does not exist!`);
        this.ready = true;
      });
    }

    if (!loggerOptions.color) loggerOptions.color = {};
    if (!loggerOptions.color.error) loggerOptions.color.error = "#ee4b2b";
    if (!loggerOptions.color.warn) loggerOptions.color.warn = "#e49b0f";
    if (!loggerOptions.color.info) loggerOptions.color.info = "#89cff0";
    this.colors = loggerOptions.color;

    this.initMainListener();
    this.info(`Logger manager ready to start logging! ${loggerOptions.writeFile ? `\nInitializing filestream logger...` : ""}`);
  }

  private initMainListener(): void {
    this.onLog("*", (data, type) => {
      console.log(`${chalkHex("#00ffff")(`[${this.getDateFormat()}]`)} ${chalkHex(this.colors[type])(`[${type.toUpperCase()}]`)} ${data}`);
      if (typeof this.writeFileStream !== "undefined") this.writeFileStream.write(`\n[${this.getDateFormat()}] [${type.toUpperCase()}] ${data}`);
    });
  }

  private getDateFormat(): string {
    return moment.utc().format("YYYY-MM-DD HH:mm:ss");
  }

  private async fileExists(path: string): Promise<boolean> {
    try {
      await fsPromises.access(path, fsConstants.F_OK);
      return true;
    } catch (e) {
      return false;
    }
  }

  private async initializeWriteFileStream(writeFile: string): Promise<WriteStream> {
    let path = join(process.cwd(), writeFile);
    if (!(await this.fileExists(path))) await fsPromises.writeFile(path, "");

    let content = await fsPromises.readFile(path);
    let writeFileStream = createWriteStream(path);
    writeFileStream.write(`${content}\n\n===[Jimbo.js debug]===\nStartdate: ${this.getDateFormat()} (${Date.now()}) UTC\n`);

    return writeFileStream;
  }

  public onLog(event: LoggerEvent, func: (data: string | Error, type?: LoggerEvent) => void): Logger {
    this.on(event, func);
    return this;
  }

  public warn(warn: string): void {
    this.emitData("warn", warn, "warn");
    this.emitData("*", warn, "warn");
  }
  public error(error: string | Error): void {
    this.emitData("error", error, "error");
    this.emitData("*", error, "error");
  }
  public info(info: string): void {
    this.emitData("info", info, "info");
    this.emitData("*", info, "info");
  }

  private emitData(event: string, data: string | Error, eventType: LoggerEvent) {
    if (this.listeners(event).length > 0) this.emit(event, data, eventType);
  }

}