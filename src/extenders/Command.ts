import JimboClient from "..";
import type { BaseCommandSettings, Command as CmdType } from "../../types/index";

export default class Command implements CmdType {

  private client: JimboClient;
  private dir: string;
    
  public name: string;
  public description: string;

  constructor(jimboClient: JimboClient, baseCommandSettings: BaseCommandSettings) {
    this.client = jimboClient;

    this.name = baseCommandSettings.name;
    this.description = baseCommandSettings.description;
  }
  
  public setDir(dir: string): void {
    this.dir = dir;
  }

  public getClient(): JimboClient {
    return this.client;
  }
  public getDir(): string {
    return this.dir;
  }

}