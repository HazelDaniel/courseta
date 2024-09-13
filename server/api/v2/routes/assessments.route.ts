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
import GlobalRouteCache from "express-pubsubcache";
export const v2AssessmentsRouter = express.Router();

v2AssessmentsRouter.use(passport.initialize());

v2AssessmentsRouter.get(
  "/:assessment_id/questions",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res, next) => {
    try {
      if (res.locals.cachedResponse) {
        return res
          .status(res.locals.cachedResponse.statusCode)
          .set(res.locals.cachedResponse.headers)
          .send(res.locals.cachedResponse.body);
      }
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
  }
);

v2AssessmentsRouter.post(
  "/:assessment_id/submit",
  GlobalRouteCache.createCachePublisher(),
  async (req, res, next) => {
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
  }
);
