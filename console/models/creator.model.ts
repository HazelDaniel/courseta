import type {
  CreatorViewType,
  UserContractType,
  UserRoleType,
} from "./../types.d";
import { pool } from "../db.js";
import chalk from "chalk";
import { BaseModel } from "./base-model.js";
import type { QueryConfig, QueryResult } from "pg";

export class CreatorModel extends BaseModel<void> implements UserContractType {
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

  static get all() {
    const fetchAllCreators: () => Promise<CreatorViewType[]> = async () => {
      const client = await pool.connect();
      try {
        const query: QueryConfig<string[]> = {
          name: "get_all_creators",
          text: "SELECT creators.creator_id, creators.email, creators.role, creators.creator_pass, creators.avatar->>'url' FROM creators",
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
        });

        return resCreators;
      } catch (err) {
        console.error(
          `${chalk.red("QUERY_ERR:")} could not fetch creators!. reason: ${err}`
        );
        throw err;
      } finally {
        client.release();
      }
    };

    return fetchAllCreators();
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

  get all() {
    try {
      return CreatorModel.all;
    } catch (err) {
      return [];
    }
  }
}
