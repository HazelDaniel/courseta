import { randomUUID } from "crypto";
import express from "express";
import type {
  CourseCreationPayloadType,
  CourseEditPayloadType,
  LessonAdditionPayloadType,
  LessonContentAdditionPayloadType,
  QuizCreationPayloadType,
  UserAuthPayloadType,
} from "../../../client.types";
import { CourseModel } from "../../../models/v1/course.model.js";
import type {
  CreatorAttributeUpdateType,
  ServerPayloadType,
} from "../../../types";
import { LessonModel } from "../../../models/v1/lesson.model.js";
import { LessonContentModel } from "../../../models/v1/lesson-content.model.js";
import { QuizModel } from "../../../models/v1/quiz.model.js";
import { CreatorModel } from "../../../models/v1/creator.model.js";
import { checkPasswordAgainstHash } from "../../../utils.js";
import { UserModel } from "../../../models/v1/user.model.js";
export const v1CreatorsRouter = express.Router();

v1CreatorsRouter.get("/:creator_id/courses", async (req, res, next) => {
  const creatorID = req.params.creator_id;
  try {
    const resCourses = await CourseModel.all({ variant: "creator", creatorID });
    const resPayload: ServerPayloadType<typeof resCourses> = {
      payload: resCourses,
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CreatorsRouter.get("/:creator_id/me", async (req, res, next) => {
  try {
    const creatorEmail = process.env.CST_TEST_USER_EMAIL || ""; // hard coded, will be extracted from jwt
    const resCreator = await CreatorModel.getProfile(creatorEmail);
    const resPayload: ServerPayloadType<typeof resCreator> = {
      payload: resCreator,
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CreatorsRouter.put(
  "/:creator_id/courses/:course_id",
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
      };
      return res.status(200).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.put("/:creator_id/me", async (req, res, next) => {
  try {
    const creatorID = req.params.creator_id;
    const updatePayload: CreatorAttributeUpdateType = {
      ...(req.body as CreatorAttributeUpdateType),
      userID: creatorID,
    };
    console.log("update payload is ");
    console.table(updatePayload);
    await UserModel.updateFields(updatePayload);
    const resPayload: ServerPayloadType<string> = { payload: "success!" };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CreatorsRouter.post(
  "/:creator_id/courses/:course_id/lessons/",
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
        payload: "success!",
      };
      return res.status(201).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/:creator_id/courses/:course_id/lessons/:lesson_id/quizzes",
  async (req, res, next) => {
    try {
      const { lesson_id: lessonID } = req.params;
      const quizCreationPayload: QuizCreationPayloadType =
        req.body as QuizCreationPayloadType;
      const { quizTitle, description, parentEntityID, passScore } =
        quizCreationPayload;
      const pendingLesson = new LessonModel(
        "",
        undefined,
        undefined,
        undefined,
        parentEntityID
      );
      const resID = await pendingLesson.addQuiz(
        quizTitle,
        description || "",
        passScore || 0
      );
      const resPayload: ServerPayloadType<typeof resID> = { payload: resID };
      res.status(201).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post(
  "/:creator_id/courses/:course_id/lessons/:lesson_id/contents",
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
        lessonID: contentLessonID,
      } = contentCreationPayload;
      const pendingLesson = new LessonModel(
        "",
        undefined,
        undefined,
        undefined,
        contentLessonID
      );
      const resID = await pendingLesson.addContent(
        title || "",
        href || "",
        duration || 0,
        contentType
      );

      const resPayload: ServerPayloadType<typeof resID> = { payload: resID };
      res.status(201).json(resPayload);
    } catch (err) {
      next(err);
    }
  }
);

v1CreatorsRouter.post("/:creator_id/courses", async (req, res, next) => {
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
    const resPayload: ServerPayloadType<number> = { payload: courseID };
    return res.status(201).json(resPayload);
  } catch (err) {
    next(err);
  }
});

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
    const resPayload: ServerPayloadType<string> = { payload: "success!" };
    return res.status(201).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1CreatorsRouter.post("/auth/login", async (req, res, next) => {
  try {
    const creatorAuthPayload: UserAuthPayloadType =
      req.body as UserAuthPayloadType;
    const { email, firstName, lastName, password, rememberMe, creatorPass } =
      creatorAuthPayload;
    const resultCreator = await CreatorModel.lookUp(email);
    if (!resultCreator) {
      const resPayload: ServerPayloadType<string> = {
        payload: "invalid credentials !",
      };
      return res.status(401).json(resPayload);
    }
    const {
      creatorPass: resultCreatorPass,
      password: hashedPassword,
      salt,
    } = resultCreator;
    if (creatorPass !== resultCreatorPass) {
      const resPayload: ServerPayloadType<string> = {
        payload: "invalid creator pass!",
      };
      return res.status(401).json(resPayload);
    }
    if (!(await checkPasswordAgainstHash(password, hashedPassword, salt))) {
      const resPayload: ServerPayloadType<string> = {
        payload: "invalid credentials !",
      };
      return res.status(401).json(resPayload);
    }
    const resPayload: ServerPayloadType<string> = { payload: "success!" };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});
