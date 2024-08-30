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
export class ReviewModel extends BaseModel {
    constructor(studentID, courseID, rating, reviewText) {
        super();
        this.studentID = studentID;
        this.courseID = courseID;
        this.rating = rating;
        this.reviewText = reviewText;
    }
    static get all() {
        return Promise.resolve([]);
    }
    static display() { }
    static search(_1) {
        return Promise.resolve({});
    }
    search(reviewID) {
        try {
            return ReviewModel.search(reviewID);
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
                    name: "review_course_for_student",
                    text: "SELECT review_course_for_student($1, $2, $3, $4)",
                    values: [this.studentID, this.courseID, this.rating, this.reviewText],
                };
                yield client.query(query);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not review course!. reason: ${err}`);
                throw new Error(err);
            }
            finally {
                client.release();
            }
        });
    }
    get all() {
        try {
            return ReviewModel.all;
        }
        catch (err) {
            return [];
        }
    }
}
