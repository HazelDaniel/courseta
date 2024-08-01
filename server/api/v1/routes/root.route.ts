import express, { NextFunction, Request, Response } from "express";
export const v1Router = express.Router();

v1Router.use((req, res, next) => {
  console.log(`[${req.method}]: ${req.baseUrl}${req.url}`);
  next();
});

v1Router.get("/courses", (req, res) => {
  return res.status(200).json({ message: "welcome to the courses route" });
});

v1Router.get("/creators/:creator_id/courses", (req, res) => {
  return res
    .status(200)
    .json({ message: "welcome to the creator courses route" });
});

v1Router.get("/creators/:creator_id/me", (req, res) => {
  return res
    .status(200)
    .json({ message: "welcome to the creator profile route" });
});

v1Router.get("/creators/:creator_id/me", (req, res) => {
  return res
    .status(200)
    .json({ message: "welcome to the creator profile route" });
});

v1Router.get("/", (req, res) => {
  return res.status(200).json({ message: "welcome" });
});

v1Router.get("/*", (req, res) => {
  return res.status(404).json({ message: "endpoint not found" });
});

v1Router.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  res.status(500).json({ message: `internal server error: ${err.message}` });
});
