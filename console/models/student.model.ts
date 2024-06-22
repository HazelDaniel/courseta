import type {
  StudentRankType,
  StudentViewType,
  UserContractType,
  UserRoleType,
} from "./../types.d";
import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { QueryConfig, QueryResult } from "pg";

export class StudentModel extends BaseModel<void> implements UserContractType {
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
          text: "SELECT student_id, rank, points, email, role, avatar->>'url' FROM students",
        };
        const res: QueryResult<
          [string, StudentRankType, string, string, string, string]
        > = await client.query(query);
        const { rows } = res;
        const resStudents = rows.map((el) => {
          const [id, rank, points, _1, role, avatarUrl] = el;
          return {
            studentID: id,
            rank,
            points: +points,
            role: role as UserRoleType,
            avatarUrl,
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

  get all() {
    try {
      return StudentModel.all;
    } catch (err) {
      return [];
    }
  }
}
