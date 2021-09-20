export default function versionCheck() {
  let nodeVersion = process.version.split("v")[1].split(".").map(Number);

  if (nodeVersion[0] < 16 || (nodeVersion[0] === 16 && nodeVersion[1] < 6)) console.error("Node version needs to be 16.6.0 or newer!");
}