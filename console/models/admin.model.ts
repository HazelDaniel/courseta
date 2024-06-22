import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { QueryConfig, QueryResult } from "pg";
import { AdminViewType } from "../types";

export class AdminModel extends BaseModel<void> {
  adminID: string | null = null;

  constructor(public readonly email: string, public readonly password: string) {
    super();
  }

  static get all() {
    const fetchAllAdmins: () => Promise<AdminViewType[]> = async () => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_all_admins",
          text: "SELECT SELECT admins.admin_id, admins.email, admins.password FROM admins",
        };

        const res: QueryResult<{
          admin_id: string;
          email: string;
          password: string;
        }> = await client.query(query);
        const { rows } = res;
        const resAdmins = rows.map((el) => {
          const { admin_id, email, password } = el;
          return {
            adminID: admin_id,
            email,
            password,
          };
        });

        return resAdmins;
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not fetch admins!. reason: ${err}`
        );
        throw err;
      } finally {
        client.release();
      }
    };

    return fetchAllAdmins();
  }

  static search(adminEmail: string | null) {
    const fetchAdmin: () => Promise<AdminViewType> = async () => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_current_admin",
          text: "SELECT * FROM get_current_admin($1)",
          values: [adminEmail as string],
        };
        const res: QueryResult<{
          admin_id: string;
          email: string;
          password: string;
        }> = await client.query(query);
        const { rows } = res;
        const resAdmins = rows.map((el) => {
          const { admin_id, email, password } = el;
          return {
            adminID: admin_id,
            email,
            password,
          };
        })[0];

        return resAdmins;
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not fetch admin!. reason: ${err}`
        );
        throw err;
      } finally {
        client.release();
      }
    };

    return fetchAdmin();
  }

  search(adminEmail: string | null) {
    try {
      return AdminModel.search(adminEmail);
    } catch (err) {
      return null;
    }
  }

  async save() {
    const client = await pool.connect();
    try {
      const query: QueryConfig<string[]> = {
        name: "set_new_admin",
        text: "SELECT admin_id FROM set_new_admin($1, $2)",
        values: [this.email, this.password],
      };
      const res: QueryResult<[string]> = await client.query(query);
      const { rows } = res;
      this.adminID = rows[0][0];
      this.show();
    } catch (err) {
      console.error(
        `${chalk.red("QUERY_ERR:")} could not create admin!. reason: ${err}`
      );
      throw err;
    } finally {
      client.release();
    }
  }

  get all() {
    try {
      return AdminModel.all;
    } catch (err) {
      return [];
    }
  }
}
