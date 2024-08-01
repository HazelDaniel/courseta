import express from "express";
export const v1CreatorsRouter = express.Router();

v1CreatorsRouter.get("/:creator_id/courses", (req, res) => {
  return res
    .status(200)
    .json({ message: "welcome to the creator courses route" });
});

v1CreatorsRouter.get("/:creator_id/me", (req, res) => {
  return res
    .status(200)
    .json({ message: "welcome to the creator profile route" });
});

v1CreatorsRouter.get("/:creator_id/me", (req, res) => {
  return res
    .status(200)
    .json({ message: "welcome to the creator profile route" });
});
