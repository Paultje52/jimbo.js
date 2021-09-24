// Important: Versioncheck
import versionCheck from "./versionCheck";
versionCheck();

// Imports
import CommandLoader from "./managers/CommandLoader";
import Logger from "./managers/Logger";

import JimboClient from "./JimboClient";
import Command from "./extenders/Command";
import promiseTimeout from "./util/promiseTimeout";
import loadDir from "./util/loadDir";

// Managers object
let managers = { CommandLoader, Logger };

// Exports
export default JimboClient;
export { Command, promiseTimeout, loadDir, managers };