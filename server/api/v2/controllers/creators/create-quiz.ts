import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { LessonModel } from "../../../../models/v1/lesson.model.js";
import { QuizCreationPayloadType } from "../../../../client.types";

export const createQuiz = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { lesson_id: lessonID } = req.params;
  const quizCreationPayload: QuizCreationPayloadType =
    req.body as QuizCreationPayloadType;
  const { quizTitle, description, passScore } = quizCreationPayload;
  const pendingLesson = new LessonModel(
    "",
    undefined,
    undefined,
    undefined,
    +lessonID
  );
  const resID = await pendingLesson.addQuiz(
    quizTitle,
    description || "",
    passScore || 0
  );
  const resPayload: ServerPayloadType<typeof resID> = {
    payload: resID,
    message: "quiz creation success!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  return res.status(201).json(resPayload);
};
