import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { QuizModel } from "../../../../models/v1/quiz.model.js";

export const deleteQuiz= async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { lesson_id: lessonID } = req.params;
  await QuizModel.delete(+lessonID);
  const resPayload: ServerPayloadType<string> = {
    message: "quiz deleted successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  return res.status(204).json(resPayload);
};
