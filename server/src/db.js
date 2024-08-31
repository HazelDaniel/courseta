var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import chalk from "chalk";
import { config } from "dotenv";
config({ path: [".env", ".env.dev", ".env.prod"] });
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, default as path } from "path";
import pg from "pg";
const { Pool } = pg;
export const pool = new Pool({
    host: process.env.CST_CONTEXT === "prod"
        ? process.env.CST_PROD_DB_HOST
        : process.env.CST_DB_HOST,
    user: process.env.CST_DB_USER,
    database: process.env.CST_CONTEXT === "test"
        ? process.env.CST_TEST_DB_NAME
        : process.env.CST_CONTEXT === "prod"
            ? process.env.CST_PROD_DB_NAME
            : process.env.CST_DB_NAME,
    max: 20,
    password: process.env.CST_CONTEXT === "prod"
        ? process.env.CST_PROD_DB_PASSWORD
        : process.env.CST_DB_PASSWORD,
    ssl: {
        rejectUnauthorized: false,
    },
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 50000,
});
let imageDBConfig;
if (process.env.CST_CONTEXT === "prod") {
    const _filename = fileURLToPath(import.meta.url);
    const _dirname = dirname(_filename);
    const key = Buffer.from(process.env.CST_PROD_IMAGE_DB_PEM || "", "base64").toString("utf8");
    fs.writeFileSync(path.join(_dirname, "..", "api", "v1", "keys", "image-db-crt.pem"), key);
    imageDBConfig = {
        user: process.env.CST_PROD_IMAGE_DB_USER,
        password: process.env.CST_PROD_IMAGE_DB_PASSWORD,
        host: process.env.CST_PROD_IMAGE_DB_HOST,
        port: 25459,
        database: process.env.CST_PROD_IMAGE_DB_NAME,
        ssl: {
            rejectUnauthorized: false,
            ca: fs.readFileSync(path.join(_dirname, "..", "api", "v1", "keys", "image-db-crt.pem")),
        },
    };
}
else {
    imageDBConfig = {
        host: process.env.CST_IMAGE_DB_HOST,
        user: process.env.CST_IMAGE_DB_USER,
        database: process.env.CST_CONTEXT === "test"
            ? process.env.CST_TEST_IMAGE_DB_NAME
            : process.env.CST_IMAGE_DB_NAME,
        max: 20,
        password: process.env.CST_DB_PASSWORD,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 50000,
    };
}
export const imagePool = new Pool(imageDBConfig);
pool.on("connect", (client) => {
    client.on("notice", (notice) => {
        console.warn(chalk.bgYellowBright("[NOTICE]: "), notice.message);
    });
});
process.on("SIGINT", () => __awaiter(void 0, void 0, void 0, function* () {
    yield pool.end(); // Close idle connections in the pool on termination
    yield imagePool.end();
    console.log("Closing PostgreSQL connection pool");
    process.exit(0);
}));
