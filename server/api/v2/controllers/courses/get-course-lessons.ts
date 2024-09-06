import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types.js";
import { CourseModel } from "../../../../models/v1/course.model.js";

export const getCourseLessons = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { course_id: courseID } = req.params;
  const { user } = req;
  const resLessons = await CourseModel.getLessonsFor(+courseID, "read");
  const resPayload: ServerPayloadType<typeof resLessons> = {
    payload: resLessons,
    message: null,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};
