import { Request, Response } from "express";
import type { ServerPayloadType } from "../../../../types";
import { StudentEnrollPayloadType } from "../../../../client.types";
import { EnrollmentModel } from "../../../../models/v1/enrollment.model.js";
import { API_VERSION } from "../../config.js";
import GlobalRouteCache from "express-pubsubcache";

export const enrollCourse = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const enrollPayload: StudentEnrollPayloadType =
      req.body as StudentEnrollPayloadType;
    const { studentID } = enrollPayload;
    const enrollment = new EnrollmentModel(studentID as string, courseID);
    await enrollment.save();
    const resPayload: ServerPayloadType<null> = {
      payload: null,
      message: "student enrolled successfully!",
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    res.status(200).json(resPayload);

  const affectedRoutes = [
    `/api/${API_VERSION}/students/${studentID}/courses/unfinished`,
    `/api/${API_VERSION}/students/${studentID}/courses/recommended`,
    `/api/${API_VERSION}/students/${studentID}/me`,
    `/api/${API_VERSION}/students/${studentID}/courses`,
    `/api/${API_VERSION}/creators/:creator_id/courses/top`,
    `/api/${API_VERSION}/courses/:course_id/creator/summary`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }
  return;
};

