import express from "express";
import passport from "passport";
import { QuizModel } from "../../../models/v1/quiz.model.js";
import { ServerPayloadType } from "../../../types.js";
export const v2QuizzesRouter = express.Router();

v2QuizzesRouter.use(passport.initialize());

v2QuizzesRouter.get("/:quiz_id", async (req, res, next) => {
  try {
    const { quiz_id: assessmentID } = req.params;
    const { user } = req;
    const resData = await QuizModel.search(assessmentID);
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
