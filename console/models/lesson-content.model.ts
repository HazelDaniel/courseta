import type { CourseViewType, lessonVariantType } from "./../types.d";
import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { QueryConfig, QueryResult } from "pg";
import { BoardDisplay, ConsoleLogger } from "../utils.js";

export class LessonContentModel extends BaseModel<void> {
  lessonContentID: string | null = null;

  constructor(
    public readonly title: string,
    public href: string,
    public contentType: lessonVariantType,
    public duration: number,
    public lessonPositionID?: number
  ) {
    super();
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

  static search(lessonContentID: string | null) {
    return Promise.resolve({});
  }

  search(lessonContentID: string | null) {
    return null;
  }

  async save() {
    const client = await pool.connect();
    try {
      const query: QueryConfig<(string | string[])[]> = {
        name: "set_new_course",
        text: "SELECT course_id FROM set_new_course($1, $2, $3, $4, $5)",
        values: [this.title],
      };
      const res: QueryResult<{
        course_id: string;
      }> = await client.query(query);
      const { rows } = res;
      const { course_id: lessonID } = rows[0];
      this.show();
    } catch (err) {
      console.error(
        `${chalk.red("QUERY_ERR:")} could not create course!. reason: ${err}`
      );
      throw new Error(err as string);
    } finally {
      client.release();
    }
  }

  get all() {
    return [];
  }
}
