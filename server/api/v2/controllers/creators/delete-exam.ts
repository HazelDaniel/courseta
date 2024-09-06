import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { ExamModel } from "../../../../models/v1/exam.model.js";

export const deleteExam = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { course_id: courseID } = req.params;
  await ExamModel.delete(+courseID);
  const resPayload: ServerPayloadType<string> = {
    message: "exam deleted successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  return res.status(204).json(resPayload);
};
