import JimboClient, { Event } from "../../src";

export default class Ready extends Event {

  constructor(client: JimboClient) {
    super(client, {
      event: "jimbo.ready",
      once: true
    });
  }

  async run() {
    this.client.getLogger().info("Hello there!");
  }

}