import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { CourseModel } from "../../../../models/v1/course.model.js";
import GlobalRouteCache from "express-pubsubcache";
import { API_VERSION } from "../../config.js";

export const deleteCourse = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { creator_id: creatorID, course_id: courseID } = req.params;
  await CourseModel.delete(+courseID, creatorID);
  const resPayload: ServerPayloadType<string> = {
    message: "course deleted successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  res.status(204).json(resPayload);

  const affectedRoutes = [
    `/api/${API_VERSION}/students/:student_id/courses/recommended`,
    `/api/${API_VERSION}/students/:student_id/courses/unfinished`,
    `/api/${API_VERSION}/students/:student_id/courses`,
    `/api/${API_VERSION}/creators/${creatorID}/me`,
    `/api/${API_VERSION}/creators/${creatorID}/courses/top`,
    `/api/${API_VERSION}/creators/${creatorID}/courses`,
    `/api/${API_VERSION}/creators/${creatorID}/courses/${courseID}/edit`,
    `/api/${API_VERSION}/courses`,
    `/api/${API_VERSION}/courses/${courseID}/reviews`,
    `/api/${API_VERSION}/courses/${courseID}/creator/summary`,
    `/api/${API_VERSION}/courses/${courseID}/creator/summary`,
    `/api/${API_VERSION}/courses/${courseID}/lessons`,
    `/api/${API_VERSION}/courses/${courseID}/exams/:exam_id`,
    `/api/${API_VERSION}/students/:student_id/reports`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }

  return;
};
