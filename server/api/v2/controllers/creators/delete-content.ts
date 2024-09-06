import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { LessonContentModel } from "../../../../models/v1/lesson-content.model.js";

export const deleteContent= async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { lesson_id: lessonID, content_id: contentID } = req.params;
  await LessonContentModel.delete(+lessonID, +contentID);
  const resPayload: ServerPayloadType<string> = {
    message: "content deleted successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  return res.status(204).json(resPayload);
};

