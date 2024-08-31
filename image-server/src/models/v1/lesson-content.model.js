var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from "../../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
export class LessonContentModel extends BaseModel {
    constructor(title, href, contentType, duration, lessonPositionID) {
        super();
        this.title = title;
        this.href = href;
        this.contentType = contentType;
        this.duration = duration;
        this.lessonPositionID = lessonPositionID;
        this.lessonContentID = null;
    }
    static all() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                resolve([]);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch lesson contents!. reason: ${err}`);
                reject();
            }
            finally {
                client.release();
            }
        }));
    }
    static search(lessonContentID) {
        return Promise.resolve({});
    }
    static delete(lessonID, contentID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "remove_content_from_lesson",
                    text: "CALL remove_content_from_lesson($1, $2)",
                    values: [lessonID, contentID],
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
    search(lessonContentID) {
        return null;
    }
    save(lessonID) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            const client = yield pool.connect();
            try {
                if (!lessonID)
                    throw new Error("no lesson id provided!");
                const query = {
                    name: "add_content_to_lesson",
                    text: "SELECT add_content_to_lesson($1, $2, $3, $4, $5)",
                    values: [
                        lessonID,
                        this.title || null,
                        this.href || null,
                        this.contentType || null,
                        (_a = this.duration) !== null && _a !== void 0 ? _a : null,
                    ],
                };
                const contentRes = yield client.query(query);
                this.show();
                return contentRes;
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not create lesson content!. reason: ${err}`);
                throw new Error(err);
            }
            finally {
                client.release();
            }
        });
    }
    get all() {
        return [];
    }
}
