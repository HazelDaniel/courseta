import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { LessonModel } from "../../../../models/v1/lesson.model";

export const deleteLesson = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { lesson_id: lessonID } = req.params;
  await LessonModel.delete(+lessonID);
  const resPayload: ServerPayloadType<string> = {
    message: "lesson deleted successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  return res.status(204).json(resPayload);
};
