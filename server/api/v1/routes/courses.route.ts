import { CourseModel } from "../../../models/v1/course.model.js";
import express from "express";
import { ServerPayloadType } from "../../../types.js";
export const v1CoursesRouter = express.Router();

v1CoursesRouter.get("/", async (req, res) => {
  const resCourses = await CourseModel.all();
  const resPayload: ServerPayloadType<typeof resCourses> = {
    payload: resCourses,
    message: null,
  };
  return res.status(200).json(resPayload);
});
