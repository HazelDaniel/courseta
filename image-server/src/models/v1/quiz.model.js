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
export class QuizModel extends AssessmentModel {
    constructor(quizTitle, description, passScore, lessonPositionID, parentEntityID) {
        super(passScore, description, "quiz", undefined, undefined, undefined, parentEntityID);
        this.quizTitle = quizTitle;
        this.description = description;
        this.passScore = passScore;
        this.lessonPositionID = lessonPositionID;
        this.parentEntityID = parentEntityID;
        this.quizID = null;
    }
    static all() {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                resolve([]);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not fetch quizzes!. reason: ${err}`);
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
                        name: "get_quiz",
                        text: "SELECT * FROM get_quiz($1)",
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
                        const { description, pass_score, question_count, total_points, quiz_title, } = assessment;
                        return {
                            description,
                            passScore: pass_score,
                            questionCount: question_count,
                            totalPoints: total_points,
                            title: quiz_title,
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
                    name: "get_quiz",
                    text: "SELECT * FROM get_quiz($1)",
                    values: [assessmentID],
                };
                const assessmentPromise = client.query(assessmentQuery);
                const assessmentDataResult = yield assessmentPromise;
                const assessmentRes = assessmentDataResult;
                const { rows: assessmentRows } = assessmentRes;
                const resAssessmentArray = assessmentRows.map((assessment) => {
                    const { description, pass_score, question_count, total_points, quiz_title, } = assessment;
                    return {
                        description,
                        passScore: pass_score,
                        questionCount: question_count,
                        totalPoints: total_points,
                        title: quiz_title,
                        id: assessmentID
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
    static delete(lessonID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const query = {
                    name: "remove_quiz_from_lesson",
                    text: "CALL remove_quiz_from_lesson($1)",
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
    search(quizID) {
        return null;
    }
    get all() {
        return [];
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
