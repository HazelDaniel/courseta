import { randomUUID } from "crypto";
import express, { Request } from "express";
import expressSession from "express-session";
import connectPgSimple from "connect-pg-simple";
import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import pg from "pg";
import {
  creatorIDProtected,
  localProtected,
} from "../middlewares/auth.middleware.js";

import type {
  AssessmentEditPayloadType,
  CourseCreationPayloadType,
  CourseEditPayloadType,
  ExamCreationPayloadType,
  LessonAdditionPayloadType,
  LessonContentAdditionPayloadType,
  QuizCreationPayloadType,
  UserAuthPayloadType,
} from "../../../client.types";
import type {
  CreatorAttributeUpdateType,
  CreatorAuthResponseType,
  CreatorSessionUserType,
  ServerPayloadType,
} from "../../../types";
import { ServerError, checkPasswordAgainstHash } from "../../../utils.js";
import { CourseModel } from "../../../models/v1/course.model.js";
import { LessonModel } from "../../../models/v1/lesson.model.js";
import { LessonContentModel } from "../../../models/v1/lesson-content.model.js";
import { QuizModel } from "../../../models/v1/quiz.model.js";
import { CreatorModel } from "../../../models/v1/creator.model.js";
import { UserModel } from "../../../models/v1/user.model.js";
import { ExamModel } from "../../../models/v1/exam.model.js";
import { QuestionModel } from "../../../models/v1/question.model.js";
import { AnswerModel } from "../../../models/v1/answer.model.js";

const pgPool = new pg.Pool({
  host: process.env.CST_DB_HOST,
  user: process.env.CST_DB_USER,
  database:
    process.env.CST_CONTEXT === "test"
      ? process.env.CST_TEST_SESSION
      : process.env.CST_SESSION,
  max: 20,
  password: process.env.CST_DB_PASSWORD,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 50000,
});

export const v1CreatorsRouter = express.Router();
const pgSession = connectPgSimple(expressSession);
v1CreatorsRouter.use(
  expressSession({
    store: new pgSession({
      pool: pgPool,
      tableName: "creators",
      createTableIfMissing: true,
    }),
    secret: process.env.CST_SESSION_SECRET as string,
    resave: false,
    saveUninitialized: false,
    cookie: { maxAge: 24 * 60 * 60 * 1000 }, //  1 day
  })
);

passport.use(
  new LocalStrategy(
    {
      passwordField: "password",
      usernameField: "email",
      passReqToCallback: true,
    },
    async (req, email, password, done) => {
      const creatorAuthPayload: UserAuthPayloadType =
        req.body as UserAuthPayloadType;
      const { creatorPass } = creatorAuthPayload;
      const resultCreator = await CreatorModel.lookUp(email);
      if (!resultCreator)
        return done(new ServerError("invalid credentials!", 401));
      const {
        creatorPass: resultCreatorPass,
        password: hashedPassword,
        salt,
      } = resultCreator;
      if (creatorPass !== resultCreatorPass)
        return done(new ServerError("invalid creator pass!", 401));
      if (!(await checkPasswordAgainstHash(password, hashedPassword, salt)))
        return done(new ServerError("invalid credentials!", 401));
      return done(null, { email, ...resultCreator });
    }
  )
);

passport.serializeUser<CreatorSessionUserType>(async (user, callback) => {
  const response: CreatorAuthResponseType & { email: string } = user as any;
  process.nextTick(function () {
    callback(null, { id: response.creatorID, email: response.email });
  });
});

passport.deserializeUser(function (user, callback) {
  process.nextTick(function () {
    callback(null, user as any);
  });
});

// ROUTER MIDDLEWARES

v1CreatorsRouter.use(passport.session());
v1CreatorsRouter.use(passport.initialize());

// ROUTE HANDLERS (AUTH)

