// Important: Versioncheck
import versionCheck from "./versionCheck";
versionCheck();

// Imports
import JimboClient from "./JimboClient";
import Command from "./extenders/Command";
import CommandLoader from "./managers/CommandLoader";
import promiseTimeout from "./util/promiseTimeout";
import loadDir from "./util/loadDir";

// Exports
export default JimboClient;
export { Command, CommandLoader, promiseTimeout, loadDir };