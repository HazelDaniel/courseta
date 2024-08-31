var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { imagePool } from "../../db.js";
import { BaseModel } from "./base-model.js";
import { serializeImage } from "../../serializers/db.serializer.js";
import { ServerError, log, parseStringifiedUUID } from "../../utils.js";
import { deserializeImage } from "../../deserializers/db.deserializer.js";
export class ImageModel extends BaseModel {
    constructor(imageUrl, imageID) {
        super();
        this.imageUrl = imageUrl;
        this.imageID = imageID;
    }
    static get all() {
        return Promise.resolve([]);
    }
    static display() { }
    static search(imageID, mimeType) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield imagePool.connect();
            try {
                const query = {
                    name: "get_image",
                    text: "SELECT get_image($1)",
                    values: [imageID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const { get_image: resultImage } = rows[0];
                const finalImage = deserializeImage(resultImage, mimeType);
                if (!finalImage)
                    return reject(new ServerError("image could not be processed!", 404));
                resolve(finalImage);
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static replace(imageID, newImageUrl) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield imagePool.connect();
            try {
                const parsedID = parseStringifiedUUID(imageID);
                if (!parsedID)
                    throw new ServerError("invalid image id!", 422);
                const newImageData = serializeImage(newImageUrl);
                // console.log("received image id is ", imageID);
                // console.log("received image url is ", newImageData?.data?.slice(0, 30));
                if (!newImageData)
                    return reject(new ServerError("image format is not supported", 422));
                const { data } = newImageData;
                const query = {
                    name: "upsert_image",
                    text: "SELECT upsert_image($1, $2)",
                    values: [parsedID, data],
                };
                yield client.query(query);
                resolve();
            }
            catch (err) {
                log(" error received is ", (typeof err === 'string' ? err : err instanceof Error ? err.message : "unknown"));
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static delete(imageID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield imagePool.connect();
            try {
                const parsedID = parseStringifiedUUID(imageID);
                if (!parsedID)
                    throw new ServerError("invalid image id!", 402);
                const query = {
                    name: "delete_image",
                    text: "SELECT delete_image($1)",
                    values: [imageID],
                };
                yield client.query(query);
                resolve();
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    search(imageID, mimeType) {
        if (!mimeType)
            return Promise.reject(new ServerError("no mimetype included in the request body!", 400));
        const parsedID = parseStringifiedUUID(imageID);
        if (!parsedID)
            return Promise.reject(new ServerError("invalid image id!", 402));
        return ImageModel.search(imageID, mimeType);
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield imagePool.connect();
                try {
                    const parsedID = parseStringifiedUUID(this.imageID);
                    if (!parsedID)
                        throw new ServerError("invalid image id!", 402);
                    const newImageData = serializeImage(this.imageUrl);
                    if (!newImageData)
                        return reject(new ServerError("image format is not supported", 422));
                    const { data } = newImageData;
                    const query = {
                        name: "create_image",
                        text: "SELECT create_image($1, $2)",
                        values: [data, this.imageID],
                    };
                    yield client.query(query);
                    resolve();
                }
                catch (err) {
                    reject(err);
                }
                finally {
                    client.release();
                }
            }));
        });
    }
    get all() {
        try {
            return Promise.resolve([]);
        }
        catch (err) {
            return [];
        }
    }
}
