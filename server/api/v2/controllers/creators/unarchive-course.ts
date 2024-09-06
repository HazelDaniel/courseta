import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { CourseModel } from "../../../../models/v1/course.model.js";

export const unarchiveCourse = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { creator_id: creatorID, course_id: courseID } = req.params;
  await CourseModel.unarchive(+courseID, creatorID);
  const resPayload: ServerPayloadType<string> = {
    message: "course unarchived successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};
