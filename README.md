# Jimbo.js
A simple yet advanced discord.js framework!

> **Note:** Jimbo.js is still in development and may not be stable or finished!<br>
> Install the alpha via NPM: `npm i github:Paultje52/jimbo.js`

Jimbo extends the default Discord.js Client with extra features, like a command handler, database, and more. Each feature is added via a manager, which is a class that handles the setup and management of the feature. All the managers should implement the correct interfaces. Even the command and event extenders are customisable because of type implementations! Because of that, you can code your own managers and parent classes and add them to the Jimbo client.

## Example
> This is the only code you need for the base client to work.
### Index.ts
```ts
import JimboClient from "jimbo.js";

new JimboClient().waitUntilReady().then((client) => {
  client.login("TOKEN");
});
```
### A file in `commands` directory
```ts
import JimboClient, { Command } from "../../src";

export default class PingCommand extends Command {
  constructor(client: JimboClient) {
    super(client, {
      name: "ping",
      description: "Pings the bot to check the response time."
    });
  }

  // TODO: Method to handle the command
}
```