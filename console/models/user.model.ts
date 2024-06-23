import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { UserRoleType } from "../types";
import { pool } from "../db.js";
import type { QueryConfig } from "pg";

export abstract class UserModel extends BaseModel<void> {
  abstract save(): void;

  static updateAvatar(
    userID: string,
    newAvatar: string,
    type: UserRoleType
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "update_user_avatar",
          text: "SELECT * FROM update_user_avatar($1, $2, $3)",
          values: [userID, newAvatar, type],
        };
        await client.query(query);
        resolve();
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not update user avatar!. reason: ${err}`
        );
        reject(new Error(err as string));
      } finally {
        client.release();
      }
    });
  }

  static updateEmail(
    userID: string,
    newEmail: string,
    type: UserRoleType
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "update_user_email",
          text: "SELECT * FROM update_user_email($1, $2, $3)",
          values: [userID, newEmail, type],
        };
        await client.query(query);
        resolve();
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not update user email!. reason: ${err}`
        );
        reject(new Error(err as string));
      } finally {
        client.release();
      }
    });
  }

  static updateNames(
    userID: string,
    firstName: string | null,
    lastName: string | null,
    type: UserRoleType
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<(string | null)[]> = {
          name: "update_user_names",
          text: "SELECT * FROM update_user_names($1, $2, $3, $4)",
          values: [userID, firstName || null, lastName || null, type],
        };
        await client.query(query);
        resolve();
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not update user names!. reason: ${err}`
        );
        reject(new Error(err as string));
      } finally {
        client.release();
      }
    });
  }

  static updatePassword(
    userID: string,
    oldPassword: string,
    newPassword: string,
    type: UserRoleType
  ): Promise<void> {
    return new Promise(async (resolve, reject) => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "update_user_password",
          text: "SELECT * FROM update_user_password($1, $2, $3, $4)",
          values: [userID, oldPassword, newPassword, type],
        };
        await client.query(query);
        resolve();
      } catch (err) {
        console.error(
          `${chalk.red(
            "QUERY_ERR:"
          )} could not update user password!. reason: ${err}`
        );
        reject(new Error(err as string));
      } finally {
        client.release();
      }
    });
  }

  abstract search(email: string | null): Promise<object> | null;

  abstract get all(): Promise<object[]> | never[];

  show() {
    console.log(`${chalk.bgCyanBright("USER MODEL:")} {${this.valueOf()}}`);
  }
}
