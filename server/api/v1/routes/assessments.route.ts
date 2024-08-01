import express from "express";
export const v1AssessmentsRouter = express.Router();

v1AssessmentsRouter.get("/", (req, res) => {
  return res.status(200).json({ message: "welcome to the assessments route" });
});

