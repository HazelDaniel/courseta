var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v1Config } from "./api/v1/config.js";
import chalk from "chalk";
import crypto from "crypto";
export class ServerError extends Error {
    constructor(message, code) {
        super(message);
        this.message = message;
        this.code = code;
    }
}
export class ConsoleLogger {
    constructor(status, message) {
        this.status = status;
        this.message = message;
        this.tileWidth = process.stdout.columns;
        this.indentation = this.tileWidth >= 150 ? 8 : this.tileWidth >= 80 ? 5 : 1;
        this.indentString = "\t".repeat(this.indentation);
        console.log("_".repeat(this.tileWidth));
        if (this.status === "fail")
            console.log(this.indentString, chalk.redBright(`(FAIL): ${this.message}`));
        else if ((this.indentString, this.status === "success"))
            console.log(this.indentString, chalk.greenBright(`(SUCCESS): ${this.message}`));
        else if ((this.indentString, this.status === "info"))
            console.log(this.indentString, chalk.white(`(INFO): ${this.message}`));
        else if (this.status === "error")
            console.log(this.indentString, chalk.bgRedBright(`(ERR): ${this.message}`));
        console.log("_".repeat(this.tileWidth));
    }
}
export class BoardDisplay {
}
BoardDisplay.level1Nest = "\t\t";
BoardDisplay.level2Nest = "\t\t\t\t";
BoardDisplay.level3Nest = "\t\t\t\t\t\t\t\t";
BoardDisplay.level4Nest = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
BoardDisplay.level5Nest = "\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t\t";
BoardDisplay.frameChar = "<>";
BoardDisplay.border = "|";
BoardDisplay.marginDecoratorCount = 35;
export const log = (...args) => {
    if (v1Config.serverOptions.debugMode)
        return console.log.apply(console, ["[DEBUG]", ...args]);
    return console.log.apply(console, []);
};
// PARSERS
export const parseBase64Data = (inputString) => {
    try {
        const matches = inputString.match(/^data:(image\/\w+);base64,(.+)$/);
        if (matches) {
            const [_1, mime, data] = matches;
            return { mime, data };
        }
        return null;
    }
    catch (err) {
        console.error(err);
        return null;
    }
};
export const base64ToBuffer = (inputString) => {
    const parsedData = parseBase64Data(inputString);
    if (parsedData) {
        const { data } = parsedData;
        return Buffer.from(data, "base64");
    }
    return null;
};
export const bufferToBase64 = (inputBuffer, mimeType) => {
    return `data:${mimeType};base64,${inputBuffer.toString("base64")}`;
};
export const base64toDataURL = (dataUrl, mimeType) => {
    if (!dataUrl)
        return null;
    return `data:${mimeType};base64,${dataUrl}`;
};
export const hashPassword = (password, existingSalt, hashOptions = v1Config.hashingOptions) => {
    return new Promise((resolve, reject) => {
        const { iterations, digest, encoding, keyLength, saltByteCount } = hashOptions;
        let salt;
        if (existingSalt)
            salt = existingSalt;
        else
            salt = crypto.randomBytes(saltByteCount).toString(encoding);
        try {
            crypto.pbkdf2(password, salt, iterations, keyLength, digest, (err, derivedKey) => {
                if (err)
                    reject(err);
                const hashedPassword = derivedKey.toString(encoding);
                resolve(hashedPassword);
            });
        }
        catch (err) {
            reject(err);
        }
    });
};
export const checkPasswordAgainstHash = (password, existingHash, existingSalt) => {
    return new Promise((resolve, reject) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            const hashedPassword = yield hashPassword(password, existingSalt);
            resolve(hashedPassword === existingHash);
        }
        catch (err) {
            reject(err);
        }
    }));
};
export const parseStringifiedUUID = (stringifiedUUID) => {
    const match = stringifiedUUID.match(/^"*([\w-]*)"*$/);
    if (!!match && !!match[1])
        return match[1];
    return null;
};
