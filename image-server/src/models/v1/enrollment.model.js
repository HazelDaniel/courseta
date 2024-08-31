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
export class EnrollmentModel extends BaseModel {
    constructor(studentID, courseID) {
        super();
        this.studentID = studentID;
        this.courseID = courseID;
    }
    static delete(studentID, courseID) {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const status = yield this.confirmEnrollment(studentID, courseID);
                if (!status) {
                    throw new Error("student isn't enrolled. so, can't unenroll");
                }
                const query = {
                    name: "unenroll_student_from_course",
                    text: "SELECT * FROM unenroll_student_from_course($1, $2)",
                    values: [studentID, courseID],
                };
                yield client.query(query);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not unenroll student!. reason: ${err}`);
                throw new Error(err);
            }
            finally {
                client.release();
            }
        });
    }
    static all(studentID) {
        return [];
    }
    static confirmEnrollment(studentID, courseID) {
        const searchStudentEnrollment = () => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            if (!studentID)
                return false;
            try {
                const query = {
                    name: "is_student_enrolled",
                    text: "SELECT * FROM is_student_enrolled($1, $2)",
                    values: [studentID, courseID],
                };
                const res = yield client.query(query);
                const status = res.rows[0];
                const { is_enrolled } = status;
                return !!+is_enrolled;
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not get confirm enrollment!. reason: ${err}`);
                throw new Error(err);
            }
            finally {
                client.release();
            }
        });
        return searchStudentEnrollment();
    }
    static search(_1, _2) {
        return Promise.resolve({});
    }
    search(_1) {
        try {
            return null;
        }
        catch (err) {
            return null;
        }
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "enroll_student_to_course",
                    text: "SELECT * FROM enroll_student_to_course($1, $2)",
                    values: [this.studentID, this.courseID],
                };
                const res = yield client.query(query);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not enroll student to course!. reason: ${err}`);
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
