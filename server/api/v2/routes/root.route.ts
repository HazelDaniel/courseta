import { ErrorBoundary } from "../middlewares/error.middleware.js";
import { v2AssessmentsRouter } from "./assessments.route.js";
import { v2CoursesRouter } from "./courses.route.js";
import { v2CreatorsRouter } from "./creators.route.js";
import { v2ExamsRouter } from "./exams.route.js";
import { v2StudentsRouter } from "./students.route.js";
import { v2QuizzesRouter } from "./quizzes.route.js";
import express from "express";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";

import expressSession from "express-session";
import RedisStore from "connect-redis";
import { SqliteCache } from './../dao/route-cache.dao.js';
import GlobalRouteCache from "express-pubsubcache";

import { createClient } from "redis";
import { serializeDeserializeUser } from "../middlewares/auth.middleware.js";
import { UserAuthPayloadType } from "../../../client.types.js";
import { CreatorModel } from "../../../models/v1/creator.model.js";
import { ServerError, checkPasswordAgainstHash, log } from "../../../utils.js";
import { StudentModel } from "../../../models/v1/student.model.js";

import v2Config from "../config.js";

// TASKS
import { initJob } from "../jobs/vacuum-users.job.js";
import { getCurrentUser } from "../controllers/root/get-current-user.js";
import { verifyUser } from "../controllers/root/verify-user.js";
initJob();

const redisClient = createClient({ url: v2Config.authOptions.redisStoreURL });
(async () => {
  await redisClient.connect();
})();

redisClient.on("connect", () => {
  log("redis connected sucessfully");
});

redisClient.on("error", (err) => {
  log("redis failed to connect: reason", err);
});

const redisStore = new RedisStore({
  client: redisClient,
  prefix: "courseta_session:",
});

GlobalRouteCache.configureGlobalCache(() => new SqliteCache());

export const v2Router = express.Router();

v2Router.use(
  expressSession({
    store: redisStore,
    secret: process.env.CST_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 7 * 24 * 60 * 60 * 1000 }, //  7 days
  })
);

v2Router.use(serializeDeserializeUser);

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

v2Router.use(passport.initialize());
v2Router.use(passport.session());

v2Router.use(async (req, res, next) => {
  console.log(
    `[${req.method}] TO: ${req.baseUrl}${
      req.url
    }, AT: ${new Date().toString()}, FROM: ${req.ip}`
  );
  next();
});

v2Router.use("/creators", v2CreatorsRouter);
v2Router.use("/courses", v2CoursesRouter);
v2Router.use("/students", v2StudentsRouter);
v2Router.use("/assessments", v2AssessmentsRouter);
v2Router.use("/exams", v2ExamsRouter);
v2Router.use("/quizzes", v2QuizzesRouter);

// ROUTE HANDLERS
v2Router.get("/users/current", async (req, res, next) => {
  try {
    return await getCurrentUser(req, res);
  } catch (err) {
    next(err);
  }
});

v2Router.get("/verify", async (req, res, next) => {
  try {
    return await verifyUser(req, res);
  } catch (err) {
    next(err);
  }
});

v2Router.get("/*", (req, res) => {
  return res.status(404).json({ message: "endpoint not found" });
});

v2Router.use(ErrorBoundary);
