import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { QuizModel } from "../../../../models/v1/quiz.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";

export const deleteQuiz = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const {
    lesson_id: lessonID,
    creator_id: creatorID,
    course_id: courseID,
  } = req.params;
  await QuizModel.delete(+lessonID);
  const resPayload: ServerPayloadType<string> = {
    message: "quiz deleted successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  res.status(204).json(resPayload);

  const affectedRoutes = [
    `/api/v${API_VERSION}/courses/${courseID}/lessons`,
    `/api/v${API_VERSION}/students/:student_id/reports`,
    `/api/v${API_VERSION}/creators/${creatorID}/courses/${courseID}/lessons/edit`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }
  return;
};
