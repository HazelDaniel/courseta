var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { BaseModel } from "./base-model.js";
import { pool } from "../../db.js";
import chalk from "chalk";
export class QuestionModel extends BaseModel {
    constructor(questionText, points, positionID, assessmentID, assessmentType, questionID, grandParentEntityID) {
        super();
        this.questionText = questionText;
        this.points = points;
        this.positionID = positionID;
        this.assessmentID = assessmentID;
        this.assessmentType = assessmentType;
        this.questionID = questionID;
        this.grandParentEntityID = grandParentEntityID;
    }
    static search(questionID) {
        return Promise.resolve({});
    }
    get all() {
        return [];
    }
    search(questionID) {
        return null;
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!QuestionModel.assessmentID)
                QuestionModel.assessmentID = this.assessmentID;
            if (!QuestionModel.grandParentEntityID)
                QuestionModel.grandParentEntityID = this.grandParentEntityID;
            if (!QuestionModel.assessmentType)
                QuestionModel.assessmentType = this.assessmentType;
            QuestionModel.questionsData = [
                ...(QuestionModel.questionsData || []),
                this,
            ];
        });
    }
    static saveAll() {
        return __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                let query;
                // console.log("grandparent entity id is ", this.grandParentEntityID);
                // console.log("assessment id is ", this.assessmentID);
                const values = [
                    this.grandParentEntityID,
                    this.assessmentID,
                    JSON.stringify(this.questionsData || []),
                    JSON.stringify(this.answersData || []),
                    this.trashQuestionIDList || [],
                ];
                // console.log("input values are ");
                // console.log(values);
                query = {
                    name: "update_assessment",
                    text: "SELECT update_assessment($1, $2, $3, $4, $5)",
                    values: values,
                };
                yield client.query(query);
            }
            catch (err) {
                console.error(`${chalk.red("QUERY_ERR:")} could not create question(s)!. reason: ${err}`);
                throw new Error(err);
            }
            finally {
                this.assessmentID = undefined;
                this.assessmentType = undefined;
                this.questionsData = [];
                this.answersData = [];
                this.trashQuestionIDList = [];
                client.release();
            }
        });
    }
    static delete(assessmentID, questionIDs, assessmentType) {
        return __awaiter(this, void 0, void 0, function* () {
            return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
                const client = yield pool.connect();
                try {
                    const values = [assessmentID, questionIDs, assessmentType];
                    // console.log("input values are ");
                    // console.log(values);
                    const query = {
                        name: "remove_questions_from_assessment",
                        text: "SELECT remove_questions_from_assessment($1, $2, $3)",
                        values,
                    };
                    yield client.query(query);
                    resolve();
                }
                catch (err) {
                    console.error(`${chalk.red("QUERY_ERR:")} could not delete question(s)!. reason: ${err}`);
                    reject(new Error(err));
                }
                finally {
                    client.release();
                }
            }));
        });
    }
    static getQuestionsFor(assessmentID) {
        return new Promise((resolve, reject) => __awaiter(this, void 0, void 0, function* () {
            const client = yield pool.connect();
            try {
                const questionsQuery = {
                    name: "get_assessment_questions",
                    text: "SELECT * FROM get_assessment_questions($1)",
                    values: [assessmentID],
                };
                const questionsReq = yield client.query(questionsQuery);
                const { rows } = questionsReq;
                const resQuestions = rows.map((question) => {
                    let { answers, points, question_id, question_text } = question;
                    return {
                        id: question_id.toString(),
                        question: question_text,
                        points,
                        options: answers,
                    };
                });
                resolve(resQuestions || []);
            }
            catch (err) {
                reject(err);
            }
            finally {
                client.release();
            }
        }));
    }
    static trashData(newQuestionID) {
        var _a;
        if (!this.trashQuestionIDList)
            this.trashQuestionIDList = [];
        (_a = this.trashQuestionIDList) === null || _a === void 0 ? void 0 : _a.push(newQuestionID);
    }
    set answersData(newAnswerData) {
        QuestionModel.answersData = [
            ...(QuestionModel.answersData || []),
            newAnswerData,
        ];
    }
}
QuestionModel.assessmentType = undefined;
