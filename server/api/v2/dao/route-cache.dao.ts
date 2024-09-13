import { ServerError, log } from "./../../../utils.js";
import type {
  CachedResponseType,
  GlobalCacheInterface,
} from "express-pubsubcache";
import sqlite from "sqlite3";
import { fileURLToPath } from "url";
import { dirname, default as path } from "path";

const DB_FILE = "response-cache.sql";
const DB_TABLE_NAME = "entries";

export class SqliteCache implements GlobalCacheInterface {
  db: sqlite.Database;

  constructor() {
    const _filename = fileURLToPath(import.meta.url);
    const _dirname = dirname(_filename);
    this.db = new sqlite.Database(path.join(_dirname, DB_FILE));

    this.db.serialize(() => {
      this.db.run(`DROP TABLE ${DB_TABLE_NAME};`, (err) => {
        if (err) {
          log(`could not drop table ${DB_TABLE_NAME}. reason: ${err}`);
          return;
        }
        log(`table '${DB_TABLE_NAME} dropped successfully'`);
      });
      this.db.run(
        `CREATE TABLE ${DB_TABLE_NAME} (
          key TEXT NOT NULL PRIMARY KEY,
          value TEXT
        );`,
        (err) => {
          if (err) {
            log(`Error creating table ${DB_TABLE_NAME}. reason: ${err}`);
            return;
          }
          log(`table '${DB_TABLE_NAME}' created or already exists`);
        }
      );
      // this.db.close();
    });

    process.on("SIGINT", () => {
      log("Closing SQLite connection for a cache db...");
      this.db.close((err) => {
        if (err) {
          console.error(
            "Error closing the database for a cache db:",
            err.message
          );
        } else {
          console.log("Cache database connection closed.");
        }
        process.exit(0);
      });
    });
  }

  deserializer(body: string) {
    return JSON.parse(body) as CachedResponseType;
  }

  serializer(body: CachedResponseType) {
    return JSON.stringify(body);
  }

  async evict(key: string): Promise<void> {
    return new Promise(async (resolve, reject) => {
      try {
        this.db.get<string | null>(
          `DELETE FROM ${DB_TABLE_NAME}` + " WHERE key = ?",
          [key],
          (err) => {
            if (err) {
              log("error deleting item from cache db. reason: ", err);
              throw new ServerError(
                "error deleting item from cache db. reason: " + err,
                500
              );
            }
            resolve();
          }
        );
      } catch (err) {
        reject(err);
      } finally {
        // this.db.close((err) => {
        //   if (err) {
        //     log("error closing a cache db");
        //     reject();
        //     return;
        //   }
        //   log("cache db closed succesfully");
        //   resolve();
        //   return;
        // });
      }
    });
  }

  async cleanup(): Promise<void> {
    return new Promise((resolve, reject) => {
      this.db.run(`DROP TABLE ${DB_TABLE_NAME};`, (err) => {
        if (err) {
          log(`could not drop table ${DB_TABLE_NAME}. reason: ${err}`);
          return;
        }
        log(`table '${DB_TABLE_NAME} dropped successfully'`);
      });

      // this.db.close((err) => {
      //   if (err) {
      //     log("error closing a cache db");
      //     reject();
      //     return;
      //   }
      //   log("cache db closed succesfully");
      //   resolve();
      // });
    });
  }

  async get(key: string): Promise<string | null> {
    return new Promise((resolve, reject) => {
      try {
        this.db.get<{ value: string } | undefined>(
          `SELECT value FROM ${DB_TABLE_NAME} ` + "WHERE key = ?",
          [key],
          (err, row) => {
            if (err) {
              log("error retrieving item from cache db. reason: ", err);
              throw new ServerError(
                "error retrieving item from cache db. reason: " + err,
                500
              );
            }
            resolve(row?.value || null);
          }
        );
      } catch (err) {
        reject(err);
      } finally {
        // this.db.close((err) => {
        //   if (err) {
        //     log("error closing a cache db");
        //     reject(err);
        //     return;
        //   }
        //   log("cache db closed succesfully");
        // });
      }
    });
  }

  async set(key: string, value: any): Promise<void> {
    return new Promise((resolve, reject) => {
      try {
        this.db.get<string | null>(
          `INSERT INTO ${DB_TABLE_NAME} (key, value)` +
            " VALUES (?, ?) ON CONFLICT DO UPDATE SET value = EXCLUDED.value;",
          [key, value],
          (err) => {
            if (err) {
              log("error inserting item into cache db. reason: ", err);
              throw new ServerError(
                "error inserting item into cache db. reason: " + err,
                500
              );
            }
            resolve();
          }
        );
      } catch (err) {
        reject(err);
      } finally {
        // this.db.close((err) => {
        //   if (err) {
        //     log("error closing a cache db");
        //     reject();
        //     return;
        //   }
        //   log("cache db closed succesfully");
        //   resolve();
        //   return;
        // });
      }
    });
  }
}
