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
import { BoardDisplay } from "../../utils.js";
export class LessonModel extends BaseModel {
    constructor(title, positionID, courseID, lessonData, lessonID) {
        super();
        this.title = title;
        this.positionID = positionID;
        this.courseID = courseID;
        this.lessonData = lessonData;
        this.lessonID = null;
        if (lessonID)
            this.lessonID = lessonID;
    }
    static all() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                resolve([]);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch lessons!. reason: ${err}`);
                reject();
            }
            finally {
                client.release();
            }
        }));
    }
    static display(CourseOutline) {
        const { level1Nest, level3Nest, border, marginDecoratorCount } = BoardDisplay;
        const { detail, lessons } = CourseOutline;
        console.log("");
        console.log(`${chalk.green("<>".repeat(marginDecoratorCount))}`);
        console.log(level1Nest, chalk.cyan("[COURSE]\n"));
        console.log(`${border}${level1Nest} title: ${detail.title}`);
        console.log(`${border}${level1Nest} length: ${detail.courseLength}s long`);
        console.log(`${border}${level1Nest} description: ${detail.description}`);
        console.log(`${border}${level1Nest} ratings: ${detail.averageRating} (${detail.reviewCount})`);
        console.log(chalk.overline(`${border}${level3Nest} last updated: ${detail.updatedAt}`));
        console.log(chalk.overline(`${border}${level3Nest} members enrolled: ${detail.studentCount}`));
        console.log(level1Nest, chalk.cyan("[OUTLINE]\n"));
        lessons.forEach((entry) => {
            var _a;
            console.log(chalk.overline(`${border}${level1Nest} ${entry.title} || (${entry.contentCount} contents) ${entry.duration}s long`), entry.quiz
                ? chalk.overline(`${border}${level1Nest} [QUIZ]: ${(_a = entry.quiz) === null || _a === void 0 ? void 0 : _a.title} || (${entry.quiz.totalPoints} points)`)
                : ""
            // chalk.overline(
            //   `${border}${level1Nest} [QUIZ]: ${entry.quizTitle} || (${entry.totalPoints} points)`
            // )
            );
        });
        console.log(`${chalk.green("<>".repeat(marginDecoratorCount))}`);
        console.log("");
    }
    static search(lessonID) {
        return Promise.resolve({});
    }
    static getContentsFor(lessonID) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    const contentsQuery = {
                        name: "get_lesson_contents",
                        text: "SELECT * FROM get_lesson_contents($1)",
                        values: [lessonID],
                    };
                    const resContents = yield client.query(contentsQuery);
                    const { rows } = resContents;
                    const lessonContents = rows.map((content) => {
                        const { content_type, href, id, title, duration } = content;
                        return {
                            href,
                            id,
                            title,
                            duration,
                            type: content_type,
                        };
                    });
                    resolve(lessonContents);
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
    static saveAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                let query;
                const values = [
                    this.courseID,
                    JSON.stringify(this.lessonData),
                    JSON.stringify(this.lessonQuizData),
                    JSON.stringify(this.lessonContentData),
                ];
                // console.log("input values are ");
                // console.log(values);
                query = {
                    name: "add_lessons_to_course",
                    text: "SELECT add_lessons_to_course($1, $2, $3, $4)",
                    values: values,
                };
                const res = yield client.query(query);
                const lessonIDArray = res.rows[0].add_lessons_to_course;
                return lessonIDArray;
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not create lesson(s)!. reason: ${err}`);
                throw new Error(err);
            }
            finally {
                this.courseID = null;
                this.lessonData = [];
                this.lessonQuizData = [];
                this.lessonContentData = [];
                client.release();
            }
        });
    }
    static delete(lessonID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "remove_lesson",
                    text: "CALL remove_lesson($1)",
                    values: [lessonID],
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
    get all() {
        return [];
    }
    search(lessonID) {
        return null;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!LessonModel.courseID)
                LessonModel.courseID = this.courseID;
            LessonModel.lessonData = [...(LessonModel.lessonData || []), this];
        });
    }
    addQuiz(title, description, passScore) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    if (!this.lessonID)
                        reject(new Error("lesson ID not provided!"));
                    const query = {
                        name: "add_quiz_to_lesson",
                        text: "SELECT * FROM add_quiz_to_lesson($1, $2, $3, $4)",
                        values: [this.lessonID, title, description, passScore],
                    };
                    const res = yield client.query(query);
                    const { rows } = res;
                    const { add_quiz_to_lesson: quizID } = rows[0];
                    resolve(quizID);
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
    addContent(title, href, duration, contentType) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    if (!this.lessonID)
                        reject(new Error("lesson ID not provided!"));
                    const query = {
                        name: "add_content_to_lesson",
                        text: "SELECT * FROM add_content_to_lesson($1, $2, $3, $4, $5)",
                        values: [this.lessonID, title, href, contentType, duration],
                    };
                    const res = yield client.query(query);
                    const { rows } = res;
                    const { add_content_to_lesson: contentID } = rows[0];
                    resolve(contentID);
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
    set lessonContentData(newLessonContentData) {
        LessonModel.lessonContentData = [
            ...(LessonModel.lessonContentData || []),
            newLessonContentData,
        ];
    }
    set lessonQuizData(newLessonQuizData) {
        LessonModel.lessonQuizData = [
            ...(LessonModel.lessonQuizData || []),
            newLessonQuizData,
        ];
    }
}
