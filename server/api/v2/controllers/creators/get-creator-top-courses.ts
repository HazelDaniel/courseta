import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { CourseModel } from "../../../../models/v1/course.model.js";

export const getCreatorTopCourses = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { user } = req;
  const { creator_id: creatorID } = req.params;
  const resCourses = await CourseModel.getTopCoursesFor(creatorID);
  const resPayload: ServerPayloadType<typeof resCourses> = {
    payload: resCourses,
    message: null,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};
