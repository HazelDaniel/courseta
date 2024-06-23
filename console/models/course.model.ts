import type { CourseOutlineViewType, CourseViewType } from "./../types.d";
import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { QueryConfig, QueryResult } from "pg";
import { BoardDisplay, ConsoleLogger } from "../utils.js";

export class CourseModel extends BaseModel<void> {
  courseID: string | null = null;

  constructor(
    public readonly title: string,
    public readonly desciption: string,
    public readonly thumbnail: string,
    public creatorID: string,
    public readonly tags: string
  ) {
    super();
  }

  static get all() {
    const fetchAllCourses: () => Promise<CourseViewType[]> = async () => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_all_courses",
          text: "SELECT * FROM get_course_summaries()",
        };

        const res: QueryResult<{
          course_id: string;
          lesson_count: string;
          thumbnail: string;
          title: string;
        }> = await client.query(query);

        const { rows } = res;
        const resCourses = rows.map((el) => {
          const {
            course_id: courseID,
            lesson_count: lessonCount,
            thumbnail,
            title,
          } = el;
          return {
            courseID,
            lessonCount: +lessonCount,
            thumbnail,
            title,
          };
        });
        return resCourses;
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not fetch courses!. reason: ${err}`
        );
        throw err;
      } finally {
        client.release();
      }
    };

    return fetchAllCourses();
  }

  static display(CourseOutline: CourseOutlineViewType) {
    const { level1Nest, level3Nest, border, marginDecoratorCount } =
      BoardDisplay;

    const { detail, outline } = CourseOutline;

    console.log("");
    console.log(`${chalk.green("<>".repeat(marginDecoratorCount))}`);
    console.log(level1Nest, chalk.cyan("[COURSE]\n"));
    console.log(`${border}${level1Nest} title: ${detail.title}`);
    console.log(`${border}${level1Nest} length: ${detail.courseLength}s long`);
    console.log(`${border}${level1Nest} description: ${detail.description}`);
    console.log(
      `${border}${level1Nest} ratings: ${detail.averageRating} (${detail.reviewCount})`
    );
    console.log(
      chalk.overline(`${border}${level3Nest} last updated: ${detail.updatedAt}`)
    );
    console.log(
      chalk.overline(
        `${border}${level3Nest} members enrolled: ${detail.studentCount}`
      )
    );
    console.log(level1Nest, chalk.cyan("[OUTLINE]\n"));
    outline.forEach((entry) => {
      console.log(
        chalk.overline(
          `${border}${level1Nest} ${entry.title} || (${entry.contentCount} contents) ${entry.totalDuration}s long`
        ),
        chalk.overline(
          `${border}${level1Nest} [QUIZ]: ${entry.quizTitle} || (${entry.totalPoints} points)`
        )
      );
    });

    console.log(`${chalk.green("<>".repeat(marginDecoratorCount))}`);
    console.log("");
  }

  static async displayAll() {
    const { level2Nest, border, marginDecoratorCount, frameChar } =
      BoardDisplay;
    try {
      const resCourses = this.all;
      const allCourses = await resCourses;
      console.log(chalk.yellow("[ALL COURSES]\n"));
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
        `an error occurred getting all courses, ${err}`
      );
    }
  }

  static search(courseID: string | null) {
    const fetchCourse: () => Promise<CourseOutlineViewType> = async () => {
      const client = await pool.connect();
      try {
        const courseQuery: QueryConfig<string[]> = {
          name: "get_course_details",
          text: "SELECT * FROM get_course_details($1)",
          values: [courseID as string],
        };

        const courseOutlineQuery: QueryConfig<string[]> = {
          name: "get_course_outline",
          text: "SELECT * FROM get_course_outline($1)",
          values: [courseID as string],
        };

        const courseReq: Promise<
          QueryResult<{
            title: string;
            lesson_count: string;
            description: string;
            review_count: string;
            thumbnail: string;
            creator_id: string;
            student_count: string;
            updated_at: string;
            course_length: number;
            average_rating: number;
          }>
        > = client.query(courseQuery);

        const courseOutlineReq: Promise<
          QueryResult<{
            lesson_id: string;
            title: string;
            course_id: string;
            content_count: string;
            total_duration: string;
            quiz_id: string;
            total_points: string;
            quiz_title: string;
          }>
        > = client.query(courseOutlineQuery);

        const combineResPromise = Promise.all([courseReq, courseOutlineReq]);
        const [courseResolved, courseOutlineResolved] = await combineResPromise;
        let { rows: courseRows } = courseResolved;
        let { rows: courseOutlineRows } = courseOutlineResolved;

        const resCourse = courseRows.map((el) => {
          const {
            creator_id,
            description,
            lesson_count,
            review_count,
            student_count,
            thumbnail,
            title,
            course_length,
            updated_at,
            average_rating,
          } = el;

          return {
            creatorID: creator_id,
            description,
            lessonCount: +lesson_count,
            reviewCount: +review_count,
            studentCount: +student_count,
            thumbnail,
            title,
            courseLength: +course_length,
            updatedAt: updated_at,
            courseID: courseID as string,
            averageRating: +average_rating,
          };
        })[0];

        const resCourseOutline = courseOutlineRows.map((el) => {
          const {
            content_count,
            course_id,
            lesson_id,
            quiz_id,
            quiz_title,
            title,
            total_duration,
            total_points,
          } = el;

          return {
            contentCount: +content_count,
            courseID: course_id,
            lessonID: lesson_id,
            quizID: quiz_id,
            quizTitle: quiz_title,
            title,
            totalDuration: +total_duration,
            totalPoints: +total_points,
          };
        });

        return { detail: resCourse, outline: resCourseOutline };
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not fetch course!. reason: ${err}`
        );
        throw err;
      } finally {
        client.release();
      }
    };
    return fetchCourse();
  }

  search(courseID: string | null) {
    try {
      return CourseModel.search(courseID);
    } catch (err) {
      return null;
    }
  }

  async save() {
    const client = await pool.connect();
    try {
      const query: QueryConfig<(string | string[])[]> = {
        name: "set_new_course",
        text: "SELECT course_id FROM set_new_course($1, $2, $3, $4, $5)",
        values: [
          this.title,
          this.desciption,
          this.thumbnail,
          this.creatorID,
          this.tags.split(" "),
        ],
      };
      const res: QueryResult<{
        course_id: string;
      }> = await client.query(query);
      const { rows } = res;
      const { course_id: courseID } = rows[0];
      this.courseID = courseID;
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
    try {
      return CourseModel.all;
    } catch (err) {
      return [];
    }
  }
}
