import { Request, Response } from "express";
import { ServerPayloadType } from "../../../../types";
import { ExamModel } from "../../../../models/v1/exam.model.js";
import GlobalRouteCache from "express-pubsubcache";
import { API_VERSION } from "../../config.js";

export const deleteExam = async (
  req: Request,
  res: Response<any, Record<string, any>>
) => {
  const { course_id: courseID, creator_id: creatorID } = req.params;
  await ExamModel.delete(+courseID);
  const resPayload: ServerPayloadType<string> = {
    message: "exam deleted successfully!",
    ...(() => (req.user ? ({ user: req.user } as Express.User) : null))(),
  };
  res.status(204).json(resPayload);

  const affectedRoutes = [
    `/api/v${API_VERSION}/courses/${courseID}/assessments/:assessment_id/questions`,
    `/api/v${API_VERSION}/students/:student_id/reports`,
  ];
  for (const route of affectedRoutes) {
    GlobalRouteCache.pub(route);
  }
  return;
};
