import { ErrorBoundary } from "../middlewares/error.middleware.js";
import { v1AssessmentsRouter } from "./assessments.route.js";
import { v1CoursesRouter } from "./courses.route.js";
import { v1CreatorsRouter } from "./creators.route.js";
import { v1ExamsRouter } from "./exams.route.js";
import { v1StudentsRouter } from "./students.route.js";
import { v1QuizzesRouter } from "./quizzes.route.js";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import jwt from "jsonwebtoken";

import expressSession from "express-session";
import connectPgSimple from "connect-pg-simple";
import { pgPool } from "../../../db.utils.js";
import { serializeDeserializeUser } from "../middlewares/auth.middleware.js";
import { UserAuthPayloadType } from "../../../client.types.js";
import { CreatorModel } from "../../../models/v1/creator.model.js";
import { ServerError, checkPasswordAgainstHash, log } from "../../../utils.js";
import { StudentModel } from "../../../models/v1/student.model.js";
import { ServerPayloadType, SessionUserType } from "../../../types.js";
import { UserModel } from "../../../models/v1/user.model.js";

import v1Config from "../config.js";

// SERVICES
import Mailer from "../services/mail.service.js";
import Template from "../services/template.service.js";

// TASKS
import { initJob } from "../jobs/vacuum-users.job.js";
initJob();

const pgSession = connectPgSimple(expressSession);

export const v1Router = express.Router();

v1Router.use(
  expressSession({
    store: new pgSession({
      pool: new pgPool({
        host:
          process.env.CST_CONTEXT === "prod"
            ? process.env.CST_PROD_DB_HOST
            : process.env.CST_DB_HOST,
        user: process.env.CST_DB_USER,
        database:
          process.env.CST_CONTEXT === "test"
            ? process.env.CST_TEST_SESSION
            : process.env.CST_CONTEXT === "prod"
            ? process.env.CST_PROD_DB_NAME
            : process.env.CST_SESSION,
        max: 10,
        password: process.env.CST_CONTEXT === "prod"
        ? process.env.CST_PROD_DB_PASSWORD
        : process.env.CST_DB_PASSWORD,
        ...(process.env.CST_CONTEXT === "prod" ?  {ssl: {rejectUnauthorized: false}} : null),
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 50000,
      }),
      tableName: process.env.CST_CONTEXT === "prod" ? "sessions" : "users",
      createTableIfMissing: true,
    }),
    secret: process.env.CST_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, //  7 days
  })
);

v1Router.use(serializeDeserializeUser);

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

v1Router.use(async (req, res, next) => {
  console.log(
    `[${req.method}] TO: ${req.baseUrl}${
      req.url
    }, AT: ${new Date().toString()}, FROM: ${req.ip}`
  );
  next();
});

v1Router.use("/creators", v1CreatorsRouter);
v1Router.use("/courses", v1CoursesRouter);
v1Router.use("/students", v1StudentsRouter);
v1Router.use("/assessments", v1AssessmentsRouter);
v1Router.use("/exams", v1ExamsRouter);
v1Router.use("/quizzes", v1QuizzesRouter);

v1Router.get("/users/current", async (req, res, next) => {
  try {
    const { user } = req;

    let deserializedUser: Express.User & SessionUserType =
      user as Express.User & SessionUserType;

    const emptyPayload: ServerPayloadType<null> = {
      payload: null,
      message: "",
      user: undefined,
    };
    if (!user) return res.status(200).json(emptyPayload);

    const resInfo = await UserModel.search(
      deserializedUser.id,
      deserializedUser.role
    );

    const tmpPayload: ServerPayloadType<null> = {
      payload: null,
      message: "",
      user: { ...deserializedUser, ...resInfo },
    };
    return res.status(200).json(tmpPayload);
  } catch (err) {
    next(err);
  }
});

v1Router.get("/verify", async (req, res, next) => {
  try {
    const { query, user } = req;
    const { verification_id, user_id } = query;

    if (!verification_id || !user_id)
      throw new ServerError("you cannot verify with this credential", 400);
    jwt.verify(
      verification_id as string,
      v1Config.serverOptions.jwtSecret,
      async (err, decoded) => {
        if (err) throw new ServerError("invalid verification parameters", 401);
        const { creatorPass, verificationID, email } =
          await UserModel.getVerificationCredentials(user_id as string);
        if (verificationID === verification_id)
          await UserModel.validate(user_id as string);
        if (!creatorPass) {
          // student flow
          const resPayload: ServerPayloadType<null> = {
            message: "",
            payload: null,
            ...(() => (user ? ({ user } as Express.User) : null))(),
          };
          return res.status(200).json(resPayload);
        }
        const messageEmail = new Template({
          type: "creatorPass",
          data: { creatorPass },
        }).generate;
        Mailer.sendEmail(v1Config.serviceOptions.platformEmail, {
          html: messageEmail,
          subject: "creator pass from courseta",
          text: "Hi creator, below is your creator pass. you can now explore the platform :",
          to: email,
        });
        const resPayload: ServerPayloadType<null> = {
          message: "",
          payload: null,
          ...(() => (user ? ({ user } as Express.User) : null))(),
        };
        return res.status(200).json(resPayload);
      }
    );
  } catch (err) {
    next(err);
  }
});

v1Router.get("/*", (req, res) => {
  return res.status(404).json({ message: "endpoint not found" });
});

v1Router.use(ErrorBoundary);
