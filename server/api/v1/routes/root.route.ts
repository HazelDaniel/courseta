import { v1AssessmentsRouter } from "./assessments.route.js";
import { v1StudentsRouter } from "./students.route.js";
import { v1CoursesRouter } from "./courses.route.js";
import { v1CreatorsRouter } from "./creators.route.js";
import express, { NextFunction, Request, Response } from "express";

export const v1Router = express.Router();

v1Router.use("/creators", v1CreatorsRouter);
v1Router.use("/courses", v1CoursesRouter);
v1Router.use("/students", v1StudentsRouter);
v1Router.use("/assessments", v1AssessmentsRouter);

v1Router.use(async (req, res, next) => {
  console.log(`[${req.method}]: ${req.baseUrl}${req.url}`);
  next();
});

v1Router.get("/", async (req, res, next) => {
  try {
    return res.status(200).json({ message: "welcome" });
  } catch (err) {
    next(err);
  }
});

v1Router.get("/*", (req, res) => {
  return res.status(404).json({ message: "endpoint not found" });
});

v1Router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: `internal server error: ${err.message}` });
});
