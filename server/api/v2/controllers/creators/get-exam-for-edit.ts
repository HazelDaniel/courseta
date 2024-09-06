import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { ExamModel } from "../../../../models/v1/exam.model.js";

export const getExamForEdit = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { course_id: courseID } = req.params;
  const { user } = req;
  const resData = await ExamModel.fetchForEdit(+courseID);
  const resPayload: ServerPayloadType<typeof resData> = {
    message: null,
    payload: resData,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);

};
