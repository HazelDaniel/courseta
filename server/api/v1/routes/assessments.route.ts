import express from "express";
import { serializeDeserializeUser } from "../middlewares/auth.middleware.js";
import passport from "passport";
export const v1AssessmentsRouter = express.Router();

v1AssessmentsRouter.use(passport.initialize());
v1AssessmentsRouter.use(serializeDeserializeUser);

v1AssessmentsRouter.get("/", (req, res) => {
  return res.status(200).json({ message: "welcome to the assessments route" });
});
