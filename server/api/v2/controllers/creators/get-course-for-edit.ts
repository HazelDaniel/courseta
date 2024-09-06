import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { CourseModel } from "../../../../models/v1/course.model.js";

export const getCourseForEdit = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { user } = req;
  const { course_id: courseID } = req.params;
  const resData = await CourseModel.fetchForEdit(+courseID);
  const resPayload: ServerPayloadType<typeof resData> = {
    message: null,
    payload: resData,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};

