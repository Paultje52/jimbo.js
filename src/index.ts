// Important: Versioncheck
import versionCheck from "./versionCheck";
versionCheck();

// Imports
import CommandLoader from "./managers/CommandLoader";
import Logger from "./managers/Logger";
import EventLoader from "./managers/EventLoader";

import JimboClient from "./JimboClient";
import Command from "./extenders/Command";
import Event from "./extenders/Event";
import promiseTimeout from "./util/promiseTimeout";
import loadDir from "./util/loadDir";

// Managers object
let managers = { CommandLoader, Logger, EventLoader };

// Exports
export default JimboClient;
export { Command, Event, promiseTimeout, loadDir, managers };