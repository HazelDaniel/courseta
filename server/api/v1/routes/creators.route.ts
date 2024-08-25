import { randomUUID } from "crypto";
import express, { Request } from "express";
import passport from "passport";
import {
  creatorIDProtected,
  creatorsLocalProtected,
} from "../middlewares/auth.middleware.js";

import type {
  AssessmentEditPayloadType,
  CourseCreationPayloadType,
  CourseEditPayloadType,
  ExamCreationPayloadType,
  ImageCreationPayloadType,
  LessonAdditionPayloadType,
  LessonContentAdditionPayloadType,
  QuizCreationPayloadType,
  UserAuthPayloadType,
} from "../../../client.types";
import type {
  CreatorAttributeUpdateType,
  CreatorSessionUserType,
  ServerPayloadType,
} from "../../../types.d.ts";
import { ServerError } from "../../../utils.js";
import { CourseModel } from "../../../models/v1/course.model.js";
import { LessonModel } from "../../../models/v1/lesson.model.js";
import { LessonContentModel } from "../../../models/v1/lesson-content.model.js";
import { QuizModel } from "../../../models/v1/quiz.model.js";
import { CreatorModel } from "../../../models/v1/creator.model.js";
import { UserModel } from "../../../models/v1/user.model.js";
import { ExamModel } from "../../../models/v1/exam.model.js";
import { QuestionModel } from "../../../models/v1/question.model.js";
import { AnswerModel } from "../../../models/v1/answer.model.js";
import fetch from "node-fetch";
import v1Config from "../config.js";
import { AssessmentModel } from "../../../models/v1/assessment.model.js";

export const v1CreatorsRouter = express.Router();

// ROUTER MIDDLEWARES

v1CreatorsRouter.use(passport.initialize());
// v1CreatorsRouter.use(serializeDeserializeUser);

// ROUTE HANDLERS (AUTH)

