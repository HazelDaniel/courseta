import { Request, Response } from "express";
import type { ServerPayloadType } from "../../../../types";
import { ExamModel } from "../../../../models/v1/exam.model.js";

export const getCourseExam = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { exam_id: assessmentID } = req.params;
  const { user } = req;
  const resultAssessment = await ExamModel.search(assessmentID, "edit");
  const resPayload: ServerPayloadType<typeof resultAssessment> = {
    payload: resultAssessment,
    message: null,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};