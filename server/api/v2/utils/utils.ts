import { v2Config } from "./../config.js";
import chalk from "chalk";
import crypto from "crypto";
import { BufferLike, ConfigOption } from "../../../types.js";

export const log = (...args: any[]) => {
  if (v2Config.serverOptions.debugMode)
    return console.log.apply(console, ["[DEBUG]", ...args]);
  return console.log.apply(console, []);
};

export class ServerError extends Error {
  constructor(public readonly message: string, public readonly code: number) {
    super(message);
  }
}

export class ConsoleLogger {
  tileWidth = process.stdout.columns;
  indentation: number =
    this.tileWidth >= 150 ? 8 : this.tileWidth >= 80 ? 5 : 1;
  indentString: string = "\t".repeat(this.indentation);

  constructor(
    public readonly status: "fail" | "success" | "info" | "error",
    public readonly message: string
  ) {
    console.log("_".repeat(this.tileWidth));
    if (this.status === "fail")
      console.log(
        this.indentString,
        chalk.redBright(`(FAIL): ${this.message}`)
      );
    else if ((this.indentString, this.status === "success"))
      console.log(
        this.indentString,
        chalk.greenBright(`(SUCCESS): ${this.message}`)
      );
    else if ((this.indentString, this.status === "info"))
      console.log(this.indentString, chalk.white(`(INFO): ${this.message}`));
    else if (this.status === "error")
      console.log(
        this.indentString,
        chalk.bgRedBright(`(ERR): ${this.message}`)
      );
    console.log("_".repeat(this.tileWidth));
  }
}

export class BoardDisplay {
  static level1Nest = "\t\t";
  static level2Nest = "\t\t\t\t";
  static level3Nest = "\t\t\t\t\t\t\t\t";
  static level4Nest = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
  static level5Nest =
    "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
  static frameChar = "<>";

  static border = "|";
  static marginDecoratorCount = 35;
}


// PARSERS
export const parseBase64Data: (
  inputString: string
) => { mime: string; data: string } | null = (inputString) => {
  try {
    const matches = inputString.match(/^data:(image\/\w+);base64,(.+)$/);
    if (matches) {
      const [_1, mime, data] = matches;
      return { mime, data };
    }
    return null;
  } catch (err) {
    console.error(err);
    return null;
  }
};

//CONVERTERS
export const base64ToBuffer: (inputString: string) => Buffer | null = (
  inputString
) => {
  const parsedData = parseBase64Data(inputString);
  if (parsedData) {
    const { data } = parsedData;
    return Buffer.from(data, "base64");
  }
  return null;
};

export const bufferToBase64: (inputBufferBuffer, mimeType: string) => string = (
  inputBuffer,
  mimeType
) => {
  return `data:${mimeType};base64,${inputBuffer.toString("base64")}`;
};

export const base64toDataURL: (
  dataUrl: string,
  mimeType: string
) => string | null = (dataUrl, mimeType) => {
  if (!dataUrl) return null;
  return `data:${mimeType};base64,${dataUrl}`;
};

export const hashPassword: (
  password: string,
  existingSalt?: string,
  hashOptions?: ConfigOption["hashingOptions"]
) => Promise<string> = (
  password,
  existingSalt,
  hashOptions = v2Config.hashingOptions
) => {
  return new Promise((resolve, reject) => {
    const { iterations, digest, encoding, keyLength, saltByteCount } =
      hashOptions;

    let salt: string;
    if (existingSalt) salt = existingSalt;
    else salt = crypto.randomBytes(saltByteCount).toString(encoding);

    try {
      crypto.pbkdf2(
        password,
        salt,
        iterations,
        keyLength,
        digest,
        (err, derivedKey) => {
          if (err) reject(err);
          const hashedPassword = derivedKey.toString(encoding);
          resolve(hashedPassword);
        }
      );
    } catch (err) {
      reject(err);
    }
  });
};

export const getLocalTimestamp: (inputString?: string) => string = (
  inputString
) => {
  let date: Date;
  if (!inputString) date = new Date();
  else date = new Date(inputString);

  const offset = -date.getTimezoneOffset();
  const offsetHours = Math.floor(Math.abs(offset) / 60)
    .toString()
    .padStart(2, "0");
  const offsetMinutes = (Math.abs(offset) % 60).toString().padStart(2, "0");
  const offsetSign = offset >= 0 ? "+" : "-";

  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const day = date.getDate().toString().padStart(2, "0");
  const hours = date.getHours().toString().padStart(2, "0");
  const minutes = date.getMinutes().toString().padStart(2, "0");
  const seconds = date.getSeconds().toString().padStart(2, "0");

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}${offsetSign}${offsetHours}:${offsetMinutes}`;
};

// VALIDATORS
export const checkPasswordAgainstHash: (
  password: string,
  existingHash: string,
  existingSalt: string
) => Promise<boolean> = (password, existingHash, existingSalt) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hashedPassword = await hashPassword(password, existingSalt);
      resolve(hashedPassword === existingHash);
    } catch (err) {
      reject(err);
    }
  });
};

export const parseStringifiedUUID: (
  stringifiedUUID: string
) => string | null = (stringifiedUUID) => {
  const match = stringifiedUUID.match(/^"*([\w-]*)"*$/);
  if (!!match && !!match[1]) return match[1];
  return null;
};
