import type { CourseOutlineViewType, CourseViewType } from "./../types.d";
import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { QueryConfig, QueryResult } from "pg";
import { BoardDisplay, ConsoleLogger } from "../utils.js";
import { QuestionModel } from "./question.model.js";
import { AnswerModel } from "./answer.model.js";
import { AssessmentModel } from "./assessment.model.js";

export class QuizModel extends AssessmentModel {
  quizID: string | null = null;

  constructor(
    public readonly quizTitle: string,
    public description: string,
    public passScore: number,
    public lessonPositionID?: number,
    public parentEntityID?: number
  ) {
    super(passScore, description, "quiz", undefined, undefined, undefined, parentEntityID as number);
  }

  static all(): Promise<CourseViewType[]> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        resolve([]);
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not fetch quizzes!. reason: ${err}`
        );
        reject();
      } finally {
        client.release();
      }
    });
  }

  static search(quizID: string | null) {
    return Promise.resolve({});
  }

  search(quizID: string | null) {
    return null;
  }

  get all() {
    return [];
  }

  set questionData(newQuestionData: QuestionModel) {
    this.questionDataList?.push(newQuestionData);
  }

  set answerData(newAnswerData: AnswerModel) {
    this.answerDataList?.push(newAnswerData);
  }
}