v1CreatorsRouter.post("/auth/signup", async (req, res, next) => {
  try {
    const creatorAuthPayload: UserAuthPayloadType =
      req.body as UserAuthPayloadType;
    const { email, firstName, lastName, password } = creatorAuthPayload;
    const pendingCreator = new CreatorModel(
      email,
      password,
      firstName,
      lastName
    );
    await pendingCreator.save();
    const resPayload: ServerPayloadType<string> = {
      message: "user registered successfully!",
    };
    return res.status(201).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CreatorsRouter.post(
  "/auth/login",
  passport.authenticate("local"),
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

v1CreatorsRouter.use(localProtected);

// ROUTE HANDLERS (PROTECTED)

v1CreatorsRouter.get(
  "/:creator_id/courses",
  creatorIDProtected,
  async (req, res, next) => {
    const creatorID = req.params.creator_id;
    try {
      const resCourses = await CourseModel.all({
        variant: "creator",
        creatorID,
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

v1CreatorsRouter.get(
  "/:creator_id/courses/:course_id/edit",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { course_id: courseID } = req.params;
      const resData = await CourseModel.fetchForEdit(+courseID);
      const resPayload: ServerPayloadType<typeof resData> = {
        message: null,
        payload: resData,
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.get(
  "/:creator_id/courses/:course_id/lessons/edit",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { course_id: courseID } = req.params;
      const resData = await LessonModel.fetchForCourseEdit(+courseID);
      const resPayload: ServerPayloadType<typeof resData> = {
        message: null,
        payload: resData,
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.get(
  "/:creator_id/me",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const creatorEmail = (req.user as CreatorSessionUserType).email;
      const resCreator = await CreatorModel.getProfile(creatorEmail);
      const resPayload: ServerPayloadType<typeof resCreator> = {
        payload: resCreator,
        message: null,
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.put(
  "/:creator_id/courses/:course_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const creatorID = req.params.creator_id;
      const courseID = req.params.course_id;
      const courseEditPayload: CourseEditPayloadType =
        req.body as CourseEditPayloadType;
      const courseTitle = courseEditPayload.info?.title;
      const courseDescription = courseEditPayload.info?.description;
      const [courseThumbnail, courseImage] = courseEditPayload.images as [
        string,
        string
      ];
      const tags = courseEditPayload.info?.tags as string;
      const resultCourse = await CourseModel.updateFields(
        +courseID,
        courseThumbnail,
        courseDescription,
        tags,
        randomUUID(),
        courseTitle
      );
      const resPayload: ServerPayloadType<typeof resultCourse> = {
        payload: resultCourse,
        message: "course update success!",
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.put(
  "/:creator_id/me",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const creatorID = req.params.creator_id;
      const updatePayload: CreatorAttributeUpdateType = {
        ...(req.body as CreatorAttributeUpdateType),
        userID: creatorID,
      };
      // console.log("update payload is ");
      // console.table(updatePayload);
      try {
        await UserModel.updateFields(updatePayload);
      } catch (err) {
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

v1CreatorsRouter.put(
  "/:creator_id/assessments/:assessment_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { assessment_id: assessmentID } = req.params;
      const assessmentUpdatePayload: AssessmentEditPayloadType =
        req.body as AssessmentEditPayloadType;
      const {
        answerDataList,
        questionDataList,
        trashQuestionIDList,
        parentEntityID,
      } = assessmentUpdatePayload;
      let ranOnce: boolean = false;
      for (let i = 0; i < questionDataList.length; i++) {
        const entryQuestion = questionDataList[i];
        const { points, positionID, questionText } = entryQuestion;
        const pendingQuestion = new QuestionModel(
          questionText,
          points,
          positionID,
          assessmentID,
          undefined,
          undefined,
          parentEntityID
        );
        for (let j = 0; j < answerDataList.length; j++) {
          const entryAnswer = answerDataList[j];
          const { answerText, isCorrect, questionPositionID } = entryAnswer;
          if (questionPositionID === positionID) {
            const pendingAnswer = new AnswerModel(
              answerText,
              isCorrect,
              questionPositionID
            );
            pendingQuestion.answersData = pendingAnswer;
          }
        }
        if (!ranOnce)
          for (let k = 0; k < trashQuestionIDList.length; k++) {
            pendingQuestion.trashData = trashQuestionIDList[k];
            ranOnce = true;
          }
        pendingQuestion.save();
      }

      await QuestionModel.saveAll();
      const resPayload: ServerPayloadType<string> = { message: "success!" };
      res.status(201).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/:creator_id/courses/:course_id/lessons/",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const creatorID = req.params.creator_id;
      const courseID = req.params.course_id;
      const lessonAdditionpayload: LessonAdditionPayloadType =
        req.body as LessonAdditionPayloadType;
      for (let i = 0; i < lessonAdditionpayload.lessonData.length; i++) {
        const lessonEl = lessonAdditionpayload.lessonData[i];
        const pendingLesson = new LessonModel(
          lessonEl.title,
          lessonEl.positionID,
          +courseID
        );
        for (
          let j = 0;
          j < lessonAdditionpayload.lessonContentData.length;
          j++
        ) {
          const contentEl = lessonAdditionpayload.lessonContentData[j];
          const { contentType, duration, href, lessonPositionID, title } =
            contentEl;
          if (contentEl.lessonPositionID === lessonEl.positionID) {
            const pendingLessonContent = new LessonContentModel(
              title,
              href,
              contentType,
              duration,
              lessonEl.positionID
            );
            pendingLesson.lessonContentData = pendingLessonContent;
          }
        }
        for (let k = 0; k < lessonAdditionpayload.lessonQuizData.length; k++) {
          const quizEl = lessonAdditionpayload.lessonQuizData[k];
          const { description, lessonPositionID, passScore, quizTitle } =
            quizEl;
          if (quizEl.lessonPositionID === lessonEl.positionID) {
            const pendingQuiz = new QuizModel(
              quizTitle,
              description,
              passScore,
              lessonPositionID
            );
            pendingLesson.lessonQuizData = pendingQuiz;
          }
        }
        pendingLesson.save();
      }
      await LessonModel.saveAll();

      const resPayload: ServerPayloadType<string> = {
        message: "success!",
      };
      return res.status(201).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/:creator_id/courses/:course_id/lessons/:lesson_id/quizzes",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { lesson_id: lessonID } = req.params;
      const quizCreationPayload: QuizCreationPayloadType =
        req.body as QuizCreationPayloadType;
      const { quizTitle, description, passScore } = quizCreationPayload;
      const pendingLesson = new LessonModel(
        "",
        undefined,
        undefined,
        undefined,
        +lessonID
      );
      const resID = await pendingLesson.addQuiz(
        quizTitle,
        description || "",
        passScore || 0
      );
      const resPayload: ServerPayloadType<typeof resID> = {
        payload: resID,
        message: "quiz creation success!",
      };
      res.status(201).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/:creator_id/courses/:course_id/exams/",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { course_id: courseID } = req.params;
      const examCreationPayload: ExamCreationPayloadType =
        req.body as ExamCreationPayloadType;
      const { description, duration, startDate, endDate, passScore } =
        examCreationPayload;
      const currDate = new Date().toISOString();
      const pendingExam = new ExamModel(
        +courseID,
        passScore || 0,
        description || "",
        duration || 0,
        startDate || currDate,
        endDate || currDate
      ); // TODO: make sure that these are passed using validation. do not help the client
      const examID = await pendingExam.save();
      const resPayload: ServerPayloadType<typeof examID> = {
        payload: examID,
        message: "exam creation success!",
      };
      res.status(201).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/:creator_id/courses/:course_id/lessons/:lesson_id/contents",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { lesson_id: lessonID } = req.params;
      const contentCreationPayload: LessonContentAdditionPayloadType =
        req.body as LessonContentAdditionPayloadType;
      const {
        contentType,
        duration,
        href,
        title,
      } = contentCreationPayload;
      const pendingLesson = new LessonModel(
        "",
        undefined,
        undefined,
        undefined,
        +lessonID
      );
      const resID = await pendingLesson.addContent(
        title || "",
        href || "",
        duration || 0,
        contentType
      );

      const resPayload: ServerPayloadType<typeof resID> = {
        payload: resID,
        message: "content created successfully!",
      };
      res.status(201).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/:creator_id/courses",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const creatorID = req.params.creator_id;
      const courseCreationPayload: CourseCreationPayloadType =
        req.body as CourseCreationPayloadType;
      const courseTitle = courseCreationPayload.info?.title;
      const courseDescription = courseCreationPayload.info?.description;
      const [courseThumbnail, courseImage] = courseCreationPayload.images as [
        string,
        string
      ];
      const tags = courseCreationPayload.info?.tags as string;
      const pendingCourse = new CourseModel(
        courseTitle || "",
        courseDescription || "",
        courseThumbnail,
        creatorID,
        tags,
        undefined,
        undefined,
        undefined,
        randomUUID()
      );
      const courseID = await pendingCourse.save(creatorID);
      const resPayload: ServerPayloadType<number> = {
        payload: courseID,
        message: "course creation success!",
      };
      return res.status(201).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/:creator_id/logout",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      req.logOut((err) => {
        if (err) return next(err);
        return res.status(200).json();
      });
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/pass/:creator_id/new",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { creator_id: creatorID } = req.params;
      const resultPass = await CreatorModel.requestPass(creatorID);
      const resPayload: ServerPayloadType<string> = {
        payload: resultPass,
        message: "creator pass update success!",
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/:creator_id/courses/:course_id/archive",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { creator_id: creatorID, course_id: courseID } = req.params;
      await CourseModel.archive(+courseID, creatorID);
      const resPayload: ServerPayloadType<string> = {
        message: "course archive successfully!",
      };
      return res.status(204).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.delete(
  "/:creator_id/courses/:course_id/exams/:exam_id/",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { course_id: courseID } = req.params;
      await ExamModel.delete(+courseID);
      const resPayload: ServerPayloadType<string> = {
        message: "exam deleted successfully!",
      };
      return res.status(204).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.delete(
  "/:creator_id/courses/:course_id/lessons/:lesson_id/quizzes/:quiz_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { lesson_id: lessonID } = req.params;
      await QuizModel.delete(+lessonID);
      const resPayload: ServerPayloadType<string> = {
        message: "quiz deleted successfully!",
      };
      return res.status(204).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.delete(
  "/:creator_id/courses/:course_id/lessons/:lesson_id/contents/:content_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { lesson_id: lessonID, content_id: contentID } = req.params;
      await LessonContentModel.delete(+lessonID, +contentID);
      const resPayload: ServerPayloadType<string> = {
        message: "content deleted successfully!",
      };
      return res.status(204).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.delete(
  "/:creator_id/courses/:course_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { creator_id: creatorID, course_id: courseID } = req.params;
      await CourseModel.delete(+courseID, creatorID);
      const resPayload: ServerPayloadType<string> = {
        message: "course deleted successfully!",
      };
      return res.status(204).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

