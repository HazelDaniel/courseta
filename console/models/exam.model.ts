import { pool } from "../db.js";
import chalk from "chalk";
import { AssessmentModel } from "./assessment.model.js";
import { QueryConfig, QueryResult } from "pg";
import { AssessmentInputType, AssessmentVariantType } from "../types.js";
import { QuestionModel } from "./question.model.js";
import { AnswerModel } from "./answer.model.js";

export class ExamModel extends AssessmentModel {
  constructor(
    public parentEntityID: number,
    public passScore: number,
    public description: string,
    public duration: number,
    public startDate: string,
    public endDate: string,
    public type: AssessmentVariantType = "exam"
  ) {
    super(passScore, description, type, parentEntityID);
  }

  static all(): Promise<object[]> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        resolve([]);
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not fetch exams!. reason: ${err}`
        );
        reject();
      } finally {
        client.release();
      }
    });
  }

  static search(assessmentID: string | null) {
    return Promise.resolve({});
  }

  get all() {
    return [];
  }

  search(assessmentID: string | null) {
    return null;
  }

  set questionData(newQuestionData: QuestionModel) {
    this.questionDataList?.push(newQuestionData);
  }

  set answerData(newAnswerData: AnswerModel) {
    this.answerDataList?.push(newAnswerData);
  }
}
