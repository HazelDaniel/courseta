import { Request, Response } from "express";
import type { ServerPayloadType } from "../../../../types";
import { StudentEnrollPayloadType } from "../../../../client.types";
import { EnrollmentModel } from "../../../../models/v1/enrollment.model.js";

export const unenrollCourse = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
    const { course_id: courseID } = req.params;
    const { user } = req;
    const reviewPayload: StudentEnrollPayloadType =
      req.body as StudentEnrollPayloadType;
    const { studentID } = reviewPayload;
    await EnrollmentModel.delete(
      studentID as string,
      courseID
    );
    const resPayload: ServerPayloadType<null> = {
      payload: null,
      message: "student unenrolled successfully!",
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
};
