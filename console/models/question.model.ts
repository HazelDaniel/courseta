import { QueryConfig, QueryResult } from "pg";
import { AnswerModel } from "./answer.model.js";
import { BaseModel } from "./base-model.js";
import { pool } from "../db.js";
import chalk from "chalk";
import { AssessmentVariantType } from "../types.js";

export class QuestionModel extends BaseModel<void> {
  static assessmentID?: string;
  static questionsData?: QuestionModel[];
  static answersData?: AnswerModel[];
  static assessmentType?: AssessmentVariantType = undefined;

  constructor(
    public questionText: string,
    public points: number,
    public positionID?: number,
    public assessmentID?: string,
    public assessmentType?: AssessmentVariantType
  ) {
    super();
  }

  static all(): Promise<object[]> {
    return Promise.resolve([]);
  }

  static search(questionID: string | null) {
    return Promise.resolve({});
  }

  get all() {
    return [];
  }

  search(questionID: string | null) {
    return null;
  }

  async save() {
    if (!QuestionModel.assessmentID)
      QuestionModel.assessmentID = this.assessmentID;
    if (!QuestionModel.assessmentType)
      QuestionModel.assessmentType = this.assessmentType;
    QuestionModel.questionsData = [
      ...(QuestionModel.questionsData || []),
      this,
    ];
  }

  static async saveAll() {
    const client = await pool.connect();
    type Q = QueryConfig<(string | object[] | object)[]>;

    try {
      let query: Q;

      const values = [
        this.assessmentID,
        JSON.stringify(this.questionsData),
        JSON.stringify(this.answersData),
        this.assessmentType,
      ];

      console.log("input values are ");
      console.log(values);

      query = {
        name: "add_questions_to_assessment",
        text: "SELECT add_questions_to_assessment($1, $2, $3, $4)",
        values: values as string[],
      };

      await client.query(query);
    } catch (err) {
      console.error(
        `${chalk.red(
          "QUERY_ERR:"
        )} could not create question(s)!. reason: ${err}`
      );
      throw new Error(err as string);
    } finally {
      this.assessmentID = undefined;
      this.assessmentType = undefined;
      this.questionsData = [];
      this.answersData = [];
      client.release();
    }
  }

  static async delete(
    assessmentID: string,
    questionIDs: number[],
    assessmentType: AssessmentVariantType
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const values = [assessmentID, questionIDs, assessmentType];

        console.log("input values are ");
        console.log(values);

        const query: QueryConfig<(number[] | string)[]> = {
          name: "remove_questions_from_assessment",
          text: "SELECT remove_questions_from_assessment($1, $2, $3)",
          values,
        };

        await client.query(query);
        resolve();
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not delete question(s)!. reason: ${err}`
        );
        reject(new Error(err as string));
      } finally {
        client.release();
      }
    });
  }

  set answersData(newAnswerData: AnswerModel) {
    QuestionModel.answersData = [
      ...(QuestionModel.answersData || []),
      newAnswerData,
    ];
  }
}
