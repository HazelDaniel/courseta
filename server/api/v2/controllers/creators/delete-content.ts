import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { LessonContentModel } from "../../../../models/v1/lesson-content.model.js";
import GlobalRouteCache from "express-pubsubcache";
import { API_VERSION } from "../../config.js";

export const deleteContent = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const {
    lesson_id: lessonID,
    content_id: contentID,
    creator_id: creatorID,
    course_id: courseID,
  } = req.params;
  await LessonContentModel.delete(+lessonID, +contentID);
  const resPayload: ServerPayloadType<string> = {
    message: "content deleted successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  res.status(204).json(resPayload);

  const affectedRoutes = [
    `/api/v${API_VERSION}/courses/${courseID}/lessons`,
    `/api/v${API_VERSION}/creators/${creatorID}/courses/${courseID}/lessons/edit`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }
  return;
};
