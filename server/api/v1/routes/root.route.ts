import { ErrorBoundary } from "../middlewares/error.middleware.js";
import { v1AssessmentsRouter } from "./assessments.route.js";
import { v1StudentsRouter } from "./students.route.js";
import { v1CoursesRouter } from "./courses.route.js";
import { v1CreatorsRouter } from "./creators.route.js";
import express, { NextFunction, Request, Response } from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import expressSession from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pgPool } from "../../../db.utils.js";
import { serializeDeserializeUser } from "../middlewares/auth.middleware.js";
import { UserAuthPayloadType } from "../../../client.types.js";
import { CreatorModel } from "../../../models/v1/creator.model.js";
import { ServerError, checkPasswordAgainstHash } from "../../../utils.js";
import { StudentModel } from "../../../models/v1/student.model.js";

const pgSession = connectPgSimple(expressSession);

export const v1Router = express.Router();

v1Router.use(
  expressSession({
    store: new pgSession({
      pool: new pgPool({
        host: process.env.CST_DB_HOST,
        user: process.env.CST_DB_USER,
        database:
          process.env.CST_CONTEXT === "test"
            ? process.env.CST_TEST_SESSION
            : process.env.CST_SESSION,
        max: 10,
        password: process.env.CST_DB_PASSWORD,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 50000,
      }),
      tableName: "users",
      createTableIfMissing: true,
    }),
    secret: process.env.CST_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, //  7 days
  })
);

passport.use(
  "creators_local",
  new LocalStrategy(
    {
      passwordField: "password",
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      try {
        console.log("hit the creators local");
        const creatorAuthPayload: UserAuthPayloadType =
          req.body as UserAuthPayloadType;
        const { creatorPass } = creatorAuthPayload;
        const resultCreator = await CreatorModel.lookUp(email);
        if (!resultCreator)
          return done(new ServerError("invalid credentials!", 401));
        // return done(null, false);
        const {
          creatorPass: resultCreatorPass,
          password: hashedPassword,
          salt,
        } = resultCreator;
        if (creatorPass !== resultCreatorPass)
          return done(new ServerError("invalid creator pass!", 401));
        // return done(null, false);
        if (!(await checkPasswordAgainstHash(password, hashedPassword, salt)))
          return done(new ServerError("invalid credentials!", 401));
        // return done(null, false);
        return done(null, {
          email,
          id: resultCreator.id,
          role: "creator",
        });
      } catch (err) {
        done(err);
      }
    }
  )
);

passport.use(
  "students_local",
  new LocalStrategy(
    {
      passwordField: "password",
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      console.log("hit the students local");
      const resultStudent = await StudentModel.lookUp(email);
      if (!resultStudent)
        return done(new ServerError("invalid credentials!", 401));
      const { password: hashedPassword, salt } = resultStudent;
      if (!(await checkPasswordAgainstHash(password, hashedPassword, salt)))
        return done(new ServerError("invalid credentials!", 401));
      return done(null, {
        email,
        id: resultStudent.id,
        role: "student",
      });
    }
  )
);

v1Router.use(passport.initialize());
v1Router.use(passport.session());
v1Router.use(serializeDeserializeUser);

v1Router.use("/creators", v1CreatorsRouter);
v1Router.use("/courses", v1CoursesRouter);
v1Router.use("/students", v1StudentsRouter);
v1Router.use("/assessments", v1AssessmentsRouter);

v1Router.use(async (req, res, next) => {
  console.log(`[${req.method}]: ${req.baseUrl}${req.url}`);
  next();
});

v1Router.get("/", async (req, res, next) => {
  try {
    return res.status(200).json({ message: "welcome" });
  } catch (err) {
    next(err);
  }
});

v1Router.get("/*", (req, res) => {
  return res.status(404).json({ message: "endpoint not found" });
});

v1Router.use(ErrorBoundary);
