import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import { AnswerModel } from "./answer.model.js";
import { QuestionModel } from "./question.model.js";
import { AssessmentVariantType, AssessmentInputType } from "../types.js";
import { QueryConfig, QueryResult } from "pg";

export class AssessmentModel extends BaseModel<void> {
  assessmentID: string | null = null;
  quizTitle: string | undefined = undefined;
  questionDataList: QuestionModel[] | null = null;
  answerDataList: AnswerModel[] | null = null;

  constructor(
    public passScore: number,
    public description: string,
    public type: AssessmentVariantType,

    public duration?: number,
    public startDate?: string,
    public endDate?: string,
    public parentEntityID?: number,
  ) {
    super();
    this.questionDataList = [];
    this.answerDataList = [];
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
          )} could not fetch assessments!. reason: ${err}`
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

  async save() {
    return new Promise<string>(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const emptyAssessment: Partial<AssessmentInputType> = {
          description: this.description,
          duration: this.duration,
          startDate: this.startDate,
          endDate: this.endDate,
          passScore: this.passScore,
          quizTitle: this.quizTitle, //support quiz title inclusion
        };

        const inputValues: [
          number,
          string | null,
          string | null,
          string | null,
          AssessmentVariantType
        ] = [
          this.parentEntityID as number,
          JSON.stringify(emptyAssessment),
          this.questionDataList?.length
            ? JSON.stringify(this.questionDataList)
            : null,
          this.answerDataList?.length
            ? JSON.stringify(this.answerDataList)
            : null,
          this.type,
        ];

        // console.log("input values are : ");
        // console.log(inputValues);

        const query: QueryConfig<
          [
            number,
            string | null,
            string | null,
            string | null,
            AssessmentVariantType
          ]
        > = {
          name: "create_assessment",
          text: "SELECT * FROM create_assessment($1, $2, $3, $4, $5)",
          values: inputValues,
        };

        const res: QueryResult<{ create_assessment: string }> =
          await client.query(query);
        const { create_assessment: createdAssessmentID } = res.rows[0];

        resolve(createdAssessmentID);
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not create assessment!. reason: ${err}`
        );
        reject(new Error(err as string));
      } finally {
        client.release();
      }
    });
  }

  set questionData(newQuestionData: QuestionModel) {
    this.questionDataList?.push(newQuestionData);
  }

  set answerData(newAnswerData: AnswerModel) {
    this.answerDataList?.push(newAnswerData);
  }
}
