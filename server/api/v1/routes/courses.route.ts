import express from "express";
export const v1CoursesRouter = express.Router();

v1CoursesRouter.get("/", (req, res) => {
  return res.status(200).json({ message: "welcome to the courses route" });
});
