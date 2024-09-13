import { randomUUID } from "crypto";
import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { CourseEditPayloadType } from "../../../../client.types";
import { CourseModel } from "../../../../models/v1/course.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";

export const updateCourse = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const creatorID = req.params.creator_id;
  const courseID = req.params.course_id;
  const courseEditPayload: CourseEditPayloadType =
    req.body as CourseEditPayloadType;
  const courseTitle = courseEditPayload.info?.title;
  const courseDescription = courseEditPayload.info?.description;
  const [courseImage, courseThumbnail] = courseEditPayload.images as [
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
  res.status(200).json(resPayload);

  const affectedRoutes = [
    `/api/${API_VERSION}/creators/${creatorID}/courses/top`,
    `/api/${API_VERSION}/courses`,
    `/api/${API_VERSION}/creators/${creatorID}/courses`,
    `/api/${API_VERSION}/creators/${creatorID}/courses/${courseID}/edit`,
    `/api/${API_VERSION}/students/:student_id/courses/recommended`,
    `/api/${API_VERSION}/students/:student_id/courses/unfinished`,
    `/api/${API_VERSION}/students/:student_id/courses`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }
  return;
};
