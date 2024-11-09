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
import { ServerError, hashPassword, } from "../../utils.js";
import { log } from "../../api/v2/utils/utils.js";
import { UserModel } from "./user.model.js";
import { randomUUID } from "crypto";
import { deserializeImage } from "../../deserializers/db.deserializer.js";
import v1Config from "../../api/v1/config.js";
export class StudentModel extends UserModel {
    constructor(email, password, firstName, lastName, avatarUrl, avatarID, verificationID) {
        super();
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.avatarUrl = avatarUrl;
        this.avatarID = avatarID;
        this.verificationID = verificationID;
        this.studentID = null;
        this.rank = null;
        this.points = null;
        this.role = null;
    }
    static get all() {
        const fetchAllStudents = () => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_all_students",
                    text: "SELECT student_id, rank, points, email, role, translate(encode(avatar, 'base64'), E' \\t\\n\\r', '') avatar, avatar_meta FROM students",
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resStudents = rows.map((el) => {
                    const { avatar, email, points, rank, role, student_id: studentID, avatar_meta, } = el;
                    return {
                        studentID,
                        email,
                        rank,
                        points: +points,
                        role,
                        avatarUrl: deserializeImage(avatar, avatar_meta.mime_type) || "",
                    };
                });
                return resStudents;
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch students!. reason: ${err}`);
                throw err;
            }
            finally {
                client.release();
            }
        });
        return fetchAllStudents();
    }
    get all() {
        return Promise.resolve([]);
    }
    static lookUp(studentEmail) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_current_student_validate",
                    text: "SELECT * FROM get_current_student_validate($1)",
                    values: [studentEmail],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resStudent = rows.map((el) => {
                    const { student_id, password, salt } = el;
                    return {
                        id: student_id,
                        password,
                        salt,
                        role: "student",
                    };
                })[0];
                resolve(resStudent);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch student for validation!. reason: ${err}`);
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    lookUp(studentEmail) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const res = yield StudentModel.lookUp(studentEmail);
                return res;
            }
            catch (err) {
                throw err;
            }
        });
    }
    static getProfile(studentEmail) {
        const fetchStudent = () => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_current_student",
                    text: "SELECT * FROM get_current_student($1)",
                    values: [studentEmail],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const resStudent = rows.map((el) => {
                    const { student_id: id, rank, points, role, avatar, avatar_meta, created_at, email, first_name, last_name, } = el;
                    return {
                        rank,
                        points: +points,
                        role: role,
                        avatar: deserializeImage(avatar, avatar_meta.mime_type || "") || "",
                        avatarMeta: avatar_meta,
                        createdAt: created_at,
                        email,
                        firstName: first_name,
                        lastName: last_name,
                        id,
                    };
                })[0];
                return resStudent;
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch student!. reason: ${err}`);
                throw err;
            }
            finally {
                client.release();
            }
        });
        return fetchStudent();
    }
    getProfile(studentEmail) {
        try {
            return StudentModel.getProfile(studentEmail);
        }
        catch (err) {
            return null;
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                if (!this.verificationID) {
                    reject(new ServerError("no verification id provided!", 401));
                    return;
                }
                try {
                    const saltUsed = randomUUID();
                    const hashedPassword = yield hashPassword(this.password, saltUsed);
                    const query = {
                        name: "set_new_student",
                        text: "SELECT set_new_student($1, $2, $3, $4, $5, $6)",
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
                    log("result is ", result);
                    this.role = "student";
                    resolve(result.set_new_student);
                    if (v1Config.serverOptions.debugMode)
                        this.show();
                }
                catch (err) {
                    log(`${chalk.red("QUERY_ERR:")} could not create student!. reason: ${err}`);
                    reject(new ServerError(err instanceof Error
                        ? err.message
                        : typeof err === "string"
                            ? err
                            : "could not register student!", 401));
                }
                finally {
                    client.release();
                }
            }));
        });
    }
}
