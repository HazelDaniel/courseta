import express from "express";
import passport from "passport";
import { ExamModel } from "../../../models/v1/exam.model.js";
import { ServerPayloadType } from "../../../types.js";
export const v1ExamsRouter = express.Router();

v1ExamsRouter.use(passport.initialize());

v1ExamsRouter.get("/:exam_id", async (req, res, next) => {
  try {
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
});

