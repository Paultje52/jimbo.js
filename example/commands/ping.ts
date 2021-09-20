import JimboClient, { Command } from "../../src";

export default class PingCommand extends Command {
  constructor(client: JimboClient) {
    super(client, {
      name: "ping",
      description: "Pings the bot to check the response time."
    });
  }
}