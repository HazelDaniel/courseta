import express from "express";
export const v1StudentsRouter = express.Router();

v1StudentsRouter.get("/", (req, res) => {
  return res.status(200).json({ message: "welcome to the students route" });
});
