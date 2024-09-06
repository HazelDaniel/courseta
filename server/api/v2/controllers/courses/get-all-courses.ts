import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types.js";
import { CourseModel } from "../../../../models/v1/course.model.js";

// SERVICES

export const getAllCourses = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const resCourses = await CourseModel.all();
  const { user } = req;
  const resPayload: ServerPayloadType<typeof resCourses> = {
    payload: resCourses,
    message: null,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};

