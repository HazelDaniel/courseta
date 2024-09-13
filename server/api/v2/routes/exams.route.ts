import express from "express";
import passport from "passport";
import { ExamModel } from "../../../models/v1/exam.model.js";
import { ServerPayloadType } from "../../../types.js";
import GlobalRouteCache from "express-pubsubcache";
export const v2ExamsRouter = express.Router();

v2ExamsRouter.use(passport.initialize());

v2ExamsRouter.get(
  "/:exam_id",
  GlobalRouteCache.createCacheSubscriber(),
  async (req, res, next) => {
    try {
      if (res.locals.cachedResponse) {
        return res
          .status(res.locals.cachedResponse.statusCode)
          .set(res.locals.cachedResponse.headers)
          .send(res.locals.cachedResponse.body);
      }
      const { exam_id: assessmentID } = req.params;
      const { user } = req;
      const resData = await ExamModel.search(assessmentID);
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
