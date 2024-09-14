import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { CourseModel } from "../../../../models/v1/course.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";

export const archiveCourse = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { creator_id: creatorID, course_id: courseID } = req.params;
  await CourseModel.archive(+courseID, creatorID);
  const resPayload: ServerPayloadType<string> = {
    message: "course archived successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  res.status(204).json(resPayload);

  const affectedRoutes = [
    `/api/v${API_VERSION}/creators/${creatorID}/courses`,
    `/api/v${API_VERSION}/students/:student_id/courses/recommended`,
    `/api/v${API_VERSION}/students/:student_id/courses/unfinished`,
    `/api/v${API_VERSION}/students/:student_id/courses`,
    `/api/v${API_VERSION}/creators/${creatorID}/courses`,
    `/api/v${API_VERSION}/courses`,
    `/api/v${API_VERSION}/courses/${courseID}/reviews`,
    `/api/v${API_VERSION}/courses/${courseID}/lessons`,
    `/api/v${API_VERSION}/courses/${courseID}/exams/:exam_id`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }
  return;
};
