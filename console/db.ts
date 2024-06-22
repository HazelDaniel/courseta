import { config } from "dotenv";
config({ path: [".env", ".env.dev"] });
import pg from "pg";
const { Pool } = pg;

export const pool = new Pool({
  host: process.env.CST_DB_HOST,
  user: process.env.CST_DB_USER,
  database: process.env.CST_DB_NAME,
  max: 20,
  password: process.env.CST_DB_PASSWORD,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 50000,
});


process.on("SIGINT", async () => {
  await pool.end(); // Close idle connections in the pool on termination
  console.log("Closing PostgreSQL connection pool");
  process.exit(0);
});
