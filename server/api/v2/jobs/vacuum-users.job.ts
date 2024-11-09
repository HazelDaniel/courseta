import { pool } from "../../../db.js";
import type { QueryConfig } from "pg";
import cron from "node-cron";
import chalk from "chalk";
import { log } from "../utils/utils.js";

const vacuumUsers = async () => {
  const client = await pool.connect();
  try {
    log("running job: ", chalk.bgBlue("VACUUM_UNVERFIED_USERS"), " ...");
    const query: QueryConfig<void> = {
      name: "vacuum_unverified_users",
      text: "SELECT vacuum_unverified_users()",
    };
    await client.query(query);
  } catch (err) {
    log(
      "could not perform job: ",
      chalk.bgBlue("VACUUM_UNVERFIED_USERS"),
      " !",
      "reason : ",
      err instanceof Error ? err.message : "NULL"
    );
  } finally {
    client.release();
  }
};

export const initJob = () => {
  const scheduleString =
    process.env.CST_CONTEXT === "test" ? "* * * * *" : "* 9,21 * * *";
  cron.schedule(scheduleString, vacuumUsers);
};
