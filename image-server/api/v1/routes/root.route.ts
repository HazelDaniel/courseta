import { v1ImagesRouter } from "./images.route.js";
import { ErrorBoundary } from "../middlewares/error.middleware.js";
import express, { NextFunction, Request, Response } from "express";

export const v1Router = express.Router();

v1Router.use(async (req, res, next) => {
  console.log(
    `[${req.method}] TO: ${req.baseUrl}${
      req.url
    }, AT: ${new Date().toString()}, FROM: ${req.ip}`
  );
  next();
});

v1Router.use("/images", v1ImagesRouter);

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

v1Router.use(ErrorBoundary);
