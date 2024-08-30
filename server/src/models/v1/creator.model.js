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
import { UserModel } from "./user.model.js";
import { randomUUID } from "crypto";
import { deserializeImage } from "../../deserializers/db.deserializer.js";
import { ServerError, hashPassword } from "../../utils.js";
import v1Config from "../../api/v1/config.js";
export class CreatorModel extends UserModel {
    constructor(email, password, firstName, lastName, avatarUrl, avatarID, verificationID) {
        super();
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatarUrl = avatarUrl;
        this.avatarID = avatarID;
        this.verificationID = verificationID;
        this.creatorID = null;
        this.points = null;
        this.role = null;
        this.creatorPass = null;
    }
    static all(studentID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                let query;
                if (studentID) {
                    query = {
                        name: "get_creator_summaries_for_student",
                        text: "SELECT * FROM get_creator_summaries_for_student($1)",
                        values: [studentID],
                    };
                }
                else {
                    query = {
                        name: "get_creator_summaries",
                        text: "SELECT * FROM get_creator_summaries()",
                    };
                }
                const res = yield client.query(query);
                const { rows } = res;
                const resCreators = rows.map((el) => {
                    const { avatar_url: avatarUrl, average_course_rating, course_count, course_review_count, creator_id: creatorID, email, first_name: firstName, last_name: lastName, student_count, avatar_meta, } = el;
                    return {
                        creatorID,
                        avatarUrl: deserializeImage(avatarUrl, avatar_meta.mime_type) || "",
                        averageCourseRating: +average_course_rating,
                        courseCount: +course_count,
                        courseReviewCount: +course_review_count,
                        email,
                        firstName,
                        lastName,
                        studentCount: +student_count,
                    };
                });
                resolve(resCreators);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch creators!. reason: ${err}`);
                reject();
            }
            finally {
                client.release();
            }
        }));
    }
    get all() {
        return Promise.resolve([]);
    }
    static lookUp(creatorEmail) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_current_creator_validate",
                    text: "SELECT * FROM get_current_creator_validate($1)",
                    values: [creatorEmail],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resCreator = rows.map((el) => {
                    const { creator_id, creator_pass, password, salt } = el;
                    return {
                        id: creator_id,
                        password,
                        creatorPass: creator_pass,
                        salt,
                        role: "creator",
                    };
                })[0];
                resolve(resCreator);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch creator for validation!. reason: ${err}`);
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    lookUp(creatorEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            const res = yield CreatorModel.lookUp(creatorEmail);
            return res;
        });
    }
    static getProfile(creatorEmail) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_current_creator",
                    text: "SELECT * FROM get_current_creator($1)",
                    values: [creatorEmail],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resCreators = rows.map((el) => {
                    const { creator_id, email, role, avatar, avatar_meta, first_name, last_name, course_review_count, student_count, course_count, average_course_rating, created_at, } = el;
                    return {
                        avatar: deserializeImage(avatar, avatar_meta.mime_type || ""),
                        avatarMeta: avatar_meta,
                        averageCourseRating: average_course_rating,
                        courseCount: course_count,
                        courseReviewCount: course_review_count,
                        createdAt: created_at,
                        email,
                        firstName: first_name,
                        id: creator_id,
                        lastName: last_name,
                        role,
                        studentCount: student_count,
                    };
                })[0];
                resolve(resCreators);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch creator!. reason: ${err}`);
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static search(id, role) {
        return __awaiter(this, void 0, void 0, function* () {
            return UserModel.search(id, role);
        });
    }
    static requestPass(creatorID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "request_new_creator_pass",
                    text: "SELECT request_new_creator_pass($1)",
                    values: [creatorID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const { request_new_creator_pass: resultPass } = rows[0];
                resolve(resultPass);
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    getProfile(creatorEmail) {
        try {
            return CreatorModel.getProfile(creatorEmail);
        }
        catch (err) {
            return null;
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                if (!this.verificationID) {
                    reject(new ServerError("no verification id provided!", 401));
                    return;
                }
                const client = yield pool.connect();
                try {
                    const saltUsed = randomUUID();
                    const hashedPassword = yield hashPassword(this.password, saltUsed);
                    const query = {
                        name: "set_new_creator",
                        text: "SELECT set_new_creator($1, $2, $3, $4, $5, $6)",
                        values: [
                            this.email,
                            this.firstName,
                            this.lastName,
                            hashedPassword,
                            saltUsed,
                            this.verificationID,
                        ],
                    };
                    const res = yield client.query(query);
                    const { rows } = res;
                    const [result] = rows;
                    resolve(result.set_new_creator);
                    if (v1Config.serverOptions.debugMode)
                        this.show();
                }
                catch (err) {
                    console.error(`${chalk.red("QUERY_ERR:")} could not create creator!. reason: ${err}`);
                    reject(new ServerError(err instanceof Error
                        ? err.message
                        : typeof err === "string"
                            ? err
                            : "could not register creator!", 401));
                }
                finally {
                    client.release();
                }
            }));
        });
    }
    static delete(courseID, creatorID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    const query = {
                        name: "delete_course_if_creator_is",
                        text: "SELECT p_02_delete_course_if_creator_is($1, $2)",
                        values: [courseID, creatorID],
                    };
                    yield client.query(query);
                    resolve();
                }
                catch (err) {
                    console.error(`${chalk.red("QUERY_ERR:")} could not delete course!. reason: ${err}`);
                    client.release();
                    reject(err);
                }
            }));
        });
    }
}
