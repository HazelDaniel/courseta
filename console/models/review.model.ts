import type { CourseOutlineViewType, CourseViewType } from "./../types.d";
import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { QueryConfig, QueryResult } from "pg";
import { BoardDisplay, ConsoleLogger } from "../utils.js";

export class ReviewModel extends BaseModel<void> {
  constructor(
    public readonly studentID: string,
    public readonly courseID: string,
    public readonly rating: number,
    public readonly reviewText: string
  ) {
    super();
  }

  static get all() {
    return Promise.resolve([]);
  }

  static display() {}

  static search(_1: string | null) {
    return Promise.resolve({});
  }

  search(reviewID: string | null) {
    try {
      return ReviewModel.search(reviewID);
    } catch (err) {
      return null;
    }
  }

  async save() {
    const client = await pool.connect();
    try {
      const query: QueryConfig<(string | number)[]> = {
        name: "review_course_for_student",
        text: "SELECT review_course_for_student($1, $2, $3, $4)",
        values: [this.studentID, this.courseID, this.rating, this.reviewText],
      };

      await client.query(query);
    } catch (err) {
      console.error(
        `${chalk.red("QUERY_ERR:")} could not review course!. reason: ${err}`
      );
      throw new Error(err as string);
    } finally {
      client.release();
    }
  }

  get all() {
    try {
      return ReviewModel.all;
    } catch (err) {
      return [];
    }
  }
}
