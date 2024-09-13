import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { LessonModel } from "../../../../models/v1/lesson.model.js";
import GlobalRouteCache from "express-pubsubcache";
import { API_VERSION } from "../../config.js";

export const deleteLesson = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { lesson_id: lessonID, creator_id: creatorID } = req.params;
  await LessonModel.delete(+lessonID);
  const resPayload: ServerPayloadType<string> = {
    message: "lesson deleted successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  res.status(204).json(resPayload);

  const affectedRoutes = [
    `/api/${API_VERSION}/students/:student_id/courses`,
    `/api/${API_VERSION}/creators/${creatorID}/courses/:course_id`,
    `/api/${API_VERSION}/creators/${creatorID}/courses`,
    `/api/${API_VERSION}/courses`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }
  return;
};
