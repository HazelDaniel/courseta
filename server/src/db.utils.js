import pg from "pg";
import { config } from "dotenv";
config({ path: [".env.dev", ".env"] });
export const pgPool = pg.Pool.bind(pg.Pool);
