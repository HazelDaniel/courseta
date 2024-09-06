import { Request, Response } from "express";
import type { ServerPayloadType } from "../../../../types";
import { QuizModel } from "../../../../models/v1/quiz.model.js";

export const getCourseLessonQuiz = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { quiz_id: assessmentID } = req.params;
  const { user } = req;
  const resultAssessment = await QuizModel.search(assessmentID);
  const resPayload: ServerPayloadType<typeof resultAssessment> = {
    payload: resultAssessment,
    message: null,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};
