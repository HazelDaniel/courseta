import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { CourseModel } from "../../../../models/v1/course.model.js";

export const getLessonsForEdit = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { course_id: courseID } = req.params;
  const { user } = req;
  const resData = await CourseModel.getLessonsFor(+courseID, "edit");
  const resPayload: ServerPayloadType<typeof resData> = {
    message: null,
    payload: resData,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};
