import { Request, Response } from "express";
import type { CourseDetailViewType, ServerPayloadType } from "../../../../types";
import { CourseModel } from "../../../../models/v1/course.model.js";
import { SessionUserType } from "../../../../client.types.js";
import { EnrollmentModel } from "../../../../models/v1/enrollment.model.js";

export const getCourse = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { course_id: courseID } = req.params;
  const { user } = req;
  const resCoursePromise = CourseModel.search(+courseID);
  const studentEnrollmentStatus = EnrollmentModel.confirmEnrollment(
    (req.user as SessionUserType)?.id || "",
    courseID
  );
  const resPromises = await Promise.all([
    resCoursePromise,
    studentEnrollmentStatus,
  ]);
  const status: boolean = resPromises[1];

  const resPayload: ServerPayloadType<(typeof resPromises)[0]["detail"]> = {
    payload: {
      ...resPromises[0].detail,
      isEnrolled: status,
    } as CourseDetailViewType,
    message: null,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};

