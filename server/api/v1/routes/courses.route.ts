import { CourseModel } from "../../../models/v1/course.model.js";
import express from "express";
export const v1CoursesRouter = express.Router();

v1CoursesRouter.get("/", async (req, res) => {
  const resCourses = await CourseModel.all();
  return res.status(200).json(resCourses);
});

