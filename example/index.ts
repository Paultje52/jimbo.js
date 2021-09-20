import JimboClient, { CommandLoader } from "../src";

new JimboClient([], {
  CommandLoader: new CommandLoader("commands")
})
.waitUntilReady().then((client) => {
  client.login("TOKEN");
});