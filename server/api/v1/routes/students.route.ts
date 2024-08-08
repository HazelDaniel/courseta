import express, { Request } from "express";
import expressSession from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { pgPool } from "../../../db.utils.js";
import { UserAuthPayloadType } from "../../../client.types";
import { StudentModel } from "../../../models/v1/student.model.js";
import { ServerError, checkPasswordAgainstHash } from "../../../utils.js";
import type {
  CourseViewType,
  ServerPayloadType,
  StudentAttributeUpdateType,
  StudentAuthResponseType,
  StudentSessionUserType,
} from "../../../types";
import { CourseModel } from "../../../models/v1/course.model.js";
import { UserModel } from "../../../models/v1/user.model.js";
import { AssessmentModel } from "../../../models/v1/assessment.model.js";
import {
  studentIDProtected,
  serializeDeserializeUser,
  studentsLocalProtected,
} from "../middlewares/auth.middleware.js";

export const v1StudentsRouter = express.Router();

const pgSession = connectPgSimple(expressSession);
v1StudentsRouter.use(
  expressSession({
    store: new pgSession({
      pool: new pgPool({
        host: process.env.CST_DB_HOST,
        user: process.env.CST_DB_USER,
        database:
          process.env.CST_CONTEXT === "test"
            ? process.env.CST_STUDENT_TEST_SESSION
            : process.env.CST_STUDENT_SESSION,
        max: 10,
        password: process.env.CST_DB_PASSWORD,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 50000,
      }),
      tableName: "students",
      createTableIfMissing: true,
    }),
    secret: process.env.CST_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //  1 day
  })
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

v1StudentsRouter.use(passport.initialize());
v1StudentsRouter.use(passport.session());
v1StudentsRouter.use(serializeDeserializeUser);

v1StudentsRouter.post("/auth/signup", async (req, res, next) => {
  try {
    const creatorAuthPayload: UserAuthPayloadType =
      req.body as UserAuthPayloadType;
    const { email, firstName, lastName, password } = creatorAuthPayload;
    const pendingStudent = new StudentModel(
      email,
      password,
      firstName,
      lastName
    );
    await pendingStudent.save();
    const resPayload: ServerPayloadType<string> = {
      message: "user registered successfully!",
    };
    return res.status(201).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1StudentsRouter.post(
  "/auth/login",
  passport.authenticate("students_local"),
  async (req, res, next) => {
    try {
      const resPayload: ServerPayloadType<string> = {
        message: "user authenticated successfully!",
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1StudentsRouter.use(studentsLocalProtected);

v1StudentsRouter.get(
  "/:student_id/courses",
  studentIDProtected,
  async (req, res, next) => {
    const { student_id: studentID } = req.params;
    try {
      const resCourses = await CourseModel.all({
        variant: "student",
        studentID,
      });
      const resPayload: ServerPayloadType<typeof resCourses> = {
        payload: resCourses,
        message: null,
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1StudentsRouter.get(
  "/:student_id/courses/recommended",
  studentIDProtected,
  async (req, res, next) => {
    try {
      const { student_id: studentID } = req.params;
      const recommendedCourses = await CourseModel.allRecommended(studentID);
      const resPayload: ServerPayloadType<typeof recommendedCourses> = {
        message: null,
        payload: recommendedCourses,
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1StudentsRouter.get(
  "/:student_id/courses/unfinished",
  studentIDProtected,
  async (req, res, next) => {
    try {
      const { student_id: studentID } = req.params;
      const unfinishedCourses = await CourseModel.allRecentUnfinished(
        studentID
      );
      const resPayload: ServerPayloadType<typeof unfinishedCourses> = {
        message: null,
        payload: unfinishedCourses,
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1StudentsRouter.get(
  "/:student_id/reports",
  studentIDProtected,
  async (req, res, next) => {
    try {
      const { student_id: studentID } = req.params;
      const reports = await AssessmentModel.getAssessmentsReportFor(studentID);
      const resPayload: ServerPayloadType<typeof reports> = {
        message: null,
        payload: reports,
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1StudentsRouter.get(
  "/:student_id/me",
  studentIDProtected,
  async (req, res, next) => {
    try {
      const studentEmail = (req.user as StudentSessionUserType).email;
      const resStudent = await StudentModel.getProfile(studentEmail);
      const resPayload: ServerPayloadType<typeof resStudent> = {
        payload: resStudent,
        message: null,
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1StudentsRouter.put(
  "/:student_id/me",
  studentIDProtected,
  async (req, res, next) => {
    try {
      const { student_id: studentID } = req.params;
      const updatePayload: StudentAttributeUpdateType = {
        ...(req.body as StudentAttributeUpdateType),
        userID: studentID,
      };
      try {
        await UserModel.updateFields(updatePayload, "student");
      } catch (err) {
        console.error(err);
        throw new ServerError(
          "could not update fields, check inputs and try again!",
          400
        );
      }
      const resPayload: ServerPayloadType<string> = { message: "success!" };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);
