import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { LessonModel } from "../../../../models/v1/lesson.model.js";
import { QuizModel } from "../../../../models/v1/quiz.model.js";
import { LessonContentModel } from "../../../../models/v1/lesson-content.model.js";
import { LessonAdditionPayloadType } from "../../../../client.types";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";

export const createLesson = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
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
    for (let j = 0; j < lessonAdditionpayload.lessonContentData.length; j++) {
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
      const { description, lessonPositionID, passScore, quizTitle } = quizEl;
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
  res.status(201).json(resPayload);

  const affectedRoutes = [
    `/api/${API_VERSION}/courses/${courseID}`,
    `/api/${API_VERSION}/creators/${creatorID}/courses/${courseID}/lessons/edit`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }
  return;
};
