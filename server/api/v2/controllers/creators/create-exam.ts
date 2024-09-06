import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { ExamCreationPayloadType } from "../../../../client.types";
import { ExamModel } from "../../../../models/v1/exam.model.js";

export const createExam = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { course_id: courseID } = req.params;
  const examCreationPayload: ExamCreationPayloadType =
    req.body as ExamCreationPayloadType;
  const { description, duration, startDate, endDate, passScore } =
    examCreationPayload;
  const currDate = new Date().toISOString();
  const pendingExam = new ExamModel(
    +courseID,
    passScore || 0,
    description || "",
    duration || 0,
    startDate || currDate,
    endDate || currDate
  ); // TODO: make sure that these are passed using validation. do not help the client
  const examID = await pendingExam.save();
  const resPayload: ServerPayloadType<typeof examID> = {
    payload: examID,
    message: "exam creation success!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  return res.status(201).json(resPayload);
};
