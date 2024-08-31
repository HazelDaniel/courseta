var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import { pool } from "../../db.js";
import { serializeImage } from "../../serializers/db.serializer.js";
import { ServerError, checkPasswordAgainstHash, hashPassword, log, } from "../../utils.js";
import v1Config from "../../api/v1/config.js";
import crypto from "crypto";
import fetch from "node-fetch";
export class UserModel extends BaseModel {
    static updateAvatar(userID, newAvatar, avatarMeta, type, originalImage) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const isRedacted = !!newAvatar;
                if (!isRedacted) {
                    resolve();
                    return;
                }
                let serializedImage = serializeImage(newAvatar || "");
                let byteImage;
                let mimeType;
                if (serializedImage) {
                    const { data, mime } = serializedImage;
                    byteImage = data;
                    mimeType = mime;
                }
                else {
                    byteImage = "";
                    mimeType = "";
                }
                const query = {
                    name: "update_user_avatar",
                    text: "SELECT * FROM update_user_avatar($1, $2, $3, $4)",
                    values: [userID, byteImage, mimeType, type],
                };
                const imageServerPayload = {
                    newAvatar: [originalImage || "", ""], // the second argument isnt needed
                    avatarMeta,
                };
                const requestUrl = `${v1Config.serverOptions.imageServerBaseUrl}/api/v1/images/${avatarMeta.id}`;
                const request = yield fetch(`${requestUrl}`, {
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(imageServerPayload),
                    method: "put",
                });
                log("was the response from the image server successful?:");
                if (request.ok) {
                    log("yes");
                    yield client.query(query);
                }
                else {
                    if (request.status - 400 < 99 && request.status >= 400)
                        reject(new ServerError("could not update image!. check inputs ", 400));
                    else
                        reject(new ServerError("something went wrong updating the image. please try again.", request.status));
                    return;
                }
                resolve();
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not update user avatar!. reason: ${err}`);
                if (err instanceof ServerError)
                    reject(err);
                reject(new Error(err));
            }
            finally {
                client.release();
            }
        }));
    }
    static updateEmail(userID, newEmail, type) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "update_user_email",
                    text: "SELECT * FROM update_user_email($1, $2, $3)",
                    values: [userID, newEmail, type],
                };
                yield client.query(query);
                resolve();
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not update user email!. reason: ${err}`);
                reject(new Error(err));
            }
            finally {
                client.release();
            }
        }));
    }
    static updateNames(userID, firstName, lastName, type) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "update_user_names",
                    text: "SELECT * FROM update_user_names($1, $2, $3, $4)",
                    values: [userID, firstName || null, lastName || null, type],
                };
                yield client.query(query);
                resolve();
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not update user names!. reason: ${err}`);
                reject(new Error(err));
            }
            finally {
                client.release();
            }
        }));
    }
    static updatePassword(userID, oldPassword, newPassword, type) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            //TODO: we need to update salt along side this
            try {
                const salt = crypto
                    .randomBytes(v1Config.hashingOptions.saltByteCount)
                    .toString(v1Config.hashingOptions.encoding);
                const hashedPassword = yield hashPassword(newPassword, salt);
                const query1 = {
                    name: "get_user_hash_and_salt",
                    text: "SELECT * FROM get_user_hash_and_salt($1, $2)",
                    values: [userID, type],
                };
                const res = yield client.query(query1);
                const { rows } = res;
                const { hash: originalHash, salt: originalSalt } = rows[0];
                try {
                    const isMatch = yield checkPasswordAgainstHash(oldPassword, originalHash, originalSalt);
                    if (!isMatch) {
                        const noPasswordMatchError = new ServerError("credentials do not match!", 401);
                        throw noPasswordMatchError;
                    }
                }
                catch (err) {
                    reject(err);
                }
                const query2 = {
                    name: "update_user_password",
                    text: "SELECT * FROM update_user_password($1, $2, $3, $4)",
                    values: [userID, hashedPassword, salt, type],
                };
                yield client.query(query2);
                resolve();
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not update user password!. reason: ${err}`);
                reject(new Error(err));
            }
            finally {
                client.release();
            }
        }));
    }
    static updateFields(updateData, role) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            try {
                const { userID, firstName, lastName, newAvatar, newPassword, oldPassword, avatarMeta, } = updateData;
                if (firstName && lastName) {
                    yield this.updateNames(userID, firstName, lastName, role);
                    resolve();
                    return;
                }
                if (newAvatar && avatarMeta) {
                    yield this.updateAvatar(userID, newAvatar[1], avatarMeta, role, newAvatar[0]);
                    resolve();
                    return;
                }
                if (newPassword && oldPassword) {
                    yield this.updatePassword(userID, oldPassword, newPassword, role);
                    resolve();
                    return;
                }
                reject(new Error("incomplete data. Fields not updated!"));
                return;
            }
            catch (err) {
                reject(err);
            }
        }));
    }
    static search(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    const query = {
                        name: "get_current_user",
                        text: "SELECT * FROM get_current_user($1, $2)",
                        values: [id, role],
                    };
                    const res = yield client.query(query);
                    const { rows } = res;
                    const resUser = rows.map((el) => {
                        const { avatar_meta } = el;
                        return {
                            id,
                            avatarMeta: avatar_meta,
                        };
                    })[0];
                    resolve(resUser);
                }
                catch (err) {
                    console.error(`${chalk.red("QUERY_ERR:")} could not fetch user!. reason: ${err}`);
                    reject(err);
                }
                finally {
                    client.release();
                }
            }));
        });
    }
    static validate(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    const query = {
                        name: "validate_user",
                        text: "SELECT validate_user($1)",
                        values: [userID],
                    };
                    yield client.query(query);
                    resolve();
                }
                catch (err) {
                    if (err instanceof ServerError) {
                        reject(err);
                    }
                    else if (typeof err === 'string') {
                        reject(new Error(err));
                    }
                    else {
                        log("error: ", err);
                        reject(new ServerError("could not validate user", 401));
                    }
                }
                finally {
                    client.release();
                }
            }));
        });
    }
    static getVerificationCredentials(userID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    const query = {
                        name: "get_verification_credentials",
                        text: "SELECT * FROM get_verification_credentials($1)",
                        values: [userID],
                    };
                    const result = yield client.query(query);
                    const { rows } = result;
                    try {
                        const [{ creator_pass, verification_id, email }] = rows;
                        resolve({ creatorPass: creator_pass, verificationID: verification_id, email });
                        return;
                    }
                    catch (err) {
                        // cases where the user might not exist
                        reject(new ServerError("not authorized!", 401)); // can't be giving clues to hackers, yunno
                        return;
                    }
                }
                catch (err) {
                    if (err instanceof ServerError) {
                        reject(err);
                    }
                    else if (typeof err === 'string') {
                        reject(new Error(err));
                    }
                    else {
                        reject(new ServerError("could not get verification credentials", 401));
                    }
                }
                finally {
                    client.release();
                }
            }));
        });
    }
    get all() {
        return Promise.resolve([]);
    }
    get() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    search() {
        return __awaiter(this, void 0, void 0, function* () {
            return Promise.resolve({});
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () { });
    }
    show() {
        console.log(`${chalk.bgCyanBright("USER MODEL:")} {${this.valueOf()}}`);
    }
}
