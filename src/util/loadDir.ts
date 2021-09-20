import { promises as fsPromises } from "fs";
import { join } from "path";

export default async function loadDir(dir: string): Promise<string[]> {
  let paths = await fsPromises.readdir(dir);
  let files = [];

  for (let path of paths) {
    let file = join(dir, path);
    let stats = await fsPromises.stat(file);
    if (stats.isDirectory()) files = files.concat(await loadDir(file));
    else files.push(file);
  }

  return files;
}
