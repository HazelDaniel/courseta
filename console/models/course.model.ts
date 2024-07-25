import type {
  CourseDetailViewType,
  CourseOutlineViewType,
  CourseSummaryViewType,
  CourseViewType,
} from "./../types.d";
import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { QueryConfig, QueryResult } from "pg";
import { BoardDisplay, ConsoleLogger } from "../utils.js";
import { LessonModel } from "./lesson.model.js";
import { LessonContentModel } from "./lesson-content.model.js";
import { QuizModel } from "./quiz.model.js";
import { transcode } from "buffer";

export class CourseModel extends BaseModel<void> {
  courseID: number | null = null;

  constructor(
    public readonly title: string,
    public readonly description: string,
    public readonly thumbnail: string,
    public creatorID: string,
    public readonly tags: string,
    public lessonData?: LessonModel[],
    public lessonContentData?: LessonContentModel[],
    public lessonQuizData?: QuizModel[]
  ) {
    super();
  }

  get all() {
    try {
      return CourseModel.all();
    } catch (err) {
      return [];
    }
  }

  static all(): Promise<CourseViewType[]> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_all_courses",
          text: "SELECT * FROM get_course_summaries()",
        };

        const res: QueryResult<{
          course_id: string;
          lesson_count: string;
          avatar: { url: string; updated_at: string; created_at: string };
          title: string;
        }> = await client.query(query);

        const { rows } = res;
        const resCourses = rows.map((el) => {
          const {
            course_id: courseID,
            lesson_count: lessonCount,
            avatar,
            title,
          } = el;
          return {
            courseID: +courseID,
            lessonCount: +lessonCount,
            thumbnail: avatar.url,
            title,
          };
        });
        resolve(resCourses);
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not fetch courses!. reason: ${err}`
        );
        reject();
      } finally {
        client.release();
      }
    });
  }

  static allRecommended(studentID: string): Promise<CourseViewType[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = await pool.connect();
        const query: QueryConfig<[string]> = {
          name: "get_recommended_courses_for_student",
          text: "SELECT * FROM get_recommended_courses_for_student($1)",
          values: [studentID],
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
            courseID: +courseID,
            lessonCount: +lessonCount,
            thumbnail,
            title,
          };
        });
        resolve(resCourses);
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not fetch recommended courses!. reason: ${err}`
        );
        reject(err);
      }
    });
  }

  static allRecentUnfinished(
    studentID: string
  ): Promise<CourseSummaryViewType[]> {
    return new Promise(async (resolve, reject) => {
      try {
        const client = await pool.connect();
        const query: QueryConfig<[string]> = {
          name: "get_student_recent_unfinished_course",
          text: "SELECT * FROM get_student_recent_unfinished_course($1)",
          values: [studentID],
        };

        const res: QueryResult<{
          course_id: string;
          lesson_count: string;
          thumbnail: string;
          title: string;
          progress: string;
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
            courseID: +courseID,
            lessonCount: +lessonCount,
            thumbnail,
            title,
            progress: +progress,
          };
        });

        resolve(resCourses);
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not fetch last unfinished courses!. reason: ${err}`
        );
        reject(err);
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

  static search(courseID: number | null) {
    const fetchCourse: () => Promise<CourseOutlineViewType> = async () => {
      const client = await pool.connect();
      try {
        const courseQuery: QueryConfig<(string | number)[]> = {
          name: "get_course_details",
          text: "SELECT * FROM get_course_details($1)",
          values: [courseID as number],
        };

        const courseOutlineQuery: QueryConfig<(string | number)[]> = {
          name: "get_course_outline",
          text: "SELECT * FROM get_course_outline($1)",
          values: [courseID as number],
        };

        const courseReq: Promise<
          QueryResult<{
            title: string;
            lesson_count: string;
            description: string;
            review_count: string;
            avatar: { url: string; updated_at: string; created_at: string };
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
            title,
            course_length,
            updated_at,
            average_rating,
            avatar,
          } = el;

          return {
            creatorID: creator_id,
            description,
            lessonCount: +lesson_count,
            reviewCount: +review_count,
            studentCount: +student_count,
            thumbnail: avatar.url,
            title,
            courseLength: +course_length,
            updatedAt: updated_at,
            courseID: +(courseID as number),
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
            courseID: +course_id,
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

  search(courseID: number | null) {
    try {
      return CourseModel.search(courseID);
    } catch (err) {
      return null;
    }
  }

  async save(creatorID?: string) {
    const client = await pool.connect();
    type Q = QueryConfig<(string | object[] | object)[]>;

    try {
      let query: Q;

      const emptyCourse = {
        title: this.title,
        description: this.description,
        thumbnail: this.thumbnail,
        creatorID: this.creatorID,
        tags: this.tags?.split(" ").filter((str) => !!str) || [],
      };

      const values = [
        creatorID,
        JSON.stringify(emptyCourse),
        JSON.stringify(this.lessonData),
        JSON.stringify(this.lessonQuizData),
        JSON.stringify(this.lessonContentData),
      ];

      // console.log("input values are :");
      // console.log(values);

      if (creatorID) {
        query = {
          name: "create_course_for_creator",
          text: "SELECT create_course_for_creator($1, $2, $3, $4, $5)",
          values: values as string[],
        };

        const res: QueryResult<{ create_course_for_creator: string }> =
          await client.query(query);
        const courseID = res.rows[0].create_course_for_creator;
        this.courseID = +courseID;
        this.show();
        return +courseID;
      } else {
        query = {
          name: "set_new_course",
          text: "SELECT course_id FROM set_new_course($1, $2, $3, $4, $5)",
          values: [
            this.title,
            this.description,
            this.thumbnail,
            this.creatorID,
            this.tags.split(" "),
          ],
        };

        const res: QueryResult<{ course_id: string }> = await client.query(
          query
        );
        const courseID = res.rows[0].course_id;
        this.courseID = +courseID;
        this.show();
        return +courseID;
      }
    } catch (err) {
      console.error(
        `${chalk.red("QUERY_ERR:")} could not create course!. reason: ${err}`
      );
      throw new Error(err as string);
    } finally {
      client.release();
    }
  }

  static updateFields(
    courseID: number,
    thumbnail?: string,
    description?: string,
    tags?: string
  ): Promise<{ thumbnail: string; description: string; tags: string[] }> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const courseDiff = {
          thumbnail: thumbnail || null,
          description: description || null,
          tags: tags?.split(" ").filter((str) => !!str) || [],
          courseID,
        };

        // console.log("course difference is ");
        // console.log(courseDiff);

        const query: QueryConfig<(typeof courseDiff)[]> = {
          name: "update_course_attributes",
          text: "SELECT * FROM update_course_attributes($1)",
          values: [courseDiff],
        };
        const res: QueryResult<{
          url: string;
          description: string;
          tags: string[];
        }> = await client.query(query);
        const resCourse = res.rows[0];
        console.log("resolved course is ", resCourse);
        const { description: resDesc, tags: resTags, url } = resCourse;
        const transformedCourse: {
          thumbnail: string;
          description: string;
          tags: string[];
        } = { description: resDesc, tags: resTags, thumbnail: url };
        resolve(transformedCourse);
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not update course details!. reason: ${err}`
        );
        reject(new Error(err as string));
      } finally {
        client.release();
      }
    });
  }
}
