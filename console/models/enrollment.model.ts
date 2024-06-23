import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { QueryConfig, QueryResult } from "pg";
import { CourseSummaryViewType } from "../types.js";
import { BoardDisplay, ConsoleLogger } from "../utils.js";

export class EnrollmentModel extends BaseModel<void> {
  constructor(
    public readonly studentID: string,
    public readonly courseID: string
  ) {
    super();
  }

  static async delete(studentID: string, courseID: string) {
    const client = await pool.connect();
    try {
      const status = await this.confirmEnrollment(studentID, courseID);
      if (!status) {
        throw new Error("student isn't enrolled. so, can't unenroll");
      }
      const query: QueryConfig<string[]> = {
        name: "unenroll_student_from_course",
        text: "SELECT * FROM unenroll_student_from_course($1, $2)",
        values: [studentID, courseID],
      };

      await client.query(query);
    } catch (err) {
      console.error(
        `${chalk.red("QUERY_ERR:")} could not unenroll student!. reason: ${err}`
      );
      throw new Error(err as string);
    } finally {
      client.release();
    }
  }

  static async displayAll(studentID: string) {
    const { level2Nest, border, marginDecoratorCount, frameChar } =
      BoardDisplay;
    try {
      const resCourses = this.all(studentID);
      const allCourses = await resCourses;
      console.log(chalk.yellow("[ALL MY COURSES]\n"));
      console.log(chalk.green(frameChar.repeat(marginDecoratorCount / 2)));

      allCourses.forEach((entry) => {
        Object.keys(entry).forEach((key) => {
          console.log(border, level2Nest, key, " ->", " ", entry[key]);
        });

        console.log(chalk.green(frameChar.repeat(marginDecoratorCount / 2)));
      });
      console.log("\n");
    } catch (err) {
      new ConsoleLogger(
        "error",
        `an error occurred getting all your courses, ${err}`
      );
    }
  }

  static all(studentID: string) {
    const fetchAllStudentCourses: () => Promise<
      CourseSummaryViewType[]
    > = async () => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_course_summaries_for_student",
          text: "SELECT * FROM get_course_summaries_for_student($1)",
          values: [studentID],
        };

        const res: QueryResult<{
          course_id: string;
          lesson_count: string;
          thumbnail: string;
          title: string;
          progress: number;
        }> = await client.query(query);

        const { rows } = res;

        const resCourses = rows.map((el) => {
          const {
            course_id: courseID,
            lesson_count: lessonCount,
            thumbnail,
            title,
            progress,
          } = el;
          return {
            courseID,
            lessonCount: +lessonCount,
            thumbnail,
            title,
            progress,
          };
        });

        return resCourses;
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not fetch your courses!. reason: ${err}`
        );
        throw err;
      } finally {
        client.release();
      }
    };

    return fetchAllStudentCourses();
  }

  static confirmEnrollment(studentID: string | null, courseID: string | null) {
    const searchStudentEnrollment: () => Promise<boolean> = async () => {
      const client = await pool.connect();

      try {
        const query: QueryConfig<string[]> = {
          name: "is_student_enrolled",
          text: "SELECT * FROM is_student_enrolled($1, $2)",
          values: [studentID as string, courseID as string],
        };

        const res: QueryResult<{ is_enrolled: string }> = await client.query(
          query
        );
        const status = res.rows[0];
        const { is_enrolled } = status;
        return !!+is_enrolled;
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not get confirm enrollment!. reason: ${err}`
        );
        throw new Error(err as string);
      } finally {
        client.release();
      }
    };

    return searchStudentEnrollment();
  }

  static search(_1: string | null, _2: string | null) {
    return Promise.resolve({});
  }

  search(_1: string | null) {
    try {
      return null;
    } catch (err) {
      return null;
    }
  }

  async save() {
    const client = await pool.connect();
    try {
      const query: QueryConfig<string[]> = {
        name: "enroll_student_to_course",
        text: "SELECT * FROM enroll_student_to_course($1, $2)",
        values: [this.studentID, this.courseID],
      };

      const res: QueryResult = await client.query(query);
    } catch (err) {
      console.error(
        `${chalk.red(
          "QUERY_ERR:"
        )} could not enroll student to course!. reason: ${err}`
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
