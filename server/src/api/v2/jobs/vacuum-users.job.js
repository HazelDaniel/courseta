var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { pool } from "../../../db.js";
import cron from "node-cron";
import chalk from "chalk";
import { log } from "../utils/utils.js";
const vacuumUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const client = yield pool.connect();
    try {
        log("running job: ", chalk.bgBlue("VACUUM_UNVERFIED_USERS"), " ...");
        const query = {
            name: "vacuum_unverified_users",
            text: "SELECT vacuum_unverified_users()",
        };
        yield client.query(query);
    }
    catch (err) {
        log("could not perform job: ", chalk.bgBlue("VACUUM_UNVERFIED_USERS"), " !", "reason : ", err instanceof Error ? err.message : "NULL");
    }
    finally {
        client.release();
    }
});
export const initJob = () => {
    const scheduleString = process.env.CST_CONTEXT === "test" ? "* * * * *" : "* 9,21 * * *";
    cron.schedule(scheduleString, vacuumUsers);
};
