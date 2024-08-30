import chalk from "chalk";
import { config } from "dotenv";
config({ path: [".env", ".env.dev", ".env.prod"] });
import fs from "fs";
import { fileURLToPath } from "url";
import { dirname, default as path } from "path";

import pg from "pg";
const { Pool, Client } = pg;

export const client = Client.bind(Client, {
  host:
    process.env.CST_CONTEXT === "prod"
      ? process.env.CST_PROD_DB_HOST
      : process.env.CST_DB_HOST,
  user: process.env.CST_DB_USER,
  database:
    process.env.CST_CONTEXT === "test"
      ? process.env.CST_TEST_DB_NAME
      : process.env.CST_CONTEXT === "prod"
      ? process.env.CST_PROD_DB_NAME
      : process.env.CST_DB_NAME,
  password:
    process.env.CST_CONTEXT === "prod"
      ? process.env.CST_PROD_DB_PASSWORD
      : process.env.CST_DB_PASSWORD,
  idle_in_transaction_session_timeout: 30000,
});

export const pool = new Pool({
  host:
    process.env.CST_CONTEXT === "prod"
      ? process.env.CST_PROD_DB_HOST
      : process.env.CST_DB_HOST,
  user: process.env.CST_DB_USER,
  database:
    process.env.CST_CONTEXT === "test"
      ? process.env.CST_TEST_DB_NAME
      : process.env.CST_CONTEXT === "prod"
      ? process.env.CST_PROD_DB_NAME
      : process.env.CST_DB_NAME,
  max: 20,
  password:
    process.env.CST_CONTEXT === "prod"
      ? process.env.CST_PROD_DB_PASSWORD
      : process.env.CST_DB_PASSWORD,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 50000,
});

let imageDBConfig: pg.PoolConfig;

if (process.env.CST_CONTEXT === "prod") {
  const _filename = fileURLToPath(import.meta.url);
  const _dirname = dirname(_filename);
  const key = Buffer.from(process.env.CST_PROD_IMAGE_DB_PEM || "", 'base64').toString('utf8');
  fs.writeFileSync(path.join(_dirname, "..", "api", "v1", "keys", "image-db-crt.pem"), key);
  imageDBConfig = {
    user: process.env.CST_PROD_IMAGE_DB_USER,
    password: process.env.CST_PROD_IMAGE_DB_PASSWORD,
    host: process.env.CST_PROD_IMAGE_DB_HOST,
    port: 25459,
    database: process.env.CST_PROD_IMAGE_DB_NAME,
    ssl: {
      rejectUnauthorized: true,
      ca: fs.readFileSync(path.join(_dirname, "..", "api", "v1", "keys", "image-db-crt.pem")),
    },
  };
} else {
  imageDBConfig = {
    host: process.env.CST_IMAGE_DB_HOST,
    user: process.env.CST_IMAGE_DB_USER,
    database:
      process.env.CST_CONTEXT === "test"
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

process.on("SIGINT", async () => {
  await pool.end(); // Close idle connections in the pool on termination
  await imagePool.end();
  console.log("Closing PostgreSQL connection pool");
  process.exit(0);
});
