CREATE TABLE "session" (
  "sid" varchar NOT NULL PRIMARY KEY COLLATE "default" NOT DEFERRABLE INITIALLY IMMEDIATE,
  "sess" json NOT NULL,
  "expire" timestamp(6) NOT NULL
)
WITH (OIDS=FALSE);

CREATE INDEX IF NOT EXISTS "IDX_session_expire" ON "session" ("expire");
