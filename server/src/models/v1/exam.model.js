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
import { AssessmentModel } from "./assessment.model.js";
export class ExamModel extends AssessmentModel {
    constructor(parentEntityID, passScore, description, duration, startDate, endDate, type = "exam") {
        super(passScore, description, type, parentEntityID);
        this.parentEntityID = parentEntityID;
        this.passScore = passScore;
        this.description = description;
        this.duration = duration;
        this.startDate = startDate;
        this.endDate = endDate;
        this.type = type;
    }
    static all() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                resolve([]);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch exams!. reason: ${err}`);
                reject();
            }
            finally {
                client.release();
            }
        }));
    }
    static search(assessmentID, mode) {
        if (mode === "edit")
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    const questionsQuery = {
                        name: "get_assessment_questions",
                        text: "SELECT * FROM get_assessment_questions($1)",
                        values: [assessmentID],
                    };
                    const assessmentQuery = {
                        name: "get_exam",
                        text: "SELECT * FROM get_exam($1)",
                        values: [assessmentID],
                    };
                    const questionsPromise = client.query(questionsQuery);
                    const assessmentPromise = client.query(assessmentQuery);
                    const assessmentDataResult = yield Promise.all([
                        assessmentPromise,
                        questionsPromise,
                    ]);
                    const [assessmentRes, questionsRes] = assessmentDataResult;
                    const { rows } = questionsRes;
                    const { rows: assessmentRows } = assessmentRes;
                    const resQuestions = rows.map((question) => {
                        const { answers, points, question_id, question_text } = question;
                        return {
                            id: question_id.toString(),
                            question: question_text,
                            points,
                            options: answers,
                        };
                    });
                    const resAssessmentArray = assessmentRows.map((assessment) => {
                        const { description, duration, end_date, pass_score, question_count, start_date, total_points, } = assessment;
                        return {
                            description,
                            duration,
                            endDate: end_date,
                            passScore: pass_score,
                            startDate: start_date,
                            questionCount: question_count,
                            totalPoints: total_points,
                            ready: new Date(start_date).getTime() - new Date().getTime() <= 0,
                        };
                    });
                    const [resultAssessment] = resAssessmentArray;
                    resolve(Object.assign(Object.assign({}, resultAssessment), { questions: resQuestions }));
                }
                catch (err) {
                    reject(err);
                }
                finally {
                    client.release();
                }
            }));
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const assessmentQuery = {
                    name: "get_exam",
                    text: "SELECT * FROM get_exam($1)",
                    values: [assessmentID],
                };
                const assessmentPromise = client.query(assessmentQuery);
                const assessmentDataResult = yield assessmentPromise;
                const assessmentRes = assessmentDataResult;
                const { rows: assessmentRows } = assessmentRes;
                const resAssessmentArray = assessmentRows.map((assessment) => {
                    const { description, duration, end_date, pass_score, question_count, start_date, total_points, } = assessment;
                    return {
                        description,
                        duration,
                        endDate: end_date,
                        passScore: pass_score,
                        startDate: start_date,
                        questionCount: question_count,
                        totalPoints: total_points,
                        ready: new Date(start_date).getTime() - new Date().getTime() <= 0,
                    };
                });
                const [resultAssessment] = resAssessmentArray;
                resolve(resultAssessment);
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static delete(courseID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "remove_exam_from_course",
                    text: "CALL remove_exam_from_course($1)",
                    values: [courseID],
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
    static fetchForEdit(courseID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_course_exam_for_creator_edit",
                    text: "SELECT * FROM get_course_exam_for_creator_edit($1)",
                    values: [courseID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                if (!rows.length)
                    resolve(null);
                const { duration, start_date, end_date, pass_score, exam_id } = rows[0];
                console.log("time delta is ", new Date(start_date).getTime() - new Date().getTime());
                const resExamData = {
                    duration,
                    startDate: start_date,
                    endDate: end_date,
                    passScore: pass_score,
                    id: exam_id,
                    ready: new Date(start_date).getTime() - new Date().getTime() <= 0,
                };
                resolve(resExamData);
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
    search(assessmentID) {
        return null;
    }
    set questionData(newQuestionData) {
        var _a;
        (_a = this.questionDataList) === null || _a === void 0 ? void 0 : _a.push(newQuestionData);
    }
    set answerData(newAnswerData) {
        var _a;
        (_a = this.answerDataList) === null || _a === void 0 ? void 0 : _a.push(newAnswerData);
    }
}