v1CreatorsRouter.post("/auth/signup", async (req, res, next) => {
  try {
    const creatorAuthPayload: UserAuthPayloadType =
      req.body as UserAuthPayloadType;
    const { user } = req;
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
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(201).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CreatorsRouter.post(
  "/auth/login",
  passport.authenticate("creators_local"),
  async (req, res, next) => {
    try {
      const { user } = req;
      const resPayload: ServerPayloadType<string> = {
        message: "user authenticated successfully!",
        ...(() => (user ? ({ user } as Express.User) : null))(),
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.use(creatorsLocalProtected);

// ROUTE HANDLERS (PROTECTED)

v1CreatorsRouter.get(
  "/:creator_id/courses",
  creatorIDProtected,
  async (req, res, next) => {
    const creatorID = req.params.creator_id;
    try {
      const { user } = req;
      const resCourses = await CourseModel.all({
        variant: "creator",
        creatorID,
      });
      const resPayload: ServerPayloadType<typeof resCourses> = {
        payload: resCourses,
        message: null,
        ...(() => (user ? ({ user } as Express.User) : null))(),
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.get(
  "/:creator_id/courses/top",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { user } = req;
      const { creator_id: creatorID } = req.params;
      const resCourses = await CourseModel.getTopCoursesFor(creatorID);
      const resPayload: ServerPayloadType<typeof resCourses> = {
        payload: resCourses,
        message: null,
        ...(() => (user ? ({ user } as Express.User) : null))(),
      };
      return res.status(200).json(resPayload);
    }
    catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.get(
  "/:creator_id/courses/:course_id/edit",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { user } = req;
      const { course_id: courseID } = req.params;
      const resData = await CourseModel.fetchForEdit(+courseID);
      const resPayload: ServerPayloadType<typeof resData> = {
        message: null,
        payload: resData,
        ...(() => (user ? ({ user } as Express.User) : null))(),
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
      const { user } = req;
      const resData = await CourseModel.getLessonsFor(+courseID, "edit");
      const resPayload: ServerPayloadType<typeof resData> = {
        message: null,
        payload: resData,
        ...(() => (user ? ({ user } as Express.User) : null))(),
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.get(
  "/:creator_id/assessments/:assessment_id/edit",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { assessment_id: assessmentID } = req.params;
      const { user } = req;
      const resData = await AssessmentModel.fetchForCourseEdit(assessmentID);
      const resPayload: ServerPayloadType<typeof resData> = {
        message: null,
        payload: resData,
        ...(() => (user ? ({ user } as Express.User) : null))(),
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.get(
  "/:creator_id/courses/:course_id/exam/edit",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { course_id: courseID } = req.params;
      const { user } = req;
      const resData = await ExamModel.fetchForEdit(+courseID);
      const resPayload: ServerPayloadType<typeof resData> = {
        message: null,
        payload: resData,
        ...(() => (user ? ({ user } as Express.User) : null))(),
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
        courseTitle,
        courseImage
      );
      const resPayload: ServerPayloadType<typeof resultCourse> = {
        payload: resultCourse,
        message: "course update success!",
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
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
      try {
        await UserModel.updateFields(updatePayload, "creator");
      } catch (err) {
        throw new ServerError(
          `could not update fields, check inputs and try again!`,
          400
        );
      }
      const resPayload: ServerPayloadType<string> = {
        message: "success!",
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
      };
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
        pendingQuestion.save();
      }
      for (let k = 0; k < trashQuestionIDList.length; k++) {
        QuestionModel.trashData(trashQuestionIDList[k]);
      }

      await QuestionModel.saveAll();
      const resPayload: ServerPayloadType<string> = {
        message: "success!",
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
      };
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
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
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
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
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
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
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
      const { contentType, duration, href, title } = contentCreationPayload;
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
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
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
      const generatedImageID = randomUUID();
      const pendingCourse = new CourseModel(
        courseTitle || "",
        courseDescription || "",
        courseThumbnail,
        creatorID,
        tags,
        undefined,
        undefined,
        undefined,
        generatedImageID
      );
      let imageUploadRequest: any = null;
      const imageUploadpayload: ImageCreationPayloadType = {
        id: generatedImageID,
        imageUrl: courseImage,
      };
      if (!!courseImage)
        imageUploadRequest = await fetch(
          v1Config.serverOptions.imageServerBaseUrl,
          {
            headers: {
              "Content-Type": "application/json",
              Cookie: "",
            },
            method: "post",
            body: JSON.stringify(imageUploadpayload),
          }
        );

      if (
        !imageUploadRequest ||
        (imageUploadRequest && imageUploadRequest.ok)
      ) {
        const courseID = await pendingCourse.save(creatorID);
        const resPayload: ServerPayloadType<number> = {
          payload: courseID,
          message: "course creation success!",
          ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
        };
        return res.status(201).json(resPayload);
      } else {
        if (
          imageUploadRequest.status - 400 < 99 &&
          imageUploadRequest.status >= 400
        )
          throw new ServerError("could not upload image!. check inputs ", 400);
        else
          throw new ServerError(
            "something went wrong uploading the image. please try again.",
            imageUploadRequest.status
          );
      }
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
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
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
        message: "course archived successfully!",
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
      };
      return res.status(204).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/:creator_id/courses/:course_id/unarchive",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { creator_id: creatorID, course_id: courseID } = req.params;
      await CourseModel.unarchive(+courseID, creatorID);
      const resPayload: ServerPayloadType<string> = {
        message: "course unarchived successfully!",
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
      };
      return res.status(200).json(resPayload);
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
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
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
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
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
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
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
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
      };
      return res.status(204).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.delete(
  "/:creator_id/courses/:course_id/lessons/:lesson_id",
  creatorIDProtected,
  async (req, res, next) => {
    try {
      const { lesson_id: lessonID } = req.params;
      await LessonModel.delete(+lessonID);
      const resPayload: ServerPayloadType<string> = {
        message: "lesson deleted successfully!",
        ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
      };
      return res.status(204).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);
