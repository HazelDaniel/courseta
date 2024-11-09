import { v2Config } from './../config.js';
export const log = (...args: any[]) => {
  if (v2Config.serverOptions.debugMode)
    return console.log.apply(console, ["[DEBUG]", ...args]);
  return console.log.apply(console, []);
};