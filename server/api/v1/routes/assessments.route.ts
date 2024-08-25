import express from "express";
import passport from "passport";
import { QuestionModel } from "../../../models/v1/question.model.js";
import { ServerPayloadType } from "../../../types.js";
import { ServerError, log } from "../../../utils.js";
import {
  AssessmentSubmissionPayloadType,
  SessionUserType,
} from "../../../client.types.js";
import { AssessmentModel } from "../../../models/v1/assessment.model.js";
export const v1AssessmentsRouter = express.Router();

v1AssessmentsRouter.use(passport.initialize());

v1AssessmentsRouter.get("/:assessment_id/questions", async (req, res, next) => {
  try {
    const { assessment_id: assessmentID } = req.params;
    const { user } = req;
    const resData = await QuestionModel.getQuestionsFor(assessmentID);
    const resPayload: ServerPayloadType<typeof resData> = {
      message: null,
      payload: resData,
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});

v1AssessmentsRouter.post("/:assessment_id/submit", async (req, res, next) => {
  try {
    const { assessment_id: assessmentID } = req.params;
    const { user } = req;
    if (!(user as SessionUserType).id)
      throw new ServerError("no student id included in the request", 400);
    const { answerList, assessmentType, questionIDList, submissionTime } =
      req.body as AssessmentSubmissionPayloadType;

    await AssessmentModel.submit(
      (user as SessionUserType).id,
      assessmentID,
      questionIDList,
      answerList,
      submissionTime || "",
      assessmentType
    );
    const resPayload: ServerPayloadType<null> = {
      message: "assessment submitted successfully!",
      payload: null,
      ...(() => (user ? ({ user } as Express.User) : null))(),
    };
    return res.status(200).json(resPayload);
  } catch (err) {
    next(err);
  }
});
