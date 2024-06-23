import type {
  StudentRankType,
  StudentViewType,
  UserRoleType,
} from "./../types.d";
import { pool } from "../db.js";
import chalk from "chalk";
import type { QueryConfig, QueryResult } from "pg";
import { BoardDisplay, ConsoleLogger } from "../utils.js";
import { UserModel } from "./user.model.js";

export class StudentModel extends UserModel {
  studentID: string | null = null;
  rank: StudentRankType | null = null;
  points: number | null = null;
  role: UserRoleType | null = null;

  constructor(
    public readonly email: string,
    public readonly password: string,
    public readonly firstName: string,
    public readonly lastName: string,
    public readonly avatarUrl: string
  ) {
    super();
  }

   static get all() {
    const fetchAllStudents: () => Promise<StudentViewType[]> = async () => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_all_students",
          text: "SELECT student_id, rank, points, email, role, avatar->>'url' avatar_url FROM students",
        };
        const res: QueryResult<{
          student_id: string;
          rank: StudentRankType;
          points: string;
          email: string;
          role: UserRoleType;
          avatar_url: string;
        }> = await client.query(query);
        const { rows } = res;
        const resStudents = rows.map((el) => {
          const {
            avatar_url,
            email,
            points,
            rank,
            role,
            student_id: studentID,
          } = el;
          return {
            studentID,
            email,
            rank,
            points: +points,
            role,
            avatarUrl: avatar_url,
          };
        });

        return resStudents;
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not fetch students!. reason: ${err}`
        );
        throw err;
      } finally {
        client.release();
      }
    };

    return fetchAllStudents();
  }

  get all() {
    try {
      return StudentModel.all;
    } catch (err) {
      return [];
    }
  }

  static async displayAll() {
    const { level2Nest, border, marginDecoratorCount, frameChar } =
      BoardDisplay;
    try {
      const resStudents = this.all;
      const allStudents = await resStudents;
      console.log(chalk.yellow("[ALL STUDENTS]\n"));
      console.log(chalk.green(frameChar.repeat(marginDecoratorCount / 2)));

      allStudents.forEach((entry) => {
        Object.keys(entry).forEach((key) => {
          console.log(border, level2Nest, key, " ->", " ", entry[key]);
        });

        console.log(chalk.green(frameChar.repeat(marginDecoratorCount / 2)));
      });

      console.log("\n");
    } catch (err) {
      new ConsoleLogger(
        "error",
        `an error occurred getting all students, ${err}`
      );
    }
  }

  static verify(
    studentEmail: string | null
  ): Promise<{ studentID: string; password: string } | null> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_current_student_validate",
          text: "SELECT * FROM get_current_student_validate($1)",
          values: [studentEmail as string],
        };

        const res: QueryResult<{
          student_id: string;
          password: string;
        }> = await client.query(query);

        const { rows } = res;
        const resStudent = rows.map((el) => {
          const { student_id, password } = el;
          return {
            studentID: student_id,
            password,
          };
        })[0];

        resolve(resStudent);
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not fetch student for validation!. reason: ${err}`
        );
        reject(err);
      } finally {
        client.release();
      }
    });
  }

  async verify(studentEmail: string | null) {
    try {
      const res = await StudentModel.verify(studentEmail);
      return res;
    } catch (err) {
      throw err;
    }
  }

  static search(studentEmail: string | null) {
    const fetchStudent: () => Promise<StudentViewType> = async () => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_current_student",
          text: "SELECT * FROM get_current_student($1)",
          values: [studentEmail as string],
        };

        const res: QueryResult<{
          student_id: string;
          rank: StudentRankType;
          points: string;
          role: string;
          avatarUrl: string;
        }> = await client.query(query);

        const { rows } = res;
        const resStudent = rows.map((el) => {
          const { student_id: id, rank, points, role, avatarUrl } = el;
          return {
            studentID: id,
            rank,
            points: +points,
            role: role as UserRoleType,
            avatarUrl,
          };
        })[0];

        return resStudent;
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not fetch student!. reason: ${err}`
        );
        throw err;
      } finally {
        client.release();
      }
    };
    return fetchStudent();
  }

  search(studentEmail: string | null) {
    try {
      return StudentModel.search(studentEmail);
    } catch (err) {
      return null;
    }
  }

  async save() {
    const client = await pool.connect();
    try {
      const query: QueryConfig<string[]> = {
        name: "set_new_student",
        text: "SELECT * FROM set_new_student($1, $2, $3, $4, $5)",
        values: [
          this.email,
          this.firstName,
          this.lastName,
          this.password,
          this.avatarUrl,
        ],
      };
      const res: QueryResult<{
        student_id: string;
        rank: string;
        points: string;
        role: UserRoleType;
      }> = await client.query(query);
      const { rows } = res;
      const { points, rank, student_id: id } = rows[0];
      this.studentID = id;
      this.rank = rank as StudentRankType;
      this.points = +points;
      this.role = "student";
      this.show();
    } catch (err) {
      console.error(
        `${chalk.red("QUERY_ERR:")} could not create student!. reason: ${err}`
      );
      throw new Error(err as string);
    } finally {
      client.release();
    }
  }
}
