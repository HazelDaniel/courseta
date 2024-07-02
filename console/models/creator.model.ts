import type {
  CreatorSummaryViewType,
  CreatorViewType,
  UserRoleType,
} from "./../types.d";
import { pool } from "../db.js";
import chalk from "chalk";
import type { QueryConfig, QueryResult } from "pg";
import { UserModel } from "./user.model.js";

export class CreatorModel extends UserModel {
  creatorID: string | null = null;
  points: number | null = null;
  role: UserRoleType | null = null;
  creatorPass: string | null = null;

  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatarUrl: string
  ) {
    super();
  }

  static all(studentID?: string): Promise<CreatorSummaryViewType[]> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        let query: QueryConfig<string[]>;

        if (studentID) {
          query = {
            name: "get_creator_summaries_for_student",
            text: "SELECT * FROM get_creator_summaries_for_student($1)",
            values: [studentID],
          };
        } else {
          query = {
            name: "get_creator_summaries",
            text: "SELECT * FROM get_creator_summaries()",
          };
        }

        const res: QueryResult<{
          creator_id: string;
          email: string;
          first_name: string;
          last_name: string;
          avatar_url: string;
          average_course_rating: string;
          course_count: string;
          student_count: string;
          course_review_count: string;
        }> = await client.query(query);

        const { rows } = res;
        const resCreators = rows.map((el) => {
          const {
            avatar_url: avatarUrl,
            average_course_rating,
            course_count,
            course_review_count,
            creator_id: creatorID,
            email,
            first_name: firstName,
            last_name: lastName,
            student_count,
          } = el;
          return {
            creatorID,
            avatarUrl,
            averageCourseRating: +average_course_rating,
            courseCount: +course_count,
            courseReviewCount: +course_review_count,
            email,
            firstName,
            lastName,
            studentCount: +student_count,
          };
        });

        resolve(resCreators);
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

  get all() {
    try {
      return CreatorModel.all();
    } catch (err) {
      return [];
    }
  }

  static verify(creatorEmail: string | null): Promise<{
    creatorID: string;
    creatorPass: string;
    password: string;
  } | null> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_current_creator_validate",
          text: "SELECT * FROM get_current_creator_validate($1)",
          values: [creatorEmail as string],
        };

        const res: QueryResult<{
          creator_id: string;
          creator_pass: string;
          password: string;
        }> = await client.query(query);

        const { rows } = res;
        const resCreator = rows.map((el) => {
          const { creator_id, creator_pass, password } = el;
          return {
            creatorID: creator_id,
            password,
            creatorPass: creator_pass,
          };
        })[0];

        resolve(resCreator);
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not fetch creator for validation!. reason: ${err}`
        );
        reject(err);
      } finally {
        client.release();
      }
    });
  }

  async verify(creatorEmail: string | null) {
    const res = await CreatorModel.verify(creatorEmail);
    return res;
  }

  static search(creatorEmail: string | null) {
    const fetchCreator: () => Promise<CreatorViewType> = async () => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_current_creator",
          text: "SELECT * FROM get_current_creator($)",
          values: [creatorEmail as string],
        };
        const res: QueryResult<[string, string, UserRoleType, string, string]> =
          await client.query(query);
        const { rows } = res;
        const resCreators = rows.map((el) => {
          const [creatorID, email, role, creatorPass, avatarUrl] = el;
          return {
            creatorID,
            email,
            role,
            creatorPass,
            avatarUrl,
          };
        })[0];

        return resCreators;
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not fetch creator!. reason: ${err}`
        );
        throw err;
      } finally {
        client.release();
      }
    };

    return fetchCreator();
  }

  search(creatorEmail: string | null) {
    try {
      return CreatorModel.search(creatorEmail);
    } catch (err) {
      return null;
    }
  }

  async save() {
    const client = await pool.connect();
    try {
      const query: QueryConfig<string[]> = {
        name: "set_new_creator",
        text: "SELECT * FROM set_new_creator($1, $2, $3, $4, $5)",
        values: [
          this.email,
          this.firstName,
          this.lastName,
          this.password,
          this.avatarUrl,
        ],
      };
      const res: QueryResult<{
        creator_id: string;
        email: string;
        creator_pass: string;
        avatar: string;
      }> = await client.query(query);
      const { rows } = res;
      const { creator_id: id, creator_pass: pass } = rows[0];
      this.creatorID = id;
      this.creatorPass = pass;
      this.show();
    } catch (err) {
      console.error(
        `${chalk.red("QUERY_ERR:")} could not create creator!. reason: ${err}`
      );
      throw err;
    } finally {
      client.release();
    }
  }

 static async delete(courseID: string, creatorID: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "delete_course_if_creator_is",
          text: "SELECT p_02_delete_course_if_creator_is($1, $2)",
          values: [courseID, creatorID],
        };
        await client.query(query);
        resolve();
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not delete course!. reason: ${err}`
        );
        client.release();
        reject(err);
      }
    });
  }
}
