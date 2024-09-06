import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { AssessmentModel } from "../../../../models/v1/assessment.model.js";

export const getAssessmentForEdit = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { assessment_id: assessmentID } = req.params;
  const { user } = req;
  const resData = await AssessmentModel.fetchForCourseEdit(assessmentID);
  const resPayload: ServerPayloadType<typeof resData> = {
    message: null,
    payload: resData,
    ...(() => (user ? ({ user } as Express.User) : null))(),
  };
  return res.status(200).json(resPayload);
};