import JimboClient, { managers } from "../src";

new JimboClient([], {
  CommandLoader: new managers.CommandLoader("commands"),
  Logger: new managers.Logger({ writeFile: "jimbo.log" })
})
.waitUntilReady().then((client) => {
  client.getLogger().info("Hello there!");
  // client.login("TOKEN");
});