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
import { log } from "../../utils.js";
export class AssessmentModel extends BaseModel {
    constructor(passScore, description, type, duration, startDate, endDate, parentEntityID) {
        super();
        this.passScore = passScore;
        this.description = description;
        this.type = type;
        this.duration = duration;
        this.startDate = startDate;
        this.endDate = endDate;
        this.parentEntityID = parentEntityID;
        this.assessmentID = null;
        this.quizTitle = undefined;
        this.questionDataList = null;
        this.answerDataList = null;
        this.trashQuestionIDList = null;
        this.questionDataList = [];
        this.answerDataList = [];
        this.trashQuestionIDList = [];
    }
    static all() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                resolve([]);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch assessments!. reason: ${err}`);
                reject();
            }
            finally {
                client.release();
            }
        }));
    }
    static search(assessmentID) {
        return Promise.resolve({});
    }
    static getAssessmentsReportFor(studentID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "get_student_assessment_results",
                    text: "SELECT get_student_assessment_results($1)",
                    values: [studentID],
                };
                const res = yield client.query(query);
                const { rows } = res;
                const { get_student_assessment_results } = rows[0];
                const { exams, quizzes } = get_student_assessment_results;
                log({ exams: exams || [], quizzes: quizzes || [] });
                resolve({ exams: exams || [], quizzes: quizzes || [] });
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static fetchForCourseEdit(assessmentID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const questionsQuery = {
                    name: "get_assessment_questions_tree_for_creator_edit",
                    text: "SELECT * FROM get_assessment_questions_tree_for_creator_edit($1)",
                    values: [assessmentID],
                };
                const assessmentQuery = {
                    name: "get_assessment_for_creator_edit",
                    text: "SELECT * FROM get_assessment_for_creator_edit($1)",
                    values: [assessmentID],
                };
                const questionsReq = yield client.query(questionsQuery);
                const assessmentReq = yield client.query(assessmentQuery);
                const { rows } = questionsReq;
                const { rows: assessmentRows } = assessmentReq;
                const resAssessment = assessmentRows[0];
                const resQuestions = rows.map((question) => {
                    let { answers, points, question_id, question_text } = question;
                    return {
                        id: question_id.toString(),
                        question: question_text,
                        points,
                        options: answers,
                    };
                });
                resolve(Object.assign({
                    parentID: resAssessment.parent_id,
                    assessmentType: resAssessment.assessment_type,
                }, { questions: resQuestions }));
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static submit(studentID, assessmentID, questionIDList, answerList, submissionTime, assessmentType) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            let client = yield pool.connect();
            // const client1 = new dbClient();
            try {
                // await client1.connect();
                // await client1.query(`LISTEN notice`);
                const submissionValues = [
                    studentID,
                    assessmentID,
                    questionIDList || [],
                    JSON.stringify(answerList || []),
                    submissionTime,
                    assessmentType,
                ];
                // log("submission payload is ", submissionValues);
                // resolve();
                // return;
                const query = {
                    name: "submit_assessment_for_student",
                    text: "SELECT submit_assessment_for_student($1, $2, $3, $4, $5, $6);",
                    values: submissionValues,
                };
                yield client.query(query);
                resolve();
            }
            catch (err) {
                reject(err);
            }
            finally {
                // client1.end();
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
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                var _a, _b;
                const client = yield pool.connect();
                try {
                    const emptyAssessment = {
                        description: this.description,
                        duration: this.duration,
                        startDate: this.startDate,
                        endDate: this.endDate,
                        passScore: this.passScore,
                        quizTitle: this.quizTitle, //support quiz title inclusion
                    };
                    const inputValues = [
                        this.parentEntityID,
                        JSON.stringify(emptyAssessment),
                        ((_a = this.questionDataList) === null || _a === void 0 ? void 0 : _a.length)
                            ? JSON.stringify(this.questionDataList)
                            : null,
                        ((_b = this.answerDataList) === null || _b === void 0 ? void 0 : _b.length)
                            ? JSON.stringify(this.answerDataList)
                            : null,
                        this.type,
                    ];
                    // console.log("input values are : ");
                    // console.log(inputValues);
                    const query = {
                        name: "create_assessment",
                        text: "SELECT * FROM create_assessment($1, $2, $3, $4, $5)",
                        values: inputValues,
                    };
                    const res = yield client.query(query);
                    const { create_assessment: createdAssessmentID } = res.rows[0];
                    resolve(createdAssessmentID);
                }
                catch (err) {
                    console.error(`${chalk.red("QUERY_ERR:")} could not create assessment!. reason: ${err}`);
                    reject(new Error(err));
                }
                finally {
                    client.release();
                }
            }));
        });
    }
    set trashQuestionData(newQuestionID) {
        var _a;
        (_a = this.trashQuestionIDList) === null || _a === void 0 ? void 0 : _a.push(newQuestionID);
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
