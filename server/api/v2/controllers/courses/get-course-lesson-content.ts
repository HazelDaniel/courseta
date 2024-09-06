import { Request, Response } from "express";
import type { ServerPayloadType } from "../../../../types";
import { LessonModel } from "../../../../models/v1/lesson.model.js";

export const getCourseLessonContent = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { lesson_id: lessonID } = req.params;
  const { user } = req;
  const resultContents = await LessonModel.getContentsFor(+lessonID);
  const resPayload: ServerPayloadType<typeof resultContents> = {
    payload: resultContents,
    message: null,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};