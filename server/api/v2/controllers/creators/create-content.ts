import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { LessonContentAdditionPayloadType } from "../../../../client.types";
import { LessonModel } from "../../../../models/v1/lesson.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";

export const createContent = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const {
    lesson_id: lessonID,
    course_id: courseID,
    creator_id: creatorID,
  } = req.params;
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

  const affectedRoutes = [
    `/api/v${API_VERSION}/courses/${courseID}`,
    `/api/v${API_VERSION}/creators/${creatorID}/courses/${courseID}/lessons/edit`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }
  return;
};
