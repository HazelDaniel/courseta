import type { CourseOutlineViewType, CourseViewType } from "./../types.d";
import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { QueryConfig, QueryResult } from "pg";
import { BoardDisplay, ConsoleLogger } from "../utils.js";
import { LessonContentModel } from "./lesson-content.model.js";
import { QuizModel } from "./quiz.model.js";

export class LessonModel extends BaseModel<void> {
  lessonID: number | null = null;

  static courseID?: number | null;
  static lessonData?: LessonModel[];
  static lessonContentData?: LessonContentModel[];
  static lessonQuizData?: QuizModel[];

  constructor(
    public readonly title: string,
    public positionID?: number,
    public courseID?: number,
    public lessonData?: LessonModel[]
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
          `${chalk.red("QUERY_ERR:")} could not fetch lessons!. reason: ${err}`
        );
        reject();
      } finally {
        client.release();
      }
    });
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

  static search(lessonID: string | null) {
    return Promise.resolve({});
  }

  static async saveAll() {
    const client = await pool.connect();
    type Q = QueryConfig<(string | object[] | object)[]>;

    try {
      let query: Q;

      const values = [
        this.courseID,
        JSON.stringify(this.lessonData),
        JSON.stringify(this.lessonQuizData),
        JSON.stringify(this.lessonContentData),
      ];

      // console.log("input values are ");
      // console.log(values);

      query = {
        name: "add_lessons_to_course",
        text: "SELECT add_lessons_to_course($1, $2, $3, $4)",
        values: values as string[],
      };

      const res: QueryResult<{ add_lessons_to_course: number[] }> =
        await client.query(query);
      const lessonIDArray = res.rows[0].add_lessons_to_course;
      this.courseID = null;
      this.lessonData = [];
      this.lessonQuizData = [];
      this.lessonContentData = [];
      return lessonIDArray;
    } catch (err) {
      console.error(
        `${chalk.red("QUERY_ERR:")} could not create lesson(s)!. reason: ${err}`
      );
      throw new Error(err as string);
    } finally {
      client.release();
    }
  }


  get all() {
    return [];
  }

  search(lessonID: string | null) {
    return null;
  }

  async save() {
    if (!LessonModel.courseID) LessonModel.courseID = this.courseID;
    LessonModel.lessonData = [
      ...(LessonModel.lessonData || []),
      this,
    ];
  }

  set lessonContentData(newLessonContentData: LessonContentModel) {
    LessonModel.lessonContentData = [
      ...(LessonModel.lessonContentData || []),
      newLessonContentData
    ];
  }

  set lessonQuizData(newLessonQuizData: QuizModel) {
    LessonModel.lessonQuizData = [
      ...(LessonModel.lessonQuizData || []),
      newLessonQuizData
    ];
  }
}
