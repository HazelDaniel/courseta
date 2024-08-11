import { config } from "dotenv";
const envPaths = [".env", ".env.dev"];
config({ path: envPaths });
import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.CST_DB_HOST,
  user: process.env.CST_DB_USER,
  database:
    process.env.CST_CONTEXT === "test"
      ? process.env.CST_TEST_DB_NAME
      : process.env.CST_DB_NAME,
  max: 20,
  password: process.env.CST_DB_PASSWORD,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 50000,
});

export const imagePool = new Pool({
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
});

process.on("SIGINT", async () => {
  await pool.end(); // Close idle connections in the pool on termination
  await imagePool.end();
  console.log("Closing PostgreSQL connection pool");
  process.exit(0);
});
