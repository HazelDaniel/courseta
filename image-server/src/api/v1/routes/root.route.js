var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v1ImagesRouter } from "./images.route.js";
import { ErrorBoundary } from "../middlewares/error.middleware.js";
import express from "express";
export const v1Router = express.Router();
v1Router.use((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`[${req.method}] TO: ${req.baseUrl}${req.url}, AT: ${new Date().toString()}, FROM: ${req.ip}`);
    next();
}));
v1Router.use("/images", v1ImagesRouter);
v1Router.get("/", (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        return res.status(200).json({ message: "welcome" });
    }
    catch (err) {
        next(err);
    }
}));
v1Router.get("/*", (req, res) => {
    return res.status(404).json({ message: "endpoint not found" });
});
v1Router.use(ErrorBoundary);
